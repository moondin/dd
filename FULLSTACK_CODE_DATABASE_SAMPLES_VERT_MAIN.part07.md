---
source_txt: fullstack_samples/VERT-main
converted_utc: 2025-12-18T11:26:37Z
part: 7
parts_total: 18
---

# FULLSTACK CODE DATABASE SAMPLES VERT-main

## Verbatim Content (Part 7 of 18)

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

---[FILE: fr.json]---
Location: VERT-main/messages/fr.json
Signals: Docker

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "Transférer",
		"convert": "Convertir",
		"settings": "Paramètres",
		"about": "A propos",
		"toggle_theme": "Changer de thème"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "Code source",
		"discord_server": "Serveur Discord"
	},
	"upload": {
		"title": "Le convertisseur de fichiers que vous allez adorer.",
		"subtitle": "Tout le traitement des images, des fichiers audio et des documents s'effectue sur votre appareil. Les vidéos sont converties sur nos serveurs ultra-rapides. Aucune limite de taille de fichier, aucune publicité et entièrement open source.",
		"uploader": {
			"text": "Déposer ou cliquer pour {action}",
			"convert": "convertir"
		},
		"cards": {
			"title": "VERT supports...",
			"images": "Images",
			"audio": "Audio",
			"documents": "Documents",
			"video": "Video",
			"video_server_processing": "Serveur pris en charge",
			"local_supported": "Prise en charge locale",
			"status": {
				"text": "<b>Status:</b> {status}",
				"ready": "Prêt",
				"not_ready": "Pas encore prêt",
				"not_initialized": "non initialisé",
				"downloading": "en cours de téléchargement...",
				"initializing": "initialisation...",
				"unknown": "status inconnu"
			},
			"supported_formats": "Formats supportés:"
		},
		"tooltip": {
			"partial_support": "Ce format ne peut être converti qu'en {direction}.",
			"direction_input": "Entrée (de)",
			"direction_output": "Sortie (vers)",
			"video_server_processing": "Les vidéos sont téléchargées sur un serveur pour un traitement par défaut, découvrez comment les configurer localement ici."
		}
	},
	"convert": {
		"panel": {
			"convert_all": "Convertir tout",
			"download_all": "Télécharger l'ensemble au format .zip",
			"remove_all": "Supprimer tous les fichiers",
			"set_all_to": "Tout configurer sur",
			"na": "N/A"
		},
		"dropdown": {
			"audio": "Audio",
			"video": "Video",
			"doc": "Document",
			"image": "Image",
			"placeholder": "Format de recherche"
		},
		"tooltips": {
			"unknown_file": "Type de fichier inconnu",
			"audio_file": "Fichier audio",
			"video_file": "Fichier vidéo",
			"document_file": "Fichier document",
			"image_file": "Fichier image",
			"convert_file": "Convertir ce fichier",
			"download_file": "Télécharger ce fichier"
		},
		"errors": {
			"cant_convert": "Nous ne pouvons pas convertir ce fichier",
			"vertd_server": "Que fais-tu ? Tu es censé exécuter sur le serveur vertd !",
			"unsupported_format": "Seuls les fichiers image, vidéo, audio et document sont pris en charge",
			"vertd_not_found": "Impossible de trouver l'instance vertd pour démarrer la conversion vidéo. Êtes-vous sûr que l'URL de l'instance est correctement définie ?",
			"worker_downloading": "Le convertisseur de {type} est en cours d'initialisation, veuillez patienter quelques instants.",
			"worker_error": "Le convertisseur de {type} a rencontré une erreur lors de l'initialisation, veuillez réessayer plus tard.",
			"worker_timeout": "Le convertisseur de {type} prend plus de temps que prévu pour s'initialiser, veuillez patienter quelques instants de plus ou actualiser la page.",
			"audio": "audio",
			"doc": "document",
			"image": "image"
		}
	},
	"settings": {
		"title": "Paramètres",
		"errors": {
			"save_failed": "Echec lors de l'enregistrement des préférences !"
		},
		"appearance": {
			"title": "Appearance",
			"brightness_theme": "Luminosité du thème",
			"brightness_description": "Envie d'une soirée ensoleillée ou d'une nuit tranquille et solitaire ?",
			"light": "Lumineux",
			"dark": "Sombre",
			"effect_settings": "Paramètres des effets",
			"effect_description": "Vous aimez les effets sophistiqués ou préférez une expérience plus statique ?",
			"enable": "Activer",
			"disable": "Désactiver"
		},
		"conversion": {
			"title": "Conversion",
			"advanced_settings": "Paramètres avancés",
			"filename_format": "Format du nom de fichier",
			"filename_description": "Cela déterminera le nom du fichier lors du téléchargement, <b>sans inclure l'extension du fichier.</b> Vous pouvez mettre les modèles suivants dans le format, qui seront remplacés par les informations pertinentes: <b>%name%</b> pour le nom du fichier d'origine, <b>%extension%</b> pour l'extension du fichier d'origine et <b>%date%</b> pour une chaîne de date indiquant quand le fichier a été converti.",
			"placeholder": "VERT_%name%",
			"default_format": "Format de conversion par défaut",
			"default_format_enable": "Activer",
			"default_format_disable": "Désactiver",
			"default_format_description": "Cela modifiera le format par défaut sélectionné lorsque vous téléchargez un fichier de ce type de format.",
			"default_format_image": "Images",
			"default_format_video": "Videos",
			"default_format_audio": "Audio",
			"default_format_document": "Documents",
			"metadata": "Métadonnées du fichier",
			"metadata_description": "Cela modifie si les métadonnées (EXIF, informations sur la chanson, etc.) du fichier d'origine sont conservées dans les fichiers convertis.",
			"keep": "Conserver",
			"remove": "Retirer",
			"quality": "Qualité de conversion",
			"quality_description": "Cela modifie la qualité de sortie par défaut des fichiers convertis (de son format). Des valeurs plus élevées peuvent entraîner des temps de conversion et une taille de fichier plus longs.",
			"quality_video": "Cela modifie la qualité de sortie par défaut des fichiers vidéo convertis. Des valeurs plus élevées peuvent allonger le temps de conversion et la taille du fichier.",
			"quality_audio": "Audio (kbps)",
			"quality_images": "Image (%)",
			"rate": "Taux d'échantillonnage (Hz)"
		},
		"vertd": {
			"title": "Conversion vidéo",
			"status": "status:",
			"loading": "Chargement...",
			"available": "disponible, identifiant de validation {commitId}",
			"unavailable": "indisponible (l'url est-elle correcte ?)",
			"description": "Le projet <code>vertd</code> est un serveur de wrapper utilisant FFmpeg. Il vous permet de convertir des vidéos grâce à l'interface web pratique de VERT'tout en exploitant la puissance de votre GPU pour une exécution rapide.",
			"hosting_info": "Nous hébergeons une instance publique pour vous faciliter la tâche, mais il est assez facile d'héberger la vôtre sur votre PC ou votre serveur si vous savez ce que vous faites. Vous pouvez télécharger les binaires pour serveur [vertd_link]ici[/vertd_link] - le processus de mise en place deviendra plus facile à l'avenir, alors restez à l'écoute !",
			"instance_url": "URL de l'instance",
			"url_placeholder": "Exemple: http://localhost:24153",
			"conversion_speed": "Vitesse de conversion",
			"speed_description": "Ceci décrit le compromis entre vitesse et qualité. Des vitesses plus élevées entraîneront une qualité moindre, mais permettront d'effectuer le travail plus rapidement.",
			"speeds": {
				"very_slow": "Très lent",
				"slower": "Plus lent",
				"slow": "Lent",
				"medium": "Moyen",
				"fast": "Rapide",
				"ultra_fast": "Ultra Rapide"
			}
		},
		"privacy": {
			"title": "Confidentialité",
			"plausible_title": "Analyses plausibles",
			"plausible_description": "Nous utilisons [plausible_link]Plausible[/plausible_link], un outil d'analyse axé sur la confidentialité, pour recueillir des statistiques totalement anonymes. Toutes les données sont anonymisées et agrégées, et aucune information identifiable n'est transmise ni stockée. Vous pouvez consulter les analyses [analytics_link]ici[/analytics_link] et choisir de vous désinscrire ci-dessous.",
			"opt_in": "Inscription",
			"opt_out": "Désinscription"
		},
		"language": {
			"title": "Langue",
			"description": "Sélectionnez votre langue préférée pour l'interface de VERT"
		}
	},
	"about": {
		"title": "A propos",
		"why": {
			"title": "Pourquoi VERT?",
			"description": "<b>Les convertisseurs de fichiers nous ont toujours déçus.</b> Ils sont laids, infestés de publicités et, surtout, lents. Nous avons décidé de résoudre ce problème une fois pour toutes en créant une alternative qui résout tous ces problèmes, et bien plus encore.<br/><br/>Tous les fichiers non vidéo sont entièrement convertis sur l'appareil; cela signifie qu'il n'y a aucun délai entre l'envoi et la réception des fichiers depuis un serveur, et nous ne pouvons jamais espionner les fichiers que vous convertissez.<br/><br/>Les fichiers vidéo sont téléchargés sur notre serveur RTX 4000 Ada ultra-rapide. Vos vidéos y restent pendant une heure si vous ne les convertissez pas. Si vous convertissez le fichier, la vidéo restera sur le serveur pendant une heure, ou jusqu'à son téléchargement. Le fichier sera ensuite supprimé de notre serveur."
		},
		"sponsors": {
			"title": "Sponsors",
			"description": "Envie de nous soutenir? Contactez un développeur sur le serveur [discord_link]Discord[/discord_link], ou envoyez un courriel à",
			"email_copied": "Courriel copié dans le presse-papiers !"
		},
		"resources": {
			"title": "Resources",
			"discord": "Discord",
			"source": "Source",
			"email": "Courriel"
		},
		"donate": {
			"title": "Faire un don à VERT",
			"description": "Avec votre soutien, nous pouvons continuer à maintenir et à améliorer VERT.",
			"one_time": "Une fois",
			"monthly": "Mensuel",
			"custom": "Personnaliser",
			"pay_now": "Payer maintenant",
			"donate_amount": "Faire un don de ${amount} USD",
			"thank_you": "Merci pour votre don!",
			"payment_failed": "Paiement échoué: {message}{period} Vous n'avez pas été facturé.",
			"donation_error": "Une erreur s'est produite lors du traitement de votre don. Veuillez réessayer ultérieurement.",
			"payment_error": "Erreur lors de la récupération des informations de paiement. Veuillez réessayer ultérieurement."
		},
		"credits": {
			"title": "Credits",
			"contact_team": "Si vous souhaitez contacter l'équipe de développement, veuillez utiliser le courriel figurant sur la carte \"Resources\".",
			"notable_contributors": "Contributeurs notables",
			"notable_description": "Nous tenons à remercier ces personnes pour leurs contributions majeures à VERT.",
			"github_contributors": "Les contributeurs de GitHub",
			"github_description": "Un grand merci à toutes ces personnes pour leur aide ! [github_link]Vous voulez aussi aider ?[/github_link]",
			"no_contributors": "Il semble que personne n'ait encore contribué... [contribute_link]soyez le premier à contribuer ![/contribute_link]",
			"libraries": "Bibliothèques",
			"libraries_description": "un grand merci à FFmpeg (audio, video), ImageMagick (images) et Pandoc (documents) pour avoir maintenu d'aussi excellentes bibliothèques pendant tant d'années, VERT compte sur eux pour vous fournir vos conversions.",
			"roles": {
				"lead_developer": "Lead developer; conversion backend, UI implementation",
				"developer": "Developer; UI implementation",
				"designer": "Designer; UX, branding, marketing",
				"docker_ci": "Maintaining Docker & CI support",
				"former_cofounder": "Former co-founder & designer"
			}
		},
		"errors": {
			"github_contributors": "Erreur lors de la récupération des contributeurs GitHub"
		}
	},
	"workers": {
		"errors": {
			"general": "Erreur de conversion{file}: {message}",
			"cancel": "Erreur lors de l'annulation de la conversion pour {file}: {message}",
			"magick": "Erreur depuis Magick Worker, la conversion d'image peut ne pas fonctionner comme prévu.",
			"ffmpeg": "Erreur lors du chargement de ffmpeg, certaines fonctionnalités peuvent ne pas fonctionner.",
			"no_audio": "Aucun flux audio détécté.",
			"invalid_rate": "Taux d'échantillonnage spécifié non valide: {rate}Hz"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: hr.json]---
Location: VERT-main/messages/hr.json

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "Prenesi",
		"convert": "Pretvori",
		"settings": "Postavke",
		"about": "O Stranici",
		"toggle_theme": "Promjeni izgled"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "Source kod",
		"discord_server": "Discord server"
	},
	"upload": {
		"title": "Pretvarač datoteka koji ćeš obožavati.",
		"subtitle": "Cijelokupna obrada slika, zvuka i dokumenata se odvija na vašem uređaju. Videozapisi se pretvaraju na našim izrazito brzim serverima. Nema nikakvih ograničenja veličine niti reklama i potpuno je open source.",
		"uploader": {
			"text": "Ubaci ili klikni da {action}",
			"convert": "pretvori"
		},
		"cards": {
			"title": "VERT podržava...",
			"images": "Slike",
			"audio": "Audio",
			"documents": "Dokumente",
			"video": "Video",
			"video_server_processing": "Server podržan",
			"local_supported": "Lokalno podržano",
			"status": {
				"text": "<b>Status:</b> {status}",
				"ready": "spremno",
				"not_ready": "nespremno",
				"not_initialized": "nije inicijalizirano",
				"downloading": "preuzimanje...",
				"initializing": "inicijaliziranje...",
				"unknown": "nepoznati status"    
			},
			"supported_formats": "Podržani formati:"
		},
		"tooltip": {
			"partial_support": "Ovaj format se može pretvoriti u {direction}.",
			"direction_input": "ulaz (iz)",
			"direction_output": "izlaz (u)",
			"video_server_processing": "Videozapisi se uobičajeno prenose na servere za obradu, nauči ovdje kako namjestiti da se događa lokalno."
		}
	},
	"convert": {
		"panel": {
			"convert_all": "Pretvori sve",
			"download_all": "Preuzmi sve kao .zip",
			"remove_all": "Makni sve datoteke",
			"set_all_to": "Stavi sve na",
			"na": "N/A"
		},
		"dropdown": {
			"audio": "Audio",
			"video": "Video",
			"doc": "Dokument",
			"image": "Slika",
			"placeholder": "Potraži format"
		},
		"tooltips": {
			"unknown_file": "Nepoznat tip datoteke",
			"audio_file": "Audio datoteka",
			"video_file": "Video datoteka",
			"document_file": "Dokument",
			"image_file": "Datoteka slike",
			"convert_file": "Pretvori ovu datoteku",
			"download_file": "Preuzmi ovu datoteku"
		},
		"errors": {
			"cant_convert": "Ne možemo pretvoriti ovu datoteku.",
			"vertd_server": "Sunce ti žarko, što ti radiš!? Moraš pokrenuti vertd server!",
			"unsupported_format": "Podržane su samo slike, videozapisi, audio i dokumenti",
			"vertd_not_found": "Nismo mogli pronači vertd da započnemo pretvaranje. Jeste li sigurni da je URL točno postavljen?",    
			"worker_downloading": "{type} pretvarač se trenutno koristi, molimo pričekajte malo.",
			"worker_error": "{type} pretvaraču se javila pogreška pri inicijalizaciji, molimo pokušajte ponovno kasnije.",
			"worker_timeout": "{type} pretvaraču treba duže nego očekivano da se inicijalizira, molimo još malo pričekajte ili osvježite stranicu.",
			"audio": "audio",
			"doc": "dokument",
			"image": "slika"
		}
	},
	"settings": {
		"title": "Postavke",
		"errors": {
			"save_failed": "Spremanje postavki nije uspjelo!"
		},
		"appearance": {
			"title": "Izgled",
			"brightness_theme": "Svjetlina",
			"brightness_description": "Želite li da Vas Sunce oslijepi ili tihu umirujuću noć?",
			"light": "Svijetlo",
			"dark": "Tamno",
			"effect_settings": "Efekti",
			"effect_description": "Želite li zapanjujuće efekte ili miran doživljaj?",
			"enable": "Uključeno",
			"disable": "Isključeno"
		},
		"conversion": {
			"title": "Pretvaranje",
			"filename_format": "Način imenovanja datoteke",
			"filename_description": "Ovo će odrediti ime datoteke pri preuzimanju, <b>ali ne i nastavak.</b> Možete staviti navedene prijedloge u način imenovanja, koji će biti zamijenjeni sa relevatnim informacijama: <b>%name%</b> za originalni naziv datoteke, <b>%extension%</b> za originalni nastavak, i <b>%date%</b> za datum kada je datoteka bila pretvorena.",
			"placeholder": "VERT_%name%",
			"default_format": "Zadan format za pretvaranje",
			"default_format_description": "Ovo će promijeniti zadani format koji je izabran kada prenesete datoteku te vrste.",
			"default_format_image": "Slike",
			"default_format_video": "Videozapisi",
			"default_format_audio": "Audio",
			"default_format_document": "Dokumenti",
			"metadata": "Metapodatci datoteke",
			"metadata_description": "Ovo mijenja spremaju li se ikakvi metapodatci (EXIF, informacije o pjesmi, itd.) sa originalne datoteke na pretvorenu datoteku",
			"keep": "Ostavi",
			"remove": "Obriši",
			"quality": "Kvaliteta pretvaranja",
			"quality_description": "Ovo mijenja zadanu izlaznu kvalitetu pretvorene datoteke (u svojoj kategoriji). Veći iznosi mogu uzrokovati duže vrijeme za pretvaranje i veličinu.",
			"quality_video": "Ovo mijenja zadanu izlaznu kvalitetu pretvoranog videozapisa. Veći iznosi mogu uzrokovati duže vrijeme za pretvaranje i veličinu.",
			"quality_audio": "Audio (kbps)",
			"quality_images": "Slika (%)",
			"rate": "Sample rate (Hz)"
		},
		"vertd": {
			"title": "Pretvaranje videozapisa",
			"status": "status:",
			"loading": "učitavanje...",
			"available": "dostupno, commit id {commitId}",
			"unavailable": "nedostupno (Je li URL točan?)",
			"description": "<code>vertd</code> projekt je serverski omot za FFmpeg. Ovo omogućuje da pretvarate videozapise sa lakoćom VERTovog web sučelja, dok još uvijek možete iskoristiti snagu vašeg GPU da odradi što brže moguće.",    
			"hosting_info": "Mi držimo javnu instancu za Vašu lakoću, ali je veoma lako hostati na Vašem računalu ili serveru ako znate što radite. Možete preuzeti serverske programe [vertd_link]ovdje[/vertd_link] - Proces namještanja će biti lakši u budućnosti, pa njuškajte malo za nove vijesti!",
			"instance_url": "URL instance",
			"url_placeholder": "Na primjer: http://localhost:24153",
			"conversion_speed": "Brzina pretvaranja",
			"speed_description": "Ovo opisuje kompromis između brzine i kvalitete. Većom brzinom će izaći manja kvaliteta, ali će se posao brže odraditi.",
			"speeds": {
				"very_slow": "Jako Sporo",
				"slower": "Sporije",
				"slow": "Sporo",
				"medium": "Umjereno",
				"fast": "Brzo",
				"ultra_fast": "Veoma Brzo"
			}
		},
		"privacy": {
			"title": "Privatnost",
			"plausible_title": "Plausible analitike",
			"plausible_description": "Mi koristimo [plausible_link]Plausible[/plausible_link], alat za analitiku koji je fokusiran na privatnost, da prikupimo potpuno anonimne statistike. Svi podatci su anonimizirani i prikupljeni bez ikakvih identificirajućih informacija spremljeno i poslano. Možete vidjeti analitike [analytics_link]ovdje[/analytics_link] i izabrati da ne sudjelujete ispod.",
			"opt_in": "Sudjelujem",
			"opt_out": "Ne sudjelujem"
		},
		"language": {
			"title": "Jezik",
			"description": "Izaberi svoj preferirani jezik za VERTovo sučelje."
		}
	},
	"about": {
		"title": "O stranici",
		"why": {
			"title": "Zašto baš VERT?",
			"description": "<b>Pretvarači datoteka su nas uvijek razočarali.</b> Izuzetno su ružni, prepuni reklama, i najvažnije; spori! Odlučili smo riješiti problem jednom i zauvijek praveći alternativu koja riješava sve ove probleme, i više.<br/><br/>Sve datoteke koji nisu videozapisi su pretvoreni direktno na Vašem uređaju; To znači da nema nikakve stanke između slanja i primanja datoteka sa servera, i nikada ne dobijemo šansu gurati nos u vaše datoteke koje pretvarate. <br/><br/>Videozapisi se prenose na naše izuzetno brze RTX 4000 Ada servere. Vaši videozapisi tamo ostano sat vremena ako ih ne pretvorite. Ako ih i pretvorite, videozapis će ostati na serveru na sat vremena, ili dok se ne preuzme. Datoteka će zatim biti obrisana sa našeg servera."
		},
		"sponsors": {
			"title": "Sponzori",
			"description": "Želite li nas podržati? Kontaktirajte developera na [discord_link]Discord[/discord_link] serveru, ili pošaljite mail na",
			"email_copied": "Email kopiran u međuspremnik!"
		},
		"resources": {
			"title": "Resursi",
			"discord": "Discord",
			"source": "Source kod",
			"email": "Email"
		},
		"donate": {
			"title": "Donirajte nam",
			"description": "Sa vašom podrškom mi možemo nastaviti održavati i poboljšavati VERT.",
			"one_time": "Jednokratno",
			"monthly": "Mjesečno",
			"custom": "Prilagođeno",
			"pay_now": "Plati sada",
			"donate_amount": "Doniraj ${amount} USD",
			"thank_you": "Hvala Vam na Vašoj donaciji!!",
			"payment_failed": "Plaćanje neuspjelo: {message}{period} Niste naplaćeni.",
			"donation_error": "Dogodila se pogreška pri obradi donacije. Molimo pokušajte kasnije.",
			"payment_error": "Dogodila se pogreška pri prihvaćanju detalja o naplati. Molimo pokušajte kasnije."
		},
		"credits": {
			"title": "Zasluge",
			"contact_team": "Ako želite kontaktirati developere, molimo koristite email koji se nalazi u odjeljku \"resursi\".",
			"notable_contributors": "Značajni suradnici",
			"notable_description": "Želimo zahvaliti ovim ljudima za njihove ogromne doprinose VERTu.",
			"github_contributors": "GitHub suradnici",
			"github_description": "Velike zahvale svim ovim ljudima koji su nam pomogli! [github_link]Želiš nam i ti pomoći?[/github_link]",
			"no_contributors": "Čini se kako nitko nije još doprinio... [contribute_link]budite prvi koji će doprinjeti![/contribute_link]",
			"libraries": "Biblioteke",
			"libraries_description": "Velike zahvale prema FFmpeg (audio, video), ImageMagick (slike) i Pandoc (dokumenti) što su održavali tako odlične biblioteke svih ovih godina. VERT se oslanja na njih da bi Vam pružili pretvorbu.",
			"roles": {
				"lead_developer": "Glavni developer; Pretvarački backend, UI implementacija",
				"developer": "Developer; UI implementacija",
				"designer": "Dizajner; UX, branding, marketing",
				"docker_ci": "Održavanje Dockera i CI support",
				"former_cofounder": "Prijašnji suosnivač i dizajner"
			}
		},
		"errors": {
			"github_contributors": "Pogreška pri prikupljanju GitHub suradnika"
		}
	},
	"workers": {
		"errors": {
			"general": "Pogreška pri pretvaranju {file}: {message}",
			"magick": "Pogreška sa Magick radnikom, pretvorba slike možda neće raditi kao očekivano.",
			"ffmpeg": "Greška pri učitavanju ffmpeg, neke značajke možda neće raditi.",
			"no_audio": "Nije pronađen audio.",
			"invalid_rate": "Upisan nevažeći sample rate: {rate}Hz!"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: id.json]---
Location: VERT-main/messages/id.json
Signals: Docker

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "Unggah",
		"convert": "Konversi",
		"settings": "Pengaturan",
		"about": "Tentang",
		"toggle_theme": "Ganti Tema"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "Kode sumber",
		"discord_server": "Peladen Discord"
	},
	"upload": {
		"title": "Konverter berkas andalanmu.",
		"subtitle": "Semua gambar, audio, dan pemrosesan dokumen dilakukan pada perangkatmu. Video dikonversi pada peladen kilat kami. Tidak ada batas ukuran berkas, tidak ada iklan, dan benar-benar sumber terbuka.",
		"uploader": {
			"text": "Jatuhkan dan klik untuk {action}",
			"convert": "Konversi",
			"jpegify": "jpegify"
		},
		"cards": {
			"title": "Dapat Ditangani VERT ...",
			"images": "Gambar",
			"audio": "Audio",
			"documents": "Dokumen",
			"video": "Video",
			"video_server_processing": "Proses di Server",
			"local_supported": "Proses di Lokal",
			"status": {
				"text": "<b>Status:</b> {status}",
				"ready": "siap",
				"not_ready": "belum siap",
				"not_initialized": "tidak terinisialisasi",
				"downloading": "mengunduh...",
				"initializing": "menginisialisasi...",
				"unknown": "status tidak diketahui"
			},
			"supported_formats": "Format yang didukung:"
		},
		"tooltip": {
			"partial_support": "Format ini hanya dapat dikonversi ke {direction}.",
			"direction_input": "sumber asal (dari)",
			"direction_output": "target (ke)",
			"video_server_processing": "Video upload ke server untuk diproses secara baku, belajar bagaimana mengaturnya di sini."
		}
	},
	"convert": {
		"external_warning": {
			"title": "Peringatan server eksternal",
			"text": "Jika kamu memilih untuk mengonversi ke format video, berkas tersebut akan diunggah ke server eksternal untuk dikonversi. Apakah kamu ingin melanjutkan?",
			"yes": "Ya",
			"no": "Tidak"
		},
		"panel": {
			"convert_all": "Konversi semua",
			"download_all": "Unduh semua sebagai .zip",
			"remove_all": "Hapus semua berkas",
			"set_all_to": "Atur semua ke",
			"na": "N/A"
		},
		"dropdown": {
			"audio": "Audio",
			"video": "Video",
			"doc": "Dokumen",
			"image": "Gambar",
			"placeholder": "Cari format"
		},
		"tooltips": {
			"unknown_file": "Jenis berkas tidak diketahui",
			"audio_file": "Berkas audio",
			"video_file": "Berkas video",
			"document_file": "Berkas dokumen",
			"image_file": "Berkas gambar",
			"convert_file": "Konversi berkas ini",
			"download_file": "Unduh berkas ini"
		},
		"errors": {
			"cant_convert": "Kami tidak dapat mengonversi berkas ini.",
			"vertd_server": "apa yang kamu lakukan..? kamu seharusnya menjalankan peladen vertd!",
			"vertd_generic_body": "Terjadi galat saat mencoba mengonversi video kamu. Apakah kamu ingin mengirimkan video ini ke pengembang untuk membantu memperbaiki kutu ini? Hanya berkas video kamu yang akan dikirim. Tidak ada data identifikasi yang diunggah.",
			"vertd_generic_title": "Konversi video galat",
			"vertd_generic_yes": "Kirim video",
			"vertd_generic_no": "Jangan kirim",
			"vertd_failed_to_keep": "Gagal menyimpan video di peladen: {error}",
			"unsupported_format": "Hanya berkas gambar, video, audio, dan dokumen yang didukung",
			"vertd_not_found": "Tidak dapat menemukan layanan vertd untuk memulai konversi video. Apakah URL layanan sudah diatur dengan benar?",
			"worker_downloading": "Konverter {type} sedang diinisialisasi, harap tunggu beberapa saat.",
			"worker_error": "Konverter {type} mengalami kesalahan saat inisialisasi, coba lagi nanti.",
			"worker_timeout": "Konverter {type} memerlukan waktu lebih lama dari perkiraan untuk inisialisasi, harap tunggu beberapa saat lagi atau segarkan halaman.",
			"audio": "audio",
			"doc": "dokumen",
			"image": "gambar"
		}
	},
	"settings": {
		"title": "Pengaturan",
		"errors": {
			"save_failed": "Gagal menyimpan pengaturan!"
		},
		"appearance": {
			"title": "Tampilan",
			"brightness_theme": "Tema kecerahan",
			"brightness_description": "Ingin suasana terang benderang, atau malam yang sunyi?",
			"light": "Terang",
			"dark": "Gelap",
			"effect_settings": "Pengaturan efek",
			"effect_description": "Ingin efek keren, atau tampilan yang lebih sederhana?",
			"enable": "Aktifkan",
			"disable": "Nonaktifkan"
		},
		"conversion": {
			"title": "Konversi",
			"advanced_settings": "Pengaturan lanjutan",
			"filename_format": "Format nama berkas",
			"filename_description": "Ini akan menentukan nama berkas saat diunduh, <b>tidak termasuk ekstensi berkas.</b> Kamu dapat menggunakan template berikut dalam format, yang akan diganti dengan informasi terkait: <b>%name%</b> untuk nama berkas asli, <b>%extension%</b> untuk ekstensi berkas asli, dan <b>%date%</b> untuk tanggal saat berkas dikonversi.",
			"placeholder": "VERT_%name%",
			"default_format": "Format konversi baku",
			"default_format_description": "Ini akan mengubah format baku yang dipilih saat kamu mengunggah berkas dengan tipe tersebut.",
			"default_format_image": "Gambar",
			"default_format_video": "Video",
			"default_format_audio": "Audio",
			"default_format_document": "Dokumen",
			"metadata": "Metadata berkas",
			"metadata_description": "Menentukan apakah metadata (EXIF, info lagu, dll.) dari berkas asli akan dipertahankan di berkas hasil konversi.",
			"keep": "Pertahankan",
			"remove": "Hapus",
			"quality": "Kualitas konversi",
			"quality_description": "Mengubah kualitas keluaran baku berkas hasil konversi. Nilai yang lebih tinggi dapat menghasilkan waktu konversi dan ukuran berkas yang lebih besar.",
			"quality_video": "Mengubah kualitas keluaran baku berkas video hasil konversi. Nilai yang lebih tinggi dapat memperpanjang waktu dan ukuran berkas.",
			"quality_audio": "Audio (kbps)",
			"quality_images": "Gambar (%)",
			"rate": "Laju sampel (Hz)"
		},
		"vertd": {
			"title": "Konversi video",
			"status": "status:",
			"loading": "memuat...",
			"available": "tersedia, commit id {commitId}",
			"unavailable": "tidak tersedia (apakah URL sudah benar?)",
			"description": "Proyek <code>vertd</code> adalah server wrapper untuk FFmpeg. Ini memungkinkan kamu mengonversi video melalui antarmuka web VERT, sambil memanfaatkan kekuatan GPU untuk mempercepat proses.",
			"hosting_info": "Kami menyediakan instance publik untuk kemudahanmu, tetapi kamu juga bisa dengan mudah meng-host sendiri di PC atau server jika tahu caranya. Kamu dapat mengunduh binary server [vertd_link]di sini[/vertd_link] - proses penyiapan akan semakin mudah di masa depan, jadi tetap pantau!",
			"instance": "Instance",
			"url_placeholder": "Contoh: http://localhost:24153",
			"conversion_speed": "Kecepatan konversi",
			"speed_description": "Menjelaskan kompromi antara kecepatan dan kualitas. Kecepatan lebih tinggi menghasilkan kualitas lebih rendah, tetapi proses lebih cepat.",
			"speeds": {
				"very_slow": "Sangat Lambat",
				"slower": "Agak Lambat",
				"slow": "Lambat",
				"medium": "Sedang",
				"fast": "Cepat",
				"ultra_fast": "Sangat Cepat"
			},
			"auto_instance": "Otomatis (disarankan)",
			"eu_instance": "Falkenstein, Jerman",
			"us_instance": "Washington, AS",
			"custom_instance": "Kustom"
		},
		"privacy": {
			"title": "Privasi & data",
			"plausible_title": "Analitik Plausible",
			"plausible_description": "Kami menggunakan [plausible_link]Plausible[/plausible_link], alat analitik yang berfokus pada privasi, untuk mengumpulkan statistik anonim sepenuhnya. Semua data dianonimkan dan diagregasi, tanpa informasi yang dapat diidentifikasi. Kamu dapat melihat analitiknya [analytics_link]di sini[/analytics_link] dan memilih untuk keluar di bawah.",
			"opt_in": "Ikut serta",
			"opt_out": "Tidak ikut",
			"cache_title": "Manajemen cache",
			"cache_description": "Kami menyimpan berkas konverter di browser agar kamu tidak perlu mengunduh ulang setiap kali, meningkatkan performa dan menghemat data.",
			"refresh_cache": "Segarkan cache",
			"clear_cache": "Hapus cache",
			"files_cached": "{size} ({count} berkas)",
			"loading_cache": "Memuat...",
			"total_size": "Total Ukuran",
			"files_cached_label": "File Tersimpan",
			"cache_cleared": "Cache berhasil dihapus!",
			"cache_clear_error": "Gagal menghapus cache."
		},
		"language": {
			"title": "Bahasa",
			"description": "Pilih bahasa pilihanmu untuk antarmuka VERT."
		}
	},
	"about": {
		"title": "Tentang",
		"why": {
			"title": "Mengapa VERT?",
			"description": "<b>Konverter berkas selalu mengecewakan kami.</b> Mereka jelek, penuh iklan, dan yang paling penting; lambat. Kami memutuskan untuk menyelesaikan masalah ini sekali untuk selamanya dengan membuat alternatif yang memperbaiki semua masalah itu, dan lebih banyak lagi.<br/><br/>Semua berkas non-video dikonversi sepenuhnya di perangkat; artinya tidak ada jeda antara pengiriman dan penerimaan berkas, dan kami tidak pernah melihat berkas yang kamu konversi.<br/><br/>File video diunggah ke server RTX 4000 Ada super cepat kami. Videomu akan tetap di sana selama satu jam jika tidak dikonversi. Jika dikonversi, video akan bertahan satu jam atau hingga diunduh. Setelah itu, berkas akan dihapus dari server kami."
		},
		"sponsors": {
			"title": "Sponsor",
			"description": "Ingin mendukung kami? Hubungi pengembang di server [discord_link]Discord[/discord_link], atau kirim email ke",
			"email_copied": "Email disalin ke clipboard!"
		},
		"resources": {
			"title": "Sumber daya",
			"discord": "Discord",
			"source": "Sumber",
			"email": "Email"
		},
		"donate": {
			"title": "Donasi untuk VERT",
			"description": "Dengan dukunganmu, kami dapat terus memelihara dan meningkatkan VERT.",
			"one_time": "Sekali",
			"monthly": "Bulanan",
			"custom": "Kustom",
			"pay_now": "Bayar sekarang",
			"donate_amount": "Donasi ${amount} USD",
			"thank_you": "Terima kasih atas donasimu!",
			"payment_failed": "Pembayaran gagal: {message}{period} Kamu tidak dikenai biaya.",
			"donation_error": "Terjadi kesalahan saat memproses donasi. Coba lagi nanti.",
			"payment_error": "Kesalahan mengambil detail pembayaran. Coba lagi nanti."
		},
		"credits": {
			"title": "Kredit",
			"contact_team": "Jika kamu ingin menghubungi tim pengembang, gunakan email yang ada di kartu \"Sumber Daya\".",
			"notable_contributors": "Kontributor penting",
			"notable_description": "Kami ingin berterima kasih kepada orang-orang ini atas kontribusi besar mereka untuk VERT.",
			"github_contributors": "Kontributor GitHub",
			"github_description": "[jpegify_link]Terima kasih[/jpegify_link] banyak kepada semua orang yang telah membantu! [github_link]Ingin membantu juga?[/github_link]",
			"no_contributors": "Sepertinya belum ada yang berkontribusi... [contribute_link]jadilah yang pertama berkontribusi![/contribute_link]",
			"libraries": "Pustaka",
			"libraries_description": "Terima kasih besar kepada FFmpeg (audio, video), ImageMagick (gambar), dan Pandoc (dokumen) atas pemeliharaannya selama bertahun-tahun. VERT bergantung pada mereka untuk menyediakan konversi berkas.",
			"roles": {
				"lead_developer": "Pengembang utama; backend konversi, implementasi UI",
				"developer": "Pengembang; implementasi UI",
				"designer": "Desainer; UX, branding, pemasaran",
				"docker_ci": "Pemeliharaan Docker & CI",
				"former_cofounder": "Mantan co-founder & desainer"
			}
		},
		"errors": {
			"github_contributors": "Kesalahan mengambil kontributor GitHub"
		}
	},
	"workers": {
		"errors": {
			"general": "Kesalahan mengonversi {file}: {message}",
			"cancel": "Kesalahan membatalkan konversi untuk {file}: {message}",
			"magick": "Kesalahan di worker Magick, konversi gambar mungkin tidak berfungsi dengan benar.",
			"ffmpeg": "Kesalahan memuat ffmpeg, beberapa fitur mungkin tidak berfungsi.",
			"no_audio": "Tidak ditemukan aliran audio.",
			"invalid_rate": "Laju sampel tidak valid: {rate}Hz"
		}
	},
	"jpegify": {
		"title": "JPEGIFY RAHASIA!!!",
		"subtitle": "(psst... jangan beri tahu siapa pun!)",
		"button": "JPEGIFY {compression}%!!!",
		"download": "Unduh",
		"delete": "Hapus"
	}
}
```

--------------------------------------------------------------------------------

````
