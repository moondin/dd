---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 34
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 34 of 933)

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

---[FILE: linkedin.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/linkedin.mdx

```text
---
title: LinkedIn
description: Teilen Sie Beiträge und verwalten Sie Ihre LinkedIn-Präsenz
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="linkedin"
  color="#0072B1"
/>

{/* MANUAL-CONTENT-START:intro */}
[LinkedIn](https://www.linkedin.com) ist die weltweit größte professionelle Netzwerkplattform, die Nutzern ermöglicht, ihre Karriere aufzubauen, sich mit ihrem Netzwerk zu verbinden und berufliche Inhalte zu teilen. LinkedIn wird von Fachleuten aus verschiedenen Branchen für persönliches Branding, Recruiting, Jobsuche und Geschäftsentwicklung genutzt.

Mit LinkedIn können Sie ganz einfach Beiträge in Ihrem persönlichen Feed teilen, um mit Ihrem Netzwerk in Kontakt zu treten, und auf Informationen über Ihr Profil zugreifen, um Ihre beruflichen Erfolge hervorzuheben. Die automatisierte Integration mit Sim ermöglicht es Ihnen, LinkedIn-Funktionen programmatisch zu nutzen – so können Agenten und Workflows Updates posten, über Ihre berufliche Präsenz berichten und Ihren Feed aktiv halten, ohne dass manuelle Arbeit erforderlich ist.

Zu den wichtigsten LinkedIn-Funktionen, die über diese Integration verfügbar sind, gehören:

- **Beiträge teilen:** Veröffentlichen Sie automatisch berufliche Updates, Artikel oder Ankündigungen in Ihrem persönlichen LinkedIn-Feed.
- **Profilinformationen:** Rufen Sie detaillierte Informationen über Ihr LinkedIn-Profil ab, um diese zu überwachen oder in nachgelagerten Aufgaben innerhalb Ihrer Workflows zu verwenden.

Diese Funktionen machen es einfach, Ihr LinkedIn-Netzwerk zu pflegen und Ihre berufliche Reichweite effizient zu erweitern – als Teil Ihrer KI- oder Workflow-Automatisierungsstrategie.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie LinkedIn in Workflows. Teilen Sie Beiträge in Ihrem persönlichen Feed und greifen Sie auf Ihre LinkedIn-Profilinformationen zu.

## Tools

### `linkedin_share_post`

Einen Beitrag in Ihrem persönlichen LinkedIn-Feed teilen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `text` | string | Ja | Der Textinhalt Ihres LinkedIn-Beitrags |
| `visibility` | string | Nein | Wer diesen Beitrag sehen kann: "PUBLIC" oder "CONNECTIONS" \(Standard: "PUBLIC"\) |
| `request` | string | Nein | Keine Beschreibung |
| `output` | string | Nein | Keine Beschreibung |
| `output` | string | Nein | Keine Beschreibung |
| `specificContent` | string | Nein | Keine Beschreibung |
| `shareCommentary` | string | Nein | Keine Beschreibung |
| `visibility` | string | Nein | Keine Beschreibung |
| `headers` | string | Nein | Keine Beschreibung |
| `output` | string | Nein | Keine Beschreibung |
| `output` | string | Nein | Keine Beschreibung |
| `output` | string | Nein | Keine Beschreibung |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `postId` | string | Erstellte Beitrags-ID |
| `profile` | json | LinkedIn-Profilinformationen |
| `error` | string | Fehlermeldung bei fehlgeschlagener Operation |

### `linkedin_get_profile`

Rufen Sie Ihre LinkedIn-Profilinformationen ab

#### Input

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |

#### Output

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `postId` | string | Erstellte Beitrags-ID |
| `profile` | json | LinkedIn-Profilinformationen |
| `error` | string | Fehlermeldung bei fehlgeschlagener Operation |

## Hinweise

- Kategorie: `tools`
- Typ: `linkedin`
```

--------------------------------------------------------------------------------

---[FILE: linkup.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/linkup.mdx

```text
---
title: Linkup
description: Durchsuche das Web mit Linkup
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="linkup"
  color="#D6D3C7"
/>

{/* MANUAL-CONTENT-START:intro */}
[Linkup](https://linkup.so) ist ein leistungsstarkes Web-Suchwerkzeug, das sich nahtlos in Sim integrieren lässt und es deinen KI-Agenten ermöglicht, auf aktuelle Informationen aus dem Web mit korrekter Quellenangabe zuzugreifen.

Linkup verbessert deine KI-Agenten, indem es ihnen die Möglichkeit gibt, im Web nach aktuellen Informationen zu suchen. Bei der Integration in das Toolkit deines Agenten:

- **Echtzeit-Informationszugriff**: Agenten können die neuesten Informationen aus dem Web abrufen und so ihre Antworten aktuell und relevant halten.
- **Quellenangabe**: Alle Informationen werden mit korrekten Zitaten versehen, was Transparenz und Glaubwürdigkeit gewährleistet.
- **Einfache Implementierung**: Füge Linkup mit minimaler Konfiguration zum Werkzeugkasten deines Agenten hinzu.
- **Kontextbewusstsein**: Agenten können Webinformationen nutzen und dabei ihre Persönlichkeit und ihren Gesprächsstil beibehalten.

Um Linkup in deinem Agenten zu implementieren, füge das Tool einfach zur Konfiguration deines Agenten hinzu. Dein Agent kann dann im Web suchen, wann immer er Fragen beantworten muss, die aktuelle Informationen erfordern.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integriere Linkup in den Workflow. Kann das Web durchsuchen. Benötigt API-Schlüssel.

## Tools

### `linkup_search`

Durchsuche das Web nach Informationen mit Linkup

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `q` | string | Ja | Die Suchanfrage |
| `depth` | string | Ja | Suchtiefe (muss entweder "standard" oder "deep" sein) |
| `outputType` | string | Ja | Art der zurückzugebenden Ausgabe (muss "sourcedAnswer" oder "searchResults" sein) |
| `apiKey` | string | Ja | Geben Sie Ihren Linkup API-Schlüssel ein |
| `includeImages` | boolean | Nein | Ob Bilder in Suchergebnissen enthalten sein sollen |
| `fromDate` | string | Nein | Startdatum für die Filterung von Ergebnissen (Format JJJJ-MM-TT) |
| `toDate` | string | Nein | Enddatum für die Filterung von Ergebnissen (Format JJJJ-MM-TT) |
| `excludeDomains` | string | Nein | Kommagetrennte Liste von Domainnamen, die von Suchergebnissen ausgeschlossen werden sollen |
| `includeDomains` | string | Nein | Kommagetrennte Liste von Domainnamen, auf die Suchergebnisse beschränkt werden sollen |
| `includeInlineCitations` | boolean | Nein | Inline-Zitate zu Antworten hinzufügen (gilt nur, wenn outputType "sourcedAnswer" ist) |
| `includeSources` | boolean | Nein | Quellen in die Antwort einbeziehen |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `answer` | string | Die mit Quellen belegte Antwort auf die Suchanfrage |
| `sources` | array | Array von Quellen, die zur Erstellung der Antwort verwendet wurden, jede enthält Name, URL und Textausschnitt |

## Hinweise

- Kategorie: `tools`
- Typ: `linkup`
```

--------------------------------------------------------------------------------

````
