---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 149
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 149 of 933)

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

---[FILE: logging.mdx]---
Location: sim-main/apps/docs/content/docs/fr/execution/logging.mdx

```text
---
title: Journalisation
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Sim fournit une journalisation complète pour toutes les exécutions de flux de travail, vous donnant une visibilité totale sur le fonctionnement de vos flux, les données qui les traversent et les éventuels problèmes.

## Système de journalisation

Sim propose deux interfaces de journalisation complémentaires pour s'adapter à différents flux de travail et cas d'utilisation :

### Console en temps réel

Pendant l'exécution manuelle ou par chat d'un flux de travail, les journaux apparaissent en temps réel dans le panneau Console situé à droite de l'éditeur de flux :

<div className="flex justify-center">
  <Image
    src="/static/logs/console.png"
    alt="Panneau de console en temps réel"
    width={400}
    height={300}
    className="my-6"
  />
</div>

La console affiche :
- La progression de l'exécution des blocs avec mise en évidence du bloc actif
- Les sorties en temps réel à mesure que les blocs se terminent
- Le temps d'exécution pour chaque bloc
- Les indicateurs de statut succès/erreur

### Page de journaux

Toutes les exécutions de flux de travail — qu'elles soient déclenchées manuellement, via API, Chat, Planification ou Webhook — sont enregistrées dans la page dédiée aux journaux :

<div className="flex justify-center">
  <Image
    src="/static/logs/logs.png"
    alt="Page de journaux"
    width={600}
    height={400}
    className="my-6"
  />
</div>

La page de journaux offre :
- Un filtrage complet par plage de temps, statut, type de déclencheur, dossier et flux de travail
- Une fonctionnalité de recherche dans tous les journaux
- Un mode en direct pour les mises à jour en temps réel
- Une conservation des journaux de 7 jours (extensible pour une conservation plus longue)

## Barre latérale de détails des journaux

Cliquer sur n'importe quelle entrée de journal ouvre une vue détaillée dans la barre latérale :

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-sidebar.png"
    alt="Détails de la barre latérale des journaux"
    width={600}
    height={400}
    className="my-6"
  />
</div>

### Entrée/Sortie de bloc

Visualisez le flux de données complet pour chaque bloc avec des onglets pour basculer entre :

<Tabs items={['Output', 'Input']}>
  <Tab>
    L'**onglet Sortie** montre le résultat de l'exécution du bloc :
    - Données structurées avec formatage JSON
    - Rendu Markdown pour le contenu généré par IA
    - Bouton de copie pour une extraction facile des données
  </Tab>
  
  <Tab>
    L'**onglet Entrée** affiche ce qui a été transmis au bloc :
    - Valeurs des variables résolues
    - Sorties référencées d'autres blocs
    - Variables d'environnement utilisées
    - Les clés API sont automatiquement masquées pour la sécurité
  </Tab>
</Tabs>

### Chronologie d'exécution

Pour les journaux au niveau du workflow, consultez les métriques d'exécution détaillées :
- Horodatages de début et de fin
- Durée totale du workflow
- Temps d'exécution des blocs individuels
- Identification des goulots d'étranglement de performance

## Instantanés de workflow

Pour toute exécution enregistrée, cliquez sur « Voir l'instantané » pour visualiser l'état exact du workflow au moment de l'exécution :

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-frozen-canvas.png"
    alt="Instantané de workflow"
    width={600}
    height={400}
    className="my-6"
  />
</div>

L'instantané fournit :
- Un canevas figé montrant la structure du workflow
- Les états des blocs et les connexions tels qu'ils étaient pendant l'exécution
- Cliquez sur n'importe quel bloc pour voir ses entrées et sorties
- Utile pour déboguer des workflows qui ont été modifiés depuis

<Callout type="info">
  Les instantanés de workflow ne sont disponibles que pour les exécutions postérieures à l'introduction du système de journalisation amélioré. Les anciens journaux migrés affichent un message « État enregistré non trouvé ».
</Callout>

## Conservation des journaux

- **Plan gratuit** : conservation des journaux pendant 7 jours
- **Plan Pro** : conservation des journaux pendant 30 jours
- **Plan Équipe** : conservation des journaux pendant 90 jours
- **Plan Entreprise** : périodes de conservation personnalisées disponibles

## Bonnes pratiques

### Pour le développement
- Utilisez la console en temps réel pour un retour immédiat pendant les tests
- Vérifiez les entrées et sorties des blocs pour confirmer le flux de données
- Utilisez les instantanés de workflow pour comparer les versions fonctionnelles et défectueuses

### Pour la production
- Surveillez régulièrement la page des journaux pour détecter les erreurs ou problèmes de performance
- Configurez des filtres pour vous concentrer sur des workflows ou périodes spécifiques
- Utilisez le mode en direct pendant les déploiements critiques pour observer les exécutions en temps réel

### Pour le débogage
- Vérifiez toujours la chronologie d'exécution pour identifier les blocs lents
- Comparez les entrées entre les exécutions fonctionnelles et défaillantes
- Utilisez les instantanés de workflow pour voir l'état exact lorsque des problèmes sont survenus

## Prochaines étapes

- Découvrez le [Calcul des coûts](/execution/costs) pour comprendre la tarification des workflows
- Explorez l'[API externe](/execution/api) pour un accès programmatique aux journaux
- Configurez les [Notifications](/execution/api#notifications) pour des alertes en temps réel par webhook, e-mail ou Slack
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/fr/getting-started/index.mdx

```text
---
title: Premiers pas
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import {
  AgentIcon,
  ApiIcon,
  ChartBarIcon,
  CodeIcon,
  ConditionalIcon,
  ConnectIcon,
  ExaAIIcon,
  FirecrawlIcon,
  GmailIcon,
  NotionIcon,
  PerplexityIcon,
  SlackIcon,
} from '@/components/icons'
import { Video } from '@/components/ui/video'
import { Image } from '@/components/ui/image'

Créez votre premier flux de travail IA en 10 minutes. Dans ce tutoriel, vous allez créer un agent de recherche de personnes qui utilise des outils de recherche avancés alimentés par LLM pour extraire et structurer des informations sur des individus.

<Callout type="info">
  Ce tutoriel couvre les concepts essentiels de la création de flux de travail dans Sim. Temps estimé pour compléter : 10 minutes.
</Callout>

## Ce que vous allez créer

Un agent de recherche de personnes qui :
1. Accepte les entrées utilisateur via une interface de chat
2. Recherche sur le web en utilisant des outils alimentés par l'IA (Exa et Linkup)
3. Extrait et structure les informations sur les individus
4. Renvoie des données JSON formatées avec la localisation, la profession et l'éducation

<Image
  src="/static/getting-started/started-1.png"
  alt="Exemple de premiers pas"
  width={800}
  height={500}
/>

## Tutoriel étape par étape

<Steps>
  <Step title="Créer un flux de travail et ajouter un agent IA">
    Cliquez sur **Nouveau flux de travail** dans le tableau de bord et nommez-le "Premiers pas".
    
    Chaque nouveau flux de travail inclut un **bloc Démarrage** par défaut—c'est le point d'entrée qui reçoit les entrées utilisateur. Comme nous allons déclencher ce flux de travail via le chat, aucune configuration n'est nécessaire pour le bloc Démarrage.
    
    Faites glisser un **Bloc Agent** sur le canevas depuis le panneau de gauche et configurez-le :
    - **Modèle** : Sélectionnez "OpenAI GPT-4o"
    - **Invite système** : "Vous êtes un agent de recherche de personnes. Lorsqu'on vous donne le nom d'une personne, utilisez vos outils de recherche disponibles pour trouver des informations complètes sur elle, notamment sa localisation, sa profession, son parcours éducatif et d'autres détails pertinents."
    - **Invite utilisateur** : Faites glisser la connexion depuis la sortie du bloc Démarrage vers ce champ pour connecter `<start.input>` à l'invite utilisateur
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-2.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Ajouter des outils de recherche à l'agent">
    Améliorez votre agent avec des capacités de recherche web. Cliquez sur le bloc Agent pour le sélectionner.
    
    Dans la section **Outils** :
    - Cliquez sur **Ajouter un outil**
    - Sélectionnez **Exa** et **Linkup** parmi les outils disponibles
    - Fournissez vos clés API pour les deux outils afin d'activer la recherche web et l'accès aux données
    
    <div className="mx-auto w-3/5 overflow-hidden rounded-lg">
      <Video src="getting-started/started-3.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Tester votre flux de travail">
    Testez votre flux de travail en utilisant le **panneau de chat** sur le côté droit de l'écran.
    
    Dans le panneau de chat :
    - Cliquez sur le menu déroulant et sélectionnez `agent1.content` pour voir la sortie de l'agent
    - Entrez un message test : "John est un ingénieur logiciel de San Francisco qui a étudié l'informatique à l'Université Stanford."
    - Cliquez sur **Envoyer** pour exécuter le flux de travail
    
    L'agent analysera la personne et renverra des informations structurées.
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-4.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Configurer une sortie structurée">
    Configurez votre agent pour qu'il renvoie des données JSON structurées. Cliquez sur le bloc Agent pour le sélectionner.
    
    Dans la section **Format de réponse** :
    - Cliquez sur **l'icône de baguette magique** (✨) à côté du champ de schéma
    - Entrez l'invite : "créer un schéma nommé personne, qui contient la localisation, la profession et l'éducation"
    - L'IA générera automatiquement le schéma JSON
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-5.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Tester avec une sortie structurée">
    Retournez au **panneau de chat** pour tester le format de réponse structurée.
    
    Avec le format de réponse configuré, de nouvelles options de sortie sont maintenant disponibles :
    - Cliquez sur le menu déroulant et sélectionnez l'option de sortie structurée (le schéma que vous venez de créer)
    - Entrez un message test : "Sarah est une responsable marketing de New York qui possède un MBA de Harvard Business School."
    - Cliquez sur **Envoyer** pour exécuter le flux de travail
    
    L'agent renverra désormais une sortie JSON structurée avec les informations de la personne organisées en champs de localisation, profession et éducation.
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-6.mp4" width={700} height={450} />
    </div>
  </Step>
</Steps>

## Ce que vous avez construit

Vous avez créé avec succès un flux de travail IA qui :
- ✅ Accepte les entrées utilisateur via une interface de chat
- ✅ Traite du texte non structuré à l'aide de l'IA
- ✅ Intègre des outils de recherche externes (Exa et Linkup)
- ✅ Renvoie des données JSON structurées avec des schémas générés par IA
- ✅ Démontre des tests et des itérations en temps réel
- ✅ Met en valeur la puissance du développement visuel sans code

## Concepts clés que vous avez appris

### Types de blocs utilisés

<Files>
  <File
    name="Bloc de démarrage"
    icon={<ConnectIcon className="h-4 w-4" />}
    annotation="Point d'entrée pour les données utilisateur (inclus automatiquement)"
  />
  <File
    name="Bloc Agent"
    icon={<AgentIcon className="h-4 w-4" />}
    annotation="Modèle d'IA pour le traitement et l'analyse de texte"
  />
</Files>

### Concepts fondamentaux du flux de travail

**Flux de données**  
Connectez les blocs en faisant glisser les connexions pour transmettre des données entre les étapes du flux de travail

**Interface de chat**  
Testez les flux de travail en temps réel avec le panneau de chat et sélectionnez différentes options de sortie

**Intégration d'outils**  
Étendez les capacités de l'agent en intégrant des services externes comme Exa et Linkup

**Références de variables**  
Accédez aux sorties des blocs en utilisant la syntaxe `<blockName.output>`

**Sortie structurée**  
Définissez des schémas JSON pour garantir des réponses cohérentes et formatées de l'IA

**Schémas générés par IA**  
Utilisez la baguette magique (✨) pour générer des schémas à partir de requêtes en langage naturel

**Développement itératif**  
Construisez, testez et affinez rapidement les flux de travail avec un retour immédiat

## Prochaines étapes

<Cards>
  <Card title="Explorer les blocs de flux de travail" href="/blocks">
    Découvrez les blocs API, Fonction, Condition et autres blocs de flux de travail
  </Card>
  <Card title="Parcourir les intégrations" href="/tools">
    Connectez plus de 80 services dont Gmail, Slack, Notion et plus encore
  </Card>
  <Card title="Ajouter une logique personnalisée" href="/blocks/function">
    Écrivez des fonctions personnalisées pour un traitement avancé des données
  </Card>
  <Card title="Déployer votre flux de travail" href="/execution">
    Rendez votre flux de travail accessible via API REST ou webhooks
  </Card>
</Cards>

## Ressources

**Besoin d'explications détaillées ?** Consultez la [documentation des blocs](/blocks) pour des guides complets sur chaque composant.

**À la recherche d'intégrations ?** Explorez la [documentation des outils](/tools) pour voir les plus de 80 intégrations disponibles.

**Prêt à passer en production ?** Découvrez [Exécution et déploiement](/execution) pour rendre vos flux de travail prêts pour la production.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/fr/introduction/index.mdx

```text
---
title: Introduction
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Sim est un constructeur de flux de travail visuel open-source pour créer et déployer des flux de travail d'agents IA. Concevez des systèmes d'automatisation intelligents à l'aide d'une interface sans code—connectez des modèles d'IA, des bases de données, des API et des outils professionnels via un canevas intuitif par glisser-déposer. Que vous construisiez des chatbots, automatisiez des processus métier ou orchestriez des pipelines de données complexes, Sim fournit les outils nécessaires pour donner vie à vos flux de travail IA.

<div className="flex justify-center">
  <Image
    src="/static/introduction.png"
    alt="Canevas de flux de travail visuel Sim"
    width={700}
    height={450}
    className="my-6"
  />
</div>

## Ce que vous pouvez construire

**Assistants IA & Chatbots**  
Construisez des agents conversationnels intelligents qui s'intègrent à vos outils et données. Activez des fonctionnalités comme la recherche web, la gestion de calendrier, l'automatisation des emails et l'interaction fluide avec les systèmes d'entreprise.

**Automatisation des processus métier**  
Éliminez les tâches manuelles dans toute votre organisation. Automatisez la saisie de données, générez des rapports, répondez aux demandes des clients et simplifiez les flux de création de contenu.

**Traitement & analyse de données**  
Transformez les données brutes en informations exploitables. Extrayez des informations de documents, effectuez des analyses de jeux de données, générez des rapports automatisés et synchronisez les données entre plateformes.

**Flux de travail d'intégration API**  
Orchestrez des interactions complexes entre plusieurs services. Créez des points de terminaison API unifiés, implémentez une logique métier sophistiquée et construisez des systèmes d'automatisation pilotés par événements.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/chat-workflow.mp4" width={700} height={450} />
</div>

## Comment ça fonctionne

**Éditeur visuel de flux de travail**  
Concevez des flux de travail à l'aide d'un canevas intuitif de glisser-déposer. Connectez des modèles d'IA, des bases de données, des API et des services tiers via une interface visuelle sans code qui rend la logique d'automatisation complexe facile à comprendre et à maintenir.

**Système de blocs modulaires**  
Construisez avec des composants spécialisés : blocs de traitement (agents IA, appels API, fonctions personnalisées), blocs logiques (branchements conditionnels, boucles, routeurs) et blocs de sortie (réponses, évaluateurs). Chaque bloc gère une tâche spécifique dans votre flux de travail.

**Déclencheurs d'exécution flexibles**  
Lancez des flux de travail via plusieurs canaux, notamment des interfaces de chat, des API REST, des webhooks, des tâches cron programmées ou des événements externes provenant de plateformes comme Slack et GitHub.

**Collaboration en temps réel**  
Permettez à votre équipe de construire ensemble. Plusieurs utilisateurs peuvent modifier les flux de travail simultanément avec des mises à jour en direct et des contrôles d'autorisation granulaires.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/build-workflow.mp4" width={700} height={450} />
</div>

## Intégrations

Sim fournit des intégrations natives avec plus de 80 services dans plusieurs catégories :

- **Modèles d'IA** : OpenAI, Anthropic, Google Gemini, Groq, Cerebras, modèles locaux via Ollama ou VLLM
- **Communication** : Gmail, Slack, Microsoft Teams, Telegram, WhatsApp  
- **Productivité** : Notion, Google Workspace, Airtable, Monday.com
- **Développement** : GitHub, Jira, Linear, tests automatisés de navigateur
- **Recherche et données** : Google Search, Perplexity, Firecrawl, Exa AI
- **Bases de données** : PostgreSQL, MySQL, Supabase, Pinecone, Qdrant

Pour les intégrations personnalisées, utilisez notre [support MCP (Model Context Protocol)](/mcp) pour connecter n'importe quel service ou outil externe.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/integrations-sidebar.mp4" width={700} height={450} />
</div>

## Copilot

**Posez des questions et obtenez des conseils**  
Le copilote répond aux questions sur Sim, explique vos flux de travail et propose des suggestions d'amélioration. Utilisez le symbole `@` pour référencer les flux de travail, les blocs, la documentation, les connaissances et les journaux pour une assistance contextuelle.

**Créez et modifiez des flux de travail**  
Passez en mode Agent pour permettre au copilote de proposer et d'appliquer des modifications directement sur votre canevas. Ajoutez des blocs, configurez des paramètres, connectez des variables et restructurez les flux de travail avec des commandes en langage naturel.

**Niveaux de raisonnement adaptatifs**  
Choisissez parmi les modes Rapide, Auto, Avancé ou Mastodonte selon la complexité de la tâche. Commencez par Rapide pour des questions simples, passez à Mastodonte pour des changements architecturaux complexes et un débogage approfondi.

En savoir plus sur les [capacités du copilote](/copilot) et comment maximiser la productivité avec l'assistance IA.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/copilot-workflow.mp4" width={700} height={450} />
</div>

## Options de déploiement

**Hébergé dans le cloud**  
Lancez immédiatement sur [sim.ai](https://sim.ai) avec une infrastructure entièrement gérée, une mise à l'échelle automatique et une observabilité intégrée. Concentrez-vous sur la création de flux de travail pendant que nous gérons les opérations.

**Auto-hébergé**  
Déployez sur votre propre infrastructure en utilisant Docker Compose ou Kubernetes. Gardez un contrôle total sur vos données avec la prise en charge des modèles d'IA locaux grâce à l'intégration d'Ollama.

## Prochaines étapes

Prêt à créer votre premier flux de travail IA ?

<Cards>
  <Card title="Premiers pas" href="/getting-started">
    Créez votre premier flux de travail en 10 minutes
  </Card>
  <Card title="Blocs de flux de travail" href="/blocks">
    Découvrez les éléments constitutifs
  </Card>
  <Card title="Outils et intégrations" href="/tools">
    Explorez plus de 80 intégrations intégrées
  </Card>
  <Card title="Permissions d'équipe" href="/permissions/roles-and-permissions">
    Configurez les rôles et permissions de l'espace de travail
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/fr/knowledgebase/index.mdx

```text
---
title: Aperçu
description: Téléchargez, traitez et recherchez dans vos documents grâce à la
  recherche vectorielle intelligente et au découpage
---

import { Video } from '@/components/ui/video'
import { Image } from '@/components/ui/image'

La base de connaissances vous permet de télécharger, traiter et rechercher vos documents grâce à une recherche vectorielle intelligente et au découpage en segments. Les documents de différents types sont automatiquement traités, intégrés et rendus consultables. Vos documents sont intelligemment segmentés, et vous pouvez les visualiser, les modifier et les rechercher à l'aide de requêtes en langage naturel.

## Téléchargement et traitement

Il vous suffit de télécharger vos documents pour commencer. Sim les traite automatiquement en arrière-plan, extrayant le texte, créant des embeddings et les divisant en segments consultables.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-1.mp4" width={700} height={450} />
</div>

Le système gère l'ensemble du processus de traitement pour vous :

1. **Extraction de texte** : Le contenu est extrait de vos documents à l'aide d'analyseurs spécialisés pour chaque type de fichier
2. **Segmentation intelligente** : Les documents sont divisés en segments significatifs avec une taille et un chevauchement configurables
3. **Génération d'embeddings** : Des embeddings vectoriels sont créés pour les capacités de recherche sémantique
4. **État du traitement** : Suivez la progression du traitement de vos documents

## Types de fichiers pris en charge

Sim prend en charge les fichiers PDF, Word (DOC/DOCX), texte brut (TXT), Markdown (MD), HTML, Excel (XLS/XLSX), PowerPoint (PPT/PPTX) et CSV. Les fichiers peuvent atteindre jusqu'à 100 Mo chacun, avec des performances optimales pour les fichiers de moins de 50 Mo. Vous pouvez télécharger plusieurs documents simultanément, et les fichiers PDF bénéficient d'un traitement OCR pour les documents numérisés.

## Visualisation et modification des segments

Une fois vos documents traités, vous pouvez visualiser et modifier les segments individuels. Cela vous donne un contrôle total sur l'organisation et la recherche de votre contenu.

<Image src="/static/knowledgebase/knowledgebase.png" alt="Vue des segments de document montrant le contenu traité" width={800} height={500} />

### Configuration des fragments
- **Taille par défaut des fragments** : 1 024 caractères
- **Plage configurable** : 100 à 4 000 caractères par fragment
- **Chevauchement intelligent** : 200 caractères par défaut pour préserver le contexte
- **Découpage hiérarchique** : respecte la structure du document (sections, paragraphes, phrases)

### Capacités d'édition
- **Modifier le contenu des fragments** : modifier le contenu textuel des fragments individuels
- **Ajuster les limites des fragments** : fusionner ou diviser les fragments selon les besoins
- **Ajouter des métadonnées** : enrichir les fragments avec du contexte supplémentaire
- **Opérations en masse** : gérer efficacement plusieurs fragments

## Traitement avancé des PDF

Pour les documents PDF, Sim offre des capacités de traitement améliorées :

### Support OCR
Lorsque configuré avec Azure ou [Mistral OCR](https://docs.mistral.ai/ocr/) :
- **Traitement de documents numérisés** : extraction de texte à partir de PDF basés sur des images
- **Gestion de contenu mixte** : traitement des PDF contenant à la fois du texte et des images
- **Haute précision** : les modèles d'IA avancés assurent une extraction précise du texte

## Utilisation du bloc de connaissances dans les flux de travail

Une fois vos documents traités, vous pouvez les utiliser dans vos flux de travail d'IA grâce au bloc de connaissances. Cela permet la génération augmentée par récupération (RAG), permettant à vos agents IA d'accéder et de raisonner sur le contenu de vos documents pour fournir des réponses plus précises et contextuelles.

<Image src="/static/knowledgebase/knowledgebase-2.png" alt="Utilisation du bloc de connaissances dans les flux de travail" width={800} height={500} />

### Fonctionnalités du bloc de connaissances
- **Recherche sémantique** : trouver du contenu pertinent à l'aide de requêtes en langage naturel
- **Intégration du contexte** : inclure automatiquement les fragments pertinents dans les prompts des agents
- **Récupération dynamique** : la recherche s'effectue en temps réel pendant l'exécution du flux de travail
- **Évaluation de la pertinence** : résultats classés par similarité sémantique

### Options d'intégration
- **Prompts système** : fournir du contexte à vos agents IA
- **Contexte dynamique** : rechercher et inclure des informations pertinentes pendant les conversations
- **Recherche multi-documents** : interroger l'ensemble de votre base de connaissances
- **Recherche filtrée** : combiner avec des tags pour une récupération précise du contenu

## Technologie de recherche vectorielle

Sim utilise la recherche vectorielle alimentée par [pgvector](https://github.com/pgvector/pgvector) pour comprendre le sens et le contexte de votre contenu :

### Compréhension sémantique
- **Recherche contextuelle** : trouve du contenu pertinent même lorsque les mots-clés exacts ne correspondent pas
- **Récupération basée sur les concepts** : comprend les relations entre les idées
- **Prise en charge multilingue** : fonctionne dans différentes langues
- **Reconnaissance des synonymes** : trouve des termes et concepts associés

### Capacités de recherche
- **Requêtes en langage naturel** : posez des questions en français courant
- **Recherche par similarité** : trouvez du contenu conceptuellement similaire
- **Recherche hybride** : combine la recherche vectorielle et la recherche traditionnelle par mots-clés
- **Résultats configurables** : contrôlez le nombre et le seuil de pertinence des résultats

## Gestion documentaire

### Fonctionnalités d'organisation
- **Téléchargement en masse** : téléchargez plusieurs fichiers à la fois via l'API asynchrone
- **État de traitement** : mises à jour en temps réel sur le traitement des documents
- **Recherche et filtrage** : trouvez rapidement des documents dans de grandes collections
- **Suivi des métadonnées** : capture automatique des informations de fichier et des détails de traitement

### Sécurité et confidentialité
- **Stockage sécurisé** : documents stockés avec une sécurité de niveau entreprise
- **Contrôle d'accès** : autorisations basées sur l'espace de travail
- **Isolation du traitement** : chaque espace de travail dispose d'un traitement de documents isolé
- **Conservation des données** : configurez les politiques de conservation des documents

## Premiers pas

1. **Accédez à votre base de connaissances** : accessible depuis la barre latérale de votre espace de travail
2. **Téléchargez des documents** : glissez-déposez ou sélectionnez des fichiers à télécharger
3. **Surveillez le traitement** : observez le traitement et le découpage des documents
4. **Explorez les fragments** : visualisez et modifiez le contenu traité
5. **Ajoutez aux flux de travail** : utilisez le bloc Connaissances pour l'intégrer à vos agents IA

La base de connaissances transforme vos documents statiques en une ressource intelligente et consultable que vos flux de travail IA peuvent exploiter pour des réponses plus informées et contextuelles.
```

--------------------------------------------------------------------------------

---[FILE: tags.mdx]---
Location: sim-main/apps/docs/content/docs/fr/knowledgebase/tags.mdx

```text
---
title: Étiquettes et filtrage
---

import { Video } from '@/components/ui/video'

Les étiquettes offrent un moyen puissant d'organiser vos documents et de créer un filtrage précis pour vos recherches vectorielles. En combinant le filtrage basé sur les étiquettes avec la recherche sémantique, vous pouvez récupérer exactement le contenu dont vous avez besoin dans votre base de connaissances.

## Ajouter des étiquettes aux documents

Vous pouvez ajouter des étiquettes personnalisées à n'importe quel document de votre base de connaissances pour organiser et catégoriser votre contenu afin de faciliter sa récupération.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-tag.mp4" width={700} height={450} />
</div>

### Gestion des étiquettes
- **Étiquettes personnalisées** : créez votre propre système d'étiquettes adapté à votre flux de travail
- **Plusieurs étiquettes par document** : appliquez autant d'étiquettes que nécessaire à chaque document, il y a 7 emplacements d'étiquettes disponibles par base de connaissances qui sont partagés par tous les documents de la base de connaissances
- **Organisation des étiquettes** : regroupez les documents connexes avec un étiquetage cohérent

### Bonnes pratiques d'étiquetage
- **Nommage cohérent** : utilisez des noms d'étiquettes standardisés pour tous vos documents
- **Étiquettes descriptives** : utilisez des noms d'étiquettes clairs et significatifs
- **Nettoyage régulier** : supprimez périodiquement les étiquettes inutilisées ou obsolètes

## Utilisation des étiquettes dans les blocs de connaissances

Les étiquettes deviennent puissantes lorsqu'elles sont combinées avec le bloc de connaissances dans vos flux de travail. Vous pouvez filtrer vos recherches pour cibler du contenu spécifiquement étiqueté, garantissant ainsi que vos agents IA obtiennent les informations les plus pertinentes.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-tag2.mp4" width={700} height={450} />
</div>

## Modes de recherche

Le bloc de connaissances prend en charge trois modes de recherche différents selon ce que vous fournissez :

### 1. Recherche par étiquette uniquement
Lorsque vous **fournissez uniquement des étiquettes** (sans requête de recherche) :
- **Récupération directe** : récupère tous les documents qui ont les étiquettes spécifiées
- **Pas de recherche vectorielle** : les résultats sont basés uniquement sur la correspondance des étiquettes
- **Performance rapide** : récupération rapide sans traitement sémantique
- **Correspondance exacte** : seuls les documents avec toutes les étiquettes spécifiées sont retournés

**Cas d'utilisation** : Lorsque vous avez besoin de tous les documents d'une catégorie ou d'un projet spécifique

### 2. Recherche vectorielle uniquement
Lorsque vous **fournissez uniquement une requête de recherche** (sans tags) :
- **Recherche sémantique** : Trouve du contenu basé sur le sens et le contexte
- **Base de connaissances complète** : Recherche dans tous les documents
- **Classement par pertinence** : Résultats classés par similarité sémantique
- **Langage naturel** : Utilisez des questions ou des phrases pour trouver du contenu pertinent

**Cas d'utilisation** : Lorsque vous avez besoin du contenu le plus pertinent, quelle que soit l'organisation

### 3. Filtrage par tags + Recherche vectorielle combinés
Lorsque vous **fournissez à la fois des tags et une requête de recherche** :
1. **D'abord** : Filtrage des documents pour ne conserver que ceux avec les tags spécifiés
2. **Ensuite** : Exécution de la recherche vectorielle dans ce sous-ensemble filtré
3. **Résultat** : Contenu sémantiquement pertinent uniquement à partir de vos documents tagués

**Cas d'utilisation** : Lorsque vous avez besoin de contenu pertinent d'une catégorie ou d'un projet spécifique

### Configuration de la recherche

#### Filtrage par tags
- **Tags multiples** : Utilisez plusieurs tags pour une logique OU (le document doit avoir un ou plusieurs des tags)
- **Combinaisons de tags** : Mélangez différents types de tags pour un filtrage précis
- **Sensibilité à la casse** : La correspondance des tags est insensible à la casse
- **Correspondance partielle** : Correspondance exacte du nom du tag requise

#### Paramètres de recherche vectorielle
- **Complexité de la requête** : Les questions en langage naturel fonctionnent mieux
- **Limites de résultats** : Configurez le nombre de fragments à récupérer
- **Seuil de pertinence** : Définissez des scores de similarité minimums
- **Fenêtre contextuelle** : Ajustez la taille des fragments selon votre cas d'utilisation

## Intégration avec les flux de travail

### Configuration du bloc de connaissances
1. **Sélectionner la base de connaissances** : Choisissez quelle base de connaissances rechercher
2. **Ajouter des tags** : Spécifiez les tags de filtrage (facultatif)
3. **Saisir la requête** : Ajoutez votre requête de recherche (facultatif)
4. **Configurer les résultats** : Définissez le nombre de fragments à récupérer
5. **Tester la recherche** : Prévisualisez les résultats avant de les utiliser dans le flux de travail

### Utilisation dynamique des tags
- **Tags variables** : utilisez des variables de workflow comme valeurs de tags
- **Filtrage conditionnel** : appliquez différents tags selon la logique du workflow
- **Recherche contextuelle** : ajustez les tags en fonction du contexte de la conversation
- **Filtrage multi-étapes** : affinez les recherches à travers les étapes du workflow

### Optimisation des performances
- **Filtrage efficace** : le filtrage par tags s'effectue avant la recherche vectorielle pour de meilleures performances
- **Mise en cache** : les combinaisons de tags fréquemment utilisées sont mises en cache pour plus de rapidité
- **Traitement parallèle** : plusieurs recherches par tags peuvent s'exécuter simultanément
- **Gestion des ressources** : optimisation automatique des ressources de recherche

## Premiers pas avec les tags

1. **Planifiez votre structure de tags** : décidez de conventions de nommage cohérentes
2. **Commencez à taguer** : ajoutez des tags pertinents à vos documents existants
3. **Testez les combinaisons** : expérimentez avec des combinaisons de tags et de requêtes de recherche
4. **Intégrez dans les workflows** : utilisez le bloc Knowledge avec votre stratégie de tagging
5. **Affinez avec le temps** : ajustez votre approche de tagging en fonction des résultats de recherche

Les tags transforment votre base de connaissances d'un simple stockage de documents en un système d'intelligence organisé avec précision, que vos workflows d'IA peuvent naviguer avec une précision chirurgicale.
```

--------------------------------------------------------------------------------

````
