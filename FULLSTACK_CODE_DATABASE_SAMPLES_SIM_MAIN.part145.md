---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 145
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 145 of 933)

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

---[FILE: workflow-variables.mdx]---
Location: sim-main/apps/docs/content/docs/es/variables/workflow-variables.mdx

```text
---
title: Variables de flujo de trabajo
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Las variables en Sim actúan como un almacén global de datos que puede ser accedido y modificado por cualquier bloque en tu flujo de trabajo, permitiéndote almacenar y compartir datos a través de tu flujo de trabajo con variables globales. Proporcionan una forma poderosa de compartir información entre diferentes partes de tu flujo de trabajo, mantener el estado y crear aplicaciones más dinámicas.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="variables.mp4" />
</div>

<Callout type="info">
  Las variables te permiten almacenar y compartir datos a través de todo tu flujo de trabajo, facilitando
  el mantenimiento del estado y la creación de sistemas complejos e interconectados.
</Callout>

## Descripción general

La función de Variables sirve como un almacén central de datos para tu flujo de trabajo, permitiéndote:

<Steps>
  <Step>
    <strong>Almacenar datos globales</strong>: Crear variables que persisten durante toda la ejecución del flujo de trabajo
  </Step>
  <Step>
    <strong>Compartir información entre bloques</strong>: Acceder a los mismos datos desde cualquier bloque en tu
    flujo de trabajo
  </Step>
  <Step>
    <strong>Mantener el estado del flujo de trabajo</strong>: Realizar un seguimiento de valores importantes mientras se ejecuta tu flujo de trabajo
  </Step>
  <Step>
    <strong>Crear flujos de trabajo dinámicos</strong>: Construir sistemas más flexibles que pueden adaptarse según los
    valores almacenados
  </Step>
</Steps>

## Creación de variables

Puedes crear y gestionar variables desde el panel de Variables en la barra lateral. Cada variable tiene:

- **Nombre**: Un identificador único utilizado para referenciar la variable
- **Valor**: Los datos almacenados en la variable (admite varios tipos de datos)
- **Descripción** (opcional): Una nota que explica el propósito de la variable

## Acceso a variables

Se puede acceder a las variables desde cualquier bloque en tu flujo de trabajo utilizando el menú desplegable de variables. Simplemente:

1. Escribe `<` en cualquier campo de texto dentro de un bloque
2. Navega por el menú desplegable para seleccionar entre las variables disponibles
3. Selecciona la variable que quieres usar

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="variables-dropdown.mp4" />
</div>

<Callout>
  También puedes arrastrar la etiqueta de conexión a un campo para abrir el desplegable de variables y acceder a
  las variables disponibles.
</Callout>

## Tipos de variables

Las variables en Sim pueden almacenar varios tipos de datos:

<Tabs items={['Text', 'Numbers', 'Boolean', 'Objects', 'Arrays']}>
  <Tab>

    ```
    "Hello, World!"
    ```

    <p className="mt-2">Las variables de texto almacenan cadenas de caracteres. Son útiles para guardar mensajes, nombres y otros datos de texto.</p>
  </Tab>
  <Tab>

    ```
    42
    ```

    <p className="mt-2">Las variables numéricas almacenan valores numéricos que pueden usarse en cálculos o comparaciones.</p>
  </Tab>
  <Tab>

    ```
    true
    ```

    <p className="mt-2">Las variables booleanas almacenan valores verdadero/falso, perfectas para indicadores y comprobaciones de condiciones.</p>
  </Tab>
  <Tab>

    ```json
    {
      "name": "John",
      "age": 30,
      "city": "New York"
    }
    ```

    <p className="mt-2">Las variables de objeto almacenan datos estructurados con propiedades y valores.</p>
  </Tab>
  <Tab>

    ```json
    [1, 2, 3, "four", "five"]
    ```

    <p className="mt-2">Las variables de array almacenan colecciones ordenadas de elementos.</p>
  </Tab>
</Tabs>

## Uso de variables en bloques

Cuando accedes a una variable desde un bloque, puedes:

- **Leer su valor**: Utilizar el valor actual de la variable en la lógica de tu bloque
- **Modificarla**: Actualizar el valor de la variable según el procesamiento de tu bloque
- **Usarla en expresiones**: Incluir variables en expresiones y cálculos

## Ámbito de las variables

Las variables en Sim tienen ámbito global, lo que significa:

- Son accesibles desde cualquier bloque en tu flujo de trabajo
- Los cambios en las variables persisten durante toda la ejecución del flujo de trabajo
- Las variables mantienen sus valores entre ejecuciones, a menos que se restablezcan explícitamente

## Mejores prácticas

- **Usa nombres descriptivos**: Elige nombres de variables que indiquen claramente lo que representa la variable. Por ejemplo, usa `userPreferences` en lugar de `up`.
- **Documenta tus variables**: Añade descripciones a tus variables para ayudar a otros miembros del equipo a entender su propósito y uso.
- **Considera el ámbito de las variables**: Recuerda que las variables son globales y pueden ser modificadas por cualquier bloque. Diseña tu flujo de trabajo teniendo esto en cuenta para evitar comportamientos inesperados.
- **Inicializa las variables temprano**: Configura e inicializa tus variables al principio de tu flujo de trabajo para asegurarte de que estén disponibles cuando se necesiten.
- **Maneja variables ausentes**: Siempre considera el caso en que una variable podría no existir todavía o podría tener un valor inesperado. Añade la validación apropiada en tus bloques.
- **Limita la cantidad de variables**: Mantén el número de variables manejable. Demasiadas variables pueden hacer que tu flujo de trabajo sea difícil de entender y mantener.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/fr/index.mdx

```text
---
title: Documentation
---

import { Card, Cards } from 'fumadocs-ui/components/card'

# Documentation Sim

Bienvenue sur Sim, un constructeur visuel de flux de travail pour les applications d'IA. Créez de puissants agents d'IA, des flux d'automatisation et des pipelines de traitement de données en connectant des blocs sur un canevas.

## Démarrage rapide

<Cards>
  <Card title="Introduction" href="/introduction">
    Découvrez ce que vous pouvez construire avec Sim
  </Card>
  <Card title="Premiers pas" href="/getting-started">
    Créez votre premier flux de travail en 10 minutes
  </Card>
  <Card title="Blocs de flux de travail" href="/blocks">
    Découvrez les éléments constitutifs
  </Card>
  <Card title="Outils et intégrations" href="/tools">
    Explorez plus de 80 intégrations intégrées
  </Card>
</Cards>

## Concepts fondamentaux

<Cards>
  <Card title="Connexions" href="/connections">
    Comprendre comment les données circulent entre les blocs
  </Card>
  <Card title="Variables" href="/variables">
    Travailler avec les variables de flux de travail et d'environnement
  </Card>
  <Card title="Exécution" href="/execution">
    Surveiller les exécutions de flux de travail et gérer les coûts
  </Card>
  <Card title="Déclencheurs" href="/triggers">
    Démarrer des flux de travail via API, webhooks ou planifications
  </Card>
</Cards>

## Fonctionnalités avancées

<Cards>
  <Card title="Gestion d'équipe" href="/permissions/roles-and-permissions">
    Configurez les rôles et les permissions de l'espace de travail
  </Card>
  <Card title="Intégration MCP" href="/mcp">
    Connectez des services externes avec le protocole de contexte de modèle
  </Card>
  <Card title="SDKs" href="/sdks">
    Intégrez Sim dans vos applications
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: agent.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/agent.mdx

```text
---
title: Agent
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Le bloc Agent connecte votre flux de travail aux grands modèles de langage (LLM). Il traite les entrées en langage naturel, appelle des outils externes et génère des sorties structurées ou non structurées.

<div className="flex justify-center">
  <Image
    src="/static/blocks/agent.png"
    alt="Configuration du bloc Agent"
    width={500}
    height={400}
    className="my-6"
  />
</div> 

## Options de configuration

### Prompt système

Le prompt système établit les paramètres opérationnels et les contraintes comportementales de l'agent. Cette configuration définit le rôle de l'agent, sa méthodologie de réponse et les limites de traitement pour toutes les requêtes entrantes.

```markdown
You are a helpful assistant that specializes in financial analysis.
Always provide clear explanations and cite sources when possible.
When responding to questions about investments, include risk disclaimers.
```

### Prompt utilisateur

Le prompt utilisateur représente les données d'entrée principales pour le traitement d'inférence. Ce paramètre accepte du texte en langage naturel ou des données structurées que l'agent analysera pour y répondre. Les sources d'entrée comprennent :

- **Configuration statique** : saisie directe de texte spécifiée dans la configuration du bloc
- **Entrée dynamique** : données transmises depuis des blocs en amont via des interfaces de connexion
- **Génération à l'exécution** : contenu généré par programmation pendant l'exécution du flux de travail

### Sélection du modèle

Le bloc Agent prend en charge plusieurs fournisseurs de LLM via une interface d'inférence unifiée. Les modèles disponibles comprennent :

- **OpenAI** : GPT-5.1, GPT-5, GPT-4o, o1, o3, o4-mini, gpt-4.1
- **Anthropic** : Claude 4.5 Sonnet, Claude Opus 4.1
- **Google** : Gemini 2.5 Pro, Gemini 2.0 Flash
- **Autres fournisseurs** : Groq, Cerebras, xAI, Azure OpenAI, OpenRouter
- **Modèles locaux** : modèles compatibles avec Ollama ou VLLM

### Température

Contrôle l'aléatoire et la créativité des réponses :

- **Basse (0-0,3)** : déterministe et ciblée. Idéale pour les tâches factuelles et la précision.
- **Moyenne (0,3-0,7)** : équilibre entre créativité et concentration. Adaptée à un usage général.
- **Élevée (0,7-2,0)** : créative et variée. Idéale pour le brainstorming et la génération de contenu.

### Clé API

Votre clé API pour le fournisseur LLM sélectionné. Elle est stockée en toute sécurité et utilisée pour l'authentification.

### Outils

Étendez les capacités de l'agent avec des intégrations externes. Sélectionnez parmi plus de 60 outils préconçus ou définissez des fonctions personnalisées.

**Catégories disponibles :**
- **Communication** : Gmail, Slack, Telegram, WhatsApp, Microsoft Teams
- **Sources de données** : Notion, Google Sheets, Airtable, Supabase, Pinecone
- **Services web** : Firecrawl, Google Search, Exa AI, automatisation de navigateur
- **Développement** : GitHub, Jira, Linear
- **Services IA** : OpenAI, Perplexity, Hugging Face, ElevenLabs

**Modes d'exécution :**
- **Auto** : le modèle décide quand utiliser les outils en fonction du contexte
- **Obligatoire** : l'outil doit être appelé à chaque requête
- **Aucun** : l'outil est disponible mais n'est pas suggéré au modèle

### Format de réponse

Le paramètre Format de réponse impose la génération de sorties structurées grâce à la validation par schéma JSON. Cela garantit des réponses cohérentes et lisibles par machine qui se conforment à des structures de données prédéfinies :

```json
{
  "name": "user_analysis",
  "schema": {
    "type": "object",
    "properties": {
      "sentiment": {
        "type": "string",
        "enum": ["positive", "negative", "neutral"]
      },
      "confidence": {
        "type": "number",
        "minimum": 0,
        "maximum": 1
      }
    },
    "required": ["sentiment", "confidence"]
  }
}
```

Cette configuration contraint la sortie du modèle à se conformer au schéma spécifié, empêchant les réponses en texte libre et assurant la génération de données structurées.

### Accès aux résultats

Une fois qu'un agent a terminé, vous pouvez accéder à ses sorties :

- **`<agent.content>`** : Le texte de réponse de l'agent ou les données structurées
- **`<agent.tokens>`** : Statistiques d'utilisation des tokens (prompt, complétion, total)
- **`<agent.tool_calls>`** : Détails des outils que l'agent a utilisés pendant l'exécution
- **`<agent.cost>`** : Coût estimé de l'appel API (si disponible)

## Fonctionnalités avancées

### Mémoire + Agent : historique de conversation

Utilisez un bloc `Memory` avec un `id` cohérent (par exemple, `chat`) pour conserver les messages entre les exécutions, et inclure cet historique dans le prompt de l'Agent.

- Ajoutez le message de l'utilisateur avant l'Agent
- Lisez l'historique de conversation pour le contexte
- Ajoutez la réponse de l'Agent après son exécution

Consultez la référence du bloc [`Memory`](/tools/memory) pour plus de détails.

## Sorties

- **`<agent.content>`** : Texte de réponse de l'agent
- **`<agent.tokens>`** : Statistiques d'utilisation des tokens
- **`<agent.tool_calls>`** : Détails d'exécution des outils
- **`<agent.cost>`** : Coût estimé de l'appel API

## Exemples de cas d'utilisation

**Automatisation du support client** - Traiter les demandes avec accès à la base de données et aux outils

```
API (Ticket) → Agent (Postgres, KB, Linear) → Gmail (Reply) → Memory (Save)
```

**Analyse de contenu multi-modèles** - Analyser le contenu avec différents modèles d'IA

```
Function (Process) → Agent (GPT-4o Technical) → Agent (Claude Sentiment) → Function (Report)
```

**Assistant de recherche avec outils** - Recherche avec accès web et consultation de documents

```
Input → Agent (Google Search, Notion) → Function (Compile Report)
```

## Bonnes pratiques

- **Soyez précis dans les instructions système** : Définissez clairement le rôle, le ton et les limites de l'agent. Plus vos instructions sont spécifiques, mieux l'agent pourra remplir sa mission.
- **Choisissez le bon réglage de température** : Utilisez des réglages de température plus bas (0-0,3) lorsque la précision est importante, ou augmentez la température (0,7-2,0) pour des réponses plus créatives ou variées
- **Utilisez efficacement les outils** : Intégrez des outils qui complètent l'objectif de l'agent et améliorent ses capacités. Soyez sélectif dans le choix des outils pour éviter de surcharger l'agent. Pour les tâches avec peu de chevauchement, utilisez un autre bloc Agent pour obtenir les meilleurs résultats.
```

--------------------------------------------------------------------------------

---[FILE: api.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/api.mdx

```text
---
title: API
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Le bloc API connecte votre flux de travail à des services externes via des requêtes HTTP. Il prend en charge les méthodes GET, POST, PUT, DELETE et PATCH pour interagir avec les API REST.

<div className="flex justify-center">
  <Image
    src="/static/blocks/api.png"
    alt="Bloc API"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Options de configuration

### URL

L'URL du point de terminaison pour la requête API. Cela peut être :

- Une URL statique saisie directement dans le bloc
- Une URL dynamique connectée à partir de la sortie d'un autre bloc
- Une URL avec des paramètres de chemin

### Méthode

Sélectionnez la méthode HTTP pour votre requête :

- **GET** : récupérer des données du serveur
- **POST** : envoyer des données au serveur pour créer une ressource
- **PUT** : mettre à jour une ressource existante sur le serveur
- **DELETE** : supprimer une ressource du serveur
- **PATCH** : mettre à jour partiellement une ressource existante

### Paramètres de requête

Définissez des paires clé-valeur qui seront ajoutées à l'URL en tant que paramètres de requête. Par exemple :

```
Key: apiKey
Value: your_api_key_here

Key: limit
Value: 10
```

Ceux-ci seraient ajoutés à l'URL sous la forme `?apiKey=your_api_key_here&limit=10`.

### En-têtes

Configurez les en-têtes HTTP pour votre requête. Les en-têtes courants incluent :

```
Key: Content-Type
Value: application/json

Key: Authorization
Value: Bearer your_token_here
```

### Corps de la requête

Pour les méthodes qui prennent en charge un corps de requête (POST, PUT, PATCH), vous pouvez définir les données à envoyer. Le corps peut être :

- Des données JSON saisies directement dans le bloc
- Des données connectées à partir de la sortie d'un autre bloc
- Générées dynamiquement pendant l'exécution du flux de travail

### Accès aux résultats

Une fois qu'une requête API est terminée, vous pouvez accéder à ses sorties :

- **`<api.data>`** : les données du corps de la réponse de l'API
- **`<api.status>`** : code de statut HTTP (200, 404, 500, etc.)
- **`<api.headers>`** : en-têtes de réponse du serveur
- **`<api.error>`** : détails de l'erreur si la requête a échoué

## Fonctionnalités avancées

### Construction dynamique d'URL

Construisez des URL dynamiquement en utilisant des variables provenant de blocs précédents :

```javascript
// In a Function block before the API
const userId = <start.userId>;
const apiUrl = `https://api.example.com/users/${userId}/profile`;
```

### Nouvelles tentatives de requêtes

Le bloc API gère automatiquement :
- Les délais d'attente réseau avec backoff exponentiel
- Les réponses de limite de débit (codes d'état 429)
- Les erreurs serveur (codes d'état 5xx) avec logique de nouvelle tentative
- Les échecs de connexion avec tentatives de reconnexion

### Validation des réponses

Validez les réponses API avant de les traiter :

```javascript
// In a Function block after the API
if (<api.status> === 200) {
  const data = <api.data>;
  // Process successful response
} else {
  // Handle error response
  console.error(`API Error: ${<api.status>}`);
}
```

## Sorties

- **`<api.data>`** : Données du corps de la réponse de l'API
- **`<api.status>`** : Code d'état HTTP
- **`<api.headers>`** : En-têtes de réponse
- **`<api.error>`** : Détails de l'erreur si la requête a échoué

## Exemples de cas d'utilisation

**Récupération des données de profil utilisateur** - Récupérer les informations utilisateur depuis un service externe

```
Function (Build ID) → API (GET /users/{id}) → Function (Format) → Response
```

**Traitement des paiements** - Traiter un paiement via l'API Stripe

```
Function (Validate) → API (Stripe) → Condition (Success) → Supabase (Update)
```

## Bonnes pratiques

- **Utilisez des variables d'environnement pour les données sensibles** : Ne codez pas en dur les clés API ou les identifiants
- **Gérez les erreurs avec élégance** : Connectez une logique de gestion des erreurs pour les requêtes échouées
- **Validez les réponses** : Vérifiez les codes d'état et les formats de réponse avant de traiter les données
- **Respectez les limites de débit** : Soyez attentif aux limites de débit des API et implémentez un throttling approprié
```

--------------------------------------------------------------------------------

---[FILE: condition.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/condition.mdx

```text
---
title: Condition
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Le bloc Condition permet de ramifier l'exécution du flux de travail en fonction d'expressions booléennes. Évaluez des conditions en utilisant les sorties des blocs précédents et dirigez vers différents chemins sans nécessiter un LLM.

<div className="flex justify-center">
  <Image
    src="/static/blocks/condition.png"
    alt="Bloc de condition"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Options de configuration

### Conditions

Définissez une ou plusieurs conditions qui seront évaluées. Chaque condition comprend :

- **Expression** : une expression JavaScript/TypeScript qui s'évalue à vrai ou faux
- **Chemin** : le bloc de destination vers lequel diriger si la condition est vraie
- **Description** : explication facultative de ce que vérifie la condition

Vous pouvez créer plusieurs conditions qui sont évaluées dans l'ordre, la première condition correspondante déterminant le chemin d'exécution.

### Format d'expression de condition

Les conditions utilisent la syntaxe JavaScript et peuvent référencer des valeurs d'entrée provenant des blocs précédents.

<Tabs items={['Seuil de score', 'Analyse de texte', 'Conditions multiples']}>
  <Tab>

    ```javascript
    // Check if a score is above a threshold
    <agent.score> > 75
    ```

  </Tab>
  <Tab>

    ```javascript
    // Check if a text contains specific keywords
    <agent.text>.includes('urgent') || <agent.text>.includes('emergency')
    ```

  </Tab>
  <Tab>

    ```javascript
    // Check multiple conditions
    <agent.age> >= 18 && <agent.country> === 'US'
    ```

  </Tab>
</Tabs>

### Accès aux résultats

Après l'évaluation d'une condition, vous pouvez accéder à ses sorties :

- **condition.result** : résultat booléen de l'évaluation de la condition
- **condition.matched_condition** : identifiant de la condition qui a été satisfaite
- **condition.content** : description du résultat de l'évaluation
- **condition.path** : détails de la destination de routage choisie

## Fonctionnalités avancées

### Expressions complexes

Utilisez des opérateurs et des fonctions JavaScript dans les conditions :

```javascript
// String operations
<user.email>.endsWith('@company.com')

// Array operations
<api.tags>.includes('urgent')

// Mathematical operations
<agent.confidence> * 100 > 85

// Date comparisons
new Date(<api.created_at>) > new Date('2024-01-01')
```

### Évaluation de conditions multiples

Les conditions sont évaluées dans l'ordre jusqu'à ce qu'une correspondance soit trouvée :

```javascript
// Condition 1: Check for high priority
<ticket.priority> === 'high'

// Condition 2: Check for urgent keywords
<ticket.subject>.toLowerCase().includes('urgent')

// Condition 3: Default fallback
true
```

### Gestion des erreurs

Les conditions gèrent automatiquement :
- Les valeurs non définies ou nulles avec une évaluation sécurisée
- Les incompatibilités de types avec des solutions de repli appropriées
- Les expressions invalides avec journalisation des erreurs
- Les variables manquantes avec des valeurs par défaut

## Sorties

- **`<condition.result>`** : résultat booléen de l'évaluation
- **`<condition.matched_condition>`** : identifiant de la condition satisfaite
- **`<condition.content>`** : description du résultat de l'évaluation
- **`<condition.path>`** : détails de la destination de routage choisie

## Exemples de cas d'utilisation

**Routage du support client** - Acheminer les tickets selon leur priorité

```
API (Ticket) → Condition (priority === 'high') → Agent (Escalation) or Agent (Standard)
```

**Modération de contenu** - Filtrer le contenu selon l'analyse

```
Agent (Analyze) → Condition (toxicity > 0.7) → Moderation or Publish
```

**Parcours d'intégration utilisateur** - Personnaliser l'intégration selon le type d'utilisateur

```
Function (Process) → Condition (account_type === 'enterprise') → Advanced or Simple
```

## Bonnes pratiques

- **Ordonnez correctement les conditions** : placez les conditions plus spécifiques avant les générales pour garantir que la logique spécifique prévaut sur les solutions de repli
- **Utilisez la branche else quand nécessaire** : si aucune condition ne correspond et que la branche else n'est pas connectée, la branche du workflow se terminera gracieusement. Connectez la branche else si vous avez besoin d'un chemin de repli pour les cas non correspondants
- **Gardez les expressions simples** : utilisez des expressions booléennes claires et directes pour une meilleure lisibilité et un débogage plus facile
- **Documentez vos conditions** : ajoutez des descriptions pour expliquer l'objectif de chaque condition pour une meilleure collaboration en équipe et une maintenance plus facile
- **Testez les cas limites** : vérifiez que les conditions gèrent correctement les valeurs limites en testant avec des valeurs aux extrémités de vos plages de conditions
```

--------------------------------------------------------------------------------

---[FILE: evaluator.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/evaluator.mdx

```text
---
title: Évaluateur
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Le bloc Évaluateur utilise l'IA pour noter et évaluer la qualité du contenu selon des métriques personnalisées. Parfait pour le contrôle qualité, les tests A/B et pour s'assurer que les résultats de l'IA répondent à des normes spécifiques.

<div className="flex justify-center">
  <Image
    src="/static/blocks/evaluator.png"
    alt="Configuration du bloc Évaluateur"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Options de configuration

### Métriques d'évaluation

Définissez des métriques personnalisées pour évaluer le contenu. Chaque métrique comprend :

- **Nom** : Un identifiant court pour la métrique
- **Description** : Une explication détaillée de ce que mesure la métrique
- **Échelle** : La plage numérique pour la notation (par ex., 1-5, 0-10)

Exemples de métriques :

```
Accuracy (1-5): How factually accurate is the content?
Clarity (1-5): How clear and understandable is the content?
Relevance (1-5): How relevant is the content to the original query?
```

### Contenu

Le contenu à évaluer. Celui-ci peut être :

- Fourni directement dans la configuration du bloc
- Connecté depuis la sortie d'un autre bloc (généralement un bloc Agent)
- Généré dynamiquement pendant l'exécution du workflow

### Sélection du modèle

Choisissez un modèle d'IA pour effectuer l'évaluation :

- **OpenAI** : GPT-4o, o1, o3, o4-mini, gpt-4.1
- **Anthropic** : Claude 3.7 Sonnet
- **Google** : Gemini 2.5 Pro, Gemini 2.0 Flash
- **Autres fournisseurs** : Groq, Cerebras, xAI, DeepSeek
- **Modèles locaux** : modèles compatibles avec Ollama ou VLLM

Utilisez des modèles avec de fortes capacités de raisonnement comme GPT-4o ou Claude 3.7 Sonnet pour de meilleurs résultats.

### Clé API

Votre clé API pour le fournisseur de LLM sélectionné. Elle est stockée en toute sécurité et utilisée pour l'authentification.

## Exemples de cas d'utilisation

**Évaluation de la qualité du contenu** - Évaluez le contenu avant publication

```
Agent (Generate) → Evaluator (Score) → Condition (Check threshold) → Publish or Revise
```

**Tests A/B de contenu** - Comparez plusieurs réponses générées par l'IA

```
Parallel (Variations) → Evaluator (Score Each) → Function (Select Best) → Response
```

**Contrôle qualité du service client** - Assurez-vous que les réponses respectent les normes de qualité

```
Agent (Support Response) → Evaluator (Score) → Function (Log) → Condition (Review if Low)
```

## Sorties

- **`<evaluator.content>`** : Résumé de l'évaluation avec les scores
- **`<evaluator.model>`** : Modèle utilisé pour l'évaluation
- **`<evaluator.tokens>`** : Statistiques d'utilisation des tokens
- **`<evaluator.cost>`** : Coût estimé de l'évaluation

## Bonnes pratiques

- **Utilisez des descriptions de métriques spécifiques** : définissez clairement ce que mesure chaque métrique pour obtenir des évaluations plus précises
- **Choisissez des plages appropriées** : sélectionnez des plages de notation qui offrent une granularité suffisante sans être trop complexes
- **Connectez avec des blocs Agent** : utilisez des blocs Évaluateur pour évaluer les sorties des blocs Agent et créer des boucles de rétroaction
- **Utilisez des métriques cohérentes** : pour une analyse comparative, maintenez des métriques cohérentes à travers des évaluations similaires
- **Combinez plusieurs métriques** : utilisez plusieurs métriques pour obtenir une évaluation complète
```

--------------------------------------------------------------------------------

---[FILE: function.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/function.mdx

```text
---
title: Fonction
---

import { Image } from '@/components/ui/image'

Le bloc Fonction exécute du code JavaScript ou TypeScript personnalisé dans vos flux de travail. Transformez des données, effectuez des calculs ou implémentez une logique personnalisée.

<div className="flex justify-center">
  <Image
    src="/static/blocks/function.png"
    alt="Bloc de fonction avec éditeur de code"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Sorties

- **`<function.result>`**: La valeur retournée par votre fonction
- **`<function.stdout>`**: Sortie console.log() de votre code

## Exemples de cas d'utilisation

**Pipeline de traitement de données** - Transformer une réponse d'API en données structurées

```
API (Fetch) → Function (Process & Validate) → Function (Calculate Metrics) → Response
```

**Implémentation de logique métier** - Calculer des scores et niveaux de fidélité

```
Agent (Get History) → Function (Calculate Score) → Function (Determine Tier) → Condition (Route)
```

**Validation et assainissement des données** - Valider et nettoyer les entrées utilisateur

```
Input → Function (Validate & Sanitize) → API (Save to Database)
```

### Exemple : Calculateur de score de fidélité

```javascript title="loyalty-calculator.js"
// Process customer data and calculate loyalty score
const { purchaseHistory, accountAge, supportTickets } = <agent>;

// Calculate metrics
const totalSpent = purchaseHistory.reduce((sum, purchase) => sum + purchase.amount, 0);
const purchaseFrequency = purchaseHistory.length / (accountAge / 365);
const ticketRatio = supportTickets.resolved / supportTickets.total;

// Calculate loyalty score (0-100)
const spendScore = Math.min(totalSpent / 1000 * 30, 30);
const frequencyScore = Math.min(purchaseFrequency * 20, 40);
const supportScore = ticketRatio * 30;

const loyaltyScore = Math.round(spendScore + frequencyScore + supportScore);

return {
  customer: <agent.name>,
  loyaltyScore,
  loyaltyTier: loyaltyScore >= 80 ? "Platinum" : loyaltyScore >= 60 ? "Gold" : "Silver",
  metrics: { spendScore, frequencyScore, supportScore }
};
```

## Bonnes pratiques

- **Gardez les fonctions ciblées** : Écrivez des fonctions qui font bien une seule chose pour améliorer la maintenabilité et le débogage
- **Gérez les erreurs avec élégance** : Utilisez des blocs try/catch pour gérer les erreurs potentielles et fournir des messages d'erreur significatifs
- **Testez les cas limites** : Assurez-vous que votre code gère correctement les entrées inhabituelles, les valeurs nulles et les conditions limites
- **Optimisez pour la performance** : Soyez attentif à la complexité computationnelle et à l'utilisation de la mémoire pour les grands ensembles de données
- **Utilisez console.log() pour le débogage** : Exploitez la sortie stdout pour déboguer et surveiller l'exécution des fonctions
```

--------------------------------------------------------------------------------

---[FILE: guardrails.mdx]---
Location: sim-main/apps/docs/content/docs/fr/blocks/guardrails.mdx

```text
---
title: Guardrails
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Le bloc Guardrails valide et protège vos flux de travail IA en vérifiant le contenu selon plusieurs types de validation. Assurez la qualité des données, prévenez les hallucinations, détectez les PII et imposez des exigences de format avant que le contenu ne circule dans votre flux de travail.

<div className="flex justify-center">
  <Image
    src="/static/blocks/guardrails.png"
    alt="Bloc de garde-fous"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Types de validation

### Validation JSON

Vérifie que le contenu est correctement formaté en JSON. Parfait pour s'assurer que les sorties structurées des LLM peuvent être analysées en toute sécurité.

**Cas d'utilisation :**
- Valider les réponses JSON des blocs Agent avant l'analyse
- S'assurer que les charges utiles API sont correctement formatées
- Vérifier l'intégrité des données structurées

**Sortie :**
- `passed` : `true` si JSON valide, `false` sinon
- `error` : Message d'erreur si la validation échoue (ex. : "JSON invalide : Token inattendu...")

### Validation par expression régulière

Vérifie si le contenu correspond à un modèle d'expression régulière spécifié.

**Cas d'utilisation :**
- Valider des adresses e-mail
- Vérifier les formats de numéros de téléphone
- Vérifier les URL ou identifiants personnalisés
- Imposer des modèles de texte spécifiques

**Configuration :**
- **Modèle Regex** : L'expression régulière à faire correspondre (ex. : `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` pour les e-mails)

**Sortie :**
- `passed` : `true` si le contenu correspond au modèle, `false` sinon
- `error` : Message d'erreur si la validation échoue

### Détection d'hallucination

Utilise la génération augmentée par récupération (RAG) avec notation LLM pour détecter quand le contenu généré par l'IA contredit ou n'est pas fondé sur votre base de connaissances.

**Comment ça fonctionne :**
1. Interroge votre base de connaissances pour obtenir un contexte pertinent
2. Envoie à la fois la sortie de l'IA et le contexte récupéré à un LLM
3. Le LLM attribue un score de confiance (échelle de 0 à 10)
   - **0** = Hallucination complète (totalement non fondée)
   - **10** = Entièrement fondé (complètement soutenu par la base de connaissances)
4. La validation réussit si le score ≥ seuil (par défaut : 3)

**Configuration :**
- **Base de connaissances** : Sélectionnez parmi vos bases de connaissances existantes
- **Modèle** : Choisissez le LLM pour l'évaluation (nécessite un raisonnement solide - GPT-4o, Claude 3.7 Sonnet recommandés)
- **Clé API** : Authentification pour le fournisseur LLM sélectionné (masquée automatiquement pour les modèles hébergés/Ollama ou compatibles VLLM)
- **Seuil de confiance** : Score minimum pour valider (0-10, par défaut : 3)
- **Top K** (Avancé) : Nombre de fragments de base de connaissances à récupérer (par défaut : 10)

**Sortie :**
- `passed` : `true` si le score de confiance ≥ seuil
- `score` : Score de confiance (0-10)
- `reasoning` : Explication du LLM pour le score
- `error` : Message d'erreur si la validation échoue

**Cas d'utilisation :**
- Valider les réponses de l'agent par rapport à la documentation
- Garantir que les réponses du service client sont factuellement exactes
- Vérifier que le contenu généré correspond au matériel source
- Contrôle qualité pour les applications RAG

### Détection des PII

Détecte les informations personnelles identifiables à l'aide de Microsoft Presidio. Prend en charge plus de 40 types d'entités dans plusieurs pays et langues.

<div className="flex justify-center">
  <Image
    src="/static/blocks/guardrails-2.png"
    alt="Configuration de détection PII"
    width={700}
    height={450}
    className="my-6"
  />
</div>

**Comment ça fonctionne :**
1. Transmettre le contenu à valider (par ex., `<agent1.content>`)
2. Sélectionner les types de PII à détecter à l'aide du sélecteur modal
3. Choisir le mode de détection (Détecter ou Masquer)
4. Le contenu est analysé pour détecter les entités PII correspondantes
5. Renvoie les résultats de détection et éventuellement le texte masqué

<div className="mx-auto w-3/5 overflow-hidden rounded-lg">
  <Video src="guardrails.mp4" width={500} height={350} />
</div>

**Configuration :**
- **Types de PII à détecter** : Sélection parmi des catégories groupées via le sélecteur modal
  - **Commun** : Nom de personne, e-mail, téléphone, carte de crédit, adresse IP, etc.
  - **USA** : SSN, permis de conduire, passeport, etc.
  - **Royaume-Uni** : Numéro NHS, numéro d'assurance nationale
  - **Espagne** : NIF, NIE, CIF
  - **Italie** : Code fiscal, permis de conduire, code TVA
  - **Pologne** : PESEL, NIP, REGON
  - **Singapour** : NRIC/FIN, UEN
  - **Australie** : ABN, ACN, TFN, Medicare
  - **Inde** : Aadhaar, PAN, passeport, numéro d'électeur
- **Mode** : 
  - **Détecter** : Identifier uniquement les PII (par défaut)
  - **Masquer** : Remplacer les PII détectées par des valeurs masquées
- **Langue** : Langue de détection (par défaut : anglais)

**Sortie :**
- `passed` : `false` si des types de PII sélectionnés sont détectés
- `detectedEntities` : Tableau des PII détectées avec type, emplacement et confiance
- `maskedText` : Contenu avec PII masquées (uniquement si mode = "Mask")
- `error` : Message d'erreur si la validation échoue

**Cas d'utilisation :**
- Bloquer le contenu contenant des informations personnelles sensibles
- Masquer les PII avant de journaliser ou stocker des données
- Conformité avec le RGPD, HIPAA et autres réglementations sur la confidentialité
- Assainir les entrées utilisateur avant traitement

## Configuration

### Contenu à valider

Le contenu d'entrée à valider. Celui-ci provient généralement de :
- Sorties de blocs d'agent : `<agent.content>`
- Résultats de blocs de fonction : `<function.output>`
- Réponses d'API : `<api.output>`
- Toute autre sortie de bloc

### Type de validation

Choisissez parmi quatre types de validation :
- **JSON valide** : vérifier si le contenu est au format JSON correctement structuré
- **Correspondance Regex** : vérifier si le contenu correspond à un modèle d'expression régulière
- **Vérification d'hallucination** : valider par rapport à une base de connaissances avec notation LLM
- **Détection de PII** : détecter et éventuellement masquer les informations personnelles identifiables

## Sorties

Tous les types de validation renvoient :

- **`<guardrails.passed>`** : booléen indiquant si la validation a réussi
- **`<guardrails.validationType>`** : le type de validation effectuée
- **`<guardrails.input>`** : l'entrée originale qui a été validée
- **`<guardrails.error>`** : message d'erreur si la validation a échoué (facultatif)

Sorties supplémentaires par type :

**Vérification d'hallucination :**
- **`<guardrails.score>`** : score de confiance (0-10)
- **`<guardrails.reasoning>`** : explication du LLM

**Détection de PII :**
- **`<guardrails.detectedEntities>`** : tableau des entités PII détectées
- **`<guardrails.maskedText>`** : contenu avec PII masqué (si mode = "Mask")

## Exemples de cas d'utilisation

**Valider le JSON avant l'analyse** - S'assurer que la sortie de l'agent est un JSON valide

```
Agent (Generate) → Guardrails (Validate) → Condition (Check passed) → Function (Parse)
```

**Prévenir les hallucinations** - Valider les réponses du support client par rapport à la base de connaissances

```
Agent (Response) → Guardrails (Check KB) → Condition (Score ≥ 3) → Send or Flag
```

**Bloquer les PII dans les entrées utilisateur** - Assainir le contenu soumis par l'utilisateur

```
Input → Guardrails (Detect PII) → Condition (No PII) → Process or Reject
```

## Bonnes pratiques

- **Chaîner avec des blocs de condition** : utiliser `<guardrails.passed>` pour ramifier la logique du flux de travail en fonction des résultats de validation
- **Utiliser la validation JSON avant l'analyse** : toujours valider la structure JSON avant de tenter d'analyser les sorties LLM
- **Choisir les types de PII appropriés** : sélectionner uniquement les types d'entités PII pertinents pour votre cas d'utilisation pour de meilleures performances
- **Définir des seuils de confiance raisonnables** : pour la détection d'hallucination, ajuster le seuil en fonction de vos exigences de précision (plus élevé = plus strict)
- **Utiliser des modèles performants pour la détection d'hallucination** : GPT-4o ou Claude 3.7 Sonnet fournissent une notation de confiance plus précise
- **Masquer les PII pour la journalisation** : utiliser le mode "Mask" lorsque vous devez journaliser ou stocker du contenu qui peut contenir des PII
- **Tester les modèles regex** : valider soigneusement vos modèles d'expressions régulières avant de les déployer en production
- **Surveiller les échecs de validation** : suivre les messages `<guardrails.error>` pour identifier les problèmes de validation courants

<Callout type="info">
  La validation des guardrails se produit de manière synchrone dans votre flux de travail. Pour la détection d'hallucinations, choisissez des modèles plus rapides (comme GPT-4o-mini) si la latence est critique.
</Callout>
```

--------------------------------------------------------------------------------

````
