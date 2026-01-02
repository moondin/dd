---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 152
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 152 of 933)

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
Location: sim-main/apps/docs/content/docs/fr/self-hosting/platforms.mdx

```text
---
title: Plateformes cloud
description: Déployer Sim Studio sur des plateformes cloud
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## Railway

Déploiement en un clic avec provisionnement automatique de PostgreSQL.

[

![Déployer sur Railway](https://railway.app/button.svg)

](https://railway.com/new/template/sim-studio)

Après le déploiement, ajoutez des variables d'environnement dans le tableau de bord Railway :
- `BETTER_AUTH_SECRET`, `ENCRYPTION_KEY`, `INTERNAL_API_SECRET` (générées automatiquement)
- `OPENAI_API_KEY` ou d'autres clés de fournisseur d'IA
- Domaine personnalisé dans Paramètres → Réseau

## Déploiement VPS

Pour DigitalOcean, AWS EC2, Azure VMs, ou tout serveur Linux :

<Tabs items={['DigitalOcean', 'AWS EC2', 'Azure VM']}>
  <Tab value="DigitalOcean">
**Recommandé :** Droplet de 16 Go de RAM, Ubuntu 24.04

```bash
# Create Droplet via console, then SSH in
ssh root@your-droplet-ip
```

  </Tab>
  <Tab value="AWS EC2">
**Recommandé :** t3.xlarge (16 Go de RAM), Ubuntu 24.04

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

  </Tab>
  <Tab value="Azure VM">
**Recommandé :** Standard_D4s_v3 (16 Go de RAM), Ubuntu 24.04

```bash
ssh azureuser@your-vm-ip
```

  </Tab>
</Tabs>

### Installer Docker

```bash
# Install Docker (official method)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Logout and reconnect, then verify
docker --version
```

### Déployer Sim Studio

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

### SSL avec Caddy

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

Pointez l'enregistrement DNS A de votre domaine vers l'IP de votre serveur.

## Kubernetes (EKS, AKS, GKE)

Consultez le [guide Kubernetes](/self-hosting/kubernetes) pour le déploiement Helm sur Kubernetes géré.

## Base de données gérée (optionnel)

Pour la production, utilisez un service PostgreSQL géré :

- **AWS RDS** / **Azure Database** / **Cloud SQL** - Activez l'extension pgvector
- **Supabase** / **Neon** - pgvector inclus

Définissez `DATABASE_URL` dans votre environnement :

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```
```

--------------------------------------------------------------------------------

---[FILE: troubleshooting.mdx]---
Location: sim-main/apps/docs/content/docs/fr/self-hosting/troubleshooting.mdx

```text
---
title: Dépannage
description: Problèmes courants et solutions
---

## Échec de connexion à la base de données

```bash
# Check database is running
docker compose ps db

# Test connection
docker compose exec db psql -U postgres -c "SELECT 1"
```

Vérifiez le format de `DATABASE_URL` : `postgresql://user:pass@host:5432/database`

## Les modèles Ollama ne s'affichent pas

Dans Docker, `localhost` = le conteneur, pas votre machine hôte.

```bash
# For host-machine Ollama, use:
OLLAMA_URL=http://host.docker.internal:11434  # macOS/Windows
OLLAMA_URL=http://192.168.1.x:11434           # Linux (use actual IP)
```

## WebSocket/Temps réel ne fonctionne pas

1. Vérifiez que `NEXT_PUBLIC_SOCKET_URL` correspond à votre domaine
2. Vérifiez que le service temps réel est en cours d'exécution : `docker compose ps realtime`
3. Assurez-vous que le proxy inverse transmet les mises à niveau WebSocket (voir [Guide Docker](/self-hosting/docker))

## Erreur 502 Bad Gateway

```bash
# Check app is running
docker compose ps simstudio
docker compose logs simstudio

# Common causes: out of memory, database not ready
```

## Erreurs de migration

```bash
# View migration logs
docker compose logs migrations

# Run manually
docker compose exec simstudio bun run db:migrate
```

## pgvector introuvable

Utilisez l'image PostgreSQL correcte :

```yaml
image: pgvector/pgvector:pg17  # NOT postgres:17
```

## Erreurs de certificat (CERT_HAS_EXPIRED)

Si vous voyez des erreurs de certificat SSL lors de l'appel d'API externes :

```bash
# Update CA certificates in container
docker compose exec simstudio apt-get update && apt-get install -y ca-certificates

# Or set in environment (not recommended for production)
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## Page blanche après connexion

1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez que `NEXT_PUBLIC_APP_URL` correspond à votre domaine réel
3. Effacez les cookies et le stockage local du navigateur
4. Vérifiez que tous les services sont en cours d'exécution : `docker compose ps`

## Problèmes spécifiques à Windows

**Erreurs Turbopack sur Windows :**

```bash
# Use WSL2 for better compatibility
wsl --install

# Or disable Turbopack in package.json
# Change "next dev --turbopack" to "next dev"
```

**Problèmes de fin de ligne :**

```bash
# Configure git to use LF
git config --global core.autocrlf input
```

## Consulter les journaux

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f simstudio
```

## Obtenir de l'aide

- [Problèmes GitHub](https://github.com/simstudioai/sim/issues)
- [Discord](https://discord.gg/Hr4UWYEcTT)
```

--------------------------------------------------------------------------------

---[FILE: ahrefs.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/ahrefs.mdx

```text
---
title: Ahrefs
description: Analyse SEO avec Ahrefs
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="ahrefs"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Ahrefs](https://ahrefs.com/) est un ensemble d'outils SEO de premier plan pour analyser les sites web, suivre les classements, surveiller les backlinks et rechercher des mots-clés. Il fournit des informations détaillées sur votre propre site web ainsi que sur ceux de vos concurrents, vous aidant à prendre des décisions basées sur les données pour améliorer votre visibilité dans les moteurs de recherche.

Avec l'intégration d'Ahrefs dans Sim, vous pouvez :

- **Analyser le Domain Rating et l'autorité** : vérifier instantanément le Domain Rating (DR) et le rang Ahrefs de n'importe quel site web pour évaluer son autorité.
- **Récupérer les backlinks** : obtenir une liste des backlinks pointant vers un site ou une URL spécifique, avec des détails comme le texte d'ancrage, le DR de la page référente, et plus encore.
- **Obtenir des statistiques sur les backlinks** : accéder aux métriques sur les types de backlinks (dofollow, nofollow, texte, image, redirection, etc.) pour un domaine ou une URL.
- **Explorer les mots-clés organiques** *(prévu)* : voir les mots-clés pour lesquels un domaine est classé et leurs positions dans les résultats de recherche Google.
- **Découvrir les meilleures pages** *(prévu)* : identifier les pages les plus performantes par trafic organique et liens.

Ces outils permettent à vos agents d'automatiser la recherche SEO, de surveiller les concurrents et de générer des rapports, le tout dans le cadre de vos automatisations de flux de travail. Pour utiliser l'intégration Ahrefs, vous aurez besoin d'un abonnement Ahrefs Enterprise avec accès API.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez les outils SEO d'Ahrefs dans votre flux de travail. Analysez les évaluations de domaine, les backlinks, les mots-clés organiques, les meilleures pages et plus encore. Nécessite un plan Ahrefs Enterprise avec accès API.

## Outils

### `ahrefs_domain_rating`

Obtenez le Domain Rating (DR) et le rang Ahrefs pour un domaine cible. Le Domain Rating montre la force d'un site web

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `target` | chaîne | Oui | Le domaine cible à analyser \(par ex., example.com\) |
| `date` | chaîne | Non | Date pour les données historiques au format AAAA-MM-JJ \(par défaut : aujourd'hui\) |
| `apiKey` | chaîne | Oui | Clé API Ahrefs |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `domainRating` | nombre | Score de Domain Rating \(0-100\) |
| `ahrefsRank` | nombre | Ahrefs Rank - classement mondial basé sur la force du profil de backlinks |

### `ahrefs_backlinks`

Obtenir une liste de backlinks pointant vers un domaine ou une URL cible. Renvoie des détails sur chaque backlink, y compris l'URL source, le texte d'ancrage et le domain rating.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `target` | chaîne | Oui | Le domaine ou l'URL cible à analyser |
| `mode` | chaîne | Non | Mode d'analyse : domain \(domaine entier\), prefix \(préfixe d'URL\), subdomains \(inclure tous les sous-domaines\), exact \(correspondance exacte d'URL\) |
| `date` | chaîne | Non | Date pour les données historiques au format AAAA-MM-JJ \(par défaut : aujourd'hui\) |
| `limit` | nombre | Non | Nombre maximum de résultats à renvoyer \(par défaut : 100\) |
| `offset` | nombre | Non | Nombre de résultats à ignorer pour la pagination |
| `apiKey` | chaîne | Oui | Clé API Ahrefs |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `backlinks` | array | Liste des backlinks pointant vers la cible |

### `ahrefs_backlinks_stats`

Obtenez des statistiques de backlinks pour un domaine ou une URL cible. Renvoie les totaux pour différents types de backlinks, y compris les liens dofollow, nofollow, texte, image et de redirection.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `target` | string | Oui | Le domaine ou l'URL cible à analyser |
| `mode` | string | Non | Mode d'analyse : domain \(domaine entier\), prefix \(préfixe d'URL\), subdomains \(inclure tous les sous-domaines\), exact \(correspondance exacte d'URL\) |
| `date` | string | Non | Date pour les données historiques au format AAAA-MM-JJ \(par défaut : aujourd'hui\) |
| `apiKey` | string | Oui | Clé API Ahrefs |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `stats` | object | Résumé des statistiques de backlinks |

### `ahrefs_referring_domains`

Obtenez une liste des domaines qui renvoient vers un domaine ou une URL cible. Renvoie des domaines référents uniques avec leur notation de domaine, le nombre de backlinks et les dates de découverte.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `target` | string | Oui | Le domaine ou l'URL cible à analyser |
| `mode` | string | Non | Mode d'analyse : domain \(domaine entier\), prefix \(préfixe d'URL\), subdomains \(inclure tous les sous-domaines\), exact \(correspondance exacte d'URL\) |
| `date` | string | Non | Date pour les données historiques au format AAAA-MM-JJ \(par défaut : aujourd'hui\) |
| `limit` | number | Non | Nombre maximum de résultats à renvoyer \(par défaut : 100\) |
| `offset` | number | Non | Nombre de résultats à ignorer pour la pagination |
| `apiKey` | string | Oui | Clé API Ahrefs |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `referringDomains` | array | Liste des domaines pointant vers la cible |

### `ahrefs_organic_keywords`

Obtenez les mots-clés organiques pour lesquels un domaine ou une URL cible est classé dans les résultats de recherche Google. Renvoie les détails des mots-clés, y compris le volume de recherche, la position de classement et le trafic estimé.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `target` | string | Oui | Le domaine ou l'URL cible à analyser |
| `country` | string | Non | Code pays pour les résultats de recherche \(ex. : us, gb, de\). Par défaut : us |
| `mode` | string | Non | Mode d'analyse : domain \(domaine entier\), prefix \(préfixe d'URL\), subdomains \(inclure tous les sous-domaines\), exact \(correspondance exacte d'URL\) |
| `date` | string | Non | Date pour les données historiques au format AAAA-MM-JJ \(par défaut : aujourd'hui\) |
| `limit` | number | Non | Nombre maximum de résultats à renvoyer \(par défaut : 100\) |
| `offset` | number | Non | Nombre de résultats à ignorer pour la pagination |
| `apiKey` | string | Oui | Clé API Ahrefs |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `keywords` | array | Liste des mots-clés organiques pour lesquels la cible est classée |

### `ahrefs_top_pages`

Obtenez les meilleures pages d'un domaine cible triées par trafic organique. Renvoie les URL des pages avec leur trafic, le nombre de mots-clés et la valeur estimée du trafic.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `target` | string | Oui | Le domaine cible à analyser |
| `country` | string | Non | Code pays pour les données de trafic \(ex. : us, gb, de\). Par défaut : us |
| `mode` | string | Non | Mode d'analyse : domain \(domaine entier\), prefix \(préfixe d'URL\), subdomains \(inclure tous les sous-domaines\) |
| `date` | string | Non | Date pour les données historiques au format AAAA-MM-JJ \(par défaut : aujourd'hui\) |
| `limit` | number | Non | Nombre maximum de résultats à renvoyer \(par défaut : 100\) |
| `offset` | number | Non | Nombre de résultats à ignorer pour la pagination |
| `select` | string | Non | Liste de champs à renvoyer, séparés par des virgules \(ex. : url,traffic,keywords,top_keyword,value\). Par défaut : url,traffic,keywords,top_keyword,value |
| `apiKey` | string | Oui | Clé API Ahrefs |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `pages` | array | Liste des meilleures pages par trafic organique |

### `ahrefs_keyword_overview`

Obtenez des métriques détaillées pour un mot-clé, y compris le volume de recherche, la difficulté du mot-clé, le CPC, les clics et le potentiel de trafic.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `keyword` | string | Oui | Le mot-clé à analyser |
| `country` | string | Non | Code pays pour les données de mot-clé \(ex., us, gb, de\). Par défaut : us |
| `apiKey` | string | Oui | Clé API Ahrefs |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `overview` | object | Aperçu des métriques du mot-clé |

### `ahrefs_broken_backlinks`

Obtenez une liste de backlinks brisés pointant vers un domaine ou une URL cible. Utile pour identifier les opportunités de récupération de liens.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `target` | chaîne | Oui | Le domaine ou l'URL cible à analyser |
| `mode` | chaîne | Non | Mode d'analyse : domain \(domaine entier\), prefix \(préfixe d'URL\), subdomains \(inclure tous les sous-domaines\), exact \(correspondance exacte d'URL\) |
| `date` | chaîne | Non | Date pour les données historiques au format AAAA-MM-JJ \(par défaut : aujourd'hui\) |
| `limit` | nombre | Non | Nombre maximum de résultats à retourner \(par défaut : 100\) |
| `offset` | nombre | Non | Nombre de résultats à ignorer pour la pagination |
| `apiKey` | chaîne | Oui | Clé API Ahrefs |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `brokenBacklinks` | tableau | Liste des backlinks brisés |

## Remarques

- Catégorie : `tools`
- Type : `ahrefs`
```

--------------------------------------------------------------------------------

---[FILE: airtable.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/airtable.mdx

```text
---
title: Airtable
description: Lire, créer et mettre à jour Airtable
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="airtable"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Airtable](https://airtable.com/) est une plateforme puissante basée sur le cloud qui combine les fonctionnalités d'une base de données avec la simplicité d'un tableur. Elle permet aux utilisateurs de créer des bases de données flexibles pour organiser, stocker et collaborer sur des informations.

Avec Airtable, vous pouvez :

- **Créer des bases de données personnalisées** : élaborer des solutions sur mesure pour la gestion de projets, les calendriers de contenu, le suivi des stocks, et plus encore
- **Visualiser les données** : afficher vos informations sous forme de grille, de tableau kanban, de calendrier ou de galerie
- **Automatiser les flux de travail** : configurer des déclencheurs et des actions pour automatiser les tâches répétitives
- **Intégrer d'autres outils** : se connecter à des centaines d'autres applications grâce aux intégrations natives et aux API

Dans Sim, l'intégration Airtable permet à vos agents d'interagir avec vos bases Airtable de manière programmatique. Cela permet des opérations de données fluides comme la récupération d'informations, la création de nouveaux enregistrements et la mise à jour de données existantes - le tout au sein de vos flux de travail d'agents. Utilisez Airtable comme source ou destination dynamique de données pour vos agents, leur permettant d'accéder et de manipuler des informations structurées dans le cadre de leurs processus de prise de décision et d'exécution de tâches.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intègre Airtable dans le flux de travail. Peut créer, obtenir, lister ou mettre à jour des enregistrements Airtable. Nécessite OAuth. Peut être utilisé en mode déclencheur pour lancer un flux de travail lorsqu'une mise à jour est effectuée dans une table Airtable.

## Outils

### `airtable_list_records`

Lire les enregistrements d'une table Airtable

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `baseId` | chaîne | Oui | ID de la base Airtable |
| `tableId` | chaîne | Oui | ID de la table |
| `maxRecords` | nombre | Non | Nombre maximum d'enregistrements à retourner |
| `filterFormula` | chaîne | Non | Formule pour filtrer les enregistrements \(ex. : "\(\{Nom du champ\} = \'Valeur\'\)"\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `records` | json | Tableau des enregistrements Airtable récupérés |

### `airtable_get_record`

Récupérer un seul enregistrement d'une table Airtable par son ID

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `baseId` | chaîne | Oui | ID de la base Airtable |
| `tableId` | chaîne | Oui | ID ou nom de la table |
| `recordId` | chaîne | Oui | ID de l'enregistrement à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `record` | json | Enregistrement Airtable récupéré avec id, createdTime et fields |
| `metadata` | json | Métadonnées de l'opération incluant le nombre d'enregistrements |

### `airtable_create_records`

Écrire de nouveaux enregistrements dans une table Airtable

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `baseId` | string | Oui | ID de la base Airtable |
| `tableId` | string | Oui | ID ou nom de la table |
| `records` | json | Oui | Tableau d'enregistrements à créer, chacun avec un objet `fields` |
| `fields` | string | Non | Pas de description |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `records` | json | Tableau des enregistrements Airtable créés |

### `airtable_update_record`

Mettre à jour un enregistrement existant dans une table Airtable par ID

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `baseId` | string | Oui | ID de la base Airtable |
| `tableId` | string | Oui | ID ou nom de la table |
| `recordId` | string | Oui | ID de l'enregistrement à mettre à jour |
| `fields` | json | Oui | Un objet contenant les noms des champs et leurs nouvelles valeurs |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `record` | json | Enregistrement Airtable mis à jour avec id, createdTime et fields |
| `metadata` | json | Métadonnées de l'opération incluant le nombre d'enregistrements et les noms des champs mis à jour |

### `airtable_update_multiple_records`

Mettre à jour plusieurs enregistrements existants dans une table Airtable

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `baseId` | string | Oui | ID de la base Airtable |
| `tableId` | string | Oui | ID ou nom de la table |
| `records` | json | Oui | Tableau d'enregistrements à mettre à jour, chacun avec un `id` et un objet `fields` |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `records` | json | Tableau des enregistrements Airtable mis à jour |

## Notes

- Catégorie : `tools`
- Type : `airtable`
```

--------------------------------------------------------------------------------

---[FILE: apify.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/apify.mdx

```text
---
title: Apify
description: Exécutez des acteurs Apify et récupérez les résultats
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="apify"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Apify](https://apify.com/) est une plateforme puissante pour créer, déployer et exécuter des automatisations web et des acteurs de scraping à grande échelle. Apify vous permet d'extraire des données utiles de n'importe quel site web, d'automatiser des flux de travail et de connecter vos pipelines de données de manière transparente.

Avec Apify, vous pouvez :

- **Exécuter des acteurs prêts à l'emploi ou personnalisés** : Intégrez des acteurs publics ou développez les vôtres, en automatisant un large éventail d'extractions de données web et de tâches de navigation.
- **Récupérer des ensembles de données** : Accédez et gérez des ensembles de données structurées collectées par les acteurs en temps réel.
- **Mettre à l'échelle l'automatisation web** : Exploitez l'infrastructure cloud pour exécuter des tâches de manière fiable, de façon asynchrone ou synchrone, avec une gestion robuste des erreurs.

Dans Sim, l'intégration Apify permet à vos agents d'effectuer des opérations Apify essentielles de manière programmatique :

- **Exécuter un acteur (Sync)** : Utilisez `apify_run_actor_sync` pour lancer un acteur Apify et attendre sa complétion, récupérant les résultats dès que l'exécution se termine.
- **Exécuter un acteur (Async)** : Utilisez `apify_run_actor_async` pour démarrer un acteur en arrière-plan et interroger périodiquement les résultats, adapté aux tâches plus longues ou complexes.

Ces opérations équipent vos agents pour automatiser, scraper et orchestrer la collecte de données ou les tâches d'automatisation de navigateur directement dans les flux de travail — le tout avec une configuration flexible et une gestion des résultats, sans nécessiter d'exécutions manuelles ou d'outils externes. Intégrez Apify comme un moteur dynamique d'automatisation et d'extraction de données qui alimente de manière programmatique les flux de travail à l'échelle du web de vos agents.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Apify dans votre flux de travail. Exécutez n'importe quel acteur Apify avec des entrées personnalisées et récupérez les résultats. Prend en charge l'exécution synchrone et asynchrone avec récupération automatique des ensembles de données.

## Outils

### `apify_run_actor_sync`

Exécuter un acteur APIFY de manière synchrone et obtenir les résultats (maximum 5 minutes)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton API APIFY depuis console.apify.com/account#/integrations |
| `actorId` | chaîne | Oui | ID de l'acteur ou nom d'utilisateur/nom-acteur \(ex. : "janedoe/my-actor" ou ID de l'acteur\) |
| `input` | chaîne | Non | Entrée de l'acteur sous forme de chaîne JSON. Voir la documentation de l'acteur pour les champs requis. |
| `timeout` | nombre | Non | Délai d'attente en secondes \(par défaut : valeur par défaut de l'acteur\) |
| `build` | chaîne | Non | Version de l'acteur à exécuter \(ex. : "latest", "beta", ou tag/numéro de build\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si l'exécution de l'acteur a réussi |
| `runId` | string | ID d'exécution APIFY |
| `status` | string | Statut d'exécution \(SUCCEEDED, FAILED, etc.\) |
| `items` | array | Éléments du dataset \(si terminé\) |

### `apify_run_actor_async`

Exécuter un acteur APIFY de manière asynchrone avec interrogation périodique pour les tâches de longue durée

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | chaîne | Oui | Jeton API APIFY depuis console.apify.com/account#/integrations |
| `actorId` | chaîne | Oui | ID de l'acteur ou nom d'utilisateur/nom-acteur \(ex. : "janedoe/my-actor" ou ID de l'acteur\) |
| `input` | chaîne | Non | Entrée de l'acteur sous forme de chaîne JSON |
| `waitForFinish` | nombre | Non | Temps d'attente initial en secondes \(0-60\) avant le début de l'interrogation |
| `itemLimit` | nombre | Non | Nombre maximum d'éléments de jeu de données à récupérer \(1-250000, par défaut 100\) |
| `timeout` | nombre | Non | Délai d'attente en secondes \(par défaut : valeur par défaut de l'acteur\) |
| `build` | chaîne | Non | Version de l'acteur à exécuter \(ex. : "latest", "beta", ou tag/numéro de build\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si l'exécution de l'acteur a réussi |
| `runId` | string | ID d'exécution APIFY |
| `status` | string | Statut d'exécution \(SUCCEEDED, FAILED, etc.\) |
| `datasetId` | string | ID du dataset contenant les résultats |
| `items` | array | Éléments du dataset \(si terminé\) |

## Notes

- Catégorie : `tools`
- Type : `apify`
```

--------------------------------------------------------------------------------

````
