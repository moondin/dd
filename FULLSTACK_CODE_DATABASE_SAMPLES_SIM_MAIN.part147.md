---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 147
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 147 of 933)

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

---[FILE: workflow.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/workflow.mdx

```text
---
title: Bloc de flux de travail
description: Exécuter un autre flux de travail à l'intérieur du flux actuel
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

## Ce qu'il fait

<div className="flex justify-center my-6">
  <Image
    src="/static/blocks/workflow.png"
    alt="Configuration du bloc de flux de travail"
    width={500}
    height={400}
    className="rounded-xl border border-border shadow-sm"
  />
</div>

Déposez un bloc de flux de travail lorsque vous souhaitez appeler un flux de travail enfant dans le cadre d'un flux plus large. Le bloc exécute la dernière version déployée de ce flux de travail, attend qu'il se termine, puis continue avec le parent.

## Comment le configurer

1. **Choisissez un flux de travail** dans le menu déroulant (les auto-références sont bloquées pour éviter les boucles).
2. **Mappez les entrées** : si le flux de travail enfant a un déclencheur de formulaire d'entrée, vous verrez chaque champ et pourrez connecter les variables parentes. Les valeurs mappées sont celles que l'enfant reçoit.

<div className="flex justify-center my-6">
  <Image
    src="/static/blocks/workflow-2.png"
    alt="Exemple de mappage d'entrée du bloc de flux de travail"
    width={700}
    height={400}
    className="rounded-xl border border-border shadow-sm"
  />
</div>

3. **Sorties** : une fois que l'enfant a terminé, le bloc expose :
   - `result` – la réponse finale du flux de travail enfant
   - `success` – s'il s'est exécuté sans erreurs
   - `error` – message lorsque l'exécution échoue

## Badge de statut de déploiement

Le bloc Workflow affiche un badge de statut de déploiement pour vous aider à suivre si le flux de travail enfant est prêt à être exécuté :

- **Déployé** – Le flux de travail enfant a été déployé et est prêt à être utilisé. Le bloc exécutera la version déployée actuelle.
- **Non déployé** – Le flux de travail enfant n'a jamais été déployé. Vous devez le déployer avant que le bloc Workflow puisse l'exécuter.
- **Redéployer** – Des modifications ont été détectées dans le flux de travail enfant depuis le dernier déploiement. Cliquez sur le badge pour redéployer le flux de travail enfant avec les dernières modifications.

<Callout type="warn">
Le bloc Workflow exécute toujours la version déployée la plus récente du flux de travail enfant, pas la version de l'éditeur. Assurez-vous de redéployer après avoir apporté des modifications pour garantir que le bloc utilise la logique la plus récente.
</Callout>

## Notes d'exécution

- Les flux de travail enfants s'exécutent dans le même contexte d'espace de travail, donc les variables d'environnement et les outils sont conservés.
- Le bloc utilise le versionnement de déploiement : toute exécution par API, planification, webhook, manuelle ou par chat appelle l'instantané déployé. Redéployez l'enfant lorsque vous le modifiez.
- Si l'enfant échoue, le bloc génère une erreur, sauf si vous la gérez en aval.

<Callout>
Gardez les flux de travail enfants ciblés. Des flux petits et réutilisables facilitent leur combinaison sans créer d'imbrication profonde.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: basics.mdx]---
Location: sim-main/apps/docs/content/docs/fr/connections/basics.mdx

```text
---
title: Principes de base
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Video } from '@/components/ui/video'

## Comment fonctionnent les connexions

Les connexions sont les voies qui permettent aux données de circuler entre les blocs dans votre flux de travail. Dans Sim, les connexions définissent comment l'information passe d'un bloc à un autre, permettant ainsi le flux de données à travers votre flux de travail.

<Callout type="info">
  Chaque connexion représente une relation dirigée où les données circulent de la sortie d'un bloc source
  vers l'entrée d'un bloc de destination.
</Callout>

### Création de connexions

<Steps>
  <Step>
    <strong>Sélectionner le bloc source</strong> : Cliquez sur le port de sortie du bloc à partir duquel vous souhaitez établir la connexion
  </Step>
  <Step>
    <strong>Dessiner la connexion</strong> : Faites glisser vers le port d'entrée du bloc de destination
  </Step>
  <Step>
    <strong>Confirmer la connexion</strong> : Relâchez pour créer la connexion
  </Step>
</Steps>

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="connections-build.mp4" width={700} height={450} />
</div>

### Flux de connexion

Le flux de données à travers les connexions suit ces principes :

1. **Flux directionnel** : les données circulent toujours des sorties vers les entrées
2. **Ordre d'exécution** : les blocs s'exécutent dans l'ordre en fonction de leurs connexions
3. **Transformation des données** : les données peuvent être transformées lors de leur passage entre les blocs
4. **Chemins conditionnels** : certains blocs (comme Routeur et Condition) peuvent diriger le flux vers différents chemins

<Callout type="warning">
  La suppression d'une connexion arrêtera immédiatement le flux de données entre les blocs. Assurez-vous que c'est
  bien votre intention avant de supprimer des connexions.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: data-structure.mdx]---
Location: sim-main/apps/docs/content/docs/fr/connections/data-structure.mdx

```text
---
title: Structure de données
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

Lorsque vous connectez des blocs, comprendre la structure de données des différentes sorties de blocs est important car la structure de données de sortie du bloc source détermine quelles valeurs sont disponibles dans le bloc de destination. Chaque type de bloc produit une structure de sortie spécifique que vous pouvez référencer dans les blocs en aval.

<Callout type="info">
  Comprendre ces structures de données est essentiel pour utiliser efficacement les balises de connexion et
  accéder aux bonnes données dans vos flux de travail.
</Callout>

## Structures de sortie des blocs

Différents types de blocs produisent différentes structures de sortie. Voici ce à quoi vous pouvez vous attendre de chaque type de bloc :

<Tabs items={['Sortie d\'agent', 'Sortie d\'API', 'Sortie de fonction', 'Sortie d\'évaluateur', 'Sortie de condition', 'Sortie de routeur']}>
  <Tab>

    ```json
    {
      "content": "The generated text response",
      "model": "gpt-4o",
      "tokens": {
        "prompt": 120,
        "completion": 85,
        "total": 205
      },
      "toolCalls": [...],
      "cost": [...],
      "usage": [...]
    }
    ```

    ### Champs de sortie du bloc Agent

    - **content** : Le texte principal de la réponse générée par l'agent
    - **model** : Le modèle d'IA utilisé (par exemple, "gpt-4o", "claude-3-opus")
    - **tokens** : Statistiques d'utilisation des tokens
      - **prompt** : Nombre de tokens dans la requête
      - **completion** : Nombre de tokens dans la réponse
      - **total** : Total des tokens utilisés
    - **toolCalls** : Tableau des appels d'outils effectués par l'agent (le cas échéant)
    - **cost** : Tableau des objets de coût pour chaque appel d'outil (le cas échéant)
    - **usage** : Statistiques d'utilisation des tokens pour l'ensemble de la réponse

  </Tab>
  <Tab>

    ```json
    {
      "data": "Response data",
      "status": 200,
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache"
      }
    }
    ```

    ### Champs de sortie du bloc API

    - **data** : Les données de réponse de l'API (peut être de n'importe quel type)
    - **status** : Code de statut HTTP de la réponse
    - **headers** : En-têtes HTTP renvoyés par l'API

  </Tab>
  <Tab>

    ```json
    {
      "result": "Function return value",
      "stdout": "Console output",
    }
    ```

    ### Champs de sortie du bloc Fonction

    - **result** : La valeur de retour de la fonction (peut être de n'importe quel type)
    - **stdout** : Sortie console capturée pendant l'exécution de la fonction

  </Tab>
  <Tab>

    ```json
    {
      "content": "Evaluation summary",
      "model": "gpt-5",
      "tokens": {
        "prompt": 120,
        "completion": 85,
        "total": 205
      },
      "metric1": 8.5,
      "metric2": 7.2,
      "metric3": 9.0
    }
    ```

    ### Champs de sortie du bloc d'évaluation

    - **content** : résumé de l'évaluation
    - **model** : le modèle d'IA utilisé pour l'évaluation
    - **tokens** : statistiques d'utilisation des tokens
    - **[metricName]** : score pour chaque métrique définie dans l'évaluateur (champs dynamiques)

  </Tab>
  <Tab>

    ```json
    {
      "conditionResult": true,
      "selectedPath": {
        "blockId": "2acd9007-27e8-4510-a487-73d3b825e7c1",
        "blockType": "agent",
        "blockTitle": "Follow-up Agent"
      },
      "selectedOption": "condition-1"
    }
    ```

    ### Champs de sortie du bloc de condition

    - **conditionResult** : résultat booléen de l'évaluation de la condition
    - **selectedPath** : informations sur le chemin sélectionné
      - **blockId** : ID du bloc suivant dans le chemin sélectionné
      - **blockType** : type du bloc suivant
      - **blockTitle** : titre du bloc suivant
    - **selectedOption** : ID de la condition sélectionnée

  </Tab>
  <Tab>

    ```json
    {
      "content": "Routing decision",
      "model": "gpt-4o",
      "tokens": {
        "prompt": 120,
        "completion": 85,
        "total": 205
      },
      "selectedPath": {
        "blockId": "2acd9007-27e8-4510-a487-73d3b825e7c1",
        "blockType": "agent",
        "blockTitle": "Customer Service Agent"
      }
    }
    ```

    ### Champs de sortie du bloc routeur

    - **content** : le texte de décision de routage
    - **model** : le modèle d'IA utilisé pour le routage
    - **tokens** : statistiques d'utilisation des tokens
    - **selectedPath** : informations sur le chemin sélectionné
      - **blockId** : ID du bloc de destination sélectionné
      - **blockType** : type du bloc sélectionné
      - **blockTitle** : titre du bloc sélectionné

  </Tab>
</Tabs>

## Structures de sortie personnalisées

Certains blocs peuvent produire des structures de sortie personnalisées selon leur configuration :

1. **Blocs d'agent avec format de réponse** : lors de l'utilisation d'un format de réponse dans un bloc d'agent, la structure de sortie correspondra au schéma défini plutôt qu'à la structure standard.

2. **Blocs de fonction** : le champ `result` peut contenir n'importe quelle structure de données renvoyée par votre code de fonction.

3. **Blocs API** : le champ `data` contiendra ce que l'API renvoie, ce qui peut être n'importe quelle structure JSON valide.

<Callout type="warning">
  Vérifiez toujours la structure de sortie réelle de vos blocs pendant le développement pour vous assurer que vous
  référencez les bons champs dans vos connexions.
</Callout>

## Structures de données imbriquées

De nombreuses sorties de blocs contiennent des structures de données imbriquées. Vous pouvez y accéder en utilisant la notation par points dans les balises de connexion :

```
<blockName.path.to.nested.data>
```

Par exemple :

- `<agent1.tokens.total>` - Accéder au nombre total de jetons depuis un bloc Agent
- `<api1.data.results[0].id>` - Accéder à l'ID du premier résultat d'une réponse API
- `<function1.result.calculations.total>` - Accéder à un champ imbriqué dans le résultat d'un bloc Fonction
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/fr/connections/index.mdx

```text
---
title: Aperçu
description: Connectez vos blocs les uns aux autres.
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { ConnectIcon } from '@/components/icons'
import { Video } from '@/components/ui/video'

Les connexions sont les voies qui permettent aux données de circuler entre les blocs dans votre flux de travail. Elles définissent comment l'information est transmise d'un bloc à un autre, vous permettant de créer des processus sophistiqués à plusieurs étapes.

<Callout type="info">
  Des connexions correctement configurées sont essentielles pour créer des flux de travail efficaces. Elles déterminent comment
  les données se déplacent dans votre système et comment les blocs interagissent entre eux.
</Callout>

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="connections.mp4" />
</div>

## Types de connexions

Sim prend en charge différents types de connexions qui permettent divers modèles de flux de travail :

<Cards>
  <Card title="Principes de base des connexions" href="/connections/basics">
    Apprenez comment fonctionnent les connexions et comment les créer dans vos flux de travail
  </Card>
  <Card title="Tags de connexion" href="/connections/tags">
    Comprenez comment utiliser les tags de connexion pour référencer des données entre les blocs
  </Card>
  <Card title="Structure de données" href="/connections/data-structure">
    Explorez les structures de données de sortie des différents types de blocs
  </Card>
  <Card title="Accès aux données" href="/connections/accessing-data">
    Apprenez les techniques pour accéder et manipuler les données connectées
  </Card>
  <Card title="Bonnes pratiques" href="/connections/best-practices">
    Suivez les modèles recommandés pour une gestion efficace des connexions
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: tags.mdx]---
Location: sim-main/apps/docs/content/docs/fr/connections/tags.mdx

```text
---
title: Tags
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Video } from '@/components/ui/video'

Les balises de connexion sont des représentations visuelles des données disponibles à partir des blocs connectés, offrant un moyen simple de référencer les données entre les blocs et les sorties des blocs précédents dans votre flux de travail.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="connections.mp4" />
</div>

### Que sont les balises de connexion ?

Les balises de connexion sont des éléments interactifs qui apparaissent lorsque des blocs sont connectés. Elles représentent les données qui peuvent circuler d'un bloc à un autre et vous permettent de :

- Visualiser les données disponibles des blocs sources
- Référencer des champs de données spécifiques dans les blocs de destination
- Créer des flux de données dynamiques entre les blocs

<Callout type="info">
  Les balises de connexion facilitent la visualisation des données disponibles des blocs précédents et leur utilisation dans votre
  bloc actuel sans avoir à mémoriser des structures de données complexes.
</Callout>

## Utilisation des balises de connexion

Il existe deux façons principales d'utiliser les balises de connexion dans vos flux de travail :

<div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-2">
  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
    <h3 className="mb-2 text-lg font-medium">Glisser-déposer</h3>
    <div className="text-sm text-gray-600 dark:text-gray-400">
      Cliquez sur une balise de connexion et faites-la glisser dans les champs de saisie des blocs de destination. Une liste déroulante
      apparaîtra montrant les valeurs disponibles.
    </div>
    <ol className="mt-2 list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400">
      <li>Survolez une balise de connexion pour voir les données disponibles</li>
      <li>Cliquez et faites glisser la balise vers un champ de saisie</li>
      <li>Sélectionnez le champ de données spécifique dans la liste déroulante</li>
      <li>La référence est insérée automatiquement</li>
    </ol>
  </div>

  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
    <h3 className="mb-2 text-lg font-medium">Syntaxe des chevrons</h3>
    <div className="text-sm text-gray-600 dark:text-gray-400">
      Tapez <code>&lt;&gt;</code> dans les champs de saisie pour voir une liste déroulante des valeurs de connexion disponibles
      des blocs précédents.
    </div>
    <ol className="mt-2 list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400">
      <li>Cliquez dans n'importe quel champ de saisie où vous souhaitez utiliser des données connectées</li>
      <li>
        Tapez <code>&lt;&gt;</code> pour déclencher la liste déroulante de connexion
      </li>
      <li>Parcourez et sélectionnez les données que vous souhaitez référencer</li>
      <li>Continuez à taper ou sélectionnez dans la liste déroulante pour compléter la référence</li>
    </ol>
  </div>
</div>

## Syntaxe des balises

Les balises de connexion utilisent une syntaxe simple pour référencer les données :

```
<blockName.path.to.data>
```

Où :

- `blockName` est le nom du bloc source
- `path.to.data` est le chemin vers le champ de données spécifique

Par exemple :

- `<agent1.content>` - Référence le champ de contenu d'un bloc avec l'ID "agent1"
- `<api2.data.users[0].name>` - Référence le nom du premier utilisateur dans le tableau des utilisateurs du champ de données d'un bloc avec l'ID "api2"

## Références dynamiques des balises

Les balises de connexion sont évaluées à l'exécution, ce qui signifie :

1. Elles référencent toujours les données les plus récentes
2. Elles peuvent être utilisées dans des expressions et combinées avec du texte statique
3. Elles peuvent être imbriquées dans d'autres structures de données

### Exemples

```javascript
// Reference in text
"The user's name is <userBlock.name>"

// Reference in JSON
{
  "userName": "<userBlock.name>",
  "orderTotal": <apiBlock.data.total>
}

// Reference in code
const greeting = "Hello, <userBlock.name>!";
const total = <apiBlock.data.total> * 1.1; // Add 10% tax
```

<Callout type="warning">
  Lorsque vous utilisez des balises de connexion dans des contextes numériques, assurez-vous que les données référencées sont bien des nombres
  pour éviter les problèmes de conversion de type.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/fr/copilot/index.mdx

```text
---
title: Copilot
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'
import { MessageCircle, Package, Zap, Infinity as InfinityIcon, Brain, BrainCircuit } from 'lucide-react'

Copilot est votre assistant intégré à l'éditeur qui vous aide à créer et à modifier des flux de travail avec Sim Copilot, ainsi qu'à les comprendre et à les améliorer. Il peut :

- **Expliquer** : répondre aux questions sur Sim et votre flux de travail actuel
- **Guider** : suggérer des modifications et des bonnes pratiques
- **Modifier** : apporter des changements aux blocs, connexions et paramètres lorsque vous les approuvez

<Callout type="info">
  Copilot est un service géré par Sim. Pour les déploiements auto-hébergés, générez une clé API Copilot dans l'application hébergée (sim.ai → Paramètres → Copilot)
  1. Allez sur [sim.ai](https://sim.ai) → Paramètres → Copilot et générez une clé API Copilot
  2. Définissez `COPILOT_API_KEY` dans votre environnement auto-hébergé avec cette valeur
</Callout>

## Menu contextuel (@)

Utilisez le symbole `@` pour référencer diverses ressources et donner à Copilot plus de contexte sur votre espace de travail :

<Image
  src="/static/copilot/copilot-menu.png"
  alt="Menu contextuel de Copilot montrant les options de référence disponibles"
  width={600}
  height={400}
/>

Le menu `@` donne accès à :
- **Discussions** : référencer les conversations précédentes avec Copilot
- **Tous les flux de travail** : référencer n'importe quel flux de travail dans votre espace de travail
- **Blocs de flux de travail** : référencer des blocs spécifiques des flux de travail
- **Blocs** : référencer des types de blocs et des modèles
- **Connaissances** : référencer vos documents téléchargés et votre base de connaissances
- **Documentation** : référencer la documentation de Sim
- **Modèles** : référencer des modèles de flux de travail
- **Journaux** : référencer les journaux d'exécution et les résultats

Ces informations contextuelles aident Copilot à fournir une assistance plus précise et pertinente pour votre cas d'utilisation spécifique.

## Modes

<Cards>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
        Demander
      </span>
    }
  >
    <div className="m-0 text-sm">
      Mode questions-réponses pour des explications, des conseils et des suggestions sans apporter de modifications à votre flux de travail.
    </div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        Agent
      </span>
    }
  >
    <div className="m-0 text-sm">
      Mode de création et de modification. Copilot propose des modifications spécifiques (ajouter des blocs, connecter des variables, ajuster des paramètres) et les applique lorsque vous les approuvez.
    </div>
  </Card>
</Cards>

<div className="flex justify-center">
  <Image
    src="/static/copilot/copilot-mode.png"
    alt="Interface de sélection du mode Copilot"
    width={600}
    height={400}
    className="my-6"
  />
</div>

## Niveaux de profondeur

<Cards>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Zap className="h-4 w-4 text-muted-foreground" />
        Rapide
      </span>
    }
  >
    <div className="m-0 text-sm">Plus rapide et moins coûteux. Idéal pour les petites modifications, les flux de travail simples et les ajustements mineurs.</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <InfinityIcon className="h-4 w-4 text-muted-foreground" />
        Auto
      </span>
    }
  >
    <div className="m-0 text-sm">Équilibre entre vitesse et raisonnement. Option par défaut recommandée pour la plupart des tâches.</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Brain className="h-4 w-4 text-muted-foreground" />
        Avancé
      </span>
    }
  >
    <div className="m-0 text-sm">Raisonnement plus poussé pour les flux de travail plus importants et les modifications complexes tout en restant performant.</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <BrainCircuit className="h-4 w-4 text-muted-foreground" />
        Behemoth
      </span>
    }
  >
    <div className="m-0 text-sm">Raisonnement maximal pour la planification approfondie, le débogage et les changements architecturaux complexes.</div>
  </Card>
</Cards>

### Interface de sélection du mode

Vous pouvez facilement basculer entre différents modes de raisonnement à l'aide du sélecteur de mode dans l'interface Copilot :

<Image
  src="/static/copilot/copilot-models.png"
  alt="Sélection du mode Copilot montrant le mode Avancé avec l'option MAX"
  width={600}
  height={300}
/>

L'interface vous permet de :
- **Sélectionner le niveau de raisonnement** : choisissez entre Rapide, Auto, Avancé ou Behemoth
- **Activer le mode MAX** : basculez pour des capacités de raisonnement maximales lorsque vous avez besoin de l'analyse la plus approfondie
- **Voir les descriptions des modes** : comprendre pour quoi chaque mode est optimisé

Choisissez votre mode en fonction de la complexité de votre tâche - utilisez Rapide pour des questions simples et Behemoth pour des changements architecturaux complexes.

## Facturation et calcul des coûts

### Comment les coûts sont calculés

L'utilisation de Copilot est facturée par token à partir du LLM sous-jacent :

- **Tokens d'entrée** : facturés au tarif de base du fournisseur (**au prix coûtant**)
- **Tokens de sortie** : facturés à **1,5×** le tarif de base de sortie du fournisseur

```javascript
copilotCost = (inputTokens × inputPrice + outputTokens × (outputPrice × 1.5)) / 1,000,000
```

| Composant | Tarif appliqué        |
|-----------|----------------------|
| Entrée    | inputPrice           |
| Sortie    | outputPrice × 1,5    |

<Callout type="warning">
  Les prix indiqués reflètent les tarifs en date du 4 septembre 2025. Consultez la documentation du fournisseur pour les tarifs actuels.
</Callout>

<Callout type="info">
  Les prix des modèles sont par million de tokens. Le calcul divise par 1 000 000 pour obtenir le coût réel. Consultez <a href="/execution/costs">la page de calcul des coûts</a> pour plus d'informations et des exemples.
</Callout>
```

--------------------------------------------------------------------------------

````
