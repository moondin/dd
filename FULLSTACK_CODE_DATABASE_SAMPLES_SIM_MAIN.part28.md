---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 28
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 28 of 933)

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

---[FILE: huggingface.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/huggingface.mdx

```text
---
title: Hugging Face
description: Use Hugging Face Inference API
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="huggingface"
  color="#0B0F19"
/>

{/* MANUAL-CONTENT-START:intro */}
[HuggingFace](https://huggingface.co/) is a leading AI platform that provides access to thousands of pre-trained machine learning models and powerful inference capabilities. With its extensive model hub and robust API, HuggingFace offers comprehensive tools for both research and production AI applications.
With HuggingFace, you can:

Access pre-trained models: Utilize models for text generation, translation, image processing, and more
Generate AI completions: Create content using state-of-the-art language models through the Inference API
Natural language processing: Process and analyze text with specialized NLP models
Deploy at scale: Host and serve models for production applications
Customize models: Fine-tune existing models for specific use cases

In Sim, the HuggingFace integration enables your agents to programmatically generate completions using the HuggingFace Inference API. This allows for powerful automation scenarios such as content generation, text analysis, code completion, and creative writing. Your agents can generate completions with natural language prompts, access specialized models for different tasks, and integrate AI-generated content into workflows. This integration bridges the gap between your AI workflows and machine learning capabilities, enabling seamless AI-powered automation with one of the world's most comprehensive ML platforms.
{/* MANUAL-CONTENT-END */}

## Usage Instructions

Integrate Hugging Face into the workflow. Can generate completions using the Hugging Face Inference API.

## Tools

### `huggingface_chat`

Generate completions using Hugging Face Inference API

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `systemPrompt` | string | No | System prompt to guide the model behavior |
| `content` | string | Yes | The user message content to send to the model |
| `provider` | string | Yes | The provider to use for the API request \(e.g., novita, cerebras, etc.\) |
| `model` | string | Yes | Model to use for chat completions \(e.g., deepseek/deepseek-v3-0324\) |
| `maxTokens` | number | No | Maximum number of tokens to generate |
| `temperature` | number | No | Sampling temperature \(0-2\). Higher values make output more random |
| `apiKey` | string | Yes | Hugging Face API token |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Chat completion results |

## Notes

- Category: `tools`
- Type: `huggingface`
```

--------------------------------------------------------------------------------

---[FILE: hunter.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/hunter.mdx

```text
---
title: Hunter io
description: Finden und verifizieren Sie professionelle E-Mail-Adressen
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="hunter"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Hunter.io](https://hunter.io/) ist eine führende Plattform zum Finden und Verifizieren von professionellen E-Mail-Adressen, zum Entdecken von Unternehmen und zur Anreicherung von Kontaktdaten. Hunter.io bietet leistungsstarke APIs für Domainsuche, E-Mail-Suche, Verifizierung und Unternehmenserkennung und ist damit ein unverzichtbares Tool für Vertrieb, Recruiting und Geschäftsentwicklung.

Mit Hunter.io können Sie:

- **E-Mail-Adressen nach Domain finden:** Suchen Sie nach allen öffentlich verfügbaren E-Mail-Adressen, die mit einer bestimmten Unternehmensdomäne verknüpft sind.
- **Unternehmen entdecken:** Nutzen Sie erweiterte Filter und KI-gestützte Suche, um Unternehmen zu finden, die Ihren Kriterien entsprechen.
- **Eine bestimmte E-Mail-Adresse finden:** Ermitteln Sie die wahrscheinlichste E-Mail-Adresse einer Person bei einem Unternehmen anhand ihres Namens und der Domain.
- **E-Mail-Adressen verifizieren:** Überprüfen Sie die Zustellbarkeit und Gültigkeit jeder E-Mail-Adresse.
- **Unternehmensdaten anreichern:** Rufen Sie detaillierte Informationen über Unternehmen ab, einschließlich Größe, verwendeter Technologien und mehr.

In Sim ermöglicht die Hunter.io-Integration Ihren Agenten, programmatisch nach E-Mail-Adressen zu suchen und diese zu verifizieren, Unternehmen zu entdecken und Kontaktdaten mithilfe der Hunter.io-API anzureichern. Dies erlaubt Ihnen, Lead-Generierung, Kontaktanreicherung und E-Mail-Verifizierung direkt in Ihren Workflows zu automatisieren. Ihre Agenten können Hunter.io's Tools nutzen, um Outreach zu optimieren, Ihr CRM aktuell zu halten und intelligente Automatisierungsszenarien für Vertrieb, Recruiting und mehr zu ermöglichen.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Hunter in den Workflow. Kann Domains durchsuchen, E-Mail-Adressen finden, E-Mail-Adressen verifizieren, Unternehmen entdecken, Unternehmen finden und E-Mail-Adressen zählen. Erfordert API-Schlüssel.

## Tools

### `hunter_discover`

Gibt Unternehmen zurück, die bestimmten Kriterien entsprechen, unter Verwendung der KI-gestützten Suche von Hunter.io.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `query` | string | Nein | Natürlichsprachliche Suchanfrage für Unternehmen |
| `domain` | string | Nein | Domain-Namen von Unternehmen zum Filtern |
| `headcount` | string | Nein | Unternehmensgrößenfilter \(z.B. "1-10", "11-50"\) |
| `company_type` | string | Nein | Art der Organisation |
| `technology` | string | Nein | Von Unternehmen verwendete Technologie |
| `apiKey` | string | Ja | Hunter.io API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `results` | array | Array von Unternehmen, die den Suchkriterien entsprechen, jeweils mit Domain, Name, Mitarbeiterzahl, Technologien und E-Mail-Anzahl |

### `hunter_domain_search`

Gibt alle gefundenen E-Mail-Adressen anhand eines bestimmten Domain-Namens mit Quellen zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Domainname, nach dem E-Mail-Adressen gesucht werden sollen |
| `limit` | number | Nein | Maximale Anzahl zurückzugebender E-Mail-Adressen \(Standard: 10\) |
| `offset` | number | Nein | Anzahl der zu überspringenden E-Mail-Adressen |
| `type` | string | Nein | Filter für persönliche oder allgemeine E-Mails |
| `seniority` | string | Nein | Filter nach Seniorität: junior, senior oder executive |
| `department` | string | Nein | Filter nach bestimmten Abteilungen \(z.B. sales, marketing\) |
| `apiKey` | string | Ja | Hunter.io API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `domain` | string | Der gesuchte Domainname |
| `disposable` | boolean | Ob die Domain Wegwerf-E-Mail-Adressen akzeptiert |
| `webmail` | boolean | Ob die Domain ein Webmail-Anbieter ist |
| `accept_all` | boolean | Ob die Domain alle E-Mail-Adressen akzeptiert |
| `pattern` | string | Das von der Organisation verwendete E-Mail-Muster |
| `organization` | string | Der Name der Organisation |
| `description` | string | Beschreibung der Organisation |
| `industry` | string | Branche der Organisation |
| `twitter` | string | Twitter-Profil der Organisation |
| `facebook` | string | Facebook-Profil der Organisation |
| `linkedin` | string | LinkedIn-Profil der Organisation |
| `instagram` | string | Instagram-Profil der Organisation |
| `youtube` | string | YouTube-Kanal der Organisation |
| `technologies` | array | Array der von der Organisation verwendeten Technologien |
| `country` | string | Land, in dem die Organisation ansässig ist |
| `state` | string | Bundesland, in dem die Organisation ansässig ist |
| `city` | string | Stadt, in der die Organisation ansässig ist |
| `postal_code` | string | Postleitzahl der Organisation |
| `street` | string | Straßenadresse der Organisation |
| `emails` | array | Array der für die Domain gefundenen E-Mail-Adressen, jeweils mit Wert, Typ, Vertrauenswürdigkeit, Quellen und Personendetails |

### `hunter_email_finder`

Findet die wahrscheinlichste E-Mail-Adresse für eine Person anhand ihres Namens und der Unternehmensdomäne.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Unternehmensdomäne |
| `first_name` | string | Ja | Vorname der Person |
| `last_name` | string | Ja | Nachname der Person |
| `company` | string | Nein | Unternehmensname |
| `apiKey` | string | Ja | Hunter.io API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `email` | string | Die gefundene E-Mail-Adresse |
| `score` | number | Vertrauenswert für die gefundene E-Mail-Adresse |
| `sources` | array | Array von Quellen, in denen die E-Mail gefunden wurde, jede enthält domain, uri, extracted_on, last_seen_on und still_on_page |
| `verification` | object | Verifizierungsinformationen mit Datum und Status |

### `hunter_email_verifier`

Überprüft die Zustellbarkeit einer E-Mail-Adresse und liefert detaillierte Verifizierungsinformationen.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `email` | string | Ja | Die zu überprüfende E-Mail-Adresse |
| `apiKey` | string | Ja | Hunter.io API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `result` | string | Zustellbarkeitsergebnis: zustellbar, nicht zustellbar oder riskant |
| `score` | number | Vertrauenswert für das Verifizierungsergebnis |
| `email` | string | Die überprüfte E-Mail-Adresse |
| `regexp` | boolean | Ob die E-Mail einem gültigen Regex-Muster entspricht |
| `gibberish` | boolean | Ob die E-Mail wie Kauderwelsch erscheint |
| `disposable` | boolean | Ob die E-Mail von einem Anbieter für Einweg-E-Mails stammt |
| `webmail` | boolean | Ob die E-Mail von einem Webmail-Anbieter stammt |
| `mx_records` | boolean | Ob MX-Einträge für die Domain existieren |
| `smtp_server` | boolean | Ob der SMTP-Server erreichbar ist |
| `smtp_check` | boolean | Ob die SMTP-Überprüfung erfolgreich war |
| `accept_all` | boolean | Ob die Domain alle E-Mail-Adressen akzeptiert |
| `block` | boolean | Ob die E-Mail blockiert ist |
| `status` | string | Verifizierungsstatus: gültig, ungültig, accept_all, webmail, disposable oder unknown |
| `sources` | array | Array von Quellen, in denen die E-Mail gefunden wurde |

### `hunter_companies_find`

Reichert Unternehmensdaten mithilfe des Domainnamens an.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Ja | Domain, für die Unternehmensdaten gefunden werden sollen |
| `apiKey` | string | Ja | Hunter.io API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `person` | object | Personeninformationen (undefiniert für companies_find-Tool) |
| `company` | object | Unternehmensinformationen einschließlich Name, Domain, Branche, Größe, Land, LinkedIn und Twitter |

### `hunter_email_count`

Gibt die Gesamtzahl der für eine Domain oder ein Unternehmen gefundenen E-Mail-Adressen zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Nein | Domain, für die E-Mails gezählt werden sollen (erforderlich, wenn kein Unternehmen angegeben ist) |
| `company` | string | Nein | Unternehmensname, für den E-Mails gezählt werden sollen (erforderlich, wenn keine Domain angegeben ist) |
| `type` | string | Nein | Filter für nur persönliche oder generische E-Mails |
| `apiKey` | string | Ja | Hunter.io API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `total` | number | Gesamtzahl der gefundenen E-Mail-Adressen |
| `personal_emails` | number | Anzahl der gefundenen persönlichen E-Mail-Adressen |
| `generic_emails` | number | Anzahl der gefundenen generischen E-Mail-Adressen |
| `department` | object | Aufschlüsselung der E-Mail-Adressen nach Abteilung (Geschäftsführung, IT, Finanzen, Management, Vertrieb, Recht, Support, HR, Marketing, Kommunikation) |
| `seniority` | object | Aufschlüsselung der E-Mail-Adressen nach Hierarchieebene (Junior, Senior, Führungskraft) |

## Notizen

- Kategorie: `tools`
- Typ: `hunter`
```

--------------------------------------------------------------------------------

---[FILE: image_generator.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/image_generator.mdx

```text
---
title: Bildgenerator
description: Bilder generieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="image_generator"
  color="#4D5FFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[DALL-E](https://openai.com/dall-e-3) ist OpenAIs fortschrittliches KI-System, das entwickelt wurde, um realistische Bilder und Kunst aus natürlichsprachlichen Beschreibungen zu generieren. Als hochmodernes Bildgenerierungsmodell kann DALL-E detaillierte und kreative Visualisierungen basierend auf Textaufforderungen erstellen und ermöglicht Nutzern, ihre Ideen in visuelle Inhalte umzuwandeln, ohne künstlerische Fähigkeiten zu benötigen.

Mit DALL-E können Sie:

- **Realistische Bilder generieren**: Fotorealistische Visualisierungen aus Textbeschreibungen erstellen
- **Konzeptionelle Kunst gestalten**: Abstrakte Ideen in visuelle Darstellungen umwandeln
- **Variationen produzieren**: Mehrere Interpretationen derselben Aufforderung generieren
- **Künstlerischen Stil steuern**: Künstlerische Stile, Medien und visuelle Ästhetik spezifizieren
- **Detaillierte Szenen erstellen**: Komplexe Szenen mit mehreren Elementen und Beziehungen beschreiben
- **Produkte visualisieren**: Produktmodelle und Designkonzepte generieren
- **Ideen illustrieren**: Schriftliche Konzepte in visuelle Illustrationen umwandeln

In Sim ermöglicht die DALL-E-Integration Ihren Agenten, Bilder programmatisch als Teil ihrer Arbeitsabläufe zu generieren. Dies erlaubt leistungsstarke Automatisierungsszenarien wie Content-Erstellung, visuelles Design und kreative Ideenfindung. Ihre Agenten können detaillierte Prompts formulieren, entsprechende Bilder generieren und diese visuellen Elemente in ihre Ausgaben oder nachgelagerte Prozesse einbinden. Diese Integration überbrückt die Lücke zwischen natürlicher Sprachverarbeitung und visueller Content-Erstellung, sodass Ihre Agenten nicht nur durch Text, sondern auch durch überzeugende Bilder kommunizieren können. Durch die Verbindung von Sim mit DALL-E können Sie Agenten erstellen, die visuelle Inhalte auf Abruf produzieren, Konzepte illustrieren, Design-Assets generieren und Benutzererfahrungen mit reichhaltigen visuellen Elementen verbessern - alles ohne menschliches Eingreifen im kreativen Prozess.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie den Bildgenerator in den Workflow. Kann Bilder mit DALL-E 3 oder GPT Image generieren. API-Schlüssel erforderlich.

## Tools

### `openai_image`

Bilder mit OpenAI generieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `model` | string | Ja | Das zu verwendende Modell \(gpt-image-1 oder dall-e-3\) |
| `prompt` | string | Ja | Eine Textbeschreibung des gewünschten Bildes |
| `size` | string | Ja | Die Größe der generierten Bilder \(1024x1024, 1024x1792 oder 1792x1024\) |
| `quality` | string | Nein | Die Qualität des Bildes \(standard oder hd\) |
| `style` | string | Nein | Der Stil des Bildes \(vivid oder natural\) |
| `background` | string | Nein | Die Hintergrundfarbe, nur für gpt-image-1 |
| `n` | number | Nein | Die Anzahl der zu generierenden Bilder \(1-10\) |
| `apiKey` | string | Ja | Ihr OpenAI API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Erfolgsstatus der Operation |
| `output` | object | Generierte Bilddaten |

## Hinweise

- Kategorie: `tools`
- Typ: `image_generator`
```

--------------------------------------------------------------------------------

````
