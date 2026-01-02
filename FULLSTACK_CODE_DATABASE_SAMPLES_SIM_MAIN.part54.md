---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 54
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 54 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: wordpress.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/wordpress.mdx

```text
---
title: WordPress
description: WordPress-Inhalte verwalten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wordpress"
  color="#21759B"
/>

{/* MANUAL-CONTENT-START:intro */}
[WordPress](https://wordpress.org/) ist das weltweit führende Open-Source-Content-Management-System, das es einfach macht, Websites, Blogs und alle Arten von Online-Inhalten zu veröffentlichen und zu verwalten. Mit WordPress können Sie Beiträge oder Seiten erstellen und aktualisieren, Ihre Inhalte mit Kategorien und Schlagwörtern organisieren, Mediendateien verwalten, Kommentare moderieren und Benutzerkonten verwalten – so können Sie alles von persönlichen Blogs bis hin zu komplexen Unternehmenswebsites betreiben.

Die Integration von Sim mit WordPress ermöglicht es Ihren Agenten, wesentliche Website-Aufgaben zu automatisieren. Sie können programmatisch neue Blogbeiträge mit spezifischen Titeln, Inhalten, Kategorien, Schlagwörtern und Hauptbildern erstellen. Das Aktualisieren bestehender Beiträge – wie das Ändern von Inhalten, Titeln oder Veröffentlichungsstatus – ist unkompliziert. Sie können Inhalte auch veröffentlichen oder als Entwürfe speichern, statische Seiten verwalten, mit Medien-Uploads arbeiten, Kommentare überwachen und Inhalte relevanten Organisationstaxonomien zuweisen.

Durch die Verbindung von WordPress mit Ihren Automatisierungen ermöglicht Sim Ihren Agenten, die Veröffentlichung von Inhalten, redaktionelle Arbeitsabläufe und die tägliche Website-Verwaltung zu optimieren – so bleibt Ihre Website ohne manuellen Aufwand aktuell, organisiert und sicher.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie WordPress, um Beiträge, Seiten, Medien, Kommentare, Kategorien, Schlagwörter und Benutzer zu erstellen, zu aktualisieren und zu verwalten. Unterstützt WordPress.com-Websites über OAuth und selbst gehostete WordPress-Websites mit Anwendungspasswort-Authentifizierung.

## Tools

### `wordpress_create_post`

Einen neuen Blogbeitrag in WordPress.com erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder meineseite.wordpress.com\) |
| `title` | string | Ja | Beitragstitel |
| `content` | string | Nein | Beitragsinhalt \(HTML oder Klartext\) |
| `status` | string | Nein | Beitragsstatus: publish, draft, pending, private oder future |
| `excerpt` | string | Nein | Beitragsauszug |
| `categories` | string | Nein | Kommagetrennte Kategorie-IDs |
| `tags` | string | Nein | Kommagetrennte Schlagwort-IDs |
| `featuredMedia` | number | Nein | Medien-ID des Hauptbildes |
| `slug` | string | Nein | URL-Slug für den Beitrag |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `post` | object | Der erstellte Beitrag |

### `wordpress_update_post`

Aktualisieren eines vorhandenen Blog-Beitrags in WordPress.com

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `postId` | number | Ja | Die ID des zu aktualisierenden Beitrags |
| `title` | string | Nein | Beitragstitel |
| `content` | string | Nein | Beitragsinhalt \(HTML oder Klartext\) |
| `status` | string | Nein | Beitragsstatus: publish, draft, pending, private oder future |
| `excerpt` | string | Nein | Beitragsauszug |
| `categories` | string | Nein | Kommagetrennte Kategorie-IDs |
| `tags` | string | Nein | Kommagetrennte Tag-IDs |
| `featuredMedia` | number | Nein | Medien-ID des Beitragsbilds |
| `slug` | string | Nein | URL-Slug für den Beitrag |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `post` | object | Der aktualisierte Beitrag |

### `wordpress_delete_post`

Löschen eines Blog-Beitrags von WordPress.com

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `postId` | number | Ja | Die ID des zu löschenden Beitrags |
| `force` | boolean | Nein | Papierkorb umgehen und dauerhaft löschen erzwingen |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `deleted` | boolean | Gibt an, ob der Beitrag gelöscht wurde |
| `post` | object | Der gelöschte Beitrag |

### `wordpress_get_post`

Einen einzelnen Blog-Beitrag von WordPress.com anhand der ID abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `postId` | number | Ja | Die ID des abzurufenden Beitrags |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `post` | object | Der abgerufene Beitrag |

### `wordpress_list_posts`

Blog-Beiträge von WordPress.com mit optionalen Filtern auflisten

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `perPage` | number | Nein | Anzahl der Beiträge pro Seite \(Standard: 10, max: 100\) |
| `page` | number | Nein | Seitennummer für Paginierung |
| `status` | string | Nein | Beitragsstatus-Filter: publish, draft, pending, private |
| `author` | number | Nein | Nach Autor-ID filtern |
| `categories` | string | Nein | Kommagetrennte Kategorie-IDs zum Filtern |
| `tags` | string | Nein | Kommagetrennte Tag-IDs zum Filtern |
| `search` | string | Nein | Suchbegriff zum Filtern von Beiträgen |
| `orderBy` | string | Nein | Sortieren nach Feld: date, id, title, slug, modified |
| `order` | string | Nein | Sortierrichtung: asc oder desc |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `posts` | array | Liste der Beiträge |

### `wordpress_create_page`

Eine neue Seite in WordPress.com erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder meinseite.wordpress.com\) |
| `title` | string | Ja | Seitentitel |
| `content` | string | Nein | Seiteninhalt \(HTML oder Klartext\) |
| `status` | string | Nein | Seitenstatus: publish, draft, pending, private |
| `excerpt` | string | Nein | Seitenauszug |
| `parent` | number | Nein | Übergeordnete Seiten-ID für hierarchische Seiten |
| `menuOrder` | number | Nein | Reihenfolge im Seitenmenü |
| `featuredMedia` | number | Nein | Medien-ID des Beitragsbilds |
| `slug` | string | Nein | URL-Slug für die Seite |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `page` | object | Die erstellte Seite |

### `wordpress_update_page`

Eine bestehende Seite in WordPress.com aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder meinseite.wordpress.com\) |
| `pageId` | number | Ja | Die ID der zu aktualisierenden Seite |
| `title` | string | Nein | Seitentitel |
| `content` | string | Nein | Seiteninhalt \(HTML oder Klartext\) |
| `status` | string | Nein | Seitenstatus: publish, draft, pending, private |
| `excerpt` | string | Nein | Seitenauszug |
| `parent` | number | Nein | Übergeordnete Seiten-ID für hierarchische Seiten |
| `menuOrder` | number | Nein | Reihenfolge im Seitenmenü |
| `featuredMedia` | number | Nein | Medien-ID des Beitragsbilds |
| `slug` | string | Nein | URL-Slug für die Seite |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `page` | object | Die aktualisierte Seite |

### `wordpress_delete_page`

Eine Seite von WordPress.com löschen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `pageId` | number | Ja | Die ID der zu löschenden Seite |
| `force` | boolean | Nein | Papierkorb umgehen und dauerhaft löschen erzwingen |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `deleted` | boolean | Ob die Seite gelöscht wurde |
| `page` | object | Die gelöschte Seite |

### `wordpress_get_page`

Eine einzelne Seite von WordPress.com anhand der ID abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `pageId` | number | Ja | Die ID der abzurufenden Seite |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `page` | object | Die abgerufene Seite |

### `wordpress_list_pages`

Seiten von WordPress.com mit optionalen Filtern auflisten

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `perPage` | number | Nein | Anzahl der Seiten pro Anfrage \(Standard: 10, max: 100\) |
| `page` | number | Nein | Seitennummer für Paginierung |
| `status` | string | Nein | Seitenstatus-Filter: publish, draft, pending, private |
| `parent` | number | Nein | Nach übergeordneter Seiten-ID filtern |
| `search` | string | Nein | Suchbegriff zum Filtern von Seiten |
| `orderBy` | string | Nein | Sortieren nach Feld: date, id, title, slug, modified, menu_order |
| `order` | string | Nein | Sortierrichtung: asc oder desc |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `pages` | array | Liste der Seiten |

### `wordpress_upload_media`

Eine Mediendatei (Bild, Video, Dokument) zu WordPress.com hochladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `file` | file | Nein | Hochzuladende Datei \(UserFile-Objekt\) |
| `filename` | string | Nein | Optionale Überschreibung des Dateinamens \(z.B. bild.jpg\) |
| `title` | string | Nein | Medientitel |
| `caption` | string | Nein | Medienunterschrift |
| `altText` | string | Nein | Alternativer Text für Barrierefreiheit |
| `description` | string | Nein | Medienbeschreibung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `media` | object | Das hochgeladene Medienelement |

### `wordpress_get_media`

Ein einzelnes Medienelement von WordPress.com anhand der ID abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Website-ID oder Domain \(z.B. 12345678 oder meinwebsite.wordpress.com\) |
| `mediaId` | number | Ja | Die ID des abzurufenden Medienelements |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `media` | object | Das abgerufene Medienelement |

### `wordpress_list_media`

Medienelemente aus der WordPress.com-Medienbibliothek auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `perPage` | number | Nein | Anzahl der Medienelemente pro Anfrage \(Standard: 10, max: 100\) |
| `page` | number | Nein | Seitenzahl für Paginierung |
| `search` | string | Nein | Suchbegriff zum Filtern von Medien |
| `mediaType` | string | Nein | Nach Medientyp filtern: image, video, audio, application |
| `mimeType` | string | Nein | Nach spezifischem MIME-Typ filtern \(z.B. image/jpeg\) |
| `orderBy` | string | Nein | Sortieren nach Feld: date, id, title, slug |
| `order` | string | Nein | Sortierrichtung: asc oder desc |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `media` | array | Liste der Medienelemente |

### `wordpress_delete_media`

Ein Medienelement von WordPress.com löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `mediaId` | number | Ja | Die ID des zu löschenden Medienelements |
| `force` | boolean | Nein | Erzwungenes Löschen \(Medien haben keinen Papierkorb, daher ist das Löschen permanent\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `deleted` | boolean | Ob das Medium gelöscht wurde |
| `media` | object | Das gelöschte Medienelement |

### `wordpress_create_comment`

Einen neuen Kommentar zu einem WordPress.com-Beitrag erstellen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `postId` | number | Ja | Die ID des Beitrags, der kommentiert werden soll |
| `content` | string | Ja | Kommentarinhalt |
| `parent` | number | Nein | Übergeordnete Kommentar-ID für Antworten |
| `authorName` | string | Nein | Anzeigename des Kommentarautors |
| `authorEmail` | string | Nein | E-Mail des Kommentarautors |
| `authorUrl` | string | Nein | URL des Kommentarautors |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `comment` | object | Der erstellte Kommentar |

### `wordpress_list_comments`

Kommentare von WordPress.com mit optionalen Filtern auflisten

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `perPage` | number | Nein | Anzahl der Kommentare pro Anfrage \(Standard: 10, max: 100\) |
| `page` | number | Nein | Seitenzahl für Paginierung |
| `postId` | number | Nein | Nach Beitrags-ID filtern |
| `status` | string | Nein | Nach Kommentarstatus filtern: approved, hold, spam, trash |
| `search` | string | Nein | Suchbegriff zum Filtern von Kommentaren |
| `orderBy` | string | Nein | Sortieren nach Feld: date, id, parent |
| `order` | string | Nein | Sortierrichtung: asc oder desc |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `comments` | array | Liste der Kommentare |

### `wordpress_update_comment`

Aktualisieren eines Kommentars in WordPress.com (Inhalt oder Status)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `commentId` | number | Ja | Die ID des zu aktualisierenden Kommentars |
| `content` | string | Nein | Aktualisierter Kommentarinhalt |
| `status` | string | Nein | Kommentarstatus: approved, hold, spam, trash |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `comment` | object | Der aktualisierte Kommentar |

### `wordpress_delete_comment`

Löschen eines Kommentars von WordPress.com

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `commentId` | number | Ja | Die ID des zu löschenden Kommentars |
| `force` | boolean | Nein | Papierkorb umgehen und dauerhaft löschen erzwingen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `deleted` | boolean | Ob der Kommentar gelöscht wurde |
| `comment` | object | Der gelöschte Kommentar |

### `wordpress_create_category`

Erstellen einer neuen Kategorie in WordPress.com

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder meinseite.wordpress.com\) |
| `name` | string | Ja | Kategoriename |
| `description` | string | Nein | Kategoriebeschreibung |
| `parent` | number | Nein | Übergeordnete Kategorie-ID für hierarchische Kategorien |
| `slug` | string | Nein | URL-Slug für die Kategorie |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `category` | object | Die erstellte Kategorie |

### `wordpress_list_categories`

Kategorien von WordPress.com auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder meinseite.wordpress.com\) |
| `perPage` | number | Nein | Anzahl der Kategorien pro Anfrage \(Standard: 10, max: 100\) |
| `page` | number | Nein | Seitenzahl für Paginierung |
| `search` | string | Nein | Suchbegriff zum Filtern von Kategorien |
| `order` | string | Nein | Sortierrichtung: asc oder desc |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `categories` | array | Liste der Kategorien |

### `wordpress_create_tag`

Einen neuen Tag in WordPress.com erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder meinseite.wordpress.com\) |
| `name` | string | Ja | Tag-Name |
| `description` | string | Nein | Tag-Beschreibung |
| `slug` | string | Nein | URL-Slug für den Tag |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `tag` | object | Der erstellte Tag |

### `wordpress_list_tags`

Tags von WordPress.com auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `perPage` | number | Nein | Anzahl der Tags pro Anfrage \(Standard: 10, max: 100\) |
| `page` | number | Nein | Seitennummer für Paginierung |
| `search` | string | Nein | Suchbegriff zum Filtern von Tags |
| `order` | string | Nein | Sortierrichtung: asc oder desc |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `tags` | array | Liste der Tags |

### `wordpress_get_current_user`

Informationen über den aktuell authentifizierten WordPress.com-Benutzer abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `user` | object | Der aktuelle Benutzer |

### `wordpress_list_users`

Benutzer von WordPress.com auflisten (erfordert Administratorrechte)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `perPage` | number | Nein | Anzahl der Benutzer pro Anfrage \(Standard: 10, max: 100\) |
| `page` | number | Nein | Seitennummer für Paginierung |
| `search` | string | Nein | Suchbegriff zum Filtern von Benutzern |
| `roles` | string | Nein | Kommagetrennte Rollennamen zum Filtern |
| `order` | string | Nein | Sortierrichtung: asc oder desc |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `users` | array | Liste der Benutzer |

### `wordpress_get_user`

Einen bestimmten Benutzer von WordPress.com anhand der ID abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `userId` | number | Ja | Die ID des abzurufenden Benutzers |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `user` | object | Der abgerufene Benutzer |

### `wordpress_search_content`

Suche über alle Inhaltstypen in WordPress.com (Beiträge, Seiten, Medien)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | WordPress.com-Site-ID oder Domain \(z.B. 12345678 oder mysite.wordpress.com\) |
| `query` | string | Ja | Suchanfrage |
| `perPage` | number | Nein | Anzahl der Ergebnisse pro Anfrage \(Standard: 10, max: 100\) |
| `page` | number | Nein | Seitenzahl für Paginierung |
| `type` | string | Nein | Nach Inhaltstyp filtern: post, page, attachment |
| `subtype` | string | Nein | Nach Beitragstyp-Slug filtern \(z.B. post, page\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `results` | array | Suchergebnisse |

## Notizen

- Kategorie: `tools`
- Typ: `wordpress`
```

--------------------------------------------------------------------------------

---[FILE: x.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/x.mdx

```text
---
title: X
description: Interagiere mit X
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="x"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[X](https://x.com/) (früher Twitter) ist eine beliebte Social-Media-Plattform, die Echtzeit-Kommunikation, Content-Sharing und Interaktion mit weltweiten Zielgruppen ermöglicht.

Die X-Integration in Sim nutzt OAuth-Authentifizierung, um eine sichere Verbindung mit der X-API herzustellen und ermöglicht deinen Agenten, programmatisch mit der Plattform zu interagieren. Diese OAuth-Implementierung gewährleistet sicheren Zugriff auf die Funktionen von X und wahrt gleichzeitig die Privatsphäre und Sicherheit der Nutzer.

Mit der X-Integration können deine Agenten:

- **Inhalte posten**: Neue Tweets erstellen, auf bestehende Konversationen antworten oder Medien direkt aus deinen Workflows teilen
- **Gespräche überwachen**: Erwähnungen, Keywords oder bestimmte Accounts verfolgen, um über relevante Diskussionen informiert zu bleiben
- **Mit Zielgruppen interagieren**: Automatisch auf Erwähnungen, Direktnachrichten oder bestimmte Auslöser reagieren
- **Trends analysieren**: Erkenntnisse aus Trendthemen, Hashtags oder Nutzerinteraktionsmustern gewinnen
- **Informationen recherchieren**: Nach bestimmten Inhalten, Nutzerprofilen oder Gesprächen suchen, um Agentenentscheidungen zu unterstützen

In Sim ermöglicht die X-Integration anspruchsvolle Social-Media-Automatisierungsszenarien. Deine Agenten können Markenerwähnungen überwachen und angemessen reagieren, Inhalte basierend auf bestimmten Auslösern planen und veröffentlichen, Social Listening für Marktforschung betreiben oder interaktive Erlebnisse schaffen, die sowohl konversationelle KI als auch Social-Media-Engagement umfassen. Durch die Verbindung von Sim mit X über OAuth kannst du intelligente Agenten erstellen, die eine konsistente und reaktionsschnelle Social-Media-Präsenz aufrechterhalten und gleichzeitig Plattformrichtlinien und Best Practices für die API-Nutzung einhalten.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integriere X in den Workflow. Kann neue Tweets posten, Tweet-Details abrufen, Tweets durchsuchen und Benutzerprofile anzeigen. Erfordert OAuth.

## Tools

### `x_write`

Neue Tweets posten, auf Tweets antworten oder Umfragen auf X (Twitter) erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `text` | string | Ja | Der Textinhalt deines Tweets |
| `replyTo` | string | Nein | ID des Tweets, auf den geantwortet werden soll |
| `mediaIds` | array | Nein | Array von Medien-IDs, die an den Tweet angehängt werden sollen |
| `poll` | object | Nein | Umfragekonfiguration für den Tweet |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `tweet` | object | Die Daten des neu erstellten Tweets |

### `x_read`

Tweet-Details lesen, einschließlich Antworten und Konversationskontext

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `tweetId` | string | Ja | ID des zu lesenden Tweets |
| `includeReplies` | boolean | Nein | Ob Antworten auf den Tweet einbezogen werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `tweet` | object | Die Hauptdaten des Tweets |

### `x_search`

Nach Tweets mit Schlüsselwörtern, Hashtags oder erweiterten Abfragen suchen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Suchabfrage \(unterstützt X-Suchoperatoren\) |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(Standard: 10, max: 100\) |
| `startTime` | string | Nein | Startzeit für die Suche \(ISO 8601-Format\) |
| `endTime` | string | Nein | Endzeit für die Suche \(ISO 8601-Format\) |
| `sortOrder` | string | Nein | Sortierreihenfolge für Ergebnisse \(recency oder relevancy\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `tweets` | array | Array von Tweets, die der Suchanfrage entsprechen |

### `x_user`

Benutzerprofilinformationen abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `username` | string | Ja | Benutzername für die Suche \(ohne @-Symbol\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `user` | object | X-Benutzerprofilinformationen |

## Hinweise

- Kategorie: `tools`
- Typ: `x`
```

--------------------------------------------------------------------------------

---[FILE: youtube.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/youtube.mdx

```text
---
title: YouTube
description: Interagiere mit YouTube-Videos, Kanälen und Playlists
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="youtube"
  color="#FF0000"
/>

{/* MANUAL-CONTENT-START:intro */}
[YouTube](https://www.youtube.com/) ist die weltweit größte Videoplattform, die Milliarden von Videos hostet und über 2 Milliarden eingeloggte monatliche Nutzer bedient.

Mit YouTubes umfangreichen API-Funktionen können Sie:

- **Inhalte suchen**: Finden Sie relevante Videos in YouTubes riesiger Bibliothek mit spezifischen Schlüsselwörtern, Filtern und Parametern
- **Auf Metadaten zugreifen**: Rufen Sie detaillierte Informationen über Videos ab, einschließlich Titel, Beschreibungen, Aufrufe und Engagement-Metriken
- **Trends analysieren**: Identifizieren Sie beliebte Inhalte und Trendthemen innerhalb bestimmter Kategorien oder Regionen
- **Erkenntnisse gewinnen**: Sammeln Sie Daten über Zuschauerpräferenzen, Content-Performance und Engagement-Muster

In Sim ermöglicht die YouTube-Integration Ihren Agenten, YouTube-Inhalte programmatisch zu suchen und zu analysieren als Teil ihrer Workflows. Dies ermöglicht leistungsstarke Automatisierungsszenarien, die aktuelle Videoinformationen erfordern. Ihre Agenten können nach Anleitungsvideos suchen, Content-Trends recherchieren, Informationen von Bildungskanälen sammeln oder bestimmte Ersteller auf neue Uploads überwachen. Diese Integration überbrückt die Lücke zwischen Ihren KI-Workflows und dem weltweit größten Video-Repository und ermöglicht anspruchsvollere und inhaltsbewusstere Automatisierungen. Durch die Verbindung von Sim mit YouTube können Sie Agenten erstellen, die mit den neuesten Informationen auf dem Laufenden bleiben, genauere Antworten liefern und Nutzern mehr Mehrwert bieten - alles ohne manuelle Eingriffe oder benutzerdefinierten Code.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie YouTube in den Workflow. Kann Videos suchen, Videodetails abrufen, Kanalinformationen abrufen, alle Videos eines Kanals abrufen, Kanal-Playlists abrufen, Playlist-Elemente abrufen, verwandte Videos finden und Videokommentare abrufen.

## Tools

### `youtube_search`

Suchen Sie nach Videos auf YouTube mit der YouTube Data API. Unterstützt erweiterte Filterung nach Kanal, Datumsbereich, Dauer, Kategorie, Qualität, Untertiteln und mehr.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Suchanfrage für YouTube-Videos |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Videos (1-50) |
| `apiKey` | string | Ja | YouTube API-Schlüssel |
| `channelId` | string | Nein | Filtert Ergebnisse nach einer bestimmten YouTube-Kanal-ID |
| `publishedAfter` | string | Nein | Nur Videos zurückgeben, die nach diesem Datum veröffentlicht wurden (RFC 3339-Format: "2024-01-01T00:00:00Z") |
| `publishedBefore` | string | Nein | Nur Videos zurückgeben, die vor diesem Datum veröffentlicht wurden (RFC 3339-Format: "2024-01-01T00:00:00Z") |
| `videoDuration` | string | Nein | Nach Videolänge filtern: "short" (weniger als 4 Minuten), "medium" (4-20 Minuten), "long" (mehr als 20 Minuten), "any" |
| `order` | string | Nein | Ergebnisse sortieren nach: "date", "rating", "relevance" (Standard), "title", "videoCount", "viewCount" |
| `videoCategoryId` | string | Nein | Nach YouTube-Kategorie-ID filtern (z.B. "10" für Musik, "20" für Gaming) |
| `videoDefinition` | string | Nein | Nach Videoqualität filtern: "high" (HD), "standard", "any" |
| `videoCaption` | string | Nein | Nach Untertitelverfügbarkeit filtern: "closedCaption" (hat Untertitel), "none" (keine Untertitel), "any" |
| `regionCode` | string | Nein | Ergebnisse zurückgeben, die für eine bestimmte Region relevant sind (ISO 3166-1 alpha-2 Ländercode, z.B. "US", "GB") |
| `relevanceLanguage` | string | Nein | Ergebnisse zurückgeben, die für eine Sprache am relevantesten sind (ISO 639-1 Code, z.B. "en", "es") |
| `safeSearch` | string | Nein | Inhaltsfilterungsstufe: "moderate" (Standard), "none", "strict" |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `items` | array | Array von YouTube-Videos, die der Suchanfrage entsprechen |

### `youtube_video_details`

Erhalte detaillierte Informationen über ein bestimmtes YouTube-Video.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `videoId` | string | Ja | YouTube-Video-ID |
| `apiKey` | string | Ja | YouTube API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `videoId` | string | YouTube-Video-ID |
| `title` | string | Videotitel |
| `description` | string | Videobeschreibung |
| `channelId` | string | Kanal-ID |
| `channelTitle` | string | Kanalname |
| `publishedAt` | string | Veröffentlichungsdatum und -uhrzeit |
| `duration` | string | Videodauer im ISO 8601-Format |
| `viewCount` | number | Anzahl der Aufrufe |
| `likeCount` | number | Anzahl der Likes |
| `commentCount` | number | Anzahl der Kommentare |
| `thumbnail` | string | Video-Thumbnail-URL |
| `tags` | array | Video-Tags |

### `youtube_channel_info`

Erhalte detaillierte Informationen über einen YouTube-Kanal.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `channelId` | string | Nein | YouTube-Kanal-ID \(verwende entweder channelId oder username\) |
| `username` | string | Nein | YouTube-Kanalbenutzername \(verwende entweder channelId oder username\) |
| `apiKey` | string | Ja | YouTube API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `channelId` | string | YouTube-Kanal-ID |
| `title` | string | Kanalname |
| `description` | string | Kanalbeschreibung |
| `subscriberCount` | number | Anzahl der Abonnenten |
| `videoCount` | number | Anzahl der Videos |
| `viewCount` | number | Gesamtaufrufe des Kanals |
| `publishedAt` | string | Erstellungsdatum des Kanals |
| `thumbnail` | string | URL des Kanal-Thumbnails |
| `customUrl` | string | Benutzerdefinierte Kanal-URL |

### `youtube_channel_videos`

Alle Videos von einem bestimmten YouTube-Kanal abrufen, mit Sortieroptionen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `channelId` | string | Ja | YouTube-Kanal-ID, von der Videos abgerufen werden sollen |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Videos \(1-50\) |
| `order` | string | Nein | Sortierreihenfolge: "date" \(neueste zuerst\), "rating", "relevance", "title", "viewCount" |
| `pageToken` | string | Nein | Seitentoken für Paginierung |
| `apiKey` | string | Ja | YouTube API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `items` | array | Array von Videos des Kanals |

### `youtube_channel_playlists`

Alle Playlists von einem bestimmten YouTube-Kanal abrufen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `channelId` | string | Ja | YouTube-Kanal-ID, von der Playlists abgerufen werden sollen |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Playlists \(1-50\) |
| `pageToken` | string | Nein | Seitentoken für Paginierung |
| `apiKey` | string | Ja | YouTube API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `items` | array | Array von Playlists des Kanals |

### `youtube_playlist_items`

Videos aus einer YouTube-Playlist abrufen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `playlistId` | string | Ja | YouTube-Playlist-ID |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Videos |
| `pageToken` | string | Nein | Seitentoken für Paginierung |
| `apiKey` | string | Ja | YouTube API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `items` | array | Array von Videos in der Playlist |

### `youtube_comments`

Kommentare von einem YouTube-Video abrufen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `videoId` | string | Ja | YouTube-Video-ID |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Kommentare |
| `order` | string | Nein | Reihenfolge der Kommentare: time oder relevance |
| `pageToken` | string | Nein | Seitentoken für Paginierung |
| `apiKey` | string | Ja | YouTube API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `items` | array | Array von Kommentaren zum Video |

## Hinweise

- Kategorie: `tools`
- Typ: `youtube`
```

--------------------------------------------------------------------------------

````
