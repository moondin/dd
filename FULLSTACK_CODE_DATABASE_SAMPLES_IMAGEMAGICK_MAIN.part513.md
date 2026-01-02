---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 513
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 513 of 851)

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

---[FILE: xsnap]---
Location: ImageMagick-main/scripts/xsnap

```text
#!/bin/sh
# \
exec wish "$0" "$@"

#
#  XSnap, X-Windows Snapshot.  A GUI for the ImageMagick import command
#
#  Software design, Cristy (magick@dupont.com), March 1996
#
#  Copyright (C) 1999-2016 ImageMagick Studio LLC, a non-profit organization
#  dedicated to making software imaging solutions freely available.
#
#  This software and documentation is provided "as is," and the copyright
#  holders and contributing author(s) make no representations or warranties,
#  express or implied, including but not limited to, warranties of
#  merchantability or fitness for any particular purpose or that the use of
#  the software or documentation will not infringe any third party patents,
#  copyrights, trademarks or other rights.
#
#  The copyright holders and contributing author(s) will not be held liable
#  for any direct, indirect, special or consequential damages arising out of
#  any use of the software or documentation, even if advised of the
#  possibility of such damage.
#
#  Permission is hereby granted to use, copy, modify, and distribute this
#  source code, or portions hereof, documentation and executables, for any
#  purpose, without fee, subject to the following restrictions:
#
#    1. The origin of this source code must not be misrepresented.
#    2. Altered versions must be plainly marked as such and must not be
#       misrepresented as being the original source.
#    3. This Copyright notice may not be removed or altered from any source
#       or altered source distribution.
#
#  The copyright holders and contributing author(s) specifically permit,
#  without fee, and encourage the use of this source code as a component for
#  supporting image processing in commercial products.  If you use this
#  source code in a product, acknowledgment is not required but would be
#
#

#
# Create an alert window and display a message to the user.
#
proc Alert {dograb message args} {
  #
  # Initialize alert window.
  #
  catch {destroy .alert}
  toplevel .alert -class alert
  wm title .alert Alert
  wm iconname .alert alert
  wm group .alert .
  wm transient .alert .
  wm geometry .alert \
    +[expr {[winfo width .]+[winfo x .]+100}]+[expr {[winfo y .]+75}]
  #
  # Create alert window frame.
  #
  frame .alert.top -relief raised -border 1
  frame .alert.bottom -relief raised -border 1
  pack append .alert .alert.top {top fill expand} .alert.bottom \
    {top fill expand}
  message .alert.top.message -width 350 -justify left -text $message
  pack append .alert.top .alert.top.message {top expand padx 5 pady 5}
  if {[llength $args] > 0} {
    #
    # Create as many buttons as needed and arrange them from left to right.
    #
    set arg [lindex $args 0]
    frame .alert.bottom.0 -relief sunken -border 1
    pack append .alert.bottom .alert.bottom.0 {left expand padx 10 pady 10}
    button .alert.bottom.0.button -text [lindex $arg 0] \
      -command "[lindex $arg 1]; destroy .alert"
    pack append .alert.bottom.0 .alert.bottom.0.button {expand padx 12 pady 12}
    bind .alert <Return> "[lindex $arg 1]; destroy .alert"
    focus .alert
    set i 1
    foreach arg [lrange $args 1 end] {
      button .alert.bottom.$i -text [lindex $arg 0] \
        -command "[lindex $arg 1]; destroy .alert"
      pack append .alert.bottom .alert.bottom.$i {left expand padx 20}
      set i [expr $i+1]
    }
  }
  bind .alert <Any-Enter> [list focus .alert]
  if {$dograb == "grab"} {
    tkwait visibility .alert
    grab set .alert
  } else {
    focus .alert
  }
}

#
# Proc AppendImageFormat appends the image format type to the filename.
#
proc AppendImageFormat {w} {
  set snap(format) \
    [$w.format.list get [lindex [$w.format.list curselection] 0]]
  set filename [$w.file.entry get]
  set extension [file extension $filename]
  $w.file.entry delete \
    [expr {[string length $filename]-[string length $extension]}] end
  $w.file.entry insert end .
  $w.file.entry insert end $snap(format)
}

#
# Proc Options creates the options window.
#
proc Options {} {
  #
  # Initialize snap window.
  #
  catch {destroy .options}
  toplevel .options -class Options
  wm title .options "Set Image Options"
  wm group .options .
  wm transient .options .
  wm geometry .options \
    +[expr {[winfo width .]+[winfo x .]+25}]+[winfo y .]
  #
  # Create options window frame.
  #
  frame .options.input_title
    label .options.input_title.label -text "Input"
    pack .options.input_title.label
  pack .options.input_title
  frame .options.input -relief sunken -borderwidth 2
    frame .options.input.checks
      checkbutton .options.input.checks.border -text "Borders" -width 11 \
        -anchor w -variable snap(border)
      checkbutton .options.input.checks.frame -text "Frame" -width 11 \
        -anchor w -variable snap(frame)
      checkbutton .options.input.checks.screen -text "Screen" -width 11 \
        -anchor w -variable snap(screen)
      checkbutton .options.input.checks.descend -text "Descend" -anchor w \
        -variable snap(descend)
      pack .options.input.checks.border .options.input.checks.frame \
        .options.input.checks.screen .options.input.checks.descend -side left
    pack .options.input.checks
    frame .options.input.delay
      label .options.input.delay.label -text "Delay:" -width 9 -anchor w
      scale .options.input.delay.scale -orient horizontal -length 11c \
        -from 0 -to 120 -tickinterval 15 -variable snap(delay)
      pack .options.input.delay.label .options.input.delay.scale -side left
    pack .options.input.delay
    frame .options.input.id
      label .options.input.id.window -text "Window:" -width 9 -anchor w
      entry .options.input.id.window_entry -width 18 -relief sunken \
        -textvariable snap(window)
      label .options.input.id.display -text "Display:"
      entry .options.input.id.display_entry -width 18 -relief sunken \
        -textvariable snap(display)
      pack .options.input.id.window .options.input.id.window_entry \
        .options.input.id.display .options.input.id.display_entry -side left
      pack .options.input.checks .options.input.delay .options.input.id \
        -padx 1m -anchor w
    pack .options.input.id -pady 1m
  pack .options.input -expand 1 -fill both
  frame .options.processing_title
    label .options.processing_title.label -text "Image Processing"
    pack .options.processing_title.label
  pack .options.processing_title
  frame .options.processing -relief sunken -borderwidth 2
    frame .options.processing.checks
      checkbutton .options.processing.checks.dither -text "Dither" -width 11 \
        -anchor w -variable snap(dither)
      checkbutton .options.processing.checks.negate -text "Negate" -width 11 \
        -anchor w -variable snap(negate)
      checkbutton .options.processing.checks.monochrome -text "Monochrome" \
        -width 11 -anchor w -variable snap(monochrome)
      checkbutton .options.processing.checks.trim -text "Trim" -anchor w \
        -variable snap(trim)
      pack .options.processing.checks.dither .options.processing.checks.negate \
        .options.processing.checks.monochrome .options.processing.checks.trim \
        -side left
    pack .options.processing.checks
    frame .options.processing.colors
      label .options.processing.colors.label -text "Colors:" -width 9 -anchor w
      scale .options.processing.colors.scale -orient horizontal -length 11c \
        -from 0 -to 256 -tickinterval 32 -variable snap(colors)
      pack .options.processing.colors.label .options.processing.colors.scale \
        -side left
    pack .options.processing.colors
    frame .options.processing.rotate
      label .options.processing.rotate.label -text "Rotate:" -width 9 -anchor w
      scale .options.processing.rotate.scale -orient horizontal -length 11c \
        -from 0 -to 360 -tickinterval 45 -variable snap(degrees)
      pack .options.processing.rotate.label .options.processing.rotate.scale \
        -side left
    pack .options.processing.rotate
    pack .options.processing.checks .options.processing.colors \
      .options.processing.rotate -padx 1m -anchor w
  pack .options.processing -expand 1 -fill both
  frame .options.output_title
    label .options.output_title.label -text "Output"
    pack .options.output_title.label
  pack .options.output_title
  frame .options.output -relief sunken -borderwidth 2
    frame .options.output.checks
      checkbutton .options.output.checks.compress -text "Compress" -width 11 \
        -anchor w -variable snap(compress)
      checkbutton .options.output.checks.interlace -text "Interlace" -width 11 \
        -anchor w -variable snap(interlace)
      checkbutton .options.output.checks.verbose -text "Verbose" -anchor w \
        -variable snap(verbose)
      pack .options.output.checks.compress .options.output.checks.interlace \
        .options.output.checks.verbose -side left
    pack .options.output.checks
    frame .options.output.scene
      label .options.output.scene.label -text "Scene:" -width 9 -anchor w
      scale .options.output.scene.scale -orient horizontal -length 11c \
        -from 0 -to 40 -tickinterval 5 -variable snap(scene)
      pack .options.output.scene.label .options.output.scene.scale -side left
    pack .options.output.scene
    frame .options.output.comment
      label .options.output.comment.label -text "Comment:" -width 9 -anchor w
      entry .options.output.comment.entry -width 45 -relief sunken \
        -textvariable snap(comment)
      pack .options.output.comment.label .options.output.comment.entry \
        -side left
    pack .options.output.comment
    frame .options.output.label
      label .options.output.label.label -text "Label:" -width 9 -anchor w
      entry .options.output.label.entry -width 45 -relief sunken \
        -textvariable snap(label)
      pack .options.output.label.label .options.output.label.entry -side left
    pack .options.output.label
    frame .options.output.id
      label .options.output.id.page -text "Page:" -width 9 -anchor w
      entry .options.output.id.page_entry -width 18 -relief sunken \
        -textvariable snap(page)
      label .options.output.id.density -text "Density:"
      entry .options.output.id.density_entry -width 18 -relief sunken \
        -textvariable snap(density)
      pack .options.output.id.page .options.output.id.page_entry \
        .options.output.id.density .options.output.id.density_entry -side left
      pack .options.output.checks .options.output.scene \
        .options.output.comment .options.output.label .options.output.id \
        -padx 1m -anchor w
    pack .options.output.id -pady 1m
  pack .options.output -expand 1 -fill both
  button .options.button -text Ok -command {destroy .options}
  pack .options.button
  bind .options <Return> {destroy .options}
  #
  # Map options window.
  #
  pack .options.input_title .options.input .options.processing_title \
    .options.processing .options.output_title .options.output .options.button \
    -side top -padx 2m -pady 1m
}

#
# Proc Print prints the snapped image to a printer or command.
#
proc Print {} {
  global snap

  . configure -cursor watch
  update
  set command convert
  set command [concat $command $snap(snapshot)]
  set option +compress
  if {$snap(compress)} {
    set option "-compress zip"
  }
  set command [concat $command $option]
  set command [concat $command -density \"$snap(density)\"]
  set command [concat $command -page \"$snap(page)\"]
  set command [concat $command \"ps:|$snap(printer)\"]
  eval exec $command
  . configure -cursor {}
}

#
# Proc PrintImage allows the user to provide a command name to print with.
#
proc PrintImage {} {
  #
  # Initialize print window.
  #
  catch {destroy .print}
  toplevel .print -class Print
  wm title .print Print
  wm group .print .
  wm transient .print .
  wm geometry .print \
    +[expr {[winfo width .]+[winfo x .]+75}]+[expr {[winfo y .]+50}]
  #
  # Create print window frame.
  #
  frame .print.format
    scrollbar .print.format.scroll -command ".print.format.list yview"
    listbox .print.format.list -yscroll ".print.format.scroll set" -setgrid 1 \
      -height 8
    pack .print.format.scroll -side right -fill y
    pack .print.format.list -side top -expand 1 -fill both
    .print.format.list insert 0  \
      Letter Tabloid Ledger Legal Statement Executive A3 A4 A5 B4 B5 Folio \
      Quarto 10x14
    .print.format.list selection set 0
  pack .print.format
  frame .print.file
    entry .print.file.entry -width 18 -relief sunken -textvariable snap(printer)
    pack .print.file.entry -side right -expand 1 -fill both
  pack .print.file
  frame .print.buttons
    button .print.buttons.print -text Print -command Print
    button .print.buttons.cancel -text Cancel -command {destroy .print}
    pack .print.buttons.print .print.buttons.cancel -side left -expand 1 \
      -fill both -padx 2m
  pack .print.buttons
  #
  # Map print window.
  #
  pack .print.format .print.file .print.buttons -padx 2m -pady 2m -expand 1 \
    -fill both
  return
}

#
# Proc Save saves the snapped image to disk.
#
proc Save {} {
  global snap

  if ![file readable $snap(snapshot)] {
    Alert grab "You must snap an image before you can save it!" {"  OK  " {}}
    tkwait window .alert
    return
  }
  . configure -cursor watch
  update
  set command convert
  set command [concat $command $snap(snapshot)]
  set option +compress
  if {$snap(compress)} {
    set option "-compress zip"
  }
  set command [concat $command $option]
  set command [concat $command -density \"$snap(density)\"]
  set command [concat $command -page \"$snap(page)\"]
  set filename $snap(filename)
  if {$snap(format) != {}} {
    set filename "$snap(format):$snap(filename)"
  }
  set command [concat $command $filename]
  eval exec $command
  . configure -cursor {}
}

proc SaveImage {} {
  #
  # Initialize save window.
  #
  catch {destroy .save}
  toplevel .save -class Saves
  wm title .save "Save As..."
  wm group .save .
  wm transient .save .
  wm geometry .save \
    +[expr {[winfo width .]+[winfo x .]+50}]+[expr {[winfo y .]+25}]
  #
  # Create save window frame.
  #
  frame .save.format
    scrollbar .save.format.scroll -command ".save.format.list yview"
    listbox .save.format.list -yscroll ".save.format.scroll set" -setgrid 1 \
      -height 8
    pack .save.format.scroll -side right -fill y
    pack .save.format.list -side top -expand 1 -fill both
    .save.format.list insert 0  \
      ps avs bie bmp cmyk dcx eps epsf epsi fax fits gif gif87 gray g3 hdf \
      histogram jbig jpeg jpg map matte miff mpg mtv pbm pcd pcx pdf pgm pict \
      png ppm pnm ps2 ras rgb rle sgi sun tga tiff uyvy vid viff x xbm xpm \
      xv xwd yuv yuv3
    .save.format.list selection set 0
  pack .save.format
  frame .save.file
    entry .save.file.entry -width 18 -relief sunken -textvariable snap(filename)
    pack .save.file.entry -side right -expand 1 -fill both
  pack .save.file
  frame .save.buttons
    button .save.buttons.save -text Save -command Save
    button .save.buttons.cancel -text Cancel -command {destroy .save}
    pack .save.buttons.save .save.buttons.cancel -side left -expand 1 \
      -fill both -padx 2m
  pack .save.buttons
  #
  # Bind buttons to print window.
  #
  bind .save.format.list <ButtonRelease-1> {
    set snap(format) \
      [.save.format.list get [lindex [.save.format.list curselection] 0]]
  }
  bind .save.format.list <Double-Button-1> {AppendImageFormat .save}
  #
  # Map save window.
  #
  pack .save.format .save.file .save.buttons -padx 2m -pady 2m -expand 1 \
    -fill both
  return
}

#
# Proc ShowImage displays the full-sized snapped image in a top level window.
#
proc ShowImage { title name } {
  catch {destroy .show}
  toplevel .show -visual best
  wm title .show $title
  button .show.image -image $name -command {destroy .show}
  pack .show.image
}

#
# Proc Snap executes the ImageMagick import program to grab the image
# from the X server screen.
#
proc Snap {} {
  global snap

  #
  # Initialize import command.
  #
  set command import
  set command [concat $command -depth 8]
  set option +border
  if {$snap(border)} {
    set option -border
  }
  set command [concat $command $option]
  if {$snap(colors)} {
    set command [concat $command -colors $snap(colors)]
  }
  set command [concat $command -comment \"$snap(comment)\"]
  set option +compress
  if {$snap(compress)} {
    set option "-compress zip"
  }
  set command [concat $command $option]
  if {$snap(delay)} {
    set command [concat $command -delay $snap(delay)]
  }
  set command [concat $command -density \"$snap(density)\"]
  if {$snap(descend)} {
    set command [concat $command -descend]
  }
  set command [concat $command -display \"$snap(display)\"]
  set option +dither
  if {$snap(dither)} {
    set option -dither
  }
  set command [concat $command $option]
  set option +frame
  if {$snap(frame)} {
    set option -frame
  }
  set command [concat $command $option]
  set option +interlace
  if {$snap(interlace)} {
    set option "-interlace plane"
  }
  set command [concat $command $option]
  set command [concat $command -label \"$snap(label)\"]
  set option +monochrome
  if {$snap(monochrome)} {
    set option -monochrome
  }
  set command [concat $command $option]
  set option +negate
  if {$snap(negate)} {
    set option -negate
  }
  set command [concat $command $option]
  set command [concat $command -page \"$snap(page)\"]
  if {$snap(degrees)} {
    set command [concat $command -rotate $snap(degrees)]
  }
  if {$snap(scene)} {
    set command [concat $command -scene $snap(scene)]
  }
  set option +screen
  if {$snap(screen)} {
    set option -screen
  }
  set command [concat $command $option]
  if {$snap(trim)} {
    set command [concat $command -crop 0x0]
  }
  set option +verbose
  if {$snap(verbose)} {
    set option -verbose
  }
  set command [concat $command $option]
  set command [concat $command $snap(snapshot)]
  #
  # Import the image from the X server screen.
  #
  . configure -cursor watch
  update
  wm withdraw .
  eval exec $command
  wm deiconify .
  update
  catch {image delete snapshot}
  image create photo snapshot -file $snap(snapshot)
  #
  # Convert to an image tile.
  #
  exec convert -geometry 320x320> $snap(snapshot) -depth 8 $snap(tile)
  catch {image delete tile}
  image create photo tile -file $snap(tile)
  exec rm -f $snap(tile)
  #
  # Display tile image as a button.
  #
  if [winfo exists .canvas.label] {
    destroy .canvas.label
    destroy .canvas.button
  }
  label .canvas.label -text $snap(filename)
  button .canvas.button -image tile -relief sunken -borderwidth 2 \
    -command { ShowImage $snap(filename) snapshot }
  pack .canvas.label .canvas.button -side top -expand 1 -fill both \
    -padx 1m -pady 1m
  bind . <Return> { ShowImage $snap(filename) snapshot }
  . configure -cursor {}
}

#
# Proc SnapWindow creates the top level window.
#
proc SnapWindow {} {
  #
  # Initialize snap window.
  #
  wm title . "X-Windows Snapshot"
  wm iconname . "xsnap"
  #
  # Create snap window frame.
  #
  frame .toolbar -relief raised -bd 2
    menubutton .toolbar.file -text "File" -menu .toolbar.file.menu -underline 0
    menu .toolbar.file.menu
    .toolbar.file.menu add command -label "Save" -command Save
    .toolbar.file.menu add command -label "Save As ..." -command "SaveImage"
    .toolbar.file.menu add command -label Print -command PrintImage
    .toolbar.file.menu add separator
    .toolbar.file.menu add command -label Quit \
      -command { exec rm -f $snap(snapshot); exit }
    pack .toolbar.file -side left
  pack .toolbar -side top -fill x
  canvas .canvas -width 256 -height 128
  pack .canvas
  frame .buttons
    button .buttons.snap -text Snap -command Snap
    button .buttons.options -text Options -command Options
    pack .buttons.snap .buttons.options -side left -expand 1
  pack .buttons -side bottom -fill x -padx 2m -pady 2m
  #
  # Map snap window.
  #
  pack .toolbar .canvas .buttons
}

#
# Initialize snap options.
#
set snap(border) 0
set snap(colors) 0
set snap(comment) "Imported from %m image: %f"
set snap(compress) 1
set snap(degrees) 0
set snap(delay) 0
set snap(density) 72x72
set snap(descend) 0
set snap(display) :0
if [info exists env(DISPLAY)] {
  set snap(display) $env(DISPLAY)
}
set snap(dither) 1
set snap(filename) magick.ps
set snap(format) {}
set snap(frame) 0
set snap(interlace) 1
set snap(label) "%f   %wx%h"
set snap(monochrome) 0
set snap(negate) 0
set snap(page) Letter
set snap(printer) lp
set snap(scene) 0
set snap(screen) 0
set snap(snapshot) /tmp/snap[pid].ppm
set snap(tile) /tmp/tile[pid].ppm
set snap(trim) 0
set snap(verbose) 0
#
# Create top level snap window.
#
SnapWindow
tkwait window .
exec rm -f $snap(snapshot)
```

--------------------------------------------------------------------------------

---[FILE: cli-colorspace.tap]---
Location: ImageMagick-main/tests/cli-colorspace.tap

```text
#!/bin/sh
#
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
. ./common.shi
. ${srcdir}/tests/common.shi

depth=`eval ${MAGICK} xc:none -format '%[fx:QuantumRange]' info:-`
if [ "X$depth" = "X255" ]; then
  echo "1..1"
  echo "ok"
  exit 0
fi
echo "1..19"

# how to generate a one pixel (average rose) color and output its values
in="rose: -scale 1x1"    # a one pixel image of the average color.
out="-format '%[fx:int(255*r+.5)],%[fx:int(255*g+.5)],%[fx:int(255*b+.5)]' info:-"

# ----------------

# Colors to compare results to.
error=false
average=`eval ${MAGICK} "$in" -noop "$out"`
too_dark=`eval ${MAGICK} "$in" -colorspace RGB "$out"`
too_light=`eval ${MAGICK} "$in" -set colorspace RGB -colorspace sRGB "$out"`
format='%-30s%s\n'        # results formatting
format2='%-30s%-14s%s\n'

printf "$format2" "Average \"rose:\" Color"  "$average" "sRGB(rose)"
printf "$format2" "Too Dark Color"  "$too_dark"  "sRGB(rose)->RGB result"
printf "$format2" "Too Light Color" "$too_light" "RGB(rose)->sRGB result"
echo ''

#
# Sanity checks
#
# NOTE: as a extra validation on sanity checks below...
#    eval ${MAGICK} "$in" -gamma .454545 "$out"
# produces a value of  74,25,20   which is close to 73,26,21 below.
#    eval ${MAGICK} "$in" -gamma 2.2 "$out"
# produces a value of  198,158,151  which is close to 199,160,152 below.
#
# Actual values used below come from IM v6.5.4-7 colorspace conversions
#
error=false
if [ "X$average" != "X146,89,80" ]; then
  echo "Sanity Failure: Average expected to be 145,89,80 - ABORTING"
  error=true
fi
if [ "X$too_dark" != "X73,26,21" ]; then
  echo "Sanity Failure: Too Dark expected to be 73,26,21 - ABORTING"
  error=true
fi
if [ "X$too_light" != "X199,160,152" ]; then
  echo "Sanity Failure: Too Light expected to be 199,160,152 - ABORTING"
  error=true
fi
$error && exit 1

test_color() {
  test="sRGB"
  cs='';
  for i in "$@"; do
    test="${test}->$i"        # format of the test being performed
    cs="$cs -colorspace $i"   # colorspace operations to perform test
  done
  color=`eval ${MAGICK} "$in" $cs "$out"`

  if [ "X$color" = "X$average" ]; then
    return 0
  fi
  # Its failed the round-trip test, now report how it failed!
  error=true
  if [ "X$color" = "X$too_light" ]; then
    return 1
  fi
  if [ "X$color" = "X$too_dark" ]; then
    return 1
  fi
  return 1
}

# ----------------

test_color RGB     sRGB && echo "ok" || echo "not ok"

test_color XYZ     sRGB && echo "ok" || echo "not ok"
test_color XYZ RGB sRGB && echo "ok" || echo "not ok"
test_color RGB XYZ sRGB && echo "ok" || echo "not ok"

test_color LAB     sRGB && echo "ok" || echo "not ok"
test_color XYZ LAB sRGB && echo "ok" || echo "not ok"
test_color LAB XYZ sRGB && echo "ok" || echo "not ok"
test_color RGB LAB sRGB && echo "ok" || echo "not ok"
test_color LAB RGB sRGB && echo "ok" || echo "not ok"

test_color CMY   sRGB && echo "ok" || echo "not ok"
test_color CMYK  sRGB && echo "ok" || echo "not ok"
test_color HSL   sRGB && echo "ok" || echo "not ok"
test_color HSB   sRGB && echo "ok" || echo "not ok"
test_color HWB   sRGB && echo "ok" || echo "not ok"
test_color Log   sRGB && echo "ok" || echo "not ok"
test_color YIQ   sRGB && echo "ok" || echo "not ok"
test_color YUV   sRGB && echo "ok" || echo "not ok"
test_color YCbCr sRGB && echo "ok" || echo "not ok"
test_color OHTA  sRGB && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: cli-pipe.tap]---
Location: ImageMagick-main/tests/cli-pipe.tap

```text
#!/bin/sh
#
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
#  Test for 'validate' utility.
#
. ./common.shi
. ${srcdir}/tests/common.shi
echo "1..17"

${MAGICK} pnm:- null:   < ${SRCDIR}/rose.pnm && echo "ok" || echo "not ok"
${MAGICK} pnm:- info:   < ${SRCDIR}/rose.pnm && echo "ok" || echo "not ok"
${MAGICK} pnm:- miff:-  < ${SRCDIR}/rose.pnm | ${IDENTIFY} - && echo "ok" || echo "not ok"
${MAGICK} pnm:- -       < ${SRCDIR}/rose.pnm | ${IDENTIFY} - && echo "ok" || echo "not ok"
${MAGICK} ${SRCDIR}/rose.pnm -write null:  null: && echo "ok" || echo "not ok"
${MAGICK} ${SRCDIR}/rose.pnm -write info:  null: && echo "ok" || echo "not ok"
${MAGICK} ${SRCDIR}/rose.pnm -write miff:- null: | ${IDENTIFY} - && echo "ok" || echo "not ok"
${MAGICK} ${SRCDIR}/rose.pnm -write -      null: | ${IDENTIFY} - && echo "ok" || echo "not ok"

# IMv7 "magick" testing
# -read option
${MAGICK} -read ${SRCDIR}/rose.pnm info: && echo "ok" || echo "not ok"
# -exit can be used instead of implicit write
${MAGICK} ${SRCDIR}/rose.pnm -write info: -exit && echo "ok" || echo "not ok"
# null: does not require an image during write
${MAGICK} -write null: -exit && echo "ok" || echo "not ok"
# implied write null: without image
${MAGICK} ${SRCDIR}/rose.pnm -write info: +delete null: && echo "ok" || echo "not ok"
# Write to file descriptor
${MAGICK} ${SRCDIR}/rose.pnm fd:6  6>&1 | ${IDENTIFY} - && echo "ok" || echo "not ok"
# Read from file descriptor
exec 5<${SRCDIR}/rose.pnm
${MAGICK} fd:5 info: && echo "ok" || echo "not ok"
exec 5<&-
# pipelined magick script
echo "-read ${SRCDIR}/rose.pnm -write info:" | ${MAGICK} -script - && echo "ok" || echo "not ok"
# pipelined magick script, input image pre-read
echo "-write info:" | ${MAGICK} ${SRCDIR}/rose.pnm -script - && echo "ok" || echo "not ok"
# pipelined script from file descriptor, read image from stdin
echo "-read pnm:- -write info:" |\
   ${MAGICK} -script fd:5 5<&0 <${SRCDIR}/rose.pnm && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: common.shi]---
Location: ImageMagick-main/tests/common.shi

```text
# Test environment
SRCDIR=`dirname $0`
SRCDIR=`cd $SRCDIR && pwd`
TOPSRCDIR=`cd $srcdir && pwd`
REFERENCE_IMAGE="${TOPSRCDIR}/images/rose.pnm"
. ./common.shi
[ "X$CONVERT" = "X" ] && CONVERT=convert
[ "X$IDENTIFY" = "X" ] && IDENTIFY=identify
export SRCDIR TOPSRCDIR
cd tests || exit 1
```

--------------------------------------------------------------------------------

````
