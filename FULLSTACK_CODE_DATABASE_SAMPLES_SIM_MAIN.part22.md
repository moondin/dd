---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 22
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 22 of 933)

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

---[FILE: dropbox.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/dropbox.mdx

```text
---
title: Dropbox
description: Dateien in Dropbox hochladen, herunterladen, teilen und verwalten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="dropbox"
  color="#0061FF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Dropbox](https://dropbox.com/) ist eine beliebte Cloud-Speicher- und Kollaborationsplattform, die es Einzelpersonen und Teams ermöglicht, Dateien sicher zu speichern, darauf zuzugreifen und sie von überall aus zu teilen. Dropbox ist für einfache Dateiverwaltung, Synchronisierung und leistungsstarke Zusammenarbeit konzipiert, egal ob Sie allein oder in einer Gruppe arbeiten.

Mit Dropbox in Sim können Sie:

- **Dateien hoch- und herunterladen**: Laden Sie jede Datei nahtlos in Ihre Dropbox hoch oder rufen Sie Inhalte bei Bedarf ab
- **Ordnerinhalte auflisten**: Durchsuchen Sie die Dateien und Ordner in jedem Dropbox-Verzeichnis
- **Neue Ordner erstellen**: Organisieren Sie Ihre Dateien, indem Sie programmgesteuert neue Ordner in Ihrer Dropbox erstellen
- **Dateien und Ordner suchen**: Finden Sie Dokumente, Bilder oder andere Elemente nach Namen oder Inhalt
- **Geteilte Links generieren**: Erstellen Sie schnell teilbare öffentliche oder private Links für Dateien und Ordner
- **Dateien verwalten**: Verschieben, löschen oder benennen Sie Dateien und Ordner im Rahmen automatisierter Workflows um

Diese Funktionen ermöglichen es Ihren Sim-Agenten, Dropbox-Operationen direkt in Ihren Workflows zu automatisieren – vom Sichern wichtiger Dateien bis hin zur Verteilung von Inhalten und der Pflege organisierter Ordner. Verwenden Sie Dropbox sowohl als Quelle als auch als Ziel für Dateien und ermöglichen Sie so eine nahtlose Cloud-Speicherverwaltung als Teil Ihrer Geschäftsprozesse.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Dropbox in Ihren Workflow für Dateiverwaltung, Freigabe und Zusammenarbeit. Laden Sie Dateien hoch, laden Sie Inhalte herunter, erstellen Sie Ordner, verwalten Sie freigegebene Links und mehr.

## Tools

### `dropbox_upload`

Eine Datei zu Dropbox hochladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `path` | string | Ja | Der Pfad in Dropbox, wo die Datei gespeichert werden soll \(z.B. /ordner/dokument.pdf\) |
| `fileContent` | string | Ja | Der base64-kodierte Inhalt der hochzuladenden Datei |
| `fileName` | string | Nein | Optionaler Dateiname \(wird verwendet, wenn der Pfad ein Ordner ist\) |
| `mode` | string | Nein | Schreibmodus: add \(Standard\) oder overwrite |
| `autorename` | boolean | Nein | Wenn true, wird die Datei umbenannt, falls ein Konflikt besteht |
| `mute` | boolean | Nein | Wenn true, wird der Benutzer nicht über diesen Upload benachrichtigt |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `file` | object | Die Metadaten der hochgeladenen Datei |

### `dropbox_download`

Eine Datei von Dropbox herunterladen und einen temporären Link erhalten

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `path` | string | Ja | Der Pfad der herunterzuladenden Datei (z.B. /ordner/dokument.pdf) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `file` | object | Die Metadaten der Datei |

### `dropbox_list_folder`

Den Inhalt eines Ordners in Dropbox auflisten

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `path` | string | Ja | Der Pfad des aufzulistenden Ordners (verwende "" für das Stammverzeichnis) |
| `recursive` | boolean | Nein | Wenn true, Inhalte rekursiv auflisten |
| `includeDeleted` | boolean | Nein | Wenn true, gelöschte Dateien/Ordner einbeziehen |
| `includeMediaInfo` | boolean | Nein | Wenn true, Medieninfos für Fotos/Videos einbeziehen |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse (Standard: 500) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `entries` | array | Liste der Dateien und Ordner im Verzeichnis |

### `dropbox_create_folder`

Einen neuen Ordner in Dropbox erstellen

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `path` | string | Ja | Der Pfad, an dem der Ordner erstellt werden soll (z.B. /neuer-ordner) |
| `autorename` | boolean | Nein | Wenn true, den Ordner umbenennen, falls ein Konflikt besteht |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `folder` | object | Die Metadaten des erstellten Ordners |

### `dropbox_delete`

Eine Datei oder einen Ordner in Dropbox löschen (wird in den Papierkorb verschoben)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `path` | string | Ja | Der Pfad der zu löschenden Datei oder des zu löschenden Ordners |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `metadata` | object | Metadaten des gelöschten Elements |

### `dropbox_copy`

Eine Datei oder einen Ordner in Dropbox kopieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `fromPath` | string | Ja | Der Quellpfad der zu kopierenden Datei oder des zu kopierenden Ordners |
| `toPath` | string | Ja | Der Zielpfad für die kopierte Datei oder den kopierten Ordner |
| `autorename` | boolean | Nein | Wenn true, wird die Datei umbenannt, falls am Zielort ein Konflikt besteht |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `metadata` | object | Metadaten des kopierten Elements |

### `dropbox_move`

Eine Datei oder einen Ordner in Dropbox verschieben oder umbenennen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `fromPath` | string | Ja | Der Quellpfad der zu verschiebenden Datei oder des zu verschiebenden Ordners |
| `toPath` | string | Ja | Der Zielpfad für die verschobene Datei oder den verschobenen Ordner |
| `autorename` | boolean | Nein | Wenn true, wird die Datei umbenannt, falls am Zielort ein Konflikt besteht |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `metadata` | object | Metadaten des verschobenen Elements |

### `dropbox_get_metadata`

Metadaten für eine Datei oder einen Ordner in Dropbox abrufen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `path` | string | Ja | Der Pfad der Datei oder des Ordners, für die/den Metadaten abgerufen werden sollen |
| `includeMediaInfo` | boolean | Nein | Wenn true, werden Medieninformationen für Fotos/Videos einbezogen |
| `includeDeleted` | boolean | Nein | Wenn true, werden gelöschte Dateien in den Ergebnissen einbezogen |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `metadata` | object | Metadaten für die Datei oder den Ordner |

### `dropbox_create_shared_link`

Einen teilbaren Link für eine Datei oder einen Ordner in Dropbox erstellen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `path` | string | Ja | Der Pfad der Datei oder des Ordners, der geteilt werden soll |
| `requestedVisibility` | string | Nein | Sichtbarkeit: public, team_only oder password |
| `linkPassword` | string | Nein | Passwort für den geteilten Link \(nur wenn die Sichtbarkeit password ist\) |
| `expires` | string | Nein | Ablaufdatum im ISO 8601-Format \(z.B. 2025-12-31T23:59:59Z\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `sharedLink` | object | Der erstellte geteilte Link |

### `dropbox_search`

Suche nach Dateien und Ordnern in Dropbox

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Die Suchanfrage |
| `path` | string | Nein | Suche auf einen bestimmten Ordnerpfad beschränken |
| `fileExtensions` | string | Nein | Kommagetrennte Liste von Dateierweiterungen zur Filterung \(z.B. pdf,xlsx\) |
| `maxResults` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(Standard: 100\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `matches` | array | Suchergebnisse |

## Hinweise

- Kategorie: `tools`
- Typ: `dropbox`
```

--------------------------------------------------------------------------------

---[FILE: duckduckgo.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/duckduckgo.mdx

```text
---
title: DuckDuckGo
description: Suche mit DuckDuckGo
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="duckduckgo"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[DuckDuckGo](https://duckduckgo.com/) ist eine datenschutzorientierte Websuchmaschine, die sofortige Antworten, Zusammenfassungen, verwandte Themen und mehr liefert – ohne dich oder deine Suchen zu verfolgen. DuckDuckGo macht es einfach, Informationen ohne Benutzerprofilierung oder zielgerichtete Werbung zu finden.

Mit DuckDuckGo in Sim kannst du:

- **Im Web suchen**: Finde sofort Antworten, Fakten und Übersichten für eine bestimmte Suchanfrage
- **Direkte Antworten erhalten**: Erhalte spezifische Antworten für Berechnungen, Umrechnungen oder Faktenfragen
- **Auf Zusammenfassungen zugreifen**: Erhalte kurze Zusammenfassungen oder Beschreibungen für deine Suchthemen
- **Verwandte Themen abrufen**: Entdecke Links und Referenzen, die für deine Suche relevant sind
- **Ausgabe filtern**: Optional HTML entfernen oder Begriffsklärungen überspringen für sauberere Ergebnisse

Diese Funktionen ermöglichen es deinen Sim-Agenten, den Zugriff auf aktuelles Webwissen zu automatisieren – vom Auffinden von Fakten in einem Workflow bis hin zur Anreicherung von Dokumenten und Analysen mit aktuellen Informationen. Da DuckDuckGos Instant Answers API offen ist und keinen API-Schlüssel erfordert, lässt sie sich einfach und datenschutzsicher in deine automatisierten Geschäftsprozesse integrieren.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Durchsuche das Web mit der DuckDuckGo Instant Answers API. Liefert sofortige Antworten, Zusammenfassungen, verwandte Themen und mehr. Kostenlos nutzbar ohne API-Schlüssel.

## Tools

### `duckduckgo_search`

Durchsuche das Web mit der DuckDuckGo Instant Answers API. Liefert sofortige Antworten, Zusammenfassungen und verwandte Themen für deine Anfrage. Kostenlos nutzbar ohne API-Schlüssel.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Die auszuführende Suchanfrage |
| `noHtml` | boolean | Nein | HTML aus Text in Ergebnissen entfernen \(Standard: true\) |
| `skipDisambig` | boolean | Nein | Begriffsklärungsergebnisse überspringen \(Standard: false\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `heading` | string | Die Überschrift/der Titel der Sofortantwort |
| `abstract` | string | Eine kurze Zusammenfassung des Themas |
| `abstractText` | string | Einfache Textversion der Zusammenfassung |
| `abstractSource` | string | Die Quelle der Zusammenfassung \(z.B. Wikipedia\) |
| `abstractURL` | string | URL zur Quelle der Zusammenfassung |
| `image` | string | URL zu einem Bild zum Thema |
| `answer` | string | Direkte Antwort, falls verfügbar \(z.B. für Berechnungen\) |
| `answerType` | string | Typ der Antwort \(z.B. calc, ip, usw.\) |
| `type` | string | Antworttyp: A \(Artikel\), D \(Begriffsklärung\), C \(Kategorie\), N \(Name\), E \(Exklusiv\) |
| `relatedTopics` | array | Array verwandter Themen mit URLs und Beschreibungen |

## Hinweise

- Kategorie: `tools`
- Typ: `duckduckgo`
```

--------------------------------------------------------------------------------

---[FILE: dynamodb.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/dynamodb.mdx

```text
---
title: Amazon DynamoDB
description: Verbindung zu Amazon DynamoDB
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="dynamodb"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon DynamoDB](https://aws.amazon.com/dynamodb/) ist ein vollständig verwalteter NoSQL-Datenbankdienst von AWS, der schnelle und vorhersehbare Leistung mit nahtloser Skalierbarkeit bietet. Mit DynamoDB können Sie beliebige Datenmengen speichern und abrufen und jede Art von Anforderungsverkehr bedienen, ohne dass Sie Hardware oder Infrastruktur verwalten müssen.

Mit DynamoDB können Sie:

- **Elemente abrufen**: Elemente in Ihren Tabellen mithilfe von Primärschlüsseln nachschlagen
- **Elemente einfügen**: Elemente in Ihren Tabellen hinzufügen oder ersetzen
- **Elemente abfragen**: Mehrere Elemente mithilfe von Abfragen über Indizes abrufen
- **Tabellen scannen**: Alle oder einen Teil der Daten in einer Tabelle lesen
- **Elemente aktualisieren**: Bestimmte Attribute vorhandener Elemente ändern
- **Elemente löschen**: Datensätze aus Ihren Tabellen entfernen

In Sim ermöglicht die DynamoDB-Integration Ihren Agenten den sicheren Zugriff auf DynamoDB-Tabellen und deren Manipulation mithilfe von AWS-Anmeldeinformationen. Zu den unterstützten Operationen gehören:

- **Get**: Ein Element anhand seines Schlüssels abrufen
- **Put**: Elemente einfügen oder überschreiben
- **Query**: Abfragen mit Schlüsselbedingungen und Filtern ausführen
- **Scan**: Mehrere Elemente durch Scannen der Tabelle oder des Index lesen
- **Update**: Bestimmte Attribute eines oder mehrerer Elemente ändern
- **Delete**: Ein Element aus einer Tabelle entfernen

Diese Integration ermöglicht es Sim-Agenten, Datenverwaltungsaufgaben innerhalb Ihrer DynamoDB-Tabellen programmatisch zu automatisieren, sodass Sie Workflows erstellen können, die skalierbare NoSQL-Daten ohne manuellen Aufwand oder Serververwaltung verwalten, ändern und abrufen.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Amazon DynamoDB in Workflows. Unterstützt Get-, Put-, Query-, Scan-, Update- und Delete-Operationen auf DynamoDB-Tabellen.

## Tools

### `dynamodb_get`

Ein Element aus einer DynamoDB-Tabelle anhand des Primärschlüssels abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `accessKeyId` | string | Ja | AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | AWS-Geheimzugriffsschlüssel |
| `tableName` | string | Ja | DynamoDB-Tabellenname |
| `key` | object | Ja | Primärschlüssel des abzurufenden Elements |
| `consistentRead` | boolean | Nein | Stark konsistentes Lesen verwenden |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `item` | object | Abgerufenes Element |

### `dynamodb_put`

Ein Element in eine DynamoDB-Tabelle einfügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `accessKeyId` | string | Ja | AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | AWS-Geheimzugriffsschlüssel |
| `tableName` | string | Ja | DynamoDB-Tabellenname |
| `item` | object | Ja | Element, das in die Tabelle eingefügt werden soll |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `item` | object | Erstelltes Element |

### `dynamodb_query`

Abfrage von Elementen aus einer DynamoDB-Tabelle mit Schlüsselbedingungen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `accessKeyId` | string | Ja | AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | AWS-Geheimzugriffsschlüssel |
| `tableName` | string | Ja | DynamoDB-Tabellenname |
| `keyConditionExpression` | string | Ja | Schlüsselbedingungsausdruck (z.B. "pk = :pk") |
| `filterExpression` | string | Nein | Filterausdruck für Ergebnisse |
| `expressionAttributeNames` | object | Nein | Attributnamenzuordnungen für reservierte Wörter |
| `expressionAttributeValues` | object | Nein | Ausdrucksattributwerte |
| `indexName` | string | Nein | Name des sekundären Index für die Abfrage |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Elemente |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `items` | array | Array der zurückgegebenen Elemente |
| `count` | number | Anzahl der zurückgegebenen Elemente |

### `dynamodb_scan`

Alle Elemente in einer DynamoDB-Tabelle scannen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `accessKeyId` | string | Ja | AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | AWS-Geheimzugriffsschlüssel |
| `tableName` | string | Ja | DynamoDB-Tabellenname |
| `filterExpression` | string | Nein | Filterausdruck für Ergebnisse |
| `projectionExpression` | string | Nein | Abzurufende Attribute |
| `expressionAttributeNames` | object | Nein | Attributnamenzuordnungen für reservierte Wörter |
| `expressionAttributeValues` | object | Nein | Ausdrucksattributwerte |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Elemente |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `items` | array | Array der zurückgegebenen Elemente |
| `count` | number | Anzahl der zurückgegebenen Elemente |

### `dynamodb_update`

Ein Element in einer DynamoDB-Tabelle aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `accessKeyId` | string | Ja | AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | AWS-Geheimzugriffsschlüssel |
| `tableName` | string | Ja | Name der DynamoDB-Tabelle |
| `key` | object | Ja | Primärschlüssel des zu aktualisierenden Elements |
| `updateExpression` | string | Ja | Aktualisierungsausdruck (z.B. "SET #name = :name") |
| `expressionAttributeNames` | object | Nein | Attributnamenzuordnungen für reservierte Wörter |
| `expressionAttributeValues` | object | Nein | Ausdrucksattributwerte |
| `conditionExpression` | string | Nein | Bedingung, die erfüllt sein muss, damit die Aktualisierung erfolgreich ist |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `item` | object | Aktualisiertes Element |

### `dynamodb_delete`

Ein Element aus einer DynamoDB-Tabelle löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `region` | string | Ja | AWS-Region (z.B. us-east-1) |
| `accessKeyId` | string | Ja | AWS-Zugriffsschlüssel-ID |
| `secretAccessKey` | string | Ja | AWS-Geheimzugriffsschlüssel |
| `tableName` | string | Ja | Name der DynamoDB-Tabelle |
| `key` | object | Ja | Primärschlüssel des zu löschenden Elements |
| `conditionExpression` | string | Nein | Bedingung, die erfüllt sein muss, damit das Löschen erfolgreich ist |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |

## Hinweise

- Kategorie: `tools`
- Typ: `dynamodb`
```

--------------------------------------------------------------------------------

---[FILE: elasticsearch.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/elasticsearch.mdx

```text
---
title: Elasticsearch
description: Suchen, indexieren und verwalten Sie Daten in Elasticsearch
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="elasticsearch"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Elasticsearch](https://www.elastic.co/elasticsearch/) ist eine leistungsstarke verteilte Such- und Analysemaschine, die es Ihnen ermöglicht, große Datenmengen in Echtzeit zu indexieren, zu durchsuchen und zu analysieren. Sie wird häufig für Suchfunktionen, Log- und Ereignisdatenanalysen, Beobachtbarkeit und mehr eingesetzt.

Mit Elasticsearch in Sim erhalten Sie programmatischen Zugriff auf die Kernfunktionen von Elasticsearch, darunter:

- **Dokumente durchsuchen**: Führen Sie erweiterte Suchen in strukturiertem oder unstrukturiertem Text mit Query DSL durch, mit Unterstützung für Sortierung, Paginierung und Feldauswahl.
- **Dokumente indexieren**: Fügen Sie neue Dokumente hinzu oder aktualisieren Sie bestehende in jedem Elasticsearch-Index für sofortigen Abruf und Analyse.
- **Dokumente abrufen, aktualisieren oder löschen**: Rufen Sie bestimmte Dokumente nach ID ab, ändern oder entfernen Sie sie.
- **Massenoperationen**: Führen Sie mehrere Indexierungs- oder Aktualisierungsaktionen in einer einzigen Anfrage für Datenverarbeitung mit hohem Durchsatz aus.
- **Indizes verwalten**: Erstellen, löschen oder rufen Sie Details zu Indizes als Teil Ihrer Workflow-Automatisierung ab.
- **Cluster-Überwachung**: Überprüfen Sie den Zustand und die Statistiken Ihrer Elasticsearch-Bereitstellung.

Sims Elasticsearch-Tools funktionieren sowohl mit selbst gehosteten als auch mit Elastic Cloud-Umgebungen. Integrieren Sie Elasticsearch in Ihre Agent-Workflows, um die Datenaufnahme zu automatisieren, große Datensätze zu durchsuchen, Berichte zu erstellen oder benutzerdefinierte, suchgestützte Anwendungen zu erstellen – alles ohne manuelle Eingriffe.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integrieren Sie Elasticsearch in Workflows für leistungsstarke Suche, Indexierung und Datenverwaltung. Unterstützt CRUD-Operationen für Dokumente, erweiterte Suchabfragen, Massenoperationen, Indexverwaltung und Cluster-Überwachung. Funktioniert sowohl mit selbst gehosteten als auch mit Elastic Cloud-Bereitstellungen.

## Tools

### `elasticsearch_search`

Durchsuche Dokumente in Elasticsearch mit Query DSL. Gibt übereinstimmende Dokumente mit Scores und Metadaten zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Ja | Bereitstellungstyp: self_hosted oder cloud |
| `host` | string | Nein | Elasticsearch-Host-URL (für self-hosted) |
| `cloudId` | string | Nein | Elastic Cloud ID (für Cloud-Bereitstellungen) |
| `authMethod` | string | Ja | Authentifizierungsmethode: api_key oder basic_auth |
| `apiKey` | string | Nein | Elasticsearch API-Schlüssel |
| `username` | string | Nein | Benutzername für Basic Auth |
| `password` | string | Nein | Passwort für Basic Auth |
| `index` | string | Ja | Indexname für die Suche |
| `query` | string | Nein | Query DSL als JSON-String |
| `from` | number | Nein | Startoffset für Paginierung (Standard: 0) |
| `size` | number | Nein | Anzahl der zurückzugebenden Ergebnisse (Standard: 10) |
| `sort` | string | Nein | Sortierungsspezifikation als JSON-String |
| `sourceIncludes` | string | Nein | Kommagetrennte Liste von Feldern, die in _source eingeschlossen werden sollen |
| `sourceExcludes` | string | Nein | Kommagetrennte Liste von Feldern, die aus _source ausgeschlossen werden sollen |
| `trackTotalHits` | boolean | Nein | Genaue Gesamttrefferanzahl verfolgen (Standard: true) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `took` | number | Zeit in Millisekunden, die die Suche gedauert hat |
| `timed_out` | boolean | Ob die Suche ein Timeout hatte |
| `hits` | object | Suchergebnisse mit Gesamtanzahl und übereinstimmenden Dokumenten |
| `aggregations` | json | Aggregationsergebnisse, falls vorhanden |

### `elasticsearch_index_document`

Dokument in Elasticsearch indexieren (erstellen oder aktualisieren).

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Ja | Bereitstellungstyp: self_hosted oder cloud |
| `host` | string | Nein | Elasticsearch-Host-URL \(für self-hosted\) |
| `cloudId` | string | Nein | Elastic Cloud ID \(für Cloud-Bereitstellungen\) |
| `authMethod` | string | Ja | Authentifizierungsmethode: api_key oder basic_auth |
| `apiKey` | string | Nein | Elasticsearch API-Schlüssel |
| `username` | string | Nein | Benutzername für Basic-Auth |
| `password` | string | Nein | Passwort für Basic-Auth |
| `index` | string | Ja | Zielindexname |
| `documentId` | string | Nein | Dokument-ID \(wird automatisch generiert, wenn nicht angegeben\) |
| `document` | string | Ja | Dokumentinhalt als JSON-String |
| `refresh` | string | Nein | Aktualisierungsrichtlinie: true, false oder wait_for |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `_index` | string | Index, in dem das Dokument gespeichert wurde |
| `_id` | string | Dokument-ID |
| `_version` | number | Dokumentversion |
| `result` | string | Operationsergebnis \(erstellt oder aktualisiert\) |

### `elasticsearch_get_document`

Dokument anhand der ID aus Elasticsearch abrufen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Ja | Bereitstellungstyp: self_hosted oder cloud |
| `host` | string | Nein | Elasticsearch-Host-URL \(für self-hosted\) |
| `cloudId` | string | Nein | Elastic Cloud ID \(für Cloud-Bereitstellungen\) |
| `authMethod` | string | Ja | Authentifizierungsmethode: api_key oder basic_auth |
| `apiKey` | string | Nein | Elasticsearch API-Schlüssel |
| `username` | string | Nein | Benutzername für Basic-Auth |
| `password` | string | Nein | Passwort für Basic-Auth |
| `index` | string | Ja | Indexname |
| `documentId` | string | Ja | Abzurufende Dokument-ID |
| `sourceIncludes` | string | Nein | Kommagetrennte Liste der einzuschließenden Felder |
| `sourceExcludes` | string | Nein | Kommagetrennte Liste der auszuschließenden Felder |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `_index` | string | Indexname |
| `_id` | string | Dokument-ID |
| `_version` | number | Dokumentversion |
| `found` | boolean | Ob das Dokument gefunden wurde |
| `_source` | json | Dokumentinhalt |

### `elasticsearch_update_document`

Teilweise Aktualisierung eines Dokuments in Elasticsearch mittels Doc-Merge.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Ja | Bereitstellungstyp: self_hosted oder cloud |
| `host` | string | Nein | Elasticsearch-Host-URL (für self-hosted) |
| `cloudId` | string | Nein | Elastic Cloud ID (für Cloud-Bereitstellungen) |
| `authMethod` | string | Ja | Authentifizierungsmethode: api_key oder basic_auth |
| `apiKey` | string | Nein | Elasticsearch API-Schlüssel |
| `username` | string | Nein | Benutzername für Basic Auth |
| `password` | string | Nein | Passwort für Basic Auth |
| `index` | string | Ja | Indexname |
| `documentId` | string | Ja | Zu aktualisierende Dokument-ID |
| `document` | string | Ja | Teilweise Dokument zum Zusammenführen als JSON-String |
| `retryOnConflict` | number | Nein | Anzahl der Wiederholungen bei Versionskonflikten |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `_index` | string | Indexname |
| `_id` | string | Dokument-ID |
| `_version` | number | Neue Dokumentversion |
| `result` | string | Operationsergebnis (updated oder noop) |

### `elasticsearch_delete_document`

Löschen eines Dokuments aus Elasticsearch anhand der ID.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Ja | Bereitstellungstyp: self_hosted oder cloud |
| `host` | string | Nein | Elasticsearch-Host-URL \(für self-hosted\) |
| `cloudId` | string | Nein | Elastic Cloud ID \(für Cloud-Bereitstellungen\) |
| `authMethod` | string | Ja | Authentifizierungsmethode: api_key oder basic_auth |
| `apiKey` | string | Nein | Elasticsearch API-Schlüssel |
| `username` | string | Nein | Benutzername für Basic-Auth |
| `password` | string | Nein | Passwort für Basic-Auth |
| `index` | string | Ja | Index-Name |
| `documentId` | string | Ja | Dokument-ID zum Löschen |
| `refresh` | string | Nein | Aktualisierungsrichtlinie: true, false oder wait_for |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `_index` | string | Index-Name |
| `_id` | string | Dokument-ID |
| `_version` | number | Dokumentversion |
| `result` | string | Operationsergebnis \(deleted oder not_found\) |

### `elasticsearch_bulk`

Führen Sie mehrere Index-, Erstellungs-, Lösch- oder Aktualisierungsoperationen in einer einzigen Anfrage für hohe Leistung durch.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Ja | Bereitstellungstyp: self_hosted oder cloud |
| `host` | string | Nein | Elasticsearch-Host-URL \(für self-hosted\) |
| `cloudId` | string | Nein | Elastic Cloud ID \(für Cloud-Bereitstellungen\) |
| `authMethod` | string | Ja | Authentifizierungsmethode: api_key oder basic_auth |
| `apiKey` | string | Nein | Elasticsearch API-Schlüssel |
| `username` | string | Nein | Benutzername für Basic-Auth |
| `password` | string | Nein | Passwort für Basic-Auth |
| `index` | string | Nein | Standardindex für Operationen, die keinen angeben |
| `operations` | string | Ja | Massenoperationen als NDJSON-String \(zeilenweise abgegrenztes JSON\) |
| `refresh` | string | Nein | Aktualisierungsrichtlinie: true, false oder wait_for |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `took` | number | Zeit in Millisekunden, die der Massenvorgang gedauert hat |
| `errors` | boolean | Ob ein Vorgang einen Fehler hatte |
| `items` | array | Ergebnisse für jeden Vorgang |

### `elasticsearch_count`

Zählt Dokumente, die einer Abfrage in Elasticsearch entsprechen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Ja | Bereitstellungstyp: self_hosted oder cloud |
| `host` | string | Nein | Elasticsearch-Host-URL \(für self-hosted\) |
| `cloudId` | string | Nein | Elastic Cloud ID \(für Cloud-Bereitstellungen\) |
| `authMethod` | string | Ja | Authentifizierungsmethode: api_key oder basic_auth |
| `apiKey` | string | Nein | Elasticsearch API-Schlüssel |
| `username` | string | Nein | Benutzername für Basic-Auth |
| `password` | string | Nein | Passwort für Basic-Auth |
| `index` | string | Ja | Indexname, in dem Dokumente gezählt werden sollen |
| `query` | string | Nein | Optionale Abfrage zum Filtern von Dokumenten \(JSON-String\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `count` | number | Anzahl der Dokumente, die der Abfrage entsprechen |
| `_shards` | object | Shard-Statistiken |

### `elasticsearch_create_index`

Erstellt einen neuen Index mit optionalen Einstellungen und Mappings.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Ja | Bereitstellungstyp: self_hosted oder cloud |
| `host` | string | Nein | Elasticsearch-Host-URL \(für self-hosted\) |
| `cloudId` | string | Nein | Elastic Cloud ID \(für Cloud-Bereitstellungen\) |
| `authMethod` | string | Ja | Authentifizierungsmethode: api_key oder basic_auth |
| `apiKey` | string | Nein | Elasticsearch API-Schlüssel |
| `username` | string | Nein | Benutzername für Basic-Auth |
| `password` | string | Nein | Passwort für Basic-Auth |
| `index` | string | Ja | Zu erstellender Indexname |
| `settings` | string | Nein | Indexeinstellungen als JSON-String |
| `mappings` | string | Nein | Index-Mappings als JSON-String |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `acknowledged` | boolean | Ob die Anfrage bestätigt wurde |
| `shards_acknowledged` | boolean | Ob die Shards bestätigt wurden |
| `index` | string | Name des erstellten Index |

### `elasticsearch_delete_index`

Löscht einen Index und alle seine Dokumente. Dieser Vorgang ist nicht rückgängig zu machen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Ja | Bereitstellungstyp: self_hosted oder cloud |
| `host` | string | Nein | Elasticsearch-Host-URL \(für self-hosted\) |
| `cloudId` | string | Nein | Elastic Cloud ID \(für Cloud-Bereitstellungen\) |
| `authMethod` | string | Ja | Authentifizierungsmethode: api_key oder basic_auth |
| `apiKey` | string | Nein | Elasticsearch API-Schlüssel |
| `username` | string | Nein | Benutzername für Basic-Auth |
| `password` | string | Nein | Passwort für Basic-Auth |
| `index` | string | Ja | Name des zu löschenden Index |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `acknowledged` | boolean | Ob die Löschung bestätigt wurde |

### `elasticsearch_get_index`

Ruft Indexinformationen ab, einschließlich Einstellungen, Mappings und Aliase.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Ja | Bereitstellungstyp: self_hosted oder cloud |
| `host` | string | Nein | Elasticsearch-Host-URL \(für self-hosted\) |
| `cloudId` | string | Nein | Elastic Cloud ID \(für Cloud-Bereitstellungen\) |
| `authMethod` | string | Ja | Authentifizierungsmethode: api_key oder basic_auth |
| `apiKey` | string | Nein | Elasticsearch API-Schlüssel |
| `username` | string | Nein | Benutzername für Basic-Auth |
| `password` | string | Nein | Passwort für Basic-Auth |
| `index` | string | Ja | Name des Index, für den Informationen abgerufen werden sollen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `index` | json | Indexinformationen einschließlich Aliase, Mappings und Einstellungen |

### `elasticsearch_cluster_health`

Ruft den Gesundheitsstatus des Elasticsearch-Clusters ab.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Ja | Bereitstellungstyp: self_hosted oder cloud |
| `host` | string | Nein | Elasticsearch-Host-URL \(für self-hosted\) |
| `cloudId` | string | Nein | Elastic Cloud ID \(für Cloud-Bereitstellungen\) |
| `authMethod` | string | Ja | Authentifizierungsmethode: api_key oder basic_auth |
| `apiKey` | string | Nein | Elasticsearch API-Schlüssel |
| `username` | string | Nein | Benutzername für Basic-Auth |
| `password` | string | Nein | Passwort für Basic-Auth |
| `waitForStatus` | string | Nein | Warten bis der Cluster diesen Status erreicht: green, yellow oder red |
| `timeout` | string | Nein | Timeout für den Wartevorgang \(z.B. 30s, 1m\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `cluster_name` | string | Name des Clusters |
| `status` | string | Cluster-Gesundheitsstatus: green, yellow oder red |
| `number_of_nodes` | number | Gesamtzahl der Knoten im Cluster |
| `number_of_data_nodes` | number | Anzahl der Datenknoten |
| `active_shards` | number | Anzahl der aktiven Shards |
| `unassigned_shards` | number | Anzahl der nicht zugewiesenen Shards |

### `elasticsearch_cluster_stats`

Erhalte umfassende Statistiken über den Elasticsearch-Cluster.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | Ja | Bereitstellungstyp: self_hosted oder cloud |
| `host` | string | Nein | Elasticsearch-Host-URL \(für self-hosted\) |
| `cloudId` | string | Nein | Elastic Cloud ID \(für Cloud-Bereitstellungen\) |
| `authMethod` | string | Ja | Authentifizierungsmethode: api_key oder basic_auth |
| `apiKey` | string | Nein | Elasticsearch API-Schlüssel |
| `username` | string | Nein | Benutzername für Basic-Auth |
| `password` | string | Nein | Passwort für Basic-Auth |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `cluster_name` | string | Name des Clusters |
| `status` | string | Cluster-Gesundheitsstatus |
| `nodes` | object | Knotenstatistiken einschließlich Anzahl und Versionen |
| `indices` | object | Indexstatistiken einschließlich Dokumentanzahl und Speichergröße |

## Hinweise

- Kategorie: `tools`
- Typ: `elasticsearch`
```

--------------------------------------------------------------------------------

---[FILE: elevenlabs.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/elevenlabs.mdx

```text
---
title: ElevenLabs
description: TTS mit ElevenLabs konvertieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="elevenlabs"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[ElevenLabs](https://elevenlabs.io/) ist eine hochmoderne Text-to-Speech-Plattform, die unglaublich natürliche und ausdrucksstarke KI-Stimmen erzeugt. Sie bietet einige der realistischsten und emotional nuanciertesten synthetischen Stimmen, die heute verfügbar sind, was sie ideal für die Erstellung lebensechter Audioinhalte macht.

Mit ElevenLabs können Sie:

- **Natürlich klingende Sprache generieren**: Audio erstellen, das kaum von menschlicher Sprache zu unterscheiden ist
- **Aus vielfältigen Stimmoptionen wählen**: Zugriff auf eine Bibliothek vorgefertigter Stimmen mit verschiedenen Akzenten, Tonlagen und Eigenschaften
- **Stimmen klonen**: Benutzerdefinierte Stimmen basierend auf Audiobeispielen erstellen (mit entsprechenden Genehmigungen)
- **Sprachparameter steuern**: Stabilität, Klarheit und emotionalen Ton anpassen, um die Ausgabe zu optimieren
- **Realistische Emotionen hinzufügen**: Natürlich klingende Emotionen wie Freude, Traurigkeit oder Aufregung einbauen

In Sim ermöglicht die ElevenLabs-Integration Ihren Agenten, Text in lebensechte Sprache umzuwandeln, was die Interaktivität und das Engagement Ihrer Anwendungen verbessert. Dies ist besonders wertvoll für die Erstellung von Sprachassistenten, die Generierung von Audioinhalten, die Entwicklung barrierefreier Anwendungen oder den Aufbau von Konversationsschnittstellen, die menschlicher wirken. Die Integration ermöglicht es Ihnen, die fortschrittlichen Sprachsynthesefähigkeiten von ElevenLabs nahtlos in Ihre Agenten-Workflows zu integrieren und so die Lücke zwischen textbasierter KI und natürlicher menschlicher Kommunikation zu schließen.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

ElevenLabs in den Workflow integrieren. Kann Text in Sprache umwandeln. Erfordert API-Schlüssel.

## Tools

### `elevenlabs_tts`

TTS mit ElevenLabs-Stimmen konvertieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `text` | string | Ja | Der Text, der in Sprache umgewandelt werden soll |
| `voiceId` | string | Ja | Die ID der zu verwendenden Stimme |
| `modelId` | string | Nein | Die ID des zu verwendenden Modells \(standardmäßig eleven_monolingual_v1\) |
| `apiKey` | string | Ja | Ihr ElevenLabs API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `audioUrl` | string | Die URL der generierten Audiodatei |
| `audioFile` | file | Die generierte Audiodatei |

## Hinweise

- Kategorie: `tools`
- Typ: `elevenlabs`
```

--------------------------------------------------------------------------------

````
