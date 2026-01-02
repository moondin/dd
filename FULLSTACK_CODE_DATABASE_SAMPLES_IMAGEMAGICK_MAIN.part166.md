---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 166
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 166 of 851)

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

---[FILE: type-dejavu.xml.in]---
Location: ImageMagick-main/config/type-dejavu.xml.in

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
  ImageMagick DejaVU font configuration.
-->
<typemap>
  <type
    name="AvantGarde-Book"
    fullname="AvantGarde Book"
    family="AvantGarde"
    foundry="URW"
    weight="400"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@URWGothic-Book.ttf"
    />
  <type
    name="AvantGarde-BookOblique"
    fullname="AvantGarde Book Oblique"
    family="AvantGarde"
    foundry="URW"
    weight="400"
    style="oblique"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@URWGothic-BookOblique.ttf"
    />
  <type
    name="AvantGarde-Demi"
    fullname="AvantGarde DemiBold"
    family="AvantGarde"
    foundry="URW"
    weight="600"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@URWGothic-Demi.ttf"
    />
  <type
    name="AvantGarde-DemiOblique"
    fullname="AvantGarde DemiOblique"
    family="AvantGarde"
    foundry="URW"
    weight="600"
    style="oblique"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@URWGothic-DemiOblique.ttf"
    />
  <type
    name="Bookman-Demi"
    fullname="Bookman DemiBold"
    family="Bookman"
    foundry="URW"
    weight="600"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@URWBookman-Demi.ttf"
    />
  <type
    name="Bookman-DemiItalic"
    fullname="Bookman DemiBold Italic"
    family="Bookman"
    foundry="URW"
    weight="600"
    style="italic"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@URWBookman-DemiItalic.ttf"
    />
  <type
    name="Bookman-Light"
    fullname="Bookman Light"
    family="Bookman"
    foundry="URW"
    weight="300"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@URWBookman-Light.ttf"
    />
  <type
    name="Bookman-LightItalic"
    fullname="Bookman Light Italic"
    family="Bookman"
    foundry="URW"
    weight="300"
    style="italic"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@URWBookman-LightItalic.ttf"
    />
  <type
    name="Courier"
    fullname="Courier Regular"
    family="Courier"
    foundry="URW"
    weight="400"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusMonoPS-Regular.ttf"
    />
  <type
    name="Courier-Bold"
    fullname="Courier Bold"
    family="Courier"
    foundry="URW"
    weight="700"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusMonoPS-Bold.ttf"
    />
  <type
    name="Courier-Oblique"
    fullname="Courier Regular Oblique"
    family="Courier"
    foundry="URW"
    weight="400"
    style="oblique"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusMonoPS-Italic.ttf"
    />
  <type
    name="Courier-BoldOblique"
    fullname="Courier Bold Oblique"
    family="Courier"
    foundry="URW"
    weight="700"
    style="oblique"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusMonoPS-BoldItalic.ttf"
    />
  <type
    name="Helvetica"
    fullname="Helvetica Regular"
    family="Helvetica"
    foundry="URW"
    weight="400"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusSans-Regular.ttf"
    />
  <type
    name="Helvetica-Bold"
    fullname="Helvetica Bold"
    family="Helvetica"
    foundry="URW"
    weight="700"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusSans-Bold.ttf"
    />
  <type
    name="Helvetica-Oblique"
    fullname="Helvetica Regular Italic"
    family="Helvetica"
    foundry="URW"
    weight="400"
    style="italic"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusSans-Italic.ttf"
    />
  <type
    name="Helvetica-BoldOblique"
    fullname="Helvetica Bold Italic"
    family="Helvetica"
    foundry="URW"
    weight="700"
    style="italic"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusSans-BoldItalic.ttf"
    />
  <type
    name="Helvetica-Narrow"
    fullname="Helvetica Narrow"
    family="Helvetica Narrow"
    foundry="URW"
    weight="400"
    style="normal"
    stretch="condensed"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusSansNarrow-Regular.ttf"
    />
  <type
    name="Helvetica-Narrow-Oblique"
    fullname="Helvetica Narrow Oblique"
    family="Helvetica Narrow"
    foundry="URW"
    weight="400"
    style="oblique"
    stretch="condensed"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusSansNarrow-Oblique.ttf"
    />
  <type
    name="Helvetica-Narrow-Bold"
    fullname="Helvetica Narrow Bold"
    family="Helvetica Narrow"
    foundry="URW"
    weight="700"
    style="normal"
    stretch="condensed"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusSansNarrow-Bold.ttf"
    />
  <type
    name="Helvetica-Narrow-BoldOblique"
    fullname="Helvetica Narrow Bold Oblique"
    family="Helvetica Narrow"
    foundry="URW"
    weight="700"
    style="oblique"
    stretch="condensed"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusSansNarrow-BoldOblique.ttf"
    />
  <type
    name="NewCenturySchlbk-Roman"
    fullname="New Century Schoolbook"
    family="NewCenturySchlbk"
    foundry="URW"
    weight="400"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@C059-Roman.ttf"
    />
  <type
    name="NewCenturySchlbk-Italic"
    fullname="New Century Schoolbook Italic"
    family="NewCenturySchlbk"
    foundry="URW"
    weight="400"
    style="italic"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@C059-Italic.ttf"
    />
  <type
    name="NewCenturySchlbk-Bold"
    fullname="New Century Schoolbook Bold"
    family="NewCenturySchlbk"
    foundry="URW"
    weight="700"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@C059-Bold.ttf"
    />
  <type
    name="NewCenturySchlbk-BoldItalic"
    fullname="New Century Schoolbook Bold Italic"
    family="NewCenturySchlbk"
    foundry="URW"
    weight="700"
    style="italic"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@C059-BdIta.ttf"
    />
  <type
    name="Palatino-Roman"
    fullname="Palatino Regular"
    family="Palatino"
    foundry="URW"
    weight="400"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@P052-Roman.ttf"
    />
  <type
    name="Palatino-Italic"
    fullname="Palatino Italic"
    family="Palatino"
    foundry="URW"
    weight="400"
    style="italic"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@P052-Italic.ttf"
    />
  <type
    name="Palatino-Bold"
    fullname="Palatino Bold"
    family="Palatino"
    foundry="URW"
    weight="700"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@P052-Bold.ttf"
    />
  <type
    name="Palatino-BoldItalic"
    fullname="Palatino Bold Italic"
    family="Palatino"
    foundry="URW"
    weight="700"
    style="italic"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@P052-BoldItalic.ttf"
    />
  <type
    name="Symbol"
    fullname="Symbol"
    family="Symbol"
    foundry="URW"
    weight="400"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@StandardSymbolsPS.ttf"
    version="0.1"
    encoding="AdobeCustom"
    />
  <type
    name="Times-Roman"
    fullname="Times Regular"
    family="Times"
    foundry="URW"
    weight="400"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusRoman-Regular.ttf"
    />
  <type
    name="Times-Bold"
    fullname="Times Medium"
    family="Times"
    foundry="URW"
    weight="700"
    style="normal"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusRoman-Bold.ttf"
    />
  <type
    name="Times-Italic"
    fullname="Times Regular Italic"
    family="Times"
    foundry="URW"
    weight="400"
    style="italic"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusRoman-Italic.ttf"
    />
  <type
    name="Times-BoldItalic"
    fullname="Times Medium Italic"
    family="Times"
    foundry="URW"
    weight="700"
    style="italic"
    stretch="normal"
    format="opentype"
    glyphs="@dejavu_font_dir@NimbusRoman-BoldItalic.ttf"
    />
</typemap>
```

--------------------------------------------------------------------------------

---[FILE: type-ghostscript.xml.in]---
Location: ImageMagick-main/config/type-ghostscript.xml.in

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
  <type name="AvantGarde-Book" fullname="AvantGarde Book" family="AvantGarde" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@a010013l.afm" glyphs="@ghostscript_font_dir@a010013l.pfb"/>
  <type name="AvantGarde-BookOblique" fullname="AvantGarde Book Oblique" family="AvantGarde" foundry="URW" weight="400" style="oblique" stretch="normal" format="type1" metrics="@ghostscript_font_dir@a010033l.afm" glyphs="@ghostscript_font_dir@a010033l.pfb"/>
  <type name="AvantGarde-Demi" fullname="AvantGarde DemiBold" family="AvantGarde" foundry="URW" weight="600" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@a010015l.afm" glyphs="@ghostscript_font_dir@a010015l.pfb"/>
  <type name="AvantGarde-DemiOblique" fullname="AvantGarde DemiOblique" family="AvantGarde" foundry="URW" weight="600" style="oblique" stretch="normal" format="type1" metrics="@ghostscript_font_dir@a010035l.afm" glyphs="@ghostscript_font_dir@a010035l.pfb"/>
  <type name="Bookman-Demi" fullname="Bookman DemiBold" family="Bookman" foundry="URW" weight="600" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@b018015l.afm" glyphs="@ghostscript_font_dir@b018015l.pfb"/>
  <type name="Bookman-DemiItalic" fullname="Bookman DemiBold Italic" family="Bookman" foundry="URW" weight="600" style="italic" stretch="normal" format="type1" metrics="@ghostscript_font_dir@b018035l.afm" glyphs="@ghostscript_font_dir@b018035l.pfb"/>
  <type name="Bookman-Light" fullname="Bookman Light" family="Bookman" foundry="URW" weight="300" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@b018012l.afm" glyphs="@ghostscript_font_dir@b018012l.pfb"/>
  <type name="Bookman-LightItalic" fullname="Bookman Light Italic" family="Bookman" foundry="URW" weight="300" style="italic" stretch="normal" format="type1" metrics="@ghostscript_font_dir@b018032l.afm" glyphs="@ghostscript_font_dir@b018032l.pfb"/>
  <type name="Courier" fullname="Courier Regular" family="Courier" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@n022003l.afm" glyphs="@ghostscript_font_dir@n022003l.pfb"/>
  <type name="Courier-Bold" fullname="Courier Bold" family="Courier" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@n022004l.afm" glyphs="@ghostscript_font_dir@n022004l.pfb"/>
  <type name="Courier-Oblique" fullname="Courier Regular Oblique" family="Courier" foundry="URW" weight="400" style="oblique" stretch="normal" format="type1" metrics="@ghostscript_font_dir@n022023l.afm" glyphs="@ghostscript_font_dir@n022023l.pfb"/>
  <type name="Courier-BoldOblique" fullname="Courier Bold Oblique" family="Courier" foundry="URW" weight="700" style="oblique" stretch="normal" format="type1" metrics="@ghostscript_font_dir@n022024l.afm" glyphs="@ghostscript_font_dir@n022024l.pfb"/>
  <type name="fixed" fullname="Helvetica Regular" family="Helvetica" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@n019003l.afm" glyphs="@ghostscript_font_dir@n019003l.pfb"/>
  <type name="Helvetica" fullname="Helvetica Regular" family="Helvetica" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@n019003l.afm" glyphs="@ghostscript_font_dir@n019003l.pfb"/>
  <type name="Helvetica-Bold" fullname="Helvetica Bold" family="Helvetica" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@n019004l.afm" glyphs="@ghostscript_font_dir@n019004l.pfb"/>
  <type name="Helvetica-Oblique" fullname="Helvetica Regular Italic" family="Helvetica" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="@ghostscript_font_dir@n019023l.afm" glyphs="@ghostscript_font_dir@n019023l.pfb"/>
  <type name="Helvetica-BoldOblique" fullname="Helvetica Bold Italic" family="Helvetica" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="@ghostscript_font_dir@n019024l.afm" glyphs="@ghostscript_font_dir@n019024l.pfb"/>
  <type name="Helvetica-Narrow" fullname="Helvetica Narrow" family="Helvetica Narrow" foundry="URW" weight="400" style="normal" stretch="condensed" format="type1" metrics="@ghostscript_font_dir@n019043l.afm" glyphs="@ghostscript_font_dir@n019043l.pfb"/>
  <type name="Helvetica-Narrow-Oblique" fullname="Helvetica Narrow Oblique" family="Helvetica Narrow" foundry="URW" weight="400" style="oblique" stretch="condensed" format="type1" metrics="@ghostscript_font_dir@n019063l.afm" glyphs="@ghostscript_font_dir@n019063l.pfb"/>
  <type name="Helvetica-Narrow-Bold" fullname="Helvetica Narrow Bold" family="Helvetica Narrow" foundry="URW" weight="700" style="normal" stretch="condensed" format="type1" metrics="@ghostscript_font_dir@n019044l.afm" glyphs="@ghostscript_font_dir@n019044l.pfb"/>
  <type name="Helvetica-Narrow-BoldOblique" fullname="Helvetica Narrow Bold Oblique" family="Helvetica Narrow" foundry="URW" weight="700" style="oblique" stretch="condensed" format="type1" metrics="@ghostscript_font_dir@n019064l.afm" glyphs="@ghostscript_font_dir@n019064l.pfb"/>
  <type name="NewCenturySchlbk-Roman" fullname="New Century Schoolbook" family="NewCenturySchlbk" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@c059013l.afm" glyphs="@ghostscript_font_dir@c059013l.pfb"/>
  <type name="NewCenturySchlbk-Italic" fullname="New Century Schoolbook Italic" family="NewCenturySchlbk" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="@ghostscript_font_dir@c059033l.afm" glyphs="@ghostscript_font_dir@c059033l.pfb"/>
  <type name="NewCenturySchlbk-Bold" fullname="New Century Schoolbook Bold" family="NewCenturySchlbk" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@c059016l.afm" glyphs="@ghostscript_font_dir@c059016l.pfb"/>
  <type name="NewCenturySchlbk-BoldItalic" fullname="New Century Schoolbook Bold Italic" family="NewCenturySchlbk" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="@ghostscript_font_dir@c059036l.afm" glyphs="@ghostscript_font_dir@c059036l.pfb"/>
  <type name="Palatino-Roman" fullname="Palatino Regular" family="Palatino" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@p052003l.afm" glyphs="@ghostscript_font_dir@p052003l.pfb"/>
  <type name="Palatino-Italic" fullname="Palatino Italic" family="Palatino" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="@ghostscript_font_dir@p052023l.afm" glyphs="@ghostscript_font_dir@p052023l.pfb"/>
  <type name="Palatino-Bold" fullname="Palatino Bold" family="Palatino" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@p052004l.afm" glyphs="@ghostscript_font_dir@p052004l.pfb"/>
  <type name="Palatino-BoldItalic" fullname="Palatino Bold Italic" family="Palatino" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="@ghostscript_font_dir@p052024l.afm" glyphs="@ghostscript_font_dir@p052024l.pfb"/>
  <type name="Times-Roman" fullname="Times Regular" family="Times" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@n021003l.afm" glyphs="@ghostscript_font_dir@n021003l.pfb"/>
  <type name="Times-Bold" fullname="Times Medium" family="Times" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@n021004l.afm" glyphs="@ghostscript_font_dir@n021004l.pfb"/>
  <type name="Times-Italic" fullname="Times Regular Italic" family="Times" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="@ghostscript_font_dir@n021023l.afm" glyphs="@ghostscript_font_dir@n021023l.pfb"/>
  <type name="Times-BoldItalic" fullname="Times Medium Italic" family="Times" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="@ghostscript_font_dir@n021024l.afm" glyphs="@ghostscript_font_dir@n021024l.pfb"/>
  <type name="Symbol" fullname="Symbol" family="Symbol" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@ghostscript_font_dir@s050000l.afm" glyphs="@ghostscript_font_dir@s050000l.pfb" version="0.1" encoding="AdobeCustom"/>
</typemap>
```

--------------------------------------------------------------------------------

---[FILE: type-urw-base35-type1.xml]---
Location: ImageMagick-main/config/type-urw-base35-type1.xml

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
  <type name="AvantGarde-Book" fullname="AvantGarde Book" family="AvantGarde" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/URWGothic-Book.afm" glyphs="/usr/share/fonts/urw-base35/URWGothic-Book.t1" />
  <type name="AvantGarde-BookOblique" fullname="AvantGarde Book Oblique" family="AvantGarde" foundry="URW" weight="400" style="oblique" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/URWGothic-BookOblique.afm" glyphs="/usr/share/fonts/urw-base35/URWGothic-BookOblique.t1" />
  <type name="AvantGarde-Demi" fullname="AvantGarde DemiBold" family="AvantGarde" foundry="URW" weight="600" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/URWGothic-Demi.afm" glyphs="/usr/share/fonts/urw-base35/URWGothic-Demi.t1" />
  <type name="AvantGarde-DemiOblique" fullname="AvantGarde DemiOblique" family="AvantGarde" foundry="URW" weight="600" style="oblique" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/URWGothic-DemiOblique.afm" glyphs="/usr/share/fonts/urw-base35/URWGothic-DemiOblique.t1" />
  <type name="Bookman-Demi" fullname="Bookman DemiBold" family="Bookman" foundry="URW" weight="600" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/URWBookman-Demi.afm" glyphs="/usr/share/fonts/urw-base35/URWBookman-Demi.t1" />
  <type name="Bookman-DemiItalic" fullname="Bookman DemiBold Italic" family="Bookman" foundry="URW" weight="600" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/URWBookman-DemiItalic.afm" glyphs="/usr/share/fonts/urw-base35/URWBookman-DemiItalic.t1" />
  <type name="Bookman-Light" fullname="Bookman Light" family="Bookman" foundry="URW" weight="300" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/URWBookman-Light.afm" glyphs="/usr/share/fonts/urw-base35/URWBookman-Light.t1" />
  <type name="Bookman-LightItalic" fullname="Bookman Light Italic" family="Bookman" foundry="URW" weight="300" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/URWBookman-LightItalic.afm" glyphs="/usr/share/fonts/urw-base35/URWBookman-LightItalic.t1" />
  <type name="Courier-Bold" fullname="Courier Bold" family="Courier" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusMonoPS-Bold.afm" glyphs="/usr/share/fonts/urw-base35/NimbusMonoPS-Bold.t1" />
  <type name="Courier-BoldOblique" fullname="Courier Bold Oblique" family="Courier" foundry="URW" weight="700" style="oblique" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusMonoPS-BoldItalic.afm" glyphs="/usr/share/fonts/urw-base35/NimbusMonoPS-BoldItalic.t1" />
  <type name="Courier" fullname="Courier Regular" family="Courier" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusMonoPS-Regular.afm" glyphs="/usr/share/fonts/urw-base35/NimbusMonoPS-Regular.t1" />
  <type name="Courier-Oblique" fullname="Courier Regular Oblique" family="Courier" foundry="URW" weight="400" style="oblique" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusMonoPS-Italic.afm" glyphs="/usr/share/fonts/urw-base35/NimbusMonoPS-Italic.t1" />
  <type name="Helvetica-Bold" fullname="Helvetica Bold" family="Helvetica" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusSans-Bold.afm" glyphs="/usr/share/fonts/urw-base35/NimbusSans-Bold.t1" />
  <type name="Helvetica-BoldOblique" fullname="Helvetica Bold Italic" family="Helvetica" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusSans-BoldItalic.afm" glyphs="/usr/share/fonts/urw-base35/NimbusSans-BoldItalic.t1" />
  <type name="Helvetica" fullname="Helvetica Regular" family="Helvetica" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusSans-Regular.afm" glyphs="/usr/share/fonts/urw-base35/NimbusSans-Regular.t1" />
  <type name="Helvetica-Narrow-Bold" fullname="Helvetica Narrow Bold" family="Helvetica Narrow" foundry="URW" weight="700" style="normal" stretch="condensed" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusSansNarrow-Bold.afm" glyphs="/usr/share/fonts/urw-base35/NimbusSansNarrow-Bold.t1" />
  <type name="Helvetica-Narrow-BoldOblique" fullname="Helvetica Narrow Bold Oblique" family="Helvetica Narrow" foundry="URW" weight="700" style="oblique" stretch="condensed" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusSansNarrow-BoldOblique.afm" glyphs="/usr/share/fonts/urw-base35/NimbusSansNarrow-BoldOblique.t1" />
  <type name="Helvetica-Narrow" fullname="Helvetica Narrow" family="Helvetica Narrow" foundry="URW" weight="400" style="normal" stretch="condensed" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusSansNarrow-Regular.afm" glyphs="/usr/share/fonts/urw-base35/NimbusSansNarrow-Regular.t1" />
  <type name="Helvetica-Narrow-Oblique" fullname="Helvetica Narrow Oblique" family="Helvetica Narrow" foundry="URW" weight="400" style="oblique" stretch="condensed" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusSansNarrow-Oblique.afm" glyphs="/usr/share/fonts/urw-base35/NimbusSansNarrow-Oblique.t1" />
  <type name="Helvetica-Oblique" fullname="Helvetica Regular Italic" family="Helvetica" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusSans-Italic.afm" glyphs="/usr/share/fonts/urw-base35/NimbusSans-Italic.t1" />
  <type name="NewCenturySchlbk-Bold" fullname="New Century Schoolbook Bold" family="NewCenturySchlbk" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/C059-Bold.afm" glyphs="/usr/share/fonts/urw-base35/C059-Bold.t1" />
  <type name="NewCenturySchlbk-BoldItalic" fullname="New Century Schoolbook Bold Italic" family="NewCenturySchlbk" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/C059-BdIta.afm" glyphs="/usr/share/fonts/urw-base35/C059-BdIta.t1" />
  <type name="NewCenturySchlbk-Italic" fullname="New Century Schoolbook Italic" family="NewCenturySchlbk" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/C059-Italic.afm" glyphs="/usr/share/fonts/urw-base35/C059-Italic.t1" />
  <type name="NewCenturySchlbk-Roman" fullname="New Century Schoolbook" family="NewCenturySchlbk" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/C059-Roman.afm" glyphs="/usr/share/fonts/urw-base35/C059-Roman.t1" />
  <type name="Palatino-Bold" fullname="Palatino Bold" family="Palatino" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/P052-Bold.afm" glyphs="/usr/share/fonts/urw-base35/P052-Bold.t1" />
  <type name="Palatino-BoldItalic" fullname="Palatino Bold Italic" family="Palatino" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/P052-BoldItalic.afm" glyphs="/usr/share/fonts/urw-base35/P052-BoldItalic.t1" />
  <type name="Palatino-Italic" fullname="Palatino Italic" family="Palatino" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/P052-Italic.afm" glyphs="/usr/share/fonts/urw-base35/P052-Italic.t1" />
  <type name="Palatino-Roman" fullname="Palatino Regular" family="Palatino" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/P052-Roman.afm" glyphs="/usr/share/fonts/urw-base35/P052-Roman.t1" />
  <type name="Symbol" fullname="Symbol" family="Symbol" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/StandardSymbolsPS.afm" glyphs="/usr/share/fonts/urw-base35/StandardSymbolsPS.t1" version="0.1" encoding="AdobeCustom" />
  <type name="Times-Bold" fullname="Times Medium" family="Times" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusRoman-Bold.afm" glyphs="/usr/share/fonts/urw-base35/NimbusRoman-Bold.t1" />
  <type name="Times-BoldItalic" fullname="Times Medium Italic" family="Times" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusRoman-BoldItalic.afm" glyphs="/usr/share/fonts/urw-base35/NimbusRoman-BoldItalic.t1" />
  <type name="Times-Italic" fullname="Times Regular Italic" family="Times" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusRoman-Italic.afm" glyphs="/usr/share/fonts/urw-base35/NimbusRoman-Italic.t1" />
  <type name="Times-Roman" fullname="Times Regular" family="Times" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="/usr/share/fonts/urw-base35/NimbusRoman-Regular.afm" glyphs="/usr/share/fonts/urw-base35/NimbusRoman-Regular.t1" />
</typemap>
```

--------------------------------------------------------------------------------

---[FILE: type-urw-base35-type1.xml.in]---
Location: ImageMagick-main/config/type-urw-base35-type1.xml.in

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
  <type name="AvantGarde-Book" fullname="AvantGarde Book" family="AvantGarde" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@URWGothic-Book.afm" glyphs="@urw_base35_type1_font_dir@URWGothic-Book.t1" />
  <type name="AvantGarde-BookOblique" fullname="AvantGarde Book Oblique" family="AvantGarde" foundry="URW" weight="400" style="oblique" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@URWGothic-BookOblique.afm" glyphs="@urw_base35_type1_font_dir@URWGothic-BookOblique.t1" />
  <type name="AvantGarde-Demi" fullname="AvantGarde DemiBold" family="AvantGarde" foundry="URW" weight="600" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@URWGothic-Demi.afm" glyphs="@urw_base35_type1_font_dir@URWGothic-Demi.t1" />
  <type name="AvantGarde-DemiOblique" fullname="AvantGarde DemiOblique" family="AvantGarde" foundry="URW" weight="600" style="oblique" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@URWGothic-DemiOblique.afm" glyphs="@urw_base35_type1_font_dir@URWGothic-DemiOblique.t1" />
  <type name="Bookman-Demi" fullname="Bookman DemiBold" family="Bookman" foundry="URW" weight="600" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@URWBookman-Demi.afm" glyphs="@urw_base35_type1_font_dir@URWBookman-Demi.t1" />
  <type name="Bookman-DemiItalic" fullname="Bookman DemiBold Italic" family="Bookman" foundry="URW" weight="600" style="italic" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@URWBookman-DemiItalic.afm" glyphs="@urw_base35_type1_font_dir@URWBookman-DemiItalic.t1" />
  <type name="Bookman-Light" fullname="Bookman Light" family="Bookman" foundry="URW" weight="300" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@URWBookman-Light.afm" glyphs="@urw_base35_type1_font_dir@URWBookman-Light.t1" />
  <type name="Bookman-LightItalic" fullname="Bookman Light Italic" family="Bookman" foundry="URW" weight="300" style="italic" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@URWBookman-LightItalic.afm" glyphs="@urw_base35_type1_font_dir@URWBookman-LightItalic.t1" />
  <type name="Courier-Bold" fullname="Courier Bold" family="Courier" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@NimbusMonoPS-Bold.afm" glyphs="@urw_base35_type1_font_dir@NimbusMonoPS-Bold.t1" />
  <type name="Courier-BoldOblique" fullname="Courier Bold Oblique" family="Courier" foundry="URW" weight="700" style="oblique" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@NimbusMonoPS-BoldItalic.afm" glyphs="@urw_base35_type1_font_dir@NimbusMonoPS-BoldItalic.t1" />
  <type name="Courier" fullname="Courier Regular" family="Courier" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@NimbusMonoPS-Regular.afm" glyphs="@urw_base35_type1_font_dir@NimbusMonoPS-Regular.t1" />
  <type name="Courier-Oblique" fullname="Courier Regular Oblique" family="Courier" foundry="URW" weight="400" style="oblique" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@NimbusMonoPS-Italic.afm" glyphs="@urw_base35_type1_font_dir@NimbusMonoPS-Italic.t1" />
  <type name="Helvetica-Bold" fullname="Helvetica Bold" family="Helvetica" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@NimbusSans-Bold.afm" glyphs="@urw_base35_type1_font_dir@NimbusSans-Bold.t1" />
  <type name="Helvetica-BoldOblique" fullname="Helvetica Bold Italic" family="Helvetica" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@NimbusSans-BoldItalic.afm" glyphs="@urw_base35_type1_font_dir@NimbusSans-BoldItalic.t1" />
  <type name="Helvetica" fullname="Helvetica Regular" family="Helvetica" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@NimbusSans-Regular.afm" glyphs="@urw_base35_type1_font_dir@NimbusSans-Regular.t1" />
  <type name="Helvetica-Narrow-Bold" fullname="Helvetica Narrow Bold" family="Helvetica Narrow" foundry="URW" weight="700" style="normal" stretch="condensed" format="type1" metrics="@urw_base35_type1_font_dir@NimbusSansNarrow-Bold.afm" glyphs="@urw_base35_type1_font_dir@NimbusSansNarrow-Bold.t1" />
  <type name="Helvetica-Narrow-BoldOblique" fullname="Helvetica Narrow Bold Oblique" family="Helvetica Narrow" foundry="URW" weight="700" style="oblique" stretch="condensed" format="type1" metrics="@urw_base35_type1_font_dir@NimbusSansNarrow-BoldOblique.afm" glyphs="@urw_base35_type1_font_dir@NimbusSansNarrow-BoldOblique.t1" />
  <type name="Helvetica-Narrow" fullname="Helvetica Narrow" family="Helvetica Narrow" foundry="URW" weight="400" style="normal" stretch="condensed" format="type1" metrics="@urw_base35_type1_font_dir@NimbusSansNarrow-Regular.afm" glyphs="@urw_base35_type1_font_dir@NimbusSansNarrow-Regular.t1" />
  <type name="Helvetica-Narrow-Oblique" fullname="Helvetica Narrow Oblique" family="Helvetica Narrow" foundry="URW" weight="400" style="oblique" stretch="condensed" format="type1" metrics="@urw_base35_type1_font_dir@NimbusSansNarrow-Oblique.afm" glyphs="@urw_base35_type1_font_dir@NimbusSansNarrow-Oblique.t1" />
  <type name="Helvetica-Oblique" fullname="Helvetica Regular Italic" family="Helvetica" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@NimbusSans-Italic.afm" glyphs="@urw_base35_type1_font_dir@NimbusSans-Italic.t1" />
  <type name="NewCenturySchlbk-Bold" fullname="New Century Schoolbook Bold" family="NewCenturySchlbk" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@C059-Bold.afm" glyphs="@urw_base35_type1_font_dir@C059-Bold.t1" />
  <type name="NewCenturySchlbk-BoldItalic" fullname="New Century Schoolbook Bold Italic" family="NewCenturySchlbk" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@C059-BdIta.afm" glyphs="@urw_base35_type1_font_dir@C059-BdIta.t1" />
  <type name="NewCenturySchlbk-Italic" fullname="New Century Schoolbook Italic" family="NewCenturySchlbk" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@C059-Italic.afm" glyphs="@urw_base35_type1_font_dir@C059-Italic.t1" />
  <type name="NewCenturySchlbk-Roman" fullname="New Century Schoolbook" family="NewCenturySchlbk" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@C059-Roman.afm" glyphs="@urw_base35_type1_font_dir@C059-Roman.t1" />
  <type name="Palatino-Bold" fullname="Palatino Bold" family="Palatino" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@P052-Bold.afm" glyphs="@urw_base35_type1_font_dir@P052-Bold.t1" />
  <type name="Palatino-BoldItalic" fullname="Palatino Bold Italic" family="Palatino" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@P052-BoldItalic.afm" glyphs="@urw_base35_type1_font_dir@P052-BoldItalic.t1" />
  <type name="Palatino-Italic" fullname="Palatino Italic" family="Palatino" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@P052-Italic.afm" glyphs="@urw_base35_type1_font_dir@P052-Italic.t1" />
  <type name="Palatino-Roman" fullname="Palatino Regular" family="Palatino" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@P052-Roman.afm" glyphs="@urw_base35_type1_font_dir@P052-Roman.t1" />
  <type name="Symbol" fullname="Symbol" family="Symbol" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@StandardSymbolsPS.afm" glyphs="@urw_base35_type1_font_dir@StandardSymbolsPS.t1" version="0.1" encoding="AdobeCustom" />
  <type name="Times-Bold" fullname="Times Medium" family="Times" foundry="URW" weight="700" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@NimbusRoman-Bold.afm" glyphs="@urw_base35_type1_font_dir@NimbusRoman-Bold.t1" />
  <type name="Times-BoldItalic" fullname="Times Medium Italic" family="Times" foundry="URW" weight="700" style="italic" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@NimbusRoman-BoldItalic.afm" glyphs="@urw_base35_type1_font_dir@NimbusRoman-BoldItalic.t1" />
  <type name="Times-Italic" fullname="Times Regular Italic" family="Times" foundry="URW" weight="400" style="italic" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@NimbusRoman-Italic.afm" glyphs="@urw_base35_type1_font_dir@NimbusRoman-Italic.t1" />
  <type name="Times-Roman" fullname="Times Regular" family="Times" foundry="URW" weight="400" style="normal" stretch="normal" format="type1" metrics="@urw_base35_type1_font_dir@NimbusRoman-Regular.afm" glyphs="@urw_base35_type1_font_dir@NimbusRoman-Regular.t1" />
</typemap>
```

--------------------------------------------------------------------------------

````
