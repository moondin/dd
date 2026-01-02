---
source_txt: fullstack_samples/VERT-main
converted_utc: 2025-12-18T11:26:37Z
part: 5
parts_total: 18
---

# FULLSTACK CODE DATABASE SAMPLES VERT-main

## Verbatim Content (Part 5 of 18)

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

---[FILE: de.json]---
Location: VERT-main/messages/de.json
Signals: Docker

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "Hochladen",
		"convert": "Konvertieren",
		"settings": "Optionen",
		"about": "Über",
		"toggle_theme": "Design wechseln"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "Quellcode",
		"discord_server": "Discord-Server",
		"privacy_policy": "Datenschutzerklärung"
	},
	"upload": {
		"title": "Der Dateikonverter, den du lieben wirst.",
		"subtitle": "Die Verarbeitung aller Bild-, Audio- und Dokumentdateien findet direkt auf deinem Gerät statt. Videos werden auf unseren blitzschnellen Servern konvertiert. Kein Dateigrößenlimit, keine Werbung und vollständig Open Source.",
		"uploader": {
			"text": "Dateien hier ablegen oder klicken zum {action}",
			"convert": "Konvertieren"
		},
		"cards": {
			"title": "VERT unterstützt...",
			"images": "Bilder",
			"audio": "Audio",
			"documents": "Dokumente",
			"video": "Video",
			"video_server_processing": "Server-gestützt",
			"local_supported": "Lokal unterstützt",
			"status": {
				"text": "<b>Status:</b> {status}",
				"ready": "Bereit",
				"not_ready": "Nicht bereit",
				"not_initialized": "Nicht initialisiert",
				"downloading": "Herunterladen...",
				"initializing": "Initialisieren...",
				"unknown": "Unbekannter Status"
			},
			"supported_formats": "Unterstützte Formate:"
		},
		"tooltip": {
			"partial_support": "Dieses Format kann nur als {direction} konvertiert werden.",
			"direction_input": "Eingabe (von)",
			"direction_output": "Ausgabe (nach)",
			"video_server_processing": "Videos werden standardmäßig zur Verarbeitung auf einen Server hochgeladen. Erfahre hier, wie du die Verarbeitung lokal einrichten kannst."
		}
	},
	"convert": {
		"archive_file": {
			"extract": "Archiv entpacken",
			"extracting": "Archiv erkannt: {filename}",
			"extracted": "{extract_count} Dateien aus {filename} entpackt. {ignore_count} Elemente wurden ignoriert.",
			"detected": "{type}-Dateien in {filename} erkannt.",
			"audio": "Audio",
			"video": "Video",
			"doc": "Dokument",
			"image": "Bild",
			"extract_error": "Fehler beim Entpacken von {filename}: {error}"
		},
		"large_file_warning": "Aufgrund von Browser-/Gerätebeschränkungen ist die Video-zu-Audio-Konvertierung für diese Datei deaktiviert, da sie größer als {limit}GB ist. Wir empfehlen Firefox oder Safari für Dateien dieser Größe, da diese weniger Einschränkungen haben.",
		"external_warning": {
			"title": "Warnung: Externer Server",
			"text": "Wenn du in ein Videoformat konvertierst, werden diese Dateien zur Verarbeitung auf einen externen Server hochgeladen. Möchtest du fortfahren?",
			"yes": "Ja",
			"no": "Nein"
		},
		"panel": {
			"convert_all": "Alle konvertieren",
			"download_all": "Alle als .zip laden",
			"remove_all": "Alle entfernen",
			"set_all_to": "Alle konvertieren nach",
			"na": "N/V"
		},
		"dropdown": {
			"audio": "Audio",
			"video": "Video",
			"doc": "Dokument",
			"image": "Bild",
			"placeholder": "Format suchen",
			"no_formats": "Keine Formate verfügbar",
			"no_results": "Keine Ergebnisse"
		},
		"tooltips": {
			"unknown_file": "Unbekannter Dateityp",
			"audio_file": "Audiodatei",
			"video_file": "Videodatei",
			"document_file": "Dokumentdatei",
			"image_file": "Bilddatei",
			"convert_file": "Diese Datei konvertieren",
			"download_file": "Diese Datei herunterladen"
		},
		"errors": {
			"cant_convert": "Wir können diese Datei nicht konvertieren.",
			"vertd_server": "Was machst du da..? Du solltest den vertd-Server ausführen!",
			"vertd_generic_view": "Fehlerdetails anzeigen",
			"vertd_generic_body": "Ein Fehler ist aufgetreten, während versucht wurde, dein Video zu konvertieren. Möchtest du dieses Video an die Entwickler senden, um bei der Behebung dieses Fehlers zu helfen? Nur die Videodatei wird gesendet. Es werden keine Identifikatoren hochgeladen.",
			"vertd_generic_title": "Videokonvertierungsfehler",
			"vertd_generic_yes": "Video senden",
			"vertd_generic_no": "Nicht senden",
			"vertd_failed_to_keep": "Das Video konnte nicht auf dem Server behalten werden: {error}",
			"vertd_details": "Fehlerdetails anzeigen",
			"vertd_details_body": "Wenn du auf Senden drückst, wird <b>dein Video ebenfalls angehängt</b>, zusammen mit dem Fehlerprotokoll, das uns immer zur Überprüfung gemeldet wird. Die folgenden Informationen sind das Protokoll, das wir automatisch erhalten:",
			"vertd_details_footer": "Diese Informationen werden nur zur Fehlerbehebung verwendet und niemals weitergegeben. Sieh dir unsere [privacy_link]Datenschutzerklärung[/privacy_link] für weitere Details an.",
			"vertd_details_job_id": "<b>Job-ID:</b> {jobId}",
			"vertd_details_from": "<b>Von Format:</b> {from}",
			"vertd_details_to": "<b>Zu Format:</b> {to}",
			"vertd_details_error_message": "<b>Fehlermeldung:</b> [view_link]Fehlerprotokolle anzeigen[/view_link]",
			"vertd_details_close": "Schließen",
			"vertd_ratelimit": "Dein Video, '{filename}', konnte mehrmals nicht konvertiert werden. Um eine Überlastung des Servers zu vermeiden, wurden weitere Konvertierungsversuche für diese Datei vorübergehend blockiert. Bitte versuche es später erneut.",
			"unsupported_format": "Es werden nur Bild-, Video-, Audio- und Dokumentdateien unterstützt.",
			"format_output_only": "Dieses Format kann derzeit nur als Ausgabe (konvertiert zu), nicht als Eingabe verwendet werden.",
			"vertd_not_found": "Konnte die vertd-Instanz nicht finden, um die Videokonvertierung zu starten. Bist du sicher, dass die Instanz-URL korrekt eingestellt ist?",
			"worker_downloading": "Der {type}-Konverter wird gerade initialisiert, bitte warte einen Moment.",
			"worker_error": "Beim Initialisieren des {type}-Konverters ist ein Fehler aufgetreten, bitte versuche es später erneut.",
			"worker_timeout": "Die Initialisierung des {type}-Konverters dauert länger als erwartet, bitte warte noch einen Moment oder lade die Seite neu.",
			"audio": "Audio",
			"doc": "Dokument",
			"image": "Bild"
		}
	},
	"settings": {
		"title": "Optionen",
		"errors": {
			"save_failed": "Speichern der Einstellungen fehlgeschlagen!"
		},
		"appearance": {
			"title": "Erscheinungsbild",
			"brightness_theme": "Farbschema",
			"brightness_description": "Möchtest du einen sonnigen Blendeffekt oder eine ruhige, einsame Nacht?",
			"light": "Hell",
			"dark": "Dunkel",
			"effect_settings": "Effekteinstellungen",
			"effect_description": "Möchtest du schicke Effekte oder eine eher statische Erfahrung?",
			"enable": "Animiert",
			"disable": "Statisch"
		},
		"conversion": {
			"title": "Konvertierung",
			"advanced_settings": "Erweiterte Einstellungen",
			"filename_format": "Dateinamensformat",
			"filename_description": "Dies bestimmt den Namen der Datei beim Herunterladen, <b>ohne die Dateiendung.</b> Du kannst folgende Platzhalter verwenden: <b>%name%</b> für den ursprünglichen Dateinamen, <b>%extension%</b> für die ursprüngliche Dateiendung und <b>%date%</b> für das Datum der Konvertierung.",
			"placeholder": "VERT_%name%",
			"default_format": "Standard-Format",
			"default_format_enable": "Aktivieren",
			"default_format_disable": "Deaktivieren",
			"default_format_description": "Dies ändert das Format, das standardmäßig ausgewählt wird, wenn du eine Datei dieses Typs hochlädst.",
			"default_format_image": "Bilder",
			"default_format_video": "Videos",
			"default_format_audio": "Audio",
			"default_format_document": "Dokumente",
			"metadata": "Metadaten",
			"metadata_description": "Dies legt fest, ob Metadaten (EXIF, Song-Infos etc.) der Originaldatei in den konvertierten Dateien erhalten bleiben.",
			"keep": "Behalten",
			"remove": "Entfernen",
			"quality": "Qualität",
			"quality_description": "Dies ändert die Standard-Qualität der konvertierten Dateien. Höhere Werte können zu längeren Konvertierungszeiten und größeren Dateien führen.",
			"quality_video": "Dies ändert die Standard-Qualität der konvertierten Videodateien. Höhere Werte können zu längeren Konvertierungszeiten und größeren Dateien führen.",
			"quality_audio": "Audio (kbps)",
			"quality_images": "Bild (%)",
			"rate": "Abtastrate (Hz)"
		},
		"vertd": {
			"title": "Videokonvertierung",
			"status": "Status:",
			"loading": "lädt...",
			"available": "verfügbar, Commit-ID {commitId}",
			"unavailable": "nicht verfügbar (ist die URL korrekt?)",
			"description": "Das Projekt <code>vertd</code> ist ein Server-Wrapper für FFmpeg. Dies ermöglicht es dir, Videos bequem über die Weboberfläche von VERT zu konvertieren und dabei die Leistung deiner GPU für maximale Geschwindigkeit zu nutzen.",
			"hosting_info": "Wir hosten eine öffentliche Instanz für deine Bequemlichkeit, aber es ist einfach, eine eigene auf deinem PC oder Server zu hosten, wenn du weißt, was du tust. Du kannst die Server-Binärdateien [vertd_link]hier[/vertd_link] herunterladen – der Einrichtungsprozess wird in Zukunft noch einfacher!",
			"instance": "Instanz",
			"url_placeholder": "Beispiel: http://localhost:24153",
			"conversion_speed": "Konvertierungsgeschwindigkeit",
			"speed_description": "Dies beschreibt den Kompromiss zwischen Geschwindigkeit und Qualität. Schnellere Einstellungen führen zu geringerer Qualität, erledigen die Aufgabe aber schneller.",
			"speeds": {
				"very_slow": "Sehr langsam",
				"slower": "Langsamer",
				"slow": "Langsam",
				"medium": "Mittel",
				"fast": "Schnell",
				"ultra_fast": "Ultraschnell"
			},
			"auto_instance": "Automatisch (empfohlen)",
			"eu_instance": "Falkenstein, Deutschland",
			"us_instance": "Washington, USA",
			"custom_instance": "Benutzerdefiniert"
		},
		"privacy": {
			"title": "Datenschutz & Daten",
			"plausible_title": "Plausible Analytics",
			"plausible_description": "Wir verwenden [plausible_link]Plausible[/plausible_link], ein datenschutzorientiertes Analysetool, um vollständig anonyme Statistiken zu sammeln. Alle Daten werden anonymisiert und aggregiert; es werden niemals identifizierbare Informationen gesendet oder gespeichert. Du kannst die Analysen [analytics_link]hier[/analytics_link] einsehen und dich unten abmelden.",
			"opt_in": "Einwilligen",
			"opt_out": "Ablehnen",
			"cache_title": "Cache-Verwaltung",
			"cache_description": "Wir speichern die Konverter-Dateien in deinem Browser-Cache, damit du sie nicht jedes Mal neu herunterladen musst. Das verbessert die Leistung und spart Datenvolumen.",
			"refresh_cache": "Cache aktualisieren",
			"clear_cache": "Cache leeren",
			"files_cached": "{size} ({count} Dateien)",
			"loading_cache": "Lädt...",
			"total_size": "Gesamtgröße",
			"files_cached_label": "Gecachte Dateien",
			"cache_cleared": "Cache erfolgreich geleert!",
			"cache_clear_error": "Fehler beim Leeren des Caches.",
			"site_data_title": "Seitendaten-Verwaltung",
			"site_data_description": "Lösche alle Seitendaten einschließlich Einstellungen und gecachten Dateien, um VERT auf den Standardzustand zurückzusetzen und die Seite neu zu laden.",
			"clear_all_data": "Alle Seitendaten löschen",
			"clear_all_data_confirm_title": "Alle Seitendaten löschen?",
			"clear_all_data_confirm": "Dies setzt alle Einstellungen und den Cache zurück und lädt die Seite neu. Diese Aktion kann nicht rückgängig gemacht werden.",
			"clear_all_data_cancel": "Abbrechen",
			"all_data_cleared": "Alle Daten gelöscht! Seite wird neu geladen...",
			"all_data_clear_error": "Fehler beim Löschen der Seitendaten."
		},
		"language": {
			"title": "Sprache",
			"description": "Wähle deine bevorzugte Sprache für die VERT-Benutzeroberfläche."
		}
	},
	"about": {
		"title": "Über",
		"why": {
			"title": "Warum VERT?",
			"description": "<b>Dateikonverter haben uns schon immer enttäuscht.</b> Sie sind hässlich, voller Werbung und vor allem langsam. Wir haben beschlossen, dieses Problem ein für alle Mal zu lösen, indem wir eine Alternative schaffen, die all diese Probleme und noch mehr behebt.<br/><br/>Alle Nicht-Videodateien werden vollständig auf deinem Gerät konvertiert; das bedeutet, es gibt keine Verzögerung beim Senden und Empfangen der Dateien von einem Server, und wir können niemals die von dir konvertierten Dateien einsehen.<br/><br/>Videodateien werden auf unseren blitzschnellen RTX 4000 Ada Server hochgeladen. Deine Videos bleiben dort für eine Stunde, wenn du sie nicht konvertierst. Wenn du die Datei konvertierst, bleibt das Video für eine Stunde auf dem Server oder bis es heruntergeladen wird. Anschließend wird die Datei von unserem Server gelöscht."
		},
		"sponsors": {
			"title": "Sponsoren",
			"description": "Möchtest du uns unterstützen? Kontaktiere einen Entwickler auf dem [discord_link]Discord[/discord_link]-Server oder sende eine E-Mail an",
			"email_copied": "E-Mail in die Zwischenablage kopiert!"
		},
		"resources": {
			"title": "Ressourcen",
			"discord": "Discord",
			"source": "Quellcode",
			"email": "E-Mail"
		},
		"donate": {
			"title": "An VERT spenden",
			"description": "Mit deiner Unterstützung können wir VERT weiter pflegen und verbessern.",
			"one_time": "Einmalig",
			"monthly": "Monatlich",
			"custom": "Benutzerdefiniert",
			"pay_now": "Jetzt zahlen",
			"donate_amount": "${amount} USD spenden",
			"thank_you": "Vielen Dank für deine Spende!",
			"payment_failed": "Zahlung fehlgeschlagen: {message}{period} Dir wurde nichts berechnet.",
			"donation_error": "Bei der Verarbeitung deiner Spende ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
			"payment_error": "Fehler beim Abrufen der Zahlungsdetails. Bitte versuche es später erneut.",
			"donation_notice_official": "Deine Spenden hier gehen an die offizielle VERT-Instanz (vert.sh) und helfen, die Entwicklung des Projekts zu unterstützen.",
			"donation_notice_unofficial": "Deine Spenden hier gehen an den Betreiber dieser VERT-Instanz. Wenn du die offiziellen VERT-Entwickler unterstützen möchtest, besuche bitte [official_link]vert.sh[/official_link]."
		},
		"credits": {
			"title": "Credits",
			"contact_team": "Wenn du das Entwicklungsteam kontaktieren möchtest, verwende bitte die E-Mail-Adresse auf der Karte „Ressourcen“.",
			"notable_contributors": "Nennenswerte Beiträge",
			"notable_description": "Wir möchten diesen Personen für ihre wichtigen Beiträge zu VERT danken.",
			"github_contributors": "GitHub-Mitwirkende",
			"github_description": "Ein großes Dankeschön an alle für ihre Hilfe! [github_link]Möchtest du auch helfen?[/github_link]",
			"no_contributors": "Scheint, als hätte noch niemand beigetragen... [contribute_link]Sei der Erste![/contribute_link]",
			"libraries": "Bibliotheken",
			"libraries_description": "Ein großes Dankeschön an FFmpeg (Audio, Video), ImageMagick (Bilder) und Pandoc (Dokumente) für die Pflege solch exzellenter Bibliotheken über so viele Jahre. VERT verlässt sich auf sie, um dir deine Konvertierungen zu ermöglichen.",
			"roles": {
				"lead_developer": "Lead Developer; Backend, UI-Implementierung",
				"developer": "Developer; UI-Implementierung",
				"designer": "Designer; UX, Branding, Marketing",
				"docker_ci": "Docker & CI-Support",
				"former_cofounder": "Ehemaliger Co-Founder & Designer"
			}
		},
		"errors": {
			"github_contributors": "Fehler beim Abrufen der GitHub-Mitwirkenden"
		}
	},
	"workers": {
		"errors": {
			"general": "Fehler beim Konvertieren von {file}: {message}",
			"cancel": "Fehler beim Abbrechen der Konvertierung für {file}: {message}",
			"magick": "Fehler im Magick-Prozess, die Bildkonvertierung funktioniert möglicherweise nicht wie erwartet.",
			"ffmpeg": "Fehler beim Laden von FFmpeg, einige Funktionen sind möglicherweise nicht verfügbar.",
			"pandoc": "Fehler beim Laden von Pandoc, die Dokumentkonvertierung funktioniert möglicherweise nicht wie erwartet.",
			"no_audio": "Kein Audiostream gefunden.",
			"invalid_rate": "Ungültige Abtastrate angegeben: {rate}Hz",
			"file_too_large": "Diese Datei überschreitet das Browser-/Gerätelimit von {limit}GB. Versuche es mit Firefox oder Safari, die typischerweise höhere Limits haben."
		}
	},
	"privacy": {
		"title": "Datenschutzerklärung",
		"summary": {
			"title": "Zusammenfassung",
			"description": "Die Datenschutzrichtlinie von VERT ist sehr einfach: Wir sammeln oder speichern keinerlei Daten über dich. Wir verwenden keine Cookies oder Tracker, Analysen sind vollständig privat, und alle Konvertierungen (außer Videos) finden lokal in deinem Browser statt. Videos werden nach dem Herunterladen oder nach einer Stunde gelöscht, es sei denn, du gibst uns ausdrücklich die Erlaubnis zur Speicherung; dies wird nur zur Fehlerbehebung verwendet. VERT hostet selbst eine Coolify-Instanz für die Website und vertd (für Videokonvertierung) sowie eine Plausible-Instanz für vollständig anonyme und aggregierte Analysen. Wir nutzen Stripe zur Verarbeitung von Spenden, was einige Daten zur Betrugsprävention sammeln kann.<br/><br/>Beachte, dass dies möglicherweise nur für die offizielle VERT-Instanz unter [vert_link]vert.sh[/vert_link] gilt; Drittanbieter-Instanzen könnten deine Daten anders behandeln."
		},
		"conversions": {
			"title": "Konvertierungen",
			"description": "Die meisten Konvertierungen (Bilder, Dokumente, Audio) erfolgen vollständig lokal auf deinem Gerät unter Verwendung von WebAssembly-Versionen der entsprechenden Tools (z. B. ImageMagick, Pandoc, FFmpeg). Das bedeutet, dass deine Dateien dein Gerät nie verlassen und wir niemals Zugriff darauf haben.<br/><br/>Videokonvertierungen werden auf unseren Servern durchgeführt, da sie mehr Rechenleistung erfordern und im Browser noch nicht schnell genug durchgeführt werden können. Videos, die du mit VERT konvertierst, werden nach dem Herunterladen oder nach einer Stunde gelöscht, es sei denn, du gibst uns ausdrücklich die Erlaubnis, sie länger zu speichern, rein zu Fehlerbehebungszwecken."
		},
		"donations": {
			"title": "Spenden",
			"description": "Wir verwenden Stripe auf der [about_link]Über[/about_link]-Seite, um Spenden zu sammeln. Stripe kann bestimmte Informationen über die Zahlung und das Gerät zur Betrugsprävention sammeln, wie in [stripe_link]ihrer Dokumentation zur erweiterten Betrugserkennung[/stripe_link] beschrieben. Externe Netzwerkanfragen an Stripe werden verzögert und erst gestellt, wenn du auf den Button zum Bezahlen klickst."
		},
		"conversion_errors": {
			"title": "Konvertierungsfehler",
			"description": "Wenn eine Videokonvertierung fehlschlägt, sammeln wir möglicherweise einige anonyme Daten, um das Problem zu diagnostizieren. Diese Daten können beinhalten:",
			"list_job_id": "Die Job-ID, welche der anonymisierte Dateiname ist",
			"list_format_from": "Das Format, aus dem du konvertiert hast",
			"list_format_to": "Das Format, in das du konvertiert hast",
			"list_stderr": "Die FFmpeg stderr-Ausgabe deines Jobs (Fehlermeldung)",
			"list_video": "Die eigentliche Videodatei (nur bei ausdrücklicher Erlaubnis)",
			"footer": "Diese Informationen werden ausschließlich zur Diagnose von Konvertierungsproblemen verwendet. Die eigentliche Videodatei wird nur gesammelt, wenn du uns die Erlaubnis dazu gibst, und dann auch nur zur Fehlerbehebung verwendet."
		},
		"analytics": {
			"title": "Analysen",
			"description": "Wir hosten selbst eine Plausible-Instanz für vollständig anonyme und aggregierte Analysen. Plausible verwendet keine Cookies und entspricht allen wichtigen Datenschutzbestimmungen (DSGVO/CCPA/PECR). Du kannst dich im Abschnitt „Datenschutz & Daten“ in den [settings_link]Einstellungen[/settings_link] von den Analysen abmelden und [plausible_link]hier[/plausible_link] mehr über die Datenschutzpraktiken von Plausible lesen."
		},
		"local_storage": {
			"title": "Lokaler Speicher",
			"description": "Wir verwenden den lokalen Speicher (Local Storage) deines Browsers, um deine Einstellungen zu speichern, und den Sitzungsspeicher (Session Storage), um die Liste der GitHub-Mitwirkenden für den Bereich „Über“ vorübergehend zu speichern und wiederholte GitHub-API-Anfragen zu reduzieren. Es werden keine persönlichen Daten gespeichert oder übertragen.<br/><br/>Die WebAssembly-Versionen der von uns verwendeten Konvertierungstools (FFmpeg, ImageMagick, Pandoc) werden ebenfalls lokal in deinem Browser gespeichert, wenn du die Website zum ersten Mal besuchst, damit du sie nicht bei jedem Besuch erneut herunterladen musst. Es werden keine persönlichen Daten gespeichert oder übertragen. Du kannst diese Daten jederzeit im Abschnitt „Datenschutz & Daten“ in den [settings_link]Einstellungen[/settings_link] einsehen oder löschen."
		},
		"contact": {
			"title": "Kontakt",
			"description": "Für Fragen sende uns eine E-Mail an: [email_link]hello@vert.sh[/email_link]. Wenn du eine Drittanbieter-Instanz von VERT verwendest, kontaktiere bitte stattdessen den Hoster dieser Instanz."
		},
		"last_updated": "Zuletzt aktualisiert: 29.10.2025"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: el.json]---
Location: VERT-main/messages/el.json
Signals: Docker

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "Μεταφόρτωση",
		"convert": "Μετατροπή",
		"settings": "Ρυθμίσεις",
		"about": "Σχετικά",
		"toggle_theme": "Εναλλαγή θέματος"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "Κώδικας",
		"discord_server": "Discord"
	},
	"upload": {
		"title": "Ο μετατροπέας αρχείων που θα λατρέψετε.",
		"subtitle": "Όλη η επεξεργασία εικόνων, ήχου και εγγράφων γίνεται στη συσκευή σας. Τα βίντεο μετατρέπονται στους κεραυνοβόλα γρήγορους διακομιστές μας. Χωρίς όριο μεγέθους αρχείου, χωρίς διαφημίσεις και εντελώς ανοιχτού κώδικα.",
		"uploader": {
			"text": "Σύρετε ή κάντε κλικ για {action}",
			"convert": "μετατροπή"
		},
		"cards": {
			"title": "Το VERT υποστηρίζει...",
			"images": "Εικόνες",
			"audio": "Ήχο",
			"documents": "Έγγραφα",
			"video": "Βίντεο",
			"video_server_processing": "Υποστηρίζεται από σέρβερ",
			"local_supported": "Τοπική υποστήριξη",
			"status": {
				"text": "<b>Κατάσταση:</b> {status}",
				"ready": "έτοιμο",
				"not_ready": "μη έτοιμο",
				"not_initialized": "μη αρχικοποιημένο",
				"downloading": "λήψη...",
				"initializing": "αρχικοποίηση...",
				"unknown": "άγνωστη κατάσταση"
			},
			"supported_formats": "Υποστηριζόμενες μορφές:"
		},
		"tooltip": {
			"partial_support": "Αυτή η μορφή μπορεί να μετατραπεί μόνο ως {direction}.",
			"direction_input": "είσοδος (από)",
			"direction_output": "έξοδος (προς)",
			"video_server_processing": "Τα βίντεο μεταφορτώνονται σε σέρβερ για επεξεργασία από προεπιλογή, μάθετε πώς να το ρυθμίσετε τοπικά εδώ."
		}
	},
	"convert": {
		"external_warning": {
			"title": "Προειδοποίηση εξωτερικού σέρβερ",
			"text": "Εάν επιλέξετε να μετατρέψετε σε μορφή βίντεο, αυτά τα αρχεία θα μεταφορτωθούν σε εξωτερικό σέρβερ για μετατροπή. Θέλετε να συνεχίσετε;",
			"yes": "Ναι",
			"no": "Όχι"
		},
		"panel": {
			"convert_all": "Μετατροπή όλων",
			"download_all": "Λήψη όλων ως .zip",
			"remove_all": "Αφαίρεση όλων των αρχείων",
			"set_all_to": "Ορισμός όλων σε",
			"na": "Μ/Δ"
		},
		"dropdown": {
			"audio": "Ήχος",
			"video": "Βίντεο",
			"doc": "Έγγραφο",
			"image": "Εικόνα",
			"placeholder": "Αναζήτηση μορφής"
		},
		"tooltips": {
			"unknown_file": "Άγνωστος τύπος αρχείου",
			"audio_file": "Αρχείο ήχου",
			"video_file": "Αρχείο βίντεο",
			"document_file": "Αρχείο εγγράφου",
			"image_file": "Αρχείο εικόνας",
			"convert_file": "Μετατροπή αυτού του αρχείου",
			"download_file": "Λήψη αυτού του αρχείου"
		},
		"errors": {
			"cant_convert": "Δεν μπορούμε να μετατρέψουμε αυτό το αρχείο.",
			"vertd_server": "τι κάνεις...; υποτίθεται ότι πρέπει να εκτελέσεις τον σέρβερ vertd!",
			"vertd_generic_body": "Παρουσιάστηκε σφάλμα κατά την προσπάθεια μετατροπής του βίντεό σας. Θέλετε να υποβάλετε αυτό το βίντεο στους προγραμματιστές για να βοηθήσετε στη διόρθωση αυτού του σφάλματος; Θα αποσταλεί μόνο το αρχείο βίντεό σας. Δεν θα μεταφορτωθούν αναγνωριστικά.",
			"vertd_generic_title": "Σφάλμα μετατροπής βίντεο",
			"vertd_generic_yes": "Υποβολή βίντεο",
			"vertd_generic_no": "Μην υποβάλετε",
			"vertd_failed_to_keep": "Αποτυχία διατήρησης του βίντεο στον σέρβερ: {error}",
			"unsupported_format": "Υποστηρίζονται μόνο αρχεία εικόνας, βίντεο, ήχου και εγγράφων",
			"vertd_not_found": "Δεν ήταν δυνατή η εύρεση της παρουσίας vertd για την έναρξη της μετατροπής βίντεο. Είστε βέβαιοι ότι η διεύθυνση URL έχει ρυθμιστεί σωστά;",
			"worker_downloading": "Ο μετατροπέας {type} αρχικοποιείται αυτή τη στιγμή, παρακαλώ περιμένετε λίγο.",
			"worker_error": "Ο μετατροπέας {type} αντιμετώπισε σφάλμα κατά την αρχικοποίηση, παρακαλώ δοκιμάστε ξανά αργότερα.",
			"worker_timeout": "Ο μετατροπέας {type} χρειάζεται περισσότερο χρόνο από το αναμενόμενο για να αρχικοποιηθεί, παρακαλώ περιμένετε λίγο ακόμη ή ανανεώστε τη σελίδα.",
			"audio": "ήχου",
			"doc": "εγγράφου",
			"image": "εικόνας"
		}
	},
	"settings": {
		"title": "Ρυθμίσεις",
		"errors": {
			"save_failed": "Αποτυχία αποθήκευσης ρυθμίσεων!"
		},
		"appearance": {
			"title": "Εμφάνιση",
			"brightness_theme": "Θέμα φωτεινότητας",
			"brightness_description": "Θέλετε μια ηλιόλουστη λάμψη ή μια ήσυχη μοναχική νύχτα;",
			"light": "Φωτεινό",
			"dark": "Σκούρο",
			"effect_settings": "Ρυθμίσεις εφέ",
			"effect_description": "Θα θέλατε φανταχτερά εφέ ή μια πιο στατική εμπειρία;",
			"enable": "Ενεργοποίηση",
			"disable": "Απενεργοποίηση"
		},
		"conversion": {
			"title": "Μετατροπή",
			"advanced_settings": "Προηγμένες ρυθμίσεις",
			"filename_format": "Μορφή ονόματος αρχείου",
			"filename_description": "Αυτό θα καθορίσει το όνομα του αρχείου κατά τη λήψη, <b>χωρίς να περιλαμβάνει την επέκταση αρχείου.</b> Μπορείτε να τοποθετήσετε τα ακόλουθα πρότυπα στη μορφή, τα οποία θα αντικατασταθούν με τις σχετικές πληροφορίες: <b>%name%</b> για το αρχικό όνομα αρχείου, <b>%extension%</b> για την αρχική επέκταση αρχείου και <b>%date%</b> για μια συμβολοσειρά ημερομηνίας του πότε μετατράπηκε το αρχείο.",
			"placeholder": "VERT_%name%",
			"default_format": "Προεπιλεγμένη μορφή μετατροπής",
			"default_format_description": "Αυτό θα αλλάξει την προεπιλεγμένη μορφή που επιλέγεται όταν ανεβάζετε ένα αρχείο αυτού του τύπου.",
			"default_format_image": "Εικόνες",
			"default_format_video": "Βίντεο",
			"default_format_audio": "Ήχος",
			"default_format_document": "Έγγραφα",
			"metadata": "Μεταδεδομένα αρχείου",
			"metadata_description": "Αυτό αλλάζει το αν τυχόν μεταδεδομένα (EXIF, πληροφορίες τραγουδιού κ.λπ.) στο αρχικό αρχείο διατηρούνται στα μετατρεπόμενα αρχεία.",
			"keep": "Διατήρηση",
			"remove": "Αφαίρεση",
			"quality": "Ποιότητα μετατροπής",
			"quality_description": "Αυτό αλλάζει την προεπιλεγμένη ποιότητα εξόδου των μετατρεπόμενων αρχείων (στην κατηγορία του). Υψηλότερες τιμές μπορεί να οδηγήσουν σε μεγαλύτερους χρόνους μετατροπής και μέγεθος αρχείου.",
			"quality_video": "Αυτό αλλάζει την προεπιλεγμένη ποιότητα εξόδου των μετατρεπόμενων αρχείων βίντεο. Υψηλότερες τιμές μπορεί να οδηγήσουν σε μεγαλύτερους χρόνους μετατροπής και μέγεθος αρχείου.",
			"quality_audio": "Ήχος (kbps)",
			"quality_images": "Εικόνα (%)",
			"rate": "Ρυθμός δειγματοληψίας (Hz)"
		},
		"vertd": {
			"title": "Μετατροπή βίντεο",
			"status": "κατάσταση:",
			"loading": "φόρτωση...",
			"available": "διαθέσιμο, αναγνωριστικό έκδοσης {commitId}",
			"unavailable": "μη διαθέσιμο (είναι σωστή η διεύθυνση url;)",
			"description": "Το έργο <code>vertd</code> είναι ένα περιτύλιγμα σέρβερ για το FFmpeg. Αυτό σας επιτρέπει να μετατρέπετε βίντεο μέσω της ευκολίας της διεπαφής ιστού του VERT, ενώ εξακολουθείτε να μπορείτε να αξιοποιήσετε τη δύναμη της GPU σας για να το κάνετε όσο το δυνατόν πιο γρήγορα.",
			"hosting_info": "Φιλοξενούμε μια δημόσια σελίδα για τη διευκόλυνσή σας, αλλά είναι αρκετά εύκολο να φιλοξενήσετε τη δική σας στον υπολογιστή ή τον σέρβερ σας αν γνωρίζετε τι κάνετε. Μπορείτε να κατεβάσετε τα δυαδικά αρχεία του σέρβερ [vertd_link]εδώ[/vertd_link] - η διαδικασία ρύθμισης θα γίνει ευκολότερη στο μέλλον, οπότε μείνετε συντονισμένοι!",
			"instance": "Παρουσία",
			"url_placeholder": "Παράδειγμα: http://localhost:24153",
			"conversion_speed": "Ταχύτητα μετατροπής",
			"speed_description": "Αυτό περιγράφει τον συμβιβασμό μεταξύ ταχύτητας και ποιότητας. Ταχύτερες ταχύτητες θα έχουν ως αποτέλεσμα χαμηλότερη ποιότητα, αλλά θα ολοκληρώσουν τη δουλειά γρηγορότερα.",
			"speeds": {
				"very_slow": "Πολύ αργή",
				"slower": "Αργότερη",
				"slow": "Αργή",
				"medium": "Μέτρια",
				"fast": "Γρήγορη",
				"ultra_fast": "Πολύ γρήγορη"
			},
			"auto_instance": "Αυτόματη (συνιστάται)",
			"eu_instance": "Falkenstein, Γερμανία",
			"us_instance": "Washington, ΗΠΑ",
			"custom_instance": "Προσαρμοσμένη"
		},
		"privacy": {
			"title": "Απόρρητο & δεδομένα",
			"plausible_title": "Αναλυτικά στοιχεία Plausible",
			"plausible_description": "Χρησιμοποιούμε το [plausible_link]Plausible[/plausible_link], ένα εργαλείο αναλυτικών που εστιάζει στο απόρρητο, για τη συλλογή εντελώς ανώνυμων στατιστικών. Όλα τα δεδομένα είναι ανωνυμοποιημένα και συγκεντρωτικά και δεν αποστέλλονται ούτε αποθηκεύονται ποτέ αναγνωρίσιμες πληροφορίες. Μπορείτε να δείτε τα αναλυτικά στοιχεία [analytics_link]εδώ[/analytics_link] και να επιλέξετε να εξαιρεθείτε παρακάτω.",
			"opt_in": "Συμμετοχή",
			"opt_out": "Εξαίρεση",
			"cache_title": "Διαχείριση προσωρινής μνήμης",
			"cache_description": "Αποθηκεύουμε προσωρινά τα αρχεία μετατροπέα στο πρόγραμμα περιήγησής σας, ώστε να μην χρειάζεται να τα κατεβάζετε ξανά κάθε φορά, βελτιώνοντας την απόδοση και μειώνοντας τη χρήση δεδομένων.",
			"refresh_cache": "Ανανέωση προσωρινής μνήμης",
			"clear_cache": "Εκκαθάριση προσωρινής μνήμης",
			"files_cached": "{size} ({count} αρχεία)",
			"loading_cache": "Φόρτωση...",
			"total_size": "Συνολικό μέγεθος",
			"files_cached_label": "Αρχεία σε προσωρινή μνήμη",
			"cache_cleared": "Η προσωρινή μνήμη εκκαθαρίστηκε επιτυχώς!",
			"cache_clear_error": "Αποτυχία εκκαθάρισης προσωρινής μνήμης."
		},
		"language": {
			"title": "Γλώσσα",
			"description": "Επιλέξτε την προτιμώμενη γλώσσα σας για το περιβάλλον του VERT."
		}
	},
	"about": {
		"title": "Σχετικά",
		"why": {
			"title": "Γιατί το VERT;",
			"description": "<b>Οι μετατροπείς αρχείων μας απογοήτευαν πάντα.</b> Είναι άσχημοι, γεμάτοι διαφημίσεις και το πιο σημαντικό· αργοί. Αποφασίσαμε να λύσουμε αυτό το πρόβλημα μια για πάντα δημιουργώντας μια εναλλακτική που λύνει όλα αυτά τα προβλήματα και περισσότερα.<br/><br/>Όλα τα αρχεία που δεν είναι βίντεο μετατρέπονται εντελώς στη συσκευή σας· αυτό σημαίνει ότι δεν υπάρχει καθυστέρηση μεταξύ της αποστολής και της λήψης των αρχείων από έναν σέρβερ και δεν αποκτούμε ποτέ πρόσβαση στα αρχεία που μετατρέπετε.<br/><br/>Τα αρχεία βίντεο μεταφορτώνονται στον αστραπιαία γρήγορο σέρβερ μας RTX 4000 Ada. Τα βίντεό σας παραμένουν εκεί για μία ώρα εάν δεν τα μετατρέψετε. Εάν μετατρέψετε το αρχείο, το βίντεο θα παραμείνει στον σέρβερ για μία ώρα ή μέχρι να ληφθεί. Στη συνέχεια, το αρχείο θα διαγραφεί από τον σέρβερ μας."
		},
		"sponsors": {
			"title": "Χορηγοί",
			"description": "Θέλετε να μας υποστηρίξετε; Επικοινωνήστε με έναν προγραμματιστή στον σέρβερ [discord_link]Discord[/discord_link] ή στείλτε email στη διεύθυνση",
			"email_copied": "Το email αντιγράφηκε στο πρόχειρο!"
		},
		"resources": {
			"title": "Πόροι",
			"discord": "Discord",
			"source": "Πηγαίος κώδικας",
			"email": "Email"
		},
		"donate": {
			"title": "Δωρεά στο VERT",
			"description": "Με την υποστήριξή σας, μπορούμε να συνεχίσουμε να συντηρούμε και να βελτιώνουμε το VERT.",
			"one_time": "Εφάπαξ",
			"monthly": "Μηνιαία",
			"custom": "Προσαρμοσμένη",
			"pay_now": "Πληρωμή τώρα",
			"donate_amount": "Δωρεά ${amount} USD",
			"thank_you": "Σας ευχαριστούμε για τη δωρεά σας!",
			"payment_failed": "Η πληρωμή απέτυχε: {message}{period} Δεν χρεώθηκε ο λογαριασμός σας.",
			"donation_error": "Παρουσιάστηκε σφάλμα κατά την επεξεργασία της δωρεάς σας. Παρακαλώ δοκιμάστε ξανά αργότερα.",
			"payment_error": "Σφάλμα κατά την ανάκτηση στοιχείων πληρωμής. Παρακαλώ δοκιμάστε ξανά αργότερα."
		},
		"credits": {
			"title": "Τίτλοι",
			"contact_team": "Εάν θέλετε να επικοινωνήσετε με την ομάδα ανάπτυξης, χρησιμοποιήστε το email που βρίσκεται στην κάρτα «Πόροι».",
			"notable_contributors": "Αξιόλογοι συνεισφέροντες",
			"notable_description": "Θα θέλαμε να ευχαριστήσουμε αυτά τα άτομα για τις σημαντικές συνεισφορές τους στο VERT.",
			"github_contributors": "Συνεισφέροντες στο GitHub",
			"github_description": "Μεγάλες ευχαριστίες σε όλα αυτά τα άτομα που βοήθησαν! [github_link]Θέλετε να βοηθήσετε κι εσείς;[/github_link]",
			"no_contributors": "Φαίνεται ότι κανείς δεν έχει συνεισφέρει ακόμα... [contribute_link]γίνετε ο πρώτος που θα συνεισφέρει![/contribute_link]",
			"libraries": "Βιβλιοθήκες",
			"libraries_description": "Μεγάλες ευχαριστίες στα FFmpeg (ήχος, βίντεο), ImageMagick (εικόνες) και Pandoc (έγγραφα) που διατηρούν τέτοιες εξαιρετικές βιβλιοθήκες για τόσα χρόνια. Το VERT βασίζεται σε αυτές για να σας παρέχει τις μετατροπές σας.",
			"roles": {
				"lead_developer": "Επικεφαλής προγραμματιστής· backend μετατροπής, υλοποίηση UI",
				"developer": "Προγραμματιστής· υλοποίηση UI",
				"designer": "Σχεδιαστής· UX, branding, μάρκετινγκ",
				"docker_ci": "Συντήρηση υποστήριξης Docker & CI",
				"former_cofounder": "Πρώην συνιδρυτής & σχεδιαστής"
			}
		},
		"errors": {
			"github_contributors": "Σφάλμα κατά την ανάκτηση συνεισφερόντων του GitHub"
		}
	},
	"workers": {
		"errors": {
			"general": "Σφάλμα κατά τη μετατροπή του {file}: {message}",
			"cancel": "Σφάλμα κατά την ακύρωση της μετατροπής για το {file}: {message}",
			"magick": "Σφάλμα στο worker του Magick, η μετατροπή εικόνων μπορεί να μην λειτουργεί όπως αναμένεται.",
			"ffmpeg": "Σφάλμα κατά τη φόρτωση του ffmpeg, ορισμένες λειτουργίες μπορεί να μην λειτουργούν.",
			"no_audio": "Δεν βρέθηκε ροή ήχου.",
			"invalid_rate": "Καθορίστηκε μη έγκυρος ρυθμός δειγματοληψίας: {rate}Hz"
		}
	}
}
```

--------------------------------------------------------------------------------

````
