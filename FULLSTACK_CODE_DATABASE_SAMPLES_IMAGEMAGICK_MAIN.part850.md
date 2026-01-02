---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 850
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 850 of 851)

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

---[FILE: type-ghostscript.xml]---
Location: ImageMagick-main/www/source/type-ghostscript.xml

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
  ImageMagick Ghostscript font configuration.
-->
<typemap>
  <type name="AvantGarde-Book" fullname="AvantGarde Book" family="AvantGarde" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/a010013l.afm" glyphs="/usr/share/fonts/default/Type1/a010013l.pfb"/>
  <type name="AvantGarde-BookOblique" fullname="AvantGarde Book Oblique" family="AvantGarde" foundry="URW" weight="400" style="oblique" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/a010033l.afm" glyphs="/usr/share/fonts/default/Type1/a010033l.pfb"/>
  <type name="AvantGarde-Demi" fullname="AvantGarde DemiBold" family="AvantGarde" foundry="URW" weight="600" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/a010015l.afm" glyphs="/usr/share/fonts/default/Type1/a010015l.pfb"/>
  <type name="AvantGarde-DemiOblique" fullname="AvantGarde DemiOblique" family="AvantGarde" foundry="URW" weight="600" style="oblique" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/a010035l.afm" glyphs="/usr/share/fonts/default/Type1/a010035l.pfb"/>
  <type name="Bookman-Demi" fullname="Bookman DemiBold" family="Bookman" foundry="URW" weight="600" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/b018015l.afm" glyphs="/usr/share/fonts/default/Type1/b018015l.pfb"/>
  <type name="Bookman-DemiItalic" fullname="Bookman DemiBold Italic" family="Bookman" foundry="URW" weight="600" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/b018035l.afm" glyphs="/usr/share/fonts/default/Type1/b018035l.pfb"/>
  <type name="Bookman-Light" fullname="Bookman Light" family="Bookman" foundry="URW" weight="300" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/b018012l.afm" glyphs="/usr/share/fonts/default/Type1/b018012l.pfb"/>
  <type name="Bookman-LightItalic" fullname="Bookman Light Italic" family="Bookman" foundry="URW" weight="300" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/b018032l.afm" glyphs="/usr/share/fonts/default/Type1/b018032l.pfb"/>
  <type name="Courier" fullname="Courier Regular" family="Courier" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/n022003l.afm" glyphs="/usr/share/fonts/default/Type1/n022003l.pfb"/>
  <type name="Courier-Bold" fullname="Courier Bold" family="Courier" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/n022004l.afm" glyphs="/usr/share/fonts/default/Type1/n022004l.pfb"/>
  <type name="Courier-Oblique" fullname="Courier Regular Oblique" family="Courier" foundry="URW" weight="400" style="oblique" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/n022023l.afm" glyphs="/usr/share/fonts/default/Type1/n022023l.pfb"/>
  <type name="Courier-BoldOblique" fullname="Courier Bold Oblique" family="Courier" foundry="URW" weight="700" style="oblique" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/n022024l.afm" glyphs="/usr/share/fonts/default/Type1/n022024l.pfb"/>
  <type name="fixed" fullname="Helvetica Regular" family="Helvetica" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/n019003l.afm" glyphs="/usr/share/fonts/default/Type1/n019003l.pfb"/>
  <type name="Helvetica" fullname="Helvetica Regular" family="Helvetica" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/n019003l.afm" glyphs="/usr/share/fonts/default/Type1/n019003l.pfb"/>
  <type name="Helvetica-Bold" fullname="Helvetica Bold" family="Helvetica" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/n019004l.afm" glyphs="/usr/share/fonts/default/Type1/n019004l.pfb"/>
  <type name="Helvetica-Oblique" fullname="Helvetica Regular Italic" family="Helvetica" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/n019023l.afm" glyphs="/usr/share/fonts/default/Type1/n019023l.pfb"/>
  <type name="Helvetica-BoldOblique" fullname="Helvetica Bold Italic" family="Helvetica" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/n019024l.afm" glyphs="/usr/share/fonts/default/Type1/n019024l.pfb"/>
  <type name="Helvetica-Narrow" fullname="Helvetica Narrow" family="Helvetica Narrow" foundry="URW" weight="400" style="normal" stretch="condensed" format="type1" metrics="/usr/share/fonts/default/Type1/n019043l.afm" glyphs="/usr/share/fonts/default/Type1/n019043l.pfb"/>
  <type name="Helvetica-Narrow-Oblique" fullname="Helvetica Narrow Oblique" family="Helvetica Narrow" foundry="URW" weight="400" style="oblique" stretch="condensed" format="type1" metrics="/usr/share/fonts/default/Type1/n019063l.afm" glyphs="/usr/share/fonts/default/Type1/n019063l.pfb"/>
  <type name="Helvetica-Narrow-Bold" fullname="Helvetica Narrow Bold" family="Helvetica Narrow" foundry="URW" weight="700" style="normal" stretch="condensed" format="type1" metrics="/usr/share/fonts/default/Type1/n019044l.afm" glyphs="/usr/share/fonts/default/Type1/n019044l.pfb"/>
  <type name="Helvetica-Narrow-BoldOblique" fullname="Helvetica Narrow Bold Oblique" family="Helvetica Narrow" foundry="URW" weight="700" style="oblique" stretch="condensed" format="type1" metrics="/usr/share/fonts/default/Type1/n019064l.afm" glyphs="/usr/share/fonts/default/Type1/n019064l.pfb"/>
  <type name="NewCenturySchlbk-Roman" fullname="New Century Schoolbook" family="NewCenturySchlbk" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/c059013l.afm" glyphs="/usr/share/fonts/default/Type1/c059013l.pfb"/>
  <type name="NewCenturySchlbk-Italic" fullname="New Century Schoolbook Italic" family="NewCenturySchlbk" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/c059033l.afm" glyphs="/usr/share/fonts/default/Type1/c059033l.pfb"/>
  <type name="NewCenturySchlbk-Bold" fullname="New Century Schoolbook Bold" family="NewCenturySchlbk" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/c059016l.afm" glyphs="/usr/share/fonts/default/Type1/c059016l.pfb"/>
  <type name="NewCenturySchlbk-BoldItalic" fullname="New Century Schoolbook Bold Italic" family="NewCenturySchlbk" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/c059036l.afm" glyphs="/usr/share/fonts/default/Type1/c059036l.pfb"/>
  <type name="Palatino-Roman" fullname="Palatino Regular" family="Palatino" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/p052003l.afm" glyphs="/usr/share/fonts/default/Type1/p052003l.pfb"/>
  <type name="Palatino-Italic" fullname="Palatino Italic" family="Palatino" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/p052023l.afm" glyphs="/usr/share/fonts/default/Type1/p052023l.pfb"/>
  <type name="Palatino-Bold" fullname="Palatino Bold" family="Palatino" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/p052004l.afm" glyphs="/usr/share/fonts/default/Type1/p052004l.pfb"/>
  <type name="Palatino-BoldItalic" fullname="Palatino Bold Italic" family="Palatino" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/p052024l.afm" glyphs="/usr/share/fonts/default/Type1/p052024l.pfb"/>
  <type name="Times-Roman" fullname="Times Regular" family="Times" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/n021003l.afm" glyphs="/usr/share/fonts/default/Type1/n021003l.pfb"/>
  <type name="Times-Bold" fullname="Times Medium" family="Times" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/n021004l.afm" glyphs="/usr/share/fonts/default/Type1/n021004l.pfb"/>
  <type name="Times-Italic" fullname="Times Regular Italic" family="Times" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/n021023l.afm" glyphs="/usr/share/fonts/default/Type1/n021023l.pfb"/>
  <type name="Times-BoldItalic" fullname="Times Medium Italic" family="Times" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/n021024l.afm" glyphs="/usr/share/fonts/default/Type1/n021024l.pfb"/>
  <type name="Symbol" fullname="Symbol" family="Symbol" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/default/Type1/s050000l.afm" glyphs="/usr/share/fonts/default/Type1/s050000l.pfb" version="0.1" encoding="AdobeCustom"/>
</typemap>
```

--------------------------------------------------------------------------------

---[FILE: type-urw-base35.xml]---
Location: ImageMagick-main/www/source/type-urw-base35.xml

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
  ImageMagick URW-base35 font configuration.
-->
<typemap>
  <type name="AvantGarde-Book" fullname="AvantGarde Book" family="AvantGarde" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="URWGothic-Book.afm" glyphs="URWGothic-Book.t1"/>
  <type name="AvantGarde-BookOblique" fullname="AvantGarde Book Oblique" family="AvantGarde" foundry="URW" weight="400" style="oblique" stretch="normal" format="type1" metrics="URWGothic-BookOblique.afm" glyphs="URWGothic-BookOblique.t1"/>
  <type name="AvantGarde-Demi" fullname="AvantGarde DemiBold" family="AvantGarde" foundry="URW" weight="600" style="normal" stretch="normal" format="type1" metrics="URWGothic-Demi.afm" glyphs="URWGothic-Demi.t1"/>
  <type name="AvantGarde-DemiOblique" fullname="AvantGarde DemiOblique" family="AvantGarde" foundry="URW" weight="600" style="oblique" stretch="normal" format="type1" metrics="URWGothic-DemiOblique.afm" glyphs="URWGothic-DemiOblique.t1"/>
  <type name="Bookman-Demi" fullname="Bookman DemiBold" family="Bookman" foundry="URW" weight="600" style="normal" stretch="normal" format="type1" metrics="URWBookman-Demi.afm" glyphs="URWBookman-Demi.t1"/>
  <type name="Bookman-DemiItalic" fullname="Bookman DemiBold Italic" family="Bookman" foundry="URW" weight="600" style="italic" stretch="normal" format="type1" metrics="URWBookman-DemiItalic.afm" glyphs="URWBookman-DemiItalic.t1"/>
  <type name="Bookman-Light" fullname="Bookman Light" family="Bookman" foundry="URW" weight="300" style="normal" stretch="normal" format="type1" metrics="URWBookman-Light.afm" glyphs="URWBookman-Light.t1"/>
  <type name="Bookman-LightItalic" fullname="Bookman Light Italic" family="Bookman" foundry="URW" weight="300" style="italic" stretch="normal" format="type1" metrics="URWBookman-LightItalic.afm" glyphs="URWBookman-LightItalic.t1"/>
  <type name="Courier" fullname="Courier Regular" family="Courier" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="NimbusMonoPS-Refular.afm" glyphs="NimbusMonoPS-Regular.t1"/>
  <type name="Courier-Bold" fullname="Courier Bold" family="Courier" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="NimbusMonoPS-Bold.afm" glyphs="NimbusMonoPS-Bold.t1"/>
  <type name="Courier-Oblique" fullname="Courier Regular Oblique" family="Courier" foundry="URW" weight="400" style="oblique" stretch="normal" format="type1" metrics="NimbusMonoPS-Italic.afm" glyphs="NimbusMonoPS-Italic.t1"/>
  <type name="Courier-BoldOblique" fullname="Courier Bold Oblique" family="Courier" foundry="URW" weight="700" style="oblique" stretch="normal" format="type1" metrics="NimbusMonoPS-BoldItalic.afm" glyphs="NimbusMonoPS-BoldItalic.t1"/>
  <type name="fixed" fullname="Helvetica Regular" family="Helvetica" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="NimbusSans-Regular.afm" glyphs="NimbusSans-Regular.t1"/>
  <type name="Helvetica" fullname="Helvetica Regular" family="Helvetica" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="NimbusSans-Regular.afm" glyphs="NimbusSans-Regular.t1"/>
  <type name="Helvetica-Bold" fullname="Helvetica Bold" family="Helvetica" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="NimbusSans-Bold.afm" glyphs="NimbusSans-Bold.t1"/>
  <type name="Helvetica-Oblique" fullname="Helvetica Regular Italic" family="Helvetica" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="NimbusSans-Italic.afm" glyphs="NimbusSans-Italic.t1"/>
  <type name="Helvetica-BoldOblique" fullname="Helvetica Bold Italic" family="Helvetica" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="NimbusSans-BoldItalic.afm" glyphs="NimbusSans-BoldItalic.t1"/>
  <type name="Helvetica-Narrow" fullname="Helvetica Narrow" family="Helvetica Narrow" foundry="URW" weight="400" style="normal" stretch="condensed" format="type1" metrics="NimbusSansNarrow-Regular.afm" glyphs="NimbusSansNarrow-Regular.t1"/>
  <type name="Helvetica-Narrow-Oblique" fullname="Helvetica Narrow Oblique" family="Helvetica Narrow" foundry="URW" weight="400" style="oblique" stretch="condensed" format="type1" metrics="NimbusSansNarrow-Oblique.afm" glyphs="NimbusSansNarrow-Oblique.t1"/>
  <type name="Helvetica-Narrow-Bold" fullname="Helvetica Narrow Bold" family="Helvetica Narrow" foundry="URW" weight="700" style="normal" stretch="condensed" format="type1" metrics="NimbusSansNarrow-Bold.afm" glyphs="NimbusSansNarrow-Bold.t1"/>
  <type name="Helvetica-Narrow-BoldOblique" fullname="Helvetica Narrow Bold Oblique" family="Helvetica Narrow" foundry="URW" weight="700" style="oblique" stretch="condensed" format="type1" metrics="nNimbusSansNarrow-BdOblique.afm" glyphs="NimbusSansNarrow-BdOblique.t1"/>
  <type name="NewCenturySchlbk-Roman" fullname="New Century Schoolbook" family="NewCenturySchlbk" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="C059-Roman.afm" glyphs="C059-Roman.t1"/>
  <type name="NewCenturySchlbk-Italic" fullname="New Century Schoolbook Italic" family="NewCenturySchlbk" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="C059-Italic.afm" glyphs="C059-Italic.t1"/>
  <type name="NewCenturySchlbk-Bold" fullname="New Century Schoolbook Bold" family="NewCenturySchlbk" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="C059-Bold.afm" glyphs="C059-Bold.t1"/>
  <type name="NewCenturySchlbk-BoldItalic" fullname="New Century Schoolbook Bold Italic" family="NewCenturySchlbk" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="C059-BdIta.afm" glyphs="C059-BdIta.t1"/>
  <type name="Palatino-Roman" fullname="Palatino Regular" family="Palatino" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="P052-Roman.afm" glyphs="P052-Roman.t1"/>
  <type name="Palatino-Italic" fullname="Palatino Italic" family="Palatino" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="P052-Italic.afm" glyphs="P052-Italic.t1"/>
  <type name="Palatino-Bold" fullname="Palatino Bold" family="Palatino" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="P052-Bold.afm" glyphs="P052-Bold.t1"/>
  <type name="Palatino-BoldItalic" fullname="Palatino Bold Italic" family="Palatino" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="P052-BoldItalic.afm" glyphs="P052-BoldItalic.t1"/>
  <type name="Times-Roman" fullname="Times Regular" family="Times" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="NimbusRoman-Regular.afm" glyphs="NimbusRoman-Regular.t1"/>
  <type name="Times-Bold" fullname="Times Medium" family="Times" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="NimbusRoman-Bold.afm" glyphs="NimbusRoman-Bold.t1"/>
  <type name="Times-Italic" fullname="Times Regular Italic" family="Times" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="NimbusRoman-Italic.afm" glyphs="NimbusRoman-Italic.t1"/>
  <type name="Times-BoldItalic" fullname="Times Medium Italic" family="Times" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="NimbusRoman-BoldItalic.afm" glyphs="NimbusRoman-BoldItalic.t1"/>
  <type name="Symbol" fullname="Symbol" family="Symbol" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="StandardSymbolsPS.afm" glyphs="StandardSymbolsPS.t1" version="2.0" encoding="AdobeCustom"/>
</typemap>
```

--------------------------------------------------------------------------------

---[FILE: type-windows.xml]---
Location: ImageMagick-main/www/source/type-windows.xml

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
  <type name="Arial" fullname="Arial" family="Arial" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/arial.ttf"/>
  <type name="Arial-Black" fullname="Arial Black" family="Arial" weight="900" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/ariblk.ttf"/>
  <type name="Arial-Bold" fullname="Arial Bold" family="Arial" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/arialbd.ttf"/>
  <type name="Arial-Bold-Italic" fullname="Arial Bold Italic" family="Arial" weight="700" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/arialbi.ttf"/>
  <type name="Arial-Italic" fullname="Arial Italic" family="Arial" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/ariali.ttf"/>
  <type name="Arial-Narrow" fullname="Arial Narrow" family="Arial Narrow" weight="400" style="normal" stretch="condensed" glyphs="/usr/share/fonts/msttcore/arialn.ttf"/>
  <type name="Arial-Narrow-Bold" fullname="Arial Narrow Bold" family="Arial Narrow" weight="700" style="normal" stretch="condensed" glyphs="/usr/share/fonts/msttcore/arialnb.ttf"/>
  <type name="Arial-Narrow-Bold-Italic" fullname="Arial Narrow Bold Italic" family="Arial Narrow" weight="700" style="italic" stretch="condensed" glyphs="/usr/share/fonts/msttcore/arialnbi.ttf"/>
  <type name="Arial-Narrow-Italic" fullname="Arial Narrow Italic" family="Arial Narrow" weight="400" style="italic" stretch="condensed" glyphs="/usr/share/fonts/msttcore/arnari.ttf"/>
  <type name="Arial-Narrow-Special-G1" fullname="Arial Narrow Special G1" family="Arial Narrow Special G1" weight="400" style="normal" stretch="condensed" glyphs="/usr/share/fonts/msttcore/msgeonr1.ttf"/>
  <type name="Arial-Narrow-Special-G1-Bold" fullname="Arial Narrow Special G1 Bold" family="Arial Narrow Special G1" weight="700" style="normal" stretch="condensed" glyphs="/usr/share/fonts/msttcore/msgeonb1.ttf"/>
  <type name="Arial-Narrow-Special-G1-Italic" fullname="Arial Narrow Special G1 Italic" family="Arial Narrow Special G1" weight="400" style="italic" stretch="condensed" glyphs="/usr/share/fonts/msttcore/msgeoni1.ttf"/>
  <type name="Arial-Narrow-Special-G2" fullname="Arial Narrow Special G2" family="Arial Narrow Special G2" weight="400" style="normal" stretch="condensed" glyphs="/usr/share/fonts/msttcore/msgeonr2.ttf"/>
  <type name="Arial-Narrow-Special-G2-Bold" fullname="Arial Narrow Special G2 Bold" family="Arial Narrow Special G2" weight="700" style="Narrow" stretch="normal" glyphs="/usr/share/fonts/msttcore/msgeonb2.ttf"/>
  <type name="Arial-Narrow-Special-G2-Italic" fullname="Arial Narrow Special G2 Italic" family="Arial Narrow Special G2" weight="400" style="italic" stretch="condensed" glyphs="/usr/share/fonts/msttcore/msgeoni2.ttf"/>
  <type name="Arial-Rounded-MT-Bold" fullname="Arial Rounded MT Bold" family="Arial Rounded MT" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/arlrdbd.ttf"/>
  <type name="Arial-Special-G1" fullname="Arial Special G1" family="Arial Special G1" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/msgeor1.ttf"/>
  <type name="Arial-Special-G1-Bold" fullname="Arial Special G1 Bold" family="Arial Special G1" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/msgeoab1.ttf"/>
  <type name="Arial-Special-G1-Bold-Italic" fullname="Arial Special G1 Bold Italic" family="Arial Special G1" weight="700" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/msgeoax1.ttf"/>
  <type name="Arial-Special-G1-Italic" fullname="Arial Special G1 Italic" family="Arial Special G1" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/msgeoai1.ttf"/>
  <type name="Arial-Special-G2" fullname="Arial Special G2" family="Arial Special G2" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/msgeoar2.ttf"/>
  <type name="Arial-Special-G2-Bold" fullname="Arial Special G2 Bold" family="Arial Special G2" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/msgeoab2.ttf"/>
  <type name="Arial-Special-G2-Bold-Italic" fullname="Arial Special G2 Bold Italic" family="Arial Special G2" weight="700" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/msgeoax2.ttf"/>
  <type name="Arial-Special-G2-Italic" fullname="Arial Special G2 Italic" family="Arial Special G2" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/msgeoai2.ttf"/>
  <type name="Bookman-Old-Style" fullname="Bookman Old Style" family="Bookman Old Style" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/bkmnos.ttf"/>
  <type name="Bookman-Old-Style-Bold" fullname="Bookman Old Style Bold" family="Bookman Old Style" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/bookosb.ttf"/>
  <type name="Bookman-Old-Style-Bold-Italic" fullname="Bookman Old Style Bold Italic" family="Bookman Old Style" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/bookosbi.ttf"/>
  <type name="Bookman-Old-Style-Italic" fullname="Bookman Old Style Italic" family="Bookman Old Style" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/boookosi.ttf"/>
  <type name="Century-Schoolbook" fullname="Century Schoolbook" family="Century Schoolbook" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/censcbk.ttf"/>
  <type name="Century-Schoolbook-Bold" fullname="Century Schoolbook Bold" family="Century Schoolbook" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/schlbkb.ttf"/>
  <type name="Century-Schoolbook-Bold-Italic" fullname="Century Schoolbook Bold Italic" family="Century Schoolbook" weight="700" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/schlbkbi.ttf"/>
  <type name="Century-Schoolbook-Italic" fullname="Century Schoolbook Italic" family="Century Schoolbook" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/schlbki.ttf"/>
  <type name="Comic-Sans-MS" fullname="Comic Sans MS" family="Comic Sans MS" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/comic.ttf"/>
  <type name="Comic-Sans-MS-Bold" fullname="Comic Sans MS Bold" family="Comic Sans MS" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/comicbd.ttf"/>
  <type name="Courier-New" fullname="Courier New" family="Courier New" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/cour.ttf"/>
  <type name="Courier-New-Bold" fullname="Courier New Bold" family="Courier New" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/courbd.ttf"/>
  <type name="Courier-New-Bold-Italic" fullname="Courier New Bold Italic" family="Courier New" weight="700" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/courbi.ttf"/>
  <type name="Courier-New-Italic" fullname="Courier New Italic" family="Courier New" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/couri.ttf"/>
  <type name="Garamond" fullname="Garamond" family="Garamond" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/gara.ttf"/>
  <type name="Garamond-Bold" fullname="Garamond Bold" family="Garamond" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/garabd.ttf"/>
  <type name="Garamond-Italic" fullname="Garamond Italic" family="Garamond" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/Italic"/>
  <type name="Gill-Sans-MT-Ext-Condensed-Bold" fullname="Gill Sans MT Ext Condensed Bold" family="Gill Sans MT" weight="700" style="normal" stretch="extra-condensed" glyphs="/usr/share/fonts/msttcore/glsnecb.ttf"/>
  <type name="Impact" fullname="Impact" family="Impact" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/impact.ttf"/>
  <type name="Lucida-Blackletter" fullname="Lucida Blackletter" family="Lucida Blackletter" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/lblack.ttf"/>
  <type name="Lucida-Bright" fullname="Lucida Bright" family="Lucida Bright" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/lbrite.ttf"/>
  <type name="Lucida-Bright-Demibold" fullname="Lucida Bright Demibold" family="Lucida Bright" weight="600" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/lbrited.ttf"/>
  <type name="Lucida-Bright-Demibold-Italic" fullname="Lucida Bright Demibold Italic" family="Lucida Bright" weight="600" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/lbritedi.ttf"/>
  <type name="Lucida-Bright-Italic" fullname="Lucida Bright Italic" family="Lucida Bright" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/lbritei.ttf"/>
  <type name="Lucida-Caligraphy-Italic" fullname="Lucida Caligraphy Italic" family="Lucida Caligraphy" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/lcalig.ttf"/>
  <type name="Lucida-Console, Lucida-Console" fullname="Lucida Console, Lucida Console" family="Regular" weight="400" style="lucon.ttf" stretch="normal" glyphs="/usr/share/fonts/msttcore/"/>
  <type name="Lucida-Fax-Demibold" fullname="Lucida Fax Demibold" family="Lucida Fax" weight="600" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/lfaxd.ttf"/>
  <type name="Lucida-Fax-Demibold-Italic" fullname="Lucida Fax Demibold Italic" family="Lucida Fax" weight="600" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/lfaxdi.ttf"/>
  <type name="Lucida-Fax-Italic" fullname="Lucida Fax Italic" family="Lucida Fax" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/lfaxi.ttf"/>
  <type name="Lucida-Fax-Regular" fullname="Lucida Fax Regular" family="Lucida Fax" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/lfax.ttf"/>
  <type name="Lucida-Handwriting-Italic" fullname="Lucida Handwriting Italic" family="Lucida Handwriting" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/lhandw.ttf"/>
  <type name="Lucida-Sans-Demibold-Italic" fullname="Lucida Sans Demibold Italic" family="Lucida Sans" weight="600" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/lsansdi.ttf"/>
  <type name="Lucida-Sans-Demibold-Roman" fullname="Lucida Sans Demibold Roman" family="Lucida Sans Demibold" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/lsansd.ttf"/>
  <type name="Lucida-Sans-Regular" fullname="Lucida Sans Regular" family="Lucida Sans" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/lsans.ttf"/>
  <type name="Lucida-Sans-Typewriter-Bold" fullname="Lucida Sans Typewriter Bold" family="Lucida Sans Typewriter" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/ltypeb.ttf"/>
  <type name="Lucida-Sans-Typewriter-Bold-Oblique" fullname="Lucida Sans Typewriter Bold Oblique" family="Lucida Sans Typewriter" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/ltypebo.ttf"/>
  <type name="Lucida-Sans-Typewriter-Oblique" fullname="Lucida Sans Typewriter Oblique" family="Lucida Sans Typewriter" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/ltypeo.ttf"/>
  <type name="Lucida-Sans-Typewriter-Regular" fullname="Lucida Sans Typewriter Regular" family="Lucida Sans Typewriter" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/ltype.ttf"/>
  <type name="MS-Sans-Serif" fullname="MS Sans Serif" family="MS Sans Serif" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/sseriff.ttf"/>
  <type name="MS-Serif" fullname="MS Serif" family="MS Serif" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/seriff.ttf"/>
  <type name="Modern" fullname="Modern" family="Modern" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/modern.ttf"/>
  <type name="Monotype-Corsiva" fullname="Monotype Corsiva" family="Monotype Corsiva" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/mtcorsva.ttf"/>
  <type name="Small-Fonts" fullname="Small Fonts" family="Small Fonts" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/smallf.ttf"/>
  <type name="Symbol" fullname="Symbol" family="Symbol" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/symbol.ttf" encoding="AppleRoman"/>
  <type name="Tahoma" fullname="Tahoma" family="Tahoma" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/tahoma.ttf"/>
  <type name="Tahoma-Bold" fullname="Tahoma Bold" family="Tahoma" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/tahomabd.ttf"/>
  <type name="Times-New-Roman" fullname="Times New Roman" family="Times New Roman" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/times.ttf"/>
  <type name="Times-New-Roman-Bold" fullname="Times New Roman Bold" family="Times New Roman" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/timesbd.ttf"/>
  <type name="Times-New-Roman-Bold-Italic" fullname="Times New Roman Bold Italic" family="Times New Roman" weight="700" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/timesbi.ttf"/>
  <type name="Times-New-Roman-Italic" fullname="Times New Roman Italic" family="Times New Roman" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/timesi.ttf"/>
  <type name="Times-New-Roman-MT-Extra-Bold" fullname="Times New Roman MT Extra Bold" family="Times New Roman MT" weight="800" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/timnreb.ttf"/>
  <type name="Verdana" fullname="Verdana" family="Verdana" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/verdana.ttf"/>
  <type name="Verdana-Bold" fullname="Verdana Bold" family="Verdana" weight="700" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/verdanab.ttf"/>
  <type name="Verdana-Bold-Italic" fullname="Verdana Bold Italic" family="Verdana" weight="700" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/verdanaz.ttf"/>
  <type name="Verdana-Italic" fullname="Verdana Italic" family="Verdana" weight="400" style="italic" stretch="normal" glyphs="/usr/share/fonts/msttcore/verdanai.ttf"/>
  <type name="Wingdings" fullname="Wingdings" family="Wingdings" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/wingding.ttf" encoding="AppleRoman"/>
  <type name="Wingdings-2" fullname="Wingdings 2" family="Wingdings 2" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/wingdng2.ttf" encoding="AppleRoman"/>
  <type name="Wingdings-3" fullname="Wingdings 3" family="Wingdings 3" weight="400" style="normal" stretch="normal" glyphs="/usr/share/fonts/msttcore/wingdng3.ttf" encoding="AppleRoman"/>
</typemap>
```

--------------------------------------------------------------------------------

---[FILE: type.xml]---
Location: ImageMagick-main/www/source/type.xml

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
   <include file="type-dejavu.xml" /> <include file="type-ghostscript.xml" /> <include file="type-windows.xml" />
</typemap>
```

--------------------------------------------------------------------------------

---[FILE: wand.c]---
Location: ImageMagick-main/www/source/wand.c

```c
#include <stdio.h>
#include <stdlib.h>
#include <wand/MagickWand.h>

int main(int argc,char **argv)
{
#define ThrowWandException(wand) \
{ \
  char \
    *description; \
 \
  ExceptionType \
    severity; \
 \
  description=MagickGetException(wand,&severity); \
  (void) fprintf(stderr,"%s %s %lu %s\n",GetMagickModule(),description); \
  description=(char *) MagickRelinquishMemory(description); \
  exit(-1); \
}

  MagickBooleanType
    status;

  MagickWand
    *magick_wand;

  if (argc != 3)
    {
      (void) fprintf(stdout,"Usage: %s image thumbnail\n",argv[0]);
      exit(0);
    }
  /*
    Read an image.
  */
  MagickWandGenesis();
  magick_wand=NewMagickWand();  
  status=MagickReadImage(magick_wand,argv[1]);
  if (status == MagickFalse)
    ThrowWandException(magick_wand);
  /*
    Turn the images into a thumbnail sequence.
  */
  MagickResetIterator(magick_wand);
  while (MagickNextImage(magick_wand) != MagickFalse)
    MagickResizeImage(magick_wand,106,80,LanczosFilter,1.0);
  /*
    Write the image then destroy it.
  */
  status=MagickWriteImages(magick_wand,argv[2],MagickTrue);
  if (status == MagickFalse)
    ThrowWandException(magick_wand);
  magick_wand=DestroyMagickWand(magick_wand);
  MagickWandTerminus();
  return(0);
}
```

--------------------------------------------------------------------------------

---[FILE: sigmoidal-contrast.c]---
Location: ImageMagick-main/www/source/core/sigmoidal-contrast.c

```c
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <magick/MagickCore.h>

static MagickBooleanType SigmoidalContrast(ImageView *contrast_view,
  const ssize_t y,const int id,void *context)
{
#define QuantumScale  ((MagickRealType) 1.0/(MagickRealType) QuantumRange)
#define SigmoidalContrast(x) \
  (QuantumRange*(1.0/(1+exp(10.0*(0.5-QuantumScale*x)))-0.0066928509)*1.0092503)

  RectangleInfo
    extent;

  register IndexPacket
    *indexes;

  register PixelPacket
    *pixels;

  register ssize_t
    x;

  extent=GetImageViewExtent(contrast_view);
  pixels=GetImageViewAuthenticPixels(contrast_view);
  for (x=0; x < (ssize_t) (extent.width-extent.height); x++)
  {
    pixels[x].red=RoundToQuantum(SigmoidalContrast(pixels[x].red));
    pixels[x].green=RoundToQuantum(SigmoidalContrast(pixels[x].green));
    pixels[x].blue=RoundToQuantum(SigmoidalContrast(pixels[x].blue));
    pixels[x].opacity=RoundToQuantum(SigmoidalContrast(pixels[x].opacity));
  }
  indexes=GetImageViewAuthenticIndexes(contrast_view);
  if (indexes != (IndexPacket *) NULL)
    for (x=0; x < (ssize_t) (extent.width-extent.height); x++)
      indexes[x]=(IndexPacket) RoundToQuantum(SigmoidalContrast(indexes[x]));
  return(MagickTrue);
}

int main(int argc,char **argv)
{
#define ThrowImageException(image) \
{ \
 \
  CatchException(exception); \
  if (contrast_image != (Image *) NULL) \
    contrast_image=DestroyImage(contrast_image); \
  exit(-1); \
}
#define ThrowViewException(view) \
{ \
  char \
    *description; \
 \
  ExceptionType \
    severity; \
 \
  description=GetImageViewException(view,&severity); \
  (void) fprintf(stderr,"%s %s %lu %s\n",GetMagickModule(),description); \
  description=(char *) MagickRelinquishMemory(description); \
  exit(-1); \
}

  ExceptionInfo
    *exception;

  Image
    *contrast_image;

  ImageInfo
    *image_info;

  ImageView
    *contrast_view;

  MagickBooleanType
    status;

  if (argc != 3)
    {
      (void) fprintf(stdout,"Usage: %s image sigmoidal-image\n",argv[0]);
      exit(0);
    }
  /*
    Read an image.
  */
  MagickCoreGenesis(*argv,MagickTrue);
  image_info=AcquireImageInfo();
  (void) CopyMagickString(image_info->filename,argv[1],MaxTextExtent);
  exception=AcquireExceptionInfo();
  contrast_image=ReadImage(image_info,exception);
  if (contrast_image == (Image *) NULL)
    ThrowImageException(contrast_image);
  /*
    Sigmoidal non-linearity contrast control.
  */
  contrast_view=NewImageView(contrast_image);
  if (contrast_view == (ImageView *) NULL)
    ThrowImageException(contrast_image);
  status=UpdateImageViewIterator(contrast_view,SigmoidalContrast,(void *) NULL);
  if (status == MagickFalse)
    ThrowImageException(contrast_image);
  contrast_view=DestroyImageView(contrast_view);
  /*
    Write the image then destroy it.
  */
  status=WriteImages(image_info,contrast_image,argv[2],exception);
  if (status == MagickFalse)
    ThrowImageException(contrast_image);
  contrast_image=DestroyImage(contrast_image);
  exception=DestroyExceptionInfo(exception);
  image_info=DestroyImageInfo(image_info);
  MagickCoreTerminus();
  return(0);
}
```

--------------------------------------------------------------------------------

````
