---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 505
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 505 of 1290)

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

---[FILE: zabbix.svg]---
Location: zulip-main/static/images/integrations/logos/zabbix.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="113.236" height="112.486"><image overflow="visible" width="151" height="150" xlink:href="data:image/png;base64,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" transform="scale(.7499)"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: zapier.svg]---
Location: zulip-main/static/images/integrations/logos/zapier.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><defs><clipPath id="a"><path d="M.06 399.96H400V0H.06v399.96z"/></clipPath><clipPath id="b"><path d="M0 0h400v400H0V0z"/></clipPath></defs><g clip-path="url(#a)" transform="matrix(1.25 0 0 -1.25 0 500)"><g clip-path="url(#b)"><path d="M250 199.913c-.009-14.862-2.727-29.089-7.681-42.224-13.131-4.953-27.365-7.678-42.233-7.689h-.172c-14.861.011-29.091 2.728-42.222 7.68-4.954 13.133-7.682 27.367-7.692 42.233v.173c.01 14.862 2.732 29.09 7.678 42.223 13.138 4.955 27.369 7.682 42.236 7.691h.172c14.868-.009 29.102-2.736 42.233-7.691 4.954-13.133 7.672-27.361 7.681-42.223v-.173zm147.22 33.42H280.474l82.55 82.551a200.92 200.92 0 0 1-21.612 25.547l-.004.004a201.057 201.057 0 0 1-25.524 21.589l-82.551-82.55v116.745A201.232 201.232 0 0 1 200.106 400h-.213a201.229 201.229 0 0 1-33.226-2.781V280.473l-82.551 82.551a200.942 200.942 0 0 1-25.534-21.6l-.029-.028a201.01 201.01 0 0 1-21.576-25.512l82.551-82.551H2.78S.004 211.406 0 200.073v-.143a201.324 201.324 0 0 1 2.781-33.263h116.745l-82.549-82.55a201.137 201.137 0 0 1 47.14-47.141l82.55 82.549V2.781A201.347 201.347 0 0 1 199.858 0h.286a201.44 201.44 0 0 1 33.189 2.78v116.747l82.552-82.55a201.038 201.038 0 0 1 25.527 21.592l.02.019a201.182 201.182 0 0 1 21.591 25.527l-82.55 82.552h116.746A201.347 201.347 0 0 1 400 199.858v.286a201.44 201.44 0 0 1-2.78 33.189" fill="#ff4a00"/></g></g></svg>
```

--------------------------------------------------------------------------------

---[FILE: zendesk.svg]---
Location: zulip-main/static/images/integrations/logos/zendesk.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" width="2500" height="1895" viewBox="0 0 1393 1055.77"><path fill="#03363d" d="M643.51 278.74v777H0zm0-278.74c0 177.57-143.84 321.41-321.41 321.41S0 177.57 0 0zm106 1055.77c0-177.57 143.84-321.41 321.41-321.41s321.41 143.84 321.41 321.41zm0-278.74V0H1393z"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: zoom.svg]---
Location: zulip-main/static/images/integrations/logos/zoom.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="283.835" width="283.835"><image xlink:href="data:image/png;base64,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 GIZhGIZhpPD/FDeqaOClhgEAAAAASUVORK5CYII=" preserveAspectRatio="none" height="283.835" width="283.835"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: software-engineer.svg]---
Location: zulip-main/static/images/landing-page/companies/software-engineer.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 823 823" width="823" height="823" viewBox="0 0 823 823"><path fill="#cce9ff" d="M563.1,81.9C476,24.5,353.6,36.1,276.6,121.3c-42.1,46.6-59.2,110.7-102.9,156.3
		C124.5,329,65.7,378.9,43.4,448.9c-23.7,74.4-2.9,159.7,50.1,216.6c64.5,69.2,159.3,48.4,248.9,47.3
		c366.9-4.6,639.6-249.5,292.6-551.4C606,136,591.9,100.8,563.1,81.9z" opacity=".63"/><path fill="#0b4870" d="M727.5,121.6h-619C96.1,121.6,86,131.6,86,144v426.3h664V144C750,131.6,739.9,121.6,727.5,121.6z"/><path fill="#0e538c" d="M726.7,131H109.3c-7.7,0-13.9,6.2-13.9,13.9V564h645.2V144.9C740.6,137.2,734.4,131,726.7,131z"/><rect width="598.8" height="387.1" x="118.6" y="162" fill="#0b4870"/><path fill="#f6f6f6" d="M421.4,148.4c0,1.9-1.5,3.4-3.4,3.4c-1.9,0-3.4-1.5-3.4-3.4c0-1.9,1.5-3.4,3.4-3.4
		C419.9,145.1,421.4,146.6,421.4,148.4z"/><rect width="60" height="10.6" x="193.7" y="183.4" fill="#ffbe55"/><rect width="24.7" height="10.6" x="139.5" y="183.4" fill="#cce9ff"/><rect width="24.7" height="10.6" x="139.5" y="202.8" fill="#cce9ff"/><rect width="24.7" height="10.6" x="139.5" y="225.8" fill="#cce9ff"/><rect width="24.7" height="10.6" x="139.5" y="248.7" fill="#cce9ff"/><rect width="24.7" height="10.6" x="139.5" y="271.7" fill="#cce9ff"/><rect width="24.7" height="10.6" x="139.5" y="294.6" fill="#cce9ff"/><rect width="201.3" height="10.6" x="266.1" y="183.4" fill="#cce9ff"/><rect width="60" height="10.6" x="214.9" y="202.8" fill="#ffbe55"/><rect width="201.3" height="10.6" x="287.3" y="202.8" fill="#cce9ff"/><rect width="60" height="10.6" x="250.3" y="225.8" fill="#ffbe55"/><rect width="201.3" height="10.6" x="322.7" y="225.8" fill="#cce9ff"/><rect width="60" height="10.6" x="285.6" y="248.7" fill="#ffbe55"/><rect width="201.3" height="10.6" x="358" y="248.7" fill="#cce9ff"/><rect width="60" height="10.6" x="250.3" y="271.7" fill="#ffbe55"/><rect width="307.3" height="10.6" x="322.7" y="271.7" fill="#cce9ff"/><rect width="60" height="10.6" x="214.9" y="294.6" fill="#ffbe55"/><rect width="130.7" height="10.6" x="287.3" y="294.6" fill="#cce9ff"/><rect width="60" height="10.6" x="193.7" y="324.7" fill="#ffbe55" opacity=".4"/><rect width="24.7" height="10.6" x="139.5" y="324.7" fill="#cce9ff" opacity=".4"/><rect width="24.7" height="10.6" x="139.5" y="344.1" fill="#cce9ff" opacity=".4"/><rect width="24.7" height="10.6" x="139.5" y="367.1" fill="#cce9ff" opacity=".4"/><rect width="24.7" height="10.6" x="139.5" y="390" fill="#cce9ff" opacity=".4"/><rect width="24.7" height="10.6" x="139.5" y="413" fill="#cce9ff" opacity=".4"/><rect width="24.7" height="10.6" x="139.5" y="435.9" fill="#cce9ff" opacity=".4"/><rect width="201.3" height="10.6" x="266.1" y="324.7" fill="#cce9ff" opacity=".4"/><rect width="60" height="10.6" x="214.9" y="344.1" fill="#ffbe55" opacity=".4"/><rect width="201.3" height="10.6" x="287.3" y="344.1" fill="#cce9ff" opacity=".4"/><rect width="60" height="10.6" x="250.3" y="367.1" fill="#ffbe55" opacity=".4"/><rect width="201.3" height="10.6" x="322.7" y="367.1" fill="#cce9ff" opacity=".4"/><rect width="60" height="10.6" x="193.7" y="465.9" fill="#ffbe55" opacity=".4"/><rect width="24.7" height="10.6" x="139.5" y="465.9" fill="#cce9ff" opacity=".4"/><rect width="24.7" height="10.6" x="139.5" y="485.4" fill="#cce9ff" opacity=".4"/><rect width="24.7" height="10.6" x="139.5" y="508.3" fill="#cce9ff" opacity=".4"/><rect width="201.3" height="10.6" x="266.1" y="465.9" fill="#cce9ff" opacity=".4"/><rect width="60" height="10.6" x="214.9" y="485.4" fill="#ffbe55" opacity=".4"/><rect width="201.3" height="10.6" x="287.3" y="485.4" fill="#cce9ff" opacity=".4"/><rect width="60" height="10.6" x="250.3" y="508.3" fill="#ffbe55" opacity=".4"/><rect width="201.3" height="10.6" x="322.7" y="508.3" fill="#cce9ff" opacity=".4"/><rect width="60" height="10.6" x="285.6" y="390" fill="#ffbe55" opacity=".4"/><rect width="307.3" height="10.6" x="358" y="390" fill="#cce9ff" opacity=".4"/><rect width="60" height="10.6" x="250.3" y="413" fill="#ffbe55" opacity=".4"/><rect width="201.3" height="10.6" x="322.7" y="413" fill="#cce9ff" opacity=".4"/><rect width="60" height="10.6" x="214.9" y="435.9" fill="#ffbe55" opacity=".4"/><rect width="201.3" height="10.6" x="287.3" y="435.9" fill="#cce9ff" opacity=".4"/><path fill="#d3d3d3" d="M794.1,562.7H41.9c-4.3,0-7.9,3.5-7.9,7.9v10.2c0,4.3,3.5,7.9,7.9,7.9h752.3c4.3,0,7.9-3.5,7.9-7.9v-10.2
		C802,566.2,798.5,562.7,794.1,562.7z"/><path fill="#f7f7f7" d="M482.5,574H353.5c-1.7,0-3.1,1.4-3.1,3.1c0,1.7,1.4,3.1,3.1,3.1h129.1c1.7,0,3.1-1.4,3.1-3.1
		C485.6,575.4,484.2,574,482.5,574z"/><path fill="#0b4870" d="M588.6 675l-.1 16.1c0 0 2 10.3 3.7 21.3 1.6 11 2.9 22.7 1.2 25.4-3.3 5.4-9.8 0-10.9-5.4-1.1-5.4-2.7-39.1-2.7-39.1l-1.1-21.7L588.6 675zM605 672.8l-2.5 14.5c0 0-4.9 39.6-2.2 45.6 2.7 6 11.4 3.3 10.9-4.9-.5-8.1 1.6-36.9 1.6-36.9l4.9-17.4L605 672.8z"/><path fill="#0b4870" d="M598.3,496.3l-1.2,17.8l46,22.2c8.3,4.5,12.3,14.2,9.6,23.2l-31.8,118.3l-15.8-5L619,564
		c1-6.7-3.6-12.9-10.3-14l-16.4-2.6l-17.4-17.8l20.2,18.1c4.9,4.4,7.3,10.9,6.4,17.4L588.6,675l-14.3,3.6l-6.4-108.1
		c-0.5-6.9-5.1-12.7-11.6-14.8l-28.3-9c-4.5-2.7-7.3-7.6-7.5-12.9l1.2-38.1L598.3,496.3z"/><path fill="#ffbe55" d="M518.7,536.2l7.6-147.8c0,0,31.4-1.9,40.8-1.9c5.1,0,13.8,2.4,20.7,4.6c6.5,2.1,11.8,1.9,15,7.9l51.5,98.8
		l-31.7,3L612,488.8l5.4-8.1l-19.3-45.4l3.8,82.5L518.7,536.2z"/><path fill="#0f0f0f" d="M598.8,417.3l34.2,61.7l-10.6,12.5c0,0-4.3,0.9-8.4-0.5l-1.9-2.2l5.4-8.1l-19.3-45.4L598.8,417.3z" opacity=".08"/><path fill="#fff" d="M568.4,431.2c-10.4,0-29.4-27.1-29.4-37.5c0-2.1,0.4-4.1,1-6c9.7-0.5,21.8-1.1,27.1-1.1
		c2.3,0,5.3,0.5,8.6,1.2c0.6,1.9,1,3.8,1,5.9C576.6,404.1,578.8,431.2,568.4,431.2z"/><polygon fill="#0f0f0f" points="522.5 414 518.7 537.1 569.5 524.9" opacity=".08"/><path fill="#fcd2b1" d="M570.2,371.4c-0.9,1.8-7.1,26-7.1,26s-2.2,4-7.5,3.5c-5.3-0.4-7.5-7.9-7.5-7.9l9.3-30.4L570.2,371.4z"/><path fill="#ffbcc6" d="M537.6,356.5c0,16.7,17.7,35.2,34.4,35.2c16.7,0,26-18.5,26-35.2c0-16.7-13.5-30.2-30.2-30.2
		C551.1,326.2,537.6,339.8,537.6,356.5z"/><circle cx="568.5" cy="358.9" r="34" fill="#ffe3ca" transform="rotate(-9.259 568.625 358.984)"/><path fill="#ffe3ca" d="M562.1,522c1.3-0.4,12.5-5.9,20.4-5.9c7.9,0,17.6,8.4,17.6,8.4s1.3,4.4-4,3.5c-5.3-0.9,0.7,3.3,0.7,3.3
		s-0.3,0.2-6.5,1.1c-6.2,0.9-30.2-0.4-30.2-0.4L562.1,522z"/><path fill="#ffbe55" d="M526.3 388.5l-4.3 97.2 40 36.2-1.9 10.2L503.8 502c-5.4-2.9-8.5-8.9-7.7-15l10.3-74.4c.8-9.3 6.5-17.5 14.8-21.6L526.3 388.5zM558 540.4h101.8v-7.5H558c-2.1 0-3.7 1.7-3.7 3.7l0 0C554.2 538.7 555.9 540.4 558 540.4z"/><path fill="#ffbe55" d="M585.9,540.4h98.2c4.3,0,8.1-2.9,9.3-7.1l17.3-65.3c1.6-6.1-3-12-9.3-12h-85.7c-4.3,0-8.1,2.9-9.3,7.1
		L585.9,540.4z"/><path fill="#fff" d="M585.9,540.4h98.2c4.3,0,8.1-2.9,9.3-7.1l17.3-65.3c1.6-6.1-3-12-9.3-12h-85.7c-4.3,0-8.1,2.9-9.3,7.1
		L585.9,540.4z" opacity=".22"/><path fill="#fff" d="M643.7,504c-1.1,4.3,1.6,7.7,6,7.7c4.4,0,8.8-3.5,9.9-7.7c1.1-4.3-1.6-7.7-6-7.7
		C649.2,496.2,644.8,499.7,643.7,504z"/><path fill="#2a94f4" d="M568.5,324.9c17.5,0,31.8,13.2,33.8,30.1c-5.9,4.4-13.6,6.3-20.9,5.1c-8.6-1.5-16.3-7.4-19.9-15.3
		c0.3,3.8,0.5,7.6-0.1,11.3c-0.6,3.7-2.2,7.4-5.2,9.8c-0.2-2.6-0.5-5.4-1.8-7.7c-1.4-2.3-4.3-3.9-6.7-2.9c-1.8,0.7-2.9,2.5-3.2,4.4
		c-0.3,1.9,0.2,3.8,0.9,5.6c1.1,2.8,2.7,5.4,4.7,7.5c-4,0.6-8.3,1.1-12.3,0.7c-2.1-4.5-3.4-9.4-3.4-14.7
		C534.4,340.1,549.7,324.9,568.5,324.9z"/><path fill="#ffe3ca" d="M539.2,364.5c0,5.7,4.6,10.3,10.3,10.3c5.7,0,10.3-4.6,10.3-10.3s-4.6-10.3-10.3-10.3
		C543.9,354.2,539.2,358.8,539.2,364.5z"/><polygon fill="#ffe3ca" points="605 672.8 603.2 683.7 614 687.1 617 676.4"/><polygon fill="#ffe3ca" points="588.5 687.1 579.5 688.8 579 677.4 588.6 675"/><circle cx="549.5" cy="325.4" r="15.2" fill="#2a94f4"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: flexible-administration.svg]---
Location: zulip-main/static/images/landing-page/education/flexible-administration.svg

```text
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 23.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Слой_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="1176.7" height="1080" viewBox="0 0 1176.7 1080" style="enable-background:new 0 0 1176.7 1080;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#E9F4FE;}
	.st1{fill:#8FBBEF;}
	.st2{fill:#FFFFFF;}
	.st3{fill:#5584DB;}
	.st4{fill:#FFD69F;}
	.st5{fill:#212B46;}
	.st6{fill:#454E6B;}
	.st7{fill:#3CAF99;}
	.st8{fill:#247B77;}
	.st9{fill:#329587;}
	.st10{fill:#FCAFA7;}
	.st11{clip-path:url(#SVGID_2_);fill:#FCAFA7;}
	.st12{clip-path:url(#SVGID_2_);fill:#F78E81;}
	.st13{fill:#F78E81;}
	.st14{fill:#39215B;}
	.st15{fill:#3B215B;}
	.st16{fill:#A7C6E3;}
	.st17{fill:#FBE77D;}
	.st18{fill:#73CF94;}
</style>
<g>
	<circle class="st0" cx="618.9" cy="506.5" r="461.5"/>
	<path class="st1" d="M806.8,581.1H136.5c-9.7,0-17.6-7.9-17.6-17.6V181.9c0-9.7,7.9-17.6,17.6-17.6h670.2c9.7,0,17.6,7.9,17.6,17.6
		v381.6C824.4,573.2,816.5,581.1,806.8,581.1z"/>
	<rect x="147.2" y="188.4" class="st2" width="658.2" height="369.5"/>
	<rect x="431.4" y="572.4" class="st1" width="77" height="138.7"/>
	<rect x="228" y="711" class="st3" width="549.6" height="24.6"/>
	<path class="st4" d="M769,765.7H16.8c-9.3,0-16.8-7.5-16.8-16.8l0,0c0-9.3,7.5-16.8,16.8-16.8H769c9.3,0,16.8,7.5,16.8,16.8l0,0
		C785.7,758.2,778.2,765.7,769,765.7z"/>
	<path class="st2" d="M0.7,754.5c2.2,6.6,8.5,11.4,15.9,11.4h752.2c7.4,0,13.7-4.8,15.9-11.4H0.7z"/>
	<g>
		<rect x="185.9" y="751.9" class="st4" width="42.1" height="2.6"/>
		<path class="st4" d="M185.9,765.9v198.8c0,11.6,9.4,21.1,21.1,21.1s21.1-9.4,21.1-21.1V765.9H185.9z"/>
	</g>
	<path class="st5" d="M884.7,898.6H754c-81,0-146.6,54.7-146.6,135.7v0l270.5,2.9c85.6,0,144.5-37.9,144.5-135.7l-72.2-2.9H884.7z"
		/>
	<path class="st6" d="M772.8,922.2H642.1c-81,0-146.6,54.7-146.6,135.7v0H957c85.6,0,144.5-37.9,144.5-135.7l0,0H772.8z"/>
	<path class="st4" d="M1102.2,1080h-734c-9.3,0-16.8-7.5-16.8-16.8l0,0c0-9.3,7.5-16.8,16.8-16.8h734c9.3,0,16.8,7.5,16.8,16.8l0,0
		C1119,1072.5,1111.5,1080,1102.2,1080z"/>
	<g>
		<g>
			<g>
				<g>
					<path class="st7" d="M624.7,109.7c5.8-3.5,11.9-6.1,18.3-7.9l3.8-18.1l30.6-0.5l4.4,17.9c6.4,1.6,12.6,4,18.5,7.3l15.4-10.1
						l22,21.2l-9.6,15.8c3.5,5.8,6.1,11.9,7.9,18.3l18.1,3.8l0.5,30.5l-17.9,4.4c-1.6,6.4-4,12.6-7.3,18.5l10.1,15.4l-21.2,22
						l-15.8-9.6c-5.8,3.5-11.9,6.1-18.3,7.9l-3.8,18.1l-30.5,0.5l-4.4-17.9c-6.4-1.6-12.6-4-18.5-7.3L611.6,250l-22-21.2l9.6-15.8
						c-3.5-5.8-6.1-11.9-7.9-18.3l-18.1-3.8l-0.5-30.5l17.9-4.4c1.6-6.4,4-12.6,7.3-18.5l-10.1-15.4l21.2-22L624.7,109.7
						L624.7,109.7z"/>
				</g>
			</g>
		</g>
		<g>
			<g>
				<g>
					<g>
						<g>
							<polygon class="st2" points="618.9,176.8 630.6,165 653.2,185.1 697.5,142.5 708.4,154.2 651.5,207.7 							"/>
						</g>
					</g>
				</g>
			</g>
		</g>
	</g>
	<path class="st8" d="M1124,603.4c-41.4-109.1-103.4-123.5-143.8-126.4l14.2,32.8c-28.7,9.3,2.2,41.8,11.5,70.5l54.3,167
		l-213.3,69.4l32,98.4l245.8-79.9c39.5-12.8,61.2-55.2,48.4-94.8C1152,674.9,1131.2,622.3,1124,603.4z"/>
	<path class="st9" d="M772.8,922.2l-2.2-283.9c0-92.3,73.6-167.2,164.3-167.2h0c90.7,0,164.3,74.8,164.3,167.2l2.2,283.9H772.8z"/>
	<path class="st10" d="M973.4,391.9l9.2,85.9c0,0-44.3,19.3-93.7,2.6l-6.7-63.8L973.4,391.9z"/>
	<g>
		<path class="st10" d="M498.7,702.5c-33.3-45.4-64.5-64.3-43.4-15.2S498.7,702.5,498.7,702.5z"/>
		<g>
			<defs>
				<path id="SVGID_1_" d="M395.2,677.5c-2.2,24.4-7.8,45.1,34.7,65.5c22.1,10.6,71.4,33.2,82,11.1c10.6-22.1,1.8-53.1-22.5-55.5
					c-46.2-4.4-51.2-32.9-71.3-39.7C405.9,654.8,397,658,395.2,677.5z"/>
			</defs>
			<clipPath id="SVGID_2_">
				<use xlink:href="#SVGID_1_"  style="overflow:visible;"/>
			</clipPath>
			<path class="st11" d="M395.2,677.5c-2.2,24.4-7.8,45.1,34.7,65.5c22.1,10.6,71.4,33.2,82,11.1c10.6-22.1,1.8-53.1-22.5-55.5
				c-46.2-4.4-51.2-32.9-71.3-39.7C405.9,654.8,397,658,395.2,677.5z"/>
			<path class="st12" d="M440.8,702.7l1.5-2.2c-32.1-21.9-41.2-40.5-41.3-40.7l-2.4,1.2C399,661.7,408.1,680.3,440.8,702.7z"/>
			<path class="st12" d="M427.7,711.8l1.2-2.4c-20.4-10.5-34-30-34.2-30.2l-2.2,1.5C393.2,681.5,406.8,701,427.7,711.8z"/>
			<path class="st12" d="M420.2,727.8c3.1,1.5,6.2,2.6,9.3,3.4l0.6-2.6c-17.8-4.2-36.4-24.2-36.6-24.4l-2,1.8
				C392.2,706.7,405.2,720.6,420.2,727.8z"/>
		</g>
	</g>
	<path class="st8" d="M900.8,606.5c0,0-48.2,273.1-104,288.9c-0.2,0.1-0.4,0.1-0.6,0.2c-13.2,4.9-24-6.1-23.8-20.8l-0.5-45.9
		L900.8,606.5z"/>
	<polygon class="st13" points="887.5,467.4 965.8,428.1 883.9,440.6 	"/>
	<path class="st10" d="M824.4,399.4c19.4,52.8,96.1,53.7,146.1,22.2s63.9-108.7,32.4-158.6s-107.6-58.6-157.6-27.1
		S804,344,824.4,399.4z"/>
	<path class="st13" d="M809.1,292c29.4,0.7,46.9,49.2,57.6,49.6c10.7,0.4,6.6,3.2,6.6,3.2l-12.8-60L845.1,262l-22.4,0
		c0,0-4,3.3-4.9,4.7C814.2,272.3,809.1,292,809.1,292z"/>
	<path class="st14" d="M885.2,406.6c9.9,32.9,51.9,44.1,83.5,18.9c0,0,18.6,22.6,64.5-3.1c45.9-25.7-0.2-47.6-0.2-47.6
		s32.2-3.2,35.3-24.9c3.1-21.7-19.9-31-19.9-31s18.4-7,15.1-40.8s-29.1-27.2-29.1-27.2s11.8-23.1-8.1-43.8
		c-19.9-20.7-49.2,3.7-49.2,3.7s-14.7-44.8-62.9-33.1c-38.6,9.4-37.6,29.6-37.6,29.6s-22.5-29.4-64.1-10.2
		c-52.2,24,29.6,54.1,29.6,54.1S872.4,364.1,885.2,406.6z"/>
	<circle class="st10" cx="878.2" cy="361.3" r="29.4"/>
	<path class="st14" d="M839,238.5c0,0-55.4-15.5-40.7,16.7c14.7,32.2,46.8-0.4,46.8-0.4L839,238.5z"/>
	<path class="st14" d="M817,269.5c0,0,30.2-2.5,36.1,21.1c7.1,28.4,14.8-40.7,14.8-40.7l-19.3-12.1l-17.7,8.3L817,269.5z"/>
	<path class="st13" d="M872.1,379.1c-5-1.8-7.9-6-7.6-11.2c0.2-4.4,2.5-8.1,5.5-8.8c1.4-0.3,4.1-0.3,6.6,3.9c3,5.2,7.7,5.1,10.8,3.4
		c3.8-2,6.2-6.9,3.5-12.4c-1.9-3.8-4.4-6-7.3-6.5c-6.1-1-12.5,5.4-12.6,5.5l-1.9-1.8c0.3-0.3,7.5-7.4,14.9-6.2
		c3.8,0.6,6.9,3.3,9.2,7.9c3.4,6.9,0.3,13.2-4.6,15.9c-4.3,2.3-10.6,1.9-14.3-4.4c-0.7-1.2-2.1-3.1-3.7-2.7
		c-1.8,0.4-3.4,3.3-3.5,6.4c-0.1,1.9,0.3,6.7,5.9,8.6L872.1,379.1z"/>
	<path class="st13" d="M502,703.1c0,0-32.2,22.6-27,57.8c0,0,10.1,1.9,17.4,8.9L502,703.1L502,703.1z"/>
	<path class="st7" d="M860.4,530.7L860.4,530.7c-32.1-9.8-66,8.3-75.7,40.4l-53.1,174.6l-188.2-54.5c-20-5.4-46.2,8.8-52.1,28.7
		l-4.8,16.4c-5.9,19.9,7.5,46.4,27.3,52.7l251.2,74.4c26.7,8.4,55.3-6.3,63.8-33l72-223.9C910.5,574.4,892.4,540.5,860.4,530.7z"/>
	<path class="st15" d="M772.8,922.2l326.3,31.6c0,0,3.8-12.9,2.3-31.6H772.8z"/>
	<path class="st7" d="M370.4,90.7c-4.8,0-9.6-1.2-14-3.6c-14.1-7.8-19.3-25.5-11.5-39.7c3.8-6.8,10-11.8,17.4-14
		c7.5-2.2,15.4-1.3,22.2,2.5c6.8,3.8,11.8,10,14,17.4c2.2,7.5,1.3,15.4-2.5,22.2C390.7,85.3,380.7,90.7,370.4,90.7z M370.5,37.4
		c-2.3,0-4.5,0.3-6.8,1c-6.2,1.8-11.3,5.9-14.4,11.5c-6.4,11.6-2.1,26.3,9.5,32.7c11.6,6.4,26.3,2.1,32.7-9.5
		c3.1-5.6,3.8-12.1,2-18.3c-1.8-6.2-5.9-11.3-11.5-14.4C378.5,38.4,374.5,37.4,370.5,37.4z"/>
	<circle class="st7" cx="454.9" cy="119.4" r="8.2"/>
	<circle class="st7" cx="468.8" cy="12.8" r="12.8"/>
	<path class="st9" d="M746.2,772.8c-3.4-19.7-15-26.1-15.1-26.1l1.6-3c0.5,0.3,13.2,7.3,16.9,28.6L746.2,772.8z"/>
	<path class="st2" d="M878.3,463.6c-4.2-0.2,3.9,16.3,3.9,16.3s37.2,16.8,76,12.6c39.8-4.3,29.8-34.6,29.8-34.6
		S955,467.4,878.3,463.6z"/>
	<path class="st1" d="M434.8,574.3H135.6V181.1h299.2V574.3z M139.5,570.4h291.4V185H139.5V570.4z"/>
	<rect x="185.2" y="217.1" class="st0" width="203.8" height="27.8"/>
	<rect x="467.1" y="233" class="st0" width="103.3" height="27.8"/>
	<rect x="467.1" y="301.2" class="st0" width="308.3" height="27.8"/>
	<path class="st16" d="M231.8,321.2h-31.7c-3.9,0-7.1-3.2-7.1-7.1v-31.7c0-3.9,3.2-7.1,7.1-7.1h31.7c3.9,0,7.1,3.2,7.1,7.1v31.7
		C238.9,318,235.7,321.2,231.8,321.2z"/>
	<path class="st17" d="M231.8,395.6h-31.7c-3.9,0-7.1-3.2-7.1-7.1v-31.7c0-3.9,3.2-7.1,7.1-7.1h31.7c3.9,0,7.1,3.2,7.1,7.1v31.7
		C238.9,392.5,235.7,395.6,231.8,395.6z"/>
	<path class="st18" d="M231.8,470.1h-31.7c-3.9,0-7.1-3.2-7.1-7.1v-31.7c0-3.9,3.2-7.1,7.1-7.1h31.7c3.9,0,7.1,3.2,7.1,7.1V463
		C238.9,466.9,235.7,470.1,231.8,470.1z"/>
	<rect x="257.8" y="291.9" class="st1" width="34.1" height="3.9"/>
	<rect x="257.8" y="306.6" class="st1" width="102.2" height="3.9"/>
	<rect x="257.8" y="363.4" class="st1" width="34.1" height="3.9"/>
	<rect x="257.8" y="378.1" class="st1" width="102.2" height="3.9"/>
	<rect x="257.8" y="434.9" class="st1" width="34.1" height="3.9"/>
	<rect x="257.8" y="449.6" class="st1" width="102.2" height="3.9"/>
	<rect x="467.1" y="219.7" class="st1" width="52.1" height="3.9"/>
	<rect x="467.1" y="289.3" class="st1" width="187.1" height="3.9"/>
	<rect x="467.1" y="361.2" class="st1" width="222.2" height="3.9"/>
	<rect x="467.1" y="431.4" class="st1" width="172.2" height="3.9"/>
	<rect x="467.1" y="468.1" class="st1" width="294.2" height="3.9"/>
	<circle class="st0" cx="474.2" cy="385.2" r="7.1"/>
	<circle class="st0" cx="474.2" cy="411.6" r="7.1"/>
	<circle class="st0" cx="474.2" cy="487" r="7.1"/>
	<circle class="st0" cx="474.2" cy="513.4" r="7.1"/>
	<circle class="st0" cx="474.2" cy="453.1" r="7.1"/>
	<circle class="st14" cx="818.4" cy="331.9" r="5.3"/>
	<path class="st14" d="M829.4,322.8c-8.5-8.3-19.1-4.1-19.2-4l-0.7-1.6c0.1,0,11.7-4.7,21,4.4L829.4,322.8z"/>
	<path class="st14" d="M820.9,391.6C820.8,391.6,820.8,391.6,820.9,391.6l0-1.7c0.1,0,5.2,0,12.1-2.5l0.6,1.6
		C826.7,391.5,821.5,391.6,820.9,391.6z"/>
	<polygon class="st10" points="809.7,333.3 793.5,371.2 817,375 	"/>
</g>
</svg>
```

--------------------------------------------------------------------------------

````
