---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 176
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 176 of 851)

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

---[FILE: demos.tap]---
Location: ImageMagick-main/Magick++/demo/demos.tap

```text
#!/bin/sh
#
# Copyright 2004 Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
# Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
# dedicated to making software imaging solutions freely available.
#
# This file is part of Magick++, the C++ API for ImageMagick and
# ImageMagick.  Please see the file "COPYING" included with Magick++
# for usage and copying restrictions.
#
subdir=Magick++/demo
. ./common.shi
echo "1..24"

SRCDIR=${top_srcdir}/${subdir}/
export SRCDIR

cd ${subdir} || exit 1

./analyze "$SRCDIR/model.miff" && echo "ok" || echo "not ok"

for demo in button demo flip gravity piddle shapes
do
  ./${demo} && echo "ok" || echo "not ok"
done

for filter in bessel blackman box catrom cubic gaussian hamming hanning hermite lanczos mitchell point quadratic sample scale sinc triangle
do
  ./zoom -filter $filter -geometry 600x600 ${SRCDIR}/model.miff  zoom_${filter}_out.miff && echo "ok" || echo "not ok"
done
:
```

--------------------------------------------------------------------------------

---[FILE: detrans.cpp]---
Location: ImageMagick-main/Magick++/demo/detrans.cpp

```cpp
//
// Replace transparency in an image with a solid color using Magick++
//
// Useful to see how a transparent image looks on a particular
// background color, or to create a similar looking effect without
// transparency.
//
// Copyright Bob Friesenhahn, 2000
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Usage: detrans color file...
//

#include <Magick++.h>
#include <cstdlib>
#include <iostream>
using namespace std; 
using namespace Magick;
int main(int argc,char **argv) 
{
  if ( argc < 3 )
    {
      cout << "Usage: " << argv[0] << " background_color file..." << endl;
      exit( 1 );
    }

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  {
    Color color;
    try {
      color = Color(argv[1]);
    }
    catch ( Exception &error_ )
      {
        cout << error_.what() << endl;
        cout.flush();
        exit(1);
      }

    char **arg = &argv[2];
    while ( *arg )
      {
        string fname(*arg);
        try {
          Image overlay( fname );
          Image base( overlay.size(), color );
          base.composite( overlay, 0, 0, OverCompositeOp );
          base.alpha( false );
          base.write( fname );
        }
        catch( Exception &error_ ) 
          { 
            cout << error_.what() << endl; 
          }
        ++arg;
      }
  }

  return 0; 
}
```

--------------------------------------------------------------------------------

---[FILE: flip.cpp]---
Location: ImageMagick-main/Magick++/demo/flip.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2003
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Demonstration of unary function-object based operations
//
// Reads the multi-frame file "smile_anim.miff" and writes a
// flipped and morphed version to "flip_out.miff".
//

#include <Magick++.h>
#include <cstdlib>
#include <string>
#include <iostream>
#include <list>
#include <algorithm>

using namespace std;

using namespace Magick;

int main( int /*argc*/, char ** argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);


  try {

    string srcdir("");
    if(getenv("SRCDIR") != 0)
      srcdir = getenv("SRCDIR");

    // Read images into STL list
    list<Image> imageList;
    readImages( &imageList, srcdir + "smile_anim.miff" );

    // cout << "Total scenes: " << imageList.size() << endl;

    // Flip images
    for_each( imageList.begin(), imageList.end(), flipImage() );

    // Create a morphed version, adding three frames between each
    // existing frame.
    list<Image> morphed;
    morphImages( &morphed, imageList.begin(), imageList.end(), 3 );

    // Write out images
    cout << "Writing image \"flip_out.miff\" ..." << endl;
    writeImages( morphed.begin(), morphed.end(), "flip_out.miff" );

  }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  
  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: gravity.cpp]---
Location: ImageMagick-main/Magick++/demo/gravity.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 2000, 2001, 2003
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Demo of text annotation with gravity.  Produces an animation showing
// the effect of rotated text assize_t with various gravity specifications.
//
// After running demo program, run 'animate gravity_out.miff' if you
// are using X-Windows to see an animated result.
//
// Concept and algorithms lifted from PerlMagick demo script written
// by Cristy.
//

#include <Magick++.h>
#include <cstdlib>
#include <string>
#include <iostream>
#include <list>

using namespace std;

using namespace Magick;

int main( int /*argc*/, char ** argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  try {

    string srcdir("");
    if(getenv("SRCDIR") != 0)
      srcdir = getenv("SRCDIR");
    const char *const p = getenv("MAGICK_FONT");
    const string MAGICK_FONT(p ? p : "");


    int x = 100;
    int y = 100;

    list<Image> animation;

    Image base( Geometry(600,600), Color("white") );
    base.depth(8);
    base.strokeColor("#600");
    base.fillColor(Color());
    base.draw( DrawableLine( 300,100, 300,500 ) );
    base.draw( DrawableLine( 100,300, 500,300 ) );
    base.draw( DrawableRectangle( 100,100, 500,500 ) );
    base.density( Point(72,72) );
    base.strokeColor(Color());
    base.fillColor("#600");
    base.fontPointsize( 30 );
    base.font( MAGICK_FONT );
    base.boxColor( "red" );
    base.animationDelay( 20 );
    base.compressType( RLECompression );

    for ( int angle = 0; angle < 360; angle += 30 )
      {
        cout << "angle " << angle << endl;
        Image pic = base;
        pic.annotate( "NorthWest", Geometry(0,0,x,y), NorthWestGravity, angle );
        pic.annotate( "North", Geometry(0,0,0,y), NorthGravity, angle );
        pic.annotate( "NorthEast", Geometry(0,0,x,y), NorthEastGravity, angle );
        pic.annotate( "East", Geometry(0,0,x,0), EastGravity, angle );
        pic.annotate( "Center", Geometry(0,0,0,0), CenterGravity, angle );
        pic.annotate( "SouthEast", Geometry(0,0,x,y), SouthEastGravity, angle );
        pic.annotate( "South", Geometry(0,0,0,y), SouthGravity, angle );
        pic.annotate( "SouthWest", Geometry(0,0,x,y), SouthWestGravity, angle );
        pic.annotate( "West", Geometry(0,0,x,0), WestGravity, angle );
        animation.push_back( pic );
      }
    cout << "Writing image \"gravity_out.miff\" ..." << endl;
    writeImages( animation.begin(), animation.end(), "gravity_out.miff" );
    // system( "animate gravity_out.miff" );

  }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  
  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: piddle.cpp]---
Location: ImageMagick-main/Magick++/demo/piddle.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2002, 2003
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// PerlMagick "piddle" demo re-implemented using Magick++ methods.
// The PerlMagick "piddle" demo is written by Cristy
//

#include <Magick++.h>
#include <cstdlib>
#include <string>
#include <iostream>

using namespace std;

using namespace Magick;

int main( int /*argc*/, char ** argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  try {

    string srcdir("");
    if(getenv("SRCDIR") != 0)
      srcdir = getenv("SRCDIR");

    //
    // Create a 300x300 white canvas.
    //
    Image image( "300x300", "white" );

    // Drawing list
    std::vector<Magick::Drawable> drawList;

    // Start drawing by pushing a drawing context with specified
    // viewbox size
    drawList.push_back(DrawablePushGraphicContext());
    drawList.push_back(DrawableViewbox(0,0,(ssize_t) image.columns(),
      (ssize_t) image.rows()));

    //
    // Draw blue grid
    //
    drawList.push_back(DrawableStrokeColor("#ccf"));
    for ( int i=0; i < 300; i += 10 )
      {
        drawList.push_back(DrawableLine(i,0, i,300));
        drawList.push_back(DrawableLine(0,i, 300,i));
      }

    //
    // Draw rounded rectangle.
    //
    drawList.push_back(DrawableFillColor("blue"));
    drawList.push_back(DrawableStrokeColor("red"));
    drawList.push_back(DrawableRoundRectangle(15,15, 70,70, 10,10));

    drawList.push_back(DrawableFillColor("blue"));
    drawList.push_back(DrawableStrokeColor("maroon"));
    drawList.push_back(DrawableStrokeWidth(4));
    drawList.push_back(DrawableRoundRectangle(15,15, 70,70, 10,10));

    //
    // Draw curve.
    //
    {
      drawList.push_back(DrawableStrokeColor("black"));
      drawList.push_back(DrawableStrokeWidth(4));
      drawList.push_back(DrawableFillColor(Color()));

      std::vector<Magick::Coordinate> points;
      points.push_back(Coordinate(20,20));
      points.push_back(Coordinate(100,50));
      points.push_back(Coordinate(50,100));
      points.push_back(Coordinate(160,160));
      drawList.push_back(DrawableBezier(points));
    }

    //
    // Draw line
    //
    {
      const double dash_array[] = {4.0, 3.0, 0.0};
      drawList.push_back(DrawableStrokeDashArray(dash_array));
      drawList.push_back(DrawableStrokeColor("red"));
      drawList.push_back(DrawableStrokeWidth(1));
      drawList.push_back(DrawableLine(10,200, 54,182));
      drawList.push_back(DrawableStrokeDashArray((double *) 0));
    }

    //
    // Draw arc within a circle.
    //
    drawList.push_back(DrawableStrokeColor("black"));
    drawList.push_back(DrawableFillColor("yellow"));
    drawList.push_back(DrawableStrokeWidth(4));
    drawList.push_back(DrawableCircle(160,70, 200,70));

    drawList.push_back(DrawableStrokeColor("black"));
    drawList.push_back(DrawableFillColor("blue"));
    drawList.push_back(DrawableStrokeWidth(4));
    {
      std::vector<VPath> path;
      path.push_back(PathMovetoAbs(Coordinate(160,70)));
      path.push_back(PathLinetoVerticalRel(-40));
      path.push_back(PathArcRel(PathArcArgs(40,40, 0, 0, 0, -40,40)));
      path.push_back(PathClosePath());
      drawList.push_back(DrawablePath(path));
    }

    //
    // Draw pentagram.
    //
    {
      drawList.push_back(DrawableStrokeColor("red"));
      drawList.push_back(DrawableFillColor("LimeGreen"));
      drawList.push_back(DrawableStrokeWidth(3));

      std::vector<Magick::Coordinate> points;
      points.push_back(Coordinate(160,120));
      points.push_back(Coordinate(130,190));
      points.push_back(Coordinate(210,145));
      points.push_back(Coordinate(110,145));
      points.push_back(Coordinate(190,190));
      points.push_back(Coordinate(160,120));
      drawList.push_back(DrawablePolygon(points));
    }

    //
    // Draw rectangle.
    //
    drawList.push_back(DrawableStrokeWidth(5));
    drawList.push_back(DrawableFillColor(Color())); // No fill
    drawList.push_back(DrawableStrokeColor("yellow"));
    drawList.push_back(DrawableLine(200,260, 200,200));
    drawList.push_back(DrawableLine(200,200, 260,200));
    drawList.push_back(DrawableStrokeColor("red"));
    drawList.push_back(DrawableLine(260,200, 260,260));
    drawList.push_back(DrawableStrokeColor("green"));
    drawList.push_back(DrawableLine(200,260, 260,260));

    //
    // Draw text.
    //
#if defined(MAGICKCORE_FREETYPE_DELEGATE)
    if (getenv("MAGICK_FONT") != 0)
      drawList.push_back(DrawableFont(string(getenv("MAGICK_FONT"))));
    drawList.push_back(DrawableFillColor("green"));
    drawList.push_back(DrawableStrokeColor(Color())); // unset color
    drawList.push_back(DrawablePointSize(24));
    drawList.push_back(DrawableTranslation(30,140));
    drawList.push_back(DrawableRotation(45.0));
    drawList.push_back(DrawableText(0,0,"This is a test!"));
#endif

    // Finish drawing by popping back to base context.
    drawList.push_back(DrawablePopGraphicContext());

    // Draw everything using completed drawing list
    //    image.debug(true);
    image.draw(drawList);

    //     image.write( "piddle.mvg" );

    cout << "Writing image \"piddle_out.miff\" ..." << endl;
    image.depth( 8 );
    image.compressType( RLECompression );
    image.write( "piddle_out.miff" );
    cout << "Writing MVG metafile \"piddle_out.mvg\" ..." << endl;
    image.write( "mvg:piddle_out.mvg" );

    //     cout << "Display image..." << endl;
    //     image.display( );

  }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  
  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: shapes.cpp]---
Location: ImageMagick-main/Magick++/demo/shapes.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2002, 2003
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// GD/PerlMagick example using Magick++ methods.
//
// Concept and algorithms lifted from PerlMagick demo script
//

#include <Magick++.h>
#include <cstdlib>
#include <string>
#include <iostream>

using namespace std;

using namespace Magick;

int main( int /*argc*/, char ** argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  try {

    string srcdir("");
    if(getenv("SRCDIR") != 0)
      srcdir = getenv("SRCDIR");

    //
    // Create a 300x300 white canvas.
    //
    Image image( "300x300", "white" );

    //
    // Draw texture-filled polygon
    //
    // Polygon list
    std::vector<Coordinate> poly_coord;
    poly_coord.push_back( Coordinate(30,30) );
    poly_coord.push_back( Coordinate(100,10) );
    poly_coord.push_back( Coordinate(190,290) );
    poly_coord.push_back( Coordinate(30,290) );

    Image texture( srcdir + "tile.miff" );
    image.fillPattern( texture );
    image.draw( DrawablePolygon( poly_coord ) );
    texture.isValid( false );
    image.fillPattern( texture );  // Unset texture

    //
    // Draw filled ellipse with black border, and red fill color
    //
    image.strokeColor( "black" );
    image.fillColor( "red" );
    image.strokeWidth( 5 );
    image.draw( DrawableEllipse( 100,100, 50,75, 0,360 ) );
    image.fillColor( Color() ); // Clear out fill color

    //
    // Draw ellipse, and polygon, with black stroke, strokeWidth of 5
    //
    image.strokeColor( "black" );
    image.strokeWidth( 5 );
    vector<Drawable> drawlist;

    // Add polygon to list
    poly_coord.clear();
    poly_coord.push_back( Coordinate(30,30) );
    poly_coord.push_back( Coordinate(100,10) );
    poly_coord.push_back( Coordinate(190,290) );
    poly_coord.push_back( Coordinate(30,290) );
    drawlist.push_back( DrawablePolygon( poly_coord ) );
    image.draw( drawlist );

    //
    // Floodfill object with blue
    //
    image.colorFuzz( 0.5*QuantumRange );
    image.floodFillColor( "+132+62", "blue" );

    //
    // Draw text
    //
    image.strokeColor(Color());
    image.fillColor( "red" );
    if (getenv("MAGICK_FONT") != 0)
      image.font(string(getenv("MAGICK_FONT")));
    image.fontPointsize( 18 );
#if defined(MAGICKCORE_FREETYPE_DELEGATE)
    image.annotate( "Hello world!", "+150+20" );
#endif

    image.fillColor( "blue" );
    image.fontPointsize( 14 );
#if defined(MAGICKCORE_FREETYPE_DELEGATE)
    image.annotate( "Goodbye cruel world!", "+150+38" );
#endif

    image.fillColor( "black" );
    image.fontPointsize( 14 );
#if defined(MAGICKCORE_FREETYPE_DELEGATE)
    image.annotate( "I'm climbing the wall!", "+280+120",
                    NorthWestGravity, 90.0 );
#endif
    //image.display();
    //
    // Write image.
    //

    cout << "Writing image \"shapes_out.miff\" ..." << endl;
    image.depth( 8 );
    image.compressType( RLECompression );
    image.write( "shapes_out.miff" );

    // cout << "Display image..." << endl;
    // image.display( );

  }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  
  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: zoom.cpp]---
Location: ImageMagick-main/Magick++/demo/zoom.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 2001, 2002, 2003
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Resize image using specified resize algorithm with Magick++ API
//
// Usage: zoom [-density resolution] [-filter algorithm] [-geometry geometry]
//             [-resample resolution] input_file output_file
//

#include <Magick++.h>
#include <cstdlib>
#include <iostream>
#include <string>
using namespace std; 
using namespace Magick;

static void Usage ( char **argv )
{
  cout << "Usage: " << argv[0]
       << " [-density resolution] [-filter algorithm] [-geometry geometry]"
       << " [-resample resolution] input_file output_file" << endl
       << "   algorithm - bessel blackman box catrom cubic gaussian hamming hanning" << endl
       << "     hermite lanczos mitchell point quadratic sample scale sinc triangle" << endl;
  exit(1);
}

static void ParseError (int position, char **argv)
{
  cout << "Argument \"" <<  argv[position] << "\" at position" << position
       << "incorrect" << endl;
  Usage(argv);
}

int main(int argc,char **argv) 
{
  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  if ( argc < 2 )
    Usage(argv);

  enum ResizeAlgorithm
  {
    Zoom,
    Scale,
    Sample
  };

  {
    Geometry geometry;
    Magick::FilterType filter(LanczosFilter);
    Point density;
    Point resample;
    ResizeAlgorithm resize_algorithm=Zoom;

    int argv_index=1;
    while ((argv_index < argc - 2) && (*argv[argv_index] == '-'))
      {
        std::string command(argv[argv_index]);
        if (command.compare("-density") == 0)
          {
            argv_index++;
            try {
              density=Geometry(argv[argv_index]);
            }
            catch( exception &/* error_ */)
              {
                ParseError(argv_index,argv);
              }
            argv_index++;
            continue;
          }
        else if (command.compare("-filter") == 0)
          {
            argv_index++;
            std::string algorithm(argv[argv_index]);
            if (algorithm.compare("point") == 0)
              filter=PointFilter;
            else if (algorithm.compare("box") == 0)
              filter=BoxFilter;
            else if (algorithm.compare("triangle") == 0)
              filter=TriangleFilter;
            else if (algorithm.compare("hermite") == 0)
              filter=HermiteFilter;
            else if (algorithm.compare("hanning") == 0)
              filter=HanningFilter;
            else if (algorithm.compare("hamming") == 0)
              filter=HammingFilter;
            else if (algorithm.compare("blackman") == 0)
              filter=BlackmanFilter;
            else if (algorithm.compare("gaussian") == 0)
              filter=GaussianFilter;
            else if (algorithm.compare("quadratic") == 0)
              filter=QuadraticFilter;
            else if (algorithm.compare("cubic") == 0)
              filter=CubicFilter;
            else if (algorithm.compare("catrom") == 0)
              filter=CatromFilter;
            else if (algorithm.compare("mitchell") == 0)
              filter=MitchellFilter;
            else if (algorithm.compare("lanczos") == 0)
              filter=LanczosFilter;
            else if (algorithm.compare("bessel") == 0)
              filter=BesselFilter;
            else if (algorithm.compare("sinc") == 0)
              filter=SincFilter;
            else if (algorithm.compare("sample") == 0)
              resize_algorithm=Sample;
            else if (algorithm.compare("scale") == 0)
              resize_algorithm=Scale;
            else
              ParseError(argv_index,argv);
            argv_index++;
            continue;
          }
        else if (command.compare("-geometry") == 0)
          {
            argv_index++;
            try {
              geometry=Geometry(argv[argv_index]);
            }
            catch( exception &/* error_ */)
              {
                ParseError(argv_index,argv);
              }
            argv_index++;
            continue;
          }
        else if (command.compare("-resample") == 0)
          {
            argv_index++;
            try {
              resample=Geometry(argv[argv_index]);
            }
            catch( exception &/* error_ */)
              {
                ParseError(argv_index,argv);
              }
            argv_index++;
            continue;
          }
        ParseError(argv_index,argv);
      }

    if (argv_index>argc-1)
      ParseError(argv_index,argv);
    std::string input_file(argv[argv_index]);
    argv_index++;
    if (argv_index>argc)
      ParseError(argv_index,argv);
    std::string output_file(argv[argv_index]);

    try {
      Image image(input_file);
      if (density.isValid())
        image.density(density);
      density=image.density();

      if (resample.isValid())
        {
          geometry =
            Geometry(static_cast<size_t>
                     (image.columns()*((double)resample.x()/density.x())+0.5),
                     static_cast<size_t>
                     (image.rows()*((double)resample.y()/density.y())+0.5));
          image.density(resample);
        }
      switch (resize_algorithm)
        {
        case Sample:
          image.sample(geometry);
          break;
        case Scale:
          image.scale(geometry);
          break;
        case Zoom:
          image.filterType(filter);
          image.zoom(geometry);
          break;
        }
      image.write(output_file);
    }
    catch( exception &error_ )
      {
        cout << "Caught exception: " << error_.what() << endl;
        return 1;
      }
  }

  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: Blob.cpp]---
Location: ImageMagick-main/Magick++/lib/Blob.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002, 2004
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Implementation of Blob
//

#define MAGICKCORE_IMPLEMENTATION  1
#define MAGICK_PLUSPLUS_IMPLEMENTATION 1

#include "Magick++/Include.h"
#include "Magick++/Blob.h"
#include "Magick++/BlobRef.h"
#include "Magick++/Exception.h"

#include <string.h>

Magick::Blob::Blob(void)
  : _blobRef(new Magick::BlobRef(0,0))
{
}

Magick::Blob::Blob(const void* data_,const size_t length_)
  : _blobRef(new Magick::BlobRef(data_, length_))
{
}

Magick::Blob::Blob(const Magick::Blob& blob_)
  : _blobRef(blob_._blobRef)
{
  // Increase reference count
  _blobRef->increase();
}

Magick::Blob::~Blob()
{
  try
  {
    if (_blobRef->decrease() == 0)
      delete _blobRef;
  }
  catch(Magick::Exception&)
  {
  }

  _blobRef=(Magick::BlobRef *) NULL;
}

Magick::Blob& Magick::Blob::operator=(const Magick::Blob& blob_)
{
  if (this != &blob_)
    {
      blob_._blobRef->increase();
      if (_blobRef->decrease() == 0)
        delete _blobRef;
      
      _blobRef=blob_._blobRef;
    }
  return(*this);
}

void Magick::Blob::base64(const std::string base64_)
{
  size_t
    length;

  unsigned char
    *decoded;

  decoded=Base64Decode(base64_.c_str(),&length);

  if(decoded)
    updateNoCopy(static_cast<void*>(decoded),length,
      Magick::Blob::MallocAllocator);
}

std::string Magick::Blob::base64(void) const
{
  size_t
    encoded_length;

  char
    *encoded;

  std::string
    result;

  encoded_length=0;
  encoded=Base64Encode(static_cast<const unsigned char*>(data()),length(),
    &encoded_length);

  if(encoded)
    {
      result=std::string(encoded,encoded_length);
      encoded=(char *) RelinquishMagickMemory(encoded);
      return result;
    }

  return(std::string());
}

const void* Magick::Blob::data(void) const
{
  return(_blobRef->data);
}

size_t Magick::Blob::length(void) const
{
  return(_blobRef->length);
}

void Magick::Blob::update(const void* data_,size_t length_)
{
  if (_blobRef->decrease() == 0)
    delete _blobRef;

  _blobRef=new Magick::BlobRef(data_,length_);
}

void Magick::Blob::updateNoCopy(void* data_,size_t length_,
  Magick::Blob::Allocator allocator_)
{
  if (_blobRef->decrease() == 0)
    delete _blobRef;

  _blobRef=new Magick::BlobRef((const void*) NULL,0);
  _blobRef->data=data_;
  _blobRef->length=length_;
  _blobRef->allocator=allocator_;
}
```

--------------------------------------------------------------------------------

---[FILE: BlobRef.cpp]---
Location: ImageMagick-main/Magick++/lib/BlobRef.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002, 2004
//
// Copyright @ 2014 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// Implementation of Blob
//

#define MAGICKCORE_IMPLEMENTATION  1
#define MAGICK_PLUSPLUS_IMPLEMENTATION 1

#include "Magick++/Include.h"
#include "Magick++/BlobRef.h"
#include "Magick++/Exception.h"
#include "Magick++/Thread.h"

#include <string.h>

Magick::BlobRef::BlobRef(const void* data_,const size_t length_)
  : allocator(Magick::Blob::NewAllocator),
    length(length_),
    data((void*) NULL),
    _mutexLock(),
    _refCount(1)
{
  if (data_ != (const void*) NULL)
    {
      data=new unsigned char[length_];
      memcpy(data,data_,length_);
    }
}

Magick::BlobRef::~BlobRef(void)
{
  if (allocator == Magick::Blob::NewAllocator)
    {
      delete[] static_cast<unsigned char*>(data);
      data=(void *) NULL;
    }
  else if (allocator == Magick::Blob::MallocAllocator)
    data=(void *) RelinquishMagickMemory(data);
}

size_t Magick::BlobRef::decrease()
{
  size_t
    count;

  _mutexLock.lock();
  if (_refCount == 0)
    {
      _mutexLock.unlock();
      throwExceptionExplicit(MagickCore::OptionError,
        "Invalid call to decrease");
      return(0);
    }
  count=--_refCount;
  _mutexLock.unlock();
  return(count);
}

void Magick::BlobRef::increase()
{
  _mutexLock.lock();
  _refCount++;
  _mutexLock.unlock();
}
```

--------------------------------------------------------------------------------

---[FILE: CoderInfo.cpp]---
Location: ImageMagick-main/Magick++/lib/CoderInfo.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 2001, 2002
//
// Copyright @ 2013 ImageMagick Studio LLC, a non-profit organization
// dedicated to making software imaging solutions freely available.
//
// CoderInfo implementation
//

#define MAGICKCORE_IMPLEMENTATION  1
#define MAGICK_PLUSPLUS_IMPLEMENTATION  1

#include "Magick++/Include.h"
#include "Magick++/CoderInfo.h"
#include "Magick++/Exception.h"

using namespace std;

Magick::CoderInfo::CoderInfo(void)
  : _decoderThreadSupport(false),
    _description(),
    _encoderThreadSupport(false),
    _isMultiFrame(false),
    _isReadable(false),
    _isWritable(false),
    _mimeType(),
    _module(),
    _name()
{
}

Magick::CoderInfo::CoderInfo(const Magick::CoderInfo &coder_)
  : _decoderThreadSupport(coder_._decoderThreadSupport),
    _description(coder_._description),
    _encoderThreadSupport(coder_._encoderThreadSupport),
    _isMultiFrame(coder_._isMultiFrame),
    _isReadable(coder_._isReadable),
    _isWritable(coder_._isWritable),
    _mimeType(coder_._mimeType),
    _module(coder_._module),
    _name(coder_._name)
{
}

Magick::CoderInfo::CoderInfo(const std::string &name_)
  : _decoderThreadSupport(false),
    _description(),
    _encoderThreadSupport(false),
    _isMultiFrame(false),
    _isReadable(false),
    _isWritable(false),
    _mimeType(),
    _module(),
    _name()
{
  const Magick::MagickInfo
    *magickInfo;

  GetPPException;
  magickInfo=GetMagickInfo(name_.c_str(),exceptionInfo);
  ThrowPPException(false);
  if (magickInfo == 0)
    throwExceptionExplicit(MagickCore::OptionError,"Coder not found",
      name_.c_str());
  else
    {
      _decoderThreadSupport=(GetMagickDecoderThreadSupport(magickInfo) ==
        MagickTrue) ? true : false;
      _description=std::string(magickInfo->description);
      _encoderThreadSupport=(GetMagickEncoderThreadSupport(magickInfo) ==
        MagickTrue) ? true : false;
      _isMultiFrame=(GetMagickAdjoin(magickInfo) == MagickTrue) ? true : false;
      _isReadable=((magickInfo->decoder == (MagickCore::DecodeImageHandler *)
        NULL) ? false : true);
      _isWritable=((magickInfo->encoder == (MagickCore::EncodeImageHandler *)
        NULL) ? false : true);
      _mimeType=std::string(magickInfo->mime_type != (char *) NULL ?
        magickInfo->mime_type : "");
      _module=std::string(magickInfo->magick_module);
      _name=std::string(magickInfo->name);
    }
}

Magick::CoderInfo::~CoderInfo(void)
{
}

Magick::CoderInfo& Magick::CoderInfo::operator=(const CoderInfo &coder_)
{
  // If not being set to ourself
  if (this != &coder_)
    {
      _decoderThreadSupport=coder_._decoderThreadSupport;
      _description=coder_._description;
      _encoderThreadSupport=coder_._encoderThreadSupport;
      _isMultiFrame=coder_._isMultiFrame;
      _isReadable=coder_._isReadable;
      _isWritable=coder_._isWritable;
      _mimeType=coder_._mimeType;
      _module=coder_._module;
      _name=coder_._name;
    }
  return(*this);
}

bool Magick::CoderInfo::canReadMultithreaded(void) const
{
  return(_decoderThreadSupport);
}

bool Magick::CoderInfo::canWriteMultithreaded(void) const
{
  return(_encoderThreadSupport);
}

std::string Magick::CoderInfo::description(void) const
{
  return(_description);
}

bool Magick::CoderInfo::isReadable(void) const
{
  return(_isReadable);
}

bool Magick::CoderInfo::isWritable(void) const
{
  return(_isWritable);
}

bool Magick::CoderInfo::isMultiFrame(void) const
{
  return(_isMultiFrame);
}

std::string Magick::CoderInfo::mimeType(void) const
{
  return(_mimeType);
}

std::string Magick::CoderInfo::module(void) const
{
  return(_module);
}

std::string Magick::CoderInfo::name(void) const
{
  return(_name);
}

bool Magick::CoderInfo::unregister(void) const
{
  return(UnregisterMagickInfo(_name.c_str()) != MagickFalse);
}
```

--------------------------------------------------------------------------------

````
