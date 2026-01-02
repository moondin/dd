---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 146
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 146 of 933)

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

---[FILE: human-in-the-loop.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/human-in-the-loop.mdx

```text
---
title: Intervention humaine
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Le bloc Intervention humaine met en pause l'exécution du workflow et attend l'intervention humaine avant de continuer. Utilisez-le pour ajouter des points d'approbation, recueillir des commentaires ou obtenir des informations supplémentaires à des points de décision critiques.

<div className="flex justify-center">
  <Image
    src="/static/blocks/hitl-1.png"
    alt="Configuration du bloc Intervention humaine"
    width={500}
    height={400}
    className="my-6"
  />
</div>

Lorsque l'exécution atteint ce bloc, le workflow se met en pause indéfiniment jusqu'à ce qu'un humain fournisse une contribution via le portail d'approbation, l'API ou le webhook.

<div className="flex justify-center">
  <Image
    src="/static/blocks/hitl-2.png"
    alt="Portail d'approbation de l'intervention humaine"
    width={700}
    height={500}
    className="my-6"
  />
</div>

## Options de configuration

### Sortie en pause

Définit quelles données sont affichées à l'approbateur. C'est le contexte montré dans le portail d'approbation pour les aider à prendre une décision éclairée.

Utilisez le constructeur visuel ou l'éditeur JSON pour structurer les données. Référencez les variables du workflow en utilisant la syntaxe `<blockName.output>`.

```json
{
  "customerName": "<agent1.content.name>",
  "proposedAction": "<router1.selectedPath>",
  "confidenceScore": "<evaluator1.score>",
  "generatedEmail": "<agent2.content>"
}
```

### Notification

Configure comment les approbateurs sont alertés lorsqu'une approbation est nécessaire. Les canaux pris en charge incluent :

- **Slack** - Messages vers des canaux ou DMs
- **Gmail** - Email avec lien d'approbation
- **Microsoft Teams** - Notifications de canal d'équipe
- **SMS** - Alertes textuelles via Twilio
- **Webhooks** - Systèmes de notification personnalisés

Incluez l'URL d'approbation (`<blockId.url>`) dans vos messages de notification pour que les approbateurs puissent accéder au portail.

### Entrée de reprise

Définit les champs que les approbateurs remplissent lors de leur réponse. Ces données deviennent disponibles pour les blocs en aval après la reprise du workflow.

```json
{
  "approved": {
    "type": "boolean",
    "description": "Approve or reject this request"
  },
  "comments": {
    "type": "string",
    "description": "Optional feedback or explanation"
  }
}
```

Accédez aux données de reprise dans les blocs en aval en utilisant `<blockId.resumeInput.fieldName>`. 

## Méthodes d'approbation

<Tabs items={['Portail d\'approbation', 'API', 'Webhook']}>
  <Tab>
    ### Portail d'approbation
    
    Chaque bloc génère une URL de portail unique (`<blockId.url>`) avec une interface visuelle affichant toutes les données de sortie en pause et des champs de formulaire pour la saisie de reprise. Responsive pour mobile et sécurisé.
    
    Partagez cette URL dans les notifications pour que les approbateurs puissent examiner et répondre.
  </Tab>
  <Tab>
    ### API REST
    
    Reprenez les workflows par programmation :
    

    ```bash
    POST /api/workflows/{workflowId}/executions/{executionId}/resume/{blockId}
    
    {
      "approved": true,
      "comments": "Looks good to proceed"
    }
    ```

    
    Créez des interfaces d'approbation personnalisées ou intégrez-les aux systèmes existants.
  </Tab>
  <Tab>
    ### Webhook
    
    Ajoutez un outil webhook à la section Notification pour envoyer des demandes d'approbation à des systèmes externes. Intégrez avec des systèmes de tickets comme Jira ou ServiceNow.
  </Tab>
</Tabs>

## Cas d'utilisation courants

**Approbation de contenu** - Vérifiez le contenu généré par l'IA avant publication

```
Agent → Human in the Loop → API (Publish)
```

**Approbations multi-étapes** - Enchaînez plusieurs étapes d'approbation pour les décisions à enjeux élevés

```
Agent → Human in the Loop (Manager) → Human in the Loop (Director) → Execute
```

**Validation des données** - Vérifiez les données extraites avant traitement

```
Agent (Extract) → Human in the Loop (Validate) → Function (Process)
```

**Contrôle qualité** - Examinez les sorties de l'IA avant de les envoyer aux clients

```
Agent (Generate) → Human in the Loop (QA) → Gmail (Send)
```

## Sorties du bloc

**`url`** - URL unique pour le portail d'approbation  
**`resumeInput.*`** - Tous les champs définis dans Reprise de saisie deviennent disponibles après la reprise du workflow

Accédez-y en utilisant `<blockId.resumeInput.fieldName>`.

## Exemple

**Sortie en pause :**

```json
{
  "title": "<agent1.content.title>",
  "body": "<agent1.content.body>",
  "qualityScore": "<evaluator1.score>"
}
```

**Reprise de saisie :**

```json
{
  "approved": { "type": "boolean" },
  "feedback": { "type": "string" }
}
```

**Utilisation en aval :**

```javascript
// Condition block
<approval1.resumeInput.approved> === true
```

L'exemple ci-dessous montre un portail d'approbation tel que vu par un approbateur après la mise en pause du workflow. Les approbateurs peuvent examiner les données et fournir des entrées dans le cadre de la reprise du workflow. Le portail d'approbation peut être accédé directement via l'URL unique, `<blockId.url>`.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="hitl-resume.mp4" width={700} height={450} />
</div>

## Blocs associés

- **[Condition](/blocks/condition)** - Branchement basé sur les décisions d'approbation
- **[Variables](/blocks/variables)** - Stockage de l'historique d'approbation et des métadonnées
- **[Response](/blocks/response)** - Retour des résultats du workflow aux appelants API
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/index.mdx

```text
---
title: Aperçu
description: Les composants de construction de vos flux de travail IA
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Les blocs sont les composants de construction que vous connectez pour créer des flux de travail d'IA. Considérez-les comme des modules spécialisés qui gèrent chacun une tâche spécifique — du dialogue avec des modèles d'IA aux appels API ou au traitement de données.

<div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
  <Video src="connections.mp4" width={700} height={450} />
</div>

## Types de blocs principaux

Sim fournit des types de blocs essentiels qui gèrent les fonctions principales des flux de travail IA :

### Blocs de traitement
- **[Agent](/blocks/agent)** - Dialoguez avec des modèles d'IA (OpenAI, Anthropic, Google, modèles locaux)
- **[Function](/blocks/function)** - Exécutez du code JavaScript/TypeScript personnalisé
- **[API](/blocks/api)** - Connectez-vous à des services externes via des requêtes HTTP

### Blocs logiques
- **[Condition](/blocks/condition)** - Ramifiez les chemins de flux de travail selon des expressions booléennes
- **[Router](/blocks/router)** - Utilisez l'IA pour acheminer intelligemment les requêtes vers différents chemins
- **[Evaluator](/blocks/evaluator)** - Notez et évaluez la qualité du contenu à l'aide de l'IA

### Blocs de contrôle de flux
- **[Variables](/blocks/variables)** - Définir et gérer des variables à portée de workflow
- **[Attente](/blocks/wait)** - Mettre en pause l'exécution du workflow pendant un délai spécifié
- **[Intervention humaine](/blocks/human-in-the-loop)** - Mettre en pause pour approbation et retour humains avant de continuer

### Blocs de sortie
- **[Response](/blocks/response)** - Formater et renvoyer les résultats finaux de votre flux de travail

## Comment fonctionnent les blocs

Chaque bloc comporte trois composants principaux :

**Entrées** : données entrant dans le bloc depuis d'autres blocs ou saisies utilisateur
**Configuration** : paramètres qui contrôlent le comportement du bloc
**Sorties** : données produites par le bloc pour être utilisées par d'autres blocs

<Steps>
  <Step>
    <strong>Recevoir l'entrée</strong> : le bloc reçoit des données des blocs connectés ou de l'entrée utilisateur
  </Step>
  <Step>
    <strong>Traiter</strong> : le bloc traite l'entrée selon sa configuration
  </Step>
  <Step>
    <strong>Produire les résultats</strong> : le bloc génère des données de sortie pour les blocs suivants dans le flux de travail
  </Step>
</Steps>

## Connexion des blocs

Vous créez des flux de travail en connectant des blocs entre eux. La sortie d'un bloc devient l'entrée d'un autre :

- **Glisser pour connecter** : faites glisser d'un port de sortie vers un port d'entrée
- **Connexions multiples** : une sortie peut se connecter à plusieurs entrées
- **Chemins de branchement** : certains blocs peuvent acheminer vers différents chemins selon les conditions

<div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
  <Video src="connections.mp4" width={700} height={450} />
</div>

## Modèles courants

### Traitement séquentiel
Connectez les blocs en chaîne où chaque bloc traite la sortie du précédent :

```
User Input → Agent → Function → Response
```

### Branchement conditionnel
Utilisez des blocs Condition ou Router pour créer différents chemins :

```
User Input → Router → Agent A (for questions)
                   → Agent B (for commands)
```

### Contrôle qualité
Utilisez des blocs Evaluator pour évaluer et filtrer les sorties :

```
Agent → Evaluator → Condition → Response (if good)
                              → Agent (retry if bad)
```

## Configuration des blocs

Chaque type de bloc possède des options de configuration spécifiques :

**Tous les blocs** :
- Connexions d'entrée/sortie
- Comportement de gestion des erreurs
- Paramètres de délai d'exécution

**Blocs IA** (Agent, Routeur, Évaluateur) :
- Sélection du modèle (OpenAI, Anthropic, Google, local)
- Clés API et authentification
- Température et autres paramètres du modèle
- Instructions et prompts système

**Blocs logiques** (Condition, Fonction) :
- Expressions ou code personnalisés
- Références de variables
- Paramètres d'environnement d'exécution

**Blocs d'intégration** (API, Réponse) :
- Configuration du point de terminaison
- En-têtes et authentification
- Formatage des requêtes/réponses

<Cards>
  <Card title="Bloc Agent" href="/blocks/agent">
    Se connecter aux modèles d'IA et créer des réponses intelligentes
  </Card>
  <Card title="Bloc Fonction" href="/blocks/function">
    Exécuter du code personnalisé pour traiter et transformer des données
  </Card>
  <Card title="Bloc API" href="/blocks/api">
    S'intégrer avec des services externes et des API
  </Card>
  <Card title="Bloc Condition" href="/blocks/condition">
    Créer une logique de branchement basée sur l'évaluation des données
  </Card>
  <Card title="Bloc Intervention humaine" href="/blocks/human-in-the-loop">
    Mettre en pause pour approbation et retour humains avant de continuer
  </Card>
  <Card title="Bloc Variables" href="/blocks/variables">
    Définir et gérer des variables à portée de workflow
  </Card>
  <Card title="Bloc Attente" href="/blocks/wait">
    Mettre en pause l'exécution du workflow pendant des délais spécifiés
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: loop.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/loop.mdx

```text
---
title: Loop
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Le bloc Boucle est un conteneur qui exécute des blocs de façon répétée. Itérez sur des collections, répétez des opérations un nombre fixe de fois, ou continuez tant qu'une condition est remplie.

<Callout type="info">
  Les blocs de boucle sont des nœuds conteneurs qui contiennent d'autres blocs. Les blocs contenus s'exécutent plusieurs fois selon votre configuration.
</Callout>

## Options de configuration

### Type de boucle

Choisissez entre quatre types de boucles :

<Tabs items={['Boucle For', 'Boucle ForEach', 'Boucle While', 'Boucle Do-While']}>
  <Tab>
    **Boucle For (Itérations)** - Une boucle numérique qui s'exécute un nombre fixe de fois :
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-1.png"
        alt="Boucle For avec itérations"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Utilisez cette option lorsque vous devez répéter une opération un nombre spécifique de fois.
    

    ```
    Example: Run 5 times
    - Iteration 1
    - Iteration 2
    - Iteration 3
    - Iteration 4
    - Iteration 5
    ```

  </Tab>
  <Tab>
    **Boucle ForEach (Collection)** - Une boucle basée sur une collection qui itère sur chaque élément d'un tableau ou d'un objet :
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-2.png"
        alt="Boucle ForEach avec collection"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Utilisez cette option lorsque vous devez traiter une collection d'éléments.
    

    ```
    Example: Process ["apple", "banana", "orange"]
    - Iteration 1: Process "apple"
    - Iteration 2: Process "banana"
    - Iteration 3: Process "orange"
    ```

  </Tab>
  <Tab>
    **Boucle While (Basée sur une condition)** - Continue à s'exécuter tant qu'une condition est évaluée comme vraie :
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-3.png"
        alt="Boucle While avec condition"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Utilisez cette option lorsque vous devez boucler jusqu'à ce qu'une condition spécifique soit remplie. La condition est vérifiée **avant** chaque itération.

    ```
    Example: While {"<variable.i>"} < 10
    - Check condition → Execute if true
    - Inside loop: Increment {"<variable.i>"}
    - Inside loop: Variables assigns i = {"<variable.i>"} + 1
    - Check condition → Execute if true
    - Check condition → Exit if false
    ```

  </Tab>
  <Tab>
    **Boucle Do-While (Basée sur une condition)** - S'exécute au moins une fois, puis continue tant qu'une condition est vraie :
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-4.png"
        alt="Boucle Do-While avec condition"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Utilisez cette option lorsque vous devez exécuter au moins une fois, puis boucler jusqu'à ce qu'une condition soit remplie. La condition est vérifiée **après** chaque itération.

    ```
    Example: Do-while {"<variable.i>"} < 10
    - Execute blocks
    - Inside loop: Increment {"<variable.i>"}
    - Inside loop: Variables assigns i = {"<variable.i>"} + 1
    - Check condition → Continue if true
    - Check condition → Exit if false
    ```

  </Tab>
</Tabs>

## Comment utiliser les boucles

### Création d'une boucle

1. Faites glisser un bloc Boucle depuis la barre d'outils vers votre canevas
2. Configurez le type de boucle et les paramètres
3. Faites glisser d'autres blocs à l'intérieur du conteneur de boucle
4. Connectez les blocs selon vos besoins

### Accès aux résultats

Une fois qu'une boucle est terminée, vous pouvez accéder aux résultats agrégés :

- **loop.results** : Tableau des résultats de toutes les itérations de la boucle

## Exemples de cas d'utilisation

**Traitement des résultats d'API** - La boucle ForEach traite les enregistrements clients provenant d'une API

```javascript
// Exemple de traitement d'API avec ForEach
const customers = await api.getCustomers();
let processedCustomers = [];

forEach(customers, (customer) => {
  const processedData = processCustomerData(customer);
  processedCustomers.push(processedData);
});

return processedCustomers;
```

**Génération itérative de contenu** - La boucle For génère plusieurs variations de contenu

```javascript
// Exemple de génération de contenu avec boucle For
let contentVariations = [];

for (let i = 0; i < 3; i++) {
  const variation = generateContentVariation(baseContent, {
    creativity: i * 0.25 + 0.5,
    length: 100 + (i * 50)
  });
  contentVariations.push(variation);
}

return contentVariations;
```

**Compteur avec boucle While** - La boucle While traite des éléments avec un compteur

```javascript
// Exemple de compteur avec boucle While
let count = 0;
let results = [];

while (count < 5) {
  const result = processItem(items[count]);
  results.push(result);
  count++;
}

return results;
```

## Fonctionnalités avancées

### Limitations

<Callout type="warning">
  Les blocs conteneurs (Boucles et Parallèles) ne peuvent pas être imbriqués les uns dans les autres. Cela signifie :
  - Vous ne pouvez pas placer un bloc Boucle à l'intérieur d'un autre bloc Boucle
  - Vous ne pouvez pas placer un bloc Parallèle à l'intérieur d'un bloc Boucle
  - Vous ne pouvez pas placer un bloc conteneur à l'intérieur d'un autre bloc conteneur
  
  Si vous avez besoin d'une itération multidimensionnelle, envisagez de restructurer votre flux de travail pour utiliser des boucles séquentielles ou traiter les données par étapes.
</Callout>

<Callout type="info">
  Les boucles s'exécutent séquentiellement, pas en parallèle. Si vous avez besoin d'une exécution simultanée, utilisez plutôt le bloc Parallèle.
</Callout>

## Entrées et sorties

<Tabs items={['Configuration', 'Variables', 'Résultats']}>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>Type de boucle</strong> : Choisissez entre 'for', 'forEach', 'while' ou 'doWhile'
      </li>
      <li>
        <strong>Itérations</strong> : Nombre de fois à exécuter (boucles for)
      </li>
      <li>
        <strong>Collection</strong> : Tableau ou objet sur lequel itérer (boucles forEach)
      </li>
      <li>
        <strong>Condition</strong> : Expression booléenne à évaluer (boucles while/do-while)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>loop.currentItem</strong> : Élément en cours de traitement
      </li>
      <li>
        <strong>loop.index</strong> : Numéro d'itération actuel (base 0)
      </li>
      <li>
        <strong>loop.items</strong> : Collection complète (boucles forEach)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>loop.results</strong> : Tableau de tous les résultats d'itération
      </li>
      <li>
        <strong>Structure</strong> : Les résultats conservent l'ordre d'itération
      </li>
      <li>
        <strong>Accès</strong> : Disponible dans les blocs après la boucle
      </li>
    </ul>
  </Tab>
</Tabs>

## Bonnes pratiques

- **Définir des limites raisonnables** : Gardez un nombre d'itérations raisonnable pour éviter des temps d'exécution longs
- **Utilisez ForEach pour les collections** : Lors du traitement de tableaux ou d'objets, utilisez les boucles ForEach plutôt que les boucles For
- **Gérez les erreurs avec élégance** : Envisagez d'ajouter une gestion des erreurs à l'intérieur des boucles pour des workflows robustes
```

--------------------------------------------------------------------------------

---[FILE: parallel.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/parallel.mdx

```text
---
title: Parallel
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Le bloc Parallèle est un conteneur qui exécute plusieurs instances simultanément pour un traitement plus rapide des flux de travail. Traitez les éléments en parallèle plutôt que séquentiellement.

<Callout type="info">
  Les blocs parallèles sont des nœuds conteneurs qui exécutent leur contenu plusieurs fois simultanément, contrairement aux boucles qui s'exécutent séquentiellement.
</Callout>

## Options de configuration

### Type de parallélisation

Choisissez entre deux types d'exécution parallèle :

<Tabs items={['Basée sur un nombre', 'Basée sur une collection']}>
  <Tab>
    **Parallèle basé sur un nombre** - Exécute un nombre fixe d'instances parallèles :
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/parallel-1.png"
        alt="Exécution parallèle basée sur un nombre"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Utilisez cette option lorsque vous devez exécuter la même opération plusieurs fois simultanément.
    

    ```
    Example: Run 5 parallel instances
    - Instance 1 ┐
    - Instance 2 ├─ All execute simultaneously
    - Instance 3 │
    - Instance 4 │
    - Instance 5 ┘
    ```

  </Tab>
  <Tab>
    **Parallèle basé sur une collection** - Distribue une collection à travers des instances parallèles :
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/parallel-2.png"
        alt="Exécution parallèle basée sur une collection"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Chaque instance traite un élément de la collection simultanément.
    

    ```
    Example: Process ["task1", "task2", "task3"] in parallel
    - Instance 1: Process "task1" ┐
    - Instance 2: Process "task2" ├─ All execute simultaneously
    - Instance 3: Process "task3" ┘
    ```

  </Tab>
</Tabs>

## Comment utiliser les blocs parallèles

### Création d'un bloc parallèle

1. Faites glisser un bloc Parallèle depuis la barre d'outils sur votre canevas
2. Configurez le type de parallélisation et les paramètres
3. Faites glisser un seul bloc à l'intérieur du conteneur parallèle
4. Connectez le bloc selon vos besoins

### Accès aux résultats

Une fois qu'un bloc parallèle est terminé, vous pouvez accéder aux résultats agrégés :

- **`<parallel.results>`** : Tableau des résultats de toutes les instances parallèles

## Exemples de cas d'utilisation

**Traitement par lots d'API** - Traiter plusieurs appels API simultanément

```
Parallel (Collection) → API (Call Endpoint) → Function (Aggregate)
```

**Traitement multi-modèles d'IA** - Obtenir des réponses de plusieurs modèles d'IA simultanément

```
Parallel (["gpt-4o", "claude-3.7-sonnet", "gemini-2.5-pro"]) → Agent → Evaluator (Select Best)
```

## Fonctionnalités avancées

### Agrégation des résultats

Les résultats de toutes les instances parallèles sont automatiquement collectés :

### Cas d'utilisation courants

### Isolation des instances

Chaque instance parallèle s'exécute indépendamment :
- Portées de variables séparées
- Pas d'état partagé entre les instances
- Les échecs dans une instance n'affectent pas les autres

### Limitations

<Callout type="warning">
  Les blocs conteneurs (Boucles et Parallèles) ne peuvent pas être imbriqués les uns dans les autres. Cela signifie :
  - Vous ne pouvez pas placer un bloc de Boucle à l'intérieur d'un bloc Parallèle
  - Vous ne pouvez pas placer un autre bloc Parallèle à l'intérieur d'un bloc Parallèle
  - Vous ne pouvez pas placer un bloc conteneur à l'intérieur d'un autre bloc conteneur
</Callout>

<Callout type="info">
  Bien que l'exécution parallèle soit plus rapide, soyez attentif à :
  - Limites de taux des API lors de requêtes simultanées
  - Utilisation de la mémoire avec de grands ensembles de données
  - Maximum de 20 instances simultanées pour éviter l'épuisement des ressources
</Callout>

## Parallèle vs Boucle

Comprendre quand utiliser chacun :

| Fonctionnalité | Parallèle | Boucle |
|---------|----------|------|
| Exécution | Simultanée | Séquentielle |
| Vitesse | Plus rapide pour les opérations indépendantes | Plus lente mais ordonnée |
| Ordre | Pas d'ordre garanti | Maintient l'ordre |
| Cas d'utilisation | Opérations indépendantes | Opérations dépendantes |
| Utilisation des ressources | Plus élevée | Plus faible |

## Entrées et sorties

<Tabs items={['Configuration', 'Variables', 'Résultats']}>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>Type de parallèle</strong> : Choisissez entre 'count' ou 'collection'
      </li>
      <li>
        <strong>Count</strong> : Nombre d'instances à exécuter (basé sur le comptage)
      </li>
      <li>
        <strong>Collection</strong> : Tableau ou objet à distribuer (basé sur la collection)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>parallel.currentItem</strong> : Élément pour cette instance
      </li>
      <li>
        <strong>parallel.index</strong> : Numéro d'instance (base 0)
      </li>
      <li>
        <strong>parallel.items</strong> : Collection complète (basé sur la collection)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>parallel.results</strong> : Tableau de tous les résultats d'instance
      </li>
      <li>
        <strong>Accès</strong> : Disponible dans les blocs après le parallèle
      </li>
    </ul>
  </Tab>
</Tabs>

## Bonnes pratiques

- **Opérations indépendantes uniquement** : Assurez-vous que les opérations ne dépendent pas les unes des autres
- **Gérer les limites de taux** : Ajoutez des délais ou une limitation pour les workflows intensifs en API
- **Gestion des erreurs** : Chaque instance doit gérer ses propres erreurs avec élégance
```

--------------------------------------------------------------------------------

---[FILE: response.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/response.mdx

```text
---
title: Réponse
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Le bloc Réponse formate et envoie des réponses HTTP structurées aux appelants de l'API. Utilisez-le pour renvoyer les résultats du workflow avec les codes d'état et les en-têtes appropriés.

<div className="flex justify-center">
  <Image
    src="/static/blocks/response.png"
    alt="Configuration du bloc Réponse"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<Callout type="info">
  Les blocs Réponse sont des blocs terminaux - ils mettent fin à l'exécution du workflow et ne peuvent pas se connecter à d'autres blocs.
</Callout>

## Options de configuration

### Données de réponse

Les données de réponse constituent le contenu principal qui sera renvoyé à l'appelant de l'API. Elles doivent être formatées en JSON et peuvent inclure :

- Des valeurs statiques
- Des références dynamiques aux variables du workflow en utilisant la syntaxe `<variable.name>`
- Des objets et tableaux imbriqués
- Toute structure JSON valide

### Code d'état

Définissez le code d'état HTTP pour la réponse (par défaut 200) :

**Succès (2xx) :**
- **200** : OK - Réponse de succès standard
- **201** : Created - Ressource créée avec succès
- **204** : No Content - Succès sans corps de réponse

**Erreur client (4xx) :**
- **400** : Bad Request - Paramètres de requête invalides
- **401** : Unauthorized - Authentification requise
- **404** : Not Found - La ressource n'existe pas
- **422** : Unprocessable Entity - Erreurs de validation

**Erreur serveur (5xx) :**
- **500** : Internal Server Error - Erreur côté serveur
- **502** : Bad Gateway - Erreur de service externe
- **503** : Service Unavailable - Service temporairement indisponible

### En-têtes de réponse

Configurez des en-têtes HTTP supplémentaires à inclure dans la réponse.

Les en-têtes sont configurés sous forme de paires clé-valeur :

| Clé | Valeur |
|-----|-------|
| Content-Type | application/json |
| Cache-Control | no-cache |
| X-API-Version | 1.0 |

## Exemples de cas d'utilisation

**Réponse d'endpoint API** - Renvoyer des données structurées depuis une API de recherche

```
Agent (Search) → Function (Format & Paginate) → Response (200, JSON)
```

**Confirmation de webhook** - Accuser réception et traitement d'un webhook

```
Webhook Trigger → Function (Process) → Response (200, Confirmation)
```

**Gestion des réponses d'erreur** - Renvoyer des réponses d'erreur appropriées

```
Condition (Error Detected) → Router → Response (400/500, Error Details)
```

## Sorties

Les blocs de réponse sont terminaux - ils mettent fin à l'exécution du workflow et envoient la réponse HTTP à l'appelant de l'API. Aucune sortie n'est disponible pour les blocs en aval.

## Références de variables

Utilisez la syntaxe `<variable.name>` pour insérer dynamiquement des variables de workflow dans votre réponse :

```json
{
  "user": {
    "id": "<variable.userId>",
    "name": "<variable.userName>",
    "email": "<variable.userEmail>"
  },
  "query": "<variable.searchQuery>",
  "results": "<variable.searchResults>",
  "totalFound": "<variable.resultCount>",
  "processingTime": "<variable.executionTime>ms"
}
```

<Callout type="warning">
  Les noms de variables sont sensibles à la casse et doivent correspondre exactement aux variables disponibles dans votre workflow.
</Callout>

## Bonnes pratiques

- **Utilisez des codes d'état significatifs** : choisissez des codes d'état HTTP appropriés qui reflètent précisément le résultat du workflow
- **Structurez vos réponses de manière cohérente** : maintenez une structure JSON cohérente pour tous vos endpoints API afin d'améliorer l'expérience développeur
- **Incluez les métadonnées pertinentes** : ajoutez des horodatages et des informations de version pour faciliter le débogage et la surveillance
- **Gérez les erreurs avec élégance** : utilisez la logique conditionnelle dans votre workflow pour définir des réponses d'erreur appropriées avec des messages descriptifs
- **Validez les références de variables** : assurez-vous que toutes les variables référencées existent et contiennent les types de données attendus avant l'exécution du bloc de réponse
```

--------------------------------------------------------------------------------

---[FILE: router.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/router.mdx

```text
---
title: Routeur
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Le bloc Routeur utilise l'IA pour diriger intelligemment les flux de travail en fonction de l'analyse du contenu. Contrairement aux blocs Condition qui utilisent des règles simples, les Routeurs comprennent le contexte et l'intention.

<div className="flex justify-center">
  <Image
    src="/static/blocks/router.png"
    alt="Bloc Routeur avec chemins multiples"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Routeur vs Condition

**Utilisez le Routeur quand :**
- Une analyse de contenu basée sur l'IA est nécessaire
- Vous travaillez avec du contenu non structuré ou variable
- Un routage basé sur l'intention est requis (par ex., "acheminer les tickets d'assistance vers les départements")

**Utilisez la Condition quand :**
- Des décisions simples basées sur des règles sont suffisantes
- Vous travaillez avec des données structurées ou des comparaisons numériques
- Un routage rapide et déterministe est nécessaire

## Options de configuration

### Contenu/Prompt

Le contenu ou prompt que le Routeur analysera pour prendre des décisions de routage. Cela peut être :

- Une requête ou saisie directe de l'utilisateur
- La sortie d'un bloc précédent
- Un message généré par le système

### Blocs cibles

Les blocs de destination possibles que le Routeur peut sélectionner. Le Routeur détectera automatiquement les blocs connectés, mais vous pouvez également :

- Personnaliser les descriptions des blocs cibles pour améliorer la précision du routage
- Spécifier des critères de routage pour chaque bloc cible
- Exclure certains blocs d'être considérés comme cibles de routage

### Sélection du modèle

Choisissez un modèle d'IA pour alimenter la décision de routage :

- **OpenAI** : GPT-4o, o1, o3, o4-mini, gpt-4.1
- **Anthropic** : Claude 3.7 Sonnet
- **Google** : Gemini 2.5 Pro, Gemini 2.0 Flash
- **Autres fournisseurs** : Groq, Cerebras, xAI, DeepSeek
- **Modèles locaux** : modèles compatibles avec Ollama ou VLLM

Utilisez des modèles avec de fortes capacités de raisonnement comme GPT-4o ou Claude 3.7 Sonnet pour de meilleurs résultats.

### Clé API

Votre clé API pour le fournisseur LLM sélectionné. Elle est stockée en toute sécurité et utilisée pour l'authentification.

## Sorties

- **`<router.prompt>`** : Résumé de l'invite de routage
- **`<router.selected_path>`** : Bloc de destination choisi
- **`<router.tokens>`** : Statistiques d'utilisation des tokens
- **`<router.cost>`** : Coût estimé du routage
- **`<router.model>`** : Modèle utilisé pour la prise de décision

## Exemples de cas d'utilisation

**Triage du support client** - Acheminer les tickets vers des départements spécialisés

```
Input (Ticket) → Router → Agent (Engineering) or Agent (Finance)
```

**Classification de contenu** - Classer et acheminer le contenu généré par les utilisateurs

```
Input (Feedback) → Router → Workflow (Product) or Workflow (Technical)
```

**Qualification des prospects** - Acheminer les prospects selon les critères de qualification

```
Input (Lead) → Router → Agent (Enterprise Sales) or Workflow (Self-serve)
```

## Bonnes pratiques

- **Fournir des descriptions claires des cibles** : Aidez le Routeur à comprendre quand sélectionner chaque destination avec des descriptions spécifiques et détaillées
- **Utiliser des critères de routage spécifiques** : Définissez des conditions claires et des exemples pour chaque chemin afin d'améliorer la précision
- **Implémenter des chemins de repli** : Connectez une destination par défaut pour les cas où aucun chemin spécifique n'est approprié
- **Tester avec diverses entrées** : Assurez-vous que le Routeur gère différents types d'entrées, cas limites et contenus inattendus
- **Surveiller les performances de routage** : Examinez régulièrement les décisions de routage et affinez les critères en fonction des modèles d'utilisation réels
- **Choisir des modèles appropriés** : Utilisez des modèles avec de fortes capacités de raisonnement pour les décisions de routage complexes
```

--------------------------------------------------------------------------------

---[FILE: variables.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/variables.mdx

```text
---
title: Variables
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Image } from '@/components/ui/image'

Le bloc Variables met à jour les variables du workflow pendant l'exécution. Les variables doivent d'abord être initialisées dans la section Variables de votre workflow, puis vous pouvez utiliser ce bloc pour mettre à jour leurs valeurs pendant l'exécution de votre workflow.

<div className="flex justify-center">
  <Image
    src="/static/blocks/variables.png"
    alt="Bloc de variables"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<Callout>
  Accédez aux variables n'importe où dans votre workflow en utilisant la syntaxe `<variable.variableName>`.
</Callout>

## Comment utiliser les variables

### 1. Initialiser dans les variables du workflow

D'abord, créez vos variables dans la section Variables du workflow (accessible depuis les paramètres du workflow) :

```
customerEmail = ""
retryCount = 0
currentStatus = "pending"
```

### 2. Mettre à jour avec le bloc Variables

Utilisez le bloc Variables pour mettre à jour ces valeurs pendant l'exécution :

```
customerEmail = <api.email>
retryCount = <variable.retryCount> + 1
currentStatus = "processing"
```

### 3. Accéder n'importe où

Référencez les variables dans n'importe quel bloc :

```
Agent prompt: "Send email to <variable.customerEmail>"
Condition: <variable.retryCount> < 5
API body: {"status": "<variable.currentStatus>"}
```

## Exemples de cas d'utilisation

**Compteur de boucle et état** - Suivre la progression à travers les itérations

```
Loop → Agent (Process) → Variables (itemsProcessed + 1) → Variables (Store lastResult)
```

**Logique de nouvelle tentative** - Suivre les tentatives d'API

```
API (Try) → Variables (retryCount + 1) → Condition (retryCount < 3)
```

**Configuration dynamique** - Stocker le contexte utilisateur pour le workflow

```
API (Fetch Profile) → Variables (userId, userTier) → Agent (Personalize)
```

## Sorties

- **`<variables.assignments>`** : objet JSON avec toutes les affectations de variables de ce bloc

## Bonnes pratiques

- **Initialiser dans les paramètres du workflow** : toujours créer des variables dans la section Variables du workflow avant de les utiliser
- **Mettre à jour dynamiquement** : utiliser les blocs Variables pour mettre à jour les valeurs basées sur les sorties de blocs ou les calculs
- **Utiliser dans les boucles** : parfait pour suivre l'état à travers les itérations
- **Nommer de façon descriptive** : utiliser des noms clairs comme `currentIndex`, `totalProcessed`, ou `lastError`
```

--------------------------------------------------------------------------------

---[FILE: wait.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/wait.mdx

```text
---
title: Attente
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Image } from '@/components/ui/image'

Le bloc Attente met en pause votre flux de travail pendant une durée spécifiée avant de continuer vers le bloc suivant. Utilisez-le pour ajouter des délais entre les actions, respecter les limites de taux des API ou espacer les opérations.

<div className="flex justify-center">
  <Image
    src="/static/blocks/wait.png"
    alt="Bloc d'attente"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Configuration

### Durée d'attente

Saisissez la durée pour suspendre l'exécution :
- **Entrée** : Nombre positif
- **Maximum** : 600 secondes (10 minutes) ou 10 minutes

### Unité

Choisissez l'unité de temps :
- **Secondes** : Pour des délais courts et précis
- **Minutes** : Pour des pauses plus longues

<Callout type="info">
  Les blocs d'attente peuvent être annulés en arrêtant le workflow. La durée d'attente maximale est de 10 minutes.
</Callout>

## Sorties

- **`<wait.waitDuration>`** : La durée d'attente en millisecondes
- **`<wait.status>`** : Statut de l'attente ('waiting', 'completed', ou 'cancelled')

## Exemples de cas d'utilisation

**Limitation de débit API** - Respectez les limites de débit API entre les requêtes

```
API (Request 1) → Wait (2s) → API (Request 2)
```

**Notifications programmées** - Envoyez des messages de suivi après un délai

```
Function (Send Email) → Wait (5min) → Function (Follow-up)
```

**Délais de traitement** - Attendez que le système externe termine le traitement

```
API (Trigger Job) → Wait (30s) → API (Check Status)
```

## Bonnes pratiques

- **Gardez des attentes raisonnables** : Utilisez Wait pour des délais jusqu'à 10 minutes. Pour des délais plus longs, envisagez des workflows programmés
- **Surveillez le temps d'exécution** : N'oubliez pas que les attentes prolongent la durée totale du workflow
```

--------------------------------------------------------------------------------

````
