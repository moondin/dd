---
source_txt: fullstack_samples/VERT-main
converted_utc: 2025-12-18T11:26:37Z
part: 6
parts_total: 18
---

# FULLSTACK CODE DATABASE SAMPLES VERT-main

## Verbatim Content (Part 6 of 18)

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

---[FILE: en.json]---
Location: VERT-main/messages/en.json
Signals: Docker

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "Upload",
		"convert": "Convert",
		"settings": "Settings",
		"about": "About",
		"toggle_theme": "Toggle theme"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "Source code",
		"discord_server": "Discord server",
		"privacy_policy": "Privacy policy"
	},
	"upload": {
		"title": "The file converter you'll love.",
		"subtitle": "All image, audio, and document processing is done on your device. Videos are converted on our lightning-fast servers. No file size limit, no ads, and completely open source.",
		"uploader": {
			"text": "Drop or click to {action}",
			"convert": "convert"
		},
		"cards": {
			"title": "VERT supports...",
			"images": "Images",
			"audio": "Audio",
			"documents": "Documents",
			"video": "Video",
			"video_server_processing": "Server supported",
			"local_supported": "Local supported",
			"status": {
				"text": "<b>Status:</b> {status}",
				"ready": "ready",
				"not_ready": "not ready",
				"not_initialized": "not initialized",
				"downloading": "downloading...",
				"initializing": "initializing...",
				"unknown": "unknown status"
			},
			"supported_formats": "Supported formats:"
		},
		"tooltip": {
			"partial_support": "This format can only be converted as {direction}.",
			"direction_input": "input (from)",
			"direction_output": "output (to)",
			"video_server_processing": "Video uploads to a server for processing by default, learn how to set it up locally here."
		}
	},
	"convert": {
		"archive_file": {
			"extract": "Extract archive",
			"extracting": "Detected archive: {filename}",
			"extracted": "Extracted {extract_count} files from {filename}. {ignore_count} items were ignored.",
			"detected": "Detected {type} files in {filename}.",
			"audio": "audio",
			"video": "video",
			"doc": "document",
			"image": "image",
			"extract_error": "Error extracting {filename}: {error}"
		},
		"large_file_warning": "Due to browser / device limitations, video to audio conversion is disabled for this file as it is larger than {limit}GB. We recommend using Firefox or Safari for files of this size since they have less limitations.",
		"external_warning": {
			"title": "External server warning",
			"text": "If you choose to convert into a video format, those files will be uploaded to an external server to be converted. Do you want to continue?",
			"yes": "Yes",
			"no": "No"
		},
		"panel": {
			"convert_all": "Convert all",
			"download_all": "Download all as .zip",
			"remove_all": "Remove all files",
			"set_all_to": "Set all to",
			"na": "N/A"
		},
		"dropdown": {
			"audio": "Audio",
			"video": "Video",
			"doc": "Document",
			"image": "Image",
			"placeholder": "Search format",
			"no_formats": "No formats available",
			"no_results": "No formats match your search"
		},
		"tooltips": {
			"unknown_file": "Unknown file type",
			"audio_file": "Audio file",
			"video_file": "Video file",
			"document_file": "Document file",
			"image_file": "Image file",
			"convert_file": "Convert this file",
			"download_file": "Download this file"
		},
		"errors": {
			"cant_convert": "We can't convert this file.",
			"vertd_server": "what are you doing..? you're supposed to run the vertd server!",
			"vertd_generic_view": "View error details",
			"vertd_generic_body": "An error occurred whilst whilst trying convert your video. Would you like to submit this video to the developers to help fix this bug? Only your video file will be sent. No identifiers will be uploaded.",
			"vertd_generic_title": "Video conversion error",
			"vertd_generic_yes": "Submit video",
			"vertd_generic_no": "Don't submit",
			"vertd_failed_to_keep": "Failed to keep the video on the server: {error}",
			"vertd_details": "View error details",
			"vertd_details_body": "If you press submit, <b>your video will also be attached</b> alongside the error log which is always reported to us for review. The following information is the log that we automatically receive:",
			"vertd_details_footer": "This information will only be used for troubleshooting purposes and will never be shared. View our [privacy_link]privacy policy[/privacy_link] for more details.",
			"vertd_details_job_id": "<b>Job ID:</b> {jobId}",
			"vertd_details_from": "<b>From format:</b> {from}",
			"vertd_details_to": "<b>To format:</b> {to}",
			"vertd_details_error_message": "<b>Error message:</b> [view_link]View error logs[/view_link]",
			"vertd_details_close": "Close",
			"vertd_ratelimit": "Your video, '{filename}', has failed to convert a few times. To prevent server overload, further conversion attempts for this file have been temporarily blocked. Please try again later.",
			"unsupported_format": "Only image, video, audio, and document files are supported",
			"format_output_only": "This format can currently only be used as output (converted to), not as input.",
			"vertd_not_found": "Could not find the vertd instance to start video conversion. Are you sure the instance URL is set correctly?",
			"worker_downloading": "The {type} converter is currently being initialized, please wait a few moments.",
			"worker_error": "The {type} converter had an error during initialization, please try again later.",
			"worker_timeout": "The {type} converter is taking longer than expected to initialize, please wait a few more moments or refresh the page.",
			"audio": "audio",
			"doc": "document",
			"image": "image"
		}
	},
	"settings": {
		"title": "Settings",
		"errors": {
			"save_failed": "Failed to save settings!"
		},
		"appearance": {
			"title": "Appearance",
			"brightness_theme": "Brightness theme",
			"brightness_description": "Want a sunny flash-bang, or a quiet lonely night?",
			"light": "Light",
			"dark": "Dark",
			"effect_settings": "Effect settings",
			"effect_description": "Would you like fancy effects, or a more static experience?",
			"enable": "Enable",
			"disable": "Disable"
		},
		"conversion": {
			"title": "Conversion",
			"advanced_settings": "Advanced settings",
			"filename_format": "File name format",
			"filename_description": "This will determine the name of the file on download, <b>not including the file extension.</b> You can put these following templates in the format, which will be replaced with the relevant information: <b>%name%</b> for the original file name, <b>%extension%</b> for the original file extension, and <b>%date%</b> for a date string of when the file was converted.",
			"placeholder": "VERT_%name%",
			"default_format": "Default conversion format",
			"default_format_enable": "Enable",
			"default_format_disable": "Disable",
			"default_format_description": "This will change the default format selected when you upload a file of this file type.",
			"default_format_image": "Images",
			"default_format_video": "Videos",
			"default_format_audio": "Audio",
			"default_format_document": "Documents",
			"metadata": "File metadata",
			"metadata_description": "This changes whether any metadata (EXIF, song info, etc.) on the original file is preserved in converted files.",
			"keep": "Keep",
			"remove": "Remove",
			"quality": "Conversion quality",
			"quality_description": "This changes the default output quality of the converted files (in its category). Higher values may result in longer conversion times and file size.",
			"quality_video": "This changes the default output quality of the converted video files. Higher values may result in longer conversion times and file size.",
			"quality_audio": "Audio (kbps)",
			"quality_images": "Image (%)",
			"rate": "Sample rate (Hz)"
		},
		"vertd": {
			"title": "Video conversion",
			"status": "status:",
			"loading": "loading...",
			"available": "available, commit id {commitId}",
			"unavailable": "unavailable (is the url right?)",
			"description": "The <code>vertd</code> project is a server wrapper for FFmpeg. This allows you to convert videos through the convenience of VERT's web interface, while still being able to harness the power of your GPU to do it as quickly as possible.",
			"hosting_info": "We host a public instance for your convenience, but it is quite easy to host your own on your PC or server if you know what you are doing. You can download the server binaries [vertd_link]here[/vertd_link] - the process of setting this up will become easier in the future, so stay tuned!",
			"instance": "Instance",
			"url_placeholder": "Example: http://localhost:24153",
			"conversion_speed": "Conversion speed",
			"speed_description": "This describes the tradeoff between speed and quality. Faster speeds will result in lower quality, but will get the job done quicker.",
			"speeds": {
				"very_slow": "Very Slow",
				"slower": "Slower",
				"slow": "Slow",
				"medium": "Medium",
				"fast": "Fast",
				"ultra_fast": "Ultra Fast"
			},
			"auto_instance": "Auto (recommended)",
			"eu_instance": "Falkenstein, Germany",
			"us_instance": "Washington, USA",
			"custom_instance": "Custom"
		},
		"privacy": {
			"title": "Privacy & data",
			"plausible_title": "Plausible analytics",
			"plausible_description": "We use [plausible_link]Plausible[/plausible_link], a privacy-focused analytics tool, to gather completely anonymous statistics. All data is anonymized and aggregated, and no identifiable information is ever sent or stored. You can view the analytics [analytics_link]here[/analytics_link] and choose to opt out below.",
			"opt_in": "Opt-in",
			"opt_out": "Opt-out",
			"cache_title": "Cache management",
			"cache_description": "We cache the converter files on your browser so you don't have to re-download them every time, improving performance and reducing data usage.",
			"refresh_cache": "Refresh cache",
			"clear_cache": "Clear cache",
			"files_cached": "{size} ({count} files)",
			"loading_cache": "Loading...",
			"total_size": "Total Size",
			"files_cached_label": "Files Cached",
			"cache_cleared": "Cache cleared successfully!",
			"cache_clear_error": "Failed to clear cache.",
			"site_data_title": "Site data management",
			"site_data_description": "Clear all site data including settings and cached files, resetting VERT to its default state and reloading the page.",
			"clear_all_data": "Clear all site data",
			"clear_all_data_confirm_title": "Clear all site data?",
			"clear_all_data_confirm": "This will reset all settings & cache, then reload the page. This action cannot be undone.",
			"clear_all_data_cancel": "Cancel",
			"all_data_cleared": "All site data cleared! Reloading page...",
			"all_data_clear_error": "Failed to clear all site data."
		},
		"language": {
			"title": "Language",
			"description": "Select your preferred language for the VERT interface."
		}
	},
	"about": {
		"title": "About",
		"why": {
			"title": "Why VERT?",
			"description": "<b>File converters have always disappointed us.</b> They're ugly, riddled with ads, and most importantly; slow. We decided to solve this problem once and for all by making an alternative that solves all those problems, and more.<br/><br/>All non-video files are converted completely on-device; this means that there's no delay between sending and receiving the files from a server, and we never get to snoop on the files you convert.<br/><br/>Video files get uploaded to our lightning-fast RTX 4000 Ada server. Your videos stay on there for an hour if you do not convert them. If you do convert the file, the video will stay on the server for an hour, or until it is downloaded. The file will then be deleted from our server."
		},
		"sponsors": {
			"title": "Sponsors",
			"description": "Want to support us? Contact a developer in the [discord_link]Discord[/discord_link] server, or send an email to",
			"email_copied": "Email copied to clipboard!"
		},
		"resources": {
			"title": "Resources",
			"discord": "Discord",
			"source": "Source",
			"email": "Email"
		},
		"donate": {
			"title": "Donate to VERT",
			"description": "With your support, we can keep maintaining and improving VERT.",
			"one_time": "One-time",
			"monthly": "Monthly",
			"custom": "Custom",
			"pay_now": "Pay now",
			"donate_amount": "Donate ${amount} USD",
			"thank_you": "Thank you for your donation!",
			"payment_failed": "Payment failed: {message}{period} You have not been charged.",
			"donation_error": "An error occurred while processing your donation. Please try again later.",
			"payment_error": "Error fetching payment details. Please try again later.",
			"donation_notice_official": "Your donations here go to the official VERT instance (vert.sh), and helps to support the development of the project.",
			"donation_notice_unofficial": "Your donations here go to the operator of this VERT instance. If you wish to support the official VERT developers, please visit [official_link]vert.sh[/official_link] instead."
		},
		"credits": {
			"title": "Credits",
			"contact_team": "If you would like to contact the development team, please use the email found on the \"Resources\" card.",
			"notable_contributors": "Notable contributors",
			"notable_description": "We'd like to thank these people for their major contributions to VERT.",
			"github_contributors": "GitHub contributors",
			"github_description": "Big thanks to all these people for helping out! [github_link]Want to help too?[/github_link]",
			"no_contributors": "Seems like no one has contributed yet... [contribute_link]be the first to contribute![/contribute_link]",
			"libraries": "Libraries",
			"libraries_description": "A big thanks to FFmpeg (audio, video), ImageMagick (images) and Pandoc (documents) for maintaining such excellent libraries for so many years. VERT relies on them to provide you with your conversions.",
			"roles": {
				"lead_developer": "Lead developer; conversion backend, UI implementation",
				"developer": "Developer; UI implementation",
				"designer": "Designer; UX, branding, marketing",
				"docker_ci": "Maintaining Docker & CI support",
				"former_cofounder": "Former co-founder & designer"
			}
		},
		"errors": {
			"github_contributors": "Error fetching GitHub contributors"
		}
	},
	"workers": {
		"errors": {
			"general": "Error converting {file}: {message}",
			"cancel": "Error canceling conversion for {file}: {message}",
			"magick": "Error in Magick worker, image conversion may not work as expected.",
			"ffmpeg": "Error loading FFmpeg, some features may not work as expected.",
			"pandoc": "Error loading Pandoc worker, document conversion may not work as expected.",
			"no_audio": "No audio stream found.",
			"invalid_rate": "Invalid sample rate specified: {rate}Hz",
			"file_too_large": "This file exceeds the {limit}GB browser / device limit. Try Firefox or Safari to convert this large file, which typically have higher limits."
		}
	},
	"privacy": {
		"title": "Privacy Policy",
		"summary": {
			"title": "Summary",
			"description": "VERT's privacy policy is very simple: we do not collect or store any data on you at all. We don't use cookies or trackers, analytics are completely private, and all conversions (except videos) happen locally on your browser. Videos are deleted after being downloaded, or an hour, unless explicitly given permission by you to be stored; it will only be used for the purpose of troubleshooting. VERT self-hosts a Coolify instance for hosting the website and vertd (for video conversion), and a Plausible instance for completely anonymous and aggregated analytics. We use Stripe to process donations, which may collect some data used for fraud prevention.<br/><br/>Note this may only apply to the official VERT instance at [vert_link]vert.sh[/vert_link]; third-party instances may handle your data differently."
		},
		"conversions": {
			"title": "Conversions",
			"description": "Most conversions (images, documents, audio) happen entirely locally on your device using WebAssembly versions of the relevant tools (e.g. ImageMagick, Pandoc, FFmpeg). This means your files never leave your device and we will never have access to them.<br/><br/>Video conversions are performed on our servers because they require more processing power and cannot be done very quickly on the browser yet. Videos you convert with VERT are deleted after being downloaded, or after one hour, unless you explicitly give permission for us to store them longer purely for troubleshooting purposes."
		},
		"donations": {
			"title": "Donations",
			"description": "We use Stripe on the [about_link]about[/about_link] page to collect donations. Stripe may collect certain information about the payment and device for fraud prevention as described in [stripe_link]their documentation on advanced fraud detection[/stripe_link]. External network requests to Stripe are deferred, and are only made after you click the button to pay."
		},
		"conversion_errors": {
			"title": "Conversion Errors",
			"description": "When a video conversion fails, we may collect some anonymous data to help us diagnose the issue. This data may include:",
			"list_job_id": "The job ID, which is the anonymized file name",
			"list_format_from": "The format you converted from",
			"list_format_to": "The format you converted to",
			"list_stderr": "The FFmpeg stderr output of your job (error message)",
			"list_video": "The actual video file (if given explicit permission)",
			"footer": "This information is used solely for the purpose of diagnosing conversion issues. The actual video file will only ever be collected if you give us permission to do so, where it will only be used for troubleshooting."
		},
		"analytics": {
			"title": "Analytics",
			"description": "We self-host a Plausible instance for completely anonymous and aggregated analytics. Plausible does not use cookies and complies with all major privacy regulations (GDPR/CCPA/PECR). You can opt out of analytics in the \"Privacy & data\" section in [settings_link]settings[/settings_link] and read more about Plausible's privacy practices [plausible_link]here[/plausible_link]."
		},
		"local_storage": {
			"title": "Local Storage",
			"description": "We use your browser's local storage to save your settings, and your browser's session storage to temporarily store the GitHub contributors list for the \"About\" section to reduce repeated GitHub API requests. No personal data is stored or transmitted.<br/><br/>The WebAssembly versions of the conversion tools we use (FFmpeg, ImageMagick, Pandoc) are also stored locally on your browser when you first visit the website, so you don't need to redownload them each visit. No personal data is stored or transmitted. You may view or delete this data at any time in the \"Privacy & data\" section in [settings_link]settings[/settings_link]."
		},
		"contact": {
			"title": "Contact",
			"description": "For questions, email us at: [email_link]hello@vert.sh[/email_link]. If you are using a third-party instance of VERT, please contact the hoster of that instance instead."
		},
		"last_updated": "Last updated: 2025-10-29"
	},
	"toast": {
		"insecure_context": "You are visiting VERT in an insecure context (e.g. accessing over HTTP instead of HTTPS). Some features may not work as expected."
	}
}
```

--------------------------------------------------------------------------------

---[FILE: es.json]---
Location: VERT-main/messages/es.json
Signals: Docker

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "Subir",
		"convert": "Convertir",
		"settings": "Ajustes",
		"about": "Acerca de",
		"toggle_theme": "Cambiar tema"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "Código fuente",
		"discord_server": "Servidor de Discord"
	},
	"upload": {
		"title": "El convertidor de archivos que te encantará.",
		"subtitle": "Todo el procesamiento de imágenes, audio y documentos es hecho en tu dispositivo. Los vídeos son convertidos en nuestros servidores ultra rápidos. Sin límite de tamaño de archivo, sin anuncios y de código abierto.",
		"uploader": {
			"text": "Arrastra o haz clic para {action}",
			"convert": "convertir"
		},
		"cards": {
			"title": "VERT soporta...",
			"images": "Imágenes",
			"audio": "Audio",
			"documents": "Documentos",
			"video": "Vídeo",
			"video_server_processing": "Soportado por el servidor",
			"local_supported": "Soportado localmente",
			"status": {
				"text": "<b>Estado:</b> {status}",
				"ready": "listo",
				"not_ready": "no listo",
				"not_initialized": "no inicializado",
				"downloading": "descargando...",
				"initializing": "inicializando...",
				"unknown": "estado desconocido"
			},
			"supported_formats": "Formatos soportados:"
		},
		"tooltip": {
			"partial_support": "Este formato solo se puede convertir a {direction}.",
			"direction_input": "entrada (desde)",
			"direction_output": "salida (hacia)",
			"video_server_processing": "Por defecto, los vídeos se suben a un servidor para ser procesados. Aprende cómo instalarlo localmente aquí."
		}
	},
	"convert": {
		"external_warning": {
			"title": "Advertencia del servidor externo",
			"text": "Si eliges convertir a un formato de video, esos archivos se cargarán en un servidor externo para convertirlos. ¿Quieres continuar?",
			"yes": "Sí",
			"no": "No"
		},
		"panel": {
			"convert_all": "Convertir todo",
			"download_all": "Comprimir todo",
			"remove_all": "Quitar todos los archivos",
			"set_all_to": "Cambiar todos a",
			"na": "N/A"
		},
		"dropdown": {
			"audio": "Audio",
			"video": "Vídeo",
			"doc": "Documento",
			"image": "Imagen",
			"placeholder": "Buscar formato"
		},
		"tooltips": {
			"unknown_file": "Formato de archivo desconocido",
			"audio_file": "Audio",
			"video_file": "Vídeo",
			"document_file": "Documento",
			"image_file": "Imagen",
			"convert_file": "Convertir este archivo",
			"download_file": "Descargar este archivo"
		},
		"errors": {
			"cant_convert": "No podemos convertir este archivo.",
			"vertd_server": "¿Qué estás haciendo..? ¡Debes ejecutar el servidor de vertd!",
			"unsupported_format": "Solo aceptamos imágenes, vídeos, audios y documentos.",
			"vertd_not_found": "No se encontró la instancia de vertd para iniciar la conversión de vídeos. ¿Estás seguro de que la URL es correcta?",
			"worker_downloading": "El convertidor {type} se está inicializando actualmente, espere unos momentos.",
			"worker_error": "El convertidor {type} tuvo un error durante la inicialización, inténtelo nuevamente más tarde.",
			"worker_timeout": "El convertidor {type} está tardando más de lo esperado en inicializarse. Espere unos momentos más o actualice la página.",
			"audio": "audio",
			"doc": "documento",
			"image": "imagen"
		}
	},
	"settings": {
		"title": "Ajustes",
		"errors": {
			"save_failed": "¡No se han podido guardar los ajustes!"
		},
		"appearance": {
			"title": "Apariencia",
			"brightness_theme": "Tema",
			"brightness_description": "¿Prefieres una flash-bang soleada o una silenciosa y solitaria noche?",
			"light": "Claro",
			"dark": "Oscuro",
			"effect_settings": "Efectos",
			"effect_description": "¿Prefieres efectos en la interfaz o una experiencia más estática?",
			"enable": "Habilitar",
			"disable": "Deshabilitar"
		},
		"conversion": {
			"title": "Conversión",
			"advanced_settings": "Configuraciones avanzadas",
			"filename_format": "Formato del nombre de archivo",
			"filename_description": "Esto va a determinar el nombre del archivo al ser descargado <b>sin incluir la extensión</b>. Puedes poner las siguientes plantillas en el formato, las cuales serán reemplazadas con la información que les corresponde: <b>%name%</b> para el nombre original, <b>%extension%</b> para la extensión original del archivo y <b>%date%</b> para la fecha de cuando el archivo fue convertido.",
			"placeholder": "VERT_%name%",
			"default_format": "Formato de conversión predeterminado",
			"default_format_description": "Esto cambiará el formato predeterminado seleccionado cuando subes un archivo de este tipo.",
			"default_format_image": "Imágenes",
			"default_format_video": "Vídeos",
			"default_format_audio": "Audio",
			"default_format_document": "Documentos",
			"metadata": "Metadatos del archivo",
			"metadata_description": "Esto cambia si los metadatos (EXIF, información de la canción, etc.) del archivo original se conservan en los archivos convertidos.",
			"keep": "Mantener",
			"remove": "Eliminar",
			"quality": "Calidad de la conversión",
			"quality_description": "Esto cambia la calidad por defecto de los archivos convertidos (en su categoría). Valores más altos pueden resultar en tiempos de conversión y tamaños de archivo más largos.",
			"quality_video": "Esto cambia la calidad por defecto de los vídeos convertidos. Valores más altos pueden resultar en tiempos de conversión y tamaños de archivo más largos.",
			"quality_audio": "Audio (kbps)",
			"quality_images": "Imagen (%)",
			"rate": "Tasa de muestreo (Hz)"
		},
		"vertd": {
			"title": "Conversión de vídeo",
			"status": "estado:",
			"loading": "cargando...",
			"available": "disponible, id del commit {commitId}",
			"unavailable": "no disponible (¿has comprobado la url?)",
			"description": "<code>vertd</code> es un proyecto que actúa como un servidor intermediario (\"wrapper\") para FFmpeg. Permite convertir vídeos sin dejar de lado la conveniente interfaz web de VERT y, a la vez, aprovecha la potencia de tu GPU para hacerlo lo más rápido posible.",
			"hosting_info": "Alojamos una instancia pública para tu conveniencia, pero es bastante fácil alojar una propia en tu PC o servidor si sabes lo que estás haciendo. Puedes descargar los binarios del servidor [vertd_link]aquí[/vertd_link]. ¡El proceso de instalación será más fácil en el futuro, así que mantente atento!",
			"instance": "Instancia",
			"url_placeholder": "Ejemplo: http://localhost:24153",
			"conversion_speed": "Velocidad de conversión",
			"speed_description": "Esto describe el equilibrio entre velocidad y calidad. Velocidades más rápidas resultarán en una calidad más baja, pero harán el trabajo más rápido.",
			"speeds": {
				"very_slow": "Extremadamente lento",
				"slower": "Muy lento",
				"slow": "Lento",
				"medium": "Medio",
				"fast": "Rápido",
				"ultra_fast": "Súper rápido"
			},
			"auto_instance": "Automático (recomendado)",
			"eu_instance": "Falkenstein, Alemania",
			"us_instance": "Washington, EE. UU.",
			"custom_instance": "Personalizado"
		},
		"privacy": {
			"title": "Privacidad",
			"plausible_title": "Analíticas de Plausible",
			"plausible_description": "Usamos [plausible_link]Plausible[/plausible_link], una herramienta de analíticas orientada a la privacidad para recopilar estadísticas completamente anónimas. Toda la información que recopilamos es anonimizada y agregada, y en ningún momento se envía ni se almacena información que permita identificarte. Puedes ver las estadísticas [analytics_link]aquí[/analytics_link] y excluirte de ellas a continuación:",
			"opt_in": "Participar",
			"opt_out": "No participar",
			"cache_title": "Administración de caché",
			"cache_description": "Guardamos en caché los archivos del convertidor en su navegador para que no tenga que volver a descargarlos cada vez, mejorando el rendimiento y reduciendo el uso de datos.",
			"refresh_cache": "Actualizar caché",
			"clear_cache": "Borrar caché",
			"files_cached": "{size} ({count} archivos)",
			"loading_cache": "Cargando...",
			"total_size": "Tamaño total",
			"files_cached_label": "Archivos en caché",
			"cache_cleared": "¡Caché borrada exitosamente!"
		},
		"language": {
			"title": "Lenguaje",
			"description": "Selecciona el lenguaje que prefieres usar para la interfaz de VERT."
		}
	},
	"about": {
		"title": "Acerca de",
		"why": {
			"title": "¿Por qué VERT?",
			"description": "<b>Los conversores de archivos siempre nos han decepcionado.</b> Son feos, están llenos de anuncios y, lo más importante, son lentos. Decidimos solucionar este problema de una vez por todas creando una alternativa que resuelve todo eso, y más.<br/><br/>Todos los archivos (exceptuando vídeos) se convierten directamente en tu dispositivo; esto significa que no hay demoras por subir o bajar archivos de un servidor, y nunca tenemos acceso a los archivos que conviertes.<br/><br/>Los vídeos se suben a nuestro servidor ultra rápido equipado con una RTX 4000 Ada. Tus vídeos permanecen allí durante una hora si no los conviertes. Si los conviertes, el archivo se guarda durante una hora, o hasta que lo descargues. Luego, el archivo se elimina del servidor."
		},
		"sponsors": {
			"title": "Patrocinadores",
			"description": "¿Quieres apoyarnos? Contacta a un desarrollador en el servidor de [discord_link]Discord[/discord_link] o envía un correo a",
			"email_copied": "¡Email copiado al portapapeles!"
		},
		"resources": {
			"title": "Recursos",
			"discord": "Discord",
			"source": "Fuente",
			"email": "Email"
		},
		"donate": {
			"title": "Donar a VERT",
			"description": "Con tu apoyo, podemos seguir manteniendo y mejorando VERT.",
			"one_time": "Una sola vez",
			"monthly": "Mensual",
			"custom": "Personalizado",
			"pay_now": "Pagar ahora",
			"donate_amount": "Donar ${amount} USD",
			"thank_you": "¡Gracias por tu donación!",
			"payment_failed": "Pago fallido: {message}{period} No se ha efectuado ningún cargo.",
			"donation_error": "Ha ocurrido un error al procesar tu donación. Por favor, inténtalo de nuevo más tarde.",
			"payment_error": "Ha ocurrido un error al obtener los detalles del pago. Por favor, inténtalo de nuevo más tarde."
		},
		"credits": {
			"title": "Créditos",
			"contact_team": "Si te gustaría contactar al equipo de desarrollo, por favor usa el email que se encuentra en la tarjeta de \"Recursos\".",
			"notable_contributors": "Colaboradores destacados",
			"notable_description": "Queremos dar las gracias a las siguientes personas por sus importantes contribuciones a VERT.",
			"github_contributors": "Contribuidores de GitHub",
			"github_description": "¡Muchas gracias a todos los que han contribuido! [github_link]¿Quieres contribuir también?[/github_link]",
			"no_contributors": "Parece que nadie ha contribuido todavía... [contribute_link]¡Sé el primero en hacerlo![/contribute_link]",
			"libraries": "Librerías",
			"libraries_description": "Muchas gracias a FFmpeg (audio, vídeo), ImageMagick (imágenes) y Pandoc (documentos) por mantener librerías excelentes por tantos años. VERT depende de ellas para proporcionar tus conversiones.",
			"roles": {
				"lead_developer": "Líder de desarrollo; implementación del backend de conversión e interfaz",
				"developer": "Desarrollador; implementación de la interfaz",
				"designer": "Diseñador; UX, branding y marketing",
				"docker_ci": "Mantenimiento del soporte para Docker y CI",
				"former_cofounder": "Excofundador; diseñador"
			}
		},
		"errors": {
			"github_contributors": "Ocurrió un error mientras se obtenían los contribuidores de GitHub."
		}
	},
	"workers": {
		"errors": {
			"general": "Ocurrió un error mientras se convertía {file}: {message}",
            "cancel": "Error al cancelar la conversión para {file}: {message}",
			"magick": "Ocurrió un error en el módulo de Magick, la conversión de imágenes puede que no funcione correctamente.",
			"ffmpeg": "No se pudo cargar FFmpeg, algunas funciones podrían no funcionar.",
			"no_audio": "No se encontró una pista de audio.",
			"invalid_rate": "La tasa de muestreo especificada no es válida: {rate}Hz"
		}
	}
}
```

--------------------------------------------------------------------------------

````
