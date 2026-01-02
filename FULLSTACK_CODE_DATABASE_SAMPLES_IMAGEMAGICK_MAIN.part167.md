---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 167
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 167 of 851)

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

---[FILE: type-urw-base35.xml.in]---
Location: ImageMagick-main/config/type-urw-base35.xml.in

```text
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE typemap
[
  <!ELEMENT typemap (type)+>
  <!ATTLIST typemap xmlns CDATA #FIXED ''>
  <!ELEMENT type EMPTY>
  <!ATTLIST type xmlns CDATA #FIXED '' encoding NMTOKEN #IMPLIED
    family CDATA #REQUIRED format NMTOKEN #REQUIRED foundry NMTOKEN #REQUIRED
    fullname CDATA #REQUIRED glyphs CDATA #REQUIRED metrics CDATA #REQUIRED
    name NMTOKEN #REQUIRED stretch NMTOKEN #REQUIRED style NMTOKEN #REQUIRED
    version CDATA #IMPLIED weight CDATA #REQUIRED>
]>
<!--
  ImageMagick DejaVU font configuration.
-->
<typemap>
  <type name="AvantGarde-Book" fullname="AvantGarde Book" family="AvantGarde" foundry="URW" weight="400" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@URWGothic-Book.otf" />
  <type name="AvantGarde-BookOblique" fullname="AvantGarde Book Oblique" family="AvantGarde" foundry="URW" weight="400" style="oblique" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@URWGothic-BookOblique.otf" />
  <type name="AvantGarde-Demi" fullname="AvantGarde DemiBold" family="AvantGarde" foundry="URW" weight="600" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@URWGothic-Demi.otf" />
  <type name="AvantGarde-DemiOblique" fullname="AvantGarde DemiOblique" family="AvantGarde" foundry="URW" weight="600" style="oblique" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@URWGothic-DemiOblique.otf" />
  <type name="Bookman-Demi" fullname="Bookman DemiBold" family="Bookman" foundry="URW" weight="600" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@URWBookman-Demi.otf" />
  <type name="Bookman-DemiItalic" fullname="Bookman DemiBold Italic" family="Bookman" foundry="URW" weight="600" style="italic" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@URWBookman-DemiItalic.otf" />
  <type name="Bookman-Light" fullname="Bookman Light" family="Bookman" foundry="URW" weight="300" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@URWBookman-Light.otf" />
  <type name="Bookman-LightItalic" fullname="Bookman Light Italic" family="Bookman" foundry="URW" weight="300" style="italic" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@URWBookman-LightItalic.otf" />
  <type name="Courier-Bold" fullname="Courier Bold" family="Courier" foundry="URW" weight="700" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@NimbusMonoPS-Bold.otf" />
  <type name="Courier-BoldOblique" fullname="Courier Bold Oblique" family="Courier" foundry="URW" weight="700" style="oblique" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@NimbusMonoPS-BoldItalic.otf" />
  <type name="Courier" fullname="Courier Regular" family="Courier" foundry="URW" weight="400" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@NimbusMonoPS-Regular.otf" />
  <type name="Courier-Oblique" fullname="Courier Regular Oblique" family="Courier" foundry="URW" weight="400" style="oblique" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@NimbusMonoPS-Italic.otf" />
  <type name="Helvetica-Bold" fullname="Helvetica Bold" family="Helvetica" foundry="URW" weight="700" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@NimbusSans-Bold.otf" />
  <type name="Helvetica-BoldOblique" fullname="Helvetica Bold Italic" family="Helvetica" foundry="URW" weight="700" style="italic" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@NimbusSans-BoldItalic.otf" />
  <type name="Helvetica" fullname="Helvetica Regular" family="Helvetica" foundry="URW" weight="400" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@NimbusSans-Regular.otf" />
  <type name="Helvetica-Narrow-Bold" fullname="Helvetica Narrow Bold" family="Helvetica Narrow" foundry="URW" weight="700" style="normal" stretch="condensed" format="opentype" glyphs="@urw_base35_font_dir@NimbusSansNarrow-Bold.otf" />
  <type name="Helvetica-Narrow-BoldOblique" fullname="Helvetica Narrow Bold Oblique" family="Helvetica Narrow" foundry="URW" weight="700" style="oblique" stretch="condensed" format="opentype" glyphs="@urw_base35_font_dir@NimbusSansNarrow-BoldOblique.otf" />
  <type name="Helvetica-Narrow" fullname="Helvetica Narrow" family="Helvetica Narrow" foundry="URW" weight="400" style="normal" stretch="condensed" format="opentype" glyphs="@urw_base35_font_dir@NimbusSansNarrow-Regular.otf" />
  <type name="Helvetica-Narrow-Oblique" fullname="Helvetica Narrow Oblique" family="Helvetica Narrow" foundry="URW" weight="400" style="oblique" stretch="condensed" format="opentype" glyphs="@urw_base35_font_dir@NimbusSansNarrow-Oblique.otf" />
  <type name="Helvetica-Oblique" fullname="Helvetica Regular Italic" family="Helvetica" foundry="URW" weight="400" style="italic" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@NimbusSans-Italic.otf" />
  <type name="NewCenturySchlbk-Bold" fullname="New Century Schoolbook Bold" family="NewCenturySchlbk" foundry="URW" weight="700" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@C059-Bold.otf" />
  <type name="NewCenturySchlbk-BoldItalic" fullname="New Century Schoolbook Bold Italic" family="NewCenturySchlbk" foundry="URW" weight="700" style="italic" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@C059-BdIta.otf" />
  <type name="NewCenturySchlbk-Italic" fullname="New Century Schoolbook Italic" family="NewCenturySchlbk" foundry="URW" weight="400" style="italic" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@C059-Italic.otf" />
  <type name="NewCenturySchlbk-Roman" fullname="New Century Schoolbook" family="NewCenturySchlbk" foundry="URW" weight="400" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@C059-Roman.otf" />
  <type name="Palatino-Bold" fullname="Palatino Bold" family="Palatino" foundry="URW" weight="700" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@P052-Bold.otf" />
  <type name="Palatino-BoldItalic" fullname="Palatino Bold Italic" family="Palatino" foundry="URW" weight="700" style="italic" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@P052-BoldItalic.otf" />
  <type name="Palatino-Italic" fullname="Palatino Italic" family="Palatino" foundry="URW" weight="400" style="italic" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@P052-Italic.otf" />
  <type name="Palatino-Roman" fullname="Palatino Regular" family="Palatino" foundry="URW" weight="400" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@P052-Roman.otf" />
  <type name="Symbol" fullname="Symbol" family="Symbol" foundry="URW" weight="400" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@StandardSymbolsPS.otf" version="0.1" encoding="AdobeCustom" />
  <type name="Times-Bold" fullname="Times Medium" family="Times" foundry="URW" weight="700" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@NimbusRoman-Bold.otf" />
  <type name="Times-BoldItalic" fullname="Times Medium Italic" family="Times" foundry="URW" weight="700" style="italic" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@NimbusRoman-BoldItalic.otf" />
  <type name="Times-Italic" fullname="Times Regular Italic" family="Times" foundry="URW" weight="400" style="italic" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@NimbusRoman-Italic.otf" />
  <type name="Times-Roman" fullname="Times Regular" family="Times" foundry="URW" weight="400" style="normal" stretch="normal" format="opentype" glyphs="@urw_base35_font_dir@NimbusRoman-Regular.otf" />
</typemap>
```

--------------------------------------------------------------------------------

---[FILE: type-windows.xml.in]---
Location: ImageMagick-main/config/type-windows.xml.in

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE typemap [
<!ELEMENT typemap (type)+>
<!ELEMENT type (#PCDATA)>
<!ELEMENT include (#PCDATA)>
<!ATTLIST type name CDATA #REQUIRED>
<!ATTLIST type fullname CDATA #IMPLIED>
<!ATTLIST type family CDATA #IMPLIED>
<!ATTLIST type foundry CDATA #IMPLIED>
<!ATTLIST type weight CDATA #IMPLIED>
<!ATTLIST type style CDATA #IMPLIED>
<!ATTLIST type stretch CDATA #IMPLIED>
<!ATTLIST type format CDATA #IMPLIED>
<!ATTLIST type metrics CDATA #IMPLIED>
<!ATTLIST type glyphs CDATA #REQUIRED>
<!ATTLIST type version CDATA #IMPLIED>
<!ATTLIST include file CDATA #REQUIRED>
]>
<!--
  ImageMagick Windows font configuration.
-->
<typemap>
  <type name="Arial" fullname="Arial" family="Arial" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@arial.ttf"/>
  <type name="Arial-Black" fullname="Arial Black" family="Arial" weight="900" style="normal" stretch="normal" glyphs="@windows_font_dir@ariblk.ttf"/>
  <type name="Arial-Bold" fullname="Arial Bold" family="Arial" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@arialbd.ttf"/>
  <type name="Arial-Bold-Italic" fullname="Arial Bold Italic" family="Arial" weight="700" style="italic" stretch="normal" glyphs="@windows_font_dir@arialbi.ttf"/>
  <type name="Arial-Italic" fullname="Arial Italic" family="Arial" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@ariali.ttf"/>
  <type name="Arial-Narrow" fullname="Arial Narrow" family="Arial Narrow" weight="400" style="normal" stretch="condensed" glyphs="@windows_font_dir@arialn.ttf"/>
  <type name="Arial-Narrow-Bold" fullname="Arial Narrow Bold" family="Arial Narrow" weight="700" style="normal" stretch="condensed" glyphs="@windows_font_dir@arialnb.ttf"/>
  <type name="Arial-Narrow-Bold-Italic" fullname="Arial Narrow Bold Italic" family="Arial Narrow" weight="700" style="italic" stretch="condensed" glyphs="@windows_font_dir@arialnbi.ttf"/>
  <type name="Arial-Narrow-Italic" fullname="Arial Narrow Italic" family="Arial Narrow" weight="400" style="italic" stretch="condensed" glyphs="@windows_font_dir@arnari.ttf"/>
  <type name="Arial-Narrow-Special-G1" fullname="Arial Narrow Special G1" family="Arial Narrow Special G1" weight="400" style="normal" stretch="condensed" glyphs="@windows_font_dir@msgeonr1.ttf"/>
  <type name="Arial-Narrow-Special-G1-Bold" fullname="Arial Narrow Special G1 Bold" family="Arial Narrow Special G1" weight="700" style="normal" stretch="condensed" glyphs="@windows_font_dir@msgeonb1.ttf"/>
  <type name="Arial-Narrow-Special-G1-Italic" fullname="Arial Narrow Special G1 Italic" family="Arial Narrow Special G1" weight="400" style="italic" stretch="condensed" glyphs="@windows_font_dir@msgeoni1.ttf"/>
  <type name="Arial-Narrow-Special-G2" fullname="Arial Narrow Special G2" family="Arial Narrow Special G2" weight="400" style="normal" stretch="condensed" glyphs="@windows_font_dir@msgeonr2.ttf"/>
  <type name="Arial-Narrow-Special-G2-Bold" fullname="Arial Narrow Special G2 Bold" family="Arial Narrow Special G2" weight="700" style="Narrow" stretch="normal" glyphs="@windows_font_dir@msgeonb2.ttf"/>
  <type name="Arial-Narrow-Special-G2-Italic" fullname="Arial Narrow Special G2 Italic" family="Arial Narrow Special G2" weight="400" style="italic" stretch="condensed" glyphs="@windows_font_dir@msgeoni2.ttf"/>
  <type name="Arial-Rounded-MT-Bold" fullname="Arial Rounded MT Bold" family="Arial Rounded MT" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@arlrdbd.ttf"/>
  <type name="Arial-Special-G1" fullname="Arial Special G1" family="Arial Special G1" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@msgeor1.ttf"/>
  <type name="Arial-Special-G1-Bold" fullname="Arial Special G1 Bold" family="Arial Special G1" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@msgeoab1.ttf"/>
  <type name="Arial-Special-G1-Bold-Italic" fullname="Arial Special G1 Bold Italic" family="Arial Special G1" weight="700" style="italic" stretch="normal" glyphs="@windows_font_dir@msgeoax1.ttf"/>
  <type name="Arial-Special-G1-Italic" fullname="Arial Special G1 Italic" family="Arial Special G1" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@msgeoai1.ttf"/>
  <type name="Arial-Special-G2" fullname="Arial Special G2" family="Arial Special G2" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@msgeoar2.ttf"/>
  <type name="Arial-Special-G2-Bold" fullname="Arial Special G2 Bold" family="Arial Special G2" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@msgeoab2.ttf"/>
  <type name="Arial-Special-G2-Bold-Italic" fullname="Arial Special G2 Bold Italic" family="Arial Special G2" weight="700" style="italic" stretch="normal" glyphs="@windows_font_dir@msgeoax2.ttf"/>
  <type name="Arial-Special-G2-Italic" fullname="Arial Special G2 Italic" family="Arial Special G2" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@msgeoai2.ttf"/>
  <type name="Bookman-Old-Style" fullname="Bookman Old Style" family="Bookman Old Style" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@bkmnos.ttf"/>
  <type name="Bookman-Old-Style-Bold" fullname="Bookman Old Style Bold" family="Bookman Old Style" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@bookosb.ttf"/>
  <type name="Bookman-Old-Style-Bold-Italic" fullname="Bookman Old Style Bold Italic" family="Bookman Old Style" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@bookosbi.ttf"/>
  <type name="Bookman-Old-Style-Italic" fullname="Bookman Old Style Italic" family="Bookman Old Style" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@boookosi.ttf"/>
  <type name="Century-Schoolbook" fullname="Century Schoolbook" family="Century Schoolbook" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@censcbk.ttf"/>
  <type name="Century-Schoolbook-Bold" fullname="Century Schoolbook Bold" family="Century Schoolbook" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@schlbkb.ttf"/>
  <type name="Century-Schoolbook-Bold-Italic" fullname="Century Schoolbook Bold Italic" family="Century Schoolbook" weight="700" style="italic" stretch="normal" glyphs="@windows_font_dir@schlbkbi.ttf"/>
  <type name="Century-Schoolbook-Italic" fullname="Century Schoolbook Italic" family="Century Schoolbook" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@schlbki.ttf"/>
  <type name="Comic-Sans-MS" fullname="Comic Sans MS" family="Comic Sans MS" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@comic.ttf"/>
  <type name="Comic-Sans-MS-Bold" fullname="Comic Sans MS Bold" family="Comic Sans MS" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@comicbd.ttf"/>
  <type name="Courier-New" fullname="Courier New" family="Courier New" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@cour.ttf"/>
  <type name="Courier-New-Bold" fullname="Courier New Bold" family="Courier New" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@courbd.ttf"/>
  <type name="Courier-New-Bold-Italic" fullname="Courier New Bold Italic" family="Courier New" weight="700" style="italic" stretch="normal" glyphs="@windows_font_dir@courbi.ttf"/>
  <type name="Courier-New-Italic" fullname="Courier New Italic" family="Courier New" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@couri.ttf"/>
  <type name="Garamond" fullname="Garamond" family="Garamond" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@gara.ttf"/>
  <type name="Garamond-Bold" fullname="Garamond Bold" family="Garamond" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@garabd.ttf"/>
  <type name="Garamond-Italic" fullname="Garamond Italic" family="Garamond" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@Italic"/>
  <type name="Gill-Sans-MT-Ext-Condensed-Bold" fullname="Gill Sans MT Ext Condensed Bold" family="Gill Sans MT" weight="700" style="normal" stretch="extra-condensed" glyphs="@windows_font_dir@glsnecb.ttf"/>
  <type name="Impact" fullname="Impact" family="Impact" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@impact.ttf"/>
  <type name="Lucida-Blackletter" fullname="Lucida Blackletter" family="Lucida Blackletter" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@lblack.ttf"/>
  <type name="Lucida-Bright" fullname="Lucida Bright" family="Lucida Bright" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@lbrite.ttf"/>
  <type name="Lucida-Bright-Demibold" fullname="Lucida Bright Demibold" family="Lucida Bright" weight="600" style="normal" stretch="normal" glyphs="@windows_font_dir@lbrited.ttf"/>
  <type name="Lucida-Bright-Demibold-Italic" fullname="Lucida Bright Demibold Italic" family="Lucida Bright" weight="600" style="italic" stretch="normal" glyphs="@windows_font_dir@lbritedi.ttf"/>
  <type name="Lucida-Bright-Italic" fullname="Lucida Bright Italic" family="Lucida Bright" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@lbritei.ttf"/>
  <type name="Lucida-Caligraphy-Italic" fullname="Lucida Caligraphy Italic" family="Lucida Caligraphy" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@lcalig.ttf"/>
  <type name="Lucida-Console, Lucida-Console" fullname="Lucida Console, Lucida Console" family="Regular" weight="400" style="lucon.ttf" stretch="normal" glyphs="@windows_font_dir@"/>
  <type name="Lucida-Fax-Demibold" fullname="Lucida Fax Demibold" family="Lucida Fax" weight="600" style="normal" stretch="normal" glyphs="@windows_font_dir@lfaxd.ttf"/>
  <type name="Lucida-Fax-Demibold-Italic" fullname="Lucida Fax Demibold Italic" family="Lucida Fax" weight="600" style="italic" stretch="normal" glyphs="@windows_font_dir@lfaxdi.ttf"/>
  <type name="Lucida-Fax-Italic" fullname="Lucida Fax Italic" family="Lucida Fax" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@lfaxi.ttf"/>
  <type name="Lucida-Fax-Regular" fullname="Lucida Fax Regular" family="Lucida Fax" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@lfax.ttf"/>
  <type name="Lucida-Handwriting-Italic" fullname="Lucida Handwriting Italic" family="Lucida Handwriting" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@lhandw.ttf"/>
  <type name="Lucida-Sans-Demibold-Italic" fullname="Lucida Sans Demibold Italic" family="Lucida Sans" weight="600" style="italic" stretch="normal" glyphs="@windows_font_dir@lsansdi.ttf"/>
  <type name="Lucida-Sans-Demibold-Roman" fullname="Lucida Sans Demibold Roman" family="Lucida Sans Demibold" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@lsansd.ttf"/>
  <type name="Lucida-Sans-Regular" fullname="Lucida Sans Regular" family="Lucida Sans" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@lsans.ttf"/>
  <type name="Lucida-Sans-Typewriter-Bold" fullname="Lucida Sans Typewriter Bold" family="Lucida Sans Typewriter" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@ltypeb.ttf"/>
  <type name="Lucida-Sans-Typewriter-Bold-Oblique" fullname="Lucida Sans Typewriter Bold Oblique" family="Lucida Sans Typewriter" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@ltypebo.ttf"/>
  <type name="Lucida-Sans-Typewriter-Oblique" fullname="Lucida Sans Typewriter Oblique" family="Lucida Sans Typewriter" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@ltypeo.ttf"/>
  <type name="Lucida-Sans-Typewriter-Regular" fullname="Lucida Sans Typewriter Regular" family="Lucida Sans Typewriter" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@ltype.ttf"/>
  <type name="MS-Sans-Serif" fullname="MS Sans Serif" family="MS Sans Serif" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@sseriff.ttf"/>
  <type name="MS-Serif" fullname="MS Serif" family="MS Serif" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@seriff.ttf"/>
  <type name="Modern" fullname="Modern" family="Modern" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@modern.ttf"/>
  <type name="Monotype-Corsiva" fullname="Monotype Corsiva" family="Monotype Corsiva" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@mtcorsva.ttf"/>
  <type name="Small-Fonts" fullname="Small Fonts" family="Small Fonts" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@smallf.ttf"/>
  <type name="Symbol" fullname="Symbol" family="Symbol" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@symbol.ttf" encoding="AppleRoman"/>
  <type name="Tahoma" fullname="Tahoma" family="Tahoma" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@tahoma.ttf"/>
  <type name="Tahoma-Bold" fullname="Tahoma Bold" family="Tahoma" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@tahomabd.ttf"/>
  <type name="Times-New-Roman" fullname="Times New Roman" family="Times New Roman" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@times.ttf"/>
  <type name="Times-New-Roman-Bold" fullname="Times New Roman Bold" family="Times New Roman" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@timesbd.ttf"/>
  <type name="Times-New-Roman-Bold-Italic" fullname="Times New Roman Bold Italic" family="Times New Roman" weight="700" style="italic" stretch="normal" glyphs="@windows_font_dir@timesbi.ttf"/>
  <type name="Times-New-Roman-Italic" fullname="Times New Roman Italic" family="Times New Roman" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@timesi.ttf"/>
  <type name="Times-New-Roman-MT-Extra-Bold" fullname="Times New Roman MT Extra Bold" family="Times New Roman MT" weight="800" style="normal" stretch="normal" glyphs="@windows_font_dir@timnreb.ttf"/>
  <type name="Verdana" fullname="Verdana" family="Verdana" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@verdana.ttf"/>
  <type name="Verdana-Bold" fullname="Verdana Bold" family="Verdana" weight="700" style="normal" stretch="normal" glyphs="@windows_font_dir@verdanab.ttf"/>
  <type name="Verdana-Bold-Italic" fullname="Verdana Bold Italic" family="Verdana" weight="700" style="italic" stretch="normal" glyphs="@windows_font_dir@verdanaz.ttf"/>
  <type name="Verdana-Italic" fullname="Verdana Italic" family="Verdana" weight="400" style="italic" stretch="normal" glyphs="@windows_font_dir@verdanai.ttf"/>
  <type name="Wingdings" fullname="Wingdings" family="Wingdings" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@wingding.ttf" encoding="AppleRoman"/>
  <type name="Wingdings-2" fullname="Wingdings 2" family="Wingdings 2" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@wingdng2.ttf" encoding="AppleRoman"/>
  <type name="Wingdings-3" fullname="Wingdings 3" family="Wingdings 3" weight="400" style="normal" stretch="normal" glyphs="@windows_font_dir@wingdng3.ttf" encoding="AppleRoman"/>
</typemap>
```

--------------------------------------------------------------------------------

---[FILE: type.xml.in]---
Location: ImageMagick-main/config/type.xml.in

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE typemap [
  <!ELEMENT typemap (type)+>
  <!ATTLIST typemap xmlns CDATA #FIXED ''>
  <!ELEMENT type EMPTY>
  <!ATTLIST type xmlns CDATA #FIXED '' encoding NMTOKEN #IMPLIED
    family CDATA #REQUIRED format NMTOKEN #REQUIRED foundry NMTOKEN #REQUIRED
    fullname CDATA #REQUIRED glyphs CDATA #REQUIRED metrics CDATA #REQUIRED
    name NMTOKEN #REQUIRED stretch NMTOKEN #REQUIRED style NMTOKEN #REQUIRED
    version CDATA #IMPLIED weight CDATA #REQUIRED>
]>
<!--
  ImageMagick font configuration.
-->
<typemap>
  @type_include_files@
</typemap>
```

--------------------------------------------------------------------------------

---[FILE: analyze.c]---
Location: ImageMagick-main/filters/analyze.c

```c
/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                AAA   N   N   AAA   L      Y   Y  ZZZZZ  EEEEE               %
%               A   A  NN  N  A   A  L       Y Y      ZZ  E                   %
%               AAAAA  N N N  AAAAA  L        Y     ZZZ   EEE                 %
%               A   A  N  NN  A   A  L        Y    ZZ     E                   %
%               A   A  N   N  A   A  LLLLL    Y    ZZZZZ  EEEEE               %
%                                                                             %
%                             Analyze An Image                                %
%                                                                             %
%                             Software Design                                 %
%                               Bill Corbis                                   %
%                              December 1998                                  %
%                                                                             %
%                                                                             %
%  Copyright 1999 ImageMagick Studio LLC, a non-profit organization           %
%  dedicated to making software imaging solutions freely available.           %
%                                                                             %
%  You may not use this file except in compliance with the License.  You may  %
%  obtain a copy of the License at                                            %
%                                                                             %
%    https://imagemagick.org/script/license.php                               %
%                                                                             %
%  Unless required by applicable law or agreed to in writing, software        %
%  distributed under the License is distributed on an "AS IS" BASIS,          %
%  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   %
%  See the License for the specific language governing permissions and        %
%  limitations under the License.                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
*/

/*
  Include declarations.
*/
#include "MagickCore/studio.h"
#include "MagickCore/MagickCore.h"

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                                             %
%                                                                             %
%                                                                             %
%   a n a l y z e I m a g e                                                   %
%                                                                             %
%                                                                             %
%                                                                             %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%  analyzeImage() computes the brightness and saturation mean,  standard
%  deviation, kurtosis and skewness and stores these values as attributes 
%  of the image.
%
%  The format of the analyzeImage method is:
%
%      size_t analyzeImage(Image *images,const int argc,char **argv,
%        ExceptionInfo *exception)
%
%  A description of each parameter follows:
%
%    o image: the address of a structure of type Image.
%
%    o argc: Specifies a pointer to an integer describing the number of
%      elements in the argument vector.
%
%    o argv: Specifies a pointer to a text array containing the command line
%      arguments.
%
%    o exception: return any errors or warnings in this structure.
%
*/

typedef struct _StatisticsInfo
{
  double
    area,
    brightness,
    mean,
    standard_deviation,
    sum[5],
    kurtosis,
    skewness;
} StatisticsInfo;

#if defined(MAGICKCORE_OPENMP_SUPPORT)
static inline int GetMagickNumberThreads(const Image *source,
  const Image *destination,const size_t chunk,int multithreaded)
{
#define MagickMax(x,y)  (((x) > (y)) ? (x) : (y))
#define MagickMin(x,y)  (((x) < (y)) ? (x) : (y))

  /*
    Number of threads bounded by the amount of work and any thread resource
    limit.  The limit is 2 if the pixel cache type is not memory or
    memory-mapped.
  */
  if (multithreaded == 0)
    return(1);
  if (((GetImagePixelCacheType(source) != MemoryCache) &&
       (GetImagePixelCacheType(source) != MapCache)) ||
      ((GetImagePixelCacheType(destination) != MemoryCache) &&
       (GetImagePixelCacheType(destination) != MapCache)))
    return(MagickMax(MagickMin((int) GetMagickResourceLimit(ThreadResource),2),1));
  return(MagickMax(MagickMin((int) GetMagickResourceLimit(ThreadResource),
    (int) (chunk)/64),1));
}
#endif

ModuleExport size_t analyzeImage(Image **images,const int argc,
  const char **argv,ExceptionInfo *exception)
{
#define AnalyzeImageFilterTag  "Filter/Analyze"

  char
    text[MagickPathExtent];

  Image
    *image;

  MagickBooleanType
    status;

  MagickOffsetType
    progress;

  assert(images != (Image **) NULL);
  assert(*images != (Image *) NULL);
  assert((*images)->signature == MagickCoreSignature);
  (void) argc;
  (void) argv;
  image=(*images);
  status=MagickTrue;
  progress=0;
  for ( ; image != (Image *) NULL; image=GetNextImageInList(image))
  {
    CacheView
      *image_view;

    double
      area;

    ssize_t
      y;

    StatisticsInfo
      brightness,
      saturation;

    if (status == MagickFalse)
      continue;
    (void) memset(&brightness,0,sizeof(brightness));
    (void) memset(&saturation,0,sizeof(saturation));
    status=MagickTrue;
    image_view=AcquireVirtualCacheView(image,exception);
#if defined(MAGICKCORE_OPENMP_SUPPORT)
  #pragma omp parallel for schedule(static) \
    shared(progress,status,brightness,saturation) \
    num_threads(GetMagickNumberThreads(image,image,image->rows,1))
#endif
    for (y=0; y < (ssize_t) image->rows; y++)
    {
      const Quantum
        *p;

      ssize_t
        i,
        x;

      StatisticsInfo
        local_brightness,
        local_saturation;

      if (status == MagickFalse)
        continue;
      p=GetCacheViewVirtualPixels(image_view,0,y,image->columns,1,exception);
      if (p == (const Quantum *) NULL)
        {
          status=MagickFalse;
          continue;
        }
      (void) memset(&local_brightness,0,sizeof(local_brightness));
      (void) memset(&local_saturation,0,sizeof(local_saturation));
      for (x=0; x < (ssize_t) image->columns; x++)
      {
        double
          b,
          h,
          s;

        ConvertRGBToHSL(GetPixelRed(image,p),GetPixelGreen(image,p),
          GetPixelBlue(image,p),&h,&s,&b);
        b*=(double) QuantumRange;
        for (i=1; i <= 4; i++)
          local_brightness.sum[i]+=pow(b,(double) i);
        s*=(double) QuantumRange;
        for (i=1; i <= 4; i++)
          local_saturation.sum[i]+=pow(s,(double) i);
        p+=(ptrdiff_t) GetPixelChannels(image);
      }
#if defined(MAGICKCORE_OPENMP_SUPPORT)
      #pragma omp critical (analyzeImage)
#endif
      for (i=1; i <= 4; i++)
      {
        brightness.sum[i]+=local_brightness.sum[i];
        saturation.sum[i]+=local_saturation.sum[i];
      }
    }
    image_view=DestroyCacheView(image_view);
    area=(double) image->columns*image->rows;
    brightness.mean=brightness.sum[1]/area;
    (void) FormatLocaleString(text,MagickPathExtent,"%g",brightness.mean);
    (void) SetImageProperty(image,"filter:brightness:mean",text,exception);
    brightness.standard_deviation=sqrt(brightness.sum[2]/area-
      (brightness.sum[1]/area*brightness.sum[1]/area));
    (void) FormatLocaleString(text,MagickPathExtent,"%g",
      brightness.standard_deviation);
    (void) SetImageProperty(image,"filter:brightness:standard-deviation",text,
      exception);
    if (fabs(brightness.standard_deviation) >= MagickEpsilon)
      brightness.kurtosis=(brightness.sum[4]/area-4.0*brightness.mean*
        brightness.sum[3]/area+6.0*brightness.mean*brightness.mean*
        brightness.sum[2]/area-3.0*brightness.mean*brightness.mean*
        brightness.mean*brightness.mean)/(brightness.standard_deviation*
        brightness.standard_deviation*brightness.standard_deviation*
        brightness.standard_deviation)-3.0;
    (void) FormatLocaleString(text,MagickPathExtent,"%g",brightness.kurtosis);
    (void) SetImageProperty(image,"filter:brightness:kurtosis",text,exception);
    if (brightness.standard_deviation != 0)
      brightness.skewness=(brightness.sum[3]/area-3.0*brightness.mean*
        brightness.sum[2]/area+2.0*brightness.mean*brightness.mean*
        brightness.mean)/(brightness.standard_deviation*
        brightness.standard_deviation*brightness.standard_deviation);
    (void) FormatLocaleString(text,MagickPathExtent,"%g",brightness.skewness);
    (void) SetImageProperty(image,"filter:brightness:skewness",text,exception);
    saturation.mean=saturation.sum[1]/area;
    (void) FormatLocaleString(text,MagickPathExtent,"%g",saturation.mean);
    (void) SetImageProperty(image,"filter:saturation:mean",text,exception);
    saturation.standard_deviation=sqrt(saturation.sum[2]/area-
      (saturation.sum[1]/area*saturation.sum[1]/area));
    (void) FormatLocaleString(text,MagickPathExtent,"%g",
      saturation.standard_deviation);
    (void) SetImageProperty(image,"filter:saturation:standard-deviation",text,
      exception);
    if (fabs(saturation.standard_deviation) >= MagickEpsilon)
      saturation.kurtosis=(saturation.sum[4]/area-4.0*saturation.mean*
        saturation.sum[3]/area+6.0*saturation.mean*saturation.mean*
        saturation.sum[2]/area-3.0*saturation.mean*saturation.mean*
        saturation.mean*saturation.mean)/(saturation.standard_deviation*
        saturation.standard_deviation*saturation.standard_deviation*
        saturation.standard_deviation)-3.0;
    (void) FormatLocaleString(text,MagickPathExtent,"%g",saturation.kurtosis);
    (void) SetImageProperty(image,"filter:saturation:kurtosis",text,exception);
    if (fabs(saturation.standard_deviation) >= MagickEpsilon)
      saturation.skewness=(saturation.sum[3]/area-3.0*saturation.mean*
        saturation.sum[2]/area+2.0*saturation.mean*saturation.mean*
        saturation.mean)/(saturation.standard_deviation*
        saturation.standard_deviation*saturation.standard_deviation);
    (void) FormatLocaleString(text,MagickPathExtent,"%g",saturation.skewness);
    (void) SetImageProperty(image,"filter:saturation:skewness",text,exception);
    if (image->progress_monitor != (MagickProgressMonitor) NULL)
      {
        MagickBooleanType
          proceed;

#if defined(MAGICKCORE_OPENMP_SUPPORT)
        #pragma omp atomic
#endif
        progress++;
        proceed=SetImageProgress(image,AnalyzeImageFilterTag,progress,
          GetImageListLength(image));
        if (proceed == MagickFalse)
          status=MagickFalse;
      }
  }
  return(MagickImageFilterSignature);
}
```

--------------------------------------------------------------------------------

---[FILE: Makefile.am]---
Location: ImageMagick-main/filters/Makefile.am

```text
#  Copyright 1999 ImageMagick Studio LLC, a non-profit organization
#  dedicated to making software imaging solutions freely available.
#
#  You may not use this file except in compliance with the License.  You may
#  obtain a copy of the License at
#
#    https://imagemagick.org/script/license.php
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#
#  Makefile for building ImageMagick filter modules.

# Where filter modules get installed
filtersdir = $(FILTER_PATH)

MAGICK_FILTER_CPPFLAGS = $(AM_CPPFLAGS)

MAGICKCORE_FILTER_SRCS = \
  filters/analyze.c

if WITH_MODULES
filters_LTLIBRARIES = \
  filters/analyze.la
else
filters_LTLIBRARIES =
endif # WITH_MODULES
filters_CPPFLAGS = $(MAGICK_FILTER_CPPFLAGS)

# analyze filter module
filters_analyze_la_SOURCES      = filters/analyze.c
filters_analyze_la_CPPFLAGS     = $(MAGICK_FILTER_CPPFLAGS)
filters_analyze_la_LDFLAGS      = $(MODULECOMMONFLAGS)
filters_analyze_la_LIBADD       = $(MAGICKCORE_LIBS) $(MATH_LIBS)
```

--------------------------------------------------------------------------------

````
