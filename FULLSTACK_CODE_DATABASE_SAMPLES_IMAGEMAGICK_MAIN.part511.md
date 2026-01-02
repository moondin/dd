---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 511
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 511 of 851)

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

---[FILE: format_c_api_docs]---
Location: ImageMagick-main/scripts/format_c_api_docs

```text
#!/usr/bin/perl -w
#
# Format ImageMagick comments into POD-format or HTML format
# documentation
# Produces *.pod or *.html files corresponding to *.c files
#
# Written by Bob Friesenhahn, April 1997
#

$opt_format='html';
$opt_srcdir='';
$opt_outdir='';

use Getopt::Long;
if ( ! GetOptions(
                  'format=s'	=> \$opt_format,
                  'srcdir=s'	=> \$opt_srcdir,
                  'outdir=s'	=> \$opt_outdir,
                 )
   ) {
  print("Usage: fmtdocs [-srcdir srcdir] [-outdir outdir] [-format format] \n");
  exit(1);
}

#
# Source files to use
#
@srcs = ('animate.c',
	 'annotate.c',
	 'attribute.c',
	 'blob.c',
	 'cache.c',
	 'cache-view.c',
	 'color.c',
	 'colorspace.c',
	 'compare.c',
	 'composite.c',
	 'constitute.c',
	 'decorate.c',
   'deprecate.c',
	 'draw.c',
	 'drawing-wand.c',
	 'display.c',
	 'effect.c',
	 'enhance.c',
	 'exception.c',
	 'fx.c',
	 'image.c',
	 'list.c',
	 'magick.c',
	 'magick-wand.c',
	 'memory.c',
	 'monitor.c',
	 'montage.c',
   'paint.c',
	 'pixel-iterator.c',
	 'pixel-wand.c',
	 'profile.c',
	 'quantize.c',
	 'registry.c',
   'resource.c',
	 'segment.c',
	 'shear.c',
	 'signature.c',
	 'stream.c',
	 'transform.c',
	 'resize.c',
   'version.c');

$tmpname_pre_format = "/tmp/fmtdocs_pre.$$";
$tmpname_pod = "/tmp/fmtdocs_pod.$$";
$tmpname_html = "/tmp/fmtdocs_html.$$";

#@srcs = ('draw.c');

#
# What is for source files
#
%whatis =
(
 'animate',	'Interactively Animate an Image Sequence',
 'annotate',	'Annotate an Image',
 'attribute',	'Set Text Attributes',
 'blob',	'Read or Write Binary Large OBjects',
 'color',	'Count the Colors in an Image',
 'colorspace',	'Dealing with Image Colorspaces',
 'compare',	'Compare an Image to a Reconstructed Image',
 'constitute',	'Constitute an Image',
 'composite',	'Composite an Image',
 'decorate',	'Decorate an Image',
 'deprecate',	'Deprecated Methods',
 'display',	'Interactively Display and Edit an Image',
 'draw',	'Draw on an Image',
 'drawing_wand',	'Image Vector Drawing',
 'effect',	'Add an Effect',
 'fx',		'Add a Special Effect',
 'enhance',	'Enhance an Image',
 'exception',	'Dealing with Exceptions',
 'image',	'Image Methods',
 'list',	'Working with Image Lists',
 'cache',	'Get or Set Image Pixels',
 'cache_view',	'Working with Cache Views',
 'magick',	'Read or List Image formats',
 'magick_wand',	'Magick Wand',
 'memory',	'Memory Allocation',
 'monitor',	'Monitor the Progress of an Image Operation',
 'montage',	'Create an Image Thumbnail',
 'paint',	'Paint on an Image',
 'pixel_iterator',	'Pixel Iterator',
 'pixel_wand',	'Pixel Wand',
 'profile',	'Dealing with Image Profiles',
 'quantize',	'Reduce the Number of Unique Colors in an Image',
 'registry',	'The Registry',
 'resource',	'Monitor or Limit Resource Consumption',
 'segment',	'Segment an Image with Thresholding Fuzzy c-Means',
 'shear',	'Shear or Rotate an Image by an Arbitrary Angle',
 'signature',	'Compute a Digital Signature for an Image',
 'stream',	'The Pixel FIFO',
 'transform',	'Transform an Image',
 'resize',	'Resize an Image',
 'version',	'Get Version and Copyright',
);

#
# Key words to replace with HTML links
#
my %keywords =
  (
   AffineMatrix		=> 'types.html#AffineMatrix',
   BlobInfo		=> 'types.html#BlobInfo',
   Cache		=> 'types.html#Cache',
   ChannelType		=> 'types.html#ChannelType',
   ChromaticityInfo	=> 'types.html#ChromaticityInfo',
   ClassType		=> 'types.html#ClassType',
   ClipPathUnits	=> 'types.html#ClipPathUnits',
   ColorPacket		=> 'types.html#ColorPacket',
   ColorspaceType	=> 'types.html#ColorspaceType',
   ComplianceType	=> 'types.html#ComplianceType',
   CompositeOperator	=> 'types.html#CompositeOperator',
   CompressionType	=> 'types.html#CompressionType',
   DecorationType	=> 'types.html#DecorationType',
   DrawContext		=> 'types.html#DrawContext',
   DrawInfo		=> 'types.html#DrawInfo',
   ErrorHandler		=> 'types.html#ErrorHandler',
   ExceptionInfo	=> 'types.html#ExceptionInfo',
   ExceptionType	=> 'types.html#ExceptionType',
   FillRule		=> 'types.html#FillRule',
   FilterTypes		=> 'types.html#FilterTypes',
   FrameInfo		=> 'types.html#FrameInfo',
   GravityType		=> 'types.html#GravityType',
   Image		=> 'types.html#Image',
   ImageInfo		=> 'types.html#ImageInfo',
   ImageType		=> 'types.html#ImageType',
   InterlaceType	=> 'types.html#InterlaceType',
   LayerType		=> 'types.html#LayerType',
   MagickInfo		=> 'types.html#MagickInfo',
   MonitorHandler	=> 'types.html#MonitorHandler',
   MontageInfo		=> 'types.html#MontageInfo',
   NoiseType		=> 'types.html#NoiseType',
   PaintMethod		=> 'types.html#PaintMethod',
   PixelPacket		=> 'types.html#PixelPacket',
   PointInfo		=> 'types.html#PointInfo',
   ProfileInfo		=> 'types.html#ProfileInfo',
   QuantizeInfo		=> 'types.html#QuantizeInfo',
   Quantum		=> 'types.html#Quantum',
   QuantumType		=> 'types.html#QuantumType',
   RectangleInfo	=> 'types.html#RectangleInfo',
   RegistryType		=> 'types.html#RegistryType',
   RenderingIntent	=> 'types.html#RenderingIntent',
   ResolutionType	=> 'types.html#ResolutionType',
   ResourceType		=> 'types.html#ResourceType',
   SegmentInfo		=> 'types.html#SegmentInfo',
   SignatureInfo	=> 'types.html#SignatureInfo',
   StorageType		=> 'types.html#StorageType',
   StreamHandler	=> 'types.html#StreamHandler',
   StretchType		=> 'types.html#StretchType',
   StyleType		=> 'types.html#StyleType',
   TypeMetric		=> 'types.html#TypeMetric',
   CacheView		=> 'types.html#CacheView',
   VirtualPixelMethod	=> 'types.html#VirtualPixelMethod',
   XResourceInfo	=> 'types.html#XResourceInfo',
);


foreach $src (@srcs) {

  my($out,$command);

  # Compute POD name
  ($base = $src) =~ s/\.[^\.]*$//g;

  $out = "${base}.${opt_format}";
  if ("${opt_outdir}" ne "") {
    $out = "${opt_outdir}/${base}.${opt_format}";
  }

  if ("${opt_srcdir}" ne "") {
    $src = "${opt_srcdir}/${src}";
  }

  $command='pod2html -netscape';
  if ( $opt_format eq 'html' ) {
    $command='pod2html -netscape';
  } elsif ( $opt_format eq 'latex' ) {
    $command='pod2latex';
  } elsif ( $opt_format eq 'man' ) {
    $command='pod2man';
  } elsif ( $opt_format eq 'text' ) {
    $command='pod2text';
  } elsif ( $opt_format eq 'pod' ) {
    $command='cat';
  }

  print( "Processing $src -> $out\n" );

  pre_format($src, $tmpname_pre_format);		# Make easily parsed
  format_to_pod($tmpname_pre_format, $tmpname_pod);	# Format to pod.

  if ( $opt_format eq 'html' ) {
    system("$command $tmpname_pod > \"$tmpname_html\"");
    reformat_html($tmpname_html,$out);
  } else {
    system("$command $tmpname_pod > \"$out\"");
  }
  unlink($tmpname_pre_format);
  unlink($tmpname_pod);
  unlink($tmpname_html);
}

#unlink($tmpname_pre_format);
exit(0);

#
# Reformat pod2html-generated HTML into nicer form.
#
sub reformat_html {
  my($infile, $outfile) = @_;

  open( IN, "<$infile" ) || die("Failed to open \"$infile\" for read\n" );
  open( OUT, ">$outfile" ) || die("Failed to open \"$outfile\" for write\n" );

 INPUT:
  while(<IN>) {
    s|<\!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">|<\!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
  "http://www.w3.org/TR/html4/loose.dtd">|;
    s|<HEAD>|<HEAD>
<META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8">
<STYLE>
<!--
\@page { size: 8.5in 11in }
TD P { color: #000000; font-family: "Verdana", "Arial", "Helvetica", sans-serif; font-size: 12pt }
P { color: #000000; font-family: "Verdana", "Arial", "Helvetica", sans-serif; font-size: 12pt }
H2 { color: #000000 }
A:link { color: #0085c0 }
A:visited { color: #800080 }
-->
</STYLE>
|;
    s|<link rev="made" href="mailto:root\@localhost" />|<link rel="stylesheet" type="text/css" href="../magick.css">|;
    s|<body style="background-color: white">|<body marginheight="1" marginwidth="1" topmargin="1" leftmargin="1">
<a name="top"></a> 
<table border="0" cellpadding="0" cellspacing="0" summary="Masthead" width="100%">
<tbody>
<tr>
<td bgcolor="#003399" width="25%" height="118" background="../../images/background.gif"><a href="https://imagemagick.org/"><img src="../../images/script.gif" width="278" height="118" border="0" alt="" /></a></td>
<td bgcolor="#003399" width="60%" height="118" background="../../images/background.gif"><a href="http://www.networkeleven.com/direct.php?magick_all"><img src="../../images/promote.png" border="0" width="186" height="52" vspace="29" alt="Powered by NetworkEleven" /></a></td>
<td bgcolor="#003399" width="114" height="118" align="right"><img src="../../images/sprite.png" width="114" height="118" alt="" /></td>
<td bgcolor="#003399" width="114" height="118" align="right"><a href="https://imagemagick.net"><img src="../../images/logo.png" width="114" height="118" border="0" alt="ImageMagick logo" /></a></td>
</tr></tbody></table>
<table align="left" border="0" cellpadding="2" cellspacing="2" summary="Navigation buttons" width="20%">
<tr>
<td>
<form target="_self" action="../../index.html"><input type="submit" title="ImageMagick Home" value=" Home" style="background-color: #1947A3; background-image:url('../../../images/background.gif'); color:#fbc713; font-weight:bold"></form></td>
<td>
<form target="_self" action="../../www/apis.html"><input type="submit" title="ImageMagick API" value=" API " style="background-color: #1947A3; background-image:url('../../../images/background.gif'); color:#fbc713; font-weight:bold"></form></td>
<td>
<form target="_self" action="../../www/download.html"><input type="submit" title="ImageMagick Download" value="Download" style="background-color: #1947A3; background-image:url('../../../images/background.gif'); color:#fbc713; font-weight:bold"></form></td></tr></table>
<div align="right" style="margin-top:3px; padding-right:4px">
<form action="http://studio.imagemagick.org/Sage/scripts/Sage.cgi"><input type="TEXT" name="query" size="32" maxlength="255"> <input type="SUBMIT" name="sa" value="Search" style="background-color: #1947A3; background-image:url('../../../images/background.gif'); bgcolor:#003399; color:#fbc713; font-weight:bold"></form></div>
<table align="left" border="0" cellpadding="10" cellspacing="0" style="margin-top:-17px" width="100%">
<tr>
<td>
|;
    s|</body>|
<HR>

<a href="#top"><img src="../../../images/top.gif" border=0 width="35" height="46" align="right" alt="Top of page"></a>
<form action="http://studio.imagemagick.org/magick/" style="margin-top:5px">
<input type="submit" title="Help!" value="Help!" style="background-image:url('../../../images/background.gif'); color:#fbc713; font-weight:bold">
  <small>&quot;Image manipulation software that works like magick&quot;</small>
</form></td>
</tr></table>

</body>
|;
    s|<FONT SIZE=-1>||g;
    s|</FONT>||g;

    s|<H2>|<H3>|g;
    s|</H2>|</H3>|g;

    s|<H1>|<H2>|g;
    s|</H1>|</H2>|g;

    s|<DT>|<DD><P></P><DT>|g;
    s|<DL>|<DL><DT><DD><DL>|g;
    s|</DL>|</DL></DL>|g;
    s|<dd>|<DD>|g;
    s|<p>|<P>|g;
    s|</p>|</P>|g;
    s|</LI>||g;
    s|>o |>|g;
    s|unsignedint|unsigned int|g;
    print( OUT $_ );
  }
  close( TMP );
  close( IN );
}

#
# Pre-process file into intermediate form
#
# Initializes globals:
#
#  @functions	- Function names
#  %synopsis	- Function synopsis
#
sub pre_format {
  my($infile, $tmpfile) = @_;

  my $inpara = 0;	# Set to 1 if in paragraph
  my $inlist = 0;	# Set to 1 if in list-item paragraph

  # Open C source file
  open( IN, "<$infile" ) || die("Failed to open \"$infile\" for read\n" );

  # Open TMP file
  open( TMP, ">$tmpfile" ) || die("Failed to open \"$tmpfile\" for write\n" );

  undef @functions;
  undef %synopsis;

  # Skip past first form feed
  while(<IN>) {
    last if m/\014/;
  }

LINE:
  while(<IN>) {
    if (m/^\+/) {
      while(<IN>) {
	last unless m/^%/;
      }
      next;
    }
    next unless m/^%/ ;
    chop;

    # Extract and save function title
    if (m/^%\s+((\w )+)\s+%/) {
      ($ftitle = $1) =~ s/ //g;
      push(@functions, $ftitle);
      print( TMP "===$ftitle\n" );
      next;
    }

    # Zap text we don't want
    next if ( m/^%.+%/ );	# "%*%
    s/^%\s{0,2}//;

    # Extract and save synopsis info
    if (m /\(\)/ ) {
      # nothing
      ;
    }
    elsif ( m/${ftitle}\(.*\)$/ ) {
      s/,/ , /g;
      s/\(/ ( /g;
      s/\)/ ) /g;
      s/\*/ * /g;
      s/\s+/ /g;

      s/\(\s+\*/(*/g;
      s/ ,/,/g;
      s/ \(/(/g;
      s/\) /)/g;
      s/ \* / */g;

      s/^\s*//;
      $synopsis{$ftitle} = $_ . ';'; # Append semi-colon, prototype style
      print ( TMP " " . $synopsis{$ftitle} . "\n" );
      next LINE;
     }
     elsif ( m/${ftitle}\(.*/ ) {
      $synopsis{$ftitle} = $_;
      do {
	$_ = <IN>;
	chop;
	# Zap text we don't want
	next if m/^%.+%/;	# "%*%
	s/^%\s{0,2}//;
	$synopsis{$ftitle} .= $_;
      } until m/^\s*$/;
      $_ = $synopsis{$ftitle};

      s/,/ , /g;
      s/\(/ ( /g;
      s/\)/ ) /g;
      s/\*/ * /g;
      s/\s+/ /g;

      s/\(\s+\*/(*/g;
      s/ ,/,/g;
      s/ \(/(/g;
      s/\) /)/g;
      s/ \* / */g;

      s/^\s*//;
      $synopsis{$ftitle} = $_ . ';'; # Append semi-colon, prototype style
      print ( TMP " " . $synopsis{$ftitle} . "\n" );
      next LINE;
    }

  # Keep track of paragraphing
  if( ! m/^$/ ) {
    if ( $inpara == 0 ) {
      $inpara = 1;	# Start of paragraph
      $para = "$_";	# Start paragraph string
    } else {
      # Inside paragraph
      $para .= " $_";	# Add line to paragraph
    }
  }
  # Keep track of list items so they can
  # be wrapped as a paragraph
  if( m/^\s+(o[^:]+:|o|[0-9]\.)\s(.*)/ ) {
    $inlist = 1;
  }

  if ( $inpara == 1 ) {
    if( $para =~ m/^\s+\S+/ && ! $inlist ) {
      # Lines that start with a space shouldn't be munged
      $inpara = 0;	# End of paragraph
      $inlist = 0;
      $para .= "";	# Terminate paragraph
      print( TMP "$para\n" );
    }
    elsif( m/^$/ ) {
      # End of paragraph
      $inpara = 0;	# End of paragraph
      $inlist = 0;
      $para .= "";	# Terminate paragraph
      $para =~ s/^\s+//g;		# Eliminate any leading space
      $para =~ s/\s+/ /g;		# Canonicalize whitespace
      $para =~ s/ $//;		# Trim final space
      $para =~ s/([a-zA-Z0-9][.!?][)'"]*) /$1  /g; #' Fix sentence ends
		  print( TMP "\n$para\n\n" );
		}
    }
  }

  close( TMP );
  close( IN );
}

#
# Second pass
# Process into formatted form
#
sub format_to_pod {
    my($infile, $outfile) = @_;

    my $func;

    my $inlist = 0;		# Set to one if in indented list

    # Open input file
    open( IN, "<$infile" ) || die("Failed to open \"$infile\" for read\n" );

    # Open output file
    open( OUT, ">$outfile" ) || die("Failed to open \"$outfile\" for write\n" );

    # Name field
    print( OUT head1("NAME") );
    if (!defined($whatis{$base})) {
      print("Whatis definition missing for \"$base\"!\n");
      print( OUT "${base} - Unknown\n\n" );
    } else {
      print( OUT "${base} - $whatis{$base}\n\n" );
    }

    # Synopsis field (function signatures)
    print( OUT head1("SYNOPSIS") );
    foreach $func (sort( @functions )) {
      if (defined $synopsis{$func} ) {
	$_ = $synopsis{$func};
	s/$func/ B<$func>/;
	s/^\s*//;
	my $synopsis = $_;
	print( OUT $synopsis, "\n\n" );
      }
    }

    # Description field
    print( OUT head1("FUNCTION DESCRIPTIONS") );

    while(<IN>){
	chop;
	next if m/^$/;

	# Match list element
	if( m/^(o[^:]+:|o|[0-9]\.?)\s(.*)/ ) {
	    my $bullet = $1;
	    my $bullet_text = $2;

	    print( OUT startlist() ) unless $inlist;
	    $inlist = 1;
	    print( OUT item($bullet), "$bullet_text\n\n" );
	    next;
	} else {
	    print( OUT endlist() ) if $inlist;
	    $inlist = 0;
	}

	# Match synopsis item
	if( defined $func && m/$func\s*\(.*\)/ ) {
	  # Split all words with spaces to aid with tokenization
	  s/,/ , /g;
	  s/\(/ ( /g;
	  s/\)/ ) /g;
	  s/\*/ * /g;

	  my $html = '';

	  # Replace tokens matching keywords with HTML links.
TOKEN:	  foreach $token ( split(' ', $_ ) ) {
	    foreach $keyword ( %keywords ) {
	      if ( $token eq $keyword ) {
		$html .= linked( $keyword, $keywords{$keyword} );
		$html .= " ";
		next TOKEN;
	      }
	    }
	    $html .= "$token ";
	  }
	  $_ = $html;
	  # Remove excess spaces
	  s/\s+/ /g;
	  s/ ,/,/g;
	  s/\* /*/g;
	  s/\)\s*\;/);/;
	  s/^\s*//;
          s/ \( *\)/\(\)/;

          # This is very poor because text is output specifically
          # for HTML so the text isn't output at all for other target
          # formats.
	  print( OUT html("<blockquote>$_</blockquote>") );
	    next;
	}

	# Match function title
	if( m/===([a-zA-Z0-9]+)/ ) {
	    $func = $1;
	    print( OUT head2($func) );
	    next;
	}

        print( OUT "\n") if /^[^ ]/;
	print( OUT "$_\n") ;
        print( OUT "\n") if /^[^ ]/;
    }

    close( OUT );
    close( IN );
}

#
# Return level 1 heading
# Similar to: <H1>heading</H1>
#
sub head1 {
    my($heading) = @_;
    return( "=head1 $heading\n\n" );
}

#
# Return level 2 heading
# Similar to: <H2>heading</H2>
#
sub head2 {
    my($heading) = @_;
    return( "=head2 $heading\n\n" );
}


#
# Return item
# Similar to: <I>
#
sub item {
    my($item) = @_;
    return( "=item $item\n\n" );
}


#
# Start list
# Similar to: <UL>
#
sub startlist {
    return( "=over 4\n\n" )
}

#
# End list
# Similar to: </UL>
#
sub endlist {
    return( "=back\n\n" );
}

#
# Preformatted text
# Similar to <PRE></PRE>
#
sub formated {
    my($text) = @_;
    return( " $text\n\n" );
}

#
# Raw HTML paragraph
#
sub html {
  my($html) = @_;
  return return( "=for html $html\n\n" );
}

#
# HTML Link
# Similar to: <A HREF="url">description</A>
#
sub linked {
  local($description, $url) = @_;
  return( "<A HREF=\"" . $url . "\">" . $description . "</A>" );
}
```

--------------------------------------------------------------------------------

---[FILE: Makefile.am]---
Location: ImageMagick-main/scripts/Makefile.am

```text
#
# Top Makefile for Magick++
#
# Copyright Bob Friesenhahn, 1999, 2000, 2002, 2004
#

if  WITH_MAGICK_PLUS_PLUS
magickppincdir = $(INCLUDE_PATH)/Magick++

MAGICKPP_LIBS = Magick++/lib/libMagick++.la

MAGICKPP_SCRPTS = \
	Magick++/bin/Magick++-config

MAGICKPP_MANS = \
	Magick++/bin/Magick++-config.1

MAGICKPP_PKGCONFIG = \
	Magick++/lib/ImageMagick++.pc

MAGICKPP_TESTS = \
	Magick++/tests/exceptions.sh \
	Magick++/tests/appendImages.sh \
	Magick++/tests/attributes.sh \
	Magick++/tests/averageImages.sh \
	Magick++/tests/coalesceImages.sh \
	Magick++/tests/coderInfo.sh \
	Magick++/tests/colorHistogram.sh \
	Magick++/tests/color.sh \
	Magick++/tests/montageImages.sh \
	Magick++/tests/morphImages.sh \
	Magick++/tests/readWriteBlob.sh \
	Magick++/tests/readWriteImages.sh \
	Magick++/demo/analyze.sh \
	Magick++/demo/button.sh \
	Magick++/demo/demo.sh \
	Magick++/demo/flip.sh \
	Magick++/demo/gravity.sh \
	Magick++/demo/piddle.sh \
	Magick++/demo/shapes.sh \
	Magick++/demo/zoom_bessel.sh \
	Magick++/demo/zoom_blackman.sh \
	Magick++/demo/zoom_box.sh \
	Magick++/demo/zoom_catrom.sh \
	Magick++/demo/zoom_cubic.sh \
	Magick++/demo/zoom_gaussian.sh \
	Magick++/demo/zoom_hamming.sh \
	Magick++/demo/zoom_hanning.sh \
	Magick++/demo/zoom_hermite.sh \
	Magick++/demo/zoom_lanczos.sh \
	Magick++/demo/zoom_mitchell.sh \
	Magick++/demo/zoom_point.sh \
	Magick++/demo/zoom_quadratic.sh \
	Magick++/demo/zoom_sample.sh \
	Magick++/demo/zoom_scale.sh \
	Magick++/demo/zoom_sinc.sh \
	Magick++/demo/zoom_triangle.sh

MAGICKPP_EXTRA_DIST = \
	Magick++/AUTHORS \
	Magick++/COPYING \
	Magick++/ChangeLog \
	Magick++/INSTALL \
	Magick++/NEWS \
	Magick++/README \
	Magick++/bin/Magick++-config.1 \
	Magick++/bin/Magick++-config.in \
	Magick++/lib/ImageMagick++.pc.in \
	Magick++/demo/model.miff \
	Magick++/demo/smile.miff \
	Magick++/demo/smile_anim.miff \
	Magick++/demo/tile.miff \
	$(MAGICKPP_TESTS) \
	Magick++/tests/test_image.miff \
	Magick++/tests/test_image_anim.miff

MAGICKPP_CLEANFILES = \
	Magick++/demo/*_out.* \
	Magick++/demo/ir.out \
	Magick++/tests/colorHistogram.txt \
	Magick++/tests/testmagick_anim_out.miff \
	Magick++/tests/ir.out

Magick___lib_libMagick___la_SOURCES = \
	Magick++/lib/Blob.cpp \
	Magick++/lib/BlobRef.cpp \
	Magick++/lib/CoderInfo.cpp \
	Magick++/lib/Color.cpp \
	Magick++/lib/Drawable.cpp \
	Magick++/lib/Exception.cpp \
	Magick++/lib/Functions.cpp \
	Magick++/lib/Geometry.cpp \
	Magick++/lib/Image.cpp \
	Magick++/lib/ImageRef.cpp \
	Magick++/lib/Montage.cpp \
	Magick++/lib/Options.cpp \
	Magick++/lib/Pixels.cpp \
	Magick++/lib/STL.cpp \
	Magick++/lib/Thread.cpp \
	Magick++/lib/TypeMetric.cpp \
	Magick++/lib/Magick++.h \
	Magick++/lib/Magick++/Blob.h \
	Magick++/lib/Magick++/BlobRef.h \
	Magick++/lib/Magick++/CoderInfo.h \
	Magick++/lib/Magick++/Color.h \
	Magick++/lib/Magick++/Drawable.h \
	Magick++/lib/Magick++/Exception.h \
	Magick++/lib/Magick++/Functions.h \
	Magick++/lib/Magick++/Geometry.h \
	Magick++/lib/Magick++/Image.h \
	Magick++/lib/Magick++/ImageRef.h \
	Magick++/lib/Magick++/Include.h \
	Magick++/lib/Magick++/Montage.h \
	Magick++/lib/Magick++/Options.h \
	Magick++/lib/Magick++/Pixels.h \
	Magick++/lib/Magick++/STL.h \
	Magick++/lib/Magick++/Thread.h \
	Magick++/lib/Magick++/TypeMetric.h

magickpptopincdir = $(INCLUDE_PATH)
magickpptopinc_HEADERS = \
	Magick++/lib/Magick++.h

magickppinc_HEADERS = \
	Magick++/lib/Magick++/Blob.h \
	Magick++/lib/Magick++/CoderInfo.h \
	Magick++/lib/Magick++/Color.h \
	Magick++/lib/Magick++/Drawable.h \
	Magick++/lib/Magick++/Exception.h \
	Magick++/lib/Magick++/Geometry.h \
	Magick++/lib/Magick++/Image.h \
	Magick++/lib/Magick++/Include.h \
	Magick++/lib/Magick++/Montage.h \
	Magick++/lib/Magick++/Pixels.h \
	Magick++/lib/Magick++/STL.h \
	Magick++/lib/Magick++/TypeMetric.h

Magick___lib_libMagick___la_LDFLAGS = $(MAGICK_LT_RELEASE_OPTS) \
	-version-info $(MAGICK_LIBRARY_CURRENT):$(MAGICK_LIBRARY_REVISION):$(MAGICK_LIBRARY_AGE)
Magick___lib_libMagick___la_LIBADD = $(MAGICKCORE_LIBS) $(MAGICKWAND_LIBS)

MAGICKPP_CHECK_PGRMS = \
	Magick++/demo/analyze \
	Magick++/demo/button \
	Magick++/demo/demo \
	Magick++/demo/detrans \
	Magick++/demo/flip \
	Magick++/demo/gravity \
	Magick++/demo/piddle \
	Magick++/demo/shapes \
	Magick++/demo/zoom \
	Magick++/tests/appendImages \
	Magick++/tests/attributes \
	Magick++/tests/averageImages \
	Magick++/tests/coalesceImages \
	Magick++/tests/coderInfo \
	Magick++/tests/color \
	Magick++/tests/colorHistogram \
	Magick++/tests/exceptions \
	Magick++/tests/montageImages \
	Magick++/tests/morphImages \
	Magick++/tests/readWriteBlob \
	Magick++/tests/readWriteImages

Magick___demo_analyze_SOURCES		      = Magick++/demo/analyze.cpp
Magick___demo_analyze_LDADD		        = $(MAGICKPP_LIBS)

Magick___demo_button_SOURCES		      = Magick++/demo/button.cpp
Magick___demo_button_LDADD		        = $(MAGICKPP_LIBS)

Magick___demo_demo_SOURCES		        = Magick++/demo/demo.cpp
Magick___demo_demo_LDADD		          = $(MAGICKPP_LIBS)

Magick___demo_detrans_SOURCES		      = Magick++/demo/detrans.cpp
Magick___demo_detrans_LDADD		        = $(MAGICKPP_LIBS)

Magick___demo_flip_SOURCES		        = Magick++/demo/flip.cpp
Magick___demo_flip_LDADD		          = $(MAGICKPP_LIBS)

Magick___demo_gravity_SOURCES		      = Magick++/demo/gravity.cpp
Magick___demo_gravity_LDADD		        = $(MAGICKPP_LIBS)

Magick___demo_piddle_SOURCES		      = Magick++/demo/piddle.cpp
Magick___demo_piddle_LDADD		        = $(MAGICKPP_LIBS)

Magick___demo_shapes_SOURCES		      = Magick++/demo/shapes.cpp
Magick___demo_shapes_LDADD		        = $(MAGICKPP_LIBS)

Magick___demo_zoom_SOURCES		        = Magick++/demo/zoom.cpp
Magick___demo_zoom_LDADD		          = $(MAGICKPP_LIBS)

Magick___tests_appendImages_SOURCES	  = Magick++/tests/appendImages.cpp
Magick___tests_appendImages_LDADD	    = $(MAGICKPP_LIBS)

Magick___tests_attributes_SOURCES	    = Magick++/tests/attributes.cpp
Magick___tests_attributes_LDADD		    = $(MAGICKPP_LIBS)

Magick___tests_averageImages_SOURCES  = Magick++/tests/averageImages.cpp
Magick___tests_averageImages_LDADD 	  = $(MAGICKPP_LIBS)

Magick___tests_coalesceImages_SOURCES	= Magick++/tests/coalesceImages.cpp
Magick___tests_coalesceImages_LDADD	  = $(MAGICKPP_LIBS)

Magick___tests_coderInfo_SOURCES	    = Magick++/tests/coderInfo.cpp
Magick___tests_coderInfo_LDADD		    = $(MAGICKPP_LIBS)

Magick___tests_color_SOURCES		      = Magick++/tests/color.cpp
Magick___tests_color_LDADD		        = $(MAGICKPP_LIBS)

Magick___tests_colorHistogram_SOURCES	= Magick++/tests/colorHistogram.cpp
Magick___tests_colorHistogram_LDADD	  = $(MAGICKPP_LIBS)

Magick___tests_exceptions_SOURCES	    = Magick++/tests/exceptions.cpp
Magick___tests_exceptions_LDADD		    = $(MAGICKPP_LIBS)

Magick___tests_montageImages_SOURCES	= Magick++/tests/montageImages.cpp
Magick___tests_montageImages_LDADD	  = $(MAGICKPP_LIBS)

Magick___tests_morphImages_SOURCES	  = Magick++/tests/morphImages.cpp
Magick___tests_morphImages_LDADD	    = $(MAGICKPP_LIBS)

Magick___tests_readWriteBlob_SOURCES	= Magick++/tests/readWriteBlob.cpp
Magick___tests_readWriteBlob_LDADD	  = $(MAGICKPP_LIBS)

Magick___tests_readWriteImages_SOURCES= Magick++/tests/readWriteImages.cpp
Magick___tests_readWriteImages_LDADD  = $(MAGICKPP_LIBS)

MAGICKPP_LOCAL_TARGETS = www/Magick++/NEWS.html www/Magick++/ChangeLog.html

endif

if WITH_PERL

# Build HTML version of news
www/Magick++/NEWS.html: Magick++/NEWS
#	@PERL@ $(top_srcdir)/scripts/txt2html -t 'Magick++ News' < $(srcdir)/NEWS  > $(srcdir)/www/Magick++/NEWS.html
#	echo "Please do a 'cvs commit www/Magick++/NEWS.html' to submit updated HTML file"

# Build HTML version of ChangeLog
www/Magick++/ChangeLog.html: Magick++/ChangeLog
#	@PERL@ $(top_srcdir)/scripts/txt2html -t 'Magick++ ChangeLog' < $(srcdir)/ChangeLog > $(srcdir)/www/Magick++/ChangeLog.html
#	echo "Please do a 'cvs commit www/Magick++/ChangeLog.html' to submit updated HTML file"

else

#all-local:

endif
```

--------------------------------------------------------------------------------

````
