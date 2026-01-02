---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 453
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 453 of 1290)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - zulip-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/zulip-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: noble.list]---
Location: zulip-main/scripts/setup/apt-repos/teleport/noble.list

```text
deb [signed-by=/etc/apt/keyrings/teleport-pubkey.asc] https://apt.releases.teleport.dev/ubuntu noble stable/v17
```

--------------------------------------------------------------------------------

---[FILE: teleport-pubkey.asc]---
Location: zulip-main/scripts/setup/apt-repos/teleport/teleport-pubkey.asc

```text
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQINBF+R3LYBEADOEO9i3Dm5rEAiXONchX3M54QzZX0yHArSpYQ5aJDdJRQbqzqT
+e2os8NpSjVDZFNz5ul8xkZsnCLX7pgrAYqq+vsXL4bMWDP96S6PjfVIAyV4ylv0
DBReMdkaAZb/IoPhkSTT+ayw4eGEtUz/k7mxMpQ9ob7qFtGs8aNVT/An5LfFR1Lx
9WOlFPPIAJKcHVIyRD+4EoCSn1R1c61UHFIRatbAnwOLs3iz4/GU+w9wdbuWbDuk
nGdG0Lmlzp42HHxeJJFQlOTed97+trktvAiuzA/0lbQHEcWvxfWAy5//cjORp+H3
RGLp8fJ+fFRAyA4WP6O3wIC4gAAgsEn8WpVT8wZYlLMRf694SeawBtyUSlcsn9i1
LuOh5akOY3iQtH01+rMBjOaMkCmpT2nQaUH+HS2iZBddBHdAMMQtj2UolMRbUSxH
+GJczes1t9/WH3vbvh5ESMOy0fH14Tjo+9yQYa4EhFNNloAG10DYFLlCj47fWDdS
o/++vhZsKaS7yLHDGOLPT+x15ComG2gupmRkbATvUddztlsfF+tD97laT9eaLB1W
zxszqr8+LxP961wmbS2j+ZBbXyrPr1Fln/TdyFAhkIMJ+J5hZB+NcjRUwUoB7nOd
+FbTxtnyJb2iaJNCJHJQVA85IYzUpXA3CDdgUHF810kVBcBPBtLhZC5ybQARAQAB
tCtHcmF2aXRhdGlvbmFsLCBJbmMgPGluZm9AZ3Jhdml0YXRpb25hbC5jb20+iQJU
BBMBCAA+FiEEDF6LpWWOMg0bAxF5yH7VOmKCxBEFAl+R3LYCGwMFCRLMAwAFCwkI
BwIGFQoJCAsCBBYCAwECHgECF4AACgkQyH7VOmKCxBFfxxAAiXWJm86oZtVdAlp1
pzpKeV0pwgrnt7Uk8fu5tYpdE/oVMnwcdsDDQucItGtHGfjmzs3Cr8/praekenf1
9iHSz422OpIGzCI4VfXaFPVfzbV1w7cSOnceY6lPnKUMrRBKKJX5Nw/6LZS40gsQ
BoeZxe0MXB4tBc4dY30f1MQ44amRYmtTA7wep+ymVRfkPnHNnIrsdYGldbfPsbPO
PUX8ZnWZiuI0+NgX3oBOl6YY4JehBJj61Ukx1DPHHLhhundHumChYFn+LBIZxD3O
B9uoRzUzwUIM0N9IUjpGvtkqtm7Vbs6/bDxI4Owgsa7vXpEXZ2qD0AIle7sD0Fjl
F19o2mXmEeQp9Fl4OrkZCURCQvPq9UCh6Nu0a1+SnbG+qXyyvqszy2tkV4xmcF4w
Gib0SVT8RR08NeJXkHtBscnecgUA1BTH8J8RnUeQXZhUn51bVJk4JaDnEXp8VEP2
gNce+oUY2XQtLDVzHysGhexDrWk8ycl/zvwyxKv+kj5QhjXugHkOMnW53mdMe3N/
gwsV+kJUm6NdtLtTAOkky/GfkIGTWNQPD2/42T+0cA9lTVxihh+wz9tgA1ZbtVOK
P2DNA10rsCuzGPFn8d6Khymt0o66dgfEloy9Y14leoqUCMPU3ibLP6bYuow2AJUz
KcvTgmfjP1/ghNXI7E2vgNi8wta5Ag0EX5HctgEQALx4btbP47LwrIqB4loog2sT
pac7fdbA+YVeqP/9KoLw1ZB+5DeqNKmtUHSau9mRVh8a8g7slpGhH6hxlEHr7ek/
mA/o91jB4RGo5mfyuWcJQKRyHS4pWciEM/gK+o6lEceTdUwvKI6OrJ4koPd3HZth
mw+xPyAdGKY3oBmrXeZ6XkuDfME8doRmuwlw/tbmje63/2j97ebiFfQcyWLH32d8
T+yEpAj+55Qxp6aJZaDOeAuzBtyAopxGRjGsxBUF/VSUwxYb0bmwWgPIhPC77oEk
AEMPsIsI9LJ8fQY/sOzwhyNNt+b7rgto6AFskz7urezzCuuIwMeupmC78QWGw9jM
zHFf3R6O1KQ0v8PBYYb6BHkjzho6hTcOZO9Zh+XO4k6uEwlu+Zc0AmyHmQeQ3I8Z
tAb//LJk9X62yNPE/8wjtEUzXqyzlLpGjRFr6kQv+6nqs8JxyCnS34Q+au2IqOnn
iFkHj/w79mtmzR4G43wo3x1nGjyz+vTpsurmJ+qFMO0bLcE/HV8aGxs0YeQsByOc
SU8TK6v+Wkn58LT4cvjIO5G/2UM7kucXl56hqvguvnFTLNqewWtqgS7IRuykcYgK
HrBYb/iVH+Fb+9Th9VX7bl0ZeoH7O8RbvxKGkd90+DPsurBeIQ7S4zM9w7WnAsAC
Sgs8owYZpHpyrK8QFD4zABEBAAGJAjwEGAEIACYWIQQMXoulZY4yDRsDEXnIftU6
YoLEEQUCX5HctgIbDAUJEswDAAAKCRDIftU6YoLEEURID/4oQhZZPindZJHiwQqm
0a8H1ssgZAz6E8PejoN0gbsblbOrtkGDLU8gvzksvd/9luSLRgPw++m6ut87PeMv
MKc4UIyRb5oSgh5WE0bW9191Gkfge9DRrIdtUDG8N+oTlIWYHTXC5zlwmfMobtQE
kFUdPbedhytYx1wgbh8KP8sLXGPXut5VqDy/EgNzqERnI5kLeiDvMsLz0xjdHpGW
ASfJMNX120GU8Mwqa6gWvP52BB20pU9bC1VQX1qiqD6V1GpxQJ2jACKke6boiqbL
Bdb0UgmW4XYIp4ZjLC842e0qSyfd8rt3PzYrbK/NPuXAV7f+wAhPSC18v+1Ap5Kh
KKHRLvyUVGxwaBVedOuuC/OqJwSSLa0cQKytFK+3OJAdTYoHtsh++ScgEL/wOCXs
gM5xmlI6Pk/6Ev0Hz/kDY5F0w4/VvSEaS/7TSkmf5JvxdueVObf5ry5O+L4J7t7y
JwdtPhXgHR0PHidnh/02SVn8XIzHdB9OZ2i6Wr12loFZGltWdmJVkQC/cj/HBr5I
ZizQril+7cXDI/8Hyk04d19rmjSIU49FderpNYYOv38dqaAsosYge6JzYdIzJrJH
/DIKnSAU/a14sFUrNm+TYJmZto35hSltUxLEzLIWeR9TjpOh6VS1UzdGQh32NP+h
oq8y1SJMCrfC9Ub5q2/ijiJWUw==
=+Ne5
-----END PGP PUBLIC KEY BLOCK-----
```

--------------------------------------------------------------------------------

---[FILE: bookworm.list]---
Location: zulip-main/scripts/setup/apt-repos/zulip/bookworm.list

```text
deb [signed-by=/etc/apt/keyrings/pgdg.asc] http://apt.postgresql.org/pub/repos/apt/ bookworm-pgdg main
deb-src [signed-by=/etc/apt/keyrings/pgdg.asc] http://apt.postgresql.org/pub/repos/apt/ bookworm-pgdg main

deb http://deb.debian.org/debian bookworm-backports main
deb-src http://deb.debian.org/debian bookworm-backports main
```

--------------------------------------------------------------------------------

---[FILE: custom.sh]---
Location: zulip-main/scripts/setup/apt-repos/zulip/custom.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

if [[ ! -e /usr/share/doc/groonga-apt-source/copyright ]]; then
    pgroonga_apt_sign_key=$(readlink -f "$LIST_PATH/pgroonga-packages.groonga.org.asc")

    remove_pgroonga_apt_tmp_dir() {
        rm -rf "$pgroonga_apt_tmp_dir"
    }
    pgroonga_apt_tmp_dir=$(mktemp --directory)
    trap remove_pgroonga_apt_tmp_dir EXIT

    {
        cd "$pgroonga_apt_tmp_dir" || exit 1
        tmp_gpg_home=.gnupg
        gpg --homedir="$tmp_gpg_home" --import "$pgroonga_apt_sign_key"
        # Find fingerprint of the first key.
        pgroonga_apt_sign_key_fingerprint=$(
            gpg --homedir="$tmp_gpg_home" --with-colons --list-keys \
                | grep '^fpr:' \
                | cut --delimiter=: --fields=10 \
                | head --lines=1
        )
        os_info="$(. /etc/os-release && printf '%s\n' "$ID" "$VERSION_CODENAME")"
        {
            read -r distribution
            read -r release
        } <<<"$os_info"

        groonga_apt_source_deb="groonga-apt-source-latest-$release.deb"
        groonga_apt_source_deb_sign="$groonga_apt_source_deb.asc.$pgroonga_apt_sign_key_fingerprint"
        curl -fLO --retry 3 "https://packages.groonga.org/$distribution/$groonga_apt_source_deb"
        curl -fLO --retry 3 "https://packages.groonga.org/$distribution/$groonga_apt_source_deb_sign"
        gpg \
            --homedir="$tmp_gpg_home" \
            --verify \
            "$groonga_apt_source_deb_sign" \
            "$groonga_apt_source_deb"
        # To suppress the following warning by "apt-get install":
        #   N: Download is performed unsandboxed as root as file
        #   '.../groonga-apt-source-latest-$release.deb' couldn't be
        #   accessed by user '_apt'. - pkgAcquire::Run (13: Permission denied)
        chown _apt .

        apt-get -y install "./$groonga_apt_source_deb"
    }
    touch "$STAMP_FILE"
fi
```

--------------------------------------------------------------------------------

---[FILE: jammy.list]---
Location: zulip-main/scripts/setup/apt-repos/zulip/jammy.list

```text
deb [signed-by=/etc/apt/keyrings/pgdg.asc] http://apt.postgresql.org/pub/repos/apt/ jammy-pgdg main
deb-src [signed-by=/etc/apt/keyrings/pgdg.asc] http://apt.postgresql.org/pub/repos/apt/ jammy-pgdg main

deb [signed-by=/etc/apt/keyrings/pgroonga-ppa.asc] http://ppa.launchpad.net/groonga/ppa/ubuntu jammy main
deb-src [signed-by=/etc/apt/keyrings/pgroonga-ppa.asc] http://ppa.launchpad.net/groonga/ppa/ubuntu jammy main

deb [signed-by=/etc/apt/keyrings/strukturag.asc] https://ppa.launchpadcontent.net/strukturag/libheif/ubuntu/ jammy main
deb-src [signed-by=/etc/apt/keyrings/strukturag.asc] https://ppa.launchpadcontent.net/strukturag/libheif/ubuntu/ jammy main

deb [signed-by=/etc/apt/keyrings/strukturag.asc] https://ppa.launchpadcontent.net/strukturag/libde265/ubuntu/ jammy main
deb-src [signed-by=/etc/apt/keyrings/strukturag.asc] https://ppa.launchpadcontent.net/strukturag/libde265/ubuntu/ jammy main
```

--------------------------------------------------------------------------------

---[FILE: noble.list]---
Location: zulip-main/scripts/setup/apt-repos/zulip/noble.list

```text
deb [signed-by=/etc/apt/keyrings/pgdg.asc] http://apt.postgresql.org/pub/repos/apt/ noble-pgdg main
deb-src [signed-by=/etc/apt/keyrings/pgdg.asc] http://apt.postgresql.org/pub/repos/apt/ noble-pgdg main

deb [signed-by=/etc/apt/keyrings/pgroonga-ppa.asc] http://ppa.launchpad.net/groonga/ppa/ubuntu noble main
deb-src [signed-by=/etc/apt/keyrings/pgroonga-ppa.asc] http://ppa.launchpad.net/groonga/ppa/ubuntu noble main

deb [signed-by=/etc/apt/keyrings/strukturag.asc] https://ppa.launchpadcontent.net/strukturag/libheif/ubuntu/ noble main
deb-src [signed-by=/etc/apt/keyrings/strukturag.asc] https://ppa.launchpadcontent.net/strukturag/libheif/ubuntu/ noble main

# libde265 in 24.04 is up-to-date, so the PPA doesn't provide 24.04 packages
#deb [signed-by=/etc/apt/keyrings/strukturag.asc] https://ppa.launchpadcontent.net/strukturag/libde265/ubuntu/ noble main
#deb-src [signed-by=/etc/apt/keyrings/strukturag.asc] https://ppa.launchpadcontent.net/strukturag/libde265/ubuntu/ noble main
```

--------------------------------------------------------------------------------

---[FILE: pgdg.asc]---
Location: zulip-main/scripts/setup/apt-repos/zulip/pgdg.asc

```text
-----BEGIN PGP PUBLIC KEY BLOCK-----

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
=DA1T
-----END PGP PUBLIC KEY BLOCK-----
```

--------------------------------------------------------------------------------

---[FILE: pgroonga-packages.groonga.org.asc]---
Location: zulip-main/scripts/setup/apt-repos/zulip/pgroonga-packages.groonga.org.asc

```text
-----BEGIN PGP PUBLIC KEY BLOCK-----

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
6TYbUXXz7NBwM+kX8Uq9KpPXkHnP1D4TgEw7o5A=
=7PCC
-----END PGP PUBLIC KEY BLOCK-----
```

--------------------------------------------------------------------------------

---[FILE: pgroonga-ppa.asc]---
Location: zulip-main/scripts/setup/apt-repos/zulip/pgroonga-ppa.asc

```text
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: SKS 1.1.5
Comment: Hostname: keyserver.ubuntu.com

mQINBFMyaEABEADEeUoP5AmhJZLHujySJaLKd1EXpIxkope3l4f/3tkbPTvV+jkyYvOSX/ii
NAHyVGPrg4UjJI+kDLru1glFoabBs+J4xk2Lql9DcHW0x7YPgBXKCuj2sg84Teb0KTnAkAFI
gd8w2kzs6l9itQbtCWei0wH+pGpp9YJqEqJhqc3U51LqUoMmYjTd2WTaN+BNVZOE3ws4Pa4+
JyikyVOkuj/8q+jRF8LHWmeb76SuycvZMyGjJBnIs65wmmSN6VpeHtQA3NzIAV2FKuirEEuW
5j7fD9L8WNTXy++K6NTvcd2InXgEWMG3rSGvfE2CvZSxKc/b9/xVdaG0LDtTTWPTosNdluUA
K4M91Rz7UEvC06SWIdxqL8LdLOy/6OYaJxgh1exrEadRPWAKr+Ak7LDMiYPHq80npQzMh8Hn
oUbQTaQ7KDFD17BZ7HauXn8rRmG/vpdQvKzswRoc3+mroh5hA6otjKdmOWAaD5AmNNxcvR3O
iNjDTnX804pjrjHzmTAAxrPKwPxbPzFUeNB4Dt4BzUdesdbbZYJw5ojcvt9qCfLU0DOZXWk4
t1nHvIQvGoG8cE63x1buVHcwFXwxocMUdn4iFam9srBlDx1G8TMlaKITNHvoc//evBU0arz0
12UMDb8TXAT5zOW1W6szFSt1ZFn0By9Ab+I69UCIgB2iknMUtwARAQABtBlMYXVuY2hwYWQg
UFBBIGZvciBHcm9vbmdhiQI4BBMBAgAiBQJTMmhAAhsDBgsJCAcDAgYVCAIJCgsEFgIDAQIe
AQIXgAAKCRAzWefOy2ShV5p5EACWQ5QBQV86SAhjJHfRe1MSYVZtrA3v+wwS52V/C9sV9xlc
Sn2IGIpUQM2816fVMTM23pvj9lzuP3PpcHl0vc5/gqSliRPAzXawgs8Gl+wB9FcwnKPPQfyR
CWflFg5mc37+5wM/fTagL7V5S+mBcDrAyMOr7AFgt03nTCwoSaNHatF+pBZRqpyWByM6sqD+
IF2ChI4O3QTI5H6HkbQStEHLGuz8G6UX1MBRZ9LrRl0hUqdc2F/dcogrtV5NWkimXvMcTBYB
9dTeuvj7eSma6JemqJAXfCARq54KjYwcZHapzczJe3Kgj1tSqD8O1Z8fsT16P2b0tUnDgNjX
PB9UQGsP5NLK+vGnVBg5xJA5GqaN69lsUsvPaFFngmKmykQQNlDk7Q3yrAvMJWwRPQ1c8eMq
kkrkKBal8Rq/EJaoaoBG6SFx2cSAD4GMxPEL7G3qJeNJPSLVSOP9j9nGIZ4SETeGIKCNVgVF
16iXIxwflvgJP+/1qX3/Qin2YDYCeGvFmJiy5s0VFM1IdK+znrUu0apoCSYVia1D9NJGEdKf
l7m/Odtxycq9VP1DKD/k4spWqsdpiBkJMch7XWfa7KF12bwV/tHP4KqJ02/xqhSqk+Ru4A9R
LjQFWXs4o/Qwf5qF7FlGhpFridr0xdxtLVmK7bV4Hogldx1bKbkOpCL29BY8GA==
=NjhU
-----END PGP PUBLIC KEY BLOCK-----
```

--------------------------------------------------------------------------------

---[FILE: strukturag.asc]---
Location: zulip-main/scripts/setup/apt-repos/zulip/strukturag.asc

```text
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQINBGY0lEwBEAD9qq6oOeRJvCi0fHNqJELvS8ykqfuXxWqn1B9DLt0VuTxgmaxG
QNaG0B2pfrhoVDs+9wwfOuW0rtUtjWpccJjZaooTIEFSR4AKZAh3O4gUtvI7y95r
q7+wWFct4RjbFyZOpmeinhIgnItTbkVjhjJvvQ66H4gUfNeJOoAE7CYgnMhZ1Sn8
E6zxWJVLo0c5hXkkc4x4T1Aq02diO0Zg6T6HesxsCLeb5Sbjrca7ukUBGV3WFKAF
QC22r8oCC4LiN5TX1WNQJjDSw0M2AY31AF+ebQvZGa1kcClWjqBCD7717+zbevPe
/bx88Yr6eh+xuJ3ZJQ209phdeNq9RRkIDnap7TIVn21VoCQolH+adP9boxgG1iIz
0gBx1KXBjRgV9owoYan4Mz9+c+5MMgJ975D+8GoRcNr1oycjOO/VVXw7ST9UiXqo
TuOU2c1P8KmM3IUF41Igy5rd7MLy9uizKC/WY/lfLOH8pzT3LoWVmhMDJHooF9fq
UC80GRIIaBM3f7sQH873zdqzaRPqtgJDxOAzLoZqUaFwLXuMfvYxhwMLWhe3b6Wp
shCe3xifqZIHf9iZkqZ9b2TsstXervs0TlW9Xy8FT8RMuEzsX8DLNsUert+PzWpq
C8Qse1AElMgSSxEsucWMbW5cnKj6ViEf10gy5VwlTgEgvt9KpZ2Icm43mwARAQAB
tB1MYXVuY2hwYWQgUFBBIGZvciBzdHJ1a3R1ciBBR4kCTgQTAQoAOBYhBEfpK5wT
yXuwgfX/wXF9tBYRYATJBQJmNJRMAhsDBQsJCAcCBhUKCQgLAgQWAgMBAh4BAheA
AAoJEHF9tBYRYATJ/oMQAPVJWmzF+UKwkCA/kFeihXdA6OWl1BttFQpwTAAmxr9u
SCg/w1ltIYqTfZcAjMUhY52oDix/NxzZZb/B4dxOkUM4gYmkbzq4wlT0QyrRgjNZ
wflwdNjXGI9Ew9ta/3xvNE98LQWyV64t+Q8PihDD7VwOE/c2XVPvXQk8GWmsHJ48
nGLaAPzn68kolv3XpkDB+ul07OLC7FXlADxWFOsobwula/zytFK2oyuQ1NiXoJ5I
3+IA5sAp7O1mDOZ3m8RROfw56IbwHlNXAP8/REbqWEsXVNkyMf56snpsIr8FPlqY
C74QbR/PHcb7vEdeWZgHmuIGNF37QPMx4XUGWjh/9NNi7AHGMa2cRsSF1xm1R99Q
Zr1vmRPJM2z54gPq/JwY7WlcL6yEFMBL+WtNuiua5xxZ3rkMs956IuFS55zjrNeO
MPmK77tdmFEui0GiTIyAJpoZIwp0AgYBdmP4/2Y6j6LN1sV+VkOzQz2CqDT87yO1
BoN65jFuw61H3Y/+OBQMtoxamxs1m/Jjv0sEYf21nKgfukOTLecRWH1tXu0moTAf
eEf0MOXzhH1teyfv/21haprwxJn0cG515oHB/JutFNKrXx3qtNH5QjRXIbz9EWAs
u1mi4ERxSWAELxiJQWztCOhB5sI8Auq+Kk4uzbCutK6BQrUQORz2FGEJwEXy1f7g
=76Dg
-----END PGP PUBLIC KEY BLOCK-----
```

--------------------------------------------------------------------------------

---[FILE: trixie.list]---
Location: zulip-main/scripts/setup/apt-repos/zulip/trixie.list

```text
deb [signed-by=/etc/apt/keyrings/pgdg.asc] http://apt.postgresql.org/pub/repos/apt/ trixie-pgdg main
deb-src [signed-by=/etc/apt/keyrings/pgdg.asc] http://apt.postgresql.org/pub/repos/apt/ trixie-pgdg main
```

--------------------------------------------------------------------------------

---[FILE: zulip.pref]---
Location: zulip-main/scripts/setup/apt-repos/zulip/zulip.pref

```text
# libarrow1600 is missing on Debian 12
Package: libgroonga0
Pin: version 14.0.3-1
Pin-Priority: 499


# On bookworm, pull libheif1 from backports
Package: libheif1
Pin: release n=bookworm-backports
Pin-Priority: 500
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: zulip-main/starlight_help/.gitignore

```text
# build output
dist/
dist_no_relative_links/
# generated types
.astro/

# dependencies
node_modules/

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

*.md


# environment variables
.env
.env.production

# macOS-specific files
.DS_Store
```

--------------------------------------------------------------------------------

````
