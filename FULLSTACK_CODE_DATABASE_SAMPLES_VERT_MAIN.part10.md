---
source_txt: fullstack_samples/VERT-main
converted_utc: 2025-12-18T11:26:37Z
part: 10
parts_total: 18
---

# FULLSTACK CODE DATABASE SAMPLES VERT-main

## Verbatim Content (Part 10 of 18)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - VERT-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/VERT-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: zh-Hans.json]---
Location: VERT-main/messages/zh-Hans.json
Signals: Docker

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "上传",
		"convert": "转换",
		"settings": "设置",
		"about": "关于",
		"toggle_theme": "切换主题"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "源代码",
		"discord_server": "Discord 服务器",
		"privacy_policy": "隐私政策"
	},
	"upload": {
		"title": "你一定会喜欢的文件转换工具。",
		"subtitle": "所有图片、音频和文档处理都在你的设备上进行。视频通过超快速服务器转换。无文件大小限制，无广告，完全开源。",
		"uploader": {
			"text": "拖放或点击以{action}",
			"convert": "转换"
		},
		"cards": {
			"title": "VERT 支持...",
			"images": "图片",
			"audio": "音频",
			"documents": "文档",
			"video": "视频",
			"video_server_processing": "服务器支持",
			"local_supported": "本地支持",
			"status": {
				"text": "<b>状态：</b>{status}",
				"ready": "就绪",
				"not_ready": "未就绪",
				"not_initialized": "未初始化",
				"downloading": "下载中...",
				"initializing": "初始化中...",
				"unknown": "未知状态"
			},
			"supported_formats": "支持的格式："
		},
		"tooltip": {
			"partial_support": "此格式仅可作为{direction}进行转换。",
			"direction_input": "输入（来源）",
			"direction_output": "输出（目标）",
			"video_server_processing": "视频默认上传到服务器进行处理，点击这里了解如何在本地设置。"
		}
	},
	"convert": {
		"archive_file": {
			"extracting": "检测到 ZIP 压缩包：{filename}",
			"extracted": "从 {filename} 中提取了 {extract_count} 个文件。{ignore_count} 个项目被忽略。",
			"extract_error": "提取 {filename} 时出错：{error}"
		},
		"large_file_warning": "由于浏览器/设备限制，此文件大于 {limit}GB，视频转音频功能已禁用。我们建议使用 Firefox 或 Safari 处理此大小的文件，因为它们的限制较少。",
		"external_warning": {
			"title": "外部服务器警告",
			"text": "如果你选择转换为视频格式，这些文件将被上传到外部服务器进行转换。是否继续？",
			"yes": "是",
			"no": "否"
		},
		"panel": {
			"convert_all": "全部转换",
			"download_all": "下载全部为 .zip",
			"remove_all": "删除所有文件",
			"set_all_to": "全部设置为",
			"na": "不适用"
		},
		"dropdown": {
			"audio": "音频",
			"video": "视频",
			"doc": "文档",
			"image": "图片",
			"placeholder": "搜索格式"
		},
		"tooltips": {
			"unknown_file": "未知文件类型",
			"audio_file": "音频文件",
			"video_file": "视频文件",
			"document_file": "文档文件",
			"image_file": "图片文件",
			"convert_file": "转换此文件",
			"download_file": "下载此文件"
		},
		"errors": {
			"cant_convert": "无法转换此文件。",
			"vertd_server": "你在做什么...？你应该运行 vertd 服务器！",
			"vertd_generic_view": "查看错误详情",
			"vertd_generic_body": "尝试转换视频时发生错误。你想将此视频提交给开发者以帮助修复此错误吗？只会发送你的视频文件，不会上传任何标识符。",
			"vertd_generic_title": "视频转换错误",
			"vertd_generic_yes": "提交视频",
			"vertd_generic_no": "不提交",
			"vertd_failed_to_keep": "无法在服务器上保留视频：{error}",
			"vertd_details": "查看错误详情",
			"vertd_details_body": "如果你按下提交，<b>你的视频也会被附加</b>在错误日志旁边，日志会自动报告给我们审核。以下信息是我们自动接收的日志：",
			"vertd_details_footer": "此信息仅用于故障排查，绝不会被共享。查看我们的[privacy_link]隐私政策[/privacy_link]了解更多详情。",
			"vertd_details_job_id": "<b>任务 ID：</b>{jobId}",
			"vertd_details_from": "<b>来源格式：</b>{from}",
			"vertd_details_to": "<b>目标格式：</b>{to}",
			"vertd_details_error_message": "<b>错误消息：</b>[view_link]查看错误日志[/view_link]",
			"vertd_details_close": "关闭",
			"unsupported_format": "仅支持图片、视频、音频和文档文件",
			"format_output_only": "此格式目前只能用作输出（转换目标），不能用作输入。",
			"vertd_not_found": "未找到 vertd 实例来开始视频转换。请确保实例 URL 设置正确。",
			"worker_downloading": "{type}转换器正在初始化，请稍候。",
			"worker_error": "{type}转换器初始化时出错，请稍后重试。",
			"worker_timeout": "{type}转换器初始化时间超出预期，请再等待一会儿或刷新页面。",
			"audio": "音频",
			"doc": "文档",
			"image": "图片"
		}
	},
	"settings": {
		"title": "设置",
		"errors": {
			"save_failed": "保存设置失败！"
		},
		"appearance": {
			"title": "外观",
			"brightness_theme": "亮度主题",
			"brightness_description": "想要阳光明媚的闪光弹，还是宁静孤独的夜晚？",
			"light": "浅色",
			"dark": "深色",
			"effect_settings": "效果设置",
			"effect_description": "你想要华丽的效果，还是更静态的体验？",
			"enable": "启用",
			"disable": "禁用"
		},
		"conversion": {
			"title": "转换",
			"advanced_settings": "高级设置",
			"filename_format": "文件名格式",
			"filename_description": "这将决定下载时的文件名，<b>不包括文件扩展名。</b>你可以在格式中使用以下模板，它们将被替换为相关信息：<b>%name%</b>表示原始文件名，<b>%extension%</b>表示原始文件扩展名，<b>%date%</b>表示文件转换时的日期字符串。",
			"placeholder": "VERT_%name%",
			"default_format": "默认转换格式",
			"default_format_description": "这将更改上传此文件类型时自动选择的默认格式。",
			"default_format_image": "图片",
			"default_format_video": "视频",
			"default_format_audio": "音频",
			"default_format_document": "文档",
			"metadata": "文件元数据",
			"metadata_description": "这将更改转换后的文件是否保留原始文件的元数据（EXIF、歌曲信息等）。",
			"keep": "保留",
			"remove": "删除",
			"quality": "转换质量",
			"quality_description": "更改输出文件的质量。值越高，处理时间和文件大小越大。",
			"quality_video": "更改视频转换的质量。质量越高，转换时间和文件大小越大。",
			"quality_audio": "音频（kbps）",
			"quality_images": "图片（%）",
			"rate": "采样率（Hz）"
		},
		"vertd": {
			"title": "视频转换",
			"status": "状态：",
			"loading": "加载中...",
			"available": "可用（提交 ID {commitId}）",
			"unavailable": "不可用（URL 正确吗？）",
			"description": "<code>vertd</code>项目是 FFmpeg 的服务器包装器。这允许你通过 VERT 网页界面方便地转换视频，同时仍能利用 GPU 的强大性能以尽可能快的速度完成转换。",
			"hosting_info": "我们为你提供了一个公共实例以方便使用，但如果你知道如何操作，在自己的电脑或服务器上托管也很容易。你可以在[vertd_link]这里[/vertd_link]下载服务器二进制文件 - 设置过程将来会变得更简单，敬请期待！",
			"instance": "实例",
			"url_placeholder": "例如：http://localhost:24153",
			"conversion_speed": "转换速度",
			"speed_description": "这描述了速度和质量之间的权衡。速度越快质量越低，但完成工作的速度更快。",
			"speeds": {
				"very_slow": "非常慢",
				"slower": "较慢",
				"slow": "慢",
				"medium": "中等",
				"fast": "快",
				"ultra_fast": "超快"
			},
			"auto_instance": "自动（推荐）",
			"eu_instance": "德国法尔肯施泰因",
			"us_instance": "美国华盛顿",
			"custom_instance": "自定义"
		},
		"privacy": {
			"title": "隐私与数据",
			"plausible_title": "Plausible 分析",
			"plausible_description": "我们使用[plausible_link]Plausible[/plausible_link]，一个注重隐私的分析工具，来收集完全匿名的统计数据。所有数据都是匿名和聚合的，不会发送或存储任何可识别信息。你可以在[analytics_link]这里[/analytics_link]查看分析数据，并在下方选择退出。",
			"opt_in": "选择加入",
			"opt_out": "选择退出",
			"cache_title": "缓存管理",
			"cache_description": "我们在浏览器中缓存转换器文件，这样你就不必每次都重新下载，从而提高性能并减少数据使用。",
			"refresh_cache": "刷新缓存",
			"clear_cache": "清除缓存",
			"files_cached": "{size}（{count}个文件）",
			"loading_cache": "加载中...",
			"total_size": "总大小",
			"files_cached_label": "已缓存文件",
			"cache_cleared": "缓存已成功清除！",
			"cache_clear_error": "清除缓存失败。",
			"site_data_title": "网站数据管理",
			"site_data_description": "清除所有网站数据，包括设置和缓存文件，将 VERT 重置为默认状态并重新加载页面。",
			"clear_all_data": "清除所有网站数据",
			"clear_all_data_confirm_title": "清除所有网站数据？",
			"clear_all_data_confirm": "这将重置所有设置和缓存，然后重新加载页面。此操作无法撤消。",
			"clear_all_data_cancel": "取消",
			"all_data_cleared": "所有网站数据已清除！正在重新加载页面...",
			"all_data_clear_error": "清除所有网站数据失败。"
		},
		"language": {
			"title": "语言",
			"description": "选择 VERT 界面的首选语言。"
		}
	},
	"about": {
		"title": "关于",
		"why": {
			"title": "为什么选择 VERT？",
			"description": "<b>文件转换器一直让我们失望。</b>它们很丑陋，充满广告，最重要的是；很慢。我们决定通过制作一个解决所有这些问题的替代方案，一劳永逸地解决这个问题。<br/><br/>所有非视频文件都完全在设备上转换；这意味着不需要在服务器之间发送和接收文件的延迟，而且我们永远不会窥探你转换的文件。<br/><br/>视频文件会上传到我们超快速的 RTX 4000 Ada 服务器。如果你不转换视频，它们会在服务器上保留一小时。如果你转换文件，视频将在服务器上保留一小时，或直到下载完成。然后文件将从我们的服务器中删除。"
		},
		"sponsors": {
			"title": "赞助商",
			"description": "想支持我们吗？请在[discord_link]Discord[/discord_link]服务器上联系开发者，或发送电子邮件至",
			"email_copied": "电子邮件已复制到剪贴板！"
		},
		"resources": {
			"title": "资源",
			"discord": "Discord",
			"source": "源代码",
			"email": "电子邮件"
		},
		"donate": {
			"title": "捐赠给 VERT",
			"description": "有了你的支持，我们可以继续维护和改进 VERT。",
			"one_time": "一次性",
			"monthly": "每月",
			"custom": "自定义",
			"pay_now": "立即支付",
			"donate_amount": "捐赠 ${amount} 美元",
			"thank_you": "感谢你的捐赠！",
			"payment_failed": "支付失败：{message}{period}你未被收费。",
			"donation_error": "处理捐赠时出错。请稍后重试。",
			"payment_error": "获取支付详情时出错。请稍后重试。"
		},
		"credits": {
			"title": "致谢",
			"contact_team": "如果你想联系开发团队，请使用“资源”卡片上的电子邮件。",
			"notable_contributors": "杰出贡献者",
			"notable_description": "我们要感谢这些人对 VERT 的重大贡献。",
			"github_contributors": "GitHub 贡献者",
			"github_description": "非常感谢所有这些人的帮助！[github_link]也想帮忙吗？[/github_link]",
			"no_contributors": "似乎还没有人贡献……[contribute_link]成为第一个贡献者！[/contribute_link]",
			"libraries": "库",
			"libraries_description": "非常感谢 FFmpeg（音频、视频）、ImageMagick（图片）和 Pandoc（文档）多年来维护如此出色的库。VERT 依赖它们为你提供转换服务。",
			"roles": {
				"lead_developer": "首席开发者；转换后端、UI 实现",
				"developer": "开发者；UI 实现",
				"designer": "设计师；用户体验、品牌、营销",
				"docker_ci": "维护 Docker 和 CI 支持",
				"former_cofounder": "前联合创始人和设计师"
			}
		},
		"errors": {
			"github_contributors": "获取 GitHub 贡献者时出错"
		}
	},
	"workers": {
		"errors": {
			"general": "转换 {file} 时出错：{message}",
			"cancel": "取消转换 {file} 时出错：{message}",
			"magick": "Magick worker 出错，图片转换可能无法正常工作。",
			"ffmpeg": "加载 ffmpeg 时出错，某些功能可能无法工作。",
			"pandoc": "加载 Pandoc worker 时出错，文档转换可能无法正常工作。",
			"no_audio": "未找到音频流。",
			"invalid_rate": "指定的采样率无效：{rate}Hz",
			"file_too_large": "此文件超过 {limit}GB 浏览器/设备限制。请尝试使用 Firefox 或 Safari 转换此大文件，它们通常具有更高的限制。"
		}
	},
	"privacy": {
		"title": "隐私政策",
		"summary": {
			"title": "摘要",
			"description": "VERT 的隐私政策非常简单：我们根本不收集或存储你的任何数据。我们不使用 cookie 或跟踪器，分析是完全私密的，所有转换（视频除外）都在你的浏览器本地进行。视频在下载后或一小时后删除，除非你明确授权存储；它只会用于故障排查。VERT 自托管 Coolify 实例用于托管网站和 vertd（用于视频转换），以及用于完全匿名和聚合分析的 Plausible 实例。<br/><br/>请注意，这可能仅适用于[vert_link]vert.sh[/vert_link]的官方 VERT 实例；第三方实例可能以不同方式处理你的数据。"
		},
		"conversions": {
			"title": "转换",
			"description": "大多数转换（图片、文档、音频）完全在你的设备上本地使用相关工具的 WebAssembly 版本（例如 ImageMagick、Pandoc、FFmpeg）进行。这意味着你的文件永远不会离开你的设备，我们也永远无法访问它们。<br/><br/>视频转换在我们的服务器上进行，因为它们需要更多的处理能力，并且目前无法在浏览器上非常快速地完成。你使用 VERT 转换的视频在下载后或一小时后删除，除非你明确授权我们将它们存储更长时间，纯粹用于故障排查。"
		},
		"conversion_errors": {
			"title": "转换错误",
			"description": "当视频转换失败时，我们可能会收集一些匿名数据以帮助我们诊断问题。这些数据可能包括：",
			"list_job_id": "任务 ID，即匿名化的文件名",
			"list_format_from": "你转换的来源格式",
			"list_format_to": "你转换的目标格式",
			"list_stderr": "你任务的 FFmpeg stderr 输出（错误消息）",
			"list_video": "实际视频文件（如果明确授权）",
			"footer": "此信息仅用于诊断转换问题。只有在你明确授权的情况下，才会收集实际视频文件，并且仅用于故障排查。"
		},
		"analytics": {
			"title": "分析",
			"description": "我们自托管 Plausible 实例用于完全匿名和聚合的分析。Plausible 不使用 cookie，并符合所有主要隐私法规（GDPR/CCPA/PECR）。你可以在[settings_link]设置[/settings_link]的“隐私与数据”部分选择退出分析，并在[plausible_link]这里[/plausible_link]阅读更多关于 Plausible 隐私实践的信息。"
		},
		"local_storage": {
			"title": "本地存储",
			"description": "我们使用浏览器的本地存储来保存你的设置，使用浏览器的会话存储来临时存储“关于”部分的 GitHub 贡献者列表，以减少重复的 GitHub API 请求。不会存储或传输任何个人数据。<br/><br/>我们使用的转换工具的 WebAssembly 版本（FFmpeg、ImageMagick、Pandoc）也会在你首次访问网站时本地存储在浏览器中，这样你就不需要每次访问时都重新下载它们。不会存储或传输任何个人数据。你可以随时在[settings_link]设置[/settings_link]的“隐私与数据”部分查看或删除这些数据。"
		},
		"contact": {
			"title": "联系",
			"description": "如有问题，请发送电子邮件至：[email_link]hello@vert.sh[/email_link]。如果你使用的是第三方 VERT 实例，请联系该实例的托管者。"
		},
		"last_updated": "最后更新：2025-10-19"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: zh-Hant.json]---
Location: VERT-main/messages/zh-Hant.json
Signals: Docker

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "上傳",
		"convert": "轉換",
		"settings": "設定",
		"about": "關於",
		"toggle_theme": "切換主題"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "原始碼",
		"discord_server": "Discord 伺服器",
		"privacy_policy": "隱私權政策"
	},
	"upload": {
		"title": "你一定會喜歡的檔案轉換工具。",
		"subtitle": "所有圖片、音訊和文件處理都在你的裝置上進行。影片透過超快速伺服器轉換。無檔案大小限制，無廣告，完全開源。",
		"uploader": {
			"text": "拖放或點擊以{action}",
			"convert": "轉換"
		},
		"cards": {
			"title": "VERT 支援...",
			"images": "圖片",
			"audio": "音訊",
			"documents": "文件",
			"video": "影片",
			"video_server_processing": "伺服器支援",
			"local_supported": "本機支援",
			"status": {
				"text": "<b>狀態：</b>{status}",
				"ready": "就緒",
				"not_ready": "未就緒",
				"not_initialized": "未初始化",
				"downloading": "下載中...",
				"initializing": "初始化中...",
				"unknown": "未知狀態"
			},
			"supported_formats": "支援的格式："
		},
		"tooltip": {
			"partial_support": "此格式僅可作為{direction}進行轉換。",
			"direction_input": "輸入（來源）",
			"direction_output": "輸出（目標）",
			"video_server_processing": "影片預設上傳到伺服器進行處理，點擊這裡了解如何在本機設定。"
		}
	},
	"convert": {
		"archive_file": {
			"extracting": "偵測到 ZIP 壓縮檔：{filename}",
			"extracted": "從 {filename} 中提取了 {extract_count} 個檔案。{ignore_count} 個項目被忽略。",
			"extract_error": "提取 {filename} 時出錯：{error}"
		},
		"large_file_warning": "由於瀏覽器/裝置限制，此檔案大於 {limit}GB，影片轉音訊功能已停用。我們建議使用 Firefox 或 Safari 處理此大小的檔案，因為它們的限制較少。",
		"external_warning": {
			"title": "外部伺服器警告",
			"text": "如果你選擇轉換為影片格式，這些檔案將被上傳到外部伺服器進行轉換。是否繼續？",
			"yes": "是",
			"no": "否"
		},
		"panel": {
			"convert_all": "全部轉換",
			"download_all": "下載全部為 .zip",
			"remove_all": "刪除所有檔案",
			"set_all_to": "全部設定為",
			"na": "不適用"
		},
		"dropdown": {
			"audio": "音訊",
			"video": "影片",
			"doc": "文件",
			"image": "圖片",
			"placeholder": "搜尋格式"
		},
		"tooltips": {
			"unknown_file": "未知檔案類型",
			"audio_file": "音訊檔案",
			"video_file": "影片檔案",
			"document_file": "文件檔案",
			"image_file": "圖片檔案",
			"convert_file": "轉換此檔案",
			"download_file": "下載此檔案"
		},
		"errors": {
			"cant_convert": "無法轉換此檔案。",
			"vertd_server": "你在做什麼...？你應該執行 vertd 伺服器！",
			"vertd_generic_view": "檢視錯誤詳情",
			"vertd_generic_body": "嘗試轉換影片時發生錯誤。你想將此影片提交給開發者以協助修復此錯誤嗎？只會傳送你的影片檔案，不會上傳任何識別碼。",
			"vertd_generic_title": "影片轉換錯誤",
			"vertd_generic_yes": "提交影片",
			"vertd_generic_no": "不提交",
			"vertd_failed_to_keep": "無法在伺服器上保留影片：{error}",
			"vertd_details": "檢視錯誤詳情",
			"vertd_details_body": "如果你按下提交，<b>你的影片也會被附加</b>在錯誤日誌旁邊，日誌會自動報告給我們審核。以下資訊是我們自動接收的日誌：",
			"vertd_details_footer": "此資訊僅用於故障排除，絕不會被分享。檢視我們的[privacy_link]隱私權政策[/privacy_link]以了解更多詳情。",
			"vertd_details_job_id": "<b>任務 ID：</b>{jobId}",
			"vertd_details_from": "<b>來源格式：</b>{from}",
			"vertd_details_to": "<b>目標格式：</b>{to}",
			"vertd_details_error_message": "<b>錯誤訊息：</b>[view_link]檢視錯誤日誌[/view_link]",
			"vertd_details_close": "關閉",
			"unsupported_format": "僅支援圖片、影片、音訊和文件檔案",
			"format_output_only": "此格式目前只能用作輸出（轉換目標），不能用作輸入。",
			"vertd_not_found": "未找到 vertd 執行個體來開始影片轉換。請確保執行個體 URL 設定正確。",
			"worker_downloading": "{type}轉換器正在初始化，請稍候。",
			"worker_error": "{type}轉換器初始化時出錯，請稍後重試。",
			"worker_timeout": "{type}轉換器初始化時間超出預期，請再等待一會兒或重新整理頁面。",
			"audio": "音訊",
			"doc": "文件",
			"image": "圖片"
		}
	},
	"settings": {
		"title": "設定",
		"errors": {
			"save_failed": "儲存設定失敗！"
		},
		"appearance": {
			"title": "外觀",
			"brightness_theme": "亮度主題",
			"brightness_description": "想要陽光明媚的閃光彈，還是寧靜孤獨的夜晚？",
			"light": "淺色",
			"dark": "深色",
			"effect_settings": "效果設定",
			"effect_description": "你想要華麗的效果，還是更靜態的體驗？",
			"enable": "啟用",
			"disable": "停用"
		},
		"conversion": {
			"title": "轉換",
			"advanced_settings": "進階設定",
			"filename_format": "檔案名稱格式",
			"filename_description": "這將決定下載時的檔案名稱，<b>不包括副檔名。</b>你可以在格式中使用以下範本，它們將被替換為相關資訊：<b>%name%</b>表示原始檔案名稱，<b>%extension%</b>表示原始副檔名，<b>%date%</b>表示檔案轉換時的日期字串。",
			"placeholder": "VERT_%name%",
			"default_format": "預設轉換格式",
			"default_format_description": "這將更改上傳此檔案類型時自動選擇的預設格式。",
			"default_format_image": "圖片",
			"default_format_video": "影片",
			"default_format_audio": "音訊",
			"default_format_document": "文件",
			"metadata": "檔案中繼資料",
			"metadata_description": "這將更改轉換後的檔案是否保留原始檔案的中繼資料（EXIF、歌曲資訊等）。",
			"keep": "保留",
			"remove": "移除",
			"quality": "轉換品質",
			"quality_description": "更改輸出檔案的品質。值越高，處理時間和檔案大小越大。",
			"quality_video": "更改影片轉換的品質。品質越高，轉換時間和檔案大小越大。",
			"quality_audio": "音訊（kbps）",
			"quality_images": "圖片（%）",
			"rate": "取樣率（Hz）"
		},
		"vertd": {
			"title": "影片轉換",
			"status": "狀態：",
			"loading": "載入中...",
			"available": "可用（提交 ID {commitId}）",
			"unavailable": "不可用（URL 正確嗎？）",
			"description": "<code>vertd</code>專案是 FFmpeg 的伺服器包裝器。這允許你透過 VERT 網頁介面方便地轉換影片，同時仍能利用 GPU 的強大效能以儘可能快的速度完成轉換。",
			"hosting_info": "我們為你提供了一個公共執行個體以方便使用，但如果你知道如何操作，在自己的電腦或伺服器上託管也很容易。你可以在[vertd_link]這裡[/vertd_link]下載伺服器二進位檔案 - 設定程序將來會變得更簡單，敬請期待！",
			"instance": "執行個體",
			"url_placeholder": "例如：http://localhost:24153",
			"conversion_speed": "轉換速度",
			"speed_description": "這描述了速度和品質之間的權衡。速度越快品質越低，但完成工作的速度更快。",
			"speeds": {
				"very_slow": "非常慢",
				"slower": "較慢",
				"slow": "慢",
				"medium": "中等",
				"fast": "快",
				"ultra_fast": "超快"
			},
			"auto_instance": "自動（建議）",
			"eu_instance": "德國法爾肯施泰因",
			"us_instance": "美國華盛頓",
			"custom_instance": "自訂"
		},
		"privacy": {
			"title": "隱私權與資料",
			"plausible_title": "Plausible 分析",
			"plausible_description": "我們使用[plausible_link]Plausible[/plausible_link]，一個注重隱私權的分析工具，來收集完全匿名的統計資料。所有資料都是匿名和彙總的，不會傳送或儲存任何可識別資訊。你可以在[analytics_link]這裡[/analytics_link]檢視分析資料，並在下方選擇退出。",
			"opt_in": "選擇加入",
			"opt_out": "選擇退出",
			"cache_title": "快取管理",
			"cache_description": "我們在瀏覽器中快取轉換器檔案，這樣你就不必每次都重新下載，從而提高效能並減少資料使用。",
			"refresh_cache": "重新整理快取",
			"clear_cache": "清除快取",
			"files_cached": "{size}（{count}個檔案）",
			"loading_cache": "載入中...",
			"total_size": "總大小",
			"files_cached_label": "已快取檔案",
			"cache_cleared": "快取已成功清除！",
			"cache_clear_error": "清除快取失敗。",
			"site_data_title": "網站資料管理",
			"site_data_description": "清除所有網站資料，包括設定和快取檔案，將 VERT 重置為預設狀態並重新載入頁面。",
			"clear_all_data": "清除所有網站資料",
			"clear_all_data_confirm_title": "清除所有網站資料？",
			"clear_all_data_confirm": "這將重置所有設定和快取，然後重新載入頁面。此操作無法復原。",
			"clear_all_data_cancel": "取消",
			"all_data_cleared": "所有網站資料已清除！正在重新載入頁面...",
			"all_data_clear_error": "清除所有網站資料失敗。"
		},
		"language": {
			"title": "語言",
			"description": "選擇 VERT 介面的偏好語言。"
		}
	},
	"about": {
		"title": "關於",
		"why": {
			"title": "為什麼選擇 VERT？",
			"description": "<b>檔案轉換器一直讓我們失望。</b>它們很醜陋，充滿廣告，最重要的是；很慢。我們決定透過製作一個解決所有這些問題的替代方案，一勞永逸地解決這個問題。<br/><br/>所有非影片檔案都完全在裝置上轉換；這意味著不需要在伺服器之間傳送和接收檔案的延遲，而且我們永遠不會窺探你轉換的檔案。<br/><br/>影片檔案會上傳到我們超快速的 RTX 4000 Ada 伺服器。如果你不轉換影片，它們會在伺服器上保留一小時。如果你轉換檔案，影片將在伺服器上保留一小時，或直到下載完成。然後檔案將從我們的伺服器中刪除。"
		},
		"sponsors": {
			"title": "贊助商",
			"description": "想支援我們嗎？請在[discord_link]Discord[/discord_link]伺服器上聯絡開發者，或傳送電子郵件至",
			"email_copied": "電子郵件已複製到剪貼簿！"
		},
		"resources": {
			"title": "資源",
			"discord": "Discord",
			"source": "原始碼",
			"email": "電子郵件"
		},
		"donate": {
			"title": "捐贈給 VERT",
			"description": "有了你的支援，我們可以繼續維護和改進 VERT。",
			"one_time": "一次性",
			"monthly": "每月",
			"custom": "自訂",
			"pay_now": "立即付款",
			"donate_amount": "捐贈 ${amount} 美元",
			"thank_you": "感謝你的捐贈！",
			"payment_failed": "付款失敗：{message}{period}你未被收費。",
			"donation_error": "處理捐贈時出錯。請稍後重試。",
			"payment_error": "取得付款詳情時出錯。請稍後重試。"
		},
		"credits": {
			"title": "致謝",
			"contact_team": "如果你想聯絡開發團隊，請使用「資源」卡片上的電子郵件。",
			"notable_contributors": "傑出貢獻者",
			"notable_description": "我們要感謝這些人對 VERT 的重大貢獻。",
			"github_contributors": "GitHub 貢獻者",
			"github_description": "非常感謝所有這些人的協助！[github_link]也想幫忙嗎？[/github_link]",
			"no_contributors": "似乎還沒有人貢獻……[contribute_link]成為第一個貢獻者！[/contribute_link]",
			"libraries": "程式庫",
			"libraries_description": "非常感謝 FFmpeg（音訊、影片）、ImageMagick（圖片）和 Pandoc（文件）多年來維護如此出色的程式庫。VERT 依賴它們為你提供轉換服務。",
			"roles": {
				"lead_developer": "首席開發者；轉換後端、UI 實作",
				"developer": "開發者；UI 實作",
				"designer": "設計師；使用者體驗、品牌、行銷",
				"docker_ci": "維護 Docker 和 CI 支援",
				"former_cofounder": "前共同創辦人和設計師"
			}
		},
		"errors": {
			"github_contributors": "取得 GitHub 貢獻者時出錯"
		}
	},
	"workers": {
		"errors": {
			"general": "轉換 {file} 時出錯：{message}",
			"cancel": "取消轉換 {file} 時出錯：{message}",
			"magick": "Magick worker 出錯，圖片轉換可能無法正常運作。",
			"ffmpeg": "載入 ffmpeg 時出錯，某些功能可能無法運作。",
			"pandoc": "載入 Pandoc worker 時出錯，文件轉換可能無法正常運作。",
			"no_audio": "未找到音訊串流。",
			"invalid_rate": "指定的取樣率無效：{rate}Hz",
			"file_too_large": "此檔案超過 {limit}GB 瀏覽器/裝置限制。請嘗試使用 Firefox 或 Safari 轉換此大型檔案，它們通常具有較高的限制。"
		}
	},
	"privacy": {
		"title": "隱私權政策",
		"summary": {
			"title": "摘要",
			"description": "VERT 的隱私權政策非常簡單：我們根本不收集或儲存你的任何資料。我們不使用 cookie 或追蹤器，分析是完全私密的，所有轉換（影片除外）都在你的瀏覽器本機進行。影片在下載後或一小時後刪除，除非你明確授權儲存；它只會用於故障排除。VERT 自託管 Coolify 執行個體用於託管網站和 vertd（用於影片轉換），以及用於完全匿名和彙總分析的 Plausible 執行個體。<br/><br/>請注意，這可能僅適用於[vert_link]vert.sh[/vert_link]的官方 VERT 執行個體；第三方執行個體可能以不同方式處理你的資料。"
		},
		"conversions": {
			"title": "轉換",
			"description": "大多數轉換（圖片、文件、音訊）完全在你的裝置上本機使用相關工具的 WebAssembly 版本（例如 ImageMagick、Pandoc、FFmpeg）進行。這意味著你的檔案永遠不會離開你的裝置，我們也永遠無法存取它們。<br/><br/>影片轉換在我們的伺服器上進行，因為它們需要更多的處理能力，並且目前無法在瀏覽器上非常快速地完成。你使用 VERT 轉換的影片在下載後或一小時後刪除，除非你明確授權我們將它們儲存更長時間，純粹用於故障排除。"
		},
		"conversion_errors": {
			"title": "轉換錯誤",
			"description": "當影片轉換失敗時，我們可能會收集一些匿名資料以協助我們診斷問題。這些資料可能包括：",
			"list_job_id": "任務 ID，即匿名化的檔案名稱",
			"list_format_from": "你轉換的來源格式",
			"list_format_to": "你轉換的目標格式",
			"list_stderr": "你任務的 FFmpeg stderr 輸出（錯誤訊息）",
			"list_video": "實際影片檔案（如果明確授權）",
			"footer": "此資訊僅用於診斷轉換問題。只有在你明確授權的情況下，才會收集實際影片檔案，並且僅用於故障排除。"
		},
		"analytics": {
			"title": "分析",
			"description": "我們自託管 Plausible 執行個體用於完全匿名和彙總的分析。Plausible 不使用 cookie，並符合所有主要隱私權法規（GDPR/CCPA/PECR）。你可以在[settings_link]設定[/settings_link]的「隱私權與資料」部分選擇退出分析，並在[plausible_link]這裡[/plausible_link]閱讀更多關於 Plausible 隱私權實務的資訊。"
		},
		"local_storage": {
			"title": "本機儲存",
			"description": "我們使用瀏覽器的本機儲存來儲存你的設定，使用瀏覽器的工作階段儲存來暫時儲存「關於」部分的 GitHub 貢獻者清單，以減少重複的 GitHub API 請求。不會儲存或傳輸任何個人資料。<br/><br/>我們使用的轉換工具的 WebAssembly 版本（FFmpeg、ImageMagick、Pandoc）也會在你首次造訪網站時本機儲存在瀏覽器中，這樣你就不需要每次造訪時都重新下載它們。不會儲存或傳輸任何個人資料。你可以隨時在[settings_link]設定[/settings_link]的「隱私權與資料」部分檢視或刪除這些資料。"
		},
		"contact": {
			"title": "聯絡",
			"description": "如有問題，請傳送電子郵件至：[email_link]hello@vert.sh[/email_link]。如果你使用的是第三方 VERT 執行個體，請聯絡該執行個體的託管者。"
		},
		"last_updated": "最後更新：2025-10-19"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: default-ssl.conf]---
Location: VERT-main/nginx/default-ssl.conf

```text
server {
    listen 80;
    server_name vert;

    # Redirect all HTTP traffic to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name vert;

    ssl_certificate     /etc/ssl/vert/vert.crt;
    ssl_certificate_key /etc/ssl/vert/vert.key;

    root /usr/share/nginx/html;
    index index.html;

    client_max_body_size 10M;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        try_files $uri $uri/ /index.html;
    }
    
    error_page 404 /index.html;
}
```

--------------------------------------------------------------------------------

---[FILE: default.conf]---
Location: VERT-main/nginx/default.conf

```text
server {
    listen 80;
    listen [::]:80;
    server_name vert;

    root /usr/share/nginx/html;
    index index.html;

    client_max_body_size 10M;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    location / {
        try_files $uri $uri/ /index.html;
    }
    
    error_page 404 /index.html;
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: VERT-main/project.inlang/.gitignore

```text
cache
```

--------------------------------------------------------------------------------

---[FILE: project_id]---
Location: VERT-main/project.inlang/project_id

```text
ff77Td2rnvEqQyzBYT
```

--------------------------------------------------------------------------------

---[FILE: settings.json]---
Location: VERT-main/project.inlang/settings.json

```json
{
	"$schema": "https://inlang.com/schema/project-settings",
	"baseLocale": "en",
	"locales": [
		"en",
		"es",
		"fr",
		"de",
		"it",
		"ba",
		"hr",
		"tr",
		"ja",
		"ko",
		"el",
		"id",
		"zh-Hans",
		"zh-Hant",
		"pt-BR"
	],
	"modules": [
		"https://cdn.jsdelivr.net/npm/@inlang/plugin-message-format@4/dist/index.js",
		"https://cdn.jsdelivr.net/npm/@inlang/plugin-m-function-matcher@2/dist/index.js"
	],
	"plugin.inlang.messageFormat": {
		"pathPattern": "./messages/{locale}.json"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: app.d.ts]---
Location: VERT-main/src/app.d.ts

```typescript
import "@poppanator/sveltekit-svg/dist/svg";

type EventPayload = {
	readonly n: string;
	readonly u: Location["href"];
	readonly d: Location["hostname"];
	readonly r: Document["referrer"] | null;
	readonly w: Window["innerWidth"];
	readonly h: 1 | 0;
	readonly p?: string;
};

type CallbackArgs = {
	readonly status: number;
};

type EventOptions = {
	/**
	 * Callback called when the event is successfully sent.
	 */
	readonly callback?: (args: CallbackArgs) => void;
	/**
	 * Properties to be bound to the event.
	 */
	readonly props?: { readonly [propName: string]: string | number | boolean };
};

declare global {
	interface Window {
		plausible: TrackEvent;
	}

	const __COMMIT_HASH__: string;
}

/**
 * Options used when initializing the tracker.
 */
export type PlausibleInitOptions = {
	/**
	 * If true, pageviews will be tracked when the URL hash changes.
	 * Enable this if you are using a frontend that uses hash-based routing.
	 */
	readonly hashMode?: boolean;
	/**
	 * Set to true if you want events to be tracked when running the site locally.
	 */
	readonly trackLocalhost?: boolean;
	/**
	 * The domain to bind the event to.
	 * Defaults to `location.hostname`
	 */
	readonly domain?: Location["hostname"];
	/**
	 * The API host where the events will be sent.
	 * Defaults to `'https://plausible.io'`
	 */
	readonly apiHost?: string;
};

/**
 * Data passed to Plausible as events.
 */
export type PlausibleEventData = {
	/**
	 * The URL to bind the event to.
	 * Defaults to `location.href`.
	 */
	readonly url?: Location["href"];
	/**
	 * The referrer to bind the event to.
	 * Defaults to `document.referrer`
	 */
	readonly referrer?: Document["referrer"] | null;
	/**
	 * The current device's width.
	 * Defaults to `window.innerWidth`
	 */
	readonly deviceWidth?: Window["innerWidth"];
};

/**
 * Options used when tracking Plausible events.
 */
export type PlausibleOptions = PlausibleInitOptions & PlausibleEventData;

/**
 * Tracks a custom event.
 *
 * Use it to track your defined goals by providing the goal's name as `eventName`.
 *
 * ### Example
 * ```js
 * import Plausible from 'plausible-tracker'
 *
 * const { trackEvent } = Plausible()
 *
 * // Tracks the 'signup' goal
 * trackEvent('signup')
 *
 * // Tracks the 'Download' goal passing a 'method' property.
 * trackEvent('Download', { props: { method: 'HTTP' } })
 * ```
 *
 * @param eventName - Name of the event to track
 * @param options - Event options.
 * @param eventData - Optional event data to send. Defaults to the current page's data merged with the default options provided earlier.
 */
type TrackEvent = (
	eventName: string,
	options?: EventOptions,
	eventData?: PlausibleOptions,
) => void;

/**
 * Manually tracks a page view.
 *
 * ### Example
 * ```js
 * import Plausible from 'plausible-tracker'
 *
 * const { trackPageview } = Plausible()
 *
 * // Track a page view
 * trackPageview()
 * ```
 *
 * @param eventData - Optional event data to send. Defaults to the current page's data merged with the default options provided earlier.
 * @param options - Event options.
 */
type TrackPageview = (
	eventData?: PlausibleOptions,
	options?: EventOptions,
) => void;

/**
 * Cleans up all event listeners attached.
 */
type Cleanup = () => void;

/**
 * Tracks the current page and all further pages automatically.
 *
 * Call this if you don't want to manually manage pageview tracking.
 *
 * ### Example
 * ```js
 * import Plausible from 'plausible-tracker'
 *
 * const { enableAutoPageviews } = Plausible()
 *
 * // This tracks the current page view and all future ones as well
 * enableAutoPageviews()
 * ```
 *
 * The returned value is a callback that removes the added event listeners and restores `history.pushState`
 * ```js
 * import Plausible from 'plausible-tracker'
 *
 * const { enableAutoPageviews } = Plausible()
 *
 * const cleanup = enableAutoPageviews()
 *
 * // Remove event listeners and restore `history.pushState`
 * cleanup()
 * ```
 */
type EnableAutoPageviews = () => Cleanup;

/**
 * Tracks all outbound link clicks automatically
 *
 * Call this if you don't want to manually manage these links.
 *
 * It works using a **[MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)** to automagically detect link nodes throughout your application and bind `click` events to them.
 *
 * Optionally takes the same parameters as [`MutationObserver.observe`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe).
 *
 * ### Example
 * ```js
 * import Plausible from 'plausible-tracker'
 *
 * const { enableAutoOutboundTracking } = Plausible()
 *
 * // This tracks all the existing and future outbound links on your page.
 * enableAutoOutboundTracking()
 * ```
 *
 * The returned value is a callback that removes the added event listeners and disconnects the observer
 * ```js
 * import Plausible from 'plausible-tracker'
 *
 * const { enableAutoOutboundTracking } = Plausible()
 *
 * const cleanup = enableAutoOutboundTracking()
 *
 * // Remove event listeners and disconnect the observer
 * cleanup()
 * ```
 */
type EnableAutoOutboundTracking = (
	targetNode?: Node & ParentNode,
	observerInit?: MutationObserverInit,
) => Cleanup;

/**
 * Initializes the tracker with your default values.
 *
 * ### Example (es module)
 * ```js
 * import Plausible from 'plausible-tracker'
 *
 * const { enableAutoPageviews, trackEvent } = Plausible({
 *   domain: 'my-app-domain.com',
 *   hashMode: true
 * })
 *
 * enableAutoPageviews()
 *
 * function onUserRegister() {
 *   trackEvent('register')
 * }
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var Plausible = require('plausible-tracker');
 *
 * var { enableAutoPageviews, trackEvent } = Plausible({
 *   domain: 'my-app-domain.com',
 *   hashMode: true
 * })
 *
 * enableAutoPageviews()
 *
 * function onUserRegister() {
 *   trackEvent('register')
 * }
 * ```
 *
 * @param defaults - Default event parameters that will be applied to all requests.
 */

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module "svelte/elements" {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface HTMLAttributes<T> {
		[key: `event-${string}`]: string | undefined | null;
	}
}

export {};
```

--------------------------------------------------------------------------------

---[FILE: app.html]---
Location: VERT-main/src/app.html

```text
<!doctype html>
<html lang="%lang%">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<link rel="apple-touch-icon" href="%sveltekit.assets%/favicon.png" />

		<link
			rel="apple-touch-startup-image"
			href="%sveltekit.assets%/lettermark.jpg"
		/>
		<meta name="mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta
			name="apple-mobile-web-app-status-bar-style"
			content="black-translucent"
		/>

		%sveltekit.head%
		<script>
			(function () {
				// Apply theme before DOM is loaded
				let theme = localStorage.getItem("theme");
				const prefersDark = window.matchMedia(
					"(prefers-color-scheme: dark)",
				).matches;
				console.log(
					`Theme: ${theme || "N/A"}, prefers dark: ${prefersDark}`,
				);

				if (theme !== "light" && theme !== "dark") {
					console.log("Invalid theme, setting to default");
					theme = prefersDark ? "dark" : "light";
					localStorage.setItem("theme", theme);
				}

				console.log(`Applying theme: ${theme}`);
				document.documentElement.classList.add(theme);

				// Lock dark reader if it's set to dark mode
				if (theme === "dark") {
					const lock = document.createElement("meta");
					lock.name = "darkreader-lock";
					document.head.appendChild(lock);
				}
			})();
		</script>
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: hooks.server.ts]---
Location: VERT-main/src/hooks.server.ts

```typescript
import type { Handle } from "@sveltejs/kit";
import { paraglideMiddleware } from "$lib/paraglide/server";

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(
		event.request,
		({ request: localizedRequest, locale }) => {
			event.request = localizedRequest;
			return resolve(event, {
				transformPageChunk: ({ html }) => {
					return html.replace("%lang%", locale);
				},
			});
		},
	);

export const handle: Handle = paraglideHandle;
```

--------------------------------------------------------------------------------

---[FILE: hooks.ts]---
Location: VERT-main/src/hooks.ts

```typescript
import type { Reroute } from "@sveltejs/kit";
import { deLocalizeUrl } from "$lib/paraglide/runtime";

export const reroute: Reroute = (request) => {
	return deLocalizeUrl(request.url).pathname;
};
```

--------------------------------------------------------------------------------

````
