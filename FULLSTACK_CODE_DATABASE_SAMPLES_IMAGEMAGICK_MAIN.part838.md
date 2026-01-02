---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 838
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 838 of 851)

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

---[FILE: ImageDesign.html]---
Location: ImageMagick-main/www/Magick++/ImageDesign.html

```text
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Magick++ API: Design Principles</title>
<link rel="stylesheet" href="magick.css" type="text/css" />
</head>
<body>
<div class="doc-section">
<center>
<h1>Magick::Image Data Structures</h1></center>
The class Magick::Image is a simple handle which points to a reference-counted image representation. This allows multiple Magick::Image instances to share the same image and attributes. At the point in time that the image data, or image attributes are modified and the current reference count is greater than one, the image data and attributes are copied to create a new image with a reference count of one and the reference count on the old image is decremented. If the reference count on the old image becomes zero, then the associated reference and data are deleted. This strategy represents a simple (but effective) form of garbage collection 
<p><img src="Image.png" height="490" width="910" /></p>
</div>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: index.html]---
Location: ImageMagick-main/www/Magick++/index.html

```text
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Magick++ API</title>
<link rel="stylesheet" href="https://imagemagick.org/Magick++/magick.css" type="text/css" />
</head>
<body>
<div class="doc-section">
<P ALIGN=CENTER><IMG SRC="https://imagemagick.org/Magick++/Magick++.png" NAME="Graphic1" ALIGN=BOTTOM WIDTH=464 HEIGHT=134 BORDER=0></P>
<h1>ImageMagick Magick++ API</h1>
<P>Magick++ is the object-oriented C++ API to the <A HREF="../index.html">ImageMagick</A>
image-processing library, the most comprehensive open-source image
processing package available. Read the latest <A HREF="../index.html">NEWS</A>
and <A HREF="http://magick.imagemagick.org/script/changelog.php">ChangeLog</A> for Magick++. 
</P>
<P><IMG SRC="https://imagemagick.org/Magick++/logo.png" NAME="Graphic2" ALIGN=RIGHT WIDTH=85 HEIGHT=88 BORDER=0>Magick++
supports an object model which is inspired by <A HREF="../script/perl-magick.php">PerlMagick</A>.
Images support implicit reference counting so that copy constructors
and assignment incur almost no cost. The cost of actually copying an
image (if necessary) is done just before modification and this copy
is managed automagically by Magick++. De-referenced copies are
automagically deleted. The image objects support value (rather than
pointer) semantics so it is trivial to support multiple generations
of an image in memory at one time. 
</P>
<P>Magick++ provides integrated support for the <A HREF="http://www.sgi.com/tech/stl/">Standard
Template Library</A> (STL) so that the powerful containers available
(e.g. <A HREF="http://www.sgi.com/tech/stl/Deque.html">deque</A>,
<A HREF="http://www.sgi.com/tech/stl/Vector.html">vector</A>, <A HREF="http://www.sgi.com/tech/stl/List.html">list</A>,
and <A HREF="http://www.sgi.com/tech/stl/Map.html">map</A>)  can
be used to write programs similar to those possible with PERL &amp;
PerlMagick. STL-compatible template versions of ImageMagick's
list-style operations are provided so that operations may be
performed on multiple images stored in STL containers. 
</P>
<H3>Documentation</H3>
<P>Detailed <A HREF="https://imagemagick.org/Magick++/Documentation.html">documentation</A> is
provided for all Magick++ classes, class methods, and template
functions which comprise the API.  See a <a href="tutorial/Magick++_tutorial.pdf" target="<?php echo rand()?>">  Gentle Introduction to Magick++</a> for an introductory tutorial to Magick++.  We include the <a href="tutorial/Magick++_tutorial.odt" target="<?php echo rand()?>">source</a> if you want to correct, enhance, or expand the tutorial.</p>
</P>
<H3>Obtaining Magick++</H3>
<P>Magick++ is included as part of <A HREF="../index.html">ImageMagick</A>
source releases and may be retrieved via <A HREF="../script/download.php">ftp</A>
or <A HREF="https://github.com/ImageMagick">Github</A>.
</P>
<H3>Installation</H3>
<P>Once you have the Magick++ sources available, follow these detailed
<A HREF="https://imagemagick.org/Magick++/Install.html">installation instructions</A> for UNIX and
Windows. 
</P>
<P><B><FONT SIZE=4>Usage</FONT></B> 
</P>
<P>A helper script named <I>Magick++-config</I> is installed
under Unix which assists with recalling compilation options required
to compile and link programs which use Magick++. For example, the
following command will compile and link the source file <I>example.cpp</I>
to produce the executable <I>example</I> (notice that quotes are
backward quotes): 
</P>
<BLOCKQUOTE><TT><FONT SIZE=2>c++ -O2 -o example example.cpp
`Magick++-config --cppflags --cxxflags --ldflags --libs`</FONT></TT></BLOCKQUOTE>
<P>Windows users may get started by manually editing a project file
for one of the Magick++ demo programs. 
</P>
<P><B>Be sure to initialize the ImageMagick library prior to using the
Magick++ library</B>. This initialization is performed by passing the
path to the ImageMagick DLLs (assumed to be in the same directory
as your program) to the InitializeMagick() function call. This is
commonly performed by providing the path to your program (argv[0]) as
shown in the following example: 
</P>
<BLOCKQUOTE><TT><FONT COLOR="#663366">int main( ssize_t /*argc*/, char **
argv)</FONT></TT> <BR><TT><FONT COLOR="#663366">{</FONT></TT> <BR><TT><FONT COLOR="#663366"> 
InitializeMagick(*argv);</FONT></TT></BLOCKQUOTE>
</P>
<H3>Reporting Bugs</H3>
<P>Please report any bugs via the
<A HREF="http://www.imagemagick.org/discourse-server/viewforum.php?f=3">Magick++ bug tracking forum</A>.
Questions regarding usage should be directed to 
<A HREF="http://www.imagemagick.org/discourse-server/viewforum.php?f=1">Magick++ discussion forum</A>.
</P>
<H3>Related Packages</H3>
<P>Users who are interested in displaying their images at video game
rates on a wide number of platforms and graphic environments (e.g.
Windows, X11, BeOS, and Linux/CGI) may want to try PtcMagick,
which provides a simple interface between Magick++ and <A HREF="http://www.gaffer.org/ptc/">OpenPTC</A>.
</P>
</ul>
</BODY>
</HTML>
```

--------------------------------------------------------------------------------

---[FILE: Install.html]---
Location: ImageMagick-main/www/Magick++/Install.html

```text
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Magick++ API: Install Magick++</title>
<link rel="stylesheet" href="magick.css" type="text/css" />
</head>
<body>
<div class="doc-section">
<h1 align="center">Installing Magick++</h1>
<h3>General</h3>
<p>In order to compile Magick++ you must have access to a standard C++ implementation. The author uses <a href="../index.html">gcc 3.4 (GNU C++)</a> which is available under UNIX and under the <a href="../index.html">Cygwin UNIX-emulation environment</a> for Windows. Standards compliant commercial C++ compilers should also work fine. Most modern C++ compilers for Microsoft Windows or the Mac should work (project files are provided for Microsoft Visual C++ 8.0).</p>
<p>It was decided that Magick++ will be around for the long-haul, so its API definition depends on valuable C++ features which should be common in all current and future C++ compilers. The compiler must support the following C++ standard features:</p>
<ul>
<li>
<p style="margin-bottom: 0cm">templates</p></li>
<li>
<p style="margin-bottom: 0cm">static constructors</p></li>
<li>
<p style="margin-bottom: 0cm">C++-style casts (e.g. static_cast)</p></li>
<li>
<p style="margin-bottom: 0cm">bool type</p></li>
<li>
<p style="margin-bottom: 0cm">string class (<tt>&lt;string&gt;</tt>)</p></li>
<li>
<p style="margin-bottom: 0cm">exceptions (<tt>&lt;exception&gt;</tt>)</p></li>
<li>
<p style="margin-bottom: 0cm">namespaces</p></li>
<li>
<p>Standard Template Library (STL) (e.g. <tt>&lt;list&gt;</tt>, <tt>&lt;vector&gt;</tt>)</p></li></ul>
<p style="margin-bottom: 0cm">The author has personally verified that Magick++ compiles and runs using the following compiler/platform combinations:</p>
<br />
<p align="center" style="margin-bottom: 0cm"><b>Tested Configurations</b></p>
<table width="100%" border="1" cellpadding="2" cellspacing="3">
<tr>
<td>
<p align="center"><b>Operating System</b></p></td>
<td>
<p align="center"><b>Architecture</b></p></td>
<td>
<p align="center"><b>Compiler</b></p></td></tr>
<tr>
<td>
<p><font size="2">SunOS 5.6, 5.7, 5.8 ("Solaris 2.6, 7, &amp; 8)</font></p></td>
<td>
<p><font size="2">SPARC</font></p></td>
<td>
<p><font size="2">GCC 3.0.4</font></p></td></tr>
<tr>
<td>
<p><font size="2">SunOS 5.7 ("Solaris 7")</font></p></td>
<td>
<p><font size="2">SPARC</font></p></td>
<td>
<p><font size="2">Sun Workshop 5.0 C++</font></p></td></tr>
<tr>
<td>
<p><font size="2">SunOS 5.8 ("Solaris 8")</font></p></td>
<td>
<p><font size="2">SPARC</font></p></td>
<td>
<p><font size="2">Sun WorkShop 6 update 2 C++ 5.3</font></p></td></tr>
<tr>
<td>
<p><font size="2">FreeBSD 4.0</font></p></td>
<td>
<p><font size="2">Intel Pentium II</font></p></td>
<td>
<p><font size="2">GCC 2.95</font></p></td></tr>
<tr>
<td>
<p><font size="2">Windows NT 4.0 SP6a</font></p></td>
<td>
<p><font size="2">Intel Pentium II</font></p></td>
<td>
<p><font size="2">Visual C++ 8.0 Standard Edition</font></p></td></tr>
<tr>
<td>
<p><font size="2">Windows XP</font></p></td>
<td>
<p><font size="2">Intel Pentium IV</font></p></td>
<td>
<p><font size="2">Visual C++ 8.0 Standard Edition Service Pack 5</font></p></td></tr>
<tr>
<td>
<p><font size="2">Windows '98 + <a href="../index.html">Cygwin</a> 1.3.10</font></p></td>
<td>
<p><font size="2">Intel Pentium III</font></p></td>
<td>
<p><font size="2">GCC 2.95.3-5</font></p></td></tr>
<tr>
<td>
<p><font size="2">Windows NT 4.0 SP6a</font></p></td>
<td>
<p><font size="2">Intel Pentium II</font></p></td>
<td>
<p><font size="2">GCC 2.95.3-5</font></p></td></tr>
<tr>
<td>
<p><font size="2">Windows XP + <a href="../index.html">Cygwin</a> 1.3.10</font></p></td>
<td>
<p><font size="2">Intel Pentium IV</font></p></td>
<td>
<p><font size="2">GCC 2.95.3-5</font></p></td></tr></table>
<p style="margin-bottom: 0cm">Users of Magick++ have reported that the following configurations work with Magick++:</p>
<br />
<p align="center" style="margin-bottom: 0cm"><b>Other Known Working Configurations</b></p>
<table width="100%" border="1" cellpadding="2" cellspacing="2">
<tr>
<td>
<p align="center"><b>Operating System</b></p></td>
<td>
<p align="center"><b>Architecture</b></p></td>
<td>
<p align="center"><b>Compiler</b></p></td>
<td>
<p><b>Reported By</b></p></td></tr>
<tr valign="top">
<td>
<p><font size="2">Red Hat Linux 8.0</font></p></td>
<td>
<p><font size="2">i386 &amp; alpha</font></p></td>
<td>
<p><font size="2">EGCS 1.1.2</font></p></td>
<td>
<p><font size="2">Dr. Alexander Zimmermann &lt;Alexander.Zimmermann@fmi.uni-passau.de&gt;</font></p></td></tr>
<tr valign="top">
<td>
<p><font size="2">Red Hat Linux 7.0</font></p></td>
<td>
<p><font size="2">i386</font></p></td>
<td>
<p><font size="2">GCC 2.95.2</font></p></td>
<td>
<p><font size="2">Dr. Alexander Zimmermann &lt;Alexander.Zimmermann@fmi.uni-passau.de&gt;</font></p></td></tr>
<tr valign="top">
<td>
<p><font size="2">Red Hat Linux 7.0</font></p></td>
<td>
<p><font size="2">i386</font></p></td>
<td>
<p><font size="2">GCC "2.96" snapshot</font></p></td>
<td>
<p><font size="2">???</font></p></td></tr>
<tr>
<td>
<p><font size="2">Red Hat Linux 7.X</font></p></td>
<td>
<p><font size="2">i386 &amp; alpha</font></p></td>
<td>
<p><font size="2">GCC 3.0</font></p></td>
<td>
<p><font size="2">Dr. Alexander Zimmermann &lt;Alexander.Zimmermann@fmi.uni-passau.de&gt;</font></p></td></tr>
<tr valign="top">
<td>
<p><font size="2">SGI IRIX 6.2, 6.5</font></p></td>
<td>
<p><font size="2">MIPS</font></p></td>
<td>
<p><font size="2">IRIX C++ 7.3.1.2m</font></p></td>
<td>
<p><font size="2">Albert Chin-A-Young &lt;china@thewrittenword.com&gt;</font></p></td></tr>
<tr>
<td>
<p><font size="2">SunOS 5.5.1</font></p></td>
<td>
<p><font size="2">SPARC</font></p></td>
<td>
<p><font size="2">Sun WorkShop CC 5.0</font></p></td>
<td>
<p><font size="2">Albert Chin-A-Young &lt;china@thewrittenword.com&gt;</font></p></td></tr>
<tr>
<td>
<p><font size="2">SunOS 5.6, 5.7, 5.8</font></p></td>
<td>
<p><font size="2">SPARC</font></p></td>
<td>
<p><font size="2">Sun Forte CC 5.3</font></p></td>
<td>
<p><font size="2">Albert Chin-A-Young &lt;china@thewrittenword.com&gt;</font></p></td></tr>
<tr valign="top">
<td>
<p><font size="2">HP-UX 11.00</font></p></td>
<td>
<p><font size="2">PA-RISC</font></p></td>
<td>
<p><font size="2">HP-UX aCC A.03.30</font></p></td>
<td>
<p><font size="2">Albert Chin-A-Young &lt;china@thewrittenword.com&gt;</font></p></td></tr>
<tr valign="top">
<td>
<p><font size="2">Mac OS 9</font></p></td>
<td>
<p><font size="2">PowerPC</font></p></td>
<td>
<p><font size="2">CodeWarrior Professional Release 6</font></p></td>
<td>
<p><font size="2">Leonard Rosenthol &lt;leonardr@digapp.com&gt;</font></p></td></tr>
<tr>
<td>
<p><font size="2">Mac OS X 10.1 "Darwin"</font></p></td>
<td>
<p><font size="2">PowerPC</font></p></td>
<td>
<p><font size="2">GCC 2.95.2 (apple gcc -926)</font></p></td>
<td>
<p><font size="2">Cristy</font></p></td></tr></table>
<p>Please let me know if you have successfully built and executed Magick++ using a different configuration so that I can add to the table of verified configurations.</p>
<hr />
<h3 align="center">Unix/Linux</h3>
<h4>Building From Source</h4>
<p>Magick++ is now built using the ImageMagick configure script and Makefiles. Please follow the installation instructions provided by its README.txt file. The following instructions pertain to the Magick++ specific configuration and build options.</p>
<p>To install ImageMagick plus Magick++ under Unix, installation should be similar to</p>
<p><tt>./configure [ --prefix=/prefix ]</tt><br />
<tt>make</tt><br />
<tt>make install</tt></p>
<p>The library is currently named similar to 'libMagick++.a' (and/or libMagick++.so.5.0.39) and is installed under prefix/lib while the headers are installed with Magick++.h being installed in prefix/include and the remaining headers in prefix/include/Magick++.</p>
<p>To influence the options the configure script chooses, you may specify 'make' option variables when running the configure script. For example, the command</p>
<blockquote><tt>./configure CXX=CC CXXFLAGS=-O2 LIBS=-lposix</tt></blockquote>
<p style="margin-bottom: 0cm"><br />
specifies additional options to the configure script. The following table shows the available options.</p>
<br />
<p align="center" style="margin-bottom: 0cm">Environment Variables That Effect Configure</p>
<table width="100%" border="1" cellpadding="2" cellspacing="3">
<col width="40*" />
<col width="216*" />
<tr>
<td width="16%">
<p align="center"><b>Make Option Variable</b></p></td>
<td width="84%">
<p align="center"><b>Description</b></p></td></tr>
<tr>
<td width="16%">
<p align="center">CXX</p></td>
<td width="84%">
<p>Name of C++ compiler (e.g. 'CC -Xa') to use compiler 'CC -Xa'</p></td></tr>
<tr>
<td width="16%">
<p align="center">CXXFLAGS</p></td>
<td width="84%">
<p>Compiler flags (e.g. '-g -O2') to compile with</p></td></tr>
<tr>
<td width="16%">
<p align="center">CPPFLAGS</p></td>
<td width="84%">
<p>Include paths (-I/somedir) to look for header files</p></td></tr>
<tr>
<td width="16%">
<p align="center">LDFLAGS</p></td>
<td width="84%">
<p>Library paths (-L/somedir) to look for libraries. Systems that support the notion of a library run-path may additionally require -R/somedir or '-rpath /somedir' in order to find shared libraries at run time.</p></td></tr>
<tr>
<td width="16%">
<p align="center">LIBS</p></td>
<td width="84%">
<p>Extra libraries (-lsomelib) required to link</p></td></tr></table>
<h4>Installing Linux RPMs</h4>
<p style="margin-bottom: 0cm">Linux RPMs of ImageMagick and Magick++ can be downloaded from <a href="ftp://ftp.imagemagick.org/pub/ImageMagick/linux//">ftp://ftp.imagemagick.org/pub/ImageMagick/linux/</a>.</p>
<hr />
<h3 align="center">Windows '9X, NT, 2003, 2008, XP, &amp; Windows 7</h3>
<h4>Visual C++</h4>
<p>Windows NT through Windows Vista are supported by the ImageMagick source package for NT available in the 'win2k' subdirectory of the ImageMagick ftp site (and mirrors). The ImageMagick source package for NT provides sources to ImageMagick, Magick++, add-on libraries (e.g. JPEG), and a ready-made Visual C++ 8.0 build environment. Please read the configuration and build instructions in README.txt (under the heading "Windows Win2K/XP VISUAL C++ 8.0 COMPILATION") in order to build Magick++.</p>
<h4>Cygwin &amp; GCC</h4>
<p>It is possible to build both ImageMagick and Magick++ under the Cygwin Unix-emulation environment for Windows NT. Obtain and install Cgywin from <a href="../index.html">http://www.cygwin.com/</a> . An X11R6 environment for Cygwin is available from <a href="http://www.cygwin.com/xfree/">http://www.cygwin.com/xfree/</a> .To build using Cygwin and GCC, follow the instructions for building under Unix.</p>
</div>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: magick.css]---
Location: ImageMagick-main/www/Magick++/magick.css

```text
body {
  background: white;
  color: black;
  font-family: Candara, Sans-Serif;
  margin: 0px;
  padding: 0px;
  font-size: 10pt;
}

a {
  background: transparent;
  color: #17457c;
  text-decoration: none;
  font-weight: bold;
}

a[href]:hover {
  background: transparent;
  color: #991e1e;
  text-decoration: underline;
  font-weight: bold;
}

div.cmd {
  color: black;
  background: #d2ddf6;
  font-family: monospace;
  margin: 1.33em 40px;
  padding: 1.33em 1.33em 1.33em 2.66em;
  text-indent:-1.33em;
}

div.crt {
  border-style: ridge;
  border-width: 7px;
  border-color: blue;
  color: white;
  background: #000044;
  font-family: monospace;
  margin: 1.33em 0em; 
  padding: .66em 1.33em .66em 1.33em;
}

div.cmdout {
  color: black;
  background: #d0d0dd;
  font-family: Times, serif;
  margin: 1.33em 40px;
  padding: .66em 1.33em .66em 1.33em;
}

div.doc-section > p {
  margin: 1.33em 0px;
}

div.doc-section {
  margin: 1.33em 40px;
}

div.eastbar {
  right: 0.2em; 
  position: absolute; 
}

div.eqn {
  text-align: center;
  }

div.footer {
  margin-left: 160px; 
  background: white;
}

div.group {
  border: 2px solid #666;
  padding: 0;
  margin: 0.8em 8px;
}

div.image {
  text-align: center;
}

div.info {
  clear: both;
}

div.main {
  background: white;
  color: black;
  border-left-style: solid;
  border-left-color: #d0d0d0;
  border-left-width: 1px;
  padding-left: .75em;
  padding-bottom: .75em;
  padding-top: 0px;
  padding-right: .75em;
  margin-left: 160px;
  margin-right: 10px;
}

div.menu {
  background: #f5f5f5;
  color: black;
  padding-left: .66em;
  padding-right: .66em;
  padding-top: .75em;
  font-weight: bold;
  vertical-align: top;
  left: 0px;
}

div.sep {
  background: #f5f5f5;
  color: black;
  padding-left: 1.33em;
  padding-top: .75em;
  font-weight: bold;
  vertical-align: top;
  left: 0px;
  font-size: 66%;
}

div.sponsor {
  padding-left: .5em;
  padding-top: .25em;
  font-size: 83.333%;
}

div.sponsbox {
  background: #ffffff;
  border-style: solid;
  border-color: #d0d0d0;
  border-width: 1px;
  padding-left: .66em;
  font-weight: bold;
  vertical-align: top;
  left: 0px;
}

div.sub {
  background: #f5f5f5; 
  color: black;
  padding-left: 1.66em;
  padding-top: .15em;
  font-weight: bold;
  vertical-align: top;
  left: 0px;
  font-size: 90%;
}

div.text {
  color: black;
  background: #d2ddf6;
  font-family: monospace;
  margin: 1.33em 40px;
  padding: 1.33em;
}

div.titlebar {
  background-image: url("../images/background.jpg");
  background-repeat: repeat-x;
  height: 118px;
  width: 100%;
  background-color: white; /* #f5f5f5;  */
  border:0px;
  padding-bottom:0px;
}

div.westbar {
  width: 160px; 
  left: 0em; 
  position: absolute; 
  /* height: 100%; */
  font-size: 9pt;
  border-right-style: solid;
  border-right-color: #d0d0d0; 
  border-right-width: 1px;
}

acronym, .help {
  border-bottom: 1px dashed #9999cc;
  cursor: help;
}

div.info img {
  float: left;
  padding: 0em 1em 0em 0em;
}

dl.doc { 
  padding: .833em 1.33em 1.33em 1.33em;
  border-spacing: 0px;
  width: 85%;
  text-align: left;
  margin: 1.33em 40px; 
  border-style: solid;
  border-color: #d0d0d0;
  border-width: 1px;
}

dt {
  font-weight: bold;
  margin-left: 3em;
  margin-top: 2em;
  margin-bottom: .5em;
}
  
dd {
  margin: .5em .5em .5em 5em;
}

em.arg {
  color: #8b0000; /* darkred; */
  font-weight: normal;
}

em.caution {
  color: #981e49;
  font-weight: bold;
}

em.emergency {
  color: #c74646;
  font-weight: bold;
}

em.option {
  color:  #8b0000; 
  font-weight: normal;
}

em.QR {
  color: #00008b;
  font-weight: normal;
}

em.warn {
  color: #d5a82f;
  font-weight: bold;
}

fieldset {
  padding: .5em;
  background: white;
  border: 1px dotted #aaaa77;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: .5em;
}

fieldset legend {
  color: #fff;
  background-color: #aaaa77;
  font-size: smaller;
  padding: .1ex .5ex;
  border-right: 1px solid gray;
  border-bottom: 1px solid gray;
  font-weight: bold;
}

form {
  margin: 1.33em 0px;
  margin-left: 40px;
  margin-right: 40px;
}

h1 {
  color: black;
  padding: 5px;
  background: #f5f5f5;
  border-style: solid;
  border-color: #d0d0d0;
  border-width: 1px;
  margin-bottom: 30px;
  margin-top: 5px;
  font-weight: bold;
  font-size: 110%;
  text-align: center;
  text-transform: capitalize;
  clear: left;
}

h2 {
  font-weight: bold;
  clear: both;
  font-size: 110%;
}

h3 {
  font-weight: bold;
  clear: both;
  font-size: 100%;
}

h4 {
  font-weight: bolder;
  clear: both;
  font-size: 95%;
}

h5 {
  margin: 1.33em 0px;
  margin-left: 40px;
  margin-right: 40px;
  font-weight: bold;
  clear: both;
  font-size: 100%;
}

iframe {
  margin: 1%;
}

img {
  border: none;
}

img.icon {
  float: left;
  margin: 5px;
}

img.map {
  margin: 0px;
  padding: 0px;
}

kbd {
  font-weight: bold; 
}

li {
  margin-left: 40px;
  margin-right: 40px;
}

li table {
  margin: 1em 0px;
  width: 100%;
}

.list li {
  padding-bottom: 1.2em;
}

.list p {
  margin: 0 0 0 0;
}

p {
  margin: 0.75em 0px;
  text-align: left;
}

p+h3, pre+h3, ul+h3, ol+h3, dl+h3 {
  margin-top: 2em;
}

p.code {
  color: black;
  background: #f5f5f5;
  border: 1pt dashed #2f6fab;
  font-family: monospace;
  font-size: 8pt;
  white-space: pre;
  margin: 1.33em 40px; 
  padding: .66em 1.33em;
}

p.crt {
  white-space: nowrap;
  border-style: ridge;
  border-width: 7px;
  border-color: blue;
  color: white;
  background: #000044;
  font-family: monospace;
  font-size: 9pt;
  margin: 1.33em 40px; 
  padding: .66em 1.33em;
}

p.crtsnip {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.33em; 
  margin-bottom: 1.33em;
  width: 50%;
  white-space: nowrap;
  border-top-style: ridge;
  border-bottom-style: ridge;
  border-top-width: 7px;
  border-bottom-width: 7px;
  border-color: blue;
  color: white;
  font-weight: bolder;
  background: #000044;
  font-family: monospace;
  padding: .66em 1.33em;
}

p.crtsnip em.arg {
  color: #ffbbbb; /* brighter red; */
}

p.info {
  margin: 0.75em 0px;
  text-align: left;
}

p.image img {
  border: none;
}

p.image {
  text-align: center;
}

p.image, p.image-slices {
  text-align: center;
}

p.image-slices img {
  display: block;
  margin: 0px;
  padding: 0px;
  border: none;
  margin-left: auto;
  margin-right: auto;
}

p.navigation-index {
  padding: 10px;
  margin-top: 1px;
  margin-bottom: 0px;
  margin-left: 0;
  margin-right: 0;
  background: white;
  text-align: center;
  font-size: 80%;
  white-space: normal;
}

p.options {
  padding: 0 3em;
}

p.pre {
  white-space: pre;
  color: black;
  background: #d2ddf6;
  font-family: monospace;
  padding: 0em;
  margin: 0em;
}

p.text {
  color: black;
  background: #d2ddf6;
  font-family: monospace;
  margin: 1.33em 40px;
  padding: 1.33em;
}

p.warn {
  padding: .66em 3em; 
  background: #ffeedd;
}

pre {
  padding-top: 0pt;
  padding-bottom: 0pt;
  margin: 0pt;
  font-size: 90%;
}

pre.code {
  color: black;
  background: #f5f5f5;
  border: solid 2px black;
  font-family: monospace;
  white-space: pre;
  margin: 1.33em 0px;
  margin-left: 40px;
  margin-right: 40px;
  padding: 1.33em;
  font-size: 90%;
}

pre.crt {
  padding: 0;
  margin: 0;
  }

pre.debug {
  color: black;
  background: #d2ddf6;
  border: solid 2px black;
  font-family: monospace;
  white-space: pre;
  margin: 1.33em 0px;
  margin-left: 40px;
  margin-right: 40px;
  padding: 1.33em;
}

pre.text {
  color: black;
  background: #ddddff;
  font-family: monospace;
  white-space: pre;
  margin: 1.33em 0px;
  margin-left: 40px;
  margin-right: 40px;
  padding: 1.33em;
}

span.bull {
  color: #d0d0d0;
}

span.crtin {
  color: white;
  font-weight: bolder;
  padding: .67em 1.33em .67em 0;
}

span.crtout, .crtprompt {
  color: #ffff77;
  padding-top: .67em;
  padding-bottom: .67em;
}

span.crtout {
  padding-left: 1.33em;
  padding-right: 1.33em;
  display: block;
}

span.crtprompt {
  padding-right: 0;
  text-indent:-1.33em; 
}

span.different {
  font-weight: bold;
  background-color: transparent;
  color: blue;
}

span.filter {
  font-weight: bold;
}

span.info-east {
  float: right;
}

span.info-west {
  float: left;
}

span.option {
  white-space: normal;
}

span.path {
  font-weight: bold;
}

span.size-mod-title { }

table.doc { 
  padding: 1.33em;
  border-spacing: 0px;
  width: 91%;
  text-align: left;
  margin: 1.33em 40px; 
  border-style: solid;
  border-color: #d0d0d0;
  border-width: 1px;
}

table.doc td,th {
  padding: .3em .5em;
}

td {
  text-align: left;
  padding: .5em;
}

td.map {
  margin: 0px;
  padding: 0px;
}

th {
  background-color: #d2ddf6;
  color: black
  text-align: left;
  padding: .5em;
}

th.size-alt, tr.size-alt, td.size-alt {
  background-color: #f0f0f0;
}

th.size-norm, tr.size-norm, td.size-norm {
  background-color: #f7f7f7;
}

#footer {
  margin-left:0px;
}

#footer-west {
  float: left;
  padding: 20px;
}

#footer-east {
  float: right;
  padding: 20px;
}

#header { 
  background-color: #ADD8E6; /* lightblue; */
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 4em;
  border-bottom: solid 1px;
  z-index: 10;
} 

#linkbar, #navigation-bar {
  clear: both;
  background: #f5f5f5;
  color: black;
  border: solid #d0d0d0;
  border-width: 1px 0px 1px 0px;
  padding: 5px 5px 5px 10px;
  font-weight: bold;
  text-align: center;
  margin-left:0px; 
}

#linkbar-east {
  float: right;
}

#linkbar-center {
  padding: 0px 80px;
}

#linkbar-west {
  float: left;
}

#margin {
  padding: 10px;
  vertical-align: top;
  white-space: nowrap;
  left: 0px;
}

#menu {
  background: #f5f5f5;
  color: black;
  border-style: solid;
  border-color: #d0d0d0;
  border-width: 0px 1px 0px 0px;
  padding: 10px;
  font-weight: bold;
  vertical-align: top;
  white-space: nowrap;
  top: 100px;
  left: 0px;
  height: 100%;
}

#main {
  margin-left: 0px;
  padding-right: 0px;
  padding-left: 10px;
}

#menu a {
  display: block;
}

#menu a.sponsor {
  display: block;
  padding-left: 10px;
  font-size: 76.6666%;
}

#menu a.sub {
  display: block;
  padding-left: 10px;
  font-size: 90%;
}

#menu p {
  display: none;
}

#menu span {
  display: none;
}

#menu-button {
  background-color: transparent;
  padding: 0;
  position: absolute;
  top: 100px;
  left: 0px;
  cursor: w-resize;
}

#notice {
  color:#b90006;
}

#titlebar {
  background-image: url("../images/background.jpg");
  background-repeat: repeat-x;
  height: 118px;
}

#table {
  text-align: left;
  margin: 1.33em 0px;
  margin-left: 40px;
  margin-right: 40px;
  border-style: solid;
  border-color: #d0d0d0;
  border-width: 1px;
}

#titlebar-east {
  float: right;
}

#titlebar-west {
  float: left;
}
*/

#www-imagemagick-org {
  background: #f5f5f5;
}

@media print {
  #titlebar, #navigation-bar, #linkbar, #menu, #margin { display: none }

  #main {
    margin-left: 0px;
    padding-right: 0px;
    padding-left: 0px;
  }
}

.size-alt { background-color: #f5f5f5; }

.size-accent { background-color: #f5f5f5; }

.size-mod-body { font-size: 93.666%; }

.size-mod-foot { }

.size-mod-head {
  text-align: left;
  font-weight: bold;
}

.size-mod-title {
  font-size: 1.3em;
  font-weight: bold;
}

.viewport
{
  color: black;
  background: #f5f5f5;
  border: solid 2px black;
  font-family: monospace;
  font-size: 83.333%;
  white-space: pre;
  margin: 1.33em 40px;
  padding: 1.33em;
  height: 480px;
  overflow: auto;
}
```

--------------------------------------------------------------------------------

````
