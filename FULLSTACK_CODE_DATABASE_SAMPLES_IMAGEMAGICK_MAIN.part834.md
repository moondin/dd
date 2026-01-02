---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 834
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 834 of 851)

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

---[FILE: Exception.html]---
Location: ImageMagick-main/www/Magick++/Exception.html

```text
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Magick++ API: Exceptions </title>
<link rel="stylesheet" href="magick.css" type="text/css" />
</head>
<body>
<div class="doc-section">
<h1 align="center">Magick::Exception Classes</h1>
<p><i>Exception</i> represents the base class of objects thrown when
Magick++reports an error. Magick++ throws C++ exceptions synchronous
with the operation where the error occurred. This allows errors to be
trapped within the enclosing code (perhaps the code to process a
single image) while allowing the code to be written with a simple
coding style.</p>
<p>A try/catch block should be placed around any sequence of
operations which can be considered an important body of work. For
example, if your program processes lists of images and some of these
images may be defective, by placing the try/catch block around the
entire sequence of code that processes one image (including
instantiating the image object), you can minimize the overhead of
error checking while ensuring that all objects created to deal with
that object are safely destroyed (C++ exceptions unroll the stack
until the enclosing try block, destroying any created objects). 
</p>
<p>The pseudo code for the main loop of your program may look like: 
</p>
<div class="viewport">
using namespace std;
for infile in list
{
  try {
    // Construct an image instance first so that we don't have to worry
    // about object construction failure due to a minor warning exception
    // being thrown.
    Magick::Image image; 
    try {
      // Try reading image file
      image.read(infile);
    }
    catch( Magick::WarningCoder &amp;warning )
    {
      // Process coder warning while loading file (e.g. TIFF warning)
      // Maybe the user will be interested in these warnings (or not).
      // If a warning is produced while loading an image, the image
      // can normally still be used (but not if the warning was about
      // something important!)
      cerr &lt;&lt; "Coder Warning: " &lt;&lt; warning.what() &lt;&lt; endl;
    }
    catch( Magick::Warning &amp;warning )
    {
      // Handle any other Magick++ warning.
      cerr &lt;&lt; "Warning: " &lt;&lt; warning.what() &lt;&lt; endl;
    }
    catch( Magick::ErrorFileOpen &amp;error ) 
    { 
      // Process Magick++ file open error
      cerr &lt;&lt; "Error: " &lt;&lt; error.what() &lt;&lt; endl;
      continue; // Try next image.
    }
    try {
      image.rotate(90);
      image.write("outfile");
    }
    catch ( MagickExeption &amp; error)
    {
       // Handle problem while rotating or writing outfile.
       cerr &lt;&lt; "Caught Magick++ exception: " &lt;&lt; error.what() &lt;&lt; endl;
    }
  }
  catch( std::exception &amp; error ) 
  { 
     // Process any other exceptions derived from standard C++ exception
     cerr &lt;&lt; "Caught C++ STD exception: " &lt;&lt; error.what() &lt;&lt; endl;
  } 
  catch( ... ) 
  { 
    // Process *any* exception (last-ditch effort). There is not a lot
    // you can do here other to retry the operation that failed, or exit
  }
}
</div>
<p>The desired location and number of try/catch blocks in your program
depends how sophisticated its error handling must be. Very simple
programs may use just one try/catch block.</p>
<p>The <i>Exception</i> class is derived from the C++ standard
exception class. This means that it contains a C++ string containing
additional information about the error (e.g to display to the user).
Obtain access to this string via the what() method.&#160; For
example: 
</p>
<pre class="code">
catch( Exception &amp; error_ ) 
    { 
      cout &lt;&lt; "Caught exception: " &lt;&lt; error_.what() &lt;&lt; endl; 
    }
</pre>
<p>The classes <i>Warning</i> and <i>Error</i> derive from the
<i>Exception</i> class. Exceptions derived from <i>Warning</i> are
thrown to represent non-fatal errors which may effect the
completeness or quality of the result (e.g. one image provided as an
argument to montage is defective). In most cases, a <i>Warning</i>
exception may be ignored by catching it immediately, processing it
(e.g. printing a diagnostic) and continuing on. Exceptions derived
from <i>Error</i> are thrown to represent fatal errors that can not
produce a valid result (e.g. attempting to read a file which does not
exist). 
</p>
<p style="margin-bottom: 0in">The specific derived exception classes
are shown in the following tables: 
</p>
<p align="center" style="margin-bottom: 0in"><b>Warning Sub-Classes</b></p>
<ul><table width="100%" border="1" cellpadding="2" cellspacing="3">
	<col width="70*" />
	<col width="186*" />
	<tr>
		<td width="27%">
			<p align="center"><font size="2"><b>Warning</b></font></p>
		</td>
		<td width="73%">
			<p align="center"><font size="2"><b>Warning Description</b></font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningUndefined</font></p>
		</td>
		<td width="73%">
			<p><font size="2">Unspecified warning type.</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningBlob</font></p>
		</td>
		<td width="73%">
			<p style="font-weight: medium; text-decoration: none"><font size="2">NOT
			CURRENTLY USED</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningCache</font></p>
		</td>
		<td width="73%">
			<p style="font-weight: medium; text-decoration: none"><font size="2">NOT
			CURRENTLY USED</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningCoder</font></p>
		</td>
		<td width="73%">
			<p><font size="2">Warnings issued by some coders.</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningConfigure</font></p>
		</td>
		<td width="73%">
			<p style="font-weight: medium; text-decoration: none"><font size="2">NOT
			CURRENTLY USED</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningCorruptImage</font></p>
		</td>
		<td width="73%">
			<p><font size="2">Warning issued when an image is determined to be
			corrupt.</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningDelegate</font></p>
		</td>
		<td width="73%">
			<p><font size="2">Warnings reported by the delegate (interface to
			external programs) subsystem.</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningDraw</font></p>
		</td>
		<td width="73%">
			<p><font size="2">Warnings reported by the rendering subsystem.</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningFileOpen</font></p>
		</td>
		<td width="73%">
			<p><font size="2">Warning reported when The image file could not be
			opened (permission problem, wrong file type, or does not exist).</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningImage</font></p>
		</td>
		<td width="73%">
			<p style="font-weight: medium"><font size="2">NOT CURRENTLY USED</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningMissingDelegate</font></p>
		</td>
		<td width="73%">
			<p style="font-weight: medium"><font size="2">NOT CURRENTLY USED</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningModule</font></p>
		</td>
		<td width="73%">
			<p style="font-weight: medium"><font size="2">NOT CURRENTLY USED</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningMonitor</font></p>
		</td>
		<td width="73%">
			<p style="font-weight: medium"><font size="2">NOT CURRENTLY USED</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningOption</font></p>
		</td>
		<td width="73%">
			<p><font size="2">Warning reported when an option is malformed or
			out of range.</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningRegistry</font></p>
		</td>
		<td width="73%">
			<p style="font-weight: medium"><font size="2">NOT CURRENTLY USED</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningResourceLimit</font></p>
		</td>
		<td width="73%">
			<p><font size="2">Warning reported when a program resource is
			exhausted (e.g. not enough memory).</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningStream</font></p>
		</td>
		<td width="73%">
			<p style="font-weight: medium"><font size="2">NOT CURRENTLY USED</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningType</font></p>
		</td>
		<td width="73%">
			<p style="font-weight: medium"><font size="2">NOT CURRENTLY USED</font></p>
		</td>
	</tr>
	<tr>
		<td width="27%">
			<p align="center"><font size="2">WarningXServer</font></p>
		</td>
		<td width="73%">
			<p><font size="2">Warnings reported by the X11 subsystem.</font></p>
		</td>
	</tr>
</table></ul>
<p style="margin-bottom: 0in"><br />
</p>
<p align="center" style="margin-bottom: 0in"><b>Error Sub-Classes</b></p>
<ul><table width="100%" border="1" cellpadding="2" cellspacing="3">
	<col width="71*" />
	<col width="185*" />
	<tr>
		<td width="28%">
			<p align="center"><font size="2"><b>Error</b></font></p>
		</td>
		<td width="72%">
			<p align="center"><font size="2"><b>Error Description</b></font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorUndefined</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Unspecified error type.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorBlob</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Error reported by BLOB I/O subsystem.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorCache</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Error reported by the pixel cache subsystem.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorCoder</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Error reported by coders (image format support).</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorConfigure</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Errors reported while loading configuration files.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorCorruptImage</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Error reported when the image file is corrupt.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorDelegate</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Errors reported by the delegate (interface to
			external programs) subsystem.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorDraw</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Error reported while drawing on image.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorFileOpen</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Error reported when the image file can not be
			opened.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorImage</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Errors reported while drawing.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorMissingDelegate</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Error reported when an add-on library or program
			is necessary in order to support the requested operation.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorModule</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Errors reported by the module loader subsystem.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorMonitor</font></p>
		</td>
		<td width="72%">
			<p style="font-weight: medium"><font size="2">NOT CURRENTLY USED</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorOption</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Error reported when an option is malformed or out
			of range.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorRegistry</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Errors reported by the image/BLOB registry
			subsystem.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorResourceLimit</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Error reported when a program resource is
			exhausted (e.g. not enough memory).</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorStream</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Errors reported by the pixel stream subsystem.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorType</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Errors reported by the type (font) rendering
			subsystem.</font></p>
		</td>
	</tr>
	<tr>
		<td width="28%">
			<p align="center"><font size="2">ErrorXServer</font></p>
		</td>
		<td width="72%">
			<p><font size="2">Errors reported by the X11 subsystem.</font></p>
		</td>
	</tr>
</table></ul>
<p><br /><br />
</p>
</div>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: FormatCharacters.html]---
Location: ImageMagick-main/www/Magick++/FormatCharacters.html

```text
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Magick++ API: Annotating an Image</title>
<link rel="stylesheet" href="magick.css" type="text/css" />
</head>
<body>
<div class="doc-section">
<h1 align="center">Special Format Characters</h1>
<p style="margin-bottom: 0cm">The Magick::Image methods <a href="Image++.html#annotate"><i>annotate</i></a>, <a href="Image++.html#draw"><i>draw</i></a>, <a href="Image++.html#label"><i>label</i></a>, and the template function <i>montageImages</i> support special format characters contained in the argument text. These format characters work similar to C's <i>printf</i>. Whenever a format character appears in the text, it is replaced with the equivalent attribute text. The available format characters are shown in the following table.</p>
<br />
<p align="center" style="margin-bottom: 0cm"><b>Format Characters</b></p>
<center>
<table width="50%" border="1" cellpadding="2" cellspacing="3">
<col width="131*" />
<col width="125*" />
<tr>
<td width="51%">
<p align="center"><b>Format Character</b></p></td>
<td width="49%">
<p align="center"><b>Description</b></p></td></tr>
<tr>
<td width="51%">
<p align="center">%b</p></td>
<td width="49%">
<p>file size</p></td></tr>
<tr>
<td width="51%">
<p align="center">%d</p></td>
<td width="49%">
<p>directory</p></td></tr>
<tr>
<td width="51%">
<p align="center">%e</p></td>
<td width="49%">
<p>filename extension</p></td></tr>
<tr>
<td width="51%">
<p align="center">%f</p></td>
<td width="49%">
<p>filename</p></td></tr>
<tr>
<td width="51%">
<p align="center">%h</p></td>
<td width="49%">
<p>height</p></td></tr>
<tr>
<td width="51%">
<p align="center">%m</p></td>
<td width="49%">
<p>magick (e.g GIF)</p></td></tr>
<tr>
<td width="51%">
<p align="center">%p</p></td>
<td width="49%">
<p>page number</p></td></tr>
<tr>
<td width="51%">
<p align="center">%s</p></td>
<td width="49%">
<p>scene number</p></td></tr>
<tr>
<td width="51%">
<p align="center">%t</p></td>
<td width="49%">
<p>top of filename</p></td></tr>
<tr>
<td width="51%">
<p align="center">%w</p></td>
<td width="49%">
<p>width</p></td></tr>
<tr>
<td width="51%">
<p align="center">%x</p></td>
<td width="49%">
<p>x resolution</p></td></tr>
<tr>
<td width="51%">
<p align="center">%y</p></td>
<td width="49%">
<p>y resolution</p></td></tr>
<tr>
<td width="51%">
<p align="center">\n</p></td>
<td width="49%">
<p>newline</p></td></tr>
<tr>
<td width="51%">
<p align="center">\r</p></td>
<td width="49%">
<p>carriage return</p></td></tr></table></center>
</div>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: Future.html]---
Location: ImageMagick-main/www/Magick++/Future.html

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

---[FILE: Geometry.html]---
Location: ImageMagick-main/www/Magick++/Geometry.html

```text
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Magick++ API: Geometry</title>
<link rel="stylesheet" href="magick.css" type="text/css" />
</head>
<body>
<div class="doc-section">
<h1 align="center">Magick::Geometry</h1>
<p>Geometry provides a convenient means to specify a geometry
argument. The object may be initialized from a C string or C++ string
containing a geometry specification. It may also be initialized by
more efficient parameterized constructors. 
</p>
<h3><a name="GeometrySpecifications"></a>Geometry
Specifications</h3>
<p>Geometry specifications are in the form
<kbd>&quot;&lt;width&gt;x&lt;height&gt;{+-}&lt;xoffset&gt;{+-}&lt;yoffset&gt;&quot;</kbd>
(where <i>width</i>, <i>height</i>, <i>xoffset</i>, and <i>yoffset</i>
are numbers) for specifying the size and placement location for an
object. 
</p>
<p style="margin-bottom: 0in">The <i>width</i> and <i>height</i>
parts of the geometry specification are measured in pixels. The
<i>xoffset</i> and <i>yoffset</i> parts are also measured in pixels
and are used to specify the distance of the placement coordinate from
the left and top and edges of the image, respectively. Both types of
offsets are measured from the indicated edge of the object to the
corresponding edge of the image. The X offset may be specified in the
following ways: 
</p>
	<table width="90%" border="1" cellpadding="2" cellspacing="3">
		<col width="21*" />
		<col width="235*" />
		<tr>
			<td width="8%">
				<p>+<i>xoffset</i></p>
			</td>
			<td width="92%">
				<p>The left edge of the object is to be placed <i>xoffset</i>
				pixels in from the <em>left edge </em>of the image.</p>
			</td>
		</tr>
		<tr>
			<td width="8%">
				<p>-<i>xoffset</i></p>
			</td>
			<td width="92%">
				<p>The left edge of the object is to be placed outside the image,
				<i>xoffset</i> pixels out from the <em>left edge </em>of the image.</p>
			</td>
		</tr>
	</table>
<p style="margin-bottom: 0in">The Y offset has similar meanings: 
</p>
	<table width="90%" border="1" cellpadding="2" cellspacing="3">
		<col width="27*" />
		<col width="229*" />
		<tr>
			<td width="11%">
				<p>+<i>yoffset</i></p>
			</td>
			<td width="89%">
				<p>The top edge of the object is to be <i>yoffset</i> pixels
				<em>below</em> the <em>top edge </em>of the image.</p>
			</td>
		</tr>
		<tr>
			<td width="11%">
				<p>-<i>yoffset</i></p>
			</td>
			<td width="89%">
				<p>The top edge of the object is to be <i>yoffset</i> pixels
				<em>above</em> the <em>top edge</em> of the image.</p>
			</td>
		</tr>
	</table>
<p>Offsets must be given as pairs; in other words, in order to
specify either <i>xoffset</i> or <i>yoffset</i> both must be present.
</p>
<h3><a name="ExtendedGeometrySpecifications"></a>ImageMagick
Extensions To Geometry Specifications</h3>
<p style="margin-bottom: 0in">ImageMagick has added a number of
qualifiers to the standard geometry string for use when resizing
images. The form of an extended geometry string is
&quot;<kbd>&lt;width&gt;x&lt;height&gt;{+-}&lt;xoffset&gt;{+-}&lt;yoffset&gt;{%}{!}{&lt;}{&gt;}&quot;</kbd>.
Extended geometry strings should <em>only</em> be used <em>when resizing
an image</em>. Using an extended geometry string for other
applications may cause the API call to fail. The available
qualifiers are shown in the following table: 
</p>
<p align="center" STYLE="margin-bottom: 0in"><b>ImageMagick Geometry
Qualifiers</b></p>
	<table width="90%" border="1" cellpadding="2" cellspacing="3">
		<col width="36*" />
		<col width="220*" />
		<tr>
			<td width="14%">
				<p align="center"><b>Qualifier</b></p>
			</td>
			<td width="86%">
				<p align="center"><b>Description</b></p>
			</td>
		</tr>
		<tr>
			<td width="14%">
				<p align="center"><b>%</b></p>
			</td>
			<td width="86%">
				<p>Interpret width and height as a <b>percentage</b> of the
				current size.</p>
			</td>
		</tr>
		<tr>
			<td width="14%">
				<p align="center"><b>!</b></p>
			</td>
			<td width="86%">
				<p>Resize to width and height <b>exactly</b>, loosing original
				aspect ratio.</p>
			</td>
		</tr>
		<tr>
			<td width="14%">
				<p align="center"><b>&lt;</b></p>
			</td>
			<td width="86%">
				<p>Resize only if the image is <b>smaller</b> than the geometry
				specification.</p>
			</td>
		</tr>
		<tr>
			<td width="14%">
				<p align="center"><b>&gt;</b></p>
			</td>
			<td width="86%">
				<p>Resize only if the image is <b>greater</b> than the geometry
				specification.</p>
			</td>
		</tr>
	</table>
<h3><a name="PostscriptPageSize"></a>Postscript Page Size Extension
To Geometry Specifications</h3>
<p>Any geometry string specification supplied to the Geometry
constructor is considered to be a Postscript page size nickname if
the first character is not numeric. The Geometry constructor converts
these page size specifications into the equivalent numeric geometry
string specification (preserving any offset component) prior to
conversion to the internal object format. Postscript page size
specifications are short-hand for the pixel geometry required to fill
a page of that size. Since the 11x17 inch page size used in the US
starts with a digit, it is not supported as a Postscript page size
nickname. Instead, substitute the geometry specification &quot;<kbd>792x1224&gt;&quot;</kbd>
when 11x17 output is desired. 
</p>
<p style="margin-bottom: 0in">An example of a Postscript page size
specification is <kbd>&quot;letter+43+43&gt;&quot;</kbd>. 
</p>
<p align="center" style="margin-bottom: 0in"><b>Postscript Page Size
Nicknames</b></p>
	<table width="70%" border="1" cellpadding="2" cellspacing="3">
		<col width="105*" />
		<col width="151*" />
		<tr>
			<td width="41%">
				<p align="center"><b>Postscript Page Size Nickname</b></p>
			</td>
			<td width="59%">
				<p align="center"><b>Equivalent Extended Geometry Specification</b></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">Ledger</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">1224x792&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">Legal</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">612x1008&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">Letter</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">612x792&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">LetterSmall</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">612x792&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">ArchE</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">2592x3456&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">ArchD</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">1728x2592&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">ArchC</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">1296x1728&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">ArchB</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">864x1296&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">ArchA</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">648x864&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">A0</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">2380x3368&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">A1</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">1684x2380&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">A2</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">1190x1684&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">A3</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">842x1190&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">A4</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">595x842&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">A4Small</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">595x842&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">A5</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">421x595&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">A6</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">297x421&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">A7</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">210x297&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">A8</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">148x210&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">A9</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">105x148&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">A10</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">74x105&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">B0</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">2836x4008&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">B1</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">2004x2836&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">B2</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">1418x2004&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">B3</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">1002x1418&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">B4</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">709x1002&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">B5</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">501x709&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">C0</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">2600x3677&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">C1</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">1837x2600&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">C2</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">1298x1837&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">C3</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">918x1298&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">C4</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">649x918&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">C5</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">459x649&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">C6</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">323x459&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">Flsa</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">612x936&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">Flse</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">612x936&gt;</font></p>
			</td>
		</tr>
		<tr>
			<td width="41%">
				<p align="center"><font size="2">HalfLetter</font></p>
			</td>
			<td width="59%">
				<p align="center"><font size="2">396x612&gt;</font></p>
			</td>
		</tr>
	</table>
<H3 align="center">Geometry Methods</H3>
<p style="margin-bottom: 0in">Geometry provides methods to initialize
its value from strings, from a set of parameters, or via attributes.
The methods available for use in Geometry are shown in the following
table: 
</p>
<p align="center" style="margin-bottom: 0in"><b>Geometry Methods</b></p>
<table width="100%" border="1" cellpadding="2" cellspacing="3">
	<col width="25*" />
	<col width="26*" />
	<col width="111*" />
	<col width="94*" />
	<tr>
		<td width="10%">
			<p align="center"><b>Method</b></p>
		</td>
		<td width="10%">
			<p align="center"><b>Return Type</b></p>
		</td>
		<td width="44%">
			<p align="center"><b>Signature(s)</b></p>
		</td>
		<td width="37%">
			<p align="center"><b>Description</b></p>
		</td>
	</tr>
	<tr>
		<td rowspan="6" width="10%"> 
			<p>Geometry</p>
		</td>
		<td rowspan="6" width="10%" bgcolor="#666666">
			<p>&#160;</p>
		</td>
		<td width="44%">
			<p></p>
		</td>
		<td width="37%">
			<p>Default constructor</p>
		</td>
	</tr>
	<tr>
		<td width="44%">
			<p>const char *geometry_</p>
		</td>
		<td width="37%">
			<p>Construct geometry from C string</p>
		</td>
	</tr>
	<tr>
		<td width="44%">
			<p>const Geometry &geometry_</p>
		</td>
		<td width="37%">
			<p>Copy constructor</p>
		</td>
	</tr>
	<tr>
		<td width="44%">
			<p>const std::string &geometry_</p>
		</td>
		<td width="37%">
			<p>Construct geometry from C++ string</p>
		</td>
	</tr>
	<tr>
		<td width="44%">
			<p>size_t width_, size_t height_, ssize_t xOff_=0, ssize_t yOff_=0</p>
		</td>
		<td width="37%">
			<p>Construct geometry via explicit parameters</p>
		</td>
	</tr>
	<tr>
		<td width="44%">
			<p>const MagickCore::RectangleInfo &rectangle_</p>
		</td>
		<td width="37%">
			<p>Construct from RectangleInfo (for Magick++ use only)</p>
		</td>
	</tr>
	<tr>
		<td rowspan="2" width="10%">
			<p>width</p>
		</td>
		<td width="10%">
			<p>void</p>
		</td>
		<td width="44%">
			<p>size_t width_</p>
		</td>
		<td rowspan="2" width="37%">
			<p>Width</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>size_t</p>
		</td>
		<td width="44%">
			<p>void</p>
		</td>
	</tr>
	<tr>
		<td rowspan="2" width="10%">
			<p>height</p>
		</td>
		<td width="10%">
			<p>void</p>
		</td>
		<td width="44%">
			<p>size_t height_</p>
		</td>
		<td rowspan="2" width="37%">
			<p>Height</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>size_t</p>
		</td>
		<td width="44%">
			<p>void</p>
		</td>
	</tr>
	<tr>
		<td rowspan="2" width="10%">
			<p>xOff</p>
		</td>
		<td width="10%">
			<p>void</p>
		</td>
		<td width="44%">
			<p>ssize_t xOff_</p>
		</td>
		<td rowspan="2" width="37%">
			<p>X offset from origin</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>ssize_t</p>
		</td>
		<td width="44%">
			<p>void</p>
		</td>
	</tr>
	<tr>
		<td rowspan="2" width="10%">
			<p>yOff</p>
		</td>
		<td width="10%">
			<p>void</p>
		</td>
		<td width="44%">
			<p>ssize_t yOff_</p>
		</td>
		<td rowspan="2" width="37%">
			<p>Y offset from origin</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>ssize_t</p>
		</td>
		<td width="44%">
			<p>void</p>
		</td>
	</tr>
	<tr>
		<td rowspan="2" width="10%">
			<p>xNegative</p>
		</td>
		<td width="10%">
			<p>void</p>
		</td>
		<td width="44%">
			<p>bool xNegative_</p>
		</td>
		<td rowspan="2" width="37%">
			<p>Sign of X offset negative? (X origin at right)</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>bool</p>
		</td>
		<td width="44%">
			<p>void</p>
		</td>
	</tr>
	<tr>
		<td rowspan="2" width="10%">
			<p>yNegative</p>
		</td>
		<td width="10%">
			<p>void</p>
		</td>
		<td width="44%">
			<p>bool yNegative_</p>
		</td>
		<td rowspan="2" width="37%">
			<p>Sign of Y offset negative? (Y origin at bottom)</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>bool</p>
		</td>
		<td width="44%">
			<p>void</p>
		</td>
	</tr>
	<tr>
		<td rowspan="2" width="10%">
			<p>percent</p>
		</td>
		<td width="10%">
			<p>void</p>
		</td>
		<td width="44%">
			<p>bool percent_</p>
		</td>
		<td rowspan="2" width="37%">
			<p>Width and height are expressed as percentages</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>bool</p>
		</td>
		<td width="44%">
			<p>void</p>
		</td>
	</tr>
	<tr>
		<td rowspan="2" width="10%">
			<p>aspect</p>
		</td>
		<td width="10%">
			<p>void</p>
		</td>
		<td width="44%">
			<p>bool aspect_</p>
		</td>
		<td rowspan="2" width="37%">
			<p>Resize without preserving aspect ratio (!)</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>bool</p>
		</td>
		<td width="44%">
			<p>void</p>
		</td>
	</tr>
	<tr>
		<td rowspan="2" width="10%">
			<p>greater</p>
		</td>
		<td width="10%">
			<p>void</p>
		</td>
		<td width="44%">
			<p>bool greater_</p>
		</td>
		<td rowspan="2" width="37%">
			<p>Resize if image is greater than size (&gt;)</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>bool</p>
		</td>
		<td width="44%">
			<p>void</p>
		</td>
	</tr>
	<tr>
		<td rowspan="2" width="10%">
			<p>less</p>
		</td>
		<td width="10%">
			<p>void</p>
		</td>
		<td width="44%">
			<p>bool less_</p>
		</td>
		<td rowspan="2" width="37%">
			<p>Resize if image is less than size (&lt;)</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>bool</p>
		</td>
		<td width="44%">
			<p>void</p>
		</td>
	</tr>
	<tr>
		<td rowspan="2" width="10%">
			<p>isValid</p>
		</td>
		<td width="10%">
			<p>void</p>
		</td>
		<td width="44%">
			<p>bool isValid_</p>
		</td>
		<td rowspan="2" width="37%">
			<p>Does object contain a valid geometry? May be set to <i>false</i>
			in order to invalidate an existing geometry object.</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>bool</p>
		</td>
		<td width="44%">
			<p>void</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>operator =</p>
		</td>
		<td width="10%">
			<p>const Geometry&amp;</p>
		</td>
		<td width="44%">
			<p>const string geometry_</p>
		</td>
		<td width="37%">
			<p>Set geometry via C++ string</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>operator =</p>
		</td>
		<td width="10%">
			<p>const Geometry&amp;</p>
		</td>
		<td width="44%">
			<p>const char * geometry_</p>
		</td>
		<td width="37%">
			<p>Set geometry via C string</p>
		</td>
	</tr>
	<tr>
		<td width="10%">
			<p>operator string</p>
		</td>
		<td width="10%">
			<p>string</p>
		</td>
		<td width="44%">
			<p>Geometry&amp;</p>
		</td>
		<td width="37%">
			<p>Obtain C++ string representation of geometry</p>
		</td>
	</tr>
</table>
<p>In addition, we support these yet to be documented geometry flags: the fill area flag ('^') and the pixel area count limit flag ('@').</p>
<p><br /><br />
</p>
</div>
</body>
</html>
```

--------------------------------------------------------------------------------

````
