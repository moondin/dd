---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 53
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 53 of 933)

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

---[FILE: video_generator.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/video_generator.mdx

```text
---
title: Video-Generator
description: Generiere Videos aus Text mit KI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="video_generator"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
Erstelle Videos aus Textaufforderungen mit modernsten KI-Modellen führender Anbieter. Sims Video-Generator bringt leistungsstarke, kreative Videosynthese-Funktionen in deinen Workflow – mit Unterstützung für verschiedene Modelle, Seitenverhältnisse, Auflösungen, Kamerasteuerungen, nativen Ton und fortschrittliche Stil- und Konsistenzfunktionen.

**Unterstützte Anbieter & Modelle:**

- **[Runway Gen-4](https://research.runwayml.com/gen2/)** (Runway ML):  
  Runway ist ein Pionier in der Text-zu-Video-Generierung, bekannt für leistungsstarke Modelle wie Gen-2, Gen-3 und Gen-4. Das neueste [Gen-4](https://research.runwayml.com/gen2/) Modell (und Gen-4 Turbo für schnellere Ergebnisse) unterstützt realistischere Bewegungen, größere Weltkonsistenz und visuelle Referenzen für Charaktere, Objekte, Stil und Orte. Unterstützt 16:9, 9:16 und 1:1 Seitenverhältnisse, 5-10 Sekunden Dauer, bis zu 4K Auflösung, Stil-Voreinstellungen und direktes Hochladen von Referenzbildern für konsistente Generierungen. Runway bietet kreative Werkzeuge für Filmemacher, Studios und Content-Ersteller weltweit.

- **[Google Veo](https://deepmind.google/technologies/veo/)** (Google DeepMind):  
  [Veo](https://deepmind.google/technologies/veo/) ist Googles Video-Generationsmodell der nächsten Generation, das hochwertige Videos mit nativem Audio in bis zu 1080p und 16 Sekunden Länge bietet. Unterstützt fortschrittliche Bewegungen, filmische Effekte und nuanciertes Textverständnis. Veo kann Videos mit eingebautem Ton generieren – sowohl mit nativem Audio als auch als stumme Clips. Optionen umfassen 16:9 Seitenverhältnis, variable Dauer, verschiedene Modelle (veo-3, veo-3.1) und promptbasierte Steuerungen. Ideal für Storytelling, Werbung, Forschung und Ideenfindung.

- **[Luma Dream Machine](https://lumalabs.ai/dream-machine)** (Luma AI):  
  [Dream Machine](https://lumalabs.ai/dream-machine) liefert atemberaubend realistische und flüssige Videos aus Text. Es integriert fortschrittliche Kamerasteuerung, Kinematografie-Prompts und unterstützt sowohl ray-1 als auch ray-2 Modelle. Dream Machine unterstützt präzise Seitenverhältnisse (16:9, 9:16, 1:1), variable Dauern und die Spezifikation von Kamerapfaden für komplexe visuelle Führung. Luma ist bekannt für bahnbrechende visuelle Wiedergabetreue und wird von führenden KI-Visions-Forschern unterstützt.

- **[MiniMax Hailuo-02](https://minimax.chat/)** (über [Fal.ai](https://fal.ai/)):  
  [MiniMax Hailuo-02](https://minimax.chat/) ist ein anspruchsvolles chinesisches generatives Videomodell, das weltweit über [Fal.ai](https://fal.ai/) verfügbar ist. Generiere Videos bis zu 16 Sekunden im Quer- oder Hochformat, mit Optionen zur Prompt-Optimierung für verbesserte Klarheit und Kreativität. Pro- und Standard-Endpunkte verfügbar, die hohe Auflösungen (bis zu 1920×1080) unterstützen. Gut geeignet für kreative Projekte, die Prompt-Übersetzung und -Optimierung benötigen, kommerzielle Storytelling und schnelle Prototypenerstellung visueller Ideen.

**Wie man wählt:**  
Wähle deinen Anbieter und dein Modell basierend auf deinen Anforderungen an Qualität, Geschwindigkeit, Dauer, Audio, Kosten und einzigartigen Funktionen. Runway und Veo bieten weltweit führenden Realismus und filmische Fähigkeiten; Luma überzeugt durch flüssige Bewegungen und Kamerasteuerung; MiniMax ist ideal für chinesischsprachige Prompts und bietet schnellen, kostengünstigen Zugang. Berücksichtige Referenzunterstützung, Stilvoreinstellungen, Audioanforderungen und Preisgestaltung bei der Auswahl deines Tools.

Weitere Details zu Funktionen, Einschränkungen, Preisen und Modellfortschritten findest du in der offiziellen Dokumentation der jeweiligen Anbieter oben.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Generiere hochwertige Videos aus Textprompts mit führenden KI-Anbietern. Unterstützt mehrere Modelle, Seitenverhältnisse, Auflösungen und anbieterspezifische Funktionen wie Weltkonsistenz, Kamerasteuerung und Audiogenerierung.

## Tools

### `video_runway`

Generiere Videos mit Runway Gen-4 mit Weltkonsistenz und visuellen Referenzen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Ja | Video-Anbieter \(runway\) |
| `apiKey` | string | Ja | Runway API-Schlüssel |
| `model` | string | Nein | Runway-Modell: gen-4 \(Standard, höhere Qualität\) oder gen-4-turbo \(schneller\) |
| `prompt` | string | Ja | Textprompt, der das zu generierende Video beschreibt |
| `duration` | number | Nein | Videodauer in Sekunden \(5 oder 10, Standard: 5\) |
| `aspectRatio` | string | Nein | Seitenverhältnis: 16:9 \(Querformat\), 9:16 \(Hochformat\) oder 1:1 \(quadratisch\) |
| `resolution` | string | Nein | Videoauflösung \(720p-Ausgabe\). Hinweis: Gen-4 Turbo gibt nativ in 720p aus |
| `visualReference` | json | Ja | Referenzbild ERFORDERLICH für Gen-4 \(UserFile-Objekt\). Gen-4 unterstützt nur Bild-zu-Video, keine reine Textgenerierung |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `videoUrl` | string | Generierte Video-URL |
| `videoFile` | json | Video-Dateiobjekt mit Metadaten |
| `duration` | number | Videodauer in Sekunden |
| `width` | number | Videobreite in Pixeln |
| `height` | number | Videohöhe in Pixeln |
| `provider` | string | Verwendeter Anbieter \(runway\) |
| `model` | string | Verwendetes Modell |
| `jobId` | string | Runway-Job-ID |

### `video_veo`

Videos mit Google Veo 3/3.1 mit nativer Audiogenerierung erstellen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Ja | Video-Anbieter \(veo\) |
| `apiKey` | string | Ja | Google Gemini API-Schlüssel |
| `model` | string | Nein | Veo-Modell: veo-3 \(Standard, höchste Qualität\), veo-3-fast \(schneller\) oder veo-3.1 \(neueste Version\) |
| `prompt` | string | Ja | Textaufforderung, die das zu generierende Video beschreibt |
| `duration` | number | Nein | Videodauer in Sekunden \(4, 6 oder 8, Standard: 8\) |
| `aspectRatio` | string | Nein | Seitenverhältnis: 16:9 \(Querformat\) oder 9:16 \(Hochformat\) |
| `resolution` | string | Nein | Videoauflösung: 720p oder 1080p \(Standard: 1080p\) |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `videoUrl` | string | Generierte Video-URL |
| `videoFile` | json | Video-Dateiobjekt mit Metadaten |
| `duration` | number | Videodauer in Sekunden |
| `width` | number | Videobreite in Pixeln |
| `height` | number | Videohöhe in Pixeln |
| `provider` | string | Verwendeter Anbieter \(veo\) |
| `model` | string | Verwendetes Modell |
| `jobId` | string | Veo-Job-ID |

### `video_luma`

Generiere Videos mit Luma Dream Machine mit erweiterten Kamerasteuerungen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Ja | Video-Anbieter \(luma\) |
| `apiKey` | string | Ja | Luma AI API-Schlüssel |
| `model` | string | Nein | Luma-Modell: ray-2 \(Standard\) |
| `prompt` | string | Ja | Textaufforderung, die das zu generierende Video beschreibt |
| `duration` | number | Nein | Videodauer in Sekunden \(5 oder 9, Standard: 5\) |
| `aspectRatio` | string | Nein | Seitenverhältnis: 16:9 \(Querformat\), 9:16 \(Hochformat\) oder 1:1 \(quadratisch\) |
| `resolution` | string | Nein | Videoauflösung: 540p, 720p oder 1080p \(Standard: 1080p\) |
| `cameraControl` | json | Nein | Kamerasteuerungen als Array von Konzeptobjekten. Format: \[\{ "key": "concept_name" \}\]. Gültige Schlüssel: truck_left, truck_right, pan_left, pan_right, tilt_up, tilt_down, zoom_in, zoom_out, push_in, pull_out, orbit_left, orbit_right, crane_up, crane_down, static, handheld und mehr als 20 weitere vordefinierte Optionen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `videoUrl` | string | Generierte Video-URL |
| `videoFile` | json | Video-Dateiobjekt mit Metadaten |
| `duration` | number | Videodauer in Sekunden |
| `width` | number | Videobreite in Pixeln |
| `height` | number | Videohöhe in Pixeln |
| `provider` | string | Verwendeter Anbieter \(luma\) |
| `model` | string | Verwendetes Modell |
| `jobId` | string | Luma-Job-ID |

### `video_minimax`

Generiere Videos mit MiniMax Hailuo über die MiniMax Platform API mit fortschrittlichem Realismus und Prompt-Optimierung

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Ja | Video-Anbieter \(minimax\) |
| `apiKey` | string | Ja | MiniMax API-Schlüssel von platform.minimax.io |
| `model` | string | Nein | MiniMax-Modell: hailuo-02 \(Standard\) |
| `prompt` | string | Ja | Textprompt, der das zu generierende Video beschreibt |
| `duration` | number | Nein | Videodauer in Sekunden \(6 oder 10, Standard: 6\) |
| `promptOptimizer` | boolean | Nein | Prompt-Optimierung für bessere Ergebnisse aktivieren \(Standard: true\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `videoUrl` | string | URL des generierten Videos |
| `videoFile` | json | Video-Dateiobjekt mit Metadaten |
| `duration` | number | Videodauer in Sekunden |
| `width` | number | Videobreite in Pixeln |
| `height` | number | Videohöhe in Pixeln |
| `provider` | string | Verwendeter Anbieter \(minimax\) |
| `model` | string | Verwendetes Modell |
| `jobId` | string | MiniMax Job-ID |

### `video_falai`

Generiere Videos mit der Fal.ai-Plattform mit Zugriff auf mehrere Modelle, darunter Veo 3.1, Sora 2, Kling 2.5, MiniMax Hailuo und mehr

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Ja | Video-Anbieter \(falai\) |
| `apiKey` | string | Ja | Fal.ai API-Schlüssel |
| `model` | string | Ja | Fal.ai-Modell: veo-3.1 \(Google Veo 3.1\), sora-2 \(OpenAI Sora 2\), kling-2.5-turbo-pro \(Kling 2.5 Turbo Pro\), kling-2.1-pro \(Kling 2.1 Master\), minimax-hailuo-2.3-pro \(MiniMax Hailuo Pro\), minimax-hailuo-2.3-standard \(MiniMax Hailuo Standard\), wan-2.1 \(WAN T2V\), ltxv-0.9.8 \(LTXV 13B\) |
| `prompt` | string | Ja | Textprompt, der das zu generierende Video beschreibt |
| `duration` | number | Nein | Videodauer in Sekunden \(variiert je nach Modell\) |
| `aspectRatio` | string | Nein | Seitenverhältnis \(variiert je nach Modell\): 16:9, 9:16, 1:1 |
| `resolution` | string | Nein | Videoauflösung \(variiert je nach Modell\): 540p, 720p, 1080p |
| `promptOptimizer` | boolean | Nein | Prompt-Optimierung für MiniMax-Modelle aktivieren \(Standard: true\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `videoUrl` | string | Generierte Video-URL |
| `videoFile` | json | Video-Dateiobjekt mit Metadaten |
| `duration` | number | Videodauer in Sekunden |
| `width` | number | Videobreite in Pixeln |
| `height` | number | Videohöhe in Pixeln |
| `provider` | string | Verwendeter Anbieter \(falai\) |
| `model` | string | Verwendetes Modell |
| `jobId` | string | Job-ID |

## Hinweise

- Kategorie: `tools`
- Typ: `video_generator`
```

--------------------------------------------------------------------------------

---[FILE: vision.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/vision.mdx

```text
---
title: Vision
description: Analysieren Sie Bilder mit Vision-Modellen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="vision"
  color="#4D5FFF"
/>

{/* MANUAL-CONTENT-START:intro */}
Vision ist ein Tool, mit dem Sie Bilder mithilfe von Vision-Modellen analysieren können.

Mit Vision können Sie:

- **Bilder analysieren**: Analysieren Sie Bilder mit Vision-Modellen
- **Text extrahieren**: Extrahieren Sie Text aus Bildern
- **Objekte identifizieren**: Identifizieren Sie Objekte in Bildern
- **Bilder beschreiben**: Beschreiben Sie Bilder detailliert
- **Bilder generieren**: Generieren Sie Bilder aus Text

In Sim ermöglicht die Vision-Integration Ihren Agenten, Bilder mit Vision-Modellen als Teil ihrer Workflows zu analysieren. Dies ermöglicht leistungsstarke Automatisierungsszenarien, die eine Analyse von Bildern mit Vision-Modellen erfordern. Ihre Agenten können Bilder mit Vision-Modellen analysieren, Text aus Bildern extrahieren, Objekte in Bildern identifizieren, Bilder detailliert beschreiben und Bilder aus Text generieren. Diese Integration überbrückt die Lücke zwischen Ihren KI-Workflows und Ihren Bildanalyse-Anforderungen und ermöglicht anspruchsvollere und bildzentrierte Automatisierungen. Durch die Verbindung von Sim mit Vision können Sie Agenten erstellen, die mit den neuesten Informationen aktuell bleiben, genauere Antworten liefern und mehr Wert für Benutzer schaffen - alles ohne manuelle Eingriffe oder benutzerdefinierten Code.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Vision in den Workflow. Kann Bilder mit Vision-Modellen analysieren. Erfordert API-Schlüssel.

## Tools

### `vision_tool`

Verarbeiten und analysieren Sie Bilder mit fortschrittlichen Vision-Modellen. Fähig, Bildinhalt zu verstehen, Text zu extrahieren, Objekte zu identifizieren und detaillierte visuelle Beschreibungen zu liefern.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | API-Schlüssel für den ausgewählten Modellanbieter |
| `imageUrl` | string | Nein | Öffentlich zugängliche Bild-URL |
| `imageFile` | file | Nein | Zu analysierende Bilddatei |
| `model` | string | Nein | Zu verwendendes Vision-Modell \(gpt-4o, claude-3-opus-20240229, usw.\) |
| `prompt` | string | Nein | Benutzerdefinierte Eingabeaufforderung für die Bildanalyse |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `content` | string | Der analysierte Inhalt und die Beschreibung des Bildes |
| `model` | string | Das für die Analyse verwendete Vision-Modell |
| `tokens` | number | Insgesamt für die Analyse verwendete Tokens |
| `usage` | object | Detaillierte Aufschlüsselung der Token-Nutzung |

## Hinweise

- Kategorie: `tools`
- Typ: `vision`
```

--------------------------------------------------------------------------------

---[FILE: wealthbox.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/wealthbox.mdx

```text
---
title: Wealthbox
description: Mit Wealthbox interagieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wealthbox"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Wealthbox](https://www.wealthbox.com/) ist eine umfassende CRM-Plattform, die speziell für Finanzberater und Vermögensverwaltungsprofis entwickelt wurde. Sie bietet ein zentrales System zur Verwaltung von Kundenbeziehungen, zur Verfolgung von Interaktionen und zur Organisation von Geschäftsabläufen in der Finanzdienstleistungsbranche.

Mit Wealthbox können Sie:

- **Kundenbeziehungen verwalten**: Speichern Sie detaillierte Kontaktinformationen, Hintergrunddaten und Beziehungshistorien für alle Ihre Kunden
- **Interaktionen verfolgen**: Erstellen und pflegen Sie Notizen zu Besprechungen, Anrufen und anderen Kundenkontaktpunkten
- **Aufgaben organisieren**: Planen und verwalten Sie Nachfolgeaktivitäten, Fristen und wichtige Aktionspunkte
- **Dokumenten-Workflows**: Führen Sie umfassende Aufzeichnungen über Kundenkommunikation und Geschäftsprozesse
- **Auf Kundendaten zugreifen**: Rufen Sie Informationen schnell mit organisierter Kontaktverwaltung und Suchfunktionen ab
- **Automatisierte Nachverfolgungen**: Setzen Sie Erinnerungen und planen Sie Aufgaben, um ein konsistentes Kundenengagement zu gewährleisten

In Sim ermöglicht die Wealthbox-Integration Ihren Agenten, über OAuth-Authentifizierung nahtlos mit Ihren CRM-Daten zu interagieren. Dies ermöglicht leistungsstarke Automatisierungsszenarien wie das automatische Erstellen von Kundennotizen aus Besprechungsprotokollen, das Aktualisieren von Kontaktinformationen, das Planen von Nachfolgeaufgaben und das Abrufen von Kundendetails für personalisierte Kommunikation. Ihre Agenten können bestehende Notizen, Kontakte und Aufgaben lesen, um die Kundenhistorie zu verstehen, und gleichzeitig neue Einträge erstellen, um aktuelle Aufzeichnungen zu führen. Diese Integration überbrückt die Lücke zwischen Ihren KI-Workflows und Ihrem Kundenbeziehungsmanagement und ermöglicht automatisierte Dateneingabe, intelligente Kundeneinblicke und optimierte administrative Prozesse, die Zeit für wertvollere kundenorientierte Aktivitäten freisetzen.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integrieren Sie Wealthbox in den Workflow. Kann Notizen lesen und schreiben, Kontakte lesen und schreiben sowie Aufgaben lesen und schreiben. Erfordert OAuth.

## Tools

### `wealthbox_read_note`

Inhalt aus einer Wealthbox-Notiz lesen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `noteId` | string | Nein | Die ID der zu lesenden Notiz |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Notizdaten und Metadaten |

### `wealthbox_write_note`

Eine Wealthbox-Notiz erstellen oder aktualisieren

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `content` | string | Ja | Der Hauptinhalt der Notiz |
| `contactId` | string | Nein | ID des Kontakts, der mit dieser Notiz verknüpft werden soll |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Daten und Metadaten der erstellten oder aktualisierten Notiz |

### `wealthbox_read_contact`

Inhalt aus einem Wealthbox-Kontakt lesen

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Nein | Die ID des zu lesenden Kontakts |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Kontaktdaten und Metadaten |

### `wealthbox_write_contact`

Einen neuen Wealthbox-Kontakt erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `firstName` | string | Ja | Der Vorname des Kontakts |
| `lastName` | string | Ja | Der Nachname des Kontakts |
| `emailAddress` | string | Nein | Die E-Mail-Adresse des Kontakts |
| `backgroundInformation` | string | Nein | Hintergrundinformationen über den Kontakt |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Erstellte oder aktualisierte Kontaktdaten und Metadaten |

### `wealthbox_read_task`

Inhalt aus einer Wealthbox-Aufgabe lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | Nein | Die ID der zu lesenden Aufgabe |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Status des Operationserfolgs |
| `output` | object | Aufgabendaten und Metadaten |

### `wealthbox_write_task`

Eine Wealthbox-Aufgabe erstellen oder aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `title` | string | Ja | Der Name/Titel der Aufgabe |
| `dueDate` | string | Ja | Das Fälligkeitsdatum und die Uhrzeit der Aufgabe \(Format: "JJJJ-MM-TT HH:MM AM/PM -HHMM", z.B. "2015-05-24 11:00 AM -0400"\) |
| `contactId` | string | Nein | ID des Kontakts, der mit dieser Aufgabe verknüpft werden soll |
| `description` | string | Nein | Beschreibung oder Notizen zur Aufgabe |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Erstellte oder aktualisierte Aufgabendaten und Metadaten |

## Hinweise

- Kategorie: `tools`
- Typ: `wealthbox`
```

--------------------------------------------------------------------------------

---[FILE: webflow.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/webflow.mdx

```text
---
title: Webflow
description: Webflow CMS-Sammlungen verwalten
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="webflow"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Webflow](https://webflow.com/) ist eine leistungsstarke visuelle Webdesign-Plattform, mit der Sie responsive Websites ohne Programmierung erstellen können. Sie kombiniert eine visuelle Design-Oberfläche mit einem robusten CMS (Content Management System), das es Ihnen ermöglicht, dynamische Inhalte für Ihre Websites zu erstellen, zu verwalten und zu veröffentlichen.

Mit Webflow können Sie:

- **Visuell gestalten**: Erstellen Sie benutzerdefinierte Websites mit einem visuellen Editor, der sauberen, semantischen HTML/CSS-Code generiert
- **Inhalte dynamisch verwalten**: Nutzen Sie das CMS, um Sammlungen strukturierter Inhalte wie Blogbeiträge, Produkte, Teammitglieder oder beliebige benutzerdefinierte Daten zu erstellen
- **Sofort veröffentlichen**: Stellen Sie Ihre Websites auf Webflows Hosting bereit oder exportieren Sie den Code für benutzerdefiniertes Hosting
- **Responsive Designs erstellen**: Bauen Sie Websites, die nahtlos auf Desktop, Tablet und Mobilgeräten funktionieren
- **Sammlungen anpassen**: Definieren Sie benutzerdefinierte Felder und Datenstrukturen für Ihre Inhaltstypen
- **Inhaltsaktualisierungen automatisieren**: Verwalten Sie Ihre CMS-Inhalte programmgesteuert über APIs

In Sim ermöglicht die Webflow-Integration Ihren Agenten, nahtlos mit Ihren Webflow-CMS-Sammlungen über API-Authentifizierung zu interagieren. Dies ermöglicht leistungsstarke Automatisierungsszenarien wie das automatische Erstellen von Blogbeiträgen aus KI-generierten Inhalten, das Aktualisieren von Produktinformationen, das Verwalten von Teammitgliederprofilen und das Abrufen von CMS-Elementen für die dynamische Inhaltsgenerierung. Ihre Agenten können vorhandene Elemente auflisten, um Ihre Inhalte zu durchsuchen, bestimmte Elemente nach ID abrufen, neue Einträge erstellen, um frische Inhalte hinzuzufügen, bestehende Elemente aktualisieren, um Informationen aktuell zu halten, und veraltete Inhalte löschen. Diese Integration überbrückt die Lücke zwischen Ihren KI-Workflows und Ihrem Webflow-CMS und ermöglicht automatisierte Inhaltsverwaltung, dynamische Website-Aktualisierungen und optimierte Inhalts-Workflows, die Ihre Websites ohne manuelles Eingreifen frisch und aktuell halten.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integriert Webflow CMS in den Workflow. Kann Elemente in Webflow CMS-Sammlungen erstellen, abrufen, auflisten, aktualisieren oder löschen. Verwalten Sie Ihre Webflow-Inhalte programmatisch. Kann im Trigger-Modus verwendet werden, um Workflows auszulösen, wenn sich Sammlungselemente ändern oder Formulare übermittelt werden.

## Tools

### `webflow_list_items`

Alle Elemente aus einer Webflow CMS-Sammlung auflisten

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | ID der Webflow-Website |
| `collectionId` | string | Ja | ID der Sammlung |
| `offset` | number | Nein | Offset für Paginierung (optional) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Elemente (optional, Standard: 100) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `items` | json | Array von Sammlungselementen |
| `metadata` | json | Metadaten über die Abfrage |

### `webflow_get_item`

Ein einzelnes Element aus einer Webflow CMS-Sammlung abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | ID der Webflow-Website |
| `collectionId` | string | Ja | ID der Sammlung |
| `itemId` | string | Ja | ID des abzurufenden Elements |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `item` | json | Das abgerufene Elementobjekt |
| `metadata` | json | Metadaten über das abgerufene Element |

### `webflow_create_item`

Ein neues Element in einer Webflow CMS-Sammlung erstellen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | ID der Webflow-Website |
| `collectionId` | string | Ja | ID der Sammlung |
| `fieldData` | json | Ja | Felddaten für das neue Element als JSON-Objekt. Schlüssel sollten mit den Sammlungsfeldnamen übereinstimmen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `item` | json | Das erstellte Element-Objekt |
| `metadata` | json | Metadaten über das erstellte Element |

### `webflow_update_item`

Ein vorhandenes Element in einer Webflow CMS-Sammlung aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | ID der Webflow-Website |
| `collectionId` | string | Ja | ID der Sammlung |
| `itemId` | string | Ja | ID des zu aktualisierenden Elements |
| `fieldData` | json | Ja | Zu aktualisierende Felddaten als JSON-Objekt. Nur Felder einschließen, die geändert werden sollen. |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `item` | json | Das aktualisierte Element-Objekt |
| `metadata` | json | Metadaten über das aktualisierte Element |

### `webflow_delete_item`

Ein Element aus einer Webflow CMS-Sammlung löschen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Ja | ID der Webflow-Website |
| `collectionId` | string | Ja | ID der Sammlung |
| `itemId` | string | Ja | ID des zu löschenden Elements |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob die Löschung erfolgreich war |
| `metadata` | json | Metadaten über die Löschung |

## Hinweise

- Kategorie: `tools`
- Typ: `webflow`
```

--------------------------------------------------------------------------------

---[FILE: webhook.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/webhook.mdx

```text
---
title: Webhook
description: Workflow-Ausführung durch externe Webhooks auslösen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="webhook"
  color="#10B981"
/>

## Hinweise

- Kategorie: `triggers`
- Typ: `webhook`
```

--------------------------------------------------------------------------------

---[FILE: whatsapp.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/whatsapp.mdx

```text
---
title: WhatsApp
description: WhatsApp-Nachrichten senden
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="whatsapp"
  color="#25D366"
/>

{/* MANUAL-CONTENT-START:intro */}
[WhatsApp](https://www.whatsapp.com/) ist eine weltweit beliebte Messaging-Plattform, die sichere, zuverlässige Kommunikation zwischen Einzelpersonen und Unternehmen ermöglicht.

Die WhatsApp Business API bietet Organisationen leistungsstarke Funktionen, um:

- **Kunden zu erreichen**: Personalisierte Nachrichten, Benachrichtigungen und Updates direkt an die bevorzugte Messaging-App der Kunden senden
- **Gespräche automatisieren**: Interaktive Chatbots und automatisierte Antwortsysteme für häufige Anfragen erstellen
- **Support verbessern**: Echtzeit-Kundenservice über eine vertraute Oberfläche mit Unterstützung für reichhaltige Medien anbieten
- **Conversions steigern**: Transaktionen und Follow-ups mit Kunden in einer sicheren, konformen Umgebung erleichtern

In Sim ermöglicht die WhatsApp-Integration Ihren Agenten, diese Messaging-Funktionen als Teil ihrer Workflows zu nutzen. Dies schafft Möglichkeiten für anspruchsvolle Kundenbindungsszenarien wie Terminerinnerungen, Verifizierungscodes, Warnmeldungen und interaktive Gespräche. Die Integration überbrückt die Lücke zwischen Ihren KI-Workflows und Kundenkommunikationskanälen und ermöglicht es Ihren Agenten, zeitnahe, relevante Informationen direkt auf die Mobilgeräte der Benutzer zu liefern. Durch die Verbindung von Sim mit WhatsApp können Sie intelligente Agenten erstellen, die Kunden über ihre bevorzugte Messaging-Plattform ansprechen, die Benutzererfahrung verbessern und gleichzeitig routinemäßige Messaging-Aufgaben automatisieren.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integriert WhatsApp in den Workflow. Kann Nachrichten senden.

## Tools

### `whatsapp_send_message`

WhatsApp-Nachrichten senden

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `phoneNumber` | string | Ja | Telefonnummer des Empfängers mit Ländervorwahl |
| `message` | string | Ja | Zu sendender Nachrichteninhalt |
| `phoneNumberId` | string | Ja | WhatsApp Business Telefonnummer-ID |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus des WhatsApp-Nachrichtenversands |
| `messageId` | string | Eindeutige WhatsApp-Nachrichten-ID |
| `phoneNumber` | string | Telefonnummer des Empfängers |
| `status` | string | Zustellungsstatus der Nachricht |
| `timestamp` | string | Zeitstempel des Nachrichtenversands |

## Hinweise

- Kategorie: `tools`
- Typ: `whatsapp`
```

--------------------------------------------------------------------------------

---[FILE: wikipedia.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/wikipedia.mdx

```text
---
title: Wikipedia
description: Suche und rufe Inhalte von Wikipedia ab
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wikipedia"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[Wikipedia](https://www.wikipedia.org/) ist die größte kostenlose Online-Enzyklopädie der Welt, die Millionen von Artikeln zu einer Vielzahl von Themen bietet, die gemeinschaftlich von Freiwilligen geschrieben und gepflegt werden.

Mit Wikipedia kannst du:

- **Nach Artikeln suchen**: Finde relevante Wikipedia-Seiten durch die Suche nach Schlüsselwörtern oder Themen
- **Artikelzusammenfassungen erhalten**: Rufe prägnante Zusammenfassungen von Wikipedia-Seiten für schnelle Referenzen ab
- **Auf vollständige Inhalte zugreifen**: Erhalte den kompletten Inhalt von Wikipedia-Artikeln für tiefgehende Informationen
- **Zufällige Artikel entdecken**: Erkunde neue Themen durch das Abrufen zufälliger Wikipedia-Seiten

In Sim ermöglicht die Wikipedia-Integration deinen Agenten, programmatisch auf Wikipedia-Inhalte zuzugreifen und mit ihnen zu interagieren, als Teil ihrer Arbeitsabläufe. Agenten können nach Artikeln suchen, Zusammenfassungen abrufen, vollständige Seiteninhalte erhalten und zufällige Artikel entdecken, wodurch deine Automatisierungen mit aktuellen, zuverlässigen Informationen aus der größten Enzyklopädie der Welt ausgestattet werden. Diese Integration ist ideal für Szenarien wie Recherche, Content-Anreicherung, Faktenprüfung und Wissensentdeckung und ermöglicht es deinen Agenten, Wikipedia-Daten nahtlos in ihre Entscheidungsfindung und Aufgabenausführung zu integrieren.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integriere Wikipedia in den Workflow. Kann Seitenzusammenfassungen abrufen, Seiten durchsuchen, Seiteninhalt abrufen und zufällige Seiten anzeigen.

## Tools

### `wikipedia_summary`

Erhalte eine Zusammenfassung und Metadaten für eine bestimmte Wikipedia-Seite.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `pageTitle` | string | Ja | Titel der Wikipedia-Seite, für die eine Zusammenfassung abgerufen werden soll |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `summary` | object | Wikipedia-Seitenzusammenfassung und Metadaten |

### `wikipedia_search`

Suche nach Wikipedia-Seiten nach Titel oder Inhalt.

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Ja | Suchanfrage zum Finden von Wikipedia-Seiten |
| `searchLimit` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(Standard: 10, max: 50\) |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `searchResults` | array | Array übereinstimmender Wikipedia-Seiten |

### `wikipedia_content`

Holen Sie den vollständigen HTML-Inhalt einer Wikipedia-Seite.

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `pageTitle` | string | Ja | Titel der Wikipedia-Seite, für die der Inhalt abgerufen werden soll |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `content` | object | Vollständiger HTML-Inhalt und Metadaten der Wikipedia-Seite |

### `wikipedia_random`

Erhalten Sie eine zufällige Wikipedia-Seite.

#### Input

| Parameter | Type | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |

#### Output

| Parameter | Type | Beschreibung |
| --------- | ---- | ----------- |
| `randomPage` | object | Daten einer zufälligen Wikipedia-Seite |

## Hinweise

- Kategorie: `tools`
- Typ: `wikipedia`
```

--------------------------------------------------------------------------------

````
