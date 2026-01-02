---
source_txt: user_created_projects/ytDownloader-main
converted_utc: 2025-12-18T18:22:27Z
part: 3
parts_total: 5
---

# FULLSTACK CODE DATABASE USER CREATED ytDownloader-main

## Verbatim Content (Part 3 of 5)

````text
================================================================================
FULLSTACK USER CREATED CODE DATABASE (VERBATIM) - ytDownloader-main
================================================================================
Generated: December 18, 2025
Source: user_created_projects/ytDownloader-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: assets/css/index.css]---
Location: ytDownloader-main/assets/css/index.css

```css
@font-face {
	font-family: "JetBrains";
	src: url("../fonts/JetBrainsMono-Regular.ttf") format("truetype");
}

@font-face {
	font-family: "Ubuntu";
	src: url("../fonts/Ubuntu-Regular.ttf") format("truetype");
}

@font-face {
	font-family: "Inter";
	src: url("../fonts/Inter.ttf") format("truetype");
}

:root[theme="light"] {
	--background: #f9fafb;
	--text: #1f2937;
	--box-main: #f3f4f6;
	--box-toggle: rgb(215 238 233);
	--box-separation: #e5e7eb;
	--box-toggleOn: rgb(127, 250, 172);
	--item-bg: #dddddd;
	--box-shadow: none;
	--select: #a7f3d0;
	--greenBtn: #22c55e;
	--greenBtn-bottom: #16a34a;
	--redBtn: #d64d4f;
	--redBtn-bottom: #854243;
	--blueBtn: #3b82f6;
	--blueBtn-bottom: rgb(44, 78, 180);
}

:root[theme="dark"] {
	--background: #121212;
	--text: rgb(229, 229, 229);
	--box-main: #1d1d1d;
	--box-toggle: #191919;
	--box-separation: #2e2e2e;
	--box-toggleOn: #2e2e2e;
	--item-bg: #2c2e31;
	--box-shadow: none;
	--select: #252426;
	--greenBtn: #05aa76;
	--greenBtn-bottom: #047652;
	--redBtn: #c82b2d;
	--redBtn-bottom: #803334;
	--blueBtn: rgb(80, 140, 230);
	--blueBtn-bottom: rgb(44, 78, 180);
	--border: none;
}

:root[theme="frappe"] {
	--background: #232634;
	--text: #e2e8ff;
	--box-main: #303446;
	--box-toggle: #414559;
	--box-separation: #414559;
	--box-toggleOn: #607dc1;
	--item-bg: #414559;
	--select: #3b3e4a;
	--greenBtn: #78c346;
	--greenBtn-bottom: #597844;
	--redBtn: #d64d4f;
	--redBtn-bottom: #854243;
	--blueBtn: rgb(80, 128, 230);
	--blueBtn-bottom: rgb(44, 78, 180);
}
:root[theme="onedark"] {
	--background: #282c34;
	--text: #d2d6df;
	--box-main: #3a3d46;
	--box-toggle: #2f333d;
	--box-separation: #2f333d;
	--box-toggleOn: #13a3b7;
	--item-bg: #4d515d;
	--select: #262c33;
	--greenBtn: #85cf50;
	--greenBtn-bottom: #406923;
	--redBtn: #be2d39;
	--redBtn-bottom: #791a22;
	--blueBtn: rgb(80, 128, 230);
	--blueBtn-bottom: rgb(44, 78, 180);
}
:root[theme="matrix"] {
	--background: #0d0208;
	--text: #00ff41;
	--box-main: #0c2216;
	--box-toggle: #214338;
	--box-separation: #214338;
	--box-toggleOn: #24782e;
	--item-bg: #214338;
	--select: #08180f;
	--greenBtn: #19b42b;
	--greenBtn-bottom: #10701c;
	--redBtn: #19b42b;
	--redBtn-bottom: #10701c;
	--blueBtn: #19b42b;
	--blueBtn-bottom: #10701c;
}

:root[theme="github"] {
	--background: #f6f8fa;
	--text: #292d31;
	--box-main: #ffffff;
	--box-toggle: #f3f3f3;
	--box-separation: #f3f3f3;
	--box-toggleOn: #cce5ff;
	--item-bg: #3a66d150;
	--select: #cce5ff;
	--greenBtn: #0a9431;
	--greenBtn-bottom: #0c6826;
	--redBtn: #d73a49;
	--redBtn-bottom: #9b2733;
	--blueBtn: #005cc5;
	--blueBtn-bottom: #00428e;
}

:root[theme="latte"] {
	--background: #dce0e8;
	--text: #4c4f69;
	--box-main: #eff1f5;
	--box-toggle: #e6e9ef;
	--box-separation: #e6e9ef;
	--box-toggleOn: #cce5ff;
	--item-bg: #bcc0cc;
	--select: #cce5ff;
	--greenBtn: #40a02b;
	--greenBtn-bottom: #2e711f;
	--redBtn: #d20f39;
	--redBtn-bottom: #9c0c2b;
	--blueBtn: #1e66f5;
	--blueBtn-bottom: rgb(3, 49, 101);
}

:root[theme="solarized-dark"] {
	--background: #002b36;
	--text: #a4b1b3;
	--box-main: #003745;
	--box-toggle: #2e4c52;
	--box-separation: #2e4c52;
	--box-toggleOn: #005a6f;
	--item-bg: #003745;
	--select: rgb(9, 57, 53);
	--greenBtn: #859900;
	--greenBtn-bottom: rgb(73, 84, 1);
	--redBtn: #dc322f;
	--redBtn-bottom: #af2523;
	--blueBtn: #268bd2;
	--blueBtn-bottom: #2074b1;
}

body {
	font-family: "Ubuntu";
	text-align: center;
	padding: 10px;
	background-color: var(--background);
	color: var(--text);
	transition: 0.4s;
	font-size: large;
	user-select: none;
}

img {
	-webkit-user-drag: none;
}

#popupBox,
#popupBoxMac {
	width: 100vw;
	height: 100vh;
	margin: 0;
	background-color: rgba(17, 25, 40, 0.75);
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
	display: none;
}
#popup,
#popupMac {
	position: absolute;
	padding: 20px;
	top: 50%;
	left: 50%;
	width: 300px;
	border-radius: 10px;
	transform: translate(-50%, -50%);
	background-color: rgb(91, 91, 91);
	color: white;
}

#tryBtn {
	background-color: rgb(137, 226, 255);
	color: rgb(35, 35, 35);
	border: none;
	padding: 10px;
	border-radius: 10px;
	cursor: pointer;
	position: relative;
}
#tryBtn:active {
	border: none;
}

#menuIcon {
	position: absolute;
	top: 10px;
	right: 10px;
	width: 40px;
	height: 40px;
	cursor: pointer;
	transition: 0.3s;
}

#menu {
	display: none;
	flex-direction: column;
	backdrop-filter: blur(18px) saturate(180%);
	-webkit-backdrop-filter: blur(18px) saturate(180%);
	background: rgba(15, 23, 42, 0.85);
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 16px;
	position: absolute;
	top: 45px;
	right: 50px;
	padding: 12px;
	width: 220px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
	text-align: left;
	font-family: "Inter", sans-serif;
	font-size: medium;
	color: #e2e8f0;
	z-index: 2;
	animation: fadeIn 0.25s ease-out;
}

.menuItem {
	cursor: pointer;
	padding: 10px 12px;
	border-radius: 8px;
	margin-bottom: 6px;
	text-decoration: none;
	color: #d6dadf;
	transition: all 0.15s ease-in-out;
	border-bottom: none;
	background: rgba(25, 37, 66, 0.223);
}

.menuItem:hover {
	background: rgba(255, 255, 255, 0.08);
	color: #38bdf8;
	transform: translateX(2px);
}

.menuDivider {
	height: 1px;
	background: rgba(255, 255, 255, 0.08);
	margin: 4px 0;
}

.menuLabel {
	margin-top: 5px;
	font-size: 0.9rem;
	color: #94a3b8;
	padding: 4px 0;
}

.themeSelect {
	margin-top: 4px;
	background: rgba(30, 41, 59, 0.9);
	color: #f8fafc;
	border: 1px solid rgba(255, 255, 255, 0.15);
	border-radius: 8px;
	padding: 8px;
	font-family: "Inter", sans-serif;
	transition: border 0.2s, background 0.2s;
	width: 100%;
	cursor: pointer;
}

.themeSelect:hover,
.themeSelect:focus {
	border-color: #38bdf8;
	background: rgba(51, 65, 85, 0.9);
	outline: none;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(-6px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.item {
	display: flex;
	position: relative;
	width: 86%;
	background-color: var(--item-bg);
	color: var(--text);
	margin: 10px auto;
	border-radius: 10px;
	padding: 10px;
	align-items: center;
	justify-content: space-between;
}
.playlistItem {
	display: flex;
	position: relative;
	width: 94%;
	height: 25px;
	background-color: var(--item-bg);
	color: var(--text);
	padding: 16px 25px;
	border-radius: 15px;
	align-items: center;
	justify-content: space-between;
	margin: 10px auto;
}

.itemIconBox {
	display: flex;
	flex-direction: column;
}
.itemIcon {
	max-width: 160px;
	max-height: 90px;
	border-radius: 10px;
	margin: 0 10px 0 0;
}

.title {
	padding: 12px 10px;
	border-radius: 8px;
	margin-left: 4px;
	border: none;
	outline: none;
	width: 50%;
	text-align: center;
	background-color: var(--box-separation);
	color: var(--text);
	font-size: large;
	font-family: "Ubuntu";
}

.itemTitle {
	padding: 5px;
}
.itemBody {
	height: 90%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.itemProgress {
	font-weight: bold;
	cursor: pointer;
	padding: 10px 0;
}

.custom-progress {
    width: 90%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
	display:inline-block;
}

.custom-progress-fill {
    width: 0%;
    height: 100%;
    background: var(--blueBtn);
    transition: width 0.3s ease;
    border-radius: 6px 0 0 6px;
}


.itemSpeed {
	padding: 10px 5px 5px 5px;
}
.itemClose {
	position: absolute;
	top: 8px;
	right: 8px;
	cursor: pointer;
	cursor: pointer;
	width: 20px;
	height: 20px;
}
.itemType {
	font-style: italic;
	margin-top: 5px;
	margin: top 8px;
}

#closeHidden {
	bottom: 7px;
	position: absolute;
	right: 10px;
	cursor: pointer;
	cursor: pointer;
	width: 20px;
	height: 20px;
}

#hidden {
	display: none;
	position: absolute;
	z-index: 1;
	left: 0;
	right: 0;
	margin: auto;
	top: 20%;
	background-color: var(--box-main);
	border-radius: 15px;
	width: 80%;
	padding: 10px 10px 25px 10px;
	color: var(--text);
	border: var(--border);
}

#videoBox,
#audioBox {
	background-color: var(--box-toggle);
	padding: 10px;
	border-radius: 10px;
}

#audioExtract,
.separationBox {
	margin: 10px;
	padding: 10px;
	background-color: var(--box-separation);
	border-radius: 10px;
}

#options {
	display: none;
	position: absolute;
	overflow: hidden;
	z-index: 1;
	left: 0;
	right: 0;
	margin: auto;
	top: 15%;
	background-color: var(--box-main);
	width: 80%;
	border-radius: 10px;
	padding: 10px;
	color: var(--text);
}

#btnContainer {
	display: flex;
	flex-direction: row;
	justify-content: center;
	padding-top: 10px;
}

.toggleBtn {
	width: 50%;
	font-size: x-large;
	border: var(--border);
	background-color: var(--box-toggle);
	border-radius: 10px;
	cursor: pointer;
	padding: 8px;
	color: var(--text);
}
#videoToggle {
	background-color: var(--box-toggleOn);
}

.select {
	padding: 12px 15px;
	background-color: var(--select);
	color: var(--text);
	border: none;
	border-radius: 12px;
	cursor: pointer;
	font-size: large;
	margin-bottom: 8px;
	margin-left: 8px;
	outline: none;
	max-width: min(400px, 100%);
	font-family: "JetBrains";
}

.audioSelect {
	width: 180px;
}

#videoTypeSelect {
	width: 160px;
}

#audioQualitySelect {
	width: 145px;
}

#link {
	padding: 10px;
}

#videoFormatSelect,
#audioFormatSelect,
#audioForVideoFormatSelect {
	font-family: JetBrains, monospace;
	font-size: medium;
	width: 400px;
}

.formatSelect {
	margin-right: 4px;
}

label {
	position: relative;
	top: 3px;
}

#videoList,
#audioList {
	display: none;
}

.cb {
	width: 20px;
	height: 20px;
	position: relative;
	left: 5px;
	top: 4px;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
	appearance: none;
}

.submitBtn {
	padding: 15px;
	border-radius: 10px;
	background-color: var(--greenBtn);
	color: white;
	border: none;
	font-size: large;
	cursor: pointer;
	display: inline-block;
	outline: none;
	position: relative;
}
.submitBtn:active {
	background-color: var(--greenBtn-bottom);
	border: none;
}

#pasteUrl,
#pasteLink {
	--greenTop: #34d399;
	--greenBottom: #059669;
	--greenHover: #10b981;
	--greenActive: #047857;

	background: linear-gradient(
		to bottom right,
		var(--greenTop),
		var(--greenBottom)
	);
	color: #fff;
	font-size: 1.1rem;
	padding: 16px 28px;
	border: none;
	border-radius: 16px;
	cursor: pointer;
	outline: none;
	position: relative;
	transition: all 0.25s ease;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	margin-top: 15px;
	font-weight: bold;
}

#pasteUrl:hover,
#pasteLink:hover {
	background: linear-gradient(
		to bottom right,
		var(--greenHover),
		var(--greenBottom)
	);
	transform: translateY(-2px);
}

#pasteUrl:active,
#pasteUrl.active,
#pasteLink:active {
	background: linear-gradient(
		to bottom right,
		var(--greenActive),
		var(--greenBottom)
	);
	transform: translateY(0);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) inset;
}

.paste-keys {
	margin-left: 4px;
}

.paste-keys .key {
	background: rgba(255, 255, 255, 0.128);
	border-radius: 8px;
	padding: 6px 10px;
	font-size: 15px;
	font-family: "Inter", sans-serif;
	color: #e5e5e5;
	margin: 0 3px;
	border-bottom: 3px solid rgba(2, 107, 72, 0.6);
}

.resumeBtn {
	padding: 10px;
	border-radius: 8px;
	background-color: rgb(64, 227, 64);
	color: white;
	border: none;
	cursor: pointer;
	display: inline-block;
	outline: none;
	position: absolute;
	right: 10px;
	bottom: 10px;
	width: 100px;
}

.input {
	padding: 8px;
	border: none;
	outline: none;
	border-radius: 5px;
	width: 70px;
	font-size: large;
	margin: 5px;
}

#incorrectMsg,
#incorrectMsgPlaylist {
	color: var(--redBtn);
}

#incorrectMsgPlaylist {
	display: none;
}

#errorBtn {
	display: none;
}
#errorDetails {
	cursor: pointer;
	font-family: monospace;
	padding: 15px;
	margin: 10px 0;
	border: 2px solid rgb(189, 0, 0);
	border-radius: 8px;
	display: none;
	transition: 0.5s all;
}
#loadingWrapper {
	/* Default is flex */
	display: none;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

#preparingBox {
	display: none;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

svg {
	width: 100px;
	height: 100px;
	display: inline-block;
	margin-left: 20px;
}

.savedMsg {
	color: rgb(52, 170, 234);
	cursor: pointer;
}
#savedMsg {
	cursor: pointer;
}
button {
	font-family: "Ubuntu";
	font-weight: bold;
	outline: none;
}

#extractBtn,
.blueBtn {
	color: white;
	background-color: var(--blueBtn);
	border: none;
	position: relative;
	padding: 15px;
	border-radius: 10px;
	cursor: pointer;
	margin: 8px;
	font-size: large;
	text-decoration: none;
}

#extractBtn {
	width: 150px;
}

#download,
#audioDownload {
	width: 140px;
}

#clearBtn {
	display: none;
}

#extractBtn:active,
.blueBtn:active {
	background-color: var(--blueBtn-bottom);
	border: none;
}

.advancedToggle {
	color: white;
	background-color: var(--redBtn);
	border: none;
	position: relative;
	padding: 15px;
	border-radius: 10px;
	cursor: pointer;
	margin: 8px;
	font-size: large;
}

.advancedToggle:active {
	background-color: var(--blueBtn-bottom);
	border: none;
}

#advanced {
	display: none;
}
.advancedItem {
	border-radius: 15px;
	padding: 20px;
	margin: 10px;
	background-color: var(--item-bg);
}

#path {
	font-family: "JetBrains";
	font-size: medium;
}

#subHeader {
	font-weight: bold;
	margin-top: 0;
}

h2 {
	margin: 12px;
	font-size: 24px;
}

/* Scrollbar */

body::-webkit-scrollbar {
	width: 5px;
}

body::-webkit-scrollbar-track {
	box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

body::-webkit-scrollbar-thumb {
	background-color: rgb(79, 78, 78);
	border-radius: 5px;
}

#goToTop {
	display: none;
	position: fixed;
	bottom: 10px;
	right: 10px;
	z-index: 2;
	border: none;
	outline: none;
	background-image: url(../images/up-arrow.png);
	background-size: contain;
	width: 40px;
	height: 40px;
	cursor: pointer;
	color: white;
	cursor: pointer;
}

.popup-container {
	position: fixed;
	bottom: 30px;
	left: 30px;
	z-index: 9999;

	display: flex;
	flex-direction: column;
	gap: 12px;
}

.popup-item {
	display: inline-block;

	color: #fff;
	padding: 12px 24px;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	font-weight: 600;
	font-size: 15px;

	opacity: 1;
	transition: opacity 0.4s;
}

.scale {
	animation-name: scale;
	animation-duration: 0.4s;
	animation-fill-mode: forwards;
}

.scaleUp {
	animation-name: scaleUp;
	animation-duration: 0.4s;
	animation-fill-mode: forwards;
}

body::-webkit-scrollbar {
	width: 10px;
}
body::-webkit-scrollbar-thumb {
	background: linear-gradient(rgb(110, 110, 110), rgb(77, 77, 77));
	border-radius: 8px;
}

@keyframes scale {
	0% {
		scale: 1;
	}
	100% {
		scale: 0;
	}
}
@keyframes scaleUp {
	0% {
		scale: 0;
	}
	100% {
		scale: 1;
	}
}

@media screen and (max-width: 650px) {
	.item {
		width: 90%;
	}
	.title {
		width: 80%;
	}
}

/* Compressor styles */
#compressor-header {
	text-align: center;
	margin-top: 0;
}

.container {
	max-width: 800px;
	margin: 30px auto 10px auto;
	background: var(--box-main);
	padding: 30px;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.drop-zone {
	border: 2px dashed #ccc;
	border-radius: 8px;
	padding: 2rem;
	text-align: center;
	margin-bottom: 2rem;
	transition: border-color 0.3s ease;
	background: var(--box-toggle);
}

.drop-zone:hover {
	border-color: #2196f3;
	cursor: pointer;
}

.compress-select {
	font-family: "Ubuntu";
	padding: 10px;
}

.drop-zone.dragover {
	border-color: #2196f3;
	background-color: var(--box-toggleOn);
}

#settings-group-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.output-folder-conf {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

#output-folder-box {
	background-color: var(--box-toggle);
	margin-bottom: 12px;
	padding: 15px;
	border-radius: 8px;
	text-align: left;
}

#output-folder-input {
	width: 20px;
	height: 20px;
	margin-left: 10px;
}

.folder-input-checkbox {
	display: flex;
	align-items: center;
}
#output-suffix {
	cursor: text;
}

.settings-group {
	margin-bottom: 10px;
	display: flex;
	flex-direction: column;
	width: 46%;
}

.compress-label {
	font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
	display: block;
	margin-bottom: 10px;
	font-weight: 500;
	text-align: left;
}

#compression-status {
	max-width: 800px;
	margin: 20px auto 0 auto;
	border-top: 1px solid var(--item-bg);
	padding-top: 20px;
}

.status-item {
	padding: 16px;
	margin: 6px auto;
	border-radius: 4px;
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	background-color: var(--item-bg);
	max-width: 800px;
}

.status-item.success {
	color: var(--greenBtn);
}

.status-item.error {
	color: var(--redBtn);
}

.status {
	min-width: 80px;
	text-transform: uppercase;
	font-size: 0.9em;
	font-weight: bold;
}

.fileinput-btn {
	background: var(--blueBtn);
	color: white;
	padding: 10px;
	display: block;
	border-radius: 5px;
	margin: 5px 0 10px 0;
	cursor: pointer;
	border: none;
}

.progressBarCompress {
	width: 200px;
}

.nvidia_opt,
.amf_opt,
.qsv_opt,
.vaapi_opt,
.videotoolbox_opt {
	display: none;
}

#custom-folder-select {
	padding: 10px;
	margin-left: 0;
	display: none;
}

#custom-folder-path {
	font-family: "JetBrains";
	background-color: var(--box-main);
	padding: 8px;
	border-radius: 4px;
	display: none;
}

#selected-files {
	padding-top: 10px;
	opacity: 0.8;
}

::view-transition-old(root),
::view-transition-new(root) {
	animation: none;
	mix-blend-mode: normal;
}

@media (min-width: 640px) {
	.container {
		padding: 2rem;
	}
}

.slider-wrapper {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.time-display {
	flex-shrink: 0;
	width: 5.5rem;
	height: 3rem;
	background-color: var(--box-main);
	color: var(--text);
	border-radius: 0.5rem;
	font-weight: 500;
	border: none;
	outline: none;
	text-align: center;
	font-family: "Inter", sans-serif;
	font-size: 1rem;
	padding: 0;
}

.slider-container {
	position: relative;
	width: 100%;
	height: 2rem;
	display: flex;
	align-items: center;
}

.track-background {
	position: absolute;
	width: 100%;
	height: 0.25rem;
	background-color: #4b5563;
	border-radius: 9999px;
}

#range-highlight {
	position: absolute;
	height: 0.25rem;
	background-color: var(--blueBtn);
	border-radius: 9999px;
	z-index: 1;
}

input[type="range"] {
	-webkit-appearance: none;
	appearance: none;
	width: 100%;
	height: 4px;
	background: transparent;
	outline: none;
	position: absolute;
	margin: 0;
	padding: 0;
	pointer-events: none;
}

#min-slider {
	z-index: 2;
}

#max-slider {
	z-index: 3;
}

input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 12px;
	height: 32px;
	background-color: var(--blueBtn);
	border-radius: 9999px;
	cursor: pointer;
	pointer-events: auto;
	margin-top: -14px;
	transition: transform 0.1s ease-in-out;
	position: relative;
}

input[type="range"]::-webkit-slider-thumb:hover {
	transform: scale(1.1);
}

#customArgsInput {
	padding: 8px;
	width: 94%;
	margin: auto;
	outline: none;
	font-family: "JetBrains";
	border-radius: 8px;
	resize: vertical;
}

#updatePopup {
	position: fixed;
	bottom: 30px;
	right: 30px;
	z-index: 9999;
	background-color: var(--box-separation);
	padding: 15px 20px;
	border-radius: 10px;
	display: none;

	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.progress-track {
	width: 200px;
	height: 8px;
	background-color: rgba(209, 209, 209, 0.446);
	border-radius: 4px;
	overflow: hidden;
	margin: 10px 2px;
}

#progressBarFill {
	height: 100%;
	width: 0%;
	background-color: var(--greenBtn);
	transition: width 0.2s ease;
}

.update-label,
#updateProgress {
	font-size: 14px;
}
```

--------------------------------------------------------------------------------

---[FILE: flatpak/io.github.aandrew_me.ytdn.desktop]---
Location: ytDownloader-main/flatpak/io.github.aandrew_me.ytdn.desktop

```text
[Desktop Entry]
Name=ytDownloader
Comment=Download videos and audios from YouTube and other sites
Exec=run.sh
Type=Application
Icon=io.github.aandrew_me.ytdn
Categories=Utility;
```

--------------------------------------------------------------------------------

---[FILE: flatpak/io.github.aandrew_me.ytdn.metainfo.xml]---
Location: ytDownloader-main/flatpak/io.github.aandrew_me.ytdn.metainfo.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<component type="desktop">
  <id>io.github.aandrew_me.ytdn</id>
  <name>ytDownloader</name>
  <launchable type="desktop-id">io.github.aandrew_me.ytdn.desktop</launchable>
  <developer id="io.github.aandrew_me">
    <name>Andrew</name>
  </developer>
  <url type="bugtracker">https://github.com/aandrew-me/ytDownloader/issues</url>
  <url type="translate">
    https://github.com/aandrew-me/ytDownloader?tab=readme-ov-file#internationalization-localization-</url>
  <summary>Download videos and audios from hundreds of sites</summary>
  <description>
    <p>ytDownloader (Formerly know as Youtube Downloader Plus) lets you download videos and audios
      of different qualities from hundreds of
      sites including the popular ones but not limited to Youtube, Facebook, Instagram, Tiktok,
      Twitter, Twitch and so on.</p>
    <p>✔️ Supports high quality video resolutions</p>
    <p>✔️ Video Compressor with Hardware Acceleration</p>
    <p>✔️ Supports audio extraction in multiple formats</p>
    <p>✔️ Supports playlist downloads</p>
    <p>✔️ Supports downloading particular ranges</p>
    <p>✔️ Supports downloading subtitles</p>
    <p>✔️ Supports multiple themes</p>
    <p>✔️ Completely free and open source</p>
    <p>✔️ Fast download speeds</p>
  </description>
  <project_license>GPL-3.0</project_license>
  <metadata_license>CC0-1.0</metadata_license>
  <screenshots>
    <screenshot type="default">
      <image>
        https://github.com/user-attachments/assets/12410bca-31c3-48a0-bbd3-1d74bcc752b6
      </image>
      <caption>ytDownloader homepage</caption>
    </screenshot>

    <screenshot>
      <image>
        https://github.com/user-attachments/assets/060557bc-d209-4bd0-bda4-debe42ca83a0
      </image>
      <caption>ytDownloader Settings</caption>
    </screenshot>

    <screenshot>
      <image>
        https://github.com/user-attachments/assets/52da7e50-46bb-4749-8152-5e79324a6cc3
      </image>
      <caption>ytDownloader video compressor</caption>
    </screenshot>

  </screenshots>
  <url type="homepage">https://github.com/aandrew-me/ytDownloader</url>

  <content_rating type="oars-1.1" />

  <releases>
    <release version="3.20.2" date="2025-11-27">
      <description>
        <p>Bring back cookie related info</p>
      </description>
    </release>


    <release version="3.20.0" date="2025-11-22">
      <description>
        <p>Added download history</p>
        <p>Added JS runtime support as per new yt-dlp requirements. The app will now ship with a
          nodejs binary. Youtube downloads should be more stable.</p>
        <p>Added slider for range selection.</p>
        <p>Added progress for yt-dlp download and update</p>
        <p>Translation updates, added new languages.</p>
        <p>Added custom built ffmpeg, ffprobe for Windows and Linux builds.</p>
        <p>Added support to add custom yt-dlp arguments</p>
        <p>Fixed incorrect resolution downloads for playlists.</p>
        <p>Added showing approximate file sizes when possible.</p>
        <p>Improved user interface.</p>
        <p>Minor bug fixes.</p>
        <p>Major code refactoring.</p>
      </description>
    </release>

    <release version="3.19.2" date="2025-09-06">
      <description>
        <p>Improved app performance</p>
        <p>UI improvements</p>
        <p>Fixed minor bugs</p>
      </description>
    </release>
    <release version="3.19.1" date="2025-05-20">
      <description>
        <p>Added support for chapters</p>
        <p>UI improvements</p>
      </description>
    </release>
    <release version="3.19.0" date="2025-02-09">
      <description>
        <p>Added Video Compressor with Hardware Acceleration (Beta)</p>
        <p>Bug fixes</p>
      </description>
    </release>
    <release version="3.18.5" date="2024-11-29">
      <description>
        <p>Bug fixes</p>
      </description>
    </release>
    <release version="3.18.4" date="2024-11-3">
      <description>
        <p>Bug fixes</p>
      </description>
    </release>
    <release version="3.18.3" date="2024-10-10">
      <description>
        <p>Fixes and enhancements</p>
      </description>
    </release>
    <release version="3.18.2" date="2024-8-25">
      <description>
        <p>Design enhancements</p>
        <p>Added removal of old windows updates</p>
        <p>Ignore unavailable videos for playlists</p>
        <p>Fixed issues with config file on resize</p>
      </description>
    </release>
    <release version="3.18.0" date="2024-6-02">
      <description>
        <p>Added proxy support</p>
        <p>Added button to clear downloads</p>
        <p>Fixed download errors</p>
        <p>Added compatibility for X(Twitter)</p>
        <p>Minor enhancements</p>
      </description>
    </release>
    <release version="3.17.4" date="2024-4-21">
      <description>
        <p>Added Chinese language</p>
        <p>Fixed video trim info to filename</p>
      </description>
    </release>
    <release version="3.17.3" date="2024-3-03">
      <description>
        <p>Fixed formats not being shown</p>
        <p>Added Arabic language</p>
      </description>
    </release>
    <release version="3.17.2" date="2024-2-23">
      <description>
        <p>Fixed conflicts with same filenames</p>
        <p>Fixed formats not being selected properly</p>
      </description>
    </release>
    <release version="3.17.1" date="2024-1-27">
      <description>
        <p>Fixed config file not being used when getting info</p>
      </description>
    </release>
    <release version="3.17.0" date="2024-1-27">
      <description>
        <p>Changelog</p>
        <ul>
          <li>Added option to choose audio for video</li>
          <li>Webm options will be hidden by default</li>
          <li>Enhancements</li>
        </ul>
      </description>
    </release>
    <release version="3.16.1" date="2023-12-26" />
    <release version="3.16.0" date="2023-12-24" />
    <release version="3.15.1" date="2023-11-26" />
    <release version="3.15.0" date="2023-10-29" />
    <release version="3.14.3" date="2023-10-21" />
    <release version="3.14.2" date="2023-8-8" />
    <release version="3.14.1" date="2023-6-11" />
    <release version="3.14.0" date="2023-5-17" />
    <release version="3.13.0" date="2023-4-25" />
    <release version="3.12.2" date="2023-4-8" />
    <release version="3.12.1" date="2023-3-24" />
    <release version="3.12.0" date="2023-2-26" />
    <release version="3.11.0" date="2023-1-30" />
    <release version="3.10.6" date="2023-1-24" />
    <release version="3.10.5" date="2023-1-22" />
    <release version="3.10.4" date="2023-1-19" />
    <release version="3.10.3" date="2023-1-16" />
    <release version="3.10.2" date="2023-1-3" />
    <release version="3.10.1" date="2022-12-26" />
    <release version="3.10.0" date="2022-12-24" />
    <release version="3.9.0" date="2022-11-27" />
    <release version="3.8.1" date="2022-11-20" />
    <release version="3.8.0" date="2022-11-12" />
    <release version="3.7.2" date="2022-11-10" />
    <release version="3.7.1" date="2022-11-1" />
    <release version="3.7.0" date="2022-11-1" />
    <release version="3.6.3" date="2022-10-27" />
    <release version="3.6.2" date="2022-10-13" />
    <release version="3.6.1" date="2022-10-03" />
    <release version="3.6.0" date="2022-10-03" />
    <release version="3.5.3" date="2022-09-23" />
    <release version="3.5.2" date="2022-09-22" />
    <release version="3.5.1" date="2022-09-18" />
    <release version="3.5.0" date="2022-09-18" />
    <release version="3.4.0" date="2022-09-14" />
    <release version="3.3.3" date="2022-09-14" />
    <release version="3.3.2" date="2022-09-13" />
    <release version="3.3.1" date="2022-09-10" />
    <release version="3.3.0" date="2022-09-8" />
    <release version="3.2.2" date="2022-09-7" />
    <release version="3.2.1" date="2022-09-6" />
    <release version="3.2.0" date="2022-09-5" />
    <release version="3.1.0" date="2022-08-31" />
    <release version="3.0.0" date="2022-08-29" />
    <release version="2.1.2" date="2022-08-28" />
    <release version="2.1.1" date="2022-08-27" />
    <release version="2.1.0" date="2022-08-27" />
    <release version="2.0.4" date="2022-08-26" />
    <release version="2.0.3" date="2022-08-23" />
    <release version="2.0.1" date="2022-08-10" />
    <release version="2.0" date="2022-08-05" />
  </releases>
</component>
```

--------------------------------------------------------------------------------

---[FILE: html/about.html]---
Location: ytDownloader-main/html/about.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-translate="about">About</title>
    <link rel="stylesheet" href="../assets/css/extra.css">

    <script src="../translations/i18n-init.js" defer></script>
</head>

<body>
    <div id="top">
        <a id="back" data-translate="homepage">Homepage</a>
    </div>
    <h1>ytDownloader </h1><span id="version"></span>

    <p id="txt1" data-translate="appDescription">ytDownloader lets you download videos and audios from hundreds of sites
        like Youtube, Facebook,
        Instagram, Tiktok, Twitter and so on</p>

    <p id="txt2" data-translate="aboutAppDescription">It's a Free and Open Source app built on top of Node.js and
        Electron. yt-dlp has been used for
        downloading</p>

    <span id="txt3" data-translate="sourceCodeAvailable">Source Code is available </span><a id="sourceLink"
        data-translate="here">here</a>

    <script>
        const { ipcRenderer, shell } = require("electron");


        document.addEventListener('translations-loaded', () => {
            window.i18n.translatePage();

            const storageTheme = localStorage.getItem("theme");
            if (storageTheme) {
                document.documentElement.setAttribute("theme", storageTheme);
            } else {
                document.documentElement.setAttribute("theme", "frappe");

            }

            ipcRenderer.send("get-version");
            ipcRenderer.once("version", (event, version) => {
                document.getElementById("version").textContent = version;
            });

            document.getElementById("back").addEventListener("click", () => {
                ipcRenderer.send("close-secondary");
            });

            document.getElementById("sourceLink").addEventListener("click", () => {
                shell.openExternal("https://github.com/aandrew-me/ytDownloader");
            });
        });
    </script>

</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: html/compressor.html]---
Location: ytDownloader-main/html/compressor.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-translate="compressor">Video Compressor</title>
    <link rel="stylesheet" href="../assets/css/index.css">
    <script src="../translations/i18n-init.js" defer></script>
    <script src="../src/compressor.js" defer></script>
</head>

<body id="compressor_body">
    <!-- Menu icon -->
    <img src="../assets/images/menu.png" alt="menu" id="menuIcon">

    <!-- Menu -->
    <div id="menu" class="menu">
        <a id="homeWin" class="menuItem" data-translate="homepage">Homepage</a>
        <a id="playlistWin" class="menuItem" data-translate="downloadPlaylistButton">Download Playlist</a>
        <a id="preferenceWin" class="menuItem" data-translate="preferences">Preferences</a>
        <a id="historyWin" class="menuItem" data-translate="downloadHistory">History</a>
        <a id="aboutWin" class="menuItem" data-translate="about">About</a>

        <div class="menuDivider"></div>

        <label for="themeToggle" id="themeTxt" class="menuLabel" data-translate="theme">Theme</label>
        <select name="themeToggle" id="themeToggle" class="themeSelect">
            <option id="lightTxt" value="light" data-translate="themeLight">Light</option>
            <option id="darkTxt" value="dark" data-translate="themeDark">Dark</option>
            <option id="frappeTxt" value="frappe" data-translate="themeFrappe">Frappé</option>
            <option id="onedarkTxt" value="onedark" data-translate="themeOneDark">One dark</option>
            <option id="matrixTxt" value="matrix" data-translate="themeMatrix">Matrix</option>
            <option id="githubTxt" value="github">Github</option>
            <option id="latteTxt" value="latte">Latte</option>
            <option id="solarizedDarkTxt" value="solarized-dark" data-translate="themeSolarizedDark">Solarized Dark
            </option>
        </select>
    </div>

    <div class="container">
        <h1 id="compressor-header" data-translate="compressor">Video Compressor</h1>

        <div class="drop-zone">
            <p data-translate="dragAndDropFiles">Drag and drop file(s)</p>
            <input type="file" id="fileInput" multiple hidden>
            <label for="fileInput" class="fileinput-btn" data-translate="chooseFiles">Choose File(s)</label>
            <div id="selected-files" data-translate="noFilesSelected">No files selected</div>
        </div>

        <div id="settings-group-container">
            <div class="settings-group">
                <label class="compress-label" for="extension" data-translate="videoFormat">Video format</label>
                <select class="select compress-select" id="file_extension">
                    <option value="unchanged">Unchanged</option>
                    <option value="mp4">mp4</option>
                    <option value="mkv">mkv</option>
                </select>
            </div>

            <div class="settings-group">
                <label class="compress-label" for="encoder" data-translate="videoEncoder">Video Encoder</label>
                <select class="select compress-select" id="encoder">
                    <option value="x264">x264</option>
                    <option value="x265">x265</option>
                    <option class="qsv_opt" value="qsv">x264 (Intel QSV Hardware Acceleration)</option>
                    <option class="qsv_opt" value="hevc_qsv">x265 (Intel QSV Hardware Acceleration)</option>
                    <option class="amf_opt" value="amf">x264 (AMD Hardware Acceleration)</option>
                    <option class="amf_opt" value="hevc_amf">x265 (AMD Hardware Acceleration)</option>
                    <option class="nvidia_opt" value="nvenc">x264 (NVIDIA Hardware Acceleration)</option>
                    <option class="nvidia_opt" value="hevc_nvenc">x265 (NVIDIA Hardware Acceleration)</option>
                    <option class="vaapi_opt" value="vaapi">x264 (VA-API Hardware Acceleration)</option>
                    <option class="vaapi_opt" value="hevc_vaapi">x265 (VA-API Hardware Acceleration)</option>
                    <option class="videotoolbox_opt" value="videotoolbox">x264 (VideoToolbox Hardware Acceleration)
                    </option>
                    <option class="videotoolbox_opt" value="hevc_videotoolbox">x265 (VideoToolbox Hardware Acceleration)
                    </option>
                    <option value="copy">Copy video</option>
                </select>
            </div>

            <div class="settings-group">
                <label class="compress-label" for="compression-speed" data-translate="compressionSpeed">Compression
                    Speed</label>
                <select class="select compress-select" id="compression-speed">
                    <option value="fast">Fast</option>
                    <option selected value="medium">Medium</option>
                    <option value="slow">Slow</option>
                </select>
            </div>

            <div class="settings-group">
                <label class="compress-label" for="video-quality" data-translate="videoQuality">Video Quality</label>
                <select class="select compress-select" id="video-quality">
                    <option value="18">18 (Best quality)</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option selected value="23">23 (Medium size, good quality)</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28 (Smaller file size, decent quality)</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                    <option value="34">34</option>
                    <option value="35">35</option>
                    <option value="36">36</option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="44">44</option>
                    <option value="45">45</option>
                    <option value="46">46</option>
                    <option value="47">47</option>
                    <option value="48">48</option>
                    <option value="49">49</option>
                    <option value="50">50</option>
                    <option value="51">51 (Worst quality)</option>
                </select>

            </div>

            <div class="settings-group">
                <label class="compress-label" for="audio-format" data-translate="audioFormat">Audio Format</label>
                <select class="select compress-select" id="audio-format">
                    <option value="copy">Unchanged</option>
                    <option value="aac">aac</option>
                    <option value="mp3">mp3</option>
                </select>
            </div>

            <div class="settings-group">
                <div class="compress-label" data-translate="outputSuffix">Output suffix</div>
                <input type="text" name="suffix" id="output-suffix" class="select compress-select"
                    placeholder="No suffix needs different output folder" value="_compressed">
            </div>
        </div>

        <div id="output-folder-box">
            <div class="output-folder-conf">
                <span class="compress-label" data-translate="outputInSameFolder">Output in same folder</span>
                <input checked type="checkbox" name="output-folder" id="output-folder-input">

            </div>
            <div class="output-folder-conf">
                <button class="blueBtn" id="custom-folder-select" data-translate="selectCustomFolder">Select Custom
                    Folder</button>
                <span id="custom-folder-path"></span>
            </div>
        </div>

        <div class="button-group">
            <button class="blueBtn" id="compress-btn" data-translate="startCompression">Start Compression</button>
            <button class="advancedToggle" id="cancel-btn" data-translate="cancel">Cancel</button>
        </div>

    </div>

    <div id="compression-status"></div>
    </div>

</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: html/history.html]---
Location: ytDownloader-main/html/history.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download History - YtDownloader</title>
    <link rel="stylesheet" href="../assets/css/index.css">
    <style>
        .history-container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .history-header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            color: var(--text);
        }

        .history-controls {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            align-items: center;
            margin-bottom: 25px;
        }

        .search-box {
            padding: 10px 15px;
            border: 2px solid var(--box-toggle, #3a3a3a);
            border-radius: 6px;
            background: var(--box-main, #2a2a2a);
            color: var(--text, #fff);
            width: 300px;
            font-size: 14px;
            transition: border-color 0.3s ease;
        }

        .search-box:focus {
            outline: none;
            border-color: var(--select, #54abde);
        }

        .filter-select {
            padding: 10px 15px;
            border: 2px solid var(--box-toggle, #3a3a3a);
            border-radius: 6px;
            background: var(--box-main, #2a2a2a);
            color: var(--text, #fff);
            font-size: 14px;
            cursor: pointer;
            transition: border-color 0.3s ease;
        }

        .filter-select:focus {
            outline: none;
            border-color: var(--select, #54abde);
        }

        .history-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            padding: 20px;
            background: var(--box-main, #2a2a2a);
            border-radius: 10px;
            border: 2px solid var(--box-toggle, #3a3a3a);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .stat-card h3 {
            margin: 0 0 10px 0;
            font-size: 13px;
            opacity: 0.7;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text);
        }

        .stat-card .value {
            font-size: 24px;
            font-weight: bold;
            color: var(--text);
            word-break: break-word;
        }

        .history-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .history-item {
            display: flex;
            align-items: center;
            padding: 18px;
            background: var(--item-bg, #2a2a2a);
            border-radius: 10px;
            border: 2px solid var(--box-toggle, #3a3a3a);
            transition: all 0.3s ease;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            gap: 15px;
        }

        .history-item:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-color: var(--select, #54abde);
        }

        .history-item-thumbnail {
            width: 80px;
            height: 80px;
            background: var(--box-toggle, #ddd);
            border-radius: 8px;
            object-fit: cover;
            flex-shrink: 0;
        }

        .history-item-info {
            flex: 1;
            min-width: 0;
            overflow: hidden;
        }

        .history-item-title {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--text);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.4;
            text-align: left;
        }

        .history-item-meta {
            display: flex;
            gap: 18px;
            font-size: 13px;
            opacity: 0.7;
            flex-wrap: wrap;
            color: var(--text);
            text-align: left;
        }

        .history-item-meta span {
            white-space: nowrap;
        }

        .history-item-actions {
            display: flex;
            gap: 10px;
            flex-shrink: 0;
        }

        .history-item-actions button {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            background: var(--blueBtn, #54abde);
            color: white;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .history-item-actions button:hover {
            transform: scale(1.05);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }

        .history-item-actions button:active {
            transform: scale(0.98);
        }

        .history-item-actions .delete-btn {
            background: var(--redBtn, #ff6b6b);
        }

        .history-item-actions .delete-btn:hover {
            background: var(--redBtn-bottom, #ff5252);
        }

        .empty-state {
            text-align: center;
            padding: 80px 20px;
            color: var(--text, #666);
        }

        .empty-state-icon {
            font-size: 64px;
            margin-bottom: 20px;
            opacity: 0.3;
        }

        .empty-state h2 {
            color: var(--text);
            margin-bottom: 10px;
        }

        .empty-state p {
            color: var(--text);
            opacity: 0.7;
        }

        .submitBtn {
            padding: 10px 24px;
            border: none;
            border-radius: 8px;
            background: var(--greenBtn, #4caf50);
            color: white;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .submitBtn:hover {
            background: var(--greenBtn-bottom, #45a049);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .submitBtn:active {
            transform: translateY(0);
        }

        .submitBtn.close-btn {
            background: var(--redBtn, #ff6b6b);
        }

        .submitBtn.close-btn:hover {
            background: var(--redBtn-bottom, #ff5252);
        }

        .action-buttons {
            display: flex;
            gap: 12px;
            margin-bottom: 25px;
            flex-wrap: wrap;
        }

        .action-buttons button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            background: var(--blueBtn, #54abde);
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .action-buttons button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .action-buttons button:active {
            transform: translateY(0);
        }

        .action-buttons .danger-btn {
            background: var(--redBtn, #ff6b6b);
        }

        .action-buttons .danger-btn:hover {
            background: var(--redBtn-bottom, #ff5252);
        }

        @media (max-width: 768px) {
            .history-stats {
                grid-template-columns: 1fr;
            }

            .history-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }

            .history-item-thumbnail {
                margin-right: 0;
                margin-bottom: 0;
                align-self: center;
            }

            .history-item-info {
                width: 100%;
            }

            .history-item-title {
                text-align: center;
                white-space: normal;
                word-break: break-word;
            }

            .history-item-meta {
                justify-content: center;
                text-align: center;
            }

            .history-item-actions {
                margin-left: 0;
                width: 100%;
                justify-content: center;
                flex-wrap: wrap;
            }

            .history-item-actions button {
                flex: 1;
                min-width: 100px;
            }

            .search-box {
                width: 100%;
            }

            .filter-select {
                width: 100%;
            }

            .history-header h1 {
                font-size: 24px;
            }

            .action-buttons {
                width: 100%;
            }

            .action-buttons button {
                flex: 1;
                min-width: 120px;
            }
        }

        @media (max-width: 1024px) and (min-width: 769px) {
            .history-item-title {
                white-space: normal;
                word-break: break-word;
                max-width: 500px;
            }
        }

        .popup-container {
            position: fixed;
            bottom: 30px;
            left: 30px;
            z-index: 9999;

            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .popup-item {
            display: inline-block;

            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            font-weight: 600;
            font-size: 15px;

            opacity: 1;
            transition: opacity 0.4s;
        }
    </style>
</head>


<body>
    <div class="history-container">
        <div class="history-header">
            <h1 id="historyTitle" data-translate="downloadHistory">Download History</h1>
            <button id="closeBtn" class="submitBtn close-btn" onclick="window.close()"
                data-translate="close">Close</button>
        </div>

        <div class="history-controls">
            <input type="text" class="search-box" id="searchBox" placeholder="Search by title or URL..."
                data-translate-placeholder="searchByTitleOrUrl">
            <select class="filter-select" id="formatFilter">
                <option value="" data-translate="allFormats">All Formats</option>
                <option value="mp4">MP4</option>
                <option value="mp3">MP3</option>
                <option value="m4a">M4A</option>
                <option value="webm">WEBM</option>
                <option value="opus">Opus</option>
                <option value="wav">WAV</option>
                <option value="flac">FLAC</option>
            </select>
        </div>

        <div class="history-stats" id="statsContainer"></div>

        <div class="action-buttons">
            <button id="exportJsonBtn" onclick="exportHistoryJSON()" data-translate="exportAsJson">Export as
                JSON</button>
            <button id="exportCsvBtn" onclick="exportHistoryCSV()" data-translate="exportAsCsv">Export as CSV</button>
            <button id="clearAllBtn" class="danger-btn" onclick="clearAllHistory()"
                data-translate="clearAllHistory">Clear All History</button>
        </div>

        <div id="historyListContainer" class="history-list"></div>
    </div>

    <div id="popupContainer" class="popup-container"></div>

    <script src="../translations/i18n-init.js"></script>

    <script>
        const { ipcRenderer } = require("electron");

        document.addEventListener('translations-loaded', () => {
            window.i18n.translatePage();
            document.title = window.i18n.__("downloadHistory")
        });

        let allHistory = [];
        let filteredHistory = [];

        // Load history on page open
        document.addEventListener("DOMContentLoaded", () => {
            loadTheme();
            loadHistory();
            setupEventListeners();
        });

        function loadTheme() {
            const storageTheme = localStorage.getItem("theme");
            if (storageTheme) {
                document.documentElement.setAttribute("theme", storageTheme);
            } else {
                document.documentElement.setAttribute("theme", "frappe");

            }
        }

        function setupEventListeners() {
            document.getElementById("searchBox").addEventListener("input", filterHistory);
            document.getElementById("formatFilter").addEventListener("change", filterHistory);
        }

        function loadHistory() {
            ipcRenderer.invoke("get-download-history").then((history) => {
                allHistory = history || [];
                renderHistory(allHistory);
                updateStats();
            }).catch((error) => {
                console.error("Failed to load history:", error);
                showPopup("Failed to load download history. Please try again.", true);
            });
        }

        function filterHistory() {
            const searchTerm = document.getElementById("searchBox").value;
            const format = document.getElementById("formatFilter").value;

            filteredHistory = allHistory.filter((item) => {
                const matchesSearch =
                    !searchTerm ||
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.url.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesFormat = !format || item.format.toLowerCase() === format.toLowerCase();

                return matchesSearch && matchesFormat;
            });

            renderHistory(filteredHistory);
        }

        function renderHistory(historyItems) {
            const container = document.getElementById("historyListContainer");

            // Clear container first
            container.innerHTML = '';

            if (historyItems.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';

                const icon = document.createElement('div');
                icon.className = 'empty-state-icon';
                icon.textContent = '📭';

                const heading = document.createElement('h2');
                heading.textContent = 'No Downloads Yet';

                const text = document.createElement('p');
                text.textContent = 'Your download history will appear here';

                emptyState.appendChild(icon);
                emptyState.appendChild(heading);
                emptyState.appendChild(text);
                container.appendChild(emptyState);
                return;
            }


            historyItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'history-item';
                itemDiv.dataset.id = item.id;


                const thumbnail = document.createElement(item.thumbnail ? 'img' : 'div');
                thumbnail.className = 'history-item-thumbnail';
                if (item.thumbnail) {
                    thumbnail.src = item.thumbnail;
                    thumbnail.alt = 'thumbnail';
                }
                itemDiv.appendChild(thumbnail);


                const info = document.createElement('div');
                info.className = 'history-item-info';


                const title = document.createElement('div');
                title.className = 'history-item-title';
                title.title = item.title;
                title.textContent = item.title;
                info.appendChild(title);


                const meta = document.createElement('div');
                meta.className = 'history-item-meta';


                const formatSpan = document.createElement('span');
                formatSpan.textContent = 'Format: ';
                const formatStrong = document.createElement('strong');
                formatStrong.textContent = item.format;
                formatSpan.appendChild(formatStrong);
                meta.appendChild(formatSpan);


                const sizeSpan = document.createElement('span');
                sizeSpan.textContent = 'Size: ';
                const sizeStrong = document.createElement('strong');
                sizeStrong.textContent = formatFileSize(item.fileSize);
                sizeSpan.appendChild(sizeStrong);
                meta.appendChild(sizeSpan);


                const dateSpan = document.createElement('span');
                dateSpan.textContent = 'Date: ';
                const dateStrong = document.createElement('strong');
                dateStrong.textContent = new Date(item.downloadDate).toLocaleDateString();
                dateSpan.appendChild(dateStrong);
                meta.appendChild(dateSpan);


                if (item.duration) {
                    const durationSpan = document.createElement('span');
                    durationSpan.textContent = 'Duration: ';
                    const durationStrong = document.createElement('strong');
                    durationStrong.textContent = formatDuration(item.duration);
                    durationSpan.appendChild(durationStrong);
                    meta.appendChild(durationSpan);
                }

                info.appendChild(meta);
                itemDiv.appendChild(info);


                const actions = document.createElement('div');
                actions.className = 'history-item-actions';


                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-url-btn';
                copyBtn.textContent = i18n.__('copyUrl');
                copyBtn.addEventListener('click', () => copyToClipboard(item.url));
                actions.appendChild(copyBtn);


                const openBtn = document.createElement('button');
                openBtn.className = 'open-file-btn';
                openBtn.textContent = i18n.__('open');
                openBtn.addEventListener('click', () => openFile(item.filePath));
                actions.appendChild(openBtn);


                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = i18n.__('delete');
                deleteBtn.addEventListener('click', () => deleteHistoryItem(item.id));
                actions.appendChild(deleteBtn);

                itemDiv.appendChild(actions);
                container.appendChild(itemDiv);
            });
        }

        function updateStats() {
            ipcRenderer.invoke("get-download-stats").then((stats) => {
                const statsContainer = document.getElementById("statsContainer");
                statsContainer.innerHTML = "";

                const createStatCard = (title, value) => {
                    const card = document.createElement("div");
                    card.className = "stat-card";

                    const titleElement = document.createElement("h3");
                    titleElement.textContent = title;

                    const valueElement = document.createElement("div");
                    valueElement.className = "value";
                    valueElement.textContent = value;

                    card.appendChild(titleElement);
                    card.appendChild(valueElement);

                    return card;
                };

                const mostCommonFormat = Object.keys(stats.byFormat).length > 0
                    ? Object.entries(stats.byFormat).sort((a, b) => b[1] - a[1])[0][0].toUpperCase()
                    : "N/A";

                statsContainer.appendChild(createStatCard(i18n.__("totalDownloads"), stats.totalDownloads));
                statsContainer.appendChild(createStatCard(i18n.__("totalSize"), formatFileSize(stats.totalSize)));
                statsContainer.appendChild(createStatCard(i18n.__("mostCommonFormat"), mostCommonFormat));

            }).catch((error) => {
                console.error("Failed to load stats:", error);
                const statsContainer = document.getElementById("statsContainer");
                // Clear any previous content
                statsContainer.innerHTML = "";

                // Helper function for creating placeholder cards
                const createPlaceholderCard = (title) => {
                    const card = document.createElement("div");
                    card.className = "stat-card";

                    const titleElement = document.createElement("h3");
                    titleElement.textContent = title;

                    const valueElement = document.createElement("div");
                    valueElement.className = "value";
                    valueElement.textContent = "--";

                    card.appendChild(titleElement);
                    card.appendChild(valueElement);

                    return card;
                };

                // Display placeholder stats on error
                statsContainer.appendChild(createPlaceholderCard("Total Downloads"));
                statsContainer.appendChild(createPlaceholderCard("Total Size"));
                statsContainer.appendChild(createPlaceholderCard("Most Common Format"));
            });
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return "0 B";
            const k = 1024;
            const sizes = ["B", "KB", "MB", "GB"];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
        }

        function formatDuration(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            if (h > 0) return `${h}h ${m}m`;
            if (m > 0) return `${m}m ${s}s`;
            return `${s}s`;
        }

        function copyToClipboard(text) {
            const { clipboard } = require("electron");
            clipboard.writeText(text);
            showPopup(i18n.__("urlCopiedToClipboard"));
        }

        function openFile(filePath) {
            const result = ipcRenderer.invoke("show-file", filePath).then(result => {
                if (result.success === false) {
                    showPopup(i18n.__("fileDoesNotExist"), true)
                }
            })
        }

        function deleteHistoryItem(id) {
            if (confirm(i18n.__("confirmDeleteHistoryItem"))) {
                ipcRenderer.invoke("delete-history-item", id).then(() => {
                    loadHistory();
                    filterHistory();
                }).catch((error) => {
                    console.error("Failed to delete history item:", error);
                    showPopup(i18n.__("failedToDeleteHistoryItem"), true);
                });
            }
        }

        function exportHistoryJSON() {
            ipcRenderer.invoke("export-history-json").then((data) => {
                downloadFile(data, "download_history.json", "application/json");
            }).catch((error) => {
                console.error("Failed to export history as JSON:", error);
                showPopup("Failed to export history as JSON. Please try again.", true);
            });
        }

        function exportHistoryCSV() {
            ipcRenderer.invoke("export-history-csv").then((data) => {
                downloadFile(data, "download_history.csv", "text/csv");
            }).catch((error) => {
                console.error("Failed to export history as CSV:", error);
                showPopup("Failed to export history as CSV. Please try again.", true);
            });
        }

        function downloadFile(content, filename, type) {
            const element = document.createElement("a");
            element.setAttribute("href", "data:" + type + ";charset=utf-8," + encodeURIComponent(content));
            element.setAttribute("download", filename);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }

        function clearAllHistory() {
            if (
                confirm(
                    i18n.__("confirmClearAllHistory")
                )
            ) {
                ipcRenderer.invoke("clear-all-history").then(() => {
                    loadHistory();
                    filterHistory();
                }).catch((error) => {
                    console.error("Failed to clear history:", error);
                    showPopup("Failed to clear history. Please try again.", true);
                });
            }
        }

        function showPopup(text, isError = false) {
            let popupContainer = document.getElementById("popupContainer");

            if (!popupContainer) {
                popupContainer = document.createElement("div");
                popupContainer.id = "popupContainer";
                popupContainer.className = "popup-container";
                document.body.appendChild(popupContainer);
            }

            const popup = document.createElement("span");
            popup.textContent = text;
            popup.classList.add("popup-item");

            popup.style.background = isError ? "#ff6b6b" : "#54abde";

            if (isError) {
                popup.classList.add("popup-error");
            }

            popupContainer.appendChild(popup);

            setTimeout(() => {
                popup.style.opacity = "0";
                setTimeout(() => {
                    popup.remove();
                    if (popupContainer.childElementCount === 0) {
                        popupContainer.remove();
                    }
                }, 400);
            }, 2200);
        }
    </script>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: html/index.html]---
Location: ytDownloader-main/html/index.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <header></header>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YtDownloader</title>
    <link rel="stylesheet" href="../assets/css/index.css">

    <script src="../translations/i18n-init.js" defer></script>
    <script src="../src/renderer.js" defer></script>
    <script src="../src/index.js" defer></script>
    <script src="../src/common.js" defer></script>
</head>

<body>
    <div id="popupBox">
        <div id="popup">
            <p data-translate="downloadingNecessaryFilesWait">Please wait, necessary files are being downloaded</p>
            <svg id="popupSvg" version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100"
                enable-background="new 0 0 0 0" xml:space="preserve">
                <circle fill="rgb(84, 171, 222)" stroke="none" cx="6" cy="50" r="6">
                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1" />
                </circle>
                <circle fill="rgb(84, 171, 222)" stroke="none" cx="26" cy="50" r="6">
                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                </circle>
                <circle fill="rgb(84, 171, 222)" stroke="none" cx="46" cy="50" r="6">
                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3" />
                </circle>
            </svg>
            <p id="ytDlpDownloadProgress"></p>
        </div>
    </div>

    <div id="popupBoxMac">
        <div id="popupMac">
            <p id="popupMacTxt" data-translate="homebrewYtDlpWarning">You need to download yt-dlp from homebrew first
            </p>
            <div style="display: flex;">
                <a class="blueBtn" id="openHomebrew" target="_blank" href="https://formulae.brew.sh/formula/yt-dlp"
                    data-translate="openHomebrew">Open Homebrew</a>
                <button class="advancedToggle" id="quitAppBtn" data-translate="close">Close</button>
            </div>
        </div>
    </div>

    <!-- Menu icon -->
    <img src="../assets/images/menu.png" alt="menu" id="menuIcon">

    <!-- Menu -->
    <div id="menu" class="menu">
        <a id="playlistWin" class="menuItem" data-translate="downloadPlaylistButton">Download Playlist</a>
        <a id="preferenceWin" class="menuItem" data-translate="preferences">Preferences</a>
        <a id="compressorWin" class="menuItem" data-translate="compressor">Compressor</a>
        <a id="historyWin" class="menuItem" data-translate="downloadHistory">History</a>
        <a id="aboutWin" class="menuItem" data-translate="about">About</a>

        <div class="menuDivider"></div>

        <label for="themeToggle" id="themeTxt" class="menuLabel" data-translate="theme">Theme</label>
        <select name="themeToggle" id="themeToggle" class="themeSelect">
            <option id="lightTxt" value="light" data-translate="themeLight">Light</option>
            <option id="darkTxt" value="dark" data-translate="themeDark">Dark</option>
            <option id="frappeTxt" value="frappe" data-translate="themeFrappe">Frappé</option>
            <option id="onedarkTxt" value="onedark" data-translate="themeOneDark">One dark</option>
            <option id="matrixTxt" value="matrix" data-translate="themeMatrix">Matrix</option>
            <option id="githubTxt" value="github">Github</option>
            <option id="latteTxt" value="latte">Latte</option>
            <option id="solarizedDarkTxt" value="solarized-dark" data-translate="themeSolarizedDark">Solarized Dark
            </option>
        </select>
    </div>


    <button id="pasteUrl">
        <span id="pasteText" data-translate="pasteText">Click to paste video link from clipboard</span>
        <span class="paste-keys">
            <span class="key" id="pasteCtrlKey">Ctrl</span><span class="key">V</span>
        </span>
    </button>


    <div id="loadingWrapper">
        <span id="processing" data-translate="processing">Loading </span>
        <svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
            y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
            <circle fill="rgb(84, 171, 222)" stroke="none" cx="6" cy="50" r="6">
                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1" />
            </circle>
            <circle fill="rgb(84, 171, 222)" stroke="none" cx="26" cy="50" r="6">
                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
            </circle>
            <circle fill="rgb(84, 171, 222)" stroke="none" cx="46" cy="50" r="6">
                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3" />
            </circle>
        </svg>
    </div>
    <p id="incorrectMsg"></p>
    <button class="advancedToggle" id="errorBtn" onclick="toggleErrorDetails()" data-translate="errorDetails">Error
        Details ▼</button>
    <div id="errorDetails"></div>
    <br>

    <div id="hidden">
        <img src="../assets/images/close.png" alt="close" id="closeHidden">
        <div id="btnContainer">
            <button class="toggleBtn" id="videoToggle" data-translate="video">Video</button>
            <button class="toggleBtn" id="audioToggle" data-translate="audio">Audio</button>
        </div>
        <p id="title" data-translate="title">Title </p>

        <div class="videoAudioContainer">
            <!-- Video tab -->
            <div id="videoList">
                <div class="separationBox">
                    <h2 id="videoHeader" data-translate="video">Video</h2>
                    <label class="formatSelect" data-translate="selectFormat">Select Format </label>
                    <select id="videoFormatSelect" class="select">
                    </select>
                    <br>
                    <input type="hidden" name="url" class="url" id="url">

                    <!-- Audio options for video -->
                    <div id="audioForVideo">
                        <h2 id="audioHeader" data-translate="audio">Audio</h2>
                        <label class="formatSelect" data-translate="selectAudioFormat">Select Audio Format </label>
                        <select id="audioForVideoFormatSelect" class="select">
                        </select>
                        <br>
                        <input type="hidden" name="url" class="url">
                    </div>
                    <br>
                </div>

                <br>
                <button class="submitBtn" id="videoDownload" data-translate="download">Download</button>
                <button id="advancedVideoToggle" class="blueBtn" onClick="advancedToggle()"
                    data-translate="moreOptions">More options</button>
            </div>

            <!-- Audio tab -->
            <div id="audioList">
                <div id="audioPresent">
                    <label class="formatSelect" data-translate="selectFormat">Select Format </label>
                    <select id="audioFormatSelect" class="select">
                    </select>
                    <br>
                    <input type="hidden" name="url" class="url">
                    <button class="submitBtn" id="audioDownload" data-translate="download">Download</button>
                    <button id="advancedAudioToggle" class="blueBtn" onClick="advancedToggle()"
                        data-translate="moreOptions">More options</button>
                </div>
            </div>
        </div>

        <div id="advanced">
            <div class="advancedItem">
                <p id="customArgsHeader" data-translate="customArgsTxt">Custom yt-dlp arguments</p>
                <textarea id="customArgsInput" placeholder="--sponsorblock-remove all"></textarea>
            </div>
            <div class="advancedItem">
                <span id="quitTxt" data-translate="closeAppOnFinish">Close app when download finishes</span>
                <input type="checkbox" id="quitChecked" class="cb">
            </div>

            <div class="advancedItem">
                <strong id="rangeText" data-translate="downloadTimeRange">Download particular time-range</strong>
                <br><br>
                <div class="slider-wrapper">
                    <input type="text" id="min-time" class="time-display" value="0:00:00">
                    <div class="slider-container">
                        <div class="track-background"></div>
                        <div id="range-highlight"></div>
                        <input type="range" id="min-slider" min="0" max="0" value="0">
                        <input type="range" id="max-slider" min="0" max="0" value="0">
                    </div>
                    <input type="text" id="max-time" class="time-display" value="0:00:00">
                </div>
            </div>

            <div class="advancedItem">
                <div><span id="clText" data-translate="currentDownloadLocation">Current download location - </span><span
                        id="path"></span></div>
                <br>
                <button id="selectLocation" class="submitBtn" data-translate="selectDownloadLocation">Select Download
                    Location</button>
            </div>

            <div class="advancedItem">
                <p id="subHeader" data-translate="subtitles">Subtitles</p>
                <span id="subTxt" data-translate="downloadSubtitlesAvailable">Download subtitles if available</span>
                <input id="subChecked" class="cb" type="checkbox">
            </div>
        </div>

        <!-- Extraction options start -->
        <div id="audioExtract">
            <h2 id="extractHeader" data-translate="extractAudio">Extract Audio</h2>
            <div>
                <div>
                    <label class="formatSelect" data-translate="selectFormat">Select Format </label>
                    <select id="extractSelection" class="select audioSelect">
                        <option value="mp3">Mp3</option>
                        <option value="m4a">M4a</option>
                        <option value="opus">Opus</option>
                        <option value="wav">Wav</option>
                        <option value="alac">Alac</option>
                        <option value="flac">Flac</option>
                    </select>
                </div>

                <div>
                    <label class="extractQualitySelect" id="extractQualitySelectTxt"
                        data-translate="selectQuality">Select
                        Quality</label>
                    <select id="extractQualitySelect" class="select audioSelect">
                        <option id="extractQualityNormal" value="5" data-translate="qualityNormal">Normal</option>
                        <option id="extractQualityBest" value="0" data-translate="best">Best</option>
                        <option id="extractQualityGood" value="2" data-translate="qualityGood">Good</option>
                        <option id="extractQualityBad" value="8" data-translate="qualityBad">Bad</option>
                        <option id="extractQualityWorst" value="10" data-translate="qualityWorst">Worst</option>
                    </select>
                </div>
            </div>

            <br>
            <button id="extractBtn" data-translate="extract">Extract</button>
        </div>
        <!-- Extraction options end -->
    </div>

    <!-- Downloads list -->
    <div id="list"></div>

    <button class="blueBtn" id="clearBtn" data-translate="clearDownloads">Clear Downloads</button>

    <div id="goToTop"></div>

    <script>
        const os = require("os")

        if (os.platform() === "darwin") {
            document.getElementById("pasteCtrlKey").textContent = "⌘";
        }
    </script>

    <div id="popupContainer" class="popup-container"></div>

    <div id="updatePopup">
        <span class="update-label" data-translate="downloadingUpdate">Downloading update</span>

        <div class="progress-track">
            <div id="progressBarFill"></div>
        </div>

        <span id="updateProgress">0.0%</span>
    </div>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: html/playlist.html]---
Location: ytDownloader-main/html/playlist.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-translate="downloadPlaylistButton">Playlist download</title>
    <link rel="stylesheet" href="../assets/css/index.css">

    <script src="../translations/i18n-init.js" defer></script>
    <script src="../src/playlist.js" defer></script>
    <script src="../src/common.js" defer></script>

    <style>
        #playlistName {
            padding: 30px;
        }

        #pasteLink {
            margin-top: 15px;
            font-weight: bold;
        }

        #openDownloads {
            display: none;
            position: relative;
            bottom: 8px;
        }

        #audioBox {
            display: none;
        }

        #advancedMenu {
            display: none;
        }
    </style>
</head>

<body>
    <!-- Menu icon -->
    <img src="../assets/images/menu.png" alt="menu" id="menuIcon">

    <!-- Menu -->
    <div id="menu" class="menu">
        <a id="homeWin" class="menuItem" data-translate="homepage">Homepage</a>
        <a id="preferenceWin" class="menuItem" data-translate="preferences">Preferences</a>
        <a id="compressorWin" class="menuItem" data-translate="compressor">Compressor</a>
        <a id="historyWin" class="menuItem" data-translate="downloadHistory">History</a>
        <a id="aboutWin" class="menuItem" data-translate="about">About</a>

        <div class="menuDivider"></div>

        <label for="themeToggle" id="themeTxt" class="menuLabel" data-translate="theme">Theme</label>
        <select name="themeToggle" id="themeToggle" class="themeSelect">
            <option id="lightTxt" value="light" data-translate="themeLight">Light</option>
            <option id="darkTxt" value="dark" data-translate="themeDark">Dark</option>
            <option id="frappeTxt" value="frappe" data-translate="themeFrappe">Frappé</option>
            <option id="onedarkTxt" value="onedark" data-translate="themeOneDark">One dark</option>
            <option id="matrixTxt" value="matrix" data-translate="themeMatrix">Matrix</option>
            <option id="githubTxt" value="github">Github</option>
            <option id="latteTxt" value="latte">Latte</option>
            <option id="solarizedDarkTxt" value="solarized-dark" data-translate="themeSolarizedDark">Solarized Dark
            </option>
        </select>
    </div>

    <button id="pasteLink">
        <span id="pasteText" data-translate="pastePlaylistLinkTooltip">Click to paste playlist link from
            clipboard</span>
        <span class="paste-keys">
            <span class="key" id="pasteCtrlKey">Ctrl</span><span class="key">V</span>
        </span>
    </button>

    <div id="options">
        <img src="../assets/images/close.png" alt="close" id="closeHidden">
        <div id="btnContainer">
            <button class="toggleBtn" id="videoToggle" data-translate="video">Video</button>
            <button class="toggleBtn" id="audioToggle" data-translate="audio">Audio</button>
        </div>
        <br>
        <strong id="linkTitle" data-translate="link">Link:</strong>
        <span id="link"></span>
        <br><br>
        <div id="videoBox">
            <label id="videoFormat" data-translate="videoQuality">Select Video Quality </label>
            <select id="select" class="select">
                <option value="best" id="bestVideoOption" data-translate="best">Best</option>
                <option value="worst" id="worstVideoOption" data-translate="qualityWorst">Worst</option>
                <option value="useConfig" id="useConfigTxt" data-translate="useConfigFileCheckbox">Use config file
                </option>
                <option value="144">144p</option>
                <option value="240">240p</option>
                <option value="360">360p</option>
                <option value="480">480p</option>
                <option value="720">720p (HD)</option>
                <option value="1080">1080p (FHD)</option>
                <option value="1440">1440p</option>
                <option value="2160">2160p (4k)</option>
            </select>
            <br>
            <div id="typeSelectBox">
                <label id="videoQualityTxt" data-translate="selectVideoFormat">Select video quality</label>
                <select id="videoTypeSelect" class="select">
                    <option value="auto" id="autoTxt" data-translate="auto">Auto</option>
                    <option value="mp4">Mp4</option>
                    <option value="webm">WebM</option>
                </select>
            </div>
            <br>
            <button class="submitBtn" id="download" data-translate="download">Download</button>
            <br><br>
        </div>

        <div id="audioBox">

            <label id="audioFormat" data-translate="selectAudioFormat">Select Audio format </label>
            <select id="audioSelect" class="select">
                <option value="mp3">Mp3</option>
                <option value="m4a">M4a</option>
                <option value="opus">Opus</option>
                <option value="wav">Wav</option>
                <option value="alac">Alac</option>
                <option value="flac">Flac</option>
            </select>
            <br>

            <label class="audioQualitySelect" id="audioQualitySelectTxt" data-translate="selectQuality">Select
                Quality</label>
            <select id="audioQualitySelect" class="select">
                <option id="audioQualityAuto" value="auto" data-translate="auto">Auto</option>
                <option id="audioQualityNormal" value="5" data-translate="qualityNormal">Normal</option>
                <option id="audioQualityBest" value="0" data-translate="best">Best</option>
                <option id="audioQualityGood" value="2" data-translate="qualityGood">Good</option>
                <option id="audioQualityBad" value="8" data-translate="qualityBad">Bad</option>
                <option id="audioQualityWorst" value="10" data-translate="qualityWorst">Worst</option>
            </select>
            <br><br>

            <button class="submitBtn" id="audioDownload" data-translate="download">Download</button>
            <br><br>

        </div>

        <br>
        <button id="advancedToggle" class="blueBtn" data-translate="moreOptions">More options</button>
        <br>

        <!-- Hidden -->
        <div id="advancedMenu">
            <div class="advancedItem">
                <span id="rangeTxt" data-translate="playlistRange">Playlist range</span>
                <input type="number" id="playlistIndex" class="input" data-translate-placeholder="start" placeholder="Start">:
                <input type="number" id="playlistEnd" data-translate-placeholder="end" class="input" placeholder="End">
                <br><br>
            </div>

            <div class="advancedItem">
                <div><span id="clText" data-translate="currentDownloadLocation">Current download location - </span><span
                        id="path"></span></div>
                <br>
                <button id="selectLocation" class="submitBtn" data-translate="selectDownloadLocation">Select Download
                    Location</button>
            </div>

            <div class="advancedItem">
                <p id="subHeader" data-translate="subtitles">Subtitles</p>
                <span id="subTxt" data-translate="downloadSubtitlesAvailable">Download subtitles if available</span>
                <input id="subChecked" class="cb" type="checkbox">
            </div>
            <br>

            <button class="submitBtn" id="downloadThumbnails" data-translate="downloadThumbnails">Download
                thumbnails</button>
            <button class="submitBtn" id="saveLinks" data-translate="saveVideoLinksToFile">Save video links</button>
        </div>

        <p id="incorrectMsgPlaylist"></p>
        <!-- Error button -->
        <button class="advancedToggle" id="errorBtn" onclick="toggleErrorDetails()" data-translate="errorDetails">Error
            Details ▼</button>
        <div id="errorDetails"></div>

    </div>

    <h2 id="playlistName"></h2>
    <button class="submitBtn" id="openDownloads" data-translate="openDownloadFolder">Open download folder</button>
    <div id="list">
    </div>

    <div id="goToTop"></div>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: html/playlist_new.html]---
Location: ytDownloader-main/html/playlist_new.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playlist download</title>
    <link rel="stylesheet" href="../assets/css/index.css">
    <script src="../src/playlist_new.js" defer></script>
    <script src="../src/common.js" defer></script>
    <!-- Translating -->
    <script>window.i18n = new (require('../translations/i18n'));</script>
    <style>
        .playlistCheck {
            position: absolute;
            bottom: 8px;
            right: 8px;
            width: 25px;
            height: 25px;
        }
    </style>
</head>

<body>
    <!-- Popup message -->
    <span id="popupText">Text copied</span>

    <!-- Menu icon -->
    <img src="../assets/images/menu.png" alt="menu" id="menuIcon">

    <!-- Menu -->
    <div id="menu">
        <a id="homeWin" class="menuItem">Homepage</a>
        <a id="preferenceWin" class="menuItem">Preferences</a>
        <a id="historyWin" class="menuItem">History</a>
        <a id="aboutWin" class="menuItem">About</a>
        <span id="themeTxt" class="menuItem">Theme:</span>
        <select name="themeToggle" id="themeToggle">
            <option id="lightTxt" value="light">Light</option>
            <option id="darkTxt" value="dark">Dark</option>
            <option id="frappeTxt" value="frappe">Frappé</option>
            <option id="onedarkTxt" value="onedark">One dark</option>
            <option id="matrixTxt" value="matrix">Matrix</option>
            <option id="githubTxt" value="github">Github</option>
            <option id="latteTxt" value="latte">Latte</option>
            <option id="solarizedDarkTxt" value="solarized-dark">Solarized Dark</option>
        </select>
    </div>

    <button class="submitBtn" id="pasteLink">Click to paste playlist link from clipboard [Ctrl + V]</button>

    <div id="loadingWrapper">
        <span id="processing">Loading </span>
        <svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
            y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
            <circle fill="rgb(84, 171, 222)" stroke="none" cx="6" cy="50" r="6">
                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1" />
            </circle>
            <circle fill="rgb(84, 171, 222)" stroke="none" cx="26" cy="50" r="6">
                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
            </circle>
            <circle fill="rgb(84, 171, 222)" stroke="none" cx="46" cy="50" r="6">
                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3" />
            </circle>
        </svg>
    </div>

    <p id="incorrectMsg"></p>
    <button class="advancedToggle" id="errorBtn" onclick="toggleErrorDetails()">Error Details ▼</button>
    <div id="errorDetails" onclick="copyErrorToClipboard()"></div>
    <div id="data">
    </div>
    <div id="goToTop"></div>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: html/preferences.html]---
Location: ytDownloader-main/html/preferences.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="title" data-translate="preferences">Preferences</title>
    <link rel="stylesheet" href="../assets/css/extra.css">

    <script src="../translations/i18n-init.js" defer></script>
    <script src="../src/preferences.js" defer></script>
</head>

<body>
    <div id="top">
        <a id="restart" data-translate="restartApp">Restart app</a>
        <a id="back" data-translate="homepage">Homepage</a>
    </div>

    <h1 id="preferences" data-translate="preferences">Preferences</h1>
    <br><br>

    <div class="prefBox" style="border: none;">
        <strong id="dlText" data-translate="downloadLocation">Download location</strong>
    </div>

    <div class="prefBox">
        <span id="clText" data-translate="currentDownloadLocation">Current download location - </span><span
            id="path"></span>
    </div>

    <button id="selectLocation" class="greenBtn" data-translate="selectDownloadLocation">Select Download
        Location</button>

    <p id="msg">
    </p>

    <!-- Language -->
    <div class="prefBox">
        <label id="selectLn" data-translate="selectLanguageRelaunch">Select Language (Requires reload)</label>
        <select id="select" onchange="changeLanguage()">
            <option value="en">English</option>
            <option value="de-DE">Deutsch</option>
            <option value="es-ES">Español</option>
            <option value="fa-IR">فارسی</option>
            <option value="el-GR">Ελληνικά</option>
            <option value="fr-FR">Français</option>
            <option value="it-IT">Italiano</option>
            <option value="ja-JP">Japanese</option>
            <option value="hu-HU">Magyar</option>
            <option value="pl-PL">Polski</option>
            <option value="pt-BR">Português</option>
            <option value="ru-RU">Русский</option>
            <option value="fi-FI">Finnish</option>
            <option value="uk-UA">Українська</option>
            <option value="tr-TR">Türkçe</option>
            <option value="vi-VN">Vietnamese</option>
            <option value="ar-SA">اَلْعَرَبِيَّةُ</option>
            <option value="zh-CN">简体中文</option>
            <option value="zh-TW">繁體中文</option>
            <option value="bn-BD">বাংলা</option>
            <option value="hi-IN">हिन्दी</option>
            <option value="ne-NP">नेपाली</option>
        </select>
    </div>

    <!-- Video Quality -->
    <div class="prefBox">
        <span id="preferredVideoTxt" data-translate="preferredVideoQuality">Preferred video quality</span>
        <select id="preferredVideoQuality">
            <option value="144">144p</option>
            <option value="240">240p</option>
            <option value="360">360p</option>
            <option value="480">480p</option>
            <option value="720">720p (HD)</option>
            <option value="1080">1080p (FHD)</option>
            <option value="1440">1440p</option>
            <option value="2160">2160p (4k)</option>
        </select>

    </div>

    <!-- Video Codec -->
    <div class="prefBox">
        <span id="preferredVideoCodecTxt" data-translate="preferredVideoCodec">Preferred video codec</span>
        <select id="preferredVideoCodec">
            <option value="avc1">AVC1</option>
            <option value="av01">AV1</option>
            <option value="vp9">VP9</option>
            <option value="mp4v">MP4V</option>
        </select>

    </div>

    <!-- Audio format -->
    <div class="prefBox">
        <span id="preferredAudioTxt" data-translate="preferredAudioFormat">Preferred audio format</span>
        <select id="preferredAudioQuality">
            <option value="mp3">Mp3</option>
            <option value="aac">Aac</option>
            <option value="m4a">M4a</option>
            <option value="opus">Opus</option>
            <option value="wav">Wav</option>
            <option value="alac">Alac</option>
            <option value="flac">Flac</option>
        </select>

    </div>

    <p id="flatpakTxt" data-translate="flatsealPermissionWarning"></p>
    <div class="prefBox">
        <div>
            <span id="browserTxt" data-translate="selectBrowserForCookies">Select browser to use cookies from</span>
            <span id="browserInfo" data-translate-title="cookiesWarning"> &#9432;</span>
        </div>
        <select id="browser">
            <option value="" id="none" data-translate="none">None</option>
            <option value="chrome">Chrome</option>
            <option value="firefox">Firefox</option>
            <option value="brave">Brave</option>
            <option value="opera">Opera Mini</option>
            <option value="edge">Edge</option>
            <option value="chromium">Chromium</option>
            <option value="safari">Safari</option>
            <option value="vivaldi">Vivaldi</option>
        </select>
    </div>

    <div class="prefBox">
        <span id="proxyTitle" data-translate="proxy">Proxy</span>
        <input type="text" id="proxyTxt" placeholder="http://localhost:8080"
            pattern="^(http:\/\/|https:\/\/|socks5:\/\/)?[a-zA-Z0-9.]+:[\d]+$">
    </div>

    <div id="ytDlpArgBox">
        <p>
            <span data-translate="customArgsTxt">Set custom yt-dlp arguments.</span>
            <a data-translate="learnMore" id="learnMoreLink">Learn more</a>
        </p>
        <textarea spellcheck="false" id="customArgsInput" placeholder="--sponsorblock-remove all"></textarea>
    </div>

    <div id="pathConfig">

        <div class="configBox">
            <span id="configTxt" data-translate="useConfigFile">Use configuration file</span>
            <input type="checkbox" class="cb" id="configCheck">
        </div>

        <div id="configOpts">
            <br>
            <button class="greenBtn" id="configBtn" data-translate="selectConfigFile">Select config file</button>
            <br>
            <strong id="configPathTxt" data-translate="path">Path:</strong>
            <span id="configPath"></span>
        </div>
    </div>

    <div class="prefBox">
        <span id="showMoreFormatsTxt" data-translate="showMoreFormatOptions">Show more format options</span>
        <input type="checkbox" class="cb" id="showMoreFormats">
    </div>

    <div class="prefBox">
        <span id="fileFormatTxt" data-translate="playlistFilenameFormat">Filename format for playlists</span>
        <input type="text" id="filenameFormat" placeholder="yt-dlp format style"
            value="%(playlist_index)s.%(title)s.%(ext)s">
        <button class="redBtn" id="resetFilenameFormat" data-translate="resetToDefault">Reset to default</button>
    </div>

    <div class="prefBox">
        <span id="dirFormatTxt" data-translate="playlistFolderNameFormat">Folder name format for playlists</span>
        <input type="text" id="foldernameFormat" value="%(playlist_title)s" placeholder="yt-dlp format style">
        <button class="redBtn" id="resetFoldernameFormat" data-translate="resetToDefault">Reset to default</button>
    </div>


    <div class="prefBox">
        <span id="maxTxt" data-translate="maxActiveDownloads">Maximum number of active downloads</span>
        <input type="number" min="1" class="input" id="maxDownloads" value="5">
    </div>


    <div class="prefBox">
        <span id="trayTxt" data-translate="closeAppToTray">Close to system tray</span>
        <input type="checkbox" class="cb" id="closeToTray">
    </div>

    <div class="prefBox" id="autoUpdatesBox">
        <span id="autoUpdateTxt" data-translate="disableAutoUpdates">Disable auto updates</span>
        <input type="checkbox" class="cb" id="autoUpdateDisabled">
    </div>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: src/common.js]---
Location: ytDownloader-main/src/common.js

```javascript
const electron = require("electron");
/**
 *
 * @param {string} id
 * @returns {any}
 */
function getId(id) {
	return document.getElementById(id);
}

getId("menuIcon").addEventListener("click", () => {
	const menuDisplay = getId("menu").style.display;
	if (menuDisplay != "none" && menuDisplay != "") {
		getId("menuIcon").style.transform = "rotate(0deg)";
		let count = 0;
		let opacity = 1;
		const fade = setInterval(() => {
			if (count >= 10) {
				getId("menu").style.display = "none";
				clearInterval(fade);
			} else {
				opacity -= 0.1;
				getId("menu").style.opacity = opacity.toFixed(3).toString();
				count++;
			}
		}, 50);
	} else {
		getId("menuIcon").style.transform = "rotate(90deg)";

		setTimeout(() => {
			getId("menu").style.display = "flex";
			getId("menu").style.opacity = "1";
		}, 150);
	}
});

getId("themeToggle").addEventListener("change", () => {
	localStorage.setItem("theme", getId("themeToggle").value);

	const x = window.innerWidth;
	const y = 0;
	const maxRadius = Math.hypot(window.innerWidth, window.innerHeight);

	const transition = document.startViewTransition(() => {
		document.documentElement.setAttribute("theme", getId("themeToggle").value);
	});

	transition.ready.then(() => {
	  document.documentElement.animate(
		{
		  clipPath: [
			`circle(0px at ${x}px ${y}px)`,
			`circle(${maxRadius}px at ${x}px ${y}px)`
		  ]
		},
		{
		  duration: 1100,
		  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
		  pseudoElement: '::view-transition-new(root)'
		}
	  );
	});
});

const storageTheme = localStorage.getItem("theme");
if (storageTheme) {
	document.documentElement.setAttribute("theme", storageTheme);
	getId("themeToggle").value = storageTheme;
} else {
	getId("themeToggle").value = "frappe";
	document.documentElement.setAttribute("theme", "frappe");
}

////
let advancedHidden = true;

function advancedToggle() {
	if (advancedHidden) {
		getId("advanced").style.display = "block";
		advancedHidden = false;
	} else {
		getId("advanced").style.display = "none";
		advancedHidden = true;
	}
}

// Check scroll go to top

window.onscroll = function () {
	scrollFunction();
};

function scrollFunction() {
	if (
		document.body.scrollTop > 50 ||
		document.documentElement.scrollTop > 50
	) {
		getId("goToTop").style.display = "block";
	} else {
		getId("goToTop").style.display = "none";
	}
}

// Function to scroll go to top

getId("goToTop").addEventListener("click", () => {
	window.scrollTo({top: 0, behavior: "smooth"});
});

// Showing and hiding error details
function toggleErrorDetails() {
	const status = getId("errorDetails").style.display;
	if (status === "none") {
		getId("errorDetails").style.display = "block";
		// @ts-ignore
		getId("errorBtn").textContent = i18n.__("errorDetails") + " ▲";
	} else {
		getId("errorDetails").style.display = "none";
		// @ts-ignore
		getId("errorBtn").textContent = i18n.__("errorDetails") + " ▼";
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/compressor.js]---
Location: ytDownloader-main/src/compressor.js

```javascript
const {exec, execSync} = require("child_process");
const path = require("path");
const {ipcRenderer, shell} = require("electron");
const os = require("os");
const si = require("systeminformation");
const {existsSync} = require("fs");

document.addEventListener("translations-loaded", () => {
	window.i18n.translatePage();
});

let menuIsOpen = false;

getId("menuIcon").addEventListener("click", () => {
	if (menuIsOpen) {
		getId("menuIcon").style.transform = "rotate(0deg)";
		menuIsOpen = false;
		let count = 0;
		let opacity = 1;
		const fade = setInterval(() => {
			if (count >= 10) {
				getId("menu").style.display = "none";
				clearInterval(fade);
			} else {
				opacity -= 0.1;
				getId("menu").style.opacity = opacity.toFixed(3).toString();
				count++;
			}
		}, 50);
	} else {
		getId("menuIcon").style.transform = "rotate(90deg)";
		menuIsOpen = true;

		setTimeout(() => {
			getId("menu").style.display = "flex";
			getId("menu").style.opacity = "1";
		}, 150);
	}
});

const ffmpeg = `"${getFfmpegPath()}"`;

console.log(ffmpeg);

const vaapi_device = "/dev/dri/renderD128";

// Checking GPU
si.graphics().then((info) => {
	console.log({gpuInfo: info});
	const gpuDevices = info.controllers;

	gpuDevices.forEach((gpu) => {
		// NVIDIA
		const gpuName = gpu.vendor.toLowerCase();
		const gpuModel = gpu.model.toLowerCase();

		if (gpuName.includes("nvidia") || gpuModel.includes("nvidia")) {
			document.querySelectorAll(".nvidia_opt").forEach((opt) => {
				opt.style.display = "block";
			});
		} else if (
			gpuName.includes("advanced micro devices") ||
			gpuModel.includes("amd")
		) {
			if (os.platform() == "win32") {
				document.querySelectorAll(".amf_opt").forEach((opt) => {
					opt.style.display = "block";
				});
			} else {
				document.querySelectorAll(".vaapi_opt").forEach((opt) => {
					opt.style.display = "block";
				});
			}
		} else if (gpuName.includes("intel")) {
			if (os.platform() == "win32") {
				document.querySelectorAll(".qsv_opt").forEach((opt) => {
					opt.style.display = "block";
				});
			} else if (os.platform() != "darwin") {
				document.querySelectorAll(".vaapi_opt").forEach((opt) => {
					opt.style.display = "block";
				});
			}
		} else {
			if (os.platform() == "darwin") {
				document
					.querySelectorAll(".videotoolbox_opt")
					.forEach((opt) => {
						opt.style.display = "block";
					});
			}
		}
	});
});

/** @type {File[]} */
let files = [];
let activeProcesses = new Set();
let currentItemId = "";
let isCancelled = false;

/**
 * @param {string} id
 */
function getId(id) {
	return document.getElementById(id);
}

// File Handling
const dropZone = document.querySelector(".drop-zone");
const fileInput = getId("fileInput");
const selectedFilesDiv = getId("selected-files");

dropZone.addEventListener("dragover", (e) => {
	e.preventDefault();
	dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
	dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
	e.preventDefault();
	dropZone.classList.remove("dragover");
	// @ts-ignore
	console.log(e.dataTransfer);
	files = Array.from(e.dataTransfer.files);
	updateSelectedFiles();
});

fileInput.addEventListener("change", (e) => {
	// @ts-ignore
	files = Array.from(e.target.files);
	updateSelectedFiles();
});

getId("custom-folder-select").addEventListener("click", (e) => {
	ipcRenderer.send("get-directory", "");
});

function updateSelectedFiles() {
	const fileList = files
		.map((f) => `${f.name} (${formatBytes(f.size)})<br/>`)
		.join("\n");
	selectedFilesDiv.innerHTML = fileList || "No files selected";
}

// Compression Logic
getId("compress-btn").addEventListener("click", startCompression);
getId("cancel-btn").addEventListener("click", cancelCompression);

async function startCompression() {
	if (files.length === 0) return alert("Please select files first!");

	const settings = getEncoderSettings();

	for (const file of files) {
		const itemId =
			"f" + Math.random().toFixed(10).toString().slice(2).toString();
		currentItemId = itemId;

		const outputPath = generateOutputPath(file, settings);

		try {
			await compressVideo(file, settings, itemId, outputPath);

			if (isCancelled) {
				isCancelled = false;
			} else {
				updateProgress("success", "", itemId);
				const fileSavedElement = document.createElement("b");
				fileSavedElement.textContent = i18n.__("fileSavedClickToOpen");
				fileSavedElement.onclick = () => {
					ipcRenderer.send("show-file", outputPath);
				};
				getId(itemId + "_prog").appendChild(fileSavedElement);
				currentItemId = "";
			}
		} catch (error) {
			const errorElement = document.createElement("div");
			errorElement.onclick = () => {
				ipcRenderer.send("error_dialog", error.message);
			};
			errorElement.textContent = i18n.__("errorClickForDetails");
			updateProgress("error", "", itemId);
			getId(itemId + "_prog").appendChild(errorElement);
			currentItemId = "";
		}
	}
}

function cancelCompression() {
	activeProcesses.forEach((child) => {
		child.stdin.write("q");
		isCancelled = true;
	});
	activeProcesses.clear();
	updateProgress("error", "Cancelled", currentItemId);
}

/**
 * @param {File} file
 */
function generateOutputPath(file, settings) {
	console.log({settings});
	const output_extension = settings.extension;
	const parsed_file = path.parse(file.path);

	let outputDir = settings.outputPath || parsed_file.dir;

	if (output_extension == "unchanged") {
		return path.join(
			outputDir,
			`${parsed_file.name}${settings.outputSuffix}${parsed_file.ext}`
		);
	}

	return path.join(
		outputDir,
		`${parsed_file.name}_compressed.${output_extension}`
	);
}

/**
 * @param {File} file
 * @param {{ encoder: any; speed: any; videoQuality: any; audioQuality?: any; audioFormat: string, extension: string }} settings
 * @param {string} itemId
 * @param {string} outputPath
 */
async function compressVideo(file, settings, itemId, outputPath) {
	const command = buildFFmpegCommand(file, settings, outputPath);

	console.log("Command: " + command);

	return new Promise((resolve, reject) => {
		const child = exec(command, (error) => {
			if (error) reject(error);
			else resolve();
		});

		activeProcesses.add(child);
		child.on("exit", (_code) => {
			activeProcesses.delete(child);
		});

		let video_info = {
			duration: "",
			bitrate: "",
		};

		createProgressItem(
			path.basename(file.path),
			"progress",
			`Starting...`,
			itemId
		);

		child.stderr.on("data", (data) => {
			// console.log(data)
			const duration_match = data.match(/Duration:\s*([\d:.]+)/);
			if (duration_match) {
				video_info.duration = duration_match[1];
			}

			// const bitrate_match = data.match(/bitrate:\s*([\d:.]+)/);
			// if (bitrate_match) {
			// 	// Bitrate in kb/s
			// 	video_info.bitrate = bitrate_match[1];
			// }

			const progressTime = data.match(/time=(\d+:\d+:\d+\.\d+)/);

			const totalSeconds = timeToSeconds(video_info.duration);

			const currentSeconds =
				progressTime && progressTime.length > 1
					? timeToSeconds(progressTime[1])
					: null;

			if (currentSeconds && !isCancelled) {
				const progress = Math.round(
					(currentSeconds / totalSeconds) * 100
				);

				getId(
					itemId + "_prog"
				).innerHTML = `<progress class="progressBarCompress" min=0 max=100 value=${progress}>`;
			}
		});
	});
}

/**
 * @param {File} file
 * @param {{ encoder: string; speed: string; videoQuality: string; audioQuality: string; audioFormat: string }} settings
 * @param {string} outputPath
 */
function buildFFmpegCommand(file, settings, outputPath) {
	const inputPath = file.path;

	console.log("Output path: " + outputPath);

	const args = ["-hide_banner", "-y", "-stats", "-i", `"${inputPath}"`];

	switch (settings.encoder) {
		case "copy":
			args.push("-c:v", "copy");
			break;
		case "x264":
			args.push(
				"-c:v",
				"libx264",
				"-preset",
				settings.speed,
				"-vf",
				"format=yuv420p",
				"-crf",
				parseInt(settings.videoQuality).toString()
			);
			break;
		case "x265":
			args.push(
				"-c:v",
				"libx265",
				"-vf",
				"format=yuv420p",
				"-preset",
				settings.speed,
				"-crf",
				parseInt(settings.videoQuality).toString()
			);
			break;
		// Intel windows
		case "qsv":
			args.push(
				"-c:v",
				"h264_qsv",
				"-vf",
				"format=yuv420p",
				"-preset",
				settings.speed,
				"-global_quality",
				parseInt(settings.videoQuality).toString()
			);
			break;
		// Linux amd and intel
		case "vaapi":
			args.push(
				"-vaapi_device",
				vaapi_device,
				"-vf",
				"format=nv12,hwupload",
				"-c:v",
				"h264_vaapi",
				"-qp",
				parseInt(settings.videoQuality).toString()
			);
			break;
		case "hevc_vaapi":
			args.push(
				"-vaapi_device",
				vaapi_device,
				"-vf",
				"format=nv12,hwupload",
				"-c:v",
				"hevc_vaapi",
				"-qp",
				parseInt(settings.videoQuality).toString()
			);
			break;
		// Nvidia windows and linux
		case "nvenc":
			args.push(
				"-c:v",
				"h264_nvenc",
				"-vf",
				"format=yuv420p",
				"-preset",
				getNvencPreset(settings.speed),
				"-rc",
				"vbr",
				"-cq",
				parseInt(settings.videoQuality).toString()
			);
			break;
		// Amd windows
		case "hevc_amf":
			let amf_hevc_quality = "balanced";

			if (settings.speed == "slow") {
				amf_hevc_quality = "quality";
			} else if (settings.speed == "fast") {
				amf_hevc_quality = "speed";
			}

			args.push(
				"-c:v",
				"hevc_amf",
				"-vf",
				"format=yuv420p",
				"-quality",
				amf_hevc_quality,
				"-rc",
				"cqp",
				"-qp_i",
				parseInt(settings.videoQuality).toString(),
				"-qp_p",
				parseInt(settings.videoQuality).toString()
			);
			break;
		case "amf":
			let amf_quality = "balanced";

			if (settings.speed == "slow") {
				amf_quality = "quality";
			} else if (settings.speed == "fast") {
				amf_quality = "speed";
			}

			args.push(
				"-c:v",
				"h264_amf",
				"-vf",
				"format=yuv420p",
				"-quality",
				amf_quality,
				"-rc",
				"cqp",
				"-qp_i",
				parseInt(settings.videoQuality).toString(),
				"-qp_p",
				parseInt(settings.videoQuality).toString(),
				"-qp_b",
				parseInt(settings.videoQuality).toString()
			);
			break;
		case "videotoolbox":
			args.push(
				"-c:v",
				"-vf",
				"format=yuv420p",
				"h264_videotoolbox",
				"-q:v",
				parseInt(settings.videoQuality).toString()
			);
			break;
	}

	// args.push("-vf", "scale=trunc(iw*1/2)*2:trunc(ih*1/2)*2,format=yuv420p");

	args.push("-c:a", settings.audioFormat, `"${outputPath}"`);

	return `${ffmpeg} ${args.join(" ")}`;
}

/**
 *
 * @returns {{ encoder: string; speed: string; videoQuality: string; audioQuality?: string; audioFormat: string, extension: string, outputPath:string }} settings
 */
function getEncoderSettings() {
	return {
		// @ts-ignore
		encoder: getId("encoder").value,
		// @ts-ignore
		speed: getId("compression-speed").value,
		// @ts-ignore
		videoQuality: getId("video-quality").value,
		// @ts-ignore
		audioFormat: getId("audio-format").value,
		// @ts-ignore
		extension: getId("file_extension").value,
		outputPath: getId("custom-folder-path").textContent,
		// @ts-ignore
		outputSuffix: getId("output-suffix").value,
	};
}

/**
 * @param {string | number} speed
 */
function getNvencPreset(speed) {
	const presets = {fast: "p3", medium: "p4", slow: "p5"};
	return presets[speed] || "p4";
}

/**
 * @param {string} status
 * @param {string} data
 * @param {string} itemId
 */
function updateProgress(status, data, itemId) {
	if (status == "success" || status == "error") {
		const item = getId("itemId");

		if (item) {
			getId(itemId).classList.remove("progress");
			getId(itemId).classList.add(status);
		}
	}

	if (itemId) {
		getId(itemId + "_prog").textContent = data;
	}
}

/**
 * @param {string} filename
 * @param {string} status
 * @param {string} data
 * @param {string} itemId
 */
function createProgressItem(filename, status, data, itemId) {
	const statusElement = getId("compression-status");
	const newStatus = document.createElement("div");
	newStatus.id = itemId;
	newStatus.className = `status-item ${status}`;
	const visibleFilename = filename.substring(0, 45);
	newStatus.innerHTML = `
        <div class="filename">${visibleFilename}</div>
        <div id="${itemId + "_prog"}" class="itemProgress">${data}</div>
    `;
	statusElement.append(newStatus);
}

/**
 * @param {any} bytes
 */
function formatBytes(bytes) {
	const units = ["B", "KB", "MB", "GB"];
	let size = bytes;
	let unitIndex = 0;
	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}
	return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * @param {string} timeStr
 */
function timeToSeconds(timeStr) {
	if (!timeStr) {
		return 0;
	}

	const [hh, mm, ss] = timeStr.split(":").map(parseFloat);
	return hh * 3600 + mm * 60 + ss;
}

function getFfmpegPath() {
	if (
		process.env.YTDOWNLOADER_FFMPEG_PATH &&
		existsSync(process.env.YTDOWNLOADER_FFMPEG_PATH)
	) {
		console.log("Using FFMPEG from YTDOWNLOADER_FFMPEG_PATH");
		return process.env.YTDOWNLOADER_FFMPEG_PATH;
	}

	switch (os.platform()) {
		case "win32":
			return path.join(__dirname, "..", "ffmpeg", "bin", "ffmpeg.exe");
		case "freebsd":
			try {
				return execSync("which ffmpeg").toString("utf8").trim();
			} catch (error) {
				console.error("ffmpeg not found on FreeBSD:", error);
				return "";
			}
		default:
			return path.join(__dirname, "..", "ffmpeg", "bin", "ffmpeg");
	}
}

getId("themeToggle").addEventListener("change", () => {
	document.documentElement.setAttribute("theme", getId("themeToggle").value);
	localStorage.setItem("theme", getId("themeToggle").value);
});

getId("output-folder-input").addEventListener("change", (e) => {
	const checked = e.target.checked;

	if (!checked) {
		getId("custom-folder-select").style.display = "block";
	} else {
		getId("custom-folder-select").style.display = "none";
		getId("custom-folder-path").textContent = "";
		getId("custom-folder-path").style.display = "none";
	}
});

const storageTheme = localStorage.getItem("theme");
if (storageTheme) {
	document.documentElement.setAttribute("theme", storageTheme);
	getId("themeToggle").value = storageTheme;
} else {
	document.documentElement.setAttribute("theme", "frappe");
	getId("themeToggle").value = "frappe";
}

ipcRenderer.on("directory-path", (_event, msg) => {
	let customFolderPathItem = getId("custom-folder-path");

	customFolderPathItem.textContent = msg;
	customFolderPathItem.style.display = "inline";
});

function closeMenu() {
	getId("menuIcon").style.transform = "rotate(0deg)";
	let count = 0;
	let opacity = 1;
	const fade = setInterval(() => {
		if (count >= 10) {
			clearInterval(fade);
		} else {
			opacity -= 0.1;
			getId("menu").style.opacity = String(opacity);
			count++;
		}
	}, 50);
}

// Menu
getId("preferenceWin").addEventListener("click", () => {
	closeMenu();
	menuIsOpen = false;
	ipcRenderer.send("load-page", __dirname + "/preferences.html");
});

getId("playlistWin").addEventListener("click", () => {
	closeMenu();
	menuIsOpen = false;
	ipcRenderer.send("load-win", __dirname + "/playlist.html");
});

getId("aboutWin").addEventListener("click", () => {
	closeMenu();
	menuIsOpen = false;
	ipcRenderer.send("load-page", __dirname + "/about.html");
});

getId("historyWin").addEventListener("click", () => {
	closeMenu();
	menuIsOpen = false;
	ipcRenderer.send("load-page", __dirname + "/history.html");
});

getId("homeWin").addEventListener("click", () => {
	closeMenu();
	menuIsOpen = false;
	ipcRenderer.send("load-win", __dirname + "/index.html");
});
```

--------------------------------------------------------------------------------

---[FILE: src/history.js]---
Location: ytDownloader-main/src/history.js

```javascript
/**
 * Download History Manager
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const {app} = require("electron");

class DownloadHistory {
	constructor() {
		this.historyFile = path.join(
			app.getPath("userData"),
			"download_history.json"
		);
		this.maxHistoryItems = 800;
		this.history = [];
		this.initialized = this._loadHistory().then((history) => {
			this.history = history;
		});
	}
	_generateUniqueId() {
		return crypto.randomUUID();
	}

	async _loadHistory() {
		try {
			if (fs.existsSync(this.historyFile)) {
				const data = await fs.promises.readFile(
					this.historyFile,
					"utf8"
				);
				return JSON.parse(data) || [];
			}
		} catch (error) {
			console.error("Error loading history:", error);
		}
		return [];
	}

	async _saveHistory() {
		try {
			await fs.promises.writeFile(
				this.historyFile,
				JSON.stringify(this.history, null, 2)
			);
		} catch (error) {
			console.error("Error saving history:", error);
		}
	}

	async addDownload(downloadInfo) {
		await this.initialized;

		const historyItem = {
			id: this._generateUniqueId(),
			title: downloadInfo.title || "Unknown",
			url: downloadInfo.url || "",
			filename: downloadInfo.filename || "",
			filePath: downloadInfo.filePath || "",
			fileSize: downloadInfo.fileSize || 0,
			format: downloadInfo.format || "unknown",
			thumbnail: downloadInfo.thumbnail || "",
			duration: downloadInfo.duration || 0,
			downloadDate: new Date().toISOString(),
			timestamp: Date.now(),
		};

		// Add to beginning for most recent first
		this.history.unshift(historyItem);

		// Keep only recent items
		if (this.history.length > this.maxHistoryItems) {
			this.history = this.history.slice(0, this.maxHistoryItems);
		}

		await this._saveHistory();
		return historyItem;
	}

	async getHistory() {
		await this.initialized;
		return this.history;
	}

	async getFilteredHistory(options = {}) {
		await this.initialized;

		let filtered = [...this.history];

		if (options.format) {
			filtered = filtered.filter(
				(item) =>
					item.format.toLowerCase() === options.format.toLowerCase()
			);
		}

		if (options.searchTerm) {
			const term = options.searchTerm.toLowerCase();
			filtered = filtered.filter(
				(item) =>
					item.title.toLowerCase().includes(term) ||
					item.url.toLowerCase().includes(term)
			);
		}

		if (options.limit) {
			filtered = filtered.slice(0, options.limit);
		}

		return filtered;
	}

	async getHistoryItem(id) {
		await this.initialized;
		return this.history.find((item) => item.id === id) || null;
	}

	async removeHistoryItem(id) {
		await this.initialized;

		const index = this.history.findIndex((item) => item.id === id);
		if (index !== -1) {
			this.history.splice(index, 1);
			await this._saveHistory();
			return true;
		}
		return false;
	}

	async clearHistory() {
		await this.initialized;

		this.history = [];
		await this._saveHistory();
	}

	async getStats() {
		await this.initialized;

		const stats = {
			totalDownloads: this.history.length,
			totalSize: 0,
			byFormat: {},
			oldestDownload: null,
			newestDownload: null,
		};

		this.history.forEach((item) => {
			stats.totalSize += item.fileSize || 0;

			const fmt = item.format.toLowerCase();
			stats.byFormat[fmt] = (stats.byFormat[fmt] || 0) + 1;
		});

		if (this.history.length > 0) {
			stats.newestDownload = this.history[0];
			stats.oldestDownload = this.history[this.history.length - 1];
		}

		return stats;
	}

	async exportAsJSON() {
		await this.initialized;
		return JSON.stringify(this.history, null, 2);
	}

	_sanitizeCSVField(value) {
		if (value == null) {
			value = "";
		}

		const stringValue = String(value);

		let sanitized = stringValue.replace(/"/g, '""');

		const dangerousChars = ["=", "+", "-", "@"];
		if (sanitized.length > 0 && dangerousChars.includes(sanitized[0])) {
			sanitized = "'" + sanitized;
		}

		return `"${sanitized}"`;
	}

	async exportAsCSV() {
		await this.initialized;

		if (this.history.length === 0) return "No history to export\n";

		const headers = [
			"Title",
			"URL",
			"Filename",
			"Format",
			"File Size (bytes)",
			"Download Date",
		];
		const rows = this.history.map((item) => [
			this._sanitizeCSVField(item.title),
			this._sanitizeCSVField(item.url),
			this._sanitizeCSVField(item.filename),
			this._sanitizeCSVField(item.format),
			this._sanitizeCSVField(item.fileSize),
			this._sanitizeCSVField(item.downloadDate),
		]);

		return (
			headers.join(",") +
			"\n" +
			rows.map((row) => row.join(",")).join("\n")
		);
	}
}

module.exports = DownloadHistory;
```

--------------------------------------------------------------------------------

---[FILE: src/index.js]---
Location: ytDownloader-main/src/index.js

```javascript
const videoToggle = getId("videoToggle");
const audioToggle = getId("audioToggle");
const incorrectMsg = getId("incorrectMsg");
const loadingMsg = getId("loadingWrapper");

function getId(id) {
	return document.getElementById(id);
}

// Video and audio toggle

videoToggle.addEventListener("click", (event) => {
	selectVideo()
});

audioToggle.addEventListener("click", (event) => {
	selectAudio()
});

/////////////
function selectVideo(){
	localStorage.setItem("defaultWindow", "video")
	videoToggle.style.backgroundColor = "var(--box-toggleOn)";
	audioToggle.style.backgroundColor = "var(--box-toggle)";
	getId("audioList").style.display = "none";
	getId("audioExtract").style.display = "none";
	getId("videoList").style.display = "block";
}

function selectAudio(){
	localStorage.setItem("defaultWindow", "audio")
	audioToggle.style.backgroundColor = "var(--box-toggleOn)";
	videoToggle.style.backgroundColor = "var(--box-toggle)";
	getId("videoList").style.display = "none";
	getId("audioList").style.display = "block";
	getId("audioExtract").style.display = "block";
}
```

--------------------------------------------------------------------------------

---[FILE: src/playlist.js]---
Location: ytDownloader-main/src/playlist.js

```javascript
const {clipboard, ipcRenderer} = require("electron");
const {default: YTDlpWrap} = require("yt-dlp-wrap-plus");
const path = require("path");
const os = require("os");
const fs = require("fs");
const {execSync} = require("child_process");
const {constants} = require("fs/promises");

const playlistDownloader = {
	// State and config
	state: {
		url: null,
		downloadDir: null,
		ytDlpPath: null,
		ytDlpWrap: null,
		ffmpegPath: null,
		jsRuntimePath: null,
		playlistName: "",
		originalCount: 0,
		currentDownloadProcess: null,
	},

	config: {
		foldernameFormat: "%(playlist_title)s",
		filenameFormat: "%(playlist_index)s.%(title)s.%(ext)s",
		proxy: "",
		cookie: {
			browser: "",
			arg: "",
		},
		configFile: {
			arg: "",
			path: "",
		},
		playlistRange: {
			start: 1,
			end: "",
		},
	},

	// DOM elements
	ui: {
		pasteLinkBtn: document.getElementById("pasteLink"),
		linkDisplay: document.getElementById("link"),
		optionsContainer: document.getElementById("options"),
		downloadList: document.getElementById("list"),

		downloadVideoBtn: document.getElementById("download"),
		downloadAudioBtn: document.getElementById("audioDownload"),
		downloadThumbnailsBtn: document.getElementById("downloadThumbnails"),
		saveLinksBtn: document.getElementById("saveLinks"),

		selectLocationBtn: document.getElementById("selectLocation"),
		pathDisplay: document.getElementById("path"),
		openDownloadsBtn: document.getElementById("openDownloads"),

		videoToggle: document.getElementById("videoToggle"),
		audioToggle: document.getElementById("audioToggle"),
		advancedToggle: document.getElementById("advancedToggle"),
		videoBox: document.getElementById("videoBox"),
		audioBox: document.getElementById("audioBox"),
		videoQualitySelect: document.getElementById("select"),
		videoTypeSelect: document.getElementById("videoTypeSelect"),
		typeSelectBox: document.getElementById("typeSelectBox"),
		audioTypeSelect: document.getElementById("audioSelect"),
		audioQualitySelect: document.getElementById("audioQualitySelect"),

		advancedMenu: document.getElementById("advancedMenu"),
		playlistIndexInput: document.getElementById("playlistIndex"),
		playlistEndInput: document.getElementById("playlistEnd"),
		subtitlesCheckbox: document.getElementById("subChecked"),
		closeHiddenBtn: document.getElementById("closeHidden"),

		playlistNameDisplay: document.getElementById("playlistName"),
		errorMsgDisplay: document.getElementById("incorrectMsgPlaylist"),
		errorBtn: document.getElementById("errorBtn"),
		errorDetails: document.getElementById("errorDetails"),

		menuIcon: document.getElementById("menuIcon"),
		menu: document.getElementById("menu"),
		preferenceWinBtn: document.getElementById("preferenceWin"),
		aboutWinBtn: document.getElementById("aboutWin"),
		historyWinBtn: document.getElementById("historyWin"),
		homeWinBtn: document.getElementById("homeWin"),
		compressorWinBtn: document.getElementById("compressorWin"),
	},

	init() {
		this.loadInitialConfig();
		this.initEventListeners();

		// Set initial UI state
		this.ui.pathDisplay.textContent = this.state.downloadDir;
		this.ui.videoToggle.style.backgroundColor = "var(--box-toggleOn)";
		this.updateVideoTypeVisibility();

		// Load translations when ready
		document.addEventListener("translations-loaded", () => {
			window.i18n.translatePage();
		});

		console.log(`yt-dlp path: ${this.state.ytDlpPath}`);
		console.log(`ffmpeg path: ${this.state.ffmpegPath}`);
	},

	loadInitialConfig() {
		// yt-dlp path
		this.state.ytDlpPath = localStorage.getItem("ytdlp");
		this.state.ytDlpWrap = new YTDlpWrap(`"${this.state.ytDlpPath}"`);

		const defaultDownloadsDir = path.join(os.homedir(), "Downloads");
		let preferredDir =
			localStorage.getItem("downloadPath") || defaultDownloadsDir;
		try {
			fs.accessSync(preferredDir, constants.W_OK);
			this.state.downloadDir = preferredDir;
		} catch (err) {
			console.error(
				"Unable to write to preferred download directory. Reverting to default.",
				err
			);
			this.state.downloadDir = defaultDownloadsDir;
			localStorage.setItem("downloadPath", defaultDownloadsDir);
		}

		// ffmpeg and js runtime path setup
		this.state.ffmpegPath = this.getFfmpegPath();
		this.state.jsRuntimePath = this.getJsRuntimePath();

		if (localStorage.getItem("preferredVideoQuality")) {
			this.ui.videoQualitySelect.value = localStorage.getItem(
				"preferredVideoQuality"
			);
		}
		if (localStorage.getItem("preferredAudioQuality")) {
			this.ui.audioQualitySelect.value = localStorage.getItem(
				"preferredAudioQuality"
			);
		}
	},

	initEventListeners() {
		this.ui.pasteLinkBtn.addEventListener("click", () => this.pasteLink());
		document.addEventListener("keydown", (event) => {
			if (
				(event.ctrlKey && event.key === "v") ||
				(event.metaKey &&
					event.key === "v" &&
					os.platform() === "darwin" &&
					document.activeElement.tagName !== "INPUT" &&
					document.activeElement.tagName !== "TEXTAREA")
			) {
				this.pasteLink();
			}
		});

		this.ui.downloadVideoBtn.addEventListener("click", () =>
			this.startDownload("video")
		);
		this.ui.downloadAudioBtn.addEventListener("click", () =>
			this.startDownload("audio")
		);
		this.ui.downloadThumbnailsBtn.addEventListener("click", () =>
			this.startDownload("thumbnails")
		);
		this.ui.saveLinksBtn.addEventListener("click", () =>
			this.startDownload("links")
		);

		this.ui.videoToggle.addEventListener("click", () =>
			this.toggleDownloadType("video")
		);
		this.ui.audioToggle.addEventListener("click", () =>
			this.toggleDownloadType("audio")
		);
		this.ui.advancedToggle.addEventListener("click", () =>
			this.toggleAdvancedMenu()
		);
		this.ui.videoQualitySelect.addEventListener("change", () =>
			this.updateVideoTypeVisibility()
		);
		this.ui.selectLocationBtn.addEventListener("click", () =>
			ipcRenderer.send("select-location-main", "")
		);
		this.ui.openDownloadsBtn.addEventListener("click", () =>
			this.openDownloadsFolder()
		);
		this.ui.closeHiddenBtn.addEventListener("click", () =>
			this.hideOptions(true)
		);

		this.ui.preferenceWinBtn.addEventListener("click", () =>
			this.navigate("page", "/preferences.html")
		);
		this.ui.aboutWinBtn.addEventListener("click", () =>
			this.navigate("page", "/about.html")
		);
		this.ui.historyWinBtn.addEventListener("click", () =>
			this.navigate("page", "/history.html")
		);
		this.ui.homeWinBtn.addEventListener("click", () =>
			this.navigate("win", "/index.html")
		);
		this.ui.compressorWinBtn.addEventListener("click", () =>
			this.navigate("win", "/compressor.html")
		);

		ipcRenderer.on("downloadPath", (_event, downloadPath) => {
			if (downloadPath && downloadPath[0]) {
				this.ui.pathDisplay.textContent = downloadPath[0];
				this.state.downloadDir = downloadPath[0];
			}
		});
	},

	startDownload(type) {
		if (!this.state.url) {
			this.showError("URL is missing. Please paste a link first.");
			return;
		}
		this.updateDynamicConfig();
		this.hideOptions();

		const controller = new AbortController();
		const baseArgs = this.buildBaseArgs();
		let specificArgs = [];

		switch (type) {
			case "video":
				specificArgs = this.getVideoArgs();
				break;
			case "audio":
				specificArgs = this.getAudioArgs();
				break;
			case "thumbnails":
				specificArgs = this.getThumbnailArgs();
				break;
			case "links":
				specificArgs = this.getLinkArgs();
				break;
		}

		const allArgs = [
			...baseArgs,
			...specificArgs,
			`"${this.state.url}"`,
		].filter(Boolean);

		console.log(`Command: ${this.state.ytDlpPath}`, allArgs.join(" "));
		this.state.currentDownloadProcess = this.state.ytDlpWrap.exec(
			allArgs,
			{shell: true, detached: false},
			controller.signal
		);

		this.handleDownloadEvents(this.state.currentDownloadProcess, type);
	},

	buildBaseArgs() {
		const {start, end} = this.config.playlistRange;
		const outputPath = `"${path.join(
			this.state.downloadDir,
			this.config.foldernameFormat,
			this.config.filenameFormat
		)}"`;

		return [
			"--yes-playlist",
			"-o",
			outputPath,
			"-I",
			`"${start}:${end}"`,
			"--ffmpeg-location",
			`"${this.state.ffmpegPath}"`,
			...(this.state.jsRuntimePath
				? ["--no-js-runtimes", "--js-runtime", this.state.jsRuntimePath]
				: []),
			this.config.cookie.arg,
			this.config.cookie.browser,
			this.config.configFile.arg,
			this.config.configFile.path,
			...(this.config.proxy
				? ["--no-check-certificate", "--proxy", this.config.proxy]
				: []),
			"--compat-options",
			"no-youtube-unavailable-videos",
		].filter(Boolean);
	},

	getVideoArgs() {
		const quality = this.ui.videoQualitySelect.value;
		const videoType = this.ui.videoTypeSelect.value;
		let formatArgs = [];

		if (quality === "best") {
			formatArgs = ["-f", "bv*+ba/best"];
		} else if (quality === "worst") {
			formatArgs = ["-f", "wv+wa/worst"];
		} else if (quality === "useConfig") {
			formatArgs = [];
		} else {
			if (videoType === "mp4") {
				formatArgs = [
					"-f",
					`"bestvideo[height<=${quality}]+bestaudio[ext=m4a]/best[height<=${quality}]/best"`,
					"--merge-output-format",
					"mp4",
					"--recode-video",
					"mp4",
				];
			} else if (videoType === "webm") {
				formatArgs = [
					"-f",
					`"bestvideo[height<=${quality}]+bestaudio[ext=webm]/best[height<=${quality}]/best"`,
					"--merge-output-format",
					"webm",
					"--recode-video",
					"webm",
				];
			} else {
				formatArgs = [
					"-f",
					`"bv*[height=${quality}]+ba/best[height=${quality}]/best[height<=${quality}]"`,
				];
			}
		}

		const isYouTube =
			this.state.url.includes("youtube.com/") ||
			this.state.url.includes("youtu.be/");
		const canEmbedThumb = os.platform() !== "darwin";

		return [
			...formatArgs,
			"--embed-metadata",
			this.ui.subtitlesCheckbox.checked ? "--write-subs" : "",
			this.ui.subtitlesCheckbox.checked ? "--sub-langs" : "",
			this.ui.subtitlesCheckbox.checked ? "all" : "",
			videoType === "mp4" && isYouTube && canEmbedThumb
				? "--embed-thumbnail"
				: "",
		].filter(Boolean);
	},

	getAudioArgs() {
		const format = this.ui.audioTypeSelect.value;
		const quality = this.ui.audioQualitySelect.value;
		const isYouTube =
			this.state.url.includes("youtube.com/") ||
			this.state.url.includes("youtu.be/");
		const canEmbedThumb = os.platform() !== "darwin";

		if (isYouTube && format === "m4a" && quality === "auto") {
			return [
				"-f",
				`ba[ext=${format}]/ba`,
				"--embed-metadata",
				canEmbedThumb ? "--embed-thumbnail" : "",
			];
		}

		return [
			"-x",
			"--audio-format",
			format,
			"--audio-quality",
			quality,
			"--embed-metadata",
			(format === "mp3" || (format === "m4a" && isYouTube)) &&
			canEmbedThumb
				? "--embed-thumbnail"
				: "",
		];
	},

	getThumbnailArgs() {
		return [
			"--write-thumbnail",
			"--convert-thumbnails",
			"png",
			"--skip-download",
		];
	},

	getLinkArgs() {
		const linksFilePath = `"${path.join(
			this.state.downloadDir,
			this.config.foldernameFormat,
			"links.txt"
		)}"`;
		return [
			"--skip-download",
			"--print-to-file",
			"webpage_url",
			linksFilePath,
		];
	},

	// yt-dlp event handling
	handleDownloadEvents(process, type) {
		let count = 0;

		process.on("ytDlpEvent", (_eventType, eventData) => {
			const playlistTxt = "Downloading playlist: ";
			if (eventData.includes(playlistTxt)) {
				this.state.playlistName = eventData
					.split(playlistTxt)[1]
					.trim();

				this.state.playlistName = this.state.playlistName
					.replaceAll("|", "｜")
					.replaceAll(`"`, `＂`)
					.replaceAll("*", "＊")
					.replaceAll("/", "⧸")
					.replaceAll("\\", "⧹")
					.replaceAll(":", "：")
					.replaceAll("?", "？");

				if (
					os.platform() === "win32" &&
					this.state.playlistName.endsWith(".")
				) {
					this.state.playlistName =
						this.state.playlistName.slice(0, -1) + "#";
				}

				this.ui.playlistNameDisplay.textContent = `${window.i18n.__(
					"downloadingPlaylist"
				)} ${this.state.playlistName}`;
			}

			const videoIndexTxt = "Downloading item ";
			const oldVideoIndexTxt = "Downloading video ";
			if (
				(eventData.includes(videoIndexTxt) ||
					eventData.includes(oldVideoIndexTxt)) &&
				!eventData.includes("thumbnail")
			) {
				count++;
				this.state.originalCount++;
				this.updatePlaylistUI(count, type);
			}
		});

		process.on("progress", (progress) => {
			const progressElement = document.getElementById(`p${count}`);
			if (!progressElement) return;

			if (progress.percent === 100) {
				progressElement.textContent = `${window.i18n.__(
					"processing"
				)}...`;
			} else {
				progressElement.textContent = `${window.i18n.__("progress")} ${
					progress.percent
				}% | ${window.i18n.__("speed")} ${
					progress.currentSpeed || "N/A"
				}`;
			}
		});

		process.on("error", (error) => this.showError(error));
		process.on("close", () => this.finishDownload(count));
	},

	pasteLink() {
		this.state.url = clipboard.readText();
		this.ui.linkDisplay.textContent = ` ${this.state.url}`;
		this.ui.optionsContainer.style.display = "block";
		this.ui.errorMsgDisplay.textContent = "";
		this.ui.errorBtn.style.display = "none";
	},

	updatePlaylistUI(count, type) {
		let itemTitle = "";
		switch (type) {
			case "thumbnails":
				itemTitle = `${window.i18n.__("thumbnail")} ${
					this.state.originalCount
				}`;
				break;
			case "links":
				itemTitle = `${window.i18n.__("link")} ${
					this.state.originalCount
				}`;
				break;
			default:
				itemTitle = `${window.i18n.__(type)} ${
					this.state.originalCount
				}`;
		}

		if (count > 1) {
			const prevProgress = document.getElementById(`p${count - 1}`);
			if (prevProgress)
				prevProgress.textContent = window.i18n.__("fileSaved");
		}

		const itemHTML = `
            <div class="playlistItem">
                <p class="itemTitle">${itemTitle}</p>
                <p class="itemProgress" id="p${count}">${window.i18n.__(
			"downloading"
		)}</p>
            </div>`;
		this.ui.downloadList.innerHTML += itemHTML;
		window.scrollTo(0, document.body.scrollHeight);
	},

	updateDynamicConfig() {
		// Naming formats from localStorage
		this.config.foldernameFormat =
			localStorage.getItem("foldernameFormat") || "%(playlist_title)s";
		this.config.filenameFormat =
			localStorage.getItem("filenameFormat") ||
			"%(playlist_index)s.%(title)s.%(ext)s";

		// Proxy, cookies, config file
		this.config.proxy = localStorage.getItem("proxy") || "";
		this.config.cookie.browser = localStorage.getItem("browser") || "";
		this.config.cookie.arg = this.config.cookie.browser
			? "--cookies-from-browser"
			: "";
		const configPath = localStorage.getItem("configPath");
		this.config.configFile.path = configPath ? `"${configPath}"` : "";
		this.config.configFile.arg = configPath ? "--config-location" : "";

		// Playlist range from UI inputs
		this.config.playlistRange.start =
			Number(this.ui.playlistIndexInput.value) || 1;
		this.config.playlistRange.end = this.ui.playlistEndInput.value || "";
		this.state.originalCount =
			this.config.playlistRange.start > 1
				? this.config.playlistRange.start - 1
				: 0;

		// Reset playlist name for new download
		this.state.playlistName = "";
	},

	hideOptions(justHide = false) {
		this.ui.optionsContainer.style.display = "none";
		this.ui.downloadList.innerHTML = "";
		this.ui.errorBtn.style.display = "none";
		this.ui.errorDetails.style.display = "none";
		this.ui.errorDetails.textContent = "";
		this.ui.errorMsgDisplay.style.display = "none";

		if (!justHide) {
			this.ui.playlistNameDisplay.textContent = `${window.i18n.__(
				"processing"
			)}...`;
			this.ui.pasteLinkBtn.style.display = "none";
			this.ui.openDownloadsBtn.style.display = "inline-block";
		}
	},

	finishDownload(count) {
		const lastProgress = document.getElementById(`p${count}`);
		if (lastProgress)
			lastProgress.textContent = window.i18n.__("fileSaved");
		this.ui.pasteLinkBtn.style.display = "inline-block";
		this.ui.openDownloadsBtn.style.display = "inline-block";

		const notify = new Notification("ytDownloader", {
			body: window.i18n.__("playlistDownloaded"),
			icon: "../assets/images/icon.png",
		});

		notify.onclick = () => this.openDownloadsFolder();
	},

	showError(error) {
		console.error("Download Error:", error.toString());
		this.ui.pasteLinkBtn.style.display = "inline-block";
		this.ui.openDownloadsBtn.style.display = "none";
		this.ui.optionsContainer.style.display = "block";
		this.ui.playlistNameDisplay.textContent = "";
		this.ui.errorMsgDisplay.textContent =
			window.i18n.__("errorNetworkOrUrl");
		this.ui.errorMsgDisplay.style.display = "block";
		this.ui.errorMsgDisplay.title = error.toString();
		this.ui.errorBtn.style.display = "inline-block";
		this.ui.errorDetails.innerHTML = `<strong>URL: ${
			this.state.url
		}</strong><br><br>${error.toString()}`;
		// this.ui.errorDetails.title = window.i18n.__("clickToCopy");
	},

	openDownloadsFolder() {
		const openPath =
			this.state.playlistName &&
			fs.existsSync(
				path.join(this.state.downloadDir, this.state.playlistName)
			)
				? path.join(this.state.downloadDir, this.state.playlistName)
				: this.state.downloadDir;

		ipcRenderer.invoke("open-folder", openPath).then((result) => {
			if (!result.success) {
				ipcRenderer.invoke("open-folder", this.state.downloadDir);
			}
		});
	},

	toggleDownloadType(type) {
		const isVideo = type === "video";
		this.ui.videoToggle.style.backgroundColor = isVideo
			? "var(--box-toggleOn)"
			: "var(--box-toggle)";
		this.ui.audioToggle.style.backgroundColor = isVideo
			? "var(--box-toggle)"
			: "var(--box-toggleOn)";
		this.ui.videoBox.style.display = isVideo ? "block" : "none";
		this.ui.audioBox.style.display = isVideo ? "none" : "block";
	},

	updateVideoTypeVisibility() {
		const value = this.ui.videoQualitySelect.value;
		const show = !["best", "worst", "useConfig"].includes(value);
		this.ui.typeSelectBox.style.display = show ? "block" : "none";
	},

	toggleAdvancedMenu() {
		const isHidden =
			this.ui.advancedMenu.style.display === "none" ||
			this.ui.advancedMenu.style.display === "";
		this.ui.advancedMenu.style.display = isHidden ? "block" : "none";
	},

	closeMenu() {
		this.ui.menuIcon.style.transform = "rotate(0deg)";
		this.ui.menu.style.opacity = "0";
		setTimeout(() => {
			this.ui.menu.style.display = "none";
		}, 300);
	},

	navigate(type, page) {
		this.closeMenu();
		const event = type === "page" ? "load-page" : "load-win";
		ipcRenderer.send(event, path.join(__dirname, page));
	},

	getFfmpegPath() {
		if (
			process.env.YTDOWNLOADER_FFMPEG_PATH &&
			fs.existsSync(process.env.YTDOWNLOADER_FFMPEG_PATH)
		) {
			console.log("Using FFMPEG from YTDOWNLOADER_FFMPEG_PATH");
			return process.env.YTDOWNLOADER_FFMPEG_PATH;
		}

		switch (os.platform()) {
			case "win32":
				return path.join(__dirname, "..", "ffmpeg", "bin");
			case "freebsd":
				try {
					return execSync("which ffmpeg").toString("utf8").trim();
				} catch (error) {
					console.error("ffmpeg not found on FreeBSD:", error);
					return "";
				}
			default:
				return path.join(__dirname, "..", "ffmpeg", "bin");
		}
	},

	getJsRuntimePath() {
		{
			const exeName = "node";

			if (process.env.YTDOWNLOADER_NODE_PATH) {
				if (fs.existsSync(process.env.YTDOWNLOADER_NODE_PATH)) {
					return `$node:"${process.env.YTDOWNLOADER_NODE_PATH}"`;
				}

				return "";
			}

			if (process.env.YTDOWNLOADER_DENO_PATH) {
				if (fs.existsSync(process.env.YTDOWNLOADER_DENO_PATH)) {
					return `$deno:"${process.env.YTDOWNLOADER_DENO_PATH}"`;
				}

				return "";
			}

			if (os.platform() === "darwin") {
				return "";
			}

			let jsRuntimePath = path.join(__dirname, "..", exeName);

			if (os.platform() === "win32") {
				jsRuntimePath = path.join(__dirname, "..", `${exeName}.exe`);
			}

			if (fs.existsSync(jsRuntimePath)) {
				return `${exeName}:"${jsRuntimePath}"`;
			} else {
				return "";
			}
		}
	},
};

playlistDownloader.init();
```

--------------------------------------------------------------------------------

---[FILE: src/playlist_new.js]---
Location: ytDownloader-main/src/playlist_new.js

```javascript
const { clipboard, shell, ipcRenderer } = require("electron");
const { default: YTDlpWrap } = require("yt-dlp-wrap-plus");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { execSync, exec, spawnSync } = require("child_process");
let url;
const ytDlp = localStorage.getItem("ytdlp");
const ytdlp = new YTDlpWrap(ytDlp);
const downloadDir = localStorage.getItem("downloadPath");
const i18n = new (require("../translations/i18n"))();
let cookieArg = "";
let browser = "";
const formats = {
	144: 160,
	240: 133,
	360: 134,
	480: 135,
	720: 136,
	1080: 137,
	1440: 400,
	2160: 401,
	4320: 571,
};
let originalCount = 0;
let ffmpeg;
let ffmpegPath;
if (os.platform() === "win32") {
	ffmpeg = `"${__dirname}\\..\\ffmpeg.exe"`;
	ffmpegPath = `${__dirname}\\..\\ffmpeg.exe`;
} else {
	ffmpeg = `"${__dirname}/../ffmpeg"`;
	ffmpegPath = `${__dirname}/../ffmpeg`;
}

if (!fs.existsSync(ffmpegPath)) {
	try {
		ffmpeg = execSync("which ffmpeg", { encoding: "utf8" });
		ffmpeg = `"${ffmpeg.trimEnd()}"`;
	} catch (error) {
		console.log(error);
	}
}
console.log("ffmpeg:", ffmpeg);

let foldernameFormat = "%(playlist_title)s";
let filenameFormat = "%(playlist_index)s.%(title)s.%(ext)s";
let playlistIndex = 1;
let playlistEnd = "";

function getId(id) {
	return document.getElementById(id);
}

function pasteLink() {
	const clipboardText = clipboard.readText();
	getId("loadingWrapper").style.display = "flex";
	getId("incorrectMsg").textContent = "";
	getId("errorBtn").style.display = "none";
	getId("errorDetails").style.display = "none";
	getId("errorDetails").textContent = "";
	exec(
		`${ytDlp} --yes-playlist --no-warnings -J --flat-playlist "${clipboardText}"`,
		(error, stdout, stderr) => {
			if (error) {
				getId("loadingWrapper").style.display = "none";
				getId("incorrectMsg").textContent = i18n.__(
					"Some error has occurred. Check your network and use correct URL"
				);
				getId("errorDetails").innerHTML = `
			<strong>URL: ${clipboardText}</strong>
			<br><br>
			${error}
			`;
				getId("errorDetails").title = i18n.__("Click to copy");
				getId("errorBtn").style.display = "inline-block";
			} else {
				const parsed = JSON.parse(stdout);
				console.log(parsed);
				let items = "";
				// If correct playlist url is used
				if (parsed.entries) {
					parsed.entries.forEach((entry) => {
						console.log(entry)
						const randId = Math.random()
							.toFixed(10)
							.toString()
							.slice(2);

						if (entry.channel) {
							items += `
						<div class="item" id="${randId}">
						<img src="${
							entry.thumbnails[3].url
						}" alt="No thumbnail" class="itemIcon" crossorigin="anonymous">
			
						<div class="itemBody">
							<div class="itemTitle">${entry.title}</div>
							<div>${formatTime(entry.duration)}</div>
							<input type="checkbox" class="playlistCheck" id="c${randId}">
							<input type="hidden" id="link${randId}" value="${entry.url}">
						</div>
					</div>
						`;
						}
					});
					getId("data").innerHTML = items;
					getId("loadingWrapper").style.display = "none";
				}
				// If correct playlist url is not used
				else {
					getId("loadingWrapper").style.display = "none";
					getId("incorrectMsg").textContent = i18n.__(
						"Incompatible URL. Please provide a playlist URL"
					);
					getId("errorDetails").innerHTML = `
			<strong>URL: ${clipboardText}</strong>
			<br><br>
			${error}
			`;
					getId("errorDetails").title = i18n.__("Click to copy");
					getId("errorBtn").style.display = "inline-block";
				}
			}
		}
	);
}

getId("pasteLink").addEventListener("click", (e) => {
	pasteLink();
});

document.addEventListener("keydown", (event) => {
	if (event.ctrlKey && event.key == "v") {
		pasteLink();
	}
});

function formatTime(seconds) {
	let hours = Math.floor(seconds / 3600);
	let minutes = Math.floor((seconds - hours * 3600) / 60);
	seconds = seconds - hours * 3600 - minutes * 60;
	let formattedTime = "";

	if (hours > 0) {
		formattedTime += hours + ":";
	}
	if (minutes < 10 && hours > 0) {
		formattedTime += "0";
	}
	formattedTime += minutes + ":";
	if (seconds < 10) {
		formattedTime += "0";
	}
	formattedTime += seconds;
	return formattedTime;
}
function closeMenu() {
	getId("menuIcon").style.transform = "rotate(0deg)";
	menuIsOpen = false;
	let count = 0;
	let opacity = 1;
	const fade = setInterval(() => {
		if (count >= 10) {
			clearInterval(fade);
		} else {
			opacity -= 0.1;
			getId("menu").style.opacity = opacity;
			count++;
		}
	}, 50);
}

getId("preferenceWin").addEventListener("click", () => {
	closeMenu();
	ipcRenderer.send("load-page", __dirname + "/preferences.html");
});

getId("aboutWin").addEventListener("click", () => {
	closeMenu();
	ipcRenderer.send("load-page", __dirname + "/about.html");
});

getId("historyWin").addEventListener("click", () => {
	closeMenu();
	ipcRenderer.send("load-page", __dirname + "/history.html");
});

getId("homeWin").addEventListener("click", () => {
	closeMenu();
	ipcRenderer.send("load-win", __dirname + "/index.html");
});
```

--------------------------------------------------------------------------------

---[FILE: src/preferences.js]---
Location: ytDownloader-main/src/preferences.js

```javascript
const {ipcRenderer, shell} = require("electron");
const {accessSync, constants} = require("original-fs");
const {join} = require("path");
const {homedir} = require("os");

const storageTheme = localStorage.getItem("theme");
if (storageTheme) {
	document.documentElement.setAttribute("theme", storageTheme);
} else {
	document.documentElement.setAttribute("theme", "frappe");
}

let rightToLeft = "false";
if (localStorage.getItem("rightToLeft")) {
	rightToLeft = localStorage.getItem("rightToLeft");
}
if (rightToLeft == "true") {
	document
		.querySelectorAll(".prefBox")
		.forEach((/** @type {HTMLElement} */ item) => {
			item.style.flexDirection = "row-reverse";
		});
} else {
	console.log("Change to left to right");
	document
		.querySelectorAll(".prefBox")
		.forEach((/** @type {HTMLElement} */ item) => {
			item.style.flexDirection = "row";
		});
}

// Download path
let downloadPath = localStorage.getItem("downloadPath");

if (!downloadPath) {
	downloadPath = join(homedir(), "Downloads");
}
getId("path").textContent = downloadPath;

/**
 *
 * @param {string} id
 * @returns {any}
 */
function getId(id) {
	return document.getElementById(id);
}

document.addEventListener("translations-loaded", () => {
	window.i18n.translatePage();

	document.title = window.i18n.__("preferences");

	if (process.env.FLATPAK_ID) {
		getId("flatpakTxt").addEventListener("click", () => {
			shell.openExternal(
				"https://flathub.org/apps/com.github.tchx84.Flatseal"
			);
		});

		getId("flatpakTxt").style.display = "block";
	}
});

getId("back").addEventListener("click", () => {
	ipcRenderer.send("close-secondary");
});

// Selecting download directory
getId("selectLocation").addEventListener("click", () => {
	ipcRenderer.send("select-location-secondary", "");
});

ipcRenderer.on("downloadPath", (_event, downloadPath) => {
	try {
		accessSync(downloadPath[0], constants.W_OK);

		console.log(downloadPath[0]);
		localStorage.setItem("downloadPath", downloadPath[0]);
		getId("path").textContent = downloadPath[0];
	} catch (error) {
		showPopup(i18n.__("unableToAccessDir"), true);
	}
});

// Selecting config directory

getId("configBtn").addEventListener("click", () => {
	ipcRenderer.send("select-config", "");
});

ipcRenderer.on("configPath", (event, configPath) => {
	console.log(configPath);
	localStorage.setItem("configPath", configPath);
	getId("configPath").textContent = configPath;
});

const configCheck = getId("configCheck");
configCheck.addEventListener("change", (event) => {
	if (configCheck.checked) {
		getId("configOpts").style.display = "flex";
	} else {
		getId("configOpts").style.display = "none";
		localStorage.setItem("configPath", "");
	}
});

const configPath = localStorage.getItem("configPath");
if (configPath) {
	getId("configPath").textContent = configPath;
	configCheck.checked = true;
	getId("configOpts").style.display = "flex";
}

// Language settings

const language = localStorage.getItem("locale");

if (language) {
	if (language.startsWith("en")) {
		getId("select").value = "en";
	} else {
		getId("select").value = language;
	}
}

function changeLanguage() {
	const language = getId("select").value;
	localStorage.setItem("locale", language);
	if (language === "fa" || language === "ar") {
		rightToLeft = "true";
		localStorage.setItem("rightToLeft", "true");
	} else {
		rightToLeft = "false";
		localStorage.setItem("rightToLeft", "false");
	}
}

// Browser preferences
let browser = localStorage.getItem("browser");
if (browser) {
	getId("browser").value = browser;
}

getId("browser").addEventListener("change", () => {
	browser = getId("browser").value;
	localStorage.setItem("browser", browser);
});

// Handling preferred video quality
let preferredVideoQuality = localStorage.getItem("preferredVideoQuality");
if (preferredVideoQuality) {
	getId("preferredVideoQuality").value = preferredVideoQuality;
}

getId("preferredVideoQuality").addEventListener("change", () => {
	preferredVideoQuality = getId("preferredVideoQuality").value;
	localStorage.setItem("preferredVideoQuality", preferredVideoQuality);
});

// Handling preferred audio quality
let preferredAudioQuality = localStorage.getItem("preferredAudioQuality");
if (preferredAudioQuality) {
	getId("preferredAudioQuality").value = preferredAudioQuality;
}

getId("preferredAudioQuality").addEventListener("change", () => {
	preferredAudioQuality = getId("preferredAudioQuality").value;
	localStorage.setItem("preferredAudioQuality", preferredAudioQuality);
});

// Handling preferred video codec
let preferredVideoCodec = localStorage.getItem("preferredVideoCodec");
if (preferredVideoCodec) {
	getId("preferredVideoCodec").value = preferredVideoCodec;
}

getId("preferredVideoCodec").addEventListener("change", () => {
	preferredVideoCodec = getId("preferredVideoCodec").value;
	localStorage.setItem("preferredVideoCodec", preferredVideoCodec);
});

// Proxy
let proxy = localStorage.getItem("proxy");
if (proxy) {
	getId("proxyTxt").value = proxy;
}
getId("proxyTxt").addEventListener("change", () => {
	proxy = getId("proxyTxt").value;
	localStorage.setItem("proxy", proxy);
});

// Custom yt-dlp args
const ytDlpArgsInput = getId("customArgsInput");
let customYtDlpArgs = localStorage.getItem("customYtDlpArgs");
if (customYtDlpArgs) {
	ytDlpArgsInput.value = customYtDlpArgs;
	ytDlpArgsInput.style.height = ytDlpArgsInput.scrollHeight + "px";
}
ytDlpArgsInput.addEventListener("input", () => {
	customYtDlpArgs = getId("customArgsInput").value;
	localStorage.setItem("customYtDlpArgs", customYtDlpArgs.trim());
	ytDlpArgsInput.style.height = "auto";
	ytDlpArgsInput.style.height = ytDlpArgsInput.scrollHeight + "px";
});

getId("learnMoreLink").addEventListener("click", () => {
	shell.openExternal(
		"https://github.com/aandrew-me/ytDownloader/wiki/Custom-yt%E2%80%90dlp-options"
	);
});

// Reload
function reload() {
	ipcRenderer.send("reload");
}
getId("restart").addEventListener("click", () => {
	reload();
});

// Handling filename formats
getId("filenameFormat").addEventListener("input", () => {
	const text = getId("filenameFormat").value;
	localStorage.setItem("filenameFormat", text);
});

if (localStorage.getItem("filenameFormat")) {
	getId("filenameFormat").value = localStorage.getItem("filenameFormat");
}

getId("resetFilenameFormat").addEventListener("click", () => {
	getId("filenameFormat").value = "%(playlist_index)s.%(title)s.%(ext)s";
	localStorage.setItem(
		"filenameFormat",
		"%(playlist_index)s.%(title)s.%(ext)s"
	);
});

// Handling folder name formats
getId("foldernameFormat").addEventListener("input", () => {
	const text = getId("foldernameFormat").value;
	localStorage.setItem("foldernameFormat", text);
});

if (localStorage.getItem("foldernameFormat")) {
	getId("foldernameFormat").value = localStorage.getItem("foldernameFormat");
}

getId("resetFoldernameFormat").addEventListener("click", () => {
	getId("foldernameFormat").value = "%(playlist_title)s";
	localStorage.setItem("foldernameFormat", "%(playlist_title)s");
});

// Max active downloads
getId("maxDownloads").addEventListener("input", () => {
	const number = Number(getId("maxDownloads").value);

	if (number < 1) {
		localStorage.setItem("maxActiveDownloads", "1");
	} else {
		localStorage.setItem("maxActiveDownloads", String(number));
	}
});

if (localStorage.getItem("maxActiveDownloads")) {
	getId("maxDownloads").value = localStorage.getItem("maxActiveDownloads");
}

// Closing app to system tray
const closeToTray = getId("closeToTray");
closeToTray.addEventListener("change", (event) => {
	if (closeToTray.checked) {
		localStorage.setItem("closeToTray", "true");
		ipcRenderer.send("useTray", true);
	} else {
		localStorage.setItem("closeToTray", "false");
		ipcRenderer.send("useTray", false);
	}
});
const trayEnabled = localStorage.getItem("closeToTray");
if (trayEnabled == "true") {
	closeToTray.checked = true;
	ipcRenderer.send("useTray", true);
}

// Auto updates
const autoUpdateDisabled = getId("autoUpdateDisabled");
autoUpdateDisabled.addEventListener("change", (event) => {
	if (autoUpdateDisabled.checked) {
		localStorage.setItem("autoUpdate", "false");
	} else {
		localStorage.setItem("autoUpdate", "true");
	}
});
const autoUpdate = localStorage.getItem("autoUpdate");
if (autoUpdate == "false") {
	autoUpdateDisabled.checked = true;
}

// Show more format options
const showMoreFormats = getId("showMoreFormats");
showMoreFormats.addEventListener("change", (event) => {
	if (showMoreFormats.checked) {
		localStorage.setItem("showMoreFormats", "true");
	} else {
		localStorage.setItem("showMoreFormats", "false");
	}
});
const showMoreFormatOpts = localStorage.getItem("showMoreFormats");
if (showMoreFormatOpts == "true") {
	showMoreFormats.checked = true;
}

function showPopup(text, isError = false) {
	let popupContainer = document.getElementById("popupContainer");

	if (!popupContainer) {
		popupContainer = document.createElement("div");
		popupContainer.id = "popupContainer";
		popupContainer.className = "popup-container";
		document.body.appendChild(popupContainer);
	}

	const popup = document.createElement("span");
	popup.textContent = text;
	popup.classList.add("popup-item");

	popup.style.background = isError ? "#ff6b6b" : "#54abde";

	if (isError) {
		popup.classList.add("popup-error");
	}

	popupContainer.appendChild(popup);

	setTimeout(() => {
		popup.style.opacity = "0";
		setTimeout(() => {
			popup.remove();
			if (popupContainer.childElementCount === 0) {
				popupContainer.remove();
			}
		}, 1000);
	}, 2200);
}
```

--------------------------------------------------------------------------------

````
