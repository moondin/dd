---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 30
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 30 of 933)

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

---[FILE: intercom.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/intercom.mdx

```text
---
title: Intercom
description: Verwalte Kontakte, Unternehmen, Gespräche, Tickets und Nachrichten in Intercom
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="intercom"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Intercom](https://www.intercom.com/) ist eine führende Kundenkommunikationsplattform, die es dir ermöglicht, deine Interaktionen mit Kontakten, Unternehmen, Gesprächen, Tickets und Nachrichten an einem Ort zu verwalten und zu automatisieren. Die Intercom-Integration in Sim ermöglicht es deinen Agenten, Kundenbeziehungen, Support-Anfragen und Gespräche direkt aus deinen automatisierten Workflows heraus programmatisch zu verwalten.

Mit den Intercom-Tools kannst du:

- **Kontaktverwaltung:** Erstellen, abrufen, aktualisieren, auflisten, suchen und löschen von Kontakten – automatisiere deine CRM-Prozesse und halte deine Kundendaten aktuell.
- **Unternehmensverwaltung:** Erstelle neue Unternehmen, rufe Unternehmensdetails ab und liste alle Unternehmen auf, die mit deinen Nutzern oder Geschäftskunden verbunden sind.
- **Gesprächshandling:** Abrufen, auflisten, beantworten und durchsuchen von Gesprächen – ermöglicht Agenten, laufende Support-Threads zu verfolgen, Antworten zu geben und Folgemaßnahmen zu automatisieren.
- **Ticket-Management:** Erstelle und rufe Tickets programmatisch ab, um Kundendienst, Tracking von Support-Problemen und Workflow-Eskalationen zu automatisieren.
- **Nachrichten senden:** Löse Nachrichten an Nutzer oder Leads für Onboarding, Support oder Marketing aus, alles innerhalb deiner Workflow-Automatisierung.

Durch die Integration von Intercom-Tools in Sim ermöglichst du deinen Workflows, direkt mit deinen Nutzern zu kommunizieren, Kundensupport-Prozesse zu automatisieren, Leads zu verwalten und die Kommunikation im großen Maßstab zu optimieren. Egal ob du neue Kontakte erstellen, Kundendaten synchronisieren, Support-Tickets verwalten oder personalisierte Engagement-Nachrichten senden musst – die Intercom-Tools bieten eine umfassende Möglichkeit, Kundeninteraktionen als Teil deiner intelligenten Automatisierungen zu verwalten.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integriere Intercom in den Workflow. Kann Kontakte erstellen, abrufen, aktualisieren, auflisten, suchen und löschen; Unternehmen erstellen, abrufen und auflisten; Gespräche abrufen, auflisten, beantworten und durchsuchen; Tickets erstellen und abrufen; sowie Nachrichten erstellen.

## Tools

### `intercom_create_contact`

Erstellen Sie einen neuen Kontakt in Intercom mit E-Mail, external_id oder Rolle

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Nein | Die E-Mail-Adresse des Kontakts |
| `external_id` | string | Nein | Eine eindeutige Kennung für den Kontakt, die vom Client bereitgestellt wird |
| `phone` | string | Nein | Die Telefonnummer des Kontakts |
| `name` | string | Nein | Der Name des Kontakts |
| `avatar` | string | Nein | Eine Avatar-Bild-URL für den Kontakt |
| `signed_up_at` | number | Nein | Der Zeitpunkt der Registrierung des Benutzers als Unix-Zeitstempel |
| `last_seen_at` | number | Nein | Der Zeitpunkt, zu dem der Benutzer zuletzt gesehen wurde, als Unix-Zeitstempel |
| `owner_id` | string | Nein | Die ID eines Administrators, dem die Kontoinhaberschaft des Kontakts zugewiesen wurde |
| `unsubscribed_from_emails` | boolean | Nein | Ob der Kontakt E-Mails abbestellt hat |
| `custom_attributes` | string | Nein | Benutzerdefinierte Attribute als JSON-Objekt \(z.B. \{"attribute_name": "value"\}\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Erstellte Kontaktdaten |

### `intercom_get_contact`

Einen einzelnen Kontakt anhand der ID von Intercom abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Ja | Kontakt-ID zum Abrufen |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Kontaktdaten |

### `intercom_update_contact`

Einen bestehenden Kontakt in Intercom aktualisieren

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Ja | Zu aktualisierende Kontakt-ID |
| `email` | string | Nein | Die E-Mail-Adresse des Kontakts |
| `phone` | string | Nein | Die Telefonnummer des Kontakts |
| `name` | string | Nein | Der Name des Kontakts |
| `avatar` | string | Nein | Eine Avatar-Bild-URL für den Kontakt |
| `signed_up_at` | number | Nein | Der Zeitpunkt der Registrierung des Benutzers als Unix-Timestamp |
| `last_seen_at` | number | Nein | Der Zeitpunkt, zu dem der Benutzer zuletzt gesehen wurde, als Unix-Timestamp |
| `owner_id` | string | Nein | Die ID eines Administrators, dem die Kontoeigentümerschaft des Kontakts zugewiesen wurde |
| `unsubscribed_from_emails` | boolean | Nein | Ob der Kontakt E-Mails abbestellt hat |
| `custom_attributes` | string | Nein | Benutzerdefinierte Attribute als JSON-Objekt \(z.B. \{"attribut_name": "wert"\}\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Aktualisierte Kontaktdaten |

### `intercom_list_contacts`

Alle Kontakte von Intercom mit Paginierungsunterstützung auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `per_page` | number | Nein | Anzahl der Ergebnisse pro Seite (max: 150) |
| `starting_after` | string | Nein | Cursor für Paginierung - ID, nach der begonnen werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Liste der Kontakte |

### `intercom_search_contacts`

Suche nach Kontakten in Intercom mit einer Abfrage

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Suchabfrage (z.B., \{"field":"email","operator":"=","value":"user@example.com"\}) |
| `per_page` | number | Nein | Anzahl der Ergebnisse pro Seite (max: 150) |
| `starting_after` | string | Nein | Cursor für Paginierung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Suchergebnisse |

### `intercom_delete_contact`

Einen Kontakt aus Intercom nach ID löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Ja | Kontakt-ID zum Löschen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Löschergebnis |

### `intercom_create_company`

Ein Unternehmen in Intercom erstellen oder aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `company_id` | string | Ja | Ihre eindeutige Kennung für das Unternehmen |
| `name` | string | Nein | Der Name des Unternehmens |
| `website` | string | Nein | Die Unternehmenswebsite |
| `plan` | string | Nein | Der Unternehmensplan |
| `size` | number | Nein | Die Anzahl der Mitarbeiter im Unternehmen |
| `industry` | string | Nein | Die Branche, in der das Unternehmen tätig ist |
| `monthly_spend` | number | Nein | Wie viel Umsatz das Unternehmen für Ihr Geschäft generiert. Hinweis: Dieses Feld kürzt Dezimalzahlen auf ganze Zahlen \(z.B. wird aus 155,98 die Zahl 155\) |
| `custom_attributes` | string | Nein | Benutzerdefinierte Attribute als JSON-Objekt |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Erstellte oder aktualisierte Unternehmensdaten |

### `intercom_get_company`

Ein einzelnes Unternehmen anhand der ID von Intercom abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | Ja | Unternehmens-ID zum Abrufen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Unternehmensdaten |

### `intercom_list_companies`

Listet alle Unternehmen von Intercom mit Paginierungsunterstützung auf. Hinweis: Dieser Endpunkt hat ein Limit von 10.000 Unternehmen, die über Paginierung zurückgegeben werden können. Für Datensätze mit mehr als 10.000 Unternehmen verwenden Sie stattdessen die Scroll-API.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `per_page` | number | Nein | Anzahl der Ergebnisse pro Seite |
| `page` | number | Nein | Seitennummer |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Liste der Unternehmen |

### `intercom_get_conversation`

Eine einzelne Konversation anhand der ID von Intercom abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | Ja | Konversations-ID zum Abrufen |
| `display_as` | string | Nein | Auf "plaintext" setzen, um Nachrichten im Klartext abzurufen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Konversationsdaten |

### `intercom_list_conversations`

Alle Konversationen von Intercom mit Paginierungsunterstützung auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `per_page` | number | Nein | Anzahl der Ergebnisse pro Seite \(max: 150\) |
| `starting_after` | string | Nein | Cursor für Paginierung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Liste der Konversationen |

### `intercom_reply_conversation`

Als Administrator auf eine Konversation in Intercom antworten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | Ja | Konversations-ID, auf die geantwortet werden soll |
| `message_type` | string | Ja | Nachrichtentyp: "comment" oder "note" |
| `body` | string | Ja | Der Textinhalt der Antwort |
| `admin_id` | string | Nein | Die ID des Administrators, der die Antwort verfasst. Wenn nicht angegeben, wird ein Standard-Administrator \(Operator/Fin\) verwendet. |
| `attachment_urls` | string | Nein | Kommagetrennte Liste von Bild-URLs \(max. 10\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Aktualisierte Konversation mit Antwort |

### `intercom_search_conversations`

Nach Konversationen in Intercom mit einer Abfrage suchen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Suchabfrage als JSON-Objekt |
| `per_page` | number | Nein | Anzahl der Ergebnisse pro Seite (max: 150) |
| `starting_after` | string | Nein | Cursor für Paginierung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Suchergebnisse |

### `intercom_create_ticket`

Ein neues Ticket in Intercom erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `ticket_type_id` | string | Ja | Die ID des Ticket-Typs |
| `contacts` | string | Ja | JSON-Array von Kontakt-Identifikatoren (z.B. \{"id": "contact_id"\}) |
| `ticket_attributes` | string | Ja | JSON-Objekt mit Ticket-Attributen einschließlich _default_title_ und _default_description_ |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Erstellte Ticket-Daten |

### `intercom_get_ticket`

Ein einzelnes Ticket anhand der ID von Intercom abrufen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `ticketId` | string | Ja | Ticket-ID zum Abrufen |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Ticket-Daten |

### `intercom_create_message`

Eine neue vom Administrator initiierte Nachricht in Intercom erstellen und senden

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `message_type` | string | Ja | Nachrichtentyp: "inapp" oder "email" |
| `subject` | string | Nein | Der Betreff der Nachricht \(für E-Mail-Typ\) |
| `body` | string | Ja | Der Inhalt der Nachricht |
| `from_type` | string | Ja | Absendertyp: "admin" |
| `from_id` | string | Ja | Die ID des Administrators, der die Nachricht sendet |
| `to_type` | string | Ja | Empfängertyp: "contact" |
| `to_id` | string | Ja | Die ID des Kontakts, der die Nachricht empfängt |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Erstellte Nachrichtendaten |

## Notizen

- Kategorie: `tools`
- Typ: `intercom`
```

--------------------------------------------------------------------------------

---[FILE: jina.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/jina.mdx

```text
---
title: Jina
description: Durchsuche das Web oder extrahiere Inhalte aus URLs
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="jina"
  color="#333333"
/>

{/* MANUAL-CONTENT-START:intro */}
[Jina AI](https://jina.ai/) ist ein leistungsstarkes Content-Extraktionstool, das sich nahtlos in Sim integriert, um Webinhalte in sauberen, lesbaren Text umzuwandeln. Diese Integration ermöglicht es Entwicklern, Webinhaltsverarbeitungsfunktionen einfach in ihre agentischen Workflows einzubinden.

Jina AI Reader ist darauf spezialisiert, die relevantesten Inhalte von Webseiten zu extrahieren, indem Unordnung, Werbung und Formatierungsprobleme entfernt werden, um sauberen, strukturierten Text zu erzeugen, der für Sprachmodelle und andere Textverarbeitungsaufgaben optimiert ist.

Mit der Jina AI-Integration in Sim können Sie:

- **Saubere Inhalte extrahieren** von jeder Webseite, indem Sie einfach eine URL angeben
- **Komplexe Web-Layouts** in strukturierten, lesbaren Text verarbeiten
- **Wichtigen Kontext beibehalten**, während unnötige Elemente entfernt werden
- **Webinhalte vorbereiten** für die weitere Verarbeitung in Ihren Agenten-Workflows
- **Rechercheaufgaben optimieren**, indem Webinformationen schnell in nutzbare Daten umgewandelt werden

Diese Integration ist besonders wertvoll für die Erstellung von Agenten, die Informationen aus dem Web sammeln und verarbeiten, Recherchen durchführen oder Online-Inhalte als Teil ihres Workflows analysieren müssen.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integriere Jina AI in den Workflow. Durchsuche das Web und erhalte LLM-freundliche Ergebnisse oder extrahiere saubere Inhalte aus bestimmten URLs mit erweiterten Parsing-Optionen.

## Tools

### `jina_read_url`

Extrahieren und verarbeiten Sie Webinhalte in sauberen, LLM-freundlichen Text mit Jina AI Reader. Unterstützt fortschrittliches Content-Parsing, Link-Sammlung und mehrere Ausgabeformate mit konfigurierbaren Verarbeitungsoptionen.

#### Eingabe

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `url` | string | Yes | Die URL, die gelesen und in Markdown konvertiert werden soll |
| `useReaderLMv2` | boolean | No | Ob ReaderLM-v2 für bessere Qualität verwendet werden soll \(3-fache Token-Kosten\) |
| `gatherLinks` | boolean | No | Ob alle Links am Ende gesammelt werden sollen |
| `jsonResponse` | boolean | No | Ob die Antwort im JSON-Format zurückgegeben werden soll |
| `apiKey` | string | Yes | Ihr Jina AI API-Schlüssel |
| `withImagesummary` | boolean | No | Alle Bilder von der Seite mit Metadaten sammeln |
| `retainImages` | string | No | Steuerung der Bildeinbindung: "none" entfernt alle, "all" behält alle bei |
| `returnFormat` | string | No | Ausgabeformat: markdown, html, text, screenshot oder pageshot |
| `withIframe` | boolean | No | Iframe-Inhalte in die Extraktion einbeziehen |
| `withShadowDom` | boolean | No | Shadow-DOM-Inhalte extrahieren |
| `noCache` | boolean | No | Zwischengespeicherte Inhalte umgehen für Echtzeit-Abruf |
| `withGeneratedAlt` | boolean | No | Alt-Text für Bilder mit VLM generieren |
| `robotsTxt` | string | No | Bot User-Agent für robots.txt-Prüfung |
| `dnt` | boolean | No | Do Not Track - verhindert Caching/Tracking |
| `noGfm` | boolean | No | GitHub Flavored Markdown deaktivieren |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Der extrahierte Inhalt von der URL, verarbeitet zu sauberem, LLM-freundlichem Text |
| `links` | array | Liste der auf der Seite gefundenen Links (wenn gatherLinks oder withLinksummary aktiviert ist) |
| `images` | array | Liste der auf der Seite gefundenen Bilder (wenn withImagesummary aktiviert ist) |

### `jina_search`

Durchsucht das Web und gibt die Top 5 Ergebnisse mit LLM-freundlichem Inhalt zurück. Jedes Ergebnis wird automatisch über die Jina Reader API verarbeitet. Unterstützt geografische Filterung, Website-Einschränkungen und Paginierung.

#### Eingabe

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `q` | string | Yes | Suchanfrage-String |
| `apiKey` | string | Yes | Ihr Jina AI API-Schlüssel |
| `num` | number | No | Maximale Anzahl von Ergebnissen pro Seite \(Standard: 5\) |
| `site` | string | No | Ergebnisse auf bestimmte Domain\(s\) beschränken. Kann durch Kommas getrennt für mehrere Seiten sein \(z.B. "jina.ai,github.com"\) |
| `withFavicon` | boolean | No | Website-Favicons in Ergebnissen einbeziehen |
| `withImagesummary` | boolean | No | Alle Bilder von Ergebnisseiten mit Metadaten sammeln |
| `withLinksummary` | boolean | No | Alle Links von Ergebnisseiten sammeln |
| `retainImages` | string | No | Steuerung der Bildeinbindung: "none" entfernt alle, "all" behält alle bei |
| `noCache` | boolean | No | Zwischengespeicherte Inhalte umgehen für Echtzeit-Abruf |
| `withGeneratedAlt` | boolean | No | Alt-Text für Bilder mit VLM generieren |
| `respondWith` | string | No | Auf "no-content" setzen, um nur Metadaten ohne Seiteninhalt zu erhalten |
| `returnFormat` | string | No | Ausgabeformat: markdown, html, text, screenshot oder pageshot |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `results` | array | Array von Suchergebnissen, die jeweils Titel, Beschreibung, URL und LLM-freundlichen Inhalt enthalten |

## Hinweise

- Kategorie: `tools`
- Typ: `jina`
```

--------------------------------------------------------------------------------

````
