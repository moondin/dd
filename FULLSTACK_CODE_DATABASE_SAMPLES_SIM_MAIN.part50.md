---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 50
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 50 of 933)

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

---[FILE: stt.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/stt.mdx

```text
---
title: Speech-to-Text
description: Konvertiere Sprache in Text mit KI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="stt"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
Transkribieren Sie Sprache zu Text mit den neuesten KI-Modellen von erstklassigen Anbietern. Die Speech-to-Text (STT)-Tools von Sim ermöglichen es Ihnen, Audio und Video in genaue, mit Zeitstempeln versehene und optional übersetzte Transkripte umzuwandeln – mit Unterstützung für verschiedene Sprachen und erweitert durch fortschrittliche Funktionen wie Sprechertrennung und Sprecheridentifikation.

**Unterstützte Anbieter & Modelle:**

- **[OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text/overview)** (OpenAI):  
  OpenAIs Whisper ist ein Open-Source-Deep-Learning-Modell, das für seine Robustheit in verschiedenen Sprachen und Audiobedingungen bekannt ist. Es unterstützt fortschrittliche Modelle wie `whisper-1` und zeichnet sich bei Transkription, Übersetzung und Aufgaben aus, die eine hohe Modellgeneralisierung erfordern. Unterstützt von OpenAI – dem Unternehmen hinter ChatGPT und führender KI-Forschung – wird Whisper häufig in der Forschung und als Basis für vergleichende Bewertungen eingesetzt.

- **[Deepgram](https://deepgram.com/)** (Deepgram Inc.):  
  Das in San Francisco ansässige Unternehmen Deepgram bietet skalierbare, produktionsreife Spracherkennungs-APIs für Entwickler und Unternehmen. Zu den Modellen von Deepgram gehören `nova-3`, `nova-2` und `whisper-large`. Sie bieten Echtzeit- und Batch-Transkription mit branchenführender Genauigkeit, Unterstützung mehrerer Sprachen, automatische Zeichensetzung, intelligente Sprechertrennung, Anrufanalysen und Funktionen für Anwendungsfälle von der Telefonie bis zur Medienproduktion.

- **[ElevenLabs](https://elevenlabs.io/)** (ElevenLabs):  
  Als führendes Unternehmen im Bereich Sprach-KI ist ElevenLabs besonders für hochwertige Sprachsynthese und -erkennung bekannt. Sein STT-Produkt bietet hochpräzises, natürliches Verständnis zahlreicher Sprachen, Dialekte und Akzente. Die neuesten STT-Modelle von ElevenLabs sind für Klarheit und Sprecherunterscheidung optimiert und eignen sich sowohl für kreative als auch für Barrierefreiheitsszenarien. ElevenLabs ist bekannt für bahnbrechende Fortschritte bei KI-gestützten Sprachtechnologien.

- **[AssemblyAI](https://www.assemblyai.com/)** (AssemblyAI Inc.):  
  AssemblyAI bietet API-gesteuerte, hochpräzise Spracherkennung mit Funktionen wie automatischer Kapitelbildung, Themenerkennung, Zusammenfassung, Stimmungsanalyse und Inhaltsmoderation neben der Transkription. Sein proprietäres Modell, einschließlich des gefeierten `Conformer-2`, unterstützt einige der größten Medien-, Call-Center- und Compliance-Anwendungen der Branche. AssemblyAI wird weltweit von Fortune-500-Unternehmen und führenden KI-Startups vertraut.

- **[Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)** (Google Cloud):  
  Googles Speech-to-Text API für Unternehmen unterstützt über 125 Sprachen und Varianten und bietet hohe Genauigkeit sowie Funktionen wie Echtzeit-Streaming, Wort-für-Wort-Konfidenz, Sprechererkennung, automatische Zeichensetzung, benutzerdefiniertes Vokabular und domänenspezifische Anpassungen. Modelle wie `latest_long`, `video` und domänenoptimierte Modelle stehen zur Verfügung, basierend auf Googles jahrelanger Forschung und für globale Skalierbarkeit entwickelt.

- **[AWS Transcribe](https://aws.amazon.com/transcribe/)** (Amazon Web Services):  
  AWS Transcribe nutzt Amazons Cloud-Infrastruktur, um robuste Spracherkennung als API bereitzustellen. Es unterstützt mehrere Sprachen und Funktionen wie Sprecheridentifikation, benutzerdefiniertes Vokabular, Kanalidentifikation (für Call-Center-Audio) und medizinspezifische Transkription. Zu den beliebten Modellen gehören `standard` und domänenspezifische Varianten. AWS Transcribe ist ideal für Organisationen, die bereits Amazons Cloud nutzen.

**Wie man wählt:**  
Wählen Sie den Anbieter und das Modell, das zu Ihrer Anwendung passt – ob Sie schnelle, unternehmenstaugliche Transkription mit zusätzlicher Analytik benötigen (Deepgram, AssemblyAI, Google, AWS), hohe Vielseitigkeit und Open-Source-Zugang (OpenAI Whisper) oder fortschrittliches Sprecher-/Kontextverständnis (ElevenLabs). Berücksichtigen Sie die Preisgestaltung, Sprachabdeckung, Genauigkeit und alle speziellen Funktionen (wie Zusammenfassung, Kapitelunterteilung oder Stimmungsanalyse), die Sie möglicherweise benötigen.

Weitere Details zu Funktionen, Preisen, Funktionshighlights und Feinabstimmungsoptionen finden Sie in der offiziellen Dokumentation jedes Anbieters über die oben genannten Links.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Transkribieren Sie Audio- und Videodateien mit führenden KI-Anbietern in Text. Unterstützt mehrere Sprachen, Zeitstempel und Sprechererkennung.

## Tools

### `stt_whisper`

Transkribieren Sie Audio in Text mit OpenAI Whisper

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Ja | STT-Anbieter \(whisper\) |
| `apiKey` | string | Ja | OpenAI API-Schlüssel |
| `model` | string | Nein | Zu verwendendes Whisper-Modell \(Standard: whisper-1\) |
| `audioFile` | file | Nein | Audio- oder Videodatei zur Transkription |
| `audioFileReference` | file | Nein | Referenz zu Audio-/Videodatei aus vorherigen Blöcken |
| `audioUrl` | string | Nein | URL zu Audio- oder Videodatei |
| `language` | string | Nein | Sprachcode \(z.B. "en", "es", "fr"\) oder "auto" für automatische Erkennung |
| `timestamps` | string | Nein | Zeitstempel-Granularität: none, sentence oder word |
| `translateToEnglish` | boolean | Nein | Audio ins Englische übersetzen |
| `prompt` | string | Nein | Optionaler Text, um den Stil des Modells zu leiten oder ein vorheriges Audiosegment fortzusetzen. Hilft bei Eigennamen und Kontext. |
| `temperature` | number | Nein | Sampling-Temperatur zwischen 0 und 1. Höhere Werte machen die Ausgabe zufälliger, niedrigere Werte fokussierter und deterministischer. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `transcript` | string | Vollständiger transkribierter Text |
| `segments` | array | Segmente mit Zeitstempeln |
| `language` | string | Erkannte oder angegebene Sprache |
| `duration` | number | Audiodauer in Sekunden |

### `stt_deepgram`

Audio mit Deepgram in Text transkribieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Ja | STT-Anbieter (deepgram) |
| `apiKey` | string | Ja | Deepgram API-Schlüssel |
| `model` | string | Nein | Zu verwendendes Deepgram-Modell (nova-3, nova-2, whisper-large, etc.) |
| `audioFile` | file | Nein | Zu transkribierendes Audio- oder Videodatei |
| `audioFileReference` | file | Nein | Referenz auf Audio-/Videodatei aus vorherigen Blöcken |
| `audioUrl` | string | Nein | URL zu Audio- oder Videodatei |
| `language` | string | Nein | Sprachcode (z.B. "en", "es", "fr") oder "auto" für automatische Erkennung |
| `timestamps` | string | Nein | Zeitstempel-Granularität: none, sentence oder word |
| `diarization` | boolean | Nein | Sprechererkennung aktivieren |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `transcript` | string | Vollständiger transkribierter Text |
| `segments` | array | Segmente mit Zeitstempeln und Sprecherkennungen |
| `language` | string | Erkannte oder angegebene Sprache |
| `duration` | number | Audiodauer in Sekunden |
| `confidence` | number | Gesamter Konfidenzwert |

### `stt_elevenlabs`

Audio mit ElevenLabs in Text transkribieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Ja | STT-Anbieter \(elevenlabs\) |
| `apiKey` | string | Ja | ElevenLabs API-Schlüssel |
| `model` | string | Nein | Zu verwendendes ElevenLabs-Modell \(scribe_v1, scribe_v1_experimental\) |
| `audioFile` | file | Nein | Zu transkribierendes Audio- oder Videodatei |
| `audioFileReference` | file | Nein | Referenz auf Audio-/Videodatei aus vorherigen Blöcken |
| `audioUrl` | string | Nein | URL zu Audio- oder Videodatei |
| `language` | string | Nein | Sprachcode \(z.B. "en", "es", "fr"\) oder "auto" für automatische Erkennung |
| `timestamps` | string | Nein | Zeitstempel-Granularität: none, sentence oder word |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `transcript` | string | Vollständig transkribierter Text |
| `segments` | array | Segmente mit Zeitstempeln |
| `language` | string | Erkannte oder angegebene Sprache |
| `duration` | number | Audiodauer in Sekunden |
| `confidence` | number | Gesamter Konfidenzwert |

### `stt_assemblyai`

Audio mit AssemblyAI und erweiterten NLP-Funktionen in Text transkribieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Ja | STT-Anbieter \(assemblyai\) |
| `apiKey` | string | Ja | AssemblyAI API-Schlüssel |
| `model` | string | Nein | Zu verwendendes AssemblyAI-Modell \(Standard: best\) |
| `audioFile` | file | Nein | Zu transkribierendes Audio- oder Videodatei |
| `audioFileReference` | file | Nein | Referenz auf Audio-/Videodatei aus vorherigen Blöcken |
| `audioUrl` | string | Nein | URL zu Audio- oder Videodatei |
| `language` | string | Nein | Sprachcode \(z.B. "en", "es", "fr"\) oder "auto" für automatische Erkennung |
| `timestamps` | string | Nein | Zeitstempel-Granularität: none, sentence oder word |
| `diarization` | boolean | Nein | Sprechererkennung aktivieren |
| `sentiment` | boolean | Nein | Stimmungsanalyse aktivieren |
| `entityDetection` | boolean | Nein | Entitätserkennung aktivieren |
| `piiRedaction` | boolean | Nein | PII-Schwärzung aktivieren |
| `summarization` | boolean | Nein | Automatische Zusammenfassung aktivieren |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `transcript` | string | Vollständig transkribierter Text |
| `segments` | array | Segmente mit Zeitstempeln und Sprecherkennungen |
| `language` | string | Erkannte oder angegebene Sprache |
| `duration` | number | Audiodauer in Sekunden |
| `confidence` | number | Gesamter Konfidenzwert |
| `sentiment` | array | Ergebnisse der Stimmungsanalyse |
| `entities` | array | Erkannte Entitäten |
| `summary` | string | Automatisch generierte Zusammenfassung |

### `stt_gemini`

Audio mit Google Gemini und multimodalen Fähigkeiten in Text transkribieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Ja | STT-Anbieter \(gemini\) |
| `apiKey` | string | Ja | Google API-Schlüssel |
| `model` | string | Nein | Zu verwendendes Gemini-Modell \(Standard: gemini-2.5-flash\) |
| `audioFile` | file | Nein | Zu transkribierendes Audio- oder Videodatei |
| `audioFileReference` | file | Nein | Referenz auf Audio-/Videodatei aus vorherigen Blöcken |
| `audioUrl` | string | Nein | URL zu Audio- oder Videodatei |
| `language` | string | Nein | Sprachcode \(z.B. "en", "es", "fr"\) oder "auto" für automatische Erkennung |
| `timestamps` | string | Nein | Zeitstempel-Granularität: none, sentence oder word |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `transcript` | string | Vollständig transkribierter Text |
| `segments` | array | Segmente mit Zeitstempeln |
| `language` | string | Erkannte oder angegebene Sprache |
| `duration` | number | Audiodauer in Sekunden |
| `confidence` | number | Gesamter Konfidenzwert |

## Hinweise

- Kategorie: `tools`
- Typ: `stt`
```

--------------------------------------------------------------------------------

---[FILE: supabase.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/supabase.mdx

```text
---
title: Supabase
description: Supabase-Datenbank verwenden
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="supabase"
  color="#1C1C1C"
/>

{/* MANUAL-CONTENT-START:intro */}
[Supabase](https://www.supabase.com/) ist eine leistungsstarke Open-Source-Backend-as-a-Service-Plattform, die Entwicklern eine Reihe von Tools zum Erstellen, Skalieren und Verwalten moderner Anwendungen bietet. Supabase bietet eine vollständig verwaltete [PostgreSQL](https://www.postgresql.org/)-Datenbank, robuste Authentifizierung, sofortige RESTful- und GraphQL-APIs, Echtzeit-Abonnements, Dateispeicherung und Edge-Funktionen – alles über eine einheitliche und entwicklerfreundliche Oberfläche zugänglich. Die Open-Source-Natur und Kompatibilität mit gängigen Frameworks machen es zu einer überzeugenden Alternative zu Firebase, mit dem zusätzlichen Vorteil der SQL-Flexibilität und Transparenz.

**Warum Supabase?**
- **Sofortige APIs:** Jede Tabelle und Ansicht in Ihrer Datenbank ist sofort über REST- und GraphQL-Endpunkte verfügbar, was die Erstellung datengesteuerter Anwendungen ohne benutzerdefinierten Backend-Code erleichtert.
- **Echtzeit-Daten:** Supabase ermöglicht Echtzeit-Abonnements, sodass Ihre Apps sofort auf Änderungen in Ihrer Datenbank reagieren können.
- **Authentifizierung & Autorisierung:** Integrierte Benutzerverwaltung mit Unterstützung für E-Mail, OAuth, SSO und mehr, plus zeilenbasierte Sicherheit für granulare Zugriffskontrolle.
- **Speicher:** Sicheres Hochladen, Bereitstellen und Verwalten von Dateien mit integriertem Speicher, der sich nahtlos in Ihre Datenbank integriert.
- **Edge-Funktionen:** Bereitstellen von serverlosen Funktionen in der Nähe Ihrer Benutzer für benutzerdefinierte Logik mit geringer Latenz.

**Verwendung von Supabase in Sim**

Die Supabase-Integration von Sim macht es mühelos, Ihre agentischen Workflows mit Ihren Supabase-Projekten zu verbinden. Mit nur wenigen Konfigurationsfeldern – Ihrer Projekt-ID, Tabellennamen und Service-Rolle-Secret – können Sie sicher direkt aus Ihren Sim-Blöcken mit Ihrer Datenbank interagieren. Die Integration abstrahiert die Komplexität von API-Aufrufen und ermöglicht es Ihnen, sich auf den Aufbau von Logik und Automatisierungen zu konzentrieren.

**Hauptvorteile der Verwendung von Supabase in Sim:**
- **No-code/Low-code Datenbankoperationen:** Abfragen, Einfügen, Aktualisieren und Löschen von Zeilen in Ihren Supabase-Tabellen ohne SQL oder Backend-Code zu schreiben.
- **Flexible Abfragen:** Verwenden Sie die [PostgREST-Filtersyntax](https://postgrest.org/en/stable/api.html#operators) für erweiterte Abfragen, einschließlich Filtern, Sortieren und Begrenzen von Ergebnissen.
- **Nahtlose Integration:** Verbinden Sie Supabase einfach mit anderen Tools und Diensten in Ihrem Workflow und ermöglichen Sie leistungsstarke Automatisierungen wie Datensynchronisierung, Auslösen von Benachrichtigungen oder Anreicherung von Datensätzen.
- **Sicher und skalierbar:** Alle Operationen verwenden Ihr Supabase Service-Rolle-Secret und gewährleisten sicheren Zugriff auf Ihre Daten mit der Skalierbarkeit einer verwalteten Cloud-Plattform.

Ob Sie interne Tools erstellen, Geschäftsprozesse automatisieren oder Produktionsanwendungen betreiben – Supabase in Sim bietet eine schnelle, zuverlässige und entwicklerfreundliche Möglichkeit, Ihre Daten und Backend-Logik zu verwalten – ohne Infrastrukturverwaltung. Konfigurieren Sie einfach Ihren Block, wählen Sie die benötigte Operation und lassen Sie Sim den Rest erledigen.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Supabase in den Workflow. Unterstützt Datenbankoperationen (Abfrage, Einfügen, Aktualisieren, Löschen, Upsert), Volltextsuche, RPC-Funktionen, Zeilenzählung, Vektorsuche und komplettes Speichermanagement (Hochladen, Herunterladen, Auflisten, Verschieben, Kopieren, Löschen von Dateien und Buckets).

## Tools

### `supabase_query`

Daten aus einer Supabase-Tabelle abfragen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `table` | string | Ja | Der Name der abzufragenden Supabase-Tabelle |
| `filter` | string | Nein | PostgREST-Filter \(z.B. "id=eq.123"\) |
| `orderBy` | string | Nein | Spalte zum Sortieren \(fügen Sie DESC für absteigend hinzu\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Zeilen |
| `apiKey` | string | Ja | Ihr Supabase Service-Rolle-Secret-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | array | Array der von der Abfrage zurückgegebenen Datensätze |

### `supabase_insert`

Daten in eine Supabase-Tabelle einfügen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `table` | string | Ja | Der Name der Supabase-Tabelle, in die Daten eingefügt werden sollen |
| `data` | array | Ja | Die einzufügenden Daten \(Array von Objekten oder ein einzelnes Objekt\) |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | array | Array der eingefügten Datensätze |

### `supabase_get_row`

Eine einzelne Zeile aus einer Supabase-Tabelle basierend auf Filterkriterien abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID (z.B. jdrkgepadsdopsntdlom) |
| `table` | string | Ja | Der Name der Supabase-Tabelle für die Abfrage |
| `filter` | string | Ja | PostgREST-Filter zum Finden der spezifischen Zeile (z.B. "id=eq.123") |
| `apiKey` | string | Ja | Ihr Supabase Service-Role-Secret-Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | array | Array mit den Zeilendaten, falls gefunden, leeres Array, falls nicht gefunden |

### `supabase_update`

Zeilen in einer Supabase-Tabelle basierend auf Filterkriterien aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID (z.B. jdrkgepadsdopsntdlom) |
| `table` | string | Ja | Der Name der zu aktualisierenden Supabase-Tabelle |
| `filter` | string | Ja | PostgREST-Filter zur Identifizierung der zu aktualisierenden Zeilen (z.B. "id=eq.123") |
| `data` | object | Ja | Daten, die in den übereinstimmenden Zeilen aktualisiert werden sollen |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | array | Array der aktualisierten Datensätze |

### `supabase_delete`

Zeilen aus einer Supabase-Tabelle basierend auf Filterkriterien löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID (z.B. jdrkgepadsdopsntdlom) |
| `table` | string | Ja | Der Name der Supabase-Tabelle, aus der gelöscht werden soll |
| `filter` | string | Ja | PostgREST-Filter zur Identifizierung der zu löschenden Zeilen (z.B. "id=eq.123") |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | array | Array der gelöschten Datensätze |

### `supabase_upsert`

Daten in eine Supabase-Tabelle einfügen oder aktualisieren (Upsert-Operation)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `table` | string | Ja | Der Name der Supabase-Tabelle, in die Daten upsertet werden sollen |
| `data` | array | Ja | Die zu upsertenden Daten \(einfügen oder aktualisieren\) - Array von Objekten oder ein einzelnes Objekt |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | array | Array der eingefügten/aktualisierten Datensätze |

### `supabase_count`

Zeilen in einer Supabase-Tabelle zählen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `table` | string | Ja | Der Name der Supabase-Tabelle, deren Zeilen gezählt werden sollen |
| `filter` | string | Nein | PostgREST-Filter \(z.B. "status=eq.active"\) |
| `countType` | string | Nein | Zähltyp: exact, planned oder estimated \(Standard: exact\) |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `count` | number | Anzahl der Zeilen, die dem Filter entsprechen |

### `supabase_text_search`

Volltextsuche in einer Supabase-Tabelle durchführen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `table` | string | Ja | Der Name der Supabase-Tabelle für die Suche |
| `column` | string | Ja | Die Spalte, in der gesucht werden soll |
| `query` | string | Ja | Die Suchanfrage |
| `searchType` | string | Nein | Suchtyp: plain, phrase oder websearch \(Standard: websearch\) |
| `language` | string | Nein | Sprache für die Textsuchkonfiguration \(Standard: english\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Zeilen |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | array | Array von Datensätzen, die der Suchabfrage entsprechen |

### `supabase_vector_search`

Ähnlichkeitssuche mit pgvector in einer Supabase-Tabelle durchführen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `functionName` | string | Ja | Der Name der PostgreSQL-Funktion, die die Vektorsuche durchführt \(z.B. match_documents\) |
| `queryEmbedding` | array | Ja | Der Abfragevektor/Embedding, nach dem ähnliche Elemente gesucht werden sollen |
| `matchThreshold` | number | Nein | Minimaler Ähnlichkeitsschwellenwert \(0-1\), typischerweise 0,7-0,9 |
| `matchCount` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(Standard: 10\) |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | array | Array von Datensätzen mit Ähnlichkeitswerten aus der Vektorsuche. Jeder Datensatz enthält ein Ähnlichkeitsfeld \(0-1\), das angibt, wie ähnlich er dem Abfragevektor ist. |

### `supabase_rpc`

Eine PostgreSQL-Funktion in Supabase aufrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `functionName` | string | Ja | Der Name der aufzurufenden PostgreSQL-Funktion |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | json | Von der Funktion zurückgegebenes Ergebnis |

### `supabase_storage_upload`

Eine Datei in einen Supabase-Speicher-Bucket hochladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `bucket` | string | Ja | Der Name des Speicher-Buckets |
| `path` | string | Ja | Der Pfad, unter dem die Datei gespeichert wird \(z.B. "ordner/datei.jpg"\) |
| `fileContent` | string | Ja | Der Dateiinhalt \(base64-kodiert für Binärdateien oder Klartext\) |
| `contentType` | string | Nein | MIME-Typ der Datei \(z.B. "image/jpeg", "text/plain"\) |
| `upsert` | boolean | Nein | Wenn true, überschreibt vorhandene Datei \(Standard: false\) |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | object | Upload-Ergebnis einschließlich Dateipfad und Metadaten |

### `supabase_storage_download`

Eine Datei aus einem Supabase-Speicher-Bucket herunterladen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `bucket` | string | Ja | Der Name des Speicher-Buckets |
| `path` | string | Ja | Der Pfad zur herunterzuladenden Datei \(z.B. "ordner/datei.jpg"\) |
| `fileName` | string | Nein | Optionale Überschreibung des Dateinamens |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `file` | file | Heruntergeladene Datei, gespeichert in Ausführungsdateien |

### `supabase_storage_list`

Dateien in einem Supabase-Speicher-Bucket auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `bucket` | string | Ja | Der Name des Speicher-Buckets |
| `path` | string | Nein | Der Ordnerpfad, aus dem Dateien aufgelistet werden sollen \(Standard: Root\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Dateien \(Standard: 100\) |
| `offset` | number | Nein | Anzahl der zu überspringenden Dateien \(für Paginierung\) |
| `sortBy` | string | Nein | Spalte zum Sortieren: name, created_at, updated_at \(Standard: name\) |
| `sortOrder` | string | Nein | Sortierreihenfolge: asc oder desc \(Standard: asc\) |
| `search` | string | Nein | Suchbegriff zum Filtern von Dateien nach Namen |
| `apiKey` | string | Ja | Ihr Supabase Service-Rolle-Secret-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | array | Array von Dateiobjekten mit Metadaten |

### `supabase_storage_delete`

Dateien aus einem Supabase-Speicher-Bucket löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `bucket` | string | Ja | Der Name des Speicher-Buckets |
| `paths` | array | Ja | Array von Dateipfaden zum Löschen \(z.B. \["ordner/datei1.jpg", "ordner/datei2.jpg"\]\) |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | array | Array der gelöschten Dateiobjekte |

### `supabase_storage_move`

Eine Datei innerhalb eines Supabase-Speicher-Buckets verschieben

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `bucket` | string | Ja | Der Name des Speicher-Buckets |
| `fromPath` | string | Ja | Der aktuelle Pfad der Datei \(z.B. "ordner/alt.jpg"\) |
| `toPath` | string | Ja | Der neue Pfad für die Datei \(z.B. "neuerordner/neu.jpg"\) |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | object | Ergebnis der Verschiebeaktion |

### `supabase_storage_copy`

Eine Datei innerhalb eines Supabase-Speicher-Buckets kopieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `bucket` | string | Ja | Der Name des Speicher-Buckets |
| `fromPath` | string | Ja | Der Pfad der Quelldatei \(z.B. "folder/source.jpg"\) |
| `toPath` | string | Ja | Der Pfad für die kopierte Datei \(z.B. "folder/copy.jpg"\) |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | object | Ergebnis der Kopieroperation |

### `supabase_storage_create_bucket`

Einen neuen Speicher-Bucket in Supabase erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `bucket` | string | Ja | Der Name des zu erstellenden Buckets |
| `isPublic` | boolean | Nein | Ob der Bucket öffentlich zugänglich sein soll \(Standard: false\) |
| `fileSizeLimit` | number | Nein | Maximale Dateigröße in Bytes \(optional\) |
| `allowedMimeTypes` | array | Nein | Array erlaubter MIME-Typen \(z.B. \["image/png", "image/jpeg"\]\) |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | object | Informationen zum erstellten Bucket |

### `supabase_storage_list_buckets`

Alle Speicher-Buckets in Supabase auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | array | Array von Bucket-Objekten |

### `supabase_storage_delete_bucket`

Einen Speicher-Bucket in Supabase löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `bucket` | string | Ja | Der Name des zu löschenden Buckets |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `results` | object | Ergebnis der Löschoperation |

### `supabase_storage_get_public_url`

Die öffentliche URL für eine Datei in einem Supabase-Speicher-Bucket abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `bucket` | string | Ja | Der Name des Speicher-Buckets |
| `path` | string | Ja | Der Pfad zur Datei \(z.B. "ordner/datei.jpg"\) |
| `download` | boolean | Nein | Wenn true, wird der Download erzwungen anstatt der Inline-Anzeige \(Standard: false\) |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `publicUrl` | string | Die öffentliche URL für den Zugriff auf die Datei |

### `supabase_storage_create_signed_url`

Erstellt eine temporäre signierte URL für eine Datei in einem Supabase-Speicher-Bucket

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Ja | Ihre Supabase-Projekt-ID \(z.B. jdrkgepadsdopsntdlom\) |
| `bucket` | string | Ja | Der Name des Speicher-Buckets |
| `path` | string | Ja | Der Pfad zur Datei \(z.B. "ordner/datei.jpg"\) |
| `expiresIn` | number | Ja | Anzahl der Sekunden bis zum Ablauf der URL \(z.B. 3600 für 1 Stunde\) |
| `download` | boolean | Nein | Wenn true, wird der Download erzwungen anstatt der Inline-Anzeige \(Standard: false\) |
| `apiKey` | string | Ja | Ihr Supabase Service Role Secret Key |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `message` | string | Statusmeldung der Operation |
| `signedUrl` | string | Die temporäre signierte URL für den Zugriff auf die Datei |

## Hinweise

- Kategorie: `tools`
- Typ: `supabase`
```

--------------------------------------------------------------------------------

````
