---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 18
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 18 of 933)

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

---[FILE: platforms.mdx]---
Location: sim-main/apps/docs/content/docs/de/self-hosting/platforms.mdx

```text
---
title: Cloud-Plattformen
description: Sim Studio auf Cloud-Plattformen bereitstellen
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## Railway

Bereitstellung mit einem Klick und automatischer PostgreSQL-Bereitstellung.

[

![Auf Railway bereitstellen](https://railway.app/button.svg)

](https://railway.com/new/template/sim-studio)

Nach der Bereitstellung fügen Sie Umgebungsvariablen im Railway-Dashboard hinzu:
- `BETTER_AUTH_SECRET`, `ENCRYPTION_KEY`, `INTERNAL_API_SECRET` (automatisch generiert)
- `OPENAI_API_KEY` oder andere KI-Anbieter-Schlüssel
- Benutzerdefinierte Domain in Einstellungen → Netzwerk

## VPS-Bereitstellung

Für DigitalOcean, AWS EC2, Azure VMs oder jeden Linux-Server:

<Tabs items={['DigitalOcean', 'AWS EC2', 'Azure VM']}>
  <Tab value="DigitalOcean">
**Empfohlen:** 16 GB RAM Droplet, Ubuntu 24.04

```bash
# Create Droplet via console, then SSH in
ssh root@your-droplet-ip
```

  </Tab>
  <Tab value="AWS EC2">
**Empfohlen:** t3.xlarge (16 GB RAM), Ubuntu 24.04

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

  </Tab>
  <Tab value="Azure VM">
**Empfohlen:** Standard_D4s_v3 (16 GB RAM), Ubuntu 24.04

```bash
ssh azureuser@your-vm-ip
```

  </Tab>
</Tabs>

### Docker installieren

```bash
# Install Docker (official method)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Logout and reconnect, then verify
docker --version
```

### Sim Studio bereitstellen

```bash
git clone https://github.com/simstudioai/sim.git && cd sim

# Create .env with secrets
cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@db:5432/simstudio
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
INTERNAL_API_SECRET=$(openssl rand -hex 32)
NEXT_PUBLIC_APP_URL=https://sim.yourdomain.com
BETTER_AUTH_URL=https://sim.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://sim.yourdomain.com
EOF

# Start
docker compose -f docker-compose.prod.yml up -d
```

### SSL mit Caddy

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy

# Configure (replace domain)
echo 'sim.yourdomain.com {
    reverse_proxy localhost:3000
    handle /socket.io/* {
        reverse_proxy localhost:3002
    }
}' | sudo tee /etc/caddy/Caddyfile

sudo systemctl restart caddy
```

Richten Sie den DNS A-Eintrag Ihrer Domain auf die IP-Adresse Ihres Servers.

## Kubernetes (EKS, AKS, GKE)

Siehe den [Kubernetes-Leitfaden](/self-hosting/kubernetes) für Helm-Deployment auf verwaltetem Kubernetes.

## Verwaltete Datenbank (Optional)

Für den Produktivbetrieb sollten Sie einen verwalteten PostgreSQL-Dienst verwenden:

- **AWS RDS** / **Azure Database** / **Cloud SQL** - Aktivieren Sie die pgvector-Erweiterung
- **Supabase** / **Neon** - pgvector enthalten

Setzen Sie `DATABASE_URL` in Ihrer Umgebung:

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```
```

--------------------------------------------------------------------------------

---[FILE: troubleshooting.mdx]---
Location: sim-main/apps/docs/content/docs/de/self-hosting/troubleshooting.mdx

```text
---
title: Fehlerbehebung
description: Häufige Probleme und Lösungen
---

## Datenbankverbindung fehlgeschlagen

```bash
# Check database is running
docker compose ps db

# Test connection
docker compose exec db psql -U postgres -c "SELECT 1"
```

Überprüfen Sie das `DATABASE_URL` Format: `postgresql://user:pass@host:5432/database`

## Ollama-Modelle werden nicht angezeigt

In Docker ist `localhost` = der Container, nicht Ihr Host-Rechner.

```bash
# For host-machine Ollama, use:
OLLAMA_URL=http://host.docker.internal:11434  # macOS/Windows
OLLAMA_URL=http://192.168.1.x:11434           # Linux (use actual IP)
```

## WebSocket/Echtzeit funktioniert nicht

1. Prüfen Sie, ob `NEXT_PUBLIC_SOCKET_URL` mit Ihrer Domain übereinstimmt
2. Überprüfen Sie, ob der Echtzeit-Dienst läuft: `docker compose ps realtime`
3. Stellen Sie sicher, dass der Reverse-Proxy WebSocket-Upgrades weiterleitet (siehe [Docker-Anleitung](/self-hosting/docker))

## 502 Bad Gateway

```bash
# Check app is running
docker compose ps simstudio
docker compose logs simstudio

# Common causes: out of memory, database not ready
```

## Migrationsfehler

```bash
# View migration logs
docker compose logs migrations

# Run manually
docker compose exec simstudio bun run db:migrate
```

## pgvector nicht gefunden

Verwenden Sie das richtige PostgreSQL-Image:

```yaml
image: pgvector/pgvector:pg17  # NOT postgres:17
```

## Zertifikatsfehler (CERT_HAS_EXPIRED)

Wenn Sie SSL-Zertifikatsfehler beim Aufrufen externer APIs sehen:

```bash
# Update CA certificates in container
docker compose exec simstudio apt-get update && apt-get install -y ca-certificates

# Or set in environment (not recommended for production)
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## Leere Seite nach dem Login

1. Überprüfen Sie die Browser-Konsole auf Fehler
2. Stellen Sie sicher, dass `NEXT_PUBLIC_APP_URL` mit Ihrer tatsächlichen Domain übereinstimmt
3. Löschen Sie Browser-Cookies und lokalen Speicher
4. Prüfen Sie, ob alle Dienste laufen: `docker compose ps`

## Windows-spezifische Probleme

**Turbopack-Fehler unter Windows:**

```bash
# Use WSL2 for better compatibility
wsl --install

# Or disable Turbopack in package.json
# Change "next dev --turbopack" to "next dev"
```

**Zeilenende-Probleme:**

```bash
# Configure git to use LF
git config --global core.autocrlf input
```

## Logs anzeigen

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f simstudio
```

## Hilfe erhalten

- [GitHub Issues](https://github.com/simstudioai/sim/issues)
- [Discord](https://discord.gg/Hr4UWYEcTT)
```

--------------------------------------------------------------------------------

---[FILE: ahrefs.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/ahrefs.mdx

```text
---
title: Ahrefs
description: SEO-Analyse mit Ahrefs
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="ahrefs"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Ahrefs](https://ahrefs.com/) ist ein führendes SEO-Toolset zur Analyse von Websites, Verfolgung von Rankings, Überwachung von Backlinks und Keyword-Recherche. Es bietet detaillierte Einblicke in Ihre eigene Website sowie in die Ihrer Wettbewerber und hilft Ihnen, datengestützte Entscheidungen zur Verbesserung Ihrer Sichtbarkeit in Suchmaschinen zu treffen.

Mit der Ahrefs-Integration in Sim können Sie:

- **Domain Rating & Autorität analysieren**: Überprüfen Sie sofort die Domain Rating (DR) und den Ahrefs Rank jeder Website, um deren Autorität einzuschätzen.
- **Backlinks abrufen**: Rufen Sie eine Liste von Backlinks ab, die auf eine Website oder eine bestimmte URL verweisen, mit Details wie Ankertext, DR der verweisenden Seite und mehr.
- **Backlink-Statistiken erhalten**: Greifen Sie auf Metriken zu Backlink-Typen (dofollow, nofollow, Text, Bild, Weiterleitung usw.) für eine Domain oder URL zu.
- **Organische Keywords erkunden** *(geplant)*: Sehen Sie, für welche Keywords eine Domain rankt und welche Positionen sie in den Google-Suchergebnissen einnimmt.
- **Top-Seiten entdecken** *(geplant)*: Identifizieren Sie die leistungsstärksten Seiten nach organischem Traffic und Links.

Diese Tools ermöglichen es Ihren Agenten, SEO-Recherchen zu automatisieren, Wettbewerber zu überwachen und Berichte zu erstellen – alles als Teil Ihrer Workflow-Automatisierungen. Um die Ahrefs-Integration zu nutzen, benötigen Sie ein Ahrefs Enterprise-Abonnement mit API-Zugang.
{/* MANUAL-CONTENT-END */}

## Nutzungsanleitung

Integrieren Sie Ahrefs SEO-Tools in Ihren Workflow. Analysieren Sie Domain-Ratings, Backlinks, organische Keywords, Top-Seiten und mehr. Erfordert einen Ahrefs Enterprise-Plan mit API-Zugang.

## Tools

### `ahrefs_domain_rating`

Erhalten Sie die Domain Rating (DR) und den Ahrefs Rank für eine Zieldomain. Die Domain Rating zeigt die Stärke einer Website

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `target` | string | Ja | Die zu analysierende Zieldomäne (z.B. example.com) |
| `date` | string | Nein | Datum für historische Daten im Format YYYY-MM-DD (standardmäßig heute) |
| `apiKey` | string | Ja | Ahrefs API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `domainRating` | number | Domain Rating Score (0-100) |
| `ahrefsRank` | number | Ahrefs Rank - globales Ranking basierend auf der Stärke des Backlink-Profils |

### `ahrefs_backlinks`

Erhalte eine Liste von Backlinks, die auf eine Zieldomäne oder URL verweisen. Liefert Details zu jedem Backlink, einschließlich Quell-URL, Ankertext und Domain Rating.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `target` | string | Ja | Die zu analysierende Zieldomäne oder URL |
| `mode` | string | Nein | Analysemodus: domain (gesamte Domäne), prefix (URL-Präfix), subdomains (alle Subdomänen einschließen), exact (exakte URL-Übereinstimmung) |
| `date` | string | Nein | Datum für historische Daten im Format YYYY-MM-DD (standardmäßig heute) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse (Standard: 100) |
| `offset` | number | Nein | Anzahl der zu überspringenden Ergebnisse für Paginierung |
| `apiKey` | string | Ja | Ahrefs API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `backlinks` | array | Liste der Backlinks, die auf das Ziel verweisen |

### `ahrefs_backlinks_stats`

Ruft Backlink-Statistiken für eine Zieldomäne oder URL ab. Gibt Gesamtwerte für verschiedene Backlink-Typen zurück, einschließlich Dofollow-, Nofollow-, Text-, Bild- und Weiterleitungslinks.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `target` | string | Ja | Die zu analysierende Zieldomäne oder URL |
| `mode` | string | Nein | Analysemodus: domain \(gesamte Domäne\), prefix \(URL-Präfix\), subdomains \(alle Subdomänen einschließen\), exact \(exakte URL-Übereinstimmung\) |
| `date` | string | Nein | Datum für historische Daten im Format JJJJ-MM-TT \(standardmäßig heute\) |
| `apiKey` | string | Ja | Ahrefs API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `stats` | object | Zusammenfassung der Backlink-Statistiken |

### `ahrefs_referring_domains`

Ruft eine Liste von Domänen ab, die auf eine Zieldomäne oder URL verlinken. Gibt eindeutige verweisende Domänen mit ihrem Domain-Rating, Backlink-Anzahl und Entdeckungsdaten zurück.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `target` | string | Ja | Die zu analysierende Zieldomäne oder URL |
| `mode` | string | Nein | Analysemodus: domain \(gesamte Domäne\), prefix \(URL-Präfix\), subdomains \(alle Subdomänen einschließen\), exact \(exakte URL-Übereinstimmung\) |
| `date` | string | Nein | Datum für historische Daten im Format JJJJ-MM-TT \(standardmäßig heute\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(Standard: 100\) |
| `offset` | number | Nein | Anzahl der zu überspringenden Ergebnisse für die Paginierung |
| `apiKey` | string | Ja | Ahrefs API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `referringDomains` | array | Liste der Domains, die auf das Ziel verlinken |

### `ahrefs_organic_keywords`

Erhalte organische Keywords, für die eine Zieldomain oder URL in den Google-Suchergebnissen rankt. Liefert Keyword-Details einschließlich Suchvolumen, Ranking-Position und geschätztem Traffic.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `target` | string | Ja | Die zu analysierende Zieldomain oder URL |
| `country` | string | Nein | Ländercode für Suchergebnisse \(z.B. us, gb, de\). Standard: us |
| `mode` | string | Nein | Analysemodus: domain \(gesamte Domain\), prefix \(URL-Präfix\), subdomains \(alle Subdomains einschließen\), exact \(exakte URL-Übereinstimmung\) |
| `date` | string | Nein | Datum für historische Daten im Format JJJJ-MM-TT \(standardmäßig heute\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(Standard: 100\) |
| `offset` | number | Nein | Anzahl der zu überspringenden Ergebnisse für Paginierung |
| `apiKey` | string | Ja | Ahrefs API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `keywords` | array | Liste der organischen Keywords, für die das Ziel rankt |

### `ahrefs_top_pages`

Erhalte die Top-Seiten einer Zieldomain, sortiert nach organischem Traffic. Liefert Seiten-URLs mit ihrem Traffic, Keyword-Anzahl und geschätztem Traffic-Wert.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `target` | string | Ja | Die zu analysierende Zieldomäne |
| `country` | string | Nein | Ländercode für Verkehrsdaten \(z.B. us, gb, de\). Standard: us |
| `mode` | string | Nein | Analysemodus: domain \(gesamte Domäne\), prefix \(URL-Präfix\), subdomains \(alle Subdomänen einschließen\) |
| `date` | string | Nein | Datum für historische Daten im Format JJJJ-MM-TT \(standardmäßig heute\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(Standard: 100\) |
| `offset` | number | Nein | Anzahl der zu überspringenden Ergebnisse für Paginierung |
| `select` | string | Nein | Kommagetrennte Liste der zurückzugebenden Felder \(z.B. url,traffic,keywords,top_keyword,value\). Standard: url,traffic,keywords,top_keyword,value |
| `apiKey` | string | Ja | Ahrefs API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `pages` | array | Liste der Top-Seiten nach organischem Traffic |

### `ahrefs_keyword_overview`

Erhalten Sie detaillierte Metriken für ein Keyword, einschließlich Suchvolumen, Keyword-Schwierigkeit, CPC, Klicks und Traffic-Potenzial.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `keyword` | string | Ja | Das zu analysierende Keyword |
| `country` | string | Nein | Ländercode für Keyword-Daten \(z.B. us, gb, de\). Standard: us |
| `apiKey` | string | Ja | Ahrefs API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `overview` | object | Keyword-Metriken Übersicht |

### `ahrefs_broken_backlinks`

Erhalte eine Liste defekter Backlinks, die auf eine Zieldomäne oder URL verweisen. Nützlich zur Identifizierung von Möglichkeiten zur Link-Wiederherstellung.

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `target` | string | Ja | Die zu analysierende Zieldomäne oder URL |
| `mode` | string | Nein | Analysemodus: domain \(gesamte Domäne\), prefix \(URL-Präfix\), subdomains \(alle Subdomänen einschließen\), exact \(exakte URL-Übereinstimmung\) |
| `date` | string | Nein | Datum für historische Daten im Format JJJJ-MM-TT \(standardmäßig heute\) |
| `limit` | number | Nein | Maximale Anzahl der zurückzugebenden Ergebnisse \(Standard: 100\) |
| `offset` | number | Nein | Anzahl der zu überspringenden Ergebnisse für Paginierung |
| `apiKey` | string | Ja | Ahrefs API-Schlüssel |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `brokenBacklinks` | array | Liste defekter Backlinks |

## Hinweise

- Kategorie: `tools`
- Typ: `ahrefs`
```

--------------------------------------------------------------------------------

---[FILE: airtable.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/airtable.mdx

```text
---
title: Airtable
description: Airtable lesen, erstellen und aktualisieren
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="airtable"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Airtable](https://airtable.com/) ist eine leistungsstarke cloudbasierte Plattform, die die Funktionalität einer Datenbank mit der Einfachheit einer Tabellenkalkulation verbindet. Sie ermöglicht Benutzern, flexible Datenbanken zur Organisation, Speicherung und Zusammenarbeit an Informationen zu erstellen.

Mit Airtable können Sie:

- **Benutzerdefinierte Datenbanken erstellen**: Maßgeschneiderte Lösungen für Projektmanagement, Content-Kalender, Bestandsverfolgung und mehr entwickeln
- **Daten visualisieren**: Ihre Informationen als Raster, Kanban-Board, Kalender oder Galerie anzeigen
- **Arbeitsabläufe automatisieren**: Auslöser und Aktionen einrichten, um wiederkehrende Aufgaben zu automatisieren
- **Mit anderen Tools integrieren**: Verbindung zu Hunderten anderer Anwendungen durch native Integrationen und APIs herstellen

In Sim ermöglicht die Airtable-Integration Ihren Agenten, programmatisch mit Ihren Airtable-Basen zu interagieren. Dies erlaubt nahtlose Datenoperationen wie das Abrufen von Informationen, Erstellen neuer Datensätze und Aktualisieren vorhandener Daten - alles innerhalb Ihrer Agenten-Workflows. Nutzen Sie Airtable als dynamische Datenquelle oder -ziel für Ihre Agenten, sodass sie im Rahmen ihrer Entscheidungsfindung und Aufgabenausführung auf strukturierte Informationen zugreifen und diese bearbeiten können.
{/* MANUAL-CONTENT-END */}

## Nutzungsanweisungen

Integriert Airtable in den Workflow. Kann Airtable-Datensätze erstellen, abrufen, auflisten oder aktualisieren. Erfordert OAuth. Kann im Trigger-Modus verwendet werden, um einen Workflow auszulösen, wenn eine Aktualisierung an einer Airtable-Tabelle vorgenommen wird.

## Tools

### `airtable_list_records`

Datensätze aus einer Airtable-Tabelle lesen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | Ja | ID der Airtable-Basis |
| `tableId` | string | Ja | ID der Tabelle |
| `maxRecords` | number | Nein | Maximale Anzahl der zurückzugebenden Datensätze |
| `filterFormula` | string | Nein | Formel zum Filtern von Datensätzen \(z.B. "\(\{Feldname\} = \'Wert\'\)"\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `records` | json | Array der abgerufenen Airtable-Datensätze |

### `airtable_get_record`

Einen einzelnen Datensatz aus einer Airtable-Tabelle anhand seiner ID abrufen

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | Ja | ID der Airtable-Basis |
| `tableId` | string | Ja | ID oder Name der Tabelle |
| `recordId` | string | Ja | ID des abzurufenden Datensatzes |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `record` | json | Abgerufener Airtable-Datensatz mit id, createdTime und fields |
| `metadata` | json | Operationsmetadaten einschließlich Datensatzanzahl |

### `airtable_create_records`

Neue Datensätze in eine Airtable-Tabelle schreiben

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | Ja | ID der Airtable-Basis |
| `tableId` | string | Ja | ID oder Name der Tabelle |
| `records` | json | Ja | Array von zu erstellenden Datensätzen, jeder mit einem `fields` Objekt |
| `fields` | string | Nein | Keine Beschreibung |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `records` | json | Array der erstellten Airtable-Datensätze |

### `airtable_update_record`

Einen vorhandenen Datensatz in einer Airtable-Tabelle nach ID aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | Ja | ID der Airtable-Basis |
| `tableId` | string | Ja | ID oder Name der Tabelle |
| `recordId` | string | Ja | ID des zu aktualisierenden Datensatzes |
| `fields` | json | Ja | Ein Objekt, das die Feldnamen und ihre neuen Werte enthält |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `record` | json | Aktualisierter Airtable-Datensatz mit ID, Erstellungszeit und Feldern |
| `metadata` | json | Operationsmetadaten einschließlich Datensatzanzahl und aktualisierter Feldnamen |

### `airtable_update_multiple_records`

Mehrere vorhandene Datensätze in einer Airtable-Tabelle aktualisieren

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | Ja | ID der Airtable-Basis |
| `tableId` | string | Ja | ID oder Name der Tabelle |
| `records` | json | Ja | Array von zu aktualisierenden Datensätzen, jeder mit einer `id` und einem `fields`-Objekt |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `records` | json | Array der aktualisierten Airtable-Datensätze |

## Hinweise

- Kategorie: `tools`
- Typ: `airtable`
```

--------------------------------------------------------------------------------

---[FILE: apify.mdx]---
Location: sim-main/apps/docs/content/docs/de/tools/apify.mdx

```text
---
title: Apify
description: Führe Apify-Akteure aus und rufe Ergebnisse ab
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="apify"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Apify](https://apify.com/) ist eine leistungsstarke Plattform zum Erstellen, Bereitstellen und Ausführen von Web-Automatisierung und Web-Scraping-Akteuren im großen Maßstab. Apify ermöglicht es dir, nützliche Daten von jeder Website zu extrahieren, Arbeitsabläufe zu automatisieren und deine Datenpipelines nahtlos zu verbinden.

Mit Apify kannst du:

- **Vorgefertigte oder benutzerdefinierte Akteure ausführen**: Integriere öffentliche Akteure oder entwickle deine eigenen, um eine breite Palette von Webdatenextraktions- und Browser-Aufgaben zu automatisieren.
- **Datensätze abrufen**: Greife auf strukturierte Datensätze zu, die von Akteuren in Echtzeit gesammelt wurden, und verwalte sie.
- **Web-Automatisierung skalieren**: Nutze Cloud-Infrastruktur, um Aufgaben zuverlässig, asynchron oder synchron mit robuster Fehlerbehandlung auszuführen.

In Sim ermöglicht die Apify-Integration deinen Agenten, grundlegende Apify-Operationen programmatisch durchzuführen:

- **Akteur ausführen (Synchron)**: Verwende `apify_run_actor_sync`, um einen Apify-Akteur zu starten und auf dessen Abschluss zu warten, wobei die Ergebnisse sofort nach Beendigung des Laufs abgerufen werden.
- **Akteur ausführen (Asynchron)**: Verwende `apify_run_actor_async`, um einen Akteur im Hintergrund zu starten und regelmäßig nach Ergebnissen zu fragen, was für längere oder komplexe Aufgaben geeignet ist.

Diese Operationen statten deine Agenten aus, um Datenerfassungs- oder Browser-Automatisierungsaufgaben direkt in Workflows zu automatisieren, zu scrapen und zu orchestrieren – alles mit flexibler Konfiguration und Ergebnisverarbeitung, ohne dass manuelle Ausführungen oder externe Tools erforderlich sind. Integriere Apify als dynamische Automatisierungs- und Datenextraktions-Engine, die programmatisch die webbasierten Workflows deiner Agenten antreibt.
{/* MANUAL-CONTENT-END */}

## Gebrauchsanweisung

Integriere Apify in deinen Workflow. Führe jeden Apify-Akteur mit benutzerdefinierter Eingabe aus und rufe Ergebnisse ab. Unterstützt sowohl synchrone als auch asynchrone Ausführung mit automatischem Datensatz-Abruf.

## Tools

### `apify_run_actor_sync`

Führe einen APIFY-Aktor synchron aus und erhalte Ergebnisse (maximal 5 Minuten)

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | APIFY API-Token von console.apify.com/account#/integrations |
| `actorId` | string | Ja | Aktor-ID oder Benutzername/Aktor-Name \(z.B. "janedoe/my-actor" oder Aktor-ID\) |
| `input` | string | Nein | Aktor-Eingabe als JSON-String. Siehe Aktor-Dokumentation für erforderliche Felder. |
| `timeout` | number | Nein | Timeout in Sekunden \(Standard: Aktor-Standard\) |
| `build` | string | Nein | Aktor-Build zum Ausführen \(z.B. "latest", "beta" oder Build-Tag/Nummer\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob der Actor-Lauf erfolgreich war |
| `runId` | string | APIFY-Lauf-ID |
| `status` | string | Laufstatus \(SUCCEEDED, FAILED, usw.\) |
| `items` | array | Dataset-Elemente \(falls abgeschlossen\) |

### `apify_run_actor_async`

Führe einen APIFY-Aktor asynchron mit Polling für lang laufende Aufgaben aus

#### Eingabe

| Parameter | Typ | Erforderlich | Beschreibung |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Ja | APIFY API-Token von console.apify.com/account#/integrations |
| `actorId` | string | Ja | Aktor-ID oder Benutzername/Aktor-Name \(z.B. "janedoe/my-actor" oder Aktor-ID\) |
| `input` | string | Nein | Aktor-Eingabe als JSON-String |
| `waitForFinish` | number | Nein | Anfängliche Wartezeit in Sekunden \(0-60\) bevor Polling beginnt |
| `itemLimit` | number | Nein | Maximale Anzahl an Dataset-Elementen zum Abrufen \(1-250000, Standard 100\) |
| `timeout` | number | Nein | Timeout in Sekunden \(Standard: Aktor-Standard\) |
| `build` | string | Nein | Aktor-Build zum Ausführen \(z.B. "latest", "beta" oder Build-Tag/Nummer\) |

#### Ausgabe

| Parameter | Typ | Beschreibung |
| --------- | ---- | ----------- |
| `success` | boolean | Ob der Actor-Lauf erfolgreich war |
| `runId` | string | APIFY-Lauf-ID |
| `status` | string | Laufstatus \(SUCCEEDED, FAILED, usw.\) |
| `datasetId` | string | Dataset-ID mit Ergebnissen |
| `items` | array | Dataset-Elemente \(falls abgeschlossen\) |

## Hinweise

- Kategorie: `tools`
- Typ: `apify`
```

--------------------------------------------------------------------------------

````
