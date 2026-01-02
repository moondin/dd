---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 46
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 46 of 933)

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

---[FILE: slack.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/slack.mdx

```text
---
title: Slack
description: Nachrichten senden, aktualisieren, löschen, Reaktionen in Slack
  hinzufügen oder Workflows von Slack-Ereignissen auslösen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="slack"
  color="#611f69"
/>

{/* MANUAL-CONTENT-START:intro */}
[Slack](https://www.slack.com/) ist eine Business-Kommunikationsplattform, die Teams einen einheitlichen Ort für Nachrichten, Tools und Dateien bietet.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/J5jz3UaWmE8"
  title="Slack Integration mit Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Mit Slack kannst du:

- **Automatisieren Sie Agenten-Benachrichtigungen**: Senden Sie Echtzeit-Updates von Ihren Sim-Agenten an jeden Slack-Kanal
- **Erstellen Sie Webhook-Endpunkte**: Konfigurieren Sie Slack-Bots als Webhooks, um Sim-Workflows aus Slack-Aktivitäten auszulösen
- **Verbessern Sie Agenten-Workflows**: Integrieren Sie Slack-Messaging in Ihre Agenten, um Ergebnisse, Warnungen und Statusaktualisierungen zu liefern
- **Erstellen und teilen Sie Slack-Canvases**: Erstellen Sie programmatisch kollaborative Dokumente (Canvases) in Slack-Kanälen
- **Lesen Sie Nachrichten aus Kanälen**: Rufen Sie aktuelle Nachrichten aus jedem Slack-Kanal ab und verarbeiten Sie diese für Überwachungs- oder Workflow-Auslöser
- **Verwalten Sie Bot-Nachrichten**: Aktualisieren, löschen und fügen Sie Reaktionen zu Nachrichten hinzu, die von Ihrem Bot gesendet wurden

In Sim ermöglicht die Slack-Integration Ihren Agenten, programmatisch mit Slack zu interagieren, mit vollständigen Nachrichtenverwaltungsfunktionen als Teil ihrer Workflows:

- **Nachrichten senden**: Agenten können formatierte Nachrichten an jeden Slack-Kanal oder Benutzer senden und unterstützen dabei Slacks mrkdwn-Syntax für umfangreiche Formatierung
- **Nachrichten aktualisieren**: Bearbeiten Sie zuvor gesendete Bot-Nachrichten, um Informationen zu korrigieren oder Statusaktualisierungen bereitzustellen
- **Nachrichten löschen**: Entfernen Sie Bot-Nachrichten, wenn sie nicht mehr benötigt werden oder Fehler enthalten
- **Reaktionen hinzufügen**: Drücken Sie Stimmungen oder Bestätigungen aus, indem Sie Emoji-Reaktionen zu jeder Nachricht hinzufügen
- **Canvases erstellen**: Erstellen und teilen Sie Slack-Canvases (kollaborative Dokumente) direkt in Kanälen, um reichhaltigere Inhalte zu teilen und zu dokumentieren
- **Nachrichten lesen**: Lesen Sie aktuelle Nachrichten aus Kanälen, um Überwachung, Berichterstattung oder das Auslösen weiterer Aktionen basierend auf Kanalaktivitäten zu ermöglichen
- **Dateien herunterladen**: Rufen Sie in Slack-Kanälen geteilte Dateien zur Verarbeitung oder Archivierung ab

Dies ermöglicht leistungsstarke Automatisierungsszenarien wie das Senden von Benachrichtigungen mit dynamischen Updates, das Verwalten von Gesprächsabläufen mit bearbeitbaren Statusnachrichten, das Bestätigen wichtiger Nachrichten mit Reaktionen und das Sauberhalten von Kanälen durch Entfernen veralteter Bot-Nachrichten. Ihre Agenten können zeitnahe Informationen liefern, Nachrichten aktualisieren, während Workflows fortschreiten, kollaborative Dokumente erstellen oder Teammitglieder benachrichtigen, wenn Aufmerksamkeit benötigt wird. Diese Integration überbrückt die Lücke zwischen Ihren KI-Workflows und der Kommunikation Ihres Teams und stellt sicher, dass jeder mit genauen, aktuellen Informationen auf dem Laufenden bleibt. Durch die Verbindung von Sim mit Slack können Sie Agenten erstellen, die Ihr Team mit relevanten Informationen zur richtigen Zeit auf dem Laufenden halten, die Zusammenarbeit verbessern, indem sie Erkenntnisse automatisch teilen und aktualisieren, und die Notwendigkeit manueller Statusaktualisierungen reduzieren – alles während Sie Ihren bestehenden Slack-Workspace nutzen, in dem Ihr Team bereits kommuniziert.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integriert Slack in den Workflow. Kann Nachrichten senden, aktualisieren und löschen, Canvases erstellen, Nachrichten lesen und Reaktionen hinzufügen. Erfordert im erweiterten Modus ein Bot-Token anstelle von OAuth. Kann im Trigger-Modus verwendet werden, um einen Workflow auszulösen, wenn eine Nachricht an einen Kanal gesendet wird.

## Tools

### `slack_message`

Sende Nachrichten an Slack-Kanäle oder Direktnachrichten. Unterstützt Slack mrkdwn-Formatierung.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | Nein | Authentifizierungsmethode: oauth oder bot_token |
| `botToken` | string | Nein | Bot-Token für benutzerdefinierten Bot |
| `channel` | string | Nein | Ziel-Slack-Kanal \(z.B. #general\) |
| `userId` | string | Nein | Ziel-Slack-Benutzer-ID für Direktnachrichten \(z.B. U1234567890\) |
| `text` | string | Ja | Zu sendender Nachrichtentext \(unterstützt Slack mrkdwn-Formatierung\) |
| `thread_ts` | string | Nein | Thread-Zeitstempel für Antworten \(erstellt Thread-Antwort\) |
| `files` | file[] | Nein | Dateien, die an die Nachricht angehängt werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | object | Vollständiges Nachrichtenobjekt mit allen von Slack zurückgegebenen Eigenschaften |
| `ts` | string | Nachrichtenzeitstempel |
| `channel` | string | Kanal-ID, in dem die Nachricht gesendet wurde |
| `fileCount` | number | Anzahl der hochgeladenen Dateien \(wenn Dateien angehängt sind\) |

### `slack_canvas`

Erstellen und teilen Sie Slack-Canvases in Kanälen. Canvases sind kollaborative Dokumente innerhalb von Slack.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | Nein | Authentifizierungsmethode: oauth oder bot_token |
| `botToken` | string | Nein | Bot-Token für Custom Bot |
| `channel` | string | Ja | Ziel-Slack-Kanal \(z.B. #general\) |
| `title` | string | Ja | Titel des Canvas |
| `content` | string | Ja | Canvas-Inhalt im Markdown-Format |
| `document_content` | object | Nein | Strukturierter Canvas-Dokumentinhalt |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `canvas_id` | string | ID des erstellten Canvas |
| `channel` | string | Kanal, in dem das Canvas erstellt wurde |
| `title` | string | Titel des Canvas |

### `slack_message_reader`

Lesen Sie die neuesten Nachrichten aus Slack-Kanälen. Rufen Sie den Konversationsverlauf mit Filteroptionen ab.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | Nein | Authentifizierungsmethode: oauth oder bot_token |
| `botToken` | string | Nein | Bot-Token für benutzerdefinierten Bot |
| `channel` | string | Nein | Slack-Kanal, aus dem Nachrichten gelesen werden sollen \(z.B. #general\) |
| `userId` | string | Nein | Benutzer-ID für DM-Konversation \(z.B. U1234567890\) |
| `limit` | number | Nein | Anzahl der abzurufenden Nachrichten \(Standard: 10, max: 100\) |
| `oldest` | string | Nein | Beginn des Zeitraums \(Zeitstempel\) |
| `latest` | string | Nein | Ende des Zeitraums \(Zeitstempel\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `messages` | array | Array von Nachrichtenobjekten aus dem Kanal |

### `slack_list_channels`

Listet alle Kanäle in einem Slack-Workspace auf. Gibt öffentliche und private Kanäle zurück, auf die der Bot Zugriff hat.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | Nein | Authentifizierungsmethode: oauth oder bot_token |
| `botToken` | string | Nein | Bot-Token für benutzerdefinierten Bot |
| `includePrivate` | boolean | Nein | Private Kanäle einschließen, in denen der Bot Mitglied ist \(Standard: true\) |
| `excludeArchived` | boolean | Nein | Archivierte Kanäle ausschließen \(Standard: true\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Kanäle \(Standard: 100, max: 200\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `channels` | array | Array von Kanalobjekten aus dem Workspace |

### `slack_list_members`

Listet alle Mitglieder (Benutzer-IDs) in einem Slack-Kanal auf. Verwenden Sie diese Funktion mit Get User Info, um IDs in Namen aufzulösen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | Nein | Authentifizierungsmethode: oauth oder bot_token |
| `botToken` | string | Nein | Bot-Token für benutzerdefinierten Bot |
| `channel` | string | Ja | Kanal-ID, aus der Mitglieder aufgelistet werden sollen |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Mitglieder \(Standard: 100, max: 200\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `members` | array | Array von Benutzer-IDs, die Mitglieder des Kanals sind \(z.B. U1234567890\) |

### `slack_list_users`

Listet alle Benutzer in einem Slack-Workspace auf. Gibt Benutzerprofile mit Namen und Avataren zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | Nein | Authentifizierungsmethode: oauth oder bot_token |
| `botToken` | string | Nein | Bot-Token für benutzerdefinierten Bot |
| `includeDeleted` | boolean | Nein | Deaktivierte/gelöschte Benutzer einbeziehen \(Standard: false\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Benutzer \(Standard: 100, max: 200\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `users` | array | Array von Benutzerobjekten aus dem Workspace |

### `slack_get_user`

Ruft detaillierte Informationen über einen bestimmten Slack-Benutzer anhand seiner Benutzer-ID ab.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | Nein | Authentifizierungsmethode: oauth oder bot_token |
| `botToken` | string | Nein | Bot-Token für benutzerdefinierten Bot |
| `userId` | string | Ja | Zu suchende Benutzer-ID \(z.B. U1234567890\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `user` | object | Detaillierte Benutzerinformationen |

### `slack_download`

Eine Datei von Slack herunterladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | Nein | Authentifizierungsmethode: oauth oder bot_token |
| `botToken` | string | Nein | Bot-Token für benutzerdefinierten Bot |
| `fileId` | string | Ja | Die ID der herunterzuladenden Datei |
| `fileName` | string | Nein | Optionale Überschreibung des Dateinamens |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `file` | file | Heruntergeladene Datei, gespeichert in den Ausführungsdateien |

### `slack_update_message`

Eine zuvor vom Bot in Slack gesendete Nachricht aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | Nein | Authentifizierungsmethode: oauth oder bot_token |
| `botToken` | string | Nein | Bot-Token für benutzerdefinierten Bot |
| `channel` | string | Ja | Kanal-ID, in dem die Nachricht gepostet wurde \(z.B. C1234567890\) |
| `timestamp` | string | Ja | Zeitstempel der zu aktualisierenden Nachricht \(z.B. 1405894322.002768\) |
| `text` | string | Ja | Neuer Nachrichtentext \(unterstützt Slack mrkdwn-Formatierung\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | object | Vollständiges aktualisiertes Nachrichtenobjekt mit allen von Slack zurückgegebenen Eigenschaften |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | Aktualisierte Nachrichtenmetadaten |

### `slack_delete_message`

Eine zuvor vom Bot in Slack gesendete Nachricht löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | Nein | Authentifizierungsmethode: oauth oder bot_token |
| `botToken` | string | Nein | Bot-Token für benutzerdefinierten Bot |
| `channel` | string | Ja | Kanal-ID, in dem die Nachricht gepostet wurde \(z.B. C1234567890\) |
| `timestamp` | string | Ja | Zeitstempel der zu löschenden Nachricht \(z.B. 1405894322.002768\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | Metadaten der gelöschten Nachricht |

### `slack_add_reaction`

Eine Emoji-Reaktion zu einer Slack-Nachricht hinzufügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | Nein | Authentifizierungsmethode: oauth oder bot_token |
| `botToken` | string | Nein | Bot-Token für Custom Bot |
| `channel` | string | Ja | Kanal-ID, in dem die Nachricht gepostet wurde \(z.B. C1234567890\) |
| `timestamp` | string | Ja | Zeitstempel der Nachricht, auf die reagiert werden soll \(z.B. 1405894322.002768\) |
| `name` | string | Ja | Name der Emoji-Reaktion \(ohne Doppelpunkte, z.B. thumbsup, heart, eyes\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Erfolgsmeldung |
| `metadata` | object | Reaktions-Metadaten |

## Hinweise

- Kategorie: `tools`
- Typ: `slack`
```

--------------------------------------------------------------------------------

---[FILE: sms.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/sms.mdx

```text
---
title: SMS
description: Senden Sie SMS-Nachrichten über den internen SMS-Dienst
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sms"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
Der SMS-Block ermöglicht es Ihnen, Textnachrichten direkt aus Ihren Workflows über Sims eigene SMS-Infrastruktur, die von Twilio betrieben wird, zu versenden. Diese Integration ermöglicht es Ihnen, Benachrichtigungen, Warnungen und andere wichtige Informationen programmgesteuert an mobile Geräte der Benutzer zu senden, ohne dass externe Konfigurationen oder OAuth erforderlich sind.

Unser interner SMS-Dienst ist auf Zuverlässigkeit und einfache Bedienung ausgelegt, was ihn ideal für die Automatisierung von Kommunikation macht und sicherstellt, dass Ihre Nachrichten die Empfänger effizient erreichen.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Senden Sie SMS-Nachrichten direkt über den internen SMS-Dienst, der von Twilio betrieben wird. Keine externe Konfiguration oder OAuth erforderlich. Perfekt für das Senden von Benachrichtigungen, Warnungen oder allgemeinen Textnachrichten aus Ihren Workflows. Erfordert gültige Telefonnummern mit Ländervorwahlen.

## Tools

### `sms_send`

Senden Sie eine SMS-Nachricht über den internen SMS-Dienst, der von Twilio betrieben wird

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `to` | string | Ja | Telefonnummer des Empfängers \(inklusive Ländervorwahl, z.B. +1234567890\) |
| `body` | string | Ja | Inhalt der SMS-Nachricht |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die SMS erfolgreich gesendet wurde |
| `to` | string | Telefonnummer des Empfängers |
| `body` | string | Inhalt der SMS-Nachricht |

## Hinweise

- Kategorie: `tools`
- Typ: `sms`
```

--------------------------------------------------------------------------------

---[FILE: smtp.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/smtp.mdx

```text
---
title: SMTP
description: E-Mails über jeden SMTP-Mailserver versenden
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="smtp"
  color="#2D3748"
/>

{/* MANUAL-CONTENT-START:intro */}
[SMTP (Simple Mail Transfer Protocol)](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) ist der grundlegende Standard für die E-Mail-Übertragung im Internet. Durch die Verbindung mit einem SMTP-kompatiblen Server – wie Gmail, Outlook oder der eigenen Mail-Infrastruktur Ihrer Organisation – können Sie E-Mails programmatisch versenden und Ihre ausgehende Kommunikation automatisieren.

Die SMTP-Integration ermöglicht es Ihnen, den E-Mail-Versand durch direkte Serververbindung vollständig anzupassen und unterstützt sowohl einfache als auch fortgeschrittene E-Mail-Anwendungsfälle. Mit SMTP können Sie jeden Aspekt der Nachrichtenzustellung, des Empfängermanagements und der Inhaltsformatierung kontrollieren, was es ideal für transaktionale Benachrichtigungen, Massenmailings und jeden automatisierten Workflow macht, der eine robuste ausgehende E-Mail-Zustellung erfordert.

**Zu den wichtigsten Funktionen der SMTP-Integration gehören:**

- **Universeller E-Mail-Versand:** Senden Sie E-Mails über jeden SMTP-Server durch Konfiguration standardmäßiger Serververbindungsparameter.
- **Anpassbare Absender und Empfänger:** Legen Sie Absenderadresse, Anzeigename, Hauptempfänger sowie CC- und BCC-Felder fest.
- **Unterstützung für umfangreiche Inhalte:** Senden Sie Nur-Text- oder reich formatierte HTML-E-Mails entsprechend Ihren Anforderungen.
- **Anhänge:** Fügen Sie ausgehenden E-Mails mehrere Dateien als Anhänge hinzu.
- **Flexible Sicherheit:** Verbinden Sie sich über TLS, SSL oder Standardprotokolle (unverschlüsselt), je nach Unterstützung Ihres SMTP-Anbieters.
- **Erweiterte Header:** Setzen Sie Antwort-an-Header und andere erweiterte E-Mail-Optionen, um komplexe Mailflows und Benutzerinteraktionen zu ermöglichen.

Durch die Integration von SMTP mit Sim können Agenten und Workflows programmatisch E-Mails als Teil jedes automatisierten Prozesses versenden – von Benachrichtigungen und Bestätigungen bis hin zur Automatisierung externer Kommunikation, Berichterstattung und Dokumentenzustellung. Dies bietet einen hochflexiblen, anbieterunabhängigen Ansatz zur Verwaltung von E-Mails direkt innerhalb Ihrer KI-gesteuerten Prozesse.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Senden Sie E-Mails über jeden SMTP-Server (Gmail, Outlook, benutzerdefinierte Server usw.). Konfigurieren Sie SMTP-Verbindungseinstellungen und senden Sie E-Mails mit voller Kontrolle über Inhalt, Empfänger und Anhänge.

## Tools

### `smtp_send_mail`

E-Mails über SMTP-Server senden

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `smtpHost` | string | Ja | SMTP-Server-Hostname \(z.B. smtp.gmail.com\) |
| `smtpPort` | number | Ja | SMTP-Server-Port \(587 für TLS, 465 für SSL\) |
| `smtpUsername` | string | Ja | SMTP-Authentifizierungsbenutzername |
| `smtpPassword` | string | Ja | SMTP-Authentifizierungspasswort |
| `smtpSecure` | string | Ja | Sicherheitsprotokoll \(TLS, SSL oder None\) |
| `from` | string | Ja | Absender-E-Mail-Adresse |
| `to` | string | Ja | Empfänger-E-Mail-Adresse |
| `subject` | string | Ja | E-Mail-Betreff |
| `body` | string | Ja | E-Mail-Inhalt |
| `contentType` | string | Nein | Inhaltstyp \(text oder html\) |
| `fromName` | string | Nein | Anzeigename für Absender |
| `cc` | string | Nein | CC-Empfänger \(durch Komma getrennt\) |
| `bcc` | string | Nein | BCC-Empfänger \(durch Komma getrennt\) |
| `replyTo` | string | Nein | Antwort-an E-Mail-Adresse |
| `attachments` | file[] | Nein | Dateien, die der E-Mail angehängt werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die E-Mail erfolgreich gesendet wurde |
| `messageId` | string | Nachrichten-ID vom SMTP-Server |
| `to` | string | Empfänger-E-Mail-Adresse |
| `subject` | string | E-Mail-Betreff |
| `error` | string | Fehlermeldung, wenn das Senden fehlgeschlagen ist |

## Notizen

- Kategorie: `tools`
- Typ: `smtp`
```

--------------------------------------------------------------------------------

````
