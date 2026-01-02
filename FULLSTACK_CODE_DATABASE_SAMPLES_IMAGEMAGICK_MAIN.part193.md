---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:34Z
part: 193
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 193 of 851)

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

---[FILE: averageImages.cpp]---
Location: ImageMagick-main/Magick++/tests/averageImages.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2003
//
// Test STL averageImages function
//

#include <Magick++.h>
#include <string>
#include <iostream>
#include <list>
#include <vector>

using namespace std;

using namespace Magick;

int main( int /*argc*/, char ** argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  int failures=0;

  try {

    string srcdir("");
    if(getenv("SRCDIR") != 0)
      srcdir = getenv("SRCDIR");

    //
    // Test averageImages
    //
    
    list<Image> imageList;
    readImages( &imageList, srcdir + "test_image_anim.miff" );
    
    Image averaged;
    averageImages( &averaged, imageList.begin(), imageList.end() );
    // averaged.display();
    if (
        ( averaged.signature() != "16fac0dc82f3901de623ce9ff991c368f6752acf6cb0c11170d78412c3729730") &&
        ( averaged.signature() != "6574796b7b07d7400a7a310052eabf2b58f81952d1854a76ac9a23890ac2073b") &&
        ( averaged.signature() != "ad4861b99339d84bed685eb42bbabe657abb60d48b8fc7ddf680af866dd45ad4") &&
        ( averaged.signature() != "8e6e1a9b5f1eec5539b1f44347249f227f3e07f9acb07d80404ca6a19f88db7c") &&
        ( averaged.signature() != "a88e978776d45b73bc8c9f37f6726cc9f14a3118b9a82384ee5acf488c5c2863") &&
        ( averaged.signature() != "6bda37a8b6734ac271595f5b583d801cfb2479637401d056eae9be97127f558f") &&
        ( averaged.signature() != "919a9e18a5e5ded83c2c4e5cfcd21d654802fcc14b06b02898d96fe28f04a1a1")
       )
      {
	cout << "Line: " << __LINE__
	     << "  Averaging image failed, signature = "
	     << averaged.signature() << endl;
	averaged.display();
	++failures;
      }
  }

  catch( Exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }

  if ( failures )
    {
      cout << failures << " failures" << endl;
      return 1;
    }
  
  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: coalesceImages.cpp]---
Location: ImageMagick-main/Magick++/tests/coalesceImages.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2003
//
// Test STL coalesceImages function
//

#include <Magick++.h>
#include <string>
#include <iostream>
#include <list>
#include <vector>

using namespace std;

using namespace Magick;

int main( int /*argc*/, char ** argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  int failures=0;

  try {

    string srcdir("");
    if(getenv("SRCDIR") != 0)
      srcdir = getenv("SRCDIR");

    //
    // Test coalesceImages
    //

    list<Image> imageList;
    readImages( &imageList, srcdir + "test_image_anim.miff" );

    list<Image> coalescedList;
    coalesceImages( &coalescedList, imageList.begin(), imageList.end() );
  }

  catch( Exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }

  if ( failures )
    {
      cout << failures << " failures" << endl;
      return 1;
    }
  
  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: coderInfo.cpp]---
Location: ImageMagick-main/Magick++/tests/coderInfo.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 2001, 2002, 2003
//
// Test Magick::CoderInfo class and Magick::coderInfoList
//

#include <Magick++.h>
#include <string>
#include <iostream>
#include <list>

using namespace std;

using namespace Magick;

int test( CoderInfo::MatchType isReadable_,
          CoderInfo::MatchType isWritable_,
          CoderInfo::MatchType isMultiFrame_ )
{
  int result = 0;
  list<CoderInfo> coderList;
  coderInfoList( &coderList, isReadable_, isWritable_, isMultiFrame_ );
  list<CoderInfo>::iterator entry = coderList.begin();
  while( entry != coderList.end() )
    {
      // Readable
      if ( isReadable_ != CoderInfo::AnyMatch &&
           (( entry->isReadable() && isReadable_ != CoderInfo::TrueMatch ) ||
            ( !entry->isReadable() && isReadable_ != CoderInfo::FalseMatch )) )
        {
          cout << "Entry \""
               << entry->name()
               << "\" has unexpected readability state ("
               << static_cast<int>(entry->isReadable())
               << ")"
               << endl;
          ++result;
        }

      // Writable
      if ( isWritable_ != CoderInfo::AnyMatch &&
           (( entry->isWritable() && isWritable_ != CoderInfo::TrueMatch ) ||
            ( !entry->isWritable() && isWritable_ != CoderInfo::FalseMatch )) )
        {
          cout << "Entry \""
               << entry->name()
               << "\" has unexpected writability state ("
               << static_cast<int>(entry->isWritable())
               << ")"
               << endl;
          ++result;
        }

      // MultiFrame
      if ( isMultiFrame_ != CoderInfo::AnyMatch &&
           (( entry->isMultiFrame() && isMultiFrame_ != CoderInfo::TrueMatch ) ||
            ( !entry->isMultiFrame() && isMultiFrame_ != CoderInfo::FalseMatch )) )
        {
          cout << "Entry \""
               << entry->name()
               << "\" has unexpected multiframe state ("
               << static_cast<int>(entry->isMultiFrame())
               << ")"
               << endl;
          ++result;
        }

      entry++;
    }

  return result;
}

int main( int /*argc*/, char **argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  int failures=0;

  try {

    CoderInfo coderInfo("GIF");
    if ( coderInfo.name() != string("GIF") )
      {
        cout << "Unexpected coder name \""
             << coderInfo.name()
             << "\""
             << endl;
        ++failures;
      }

    if( coderInfo.description() != string("CompuServe graphics interchange format") )
      {
        cout << "Unexpected coder description \""
             << coderInfo.description()
             << "\""
             << endl;
        ++failures;
      }

    failures += test(CoderInfo::AnyMatch,CoderInfo::AnyMatch,CoderInfo::AnyMatch);
    failures += test(CoderInfo::FalseMatch,CoderInfo::FalseMatch,CoderInfo::FalseMatch);

    failures += test(CoderInfo::TrueMatch,CoderInfo::AnyMatch,CoderInfo::AnyMatch);
    failures += test(CoderInfo::FalseMatch,CoderInfo::AnyMatch,CoderInfo::AnyMatch);

    failures += test(CoderInfo::AnyMatch,CoderInfo::TrueMatch,CoderInfo::AnyMatch);
    failures += test(CoderInfo::AnyMatch,CoderInfo::FalseMatch,CoderInfo::AnyMatch);

    failures += test(CoderInfo::AnyMatch,CoderInfo::AnyMatch,CoderInfo::TrueMatch);
    failures += test(CoderInfo::AnyMatch,CoderInfo::AnyMatch,CoderInfo::FalseMatch);
  }
  catch( Exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  
  if ( failures )
    {
      cout << failures << " failures" << endl;
      return 1;
    }

  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: color.cpp]---
Location: ImageMagick-main/Magick++/tests/color.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002, 2003
//
// Test Magick::Color classes
//

#include <Magick++.h>
#include <string>
#include <iostream>

using namespace std;

using namespace Magick;

int main( int /*argc*/, char **argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  int failures=0;

  try {

    //
    // Verify conversion from named colors as well as ColorRGB constructor
    //

    {
      struct colorStr
      {
	const char* color;
	double red;
	double green;
	double blue;
      };

      // Convert ratios from rgb.txt via value/255
      struct colorStr colorMap [] =
      { 
	{ "red", 1,0,0 },
	{ "lime", 0,1,0 },
	{ "blue", 0,0,1 },
	{ "black", 0,0,0 },
	{ "white", 1,1,1 },
	{ "cyan", 0,1,1 },
	{ "magenta", 1,0,1 },
	{ "yellow", 1,1,0 },
	{ NULL, 0,0,0 }
      };

      for ( int i = 0; colorMap[i].color != NULL; i++ )
	{
	  {
	    Color color( colorMap[i].color );
	    ColorRGB colorMatch( colorMap[i].red,
				 colorMap[i].green,
				 colorMap[i].blue );
	    if ( color != colorMatch )
	      {
		++failures;
		cout << "Line: " << __LINE__ << " Color(\""
		     << colorMap[i].color << "\") is "
		     << string(color)
		     << " rather than "
		     << string(colorMatch)
		     << endl;
                // printf ("Green: %10.16f\n", color.green());
	      }
	  }
	}      
    }

    // Test conversion to/from X11-style color specifications
    {
      const char * colorStrings[] =
      {
	"#ABC",
	"#AABBCC",
	"#AAAABBBBCCCC",
	NULL
      };

#if MAGICKCORE_QUANTUM_DEPTH == 8
      string expectedString = "#AABBCC";
#elif MAGICKCORE_QUANTUM_DEPTH == 16
      string expectedString = "#AAAABBBBCCCC";
#elif MAGICKCORE_QUANTUM_DEPTH == 32
      string expectedString = "#AAAAAAAABBBBBBBBCCCCCCCC";
#elif MAGICKCORE_QUANTUM_DEPTH == 64
      string expectedString = "#AAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBCCCCCCCCCCCCCCCC";
#else
# error Quantum depth not supported!
#endif

      for ( int i = 0; colorStrings[i] != NULL; ++i )
	{
	  if ( string(Color(colorStrings[i])) != expectedString )
	    {
	      ++failures;
	      cout << "Line: " << __LINE__
		   << " Conversion from " << colorStrings[i]
		   << " is "
		   << string(Color(colorStrings[i])) << " rather than "
		   << expectedString
		   << endl;
	    }
	}
    }

    // Test ColorGray
    {
      double resolution = 1.0/QuantumRange;
      if ( resolution < 0.0000001 )
        resolution = 0.0000001;
      double max_error = resolution + MagickEpsilon;

      for( double value = 0; value < 1.0 + MagickEpsilon; value += resolution )
        {
          ColorGray gray(value);
          if ( gray.shade() < value - max_error || gray.shade() > value + max_error )
            {
              ++failures;
              cout << "Line: " << __LINE__
                   << " shade is "
                   << gray.shade()
                   << " rather than nominal "
                   << value
                   << endl;
            }
        }
    }

  }
  catch( Exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  
  if ( failures )
    {
      cout << failures << " failures" << endl;
      return 1;
    }

  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: colorHistogram.cpp]---
Location: ImageMagick-main/Magick++/tests/colorHistogram.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 2003
//
// Test STL colorHistogram function
//

#undef USE_VECTOR
#define USE_MAP

#include <Magick++.h>
#include <string>
#include <iostream>
#include <iomanip>
#if defined(USE_VECTOR)
#  include <vector>
#  include <utility>
#endif
#if defined(USE_MAP)
#  include <map>
#endif

using namespace std;

using namespace Magick;

int main( int /*argc*/, char ** argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  int failures=0;

  try {

    string srcdir("");
    if(getenv("SRCDIR") != 0)
      srcdir = getenv("SRCDIR");

    // Read image
    Image image;
    image.read( srcdir + "test_image.miff" );

    // Create histogram vector
#if defined(USE_MAP)
    std::map<Color,size_t> histogram;
#elif defined(USE_VECTOR)
    std::vector<std::pair<Color,size_t> > histogram;
#endif

    colorHistogram( &histogram, image );

    // Print out histogram
#if (MAGICKCORE_QUANTUM_DEPTH == 8)
    int quantum_width=3;
#elif (MAGICKCORE_QUANTUM_DEPTH == 16)
    int quantum_width=5;
#else
    int quantum_width=10;
#endif

    cout << "Histogram for file \"" << image.fileName() << "\"" << endl
         << histogram.size() << " entries:" << endl;

#if defined(USE_MAP)
    std::map<Color,size_t>::const_iterator p=histogram.begin();
#elif defined(USE_VECTOR)
    std::vector<std::pair<Color,size_t> >::const_iterator p=histogram.begin();
#endif
    while (p != histogram.end())
      {
        cout << setw(10) << (int)p->second << ": ("
             << setw(quantum_width) << (int)p->first.quantumRed() << ","
             << setw(quantum_width) << (int)p->first.quantumGreen() << ","
             << setw(quantum_width) << (int)p->first.quantumBlue() << ")"
             << endl;
        p++;
      }
  }

  catch( Exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }

  if ( failures )
    {
      cout << failures << " failures" << endl;
      return 1;
    }
  
  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: exceptions.cpp]---
Location: ImageMagick-main/Magick++/tests/exceptions.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2001, 2002, 2003
//
// Tests for throwing exceptions
//

#include <Magick++.h>
#include <string>
#include <iostream>

using namespace std;

using namespace Magick;

int main( int /*argc*/, char ** argv)
{
  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);
      
  volatile int failures=0;
      
  cout << "Checking for working exceptions (may crash) ... ";
  cout.flush();

  {      
    // Basic exception test
    try
      {
        failures++;
        throw int(100);
      }
    catch ( int /*value_*/ )
      {
        failures--;
      }
      
    // Throw a Magick++ exception class.
    try
      {
        failures++;
        cout << "Throwing 'Magick::WarningResourceLimit' exception" << endl;
        cout.flush();
        throw WarningResourceLimit("How now brown cow?");
      }
    catch( Exception & /*error_*/ )
      {
        cout << "Successfully caught 'Magick::WarningResourceLimit' exception" << endl;
        cout.flush();
        failures--;
      }
      
    // A more complex test
    try
      {
        size_t columns = 640;
        size_t rows = 480;
        Geometry geometry(columns,rows);
        Color canvasColor( "red" );
        Image image( geometry, canvasColor);
          
        {
          try
            {
              failures++;
              cout << "Throwing library 'Magick::Exception' exception" << endl;
              cout.flush();
              image.directory();
            }
          catch ( Exception& /*error_*/ )
            {
              cout << "Successfully caught library 'Magick::Exception' exception" << endl;
              cout.flush();
              failures--;
            }
        }
          
      }
    catch( Exception &error_ )
      {
        cout << "Bogus catch: Caught exception: " << error_.what() << endl;
        cout.flush();
        return 1;
      }
    catch( exception &error_ )
      {
        cout << "Bogus catch: Caught exception: " << error_.what() << endl;
        cout.flush();
        return 1;
      }
  
    if ( failures )
      {
        cout << failures << " failures" << endl;
        cout.flush();
        return 1;
      }
    cout << "Exception testing passed!" << endl;
  }

  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: geometry.cpp]---
Location: ImageMagick-main/Magick++/tests/geometry.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Dirk Lemstra 2015
//
// Test Magick::Geometry class
//

#include <Magick++.h>
#include <string>
#include <iostream>

using namespace std;

using namespace Magick;

int main(int, char **argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  int failures=0;

  try
  {

    //
    // Verify conversion from and to string
    //

    string input="100x50+10-5!";
    Geometry geometry(input);

    if ((geometry.width() != 100) || (geometry.height() != 50) ||
        (geometry.xOff() != 10) || (geometry.yOff() != -5) ||
        (geometry.aspect() == false))
      {
        ++failures;
        cout << "Line: " << __LINE__
        << " Conversion from " << input << " failed"
        << endl;
      }

    string output=geometry;
    if (output != input)
      {
        ++failures;
        cout << "Line: " << __LINE__
        << " Output " << output << " is not the same as " << input
        << endl;
      }
  }
  catch( Exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  
  if ( failures )
    {
      cout << failures << " failures" << endl;
      return 1;
    }

  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: montageImages.cpp]---
Location: ImageMagick-main/Magick++/tests/montageImages.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2002, 2003
//
// Test STL montageImages function
//

#include <Magick++.h>
#include <string>
#include <iostream>
#include <list>
#include <vector>

using namespace std;

using namespace Magick;

int main( int /*argc*/, char ** argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  const char *const p = getenv("MAGICK_FONT");
  const string MAGICK_FONT(p ? p : "");
  
  int failures=0;

  try {

    string srcdir("");
    if(getenv("SRCDIR") != 0)
      srcdir = getenv("SRCDIR");

    //
    // Test montageImages
    //

    list<Image> imageList;
    readImages( &imageList, srcdir + "test_image_anim.miff" );

    vector<Image> montage;
    MontageFramed montageOpts;
    montageOpts.font(MAGICK_FONT);

    // Default montage
    montageImages( &montage, imageList.begin(), imageList.end(), montageOpts );

    {
      Geometry targetGeometry(128, 126 );
      if ( montage[0].montageGeometry() != targetGeometry )
        {
          ++failures;
          cout << "Line: " << __LINE__ 
               << "  Montage geometry ("
               << string(montage[0].montageGeometry())
               << ") is incorrect (expected "
               << string(targetGeometry)
               << ")"
               << endl;
        }
    }

    if ( montage[0].columns() != 768 || montage[0].rows() != 504 )
      {
	++failures;
	cout << "Line: " << __LINE__ 
	     << "  Montage columns/rows ("
	     << montage[0].columns() << "x"
	     << montage[0].rows()
	     << ") incorrect. (expected 768x504)" << endl;
      }

    // Montage with options set
    montage.clear();
    montageOpts.borderColor( "green" );
    montageOpts.borderWidth( 1 );
    montageOpts.fileName( "Montage" );
    montageOpts.frameGeometry( "6x6+3+3" );
    montageOpts.geometry("50x50+2+2>");
    montageOpts.gravity( CenterGravity );
    montageOpts.strokeColor( "yellow" );
    montageOpts.shadow( true );
    montageOpts.texture( "granite:" );
    montageOpts.tile("2x1");
    montageImages( &montage, imageList.begin(), imageList.end(), montageOpts );

    if ( montage.size() != 3 )
      {
	++failures;
	cout << "Line: " << __LINE__ 
	     << "  Montage images failed, number of montage frames is "
	     << montage.size()
	     << " rather than 3 as expected." << endl;
      }

    {
      Geometry targetGeometry( 66, 70 );
      if ( montage[0].montageGeometry() != targetGeometry )
        {
          ++failures;
          cout << "Line: " << __LINE__ 
               << "  Montage geometry ("
               << string(montage[0].montageGeometry())
               << ") is incorrect (expected "
               << string(targetGeometry)
               << ")."
               << endl;
        }
    }

    if ( montage[0].columns() != 136 || montage[0].rows() != 70 )
      {
	++failures;
	cout << "Line: " << __LINE__ 
	     << "  Montage columns/rows ("
	     << montage[0].columns() << "x"
	     << montage[0].rows()
	     << ") incorrect. (expected 136x70)" << endl;
      }
  }

  catch( Exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }

  if ( failures )
    {
      cout << failures << " failures" << endl;
      return 1;
    }
  
  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: morphImages.cpp]---
Location: ImageMagick-main/Magick++/tests/morphImages.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2003
//
// Test STL morphImages function
//

#include <Magick++.h>
#include <string>
#include <iostream>
#include <list>
#include <vector>

using namespace std;

using namespace Magick;

int main( int /*argc*/, char **argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  int failures=0;

  try {

    string srcdir("");
    if(getenv("SRCDIR") != 0)
      srcdir = getenv("SRCDIR");

    //
    // Test morphImages
    //

    list<Image> imageList;
    readImages( &imageList, srcdir + "test_image_anim.miff" );

    list<Image> morphed;
    morphImages( &morphed, imageList.begin(), imageList.end(), 3 );

    if ( morphed.size() != 21 )
      {
	++failures;
	cout << "Line: " << __LINE__ 
	     << "  Morph images failed, number of frames is "
	     << morphed.size()
	     << " rather than 21 as expected." << endl;
      }
  }

  catch( Exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }

  if ( failures )
    {
      cout << failures << " failures" << endl;
      return 1;
    }
  
  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: readWriteBlob.cpp]---
Location: ImageMagick-main/Magick++/tests/readWriteBlob.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2003
//
// Test reading/writing BLOBs using Magick++
//

#include <Magick++.h>
#include <string>
#include <iostream>
#include <fstream>

#if defined(MISSING_STD_IOS_BINARY)
#  define IOS_IN_BINARY ios::in
#else
#  define IOS_IN_BINARY ios::in | ios::binary
#endif

using namespace std;

using namespace Magick;

// A derived Blob class to exercise updateNoCopy()
class myBlob : public Blob
{
public:
  // Construct from open binary stream
  myBlob( ifstream &stream_ )
    : Blob()
    {
      unsigned char* blobData = new unsigned char[100000];
      char* c= reinterpret_cast<char *>(blobData);
      size_t blobLen=0;
      while( (blobLen< 100000) && stream_.get(*c) )
        {
          c++;
          blobLen++;
        }
      if ((!stream_.eof()) || (blobLen == 0))
        {
          cout << "Failed to stream into blob!" << endl;
          exit(1);
        }

      // Insert data into blob
      updateNoCopy( reinterpret_cast<unsigned char*>(blobData), blobLen,
                    Blob::NewAllocator );
    }
};


int main( int /*argc*/, char ** argv)
{

  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  int failures=0;

  try
    {
      string srcdir("");
      if(getenv("SRCDIR") != 0)
        srcdir = getenv("SRCDIR");

      string testimage;
    
      //
      // Test reading BLOBs
      //
      {
        string signature("");
        {
          Image image(srcdir + "test_image.miff");
          signature = image.signature();
        }

        // Read raw data from file into BLOB
        testimage = srcdir + "test_image.miff";
        ifstream in( testimage.c_str(), ios::in | IOS_IN_BINARY );
        if( !in )
          {
            cout << "Failed to open file " << testimage << " for input!" << endl;
            exit(1);
          }
        unsigned char* blobData = new unsigned char[100000];
        char* c=reinterpret_cast<char *>(blobData);
        size_t blobLen=0;
        while( (blobLen< 100000) && in.get(*c) )
          {
            c++;
            blobLen++;
          }
        if ((!in.eof()) || (blobLen == 0))
          {
            cout << "Failed to read file " << testimage << " for input!" << endl;
            exit(1);
          }
        in.close();

        // Construct Magick++ Blob
        Blob blob(static_cast<const unsigned char*>(blobData), blobLen);
        delete [] blobData;

        // If construction of image fails, an exception should be thrown
        {
          // Construct with blob data only
          Image image( blob );
          if ( image.signature() != signature )
            {
              ++failures;
              cout << "Line: " << __LINE__
                   << "  Image signature "
                   << image.signature()
                   << " != "
                   << signature << endl;
            }
        }

        {
          // Construct with image geometry and blob data
          Image image(  blob, Geometry(148,99));
          if ( image.signature() != signature )
            {
              ++failures;
              cout << "Line: " << __LINE__
                   << "  Image signature "
                   << image.signature()
                   << " != "
                   << signature << endl;
            }
        }

        {
          // Construct default image, and then read in blob data
          Image image;
          image.read( blob );
          if ( image.signature() != signature )
            {
              ++failures;
              cout << "Line: " << __LINE__
                   << "  Image signature "
                   << image.signature()
                   << " != "
                   << signature << endl;
            }
        }

        {
          // Construct default image, and then read in blob data with
          // image geometry
          Image image;
          image.read( blob, Geometry(148,99) );
          if ( image.signature() != signature )
            {
              ++failures;
              cout << "Line: " << __LINE__
                   << "  Image signature "
                   << image.signature()
                   << " != "
                   << signature << endl;
            }
        }

      }

      // Test writing BLOBs
      {
        Blob blob;
        string signature("");
        {
          Image image(srcdir + "test_image.miff");
          image.magick("MIFF");
          image.write( &blob );
          signature = image.signature();
        }
        {
          Image image(blob);
          if ( image.signature() != signature )
            {
              ++failures;
              cout << "Line: " << __LINE__
                   << "  Image signature "
                   << image.signature()
                   << " != "
                   << signature << endl;
              image.display();
            }
        }
      
      }
      // Test writing BLOBs via STL writeImages
      {
        Blob blob;

        list<Image> first;
        readImages( &first, srcdir + "test_image_anim.miff" );
        writeImages( first.begin(), first.end(), &blob, true );
      }

      // Test constructing a BLOB from a derived class
      {

        string signature("");
        {
          Image image(srcdir + "test_image.miff");
          signature = image.signature();
        }

        // Read raw data from file into BLOB
        testimage = srcdir + "test_image.miff";
        ifstream in( testimage.c_str(), ios::in | IOS_IN_BINARY );
        if( !in )
          {
            cout << "Failed to open file for input!" << endl;
            exit(1);
          }

        myBlob blob( in );
        in.close();

        Image image( blob );
        if ( image.signature() != signature )
          {
            ++failures;
            cout << "Line: " << __LINE__
                 << "  Image signature "
                 << image.signature()
                 << " != "
                 << signature << endl;
          }
      }
    }
  
  catch( Exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  catch( exception &error_ )
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }

  if ( failures )
    {
      cout << failures << " failures" << endl;
      return 1;
    }
  
  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: readWriteImages.cpp]---
Location: ImageMagick-main/Magick++/tests/readWriteImages.cpp

```cpp
// This may look like C code, but it is really -*- C++ -*-
//
// Copyright Bob Friesenhahn, 1999, 2000, 2003
// Copyright Dirk Lemstra 2014
//
// Test STL readImages and writeImages functions and test
// image format when reading/writing.
//

#include <Magick++.h>
#include <string>
#include <iostream>
#include <list>
#include <vector>

using namespace std;

using namespace Magick;

int main(int,char ** argv)
{
  int
    failures=0;

  string
    srcdir("");


  // Initialize ImageMagick install location for Windows
  MagickPlusPlusGenesis genesis(*argv);

  try
  {
    if (getenv("SRCDIR") != 0)
      srcdir=getenv("SRCDIR");

    //
    // Test readImages and writeImages
    //
    list<Image> first;
    readImages(&first,srcdir + "test_image_anim.miff");

    if (first.size() != 6)
      {
        ++failures;
        cout << "Line: " << __LINE__
          << "  Read images failed, number of frames is "
          << first.size()
          << " rather than 6 as expected." << endl;
      }

    writeImages(first.begin(),first.end(),"testmagick_anim_out.miff");

    list<Image> second;
    readImages(&second,"testmagick_anim_out.miff");

    list<Image>::iterator firstIter = first.begin();
    list<Image>::iterator secondIter = second.begin();
    while (firstIter != first.end() && secondIter != second.end())
    {
      if (firstIter->scene() != secondIter->scene())
        {
          ++failures;
          cout << "Line: " << __LINE__
            << "  Image scene: " << secondIter->scene()
            << " is not equal to original "
            << firstIter->scene()
            << endl;
        }

      if (firstIter->rows() != secondIter->rows())
        {
          ++failures;
          cout << "Line: " << __LINE__
            << "  Image rows " << secondIter->rows()
            << " are not equal to original "
            << firstIter->rows()
            << endl;
        }

      if (firstIter->columns() != secondIter->columns())
        {
          ++failures;
          cout << "Line: " << __LINE__
            << "  Image columns " << secondIter->columns()
            << " are not equal to original "
            << firstIter->rows()
            << endl;
        }

      firstIter++;
      secondIter++;
    }

    Image third(*first.begin());
    third.write("testmagick_anim_out");

    Image fourth;
    fourth.read("testmagick_anim_out");

    if (fourth.magick() != "MIFF")
      {
        ++failures;
        cout << "Line: " << __LINE__
          << "  Image magick: " << fourth.magick()
          << " is not equal to MIFF"
          << endl;
      }

    third.write("testmagick_anim_out.ico");
    fourth.read("testmagick_anim_out.ico");

    if (fourth.magick() != "ICO")
      {
        ++failures;
        cout << "Line: " << __LINE__
          << "  Image magick: " << fourth.magick()
          << " is not equal to ICO"
          << endl;
      }

    third.magick("BMP");
    third.write("testmagick_anim_out.ico");
    fourth.read("testmagick_anim_out.ico");

    if (fourth.magick() != "BMP")
      {
        ++failures;
        cout << "Line: " << __LINE__
          << "  Image magick: " << fourth.magick()
          << " is not equal to BMP"
          << endl;
      }

    third.write("PDB:testmagick_anim_out.ico");
    fourth.read("testmagick_anim_out.ico");

    if (fourth.magick() != "PDB")
      {
        ++failures;
        cout << "Line: " << __LINE__
          << "  Image magick: " << fourth.magick()
          << " is not equal to PDB"
          << endl;
      }

    third.magick("");
    third.write("testmagick_anim_out.ico");
    fourth.read("testmagick_anim_out.ico");

    if (fourth.magick() != "ICO")
      {
        ++failures;
        cout << "Line: " << __LINE__
          << "  Image magick: " << fourth.magick()
          << " is not equal to ICO"
          << endl;
      }
  }
  catch(Exception &error_)
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }
  catch(exception &error_)
    {
      cout << "Caught exception: " << error_.what() << endl;
      return 1;
    }

  if (failures)
    {
      cout << failures << " failures" << endl;
      return 1;
    }

  return 0;
}
```

--------------------------------------------------------------------------------

---[FILE: tests.tap]---
Location: ImageMagick-main/Magick++/tests/tests.tap

```text
#!/bin/sh
#
# Copyright 2004 Bob Friesenhahn <bfriesen@simple.dallas.tx.us>
#
# This file is part of Magick++, the C++ API for ImageMagick and
# ImageMagick.  Please see the file "COPYING" included with Magick++
# for usage and copying restrictions.
#
subdir=Magick++/tests
. ./common.shi
echo "1..13"

SRCDIR=${top_srcdir}/${subdir}/
export SRCDIR

cd ${subdir} || exit 1

for mytest in appendImages attributes averageImages coalesceImages coderInfo color colorHistogram exceptions geometry montageImages morphImages readWriteBlob readWriteImages
do
  ./${mytest} && echo "ok" || echo "not ok"
done
:
```

--------------------------------------------------------------------------------

````
