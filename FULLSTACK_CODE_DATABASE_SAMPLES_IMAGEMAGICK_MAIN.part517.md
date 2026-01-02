---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 517
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 517 of 851)

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

---[FILE: validate-colorspace.tap]---
Location: ImageMagick-main/tests/validate-colorspace.tap

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
echo "1..1"

${VALIDATE} -validate colorspace && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: validate-compare.tap]---
Location: ImageMagick-main/tests/validate-compare.tap

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
echo "1..1"

${VALIDATE} -validate compare && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: validate-composite.tap]---
Location: ImageMagick-main/tests/validate-composite.tap

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
echo "1..1"

${VALIDATE} -validate composite && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: validate-convert.tap]---
Location: ImageMagick-main/tests/validate-convert.tap

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
echo "1..1"

${VALIDATE} -validate convert && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: validate-formats-disk.tap]---
Location: ImageMagick-main/tests/validate-formats-disk.tap

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
echo "1..1"

${VALIDATE} -validate formats-disk && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: validate-formats-map.tap]---
Location: ImageMagick-main/tests/validate-formats-map.tap

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
echo "1..1"

${VALIDATE} -validate formats-map && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: validate-formats-memory.tap]---
Location: ImageMagick-main/tests/validate-formats-memory.tap

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
echo "1..1"

${VALIDATE} -validate formats-memory && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: validate-identify.tap]---
Location: ImageMagick-main/tests/validate-identify.tap

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
echo "1..1"

${VALIDATE} -validate identify && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: validate-import.tap]---
Location: ImageMagick-main/tests/validate-import.tap

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
echo "1..1"

${VALIDATE} -validate import-export && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: validate-magick.tap]---
Location: ImageMagick-main/tests/validate-magick.tap

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
echo "1..1"

${VALIDATE} -validate magick && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: validate-montage.tap]---
Location: ImageMagick-main/tests/validate-montage.tap

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
echo "1..1"

${VALIDATE} -validate montage && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

---[FILE: validate-stream.tap]---
Location: ImageMagick-main/tests/validate-stream.tap

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
echo "1..1"

${VALIDATE} -validate stream && echo "ok" || echo "not ok"
:
```

--------------------------------------------------------------------------------

````
