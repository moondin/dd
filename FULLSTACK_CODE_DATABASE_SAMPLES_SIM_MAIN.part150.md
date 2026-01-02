---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 150
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 150 of 933)

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

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/fr/mcp/index.mdx

```text
---
title: MCP (Model Context Protocol)
---

import { Image } from '@/components/ui/image'
import { Callout } from 'fumadocs-ui/components/callout'

Le Model Context Protocol ([MCP](https://modelcontextprotocol.com/)) vous permet de connecter des outils et services externes en utilisant un protocole standardisé, vous permettant d'intégrer des API et des services directement dans vos flux de travail. Avec MCP, vous pouvez étendre les capacités de Sim en ajoutant des intégrations personnalisées qui fonctionnent parfaitement avec vos agents et flux de travail.

## Qu'est-ce que MCP ?

MCP est une norme ouverte qui permet aux assistants IA de se connecter de manière sécurisée à des sources de données et outils externes. Il fournit une méthode standardisée pour :

- Se connecter aux bases de données, API et systèmes de fichiers
- Accéder aux données en temps réel depuis des services externes
- Exécuter des outils et scripts personnalisés
- Maintenir un accès sécurisé et contrôlé aux ressources externes

## Configuration des serveurs MCP

Les serveurs MCP fournissent des collections d'outils que vos agents peuvent utiliser. Configurez-les dans les paramètres de l'espace de travail :

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-1.png"
    alt="Configuration du serveur MCP dans les paramètres"
    width={700}
    height={450}
    className="my-6"
  />
</div>

1. Accédez aux paramètres de votre espace de travail
2. Allez à la section **Serveurs MCP**
3. Cliquez sur **Ajouter un serveur MCP**
4. Saisissez les détails de configuration du serveur
5. Enregistrez la configuration

<Callout type="info">
Vous pouvez également configurer les serveurs MCP directement depuis la barre d'outils d'un bloc Agent pour une configuration rapide.
</Callout>

## Utilisation des outils MCP dans les agents

Une fois les serveurs MCP configurés, leurs outils deviennent disponibles dans vos blocs d'agents :

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-2.png"
    alt="Utilisation d'un outil MCP dans un bloc Agent"
    width={700}
    height={450}
    className="my-6"
  />
</div>

1. Ouvrez un bloc **Agent**
2. Dans la section **Outils**, vous verrez les outils MCP disponibles
3. Sélectionnez les outils que vous souhaitez que l'agent utilise
4. L'agent peut maintenant accéder à ces outils pendant l'exécution

## Bloc d'outil MCP autonome

Pour un contrôle plus précis, vous pouvez utiliser le bloc dédié d'outil MCP pour exécuter des outils MCP spécifiques :

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-3.png"
    alt="Bloc d'outil MCP autonome"
    width={700}
    height={450}
    className="my-6"
  />
</div>

Le bloc d'outil MCP vous permet de :
- Exécuter directement n'importe quel outil MCP configuré
- Transmettre des paramètres spécifiques à l'outil
- Utiliser la sortie de l'outil dans les étapes suivantes du flux de travail
- Enchaîner plusieurs outils MCP

### Quand utiliser l'outil MCP vs l'agent

**Utilisez l'agent avec les outils MCP quand :**
- Vous voulez que l'IA décide quels outils utiliser
- Vous avez besoin d'un raisonnement complexe sur quand et comment utiliser les outils
- Vous souhaitez une interaction en langage naturel avec les outils

**Utilisez le bloc Outil MCP quand :**
- Vous avez besoin d'une exécution déterministe d'outils
- Vous souhaitez exécuter un outil spécifique avec des paramètres connus
- Vous construisez des flux de travail structurés avec des étapes prévisibles

## Exigences en matière d'autorisations

Les fonctionnalités MCP nécessitent des autorisations spécifiques pour l'espace de travail :

| Action | Autorisation requise |
|--------|-------------------|
| Configurer les serveurs MCP dans les paramètres | **Admin** |
| Utiliser les outils MCP dans les agents | **Écriture** ou **Admin** |
| Voir les outils MCP disponibles | **Lecture**, **Écriture**, ou **Admin** |
| Exécuter des blocs d'Outil MCP | **Écriture** ou **Admin** |

## Cas d'utilisation courants

### Intégration de bases de données
Connectez-vous aux bases de données pour interroger, insérer ou mettre à jour des données dans vos flux de travail.

### Intégrations API
Accédez à des API externes et des services web qui n'ont pas d'intégrations Sim intégrées.

### Accès au système de fichiers
Lisez, écrivez et manipulez des fichiers sur des systèmes de fichiers locaux ou distants.

### Logique métier personnalisée
Exécutez des scripts ou des outils personnalisés spécifiques aux besoins de votre organisation.

### Accès aux données en temps réel
Récupérez des données en direct à partir de systèmes externes pendant l'exécution du flux de travail.

## Considérations de sécurité

- Les serveurs MCP s'exécutent avec les autorisations de l'utilisateur qui les a configurés
- Vérifiez toujours les sources des serveurs MCP avant l'installation
- Utilisez des variables d'environnement pour les données de configuration sensibles
- Examinez les capacités du serveur MCP avant d'accorder l'accès aux agents

## Dépannage

### Le serveur MCP n'apparaît pas
- Vérifiez que la configuration du serveur est correcte
- Vérifiez que vous disposez des autorisations requises
- Assurez-vous que le serveur MCP est en cours d'exécution et accessible

### Échecs d'exécution d'outils
- Vérifiez que les paramètres de l'outil sont correctement formatés
- Consultez les journaux du serveur MCP pour les messages d'erreur
- Assurez-vous que l'authentification requise est configurée

### Erreurs de permission
- Confirmez votre niveau de permission dans l'espace de travail
- Vérifiez si le serveur MCP nécessite une authentification supplémentaire
- Vérifiez que le serveur est correctement configuré pour votre espace de travail
```

--------------------------------------------------------------------------------

---[FILE: roles-and-permissions.mdx]---
Location: sim-main/apps/docs/content/docs/fr/permissions/roles-and-permissions.mdx

```text
---
title: Rôles et permissions
---

import { Video } from '@/components/ui/video'

Lorsque vous invitez des membres de l'équipe dans votre organisation ou espace de travail, vous devrez choisir le niveau d'accès à leur accorder. Ce guide explique ce que chaque niveau de permission permet aux utilisateurs de faire, vous aidant à comprendre les rôles d'équipe et l'accès fourni par chaque niveau de permission.

## Comment inviter quelqu'un à un espace de travail

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="invitations.mp4" width={700} height={450} />
</div>

## Niveaux de permission dans l'espace de travail

Lorsque vous invitez quelqu'un dans un espace de travail, vous pouvez attribuer l'un des trois niveaux de permission :

| Permission | Ce qu'ils peuvent faire |
|------------|------------------|
| **Lecture** | Voir les workflows, consulter les résultats d'exécution, mais ne peut effectuer aucune modification |
| **Écriture** | Créer et modifier des workflows, exécuter des workflows, gérer les variables d'environnement |
| **Admin** | Tout ce que le niveau Écriture peut faire, plus inviter/supprimer des utilisateurs et gérer les paramètres de l'espace de travail |

## Ce que chaque niveau de permission peut faire

Voici une répartition détaillée de ce que les utilisateurs peuvent faire avec chaque niveau de permission :

### Permission de lecture
**Parfait pour :** Les parties prenantes, observateurs ou membres d'équipe qui ont besoin de visibilité mais ne devraient pas faire de modifications

**Ce qu'ils peuvent faire :**
- Voir tous les workflows dans l'espace de travail
- Consulter les résultats d'exécution et les journaux des workflows
- Parcourir les configurations et paramètres des workflows
- Voir les variables d'environnement (mais pas les modifier)

**Ce qu'ils ne peuvent pas faire :**
- Créer, modifier ou supprimer des workflows
- Exécuter ou déployer des workflows
- Modifier les paramètres de l'espace de travail
- Inviter d'autres utilisateurs

### Permission d'écriture  
**Parfait pour :** Les développeurs, créateurs de contenu ou membres d'équipe travaillant activement sur l'automatisation

**Ce qu'ils peuvent faire :**
- Tout ce que les utilisateurs avec permission de lecture peuvent faire, plus :
- Créer, modifier et supprimer des workflows
- Exécuter et déployer des workflows
- Ajouter, modifier et supprimer des variables d'environnement de l'espace de travail
- Utiliser tous les outils et intégrations disponibles
- Collaborer en temps réel sur l'édition de workflow

**Ce qu'ils ne peuvent pas faire :**
- Inviter ou supprimer des utilisateurs de l'espace de travail
- Modifier les paramètres de l'espace de travail
- Supprimer l'espace de travail

### Permission d'administrateur
**Parfait pour :** les chefs d'équipe, les chefs de projet ou les responsables techniques qui doivent gérer l'espace de travail

**Ce qu'ils peuvent faire :**
- Tout ce que les utilisateurs avec permission d'écriture peuvent faire, plus :
- Inviter de nouveaux utilisateurs dans l'espace de travail avec n'importe quel niveau de permission
- Supprimer des utilisateurs de l'espace de travail
- Gérer les paramètres et les intégrations de l'espace de travail
- Configurer les connexions avec des outils externes
- Supprimer les flux de travail créés par d'autres utilisateurs

**Ce qu'ils ne peuvent pas faire :**
- Supprimer l'espace de travail (seul le propriétaire de l'espace de travail peut le faire)
- Retirer le propriétaire de l'espace de travail

---

## Propriétaire vs administrateur de l'espace de travail

Chaque espace de travail a un **propriétaire** (la personne qui l'a créé) ainsi qu'un nombre illimité d'**administrateurs**.

### Propriétaire de l'espace de travail
- Possède toutes les permissions d'administrateur
- Peut supprimer l'espace de travail
- Ne peut pas être retiré de l'espace de travail
- Peut transférer la propriété à un autre utilisateur

### Administrateur de l'espace de travail  
- Peut tout faire sauf supprimer l'espace de travail ou retirer le propriétaire
- Peut être retiré de l'espace de travail par le propriétaire ou d'autres administrateurs

---

## Scénarios courants

### Ajouter un nouveau développeur à votre équipe
1. **Niveau organisation** : invitez-le en tant que **membre de l'organisation**
2. **Niveau espace de travail** : donnez-lui la permission d'**écriture** pour qu'il puisse créer et modifier des flux de travail

### Ajouter un chef de projet
1. **Niveau organisation** : invitez-le en tant que **membre de l'organisation** 
2. **Niveau espace de travail** : donnez-lui la permission d'**administrateur** pour qu'il puisse gérer l'équipe et tout voir

### Ajouter une partie prenante ou un client
1. **Niveau organisation** : invitez-le en tant que **membre de l'organisation**
2. **Niveau espace de travail** : donnez-lui la permission de **lecture** pour qu'il puisse voir les progrès mais sans faire de modifications

---

## Variables d'environnement

Les utilisateurs peuvent créer deux types de variables d'environnement :

### Variables d'environnement personnelles
- Visibles uniquement par l'utilisateur individuel
- Disponibles dans tous les workflows qu'ils exécutent
- Gérées dans les paramètres utilisateur

### Variables d'environnement de l'espace de travail
- **Permission de lecture** : Peut voir les noms et valeurs des variables
- **Permission d'écriture/administrateur** : Peut ajouter, modifier et supprimer des variables
- Disponibles pour tous les membres de l'espace de travail
- Si une variable personnelle a le même nom qu'une variable d'espace de travail, la variable personnelle est prioritaire

---

## Bonnes pratiques

### Commencer avec des permissions minimales
Accordez aux utilisateurs le niveau de permission le plus bas dont ils ont besoin pour faire leur travail. Vous pourrez toujours augmenter les permissions plus tard.

### Utiliser judicieusement la structure de l'organisation
- Faites des chefs d'équipe de confiance des **administrateurs d'organisation**
- La plupart des membres de l'équipe devraient être des **membres de l'organisation**
- Réservez les permissions d'**administrateur** d'espace de travail aux personnes qui doivent gérer les utilisateurs

### Réviser régulièrement les permissions
Examinez périodiquement qui a accès à quoi, surtout lorsque les membres de l'équipe changent de rôle ou quittent l'entreprise.

### Sécurité des variables d'environnement
- Utilisez des variables d'environnement personnelles pour les clés API sensibles
- Utilisez des variables d'environnement d'espace de travail pour la configuration partagée
- Vérifiez régulièrement qui a accès aux variables sensibles

---

## Rôles dans l'organisation

Lorsque vous invitez quelqu'un dans votre organisation, vous pouvez attribuer l'un des deux rôles suivants :

### Administrateur d'organisation
**Ce qu'ils peuvent faire :**
- Inviter et retirer des membres de l'équipe de l'organisation
- Créer de nouveaux espaces de travail
- Gérer la facturation et les paramètres d'abonnement
- Accéder à tous les espaces de travail au sein de l'organisation

### Membre de l'organisation  
**Ce qu'ils peuvent faire :**
- Accéder aux espaces de travail auxquels ils ont été spécifiquement invités
- Voir la liste des membres de l'organisation
- Ne peuvent pas inviter de nouvelles personnes ou gérer les paramètres de l'organisation
```

--------------------------------------------------------------------------------

---[FILE: python.mdx]---
Location: sim-main/apps/docs/content/docs/fr/sdks/python.mdx

```text
---
title: Python
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

Le SDK Python officiel pour Sim vous permet d'exécuter des workflows de manière programmatique à partir de vos applications Python en utilisant le SDK Python officiel.

<Callout type="info">
  Le SDK Python prend en charge Python 3.8+ avec support d'exécution asynchrone, limitation automatique du débit avec backoff exponentiel, et suivi d'utilisation.
</Callout>

## Installation

Installez le SDK en utilisant pip :

```bash
pip install simstudio-sdk
```

## Démarrage rapide

Voici un exemple simple pour commencer :

```python
from simstudio import SimStudioClient

# Initialize the client
client = SimStudioClient(
    api_key="your-api-key-here",
    base_url="https://sim.ai"  # optional, defaults to https://sim.ai
)

# Execute a workflow
try:
    result = client.execute_workflow("workflow-id")
    print("Workflow executed successfully:", result)
except Exception as error:
    print("Workflow execution failed:", error)
```

## Référence de l'API

### SimStudioClient

#### Constructeur

```python
SimStudioClient(api_key: str, base_url: str = "https://sim.ai")
```

**Paramètres :**
- `api_key` (str) : Votre clé API Sim
- `base_url` (str, facultatif) : URL de base pour l'API Sim

#### Méthodes

##### execute_workflow()

Exécuter un workflow avec des données d'entrée facultatives.

```python
result = client.execute_workflow(
    "workflow-id",
    input_data={"message": "Hello, world!"},
    timeout=30.0  # 30 seconds
)
```

**Paramètres :**
- `workflow_id` (str) : L'identifiant du workflow à exécuter
- `input_data` (dict, facultatif) : Données d'entrée à transmettre au workflow
- `timeout` (float, facultatif) : Délai d'expiration en secondes (par défaut : 30.0)
- `stream` (bool, facultatif) : Activer les réponses en streaming (par défaut : False)
- `selected_outputs` (list[str], facultatif) : Sorties de blocs à diffuser au format `blockName.attribute` (par exemple, `["agent1.content"]`)
- `async_execution` (bool, facultatif) : Exécuter de manière asynchrone (par défaut : False)

**Retourne :** `WorkflowExecutionResult | AsyncExecutionResult`

Lorsque `async_execution=True`, retourne immédiatement un identifiant de tâche pour l'interrogation. Sinon, attend la fin de l'exécution.

##### get_workflow_status()

Obtenir le statut d'un workflow (statut de déploiement, etc.).

```python
status = client.get_workflow_status("workflow-id")
print("Is deployed:", status.is_deployed)
```

**Paramètres :**
- `workflow_id` (str) : L'identifiant du workflow

**Retourne :** `WorkflowStatus`

##### validate_workflow()

Valider qu'un workflow est prêt pour l'exécution.

```python
is_ready = client.validate_workflow("workflow-id")
if is_ready:
    # Workflow is deployed and ready
    pass
```

**Paramètres :**
- `workflow_id` (str) : L'identifiant du workflow

**Retourne :** `bool`

##### get_job_status()

Obtenir le statut d'une exécution de tâche asynchrone.

```python
status = client.get_job_status("task-id-from-async-execution")
print("Status:", status["status"])  # 'queued', 'processing', 'completed', 'failed'
if status["status"] == "completed":
    print("Output:", status["output"])
```

**Paramètres :**
- `task_id` (str) : L'identifiant de tâche retourné par l'exécution asynchrone

**Retourne :** `Dict[str, Any]`

**Champs de réponse :**
- `success` (bool) : Si la requête a réussi
- `taskId` (str) : L'identifiant de la tâche
- `status` (str) : L'un des états suivants : `'queued'`, `'processing'`, `'completed'`, `'failed'`, `'cancelled'`
- `metadata` (dict) : Contient `startedAt`, `completedAt`, et `duration`
- `output` (any, facultatif) : La sortie du workflow (une fois terminé)
- `error` (any, facultatif) : Détails de l'erreur (en cas d'échec)
- `estimatedDuration` (int, facultatif) : Durée estimée en millisecondes (lors du traitement/mise en file d'attente)

##### execute_with_retry()

Exécuter un workflow avec réessai automatique en cas d'erreurs de limitation de débit, en utilisant un backoff exponentiel.

```python
result = client.execute_with_retry(
    "workflow-id",
    input_data={"message": "Hello"},
    timeout=30.0,
    max_retries=3,           # Maximum number of retries
    initial_delay=1.0,       # Initial delay in seconds
    max_delay=30.0,          # Maximum delay in seconds
    backoff_multiplier=2.0   # Exponential backoff multiplier
)
```

**Paramètres :**
- `workflow_id` (str) : L'identifiant du workflow à exécuter
- `input_data` (dict, facultatif) : Données d'entrée à transmettre au workflow
- `timeout` (float, facultatif) : Délai d'expiration en secondes
- `stream` (bool, facultatif) : Activer les réponses en streaming
- `selected_outputs` (list, facultatif) : Sorties de blocs à diffuser
- `async_execution` (bool, facultatif) : Exécuter de manière asynchrone
- `max_retries` (int, facultatif) : Nombre maximum de tentatives (par défaut : 3)
- `initial_delay` (float, facultatif) : Délai initial en secondes (par défaut : 1.0)
- `max_delay` (float, facultatif) : Délai maximum en secondes (par défaut : 30.0)
- `backoff_multiplier` (float, facultatif) : Multiplicateur de backoff (par défaut : 2.0)

**Retourne :** `WorkflowExecutionResult | AsyncExecutionResult`

La logique de nouvelle tentative utilise un backoff exponentiel (1s → 2s → 4s → 8s...) avec une variation aléatoire de ±25% pour éviter l'effet de horde. Si l'API fournit un en-tête `retry-after`, celui-ci sera utilisé à la place.

##### get_rate_limit_info()

Obtenir les informations actuelles sur les limites de débit à partir de la dernière réponse de l'API.

```python
rate_limit_info = client.get_rate_limit_info()
if rate_limit_info:
    print("Limit:", rate_limit_info.limit)
    print("Remaining:", rate_limit_info.remaining)
    print("Reset:", datetime.fromtimestamp(rate_limit_info.reset))
```

**Retourne :** `RateLimitInfo | None`

##### get_usage_limits()

Obtenir les limites d'utilisation actuelles et les informations de quota pour votre compte.

```python
limits = client.get_usage_limits()
print("Sync requests remaining:", limits.rate_limit["sync"]["remaining"])
print("Async requests remaining:", limits.rate_limit["async"]["remaining"])
print("Current period cost:", limits.usage["currentPeriodCost"])
print("Plan:", limits.usage["plan"])
```

**Retourne :** `UsageLimits`

**Structure de la réponse :**

```python
{
    "success": bool,
    "rateLimit": {
        "sync": {
            "isLimited": bool,
            "limit": int,
            "remaining": int,
            "resetAt": str
        },
        "async": {
            "isLimited": bool,
            "limit": int,
            "remaining": int,
            "resetAt": str
        },
        "authType": str  # 'api' or 'manual'
    },
    "usage": {
        "currentPeriodCost": float,
        "limit": float,
        "plan": str  # e.g., 'free', 'pro'
    }
}
```

##### set_api_key()

Mettre à jour la clé API.

```python
client.set_api_key("new-api-key")
```

##### set_base_url()

Mettre à jour l'URL de base.

```python
client.set_base_url("https://my-custom-domain.com")
```

##### close()

Fermer la session HTTP sous-jacente.

```python
client.close()
```

## Classes de données

### WorkflowExecutionResult

```python
@dataclass
class WorkflowExecutionResult:
    success: bool
    output: Optional[Any] = None
    error: Optional[str] = None
    logs: Optional[List[Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    trace_spans: Optional[List[Any]] = None
    total_duration: Optional[float] = None
```

### AsyncExecutionResult

```python
@dataclass
class AsyncExecutionResult:
    success: bool
    task_id: str
    status: str  # 'queued'
    created_at: str
    links: Dict[str, str]  # e.g., {"status": "/api/jobs/{taskId}"}
```

### WorkflowStatus

```python
@dataclass
class WorkflowStatus:
    is_deployed: bool
    deployed_at: Optional[str] = None
    needs_redeployment: bool = False
```

### RateLimitInfo

```python
@dataclass
class RateLimitInfo:
    limit: int
    remaining: int
    reset: int
    retry_after: Optional[int] = None
```

### UsageLimits

```python
@dataclass
class UsageLimits:
    success: bool
    rate_limit: Dict[str, Any]
    usage: Dict[str, Any]
```

### SimStudioError

```python
class SimStudioError(Exception):
    def __init__(self, message: str, code: Optional[str] = None, status: Optional[int] = None):
        super().__init__(message)
        self.code = code
        self.status = status
```

**Codes d'erreur courants :**
- `UNAUTHORIZED` : Clé API invalide
- `TIMEOUT` : Délai d'attente de la requête dépassé
- `RATE_LIMIT_EXCEEDED` : Limite de débit dépassée
- `USAGE_LIMIT_EXCEEDED` : Limite d'utilisation dépassée
- `EXECUTION_ERROR` : Échec de l'exécution du workflow

## Exemples

### Exécution basique d'un workflow

<Steps>
  <Step title="Initialiser le client">
    Configurez le SimStudioClient avec votre clé API.
  </Step>
  <Step title="Valider le workflow">
    Vérifiez si le workflow est déployé et prêt pour l'exécution.
  </Step>
  <Step title="Exécuter le workflow">
    Lancez le workflow avec vos données d'entrée.
  </Step>
  <Step title="Gérer le résultat">
    Traitez le résultat de l'exécution et gérez les éventuelles erreurs.
  </Step>
</Steps>

```python
import os
from simstudio import SimStudioClient

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def run_workflow():
    try:
        # Check if workflow is ready
        is_ready = client.validate_workflow("my-workflow-id")
        if not is_ready:
            raise Exception("Workflow is not deployed or ready")

        # Execute the workflow
        result = client.execute_workflow(
            "my-workflow-id",
            input_data={
                "message": "Process this data",
                "user_id": "12345"
            }
        )

        if result.success:
            print("Output:", result.output)
            print("Duration:", result.metadata.get("duration") if result.metadata else None)
        else:
            print("Workflow failed:", result.error)
            
    except Exception as error:
        print("Error:", error)

run_workflow()
```

### Gestion des erreurs

Gérez différents types d'erreurs qui peuvent survenir pendant l'exécution du workflow :

```python
from simstudio import SimStudioClient, SimStudioError
import os

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))   

def execute_with_error_handling():
    try:
        result = client.execute_workflow("workflow-id")
        return result
    except SimStudioError as error:
        if error.code == "UNAUTHORIZED":
            print("Invalid API key")
        elif error.code == "TIMEOUT":
            print("Workflow execution timed out")
        elif error.code == "USAGE_LIMIT_EXCEEDED":
            print("Usage limit exceeded")
        elif error.code == "INVALID_JSON":
            print("Invalid JSON in request body")
        else:
            print(f"Workflow error: {error}")
        raise
    except Exception as error:
        print(f"Unexpected error: {error}")
        raise
```

### Utilisation du gestionnaire de contexte

Utilisez le client comme gestionnaire de contexte pour gérer automatiquement le nettoyage des ressources :

```python
from simstudio import SimStudioClient
import os

# Using context manager to automatically close the session
with SimStudioClient(api_key=os.getenv("SIM_API_KEY")) as client:
    result = client.execute_workflow("workflow-id")
    print("Result:", result)
# Session is automatically closed here
```

### Exécution de workflows par lots

Exécutez plusieurs workflows efficacement :

```python
from simstudio import SimStudioClient
import os

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_workflows_batch(workflow_data_pairs):
    """Execute multiple workflows with different input data."""
    results = []
    
    for workflow_id, input_data in workflow_data_pairs:
        try:
            # Validate workflow before execution
            if not client.validate_workflow(workflow_id):
                print(f"Skipping {workflow_id}: not deployed")
                continue
                
            result = client.execute_workflow(workflow_id, input_data)
            results.append({
                "workflow_id": workflow_id,
                "success": result.success,
                "output": result.output,
                "error": result.error
            })
            
        except Exception as error:
            results.append({
                "workflow_id": workflow_id,
                "success": False,
                "error": str(error)
            })
    
    return results

# Example usage
workflows = [
    ("workflow-1", {"type": "analysis", "data": "sample1"}),
    ("workflow-2", {"type": "processing", "data": "sample2"}),
]

results = execute_workflows_batch(workflows)
for result in results:
    print(f"Workflow {result['workflow_id']}: {'Success' if result['success'] else 'Failed'}")
```

### Exécution asynchrone de workflow

Exécutez des workflows de manière asynchrone pour les tâches de longue durée :

```python
import os
import time
from simstudio import SimStudioClient

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_async():
    try:
        # Start async execution
        result = client.execute_workflow(
            "workflow-id",
            input_data={"data": "large dataset"},
            async_execution=True  # Execute asynchronously
        )

        # Check if result is an async execution
        if hasattr(result, 'task_id'):
            print(f"Task ID: {result.task_id}")
            print(f"Status endpoint: {result.links['status']}")

            # Poll for completion
            status = client.get_job_status(result.task_id)

            while status["status"] in ["queued", "processing"]:
                print(f"Current status: {status['status']}")
                time.sleep(2)  # Wait 2 seconds
                status = client.get_job_status(result.task_id)

            if status["status"] == "completed":
                print("Workflow completed!")
                print(f"Output: {status['output']}")
                print(f"Duration: {status['metadata']['duration']}")
            else:
                print(f"Workflow failed: {status['error']}")

    except Exception as error:
        print(f"Error: {error}")

execute_async()
```

### Limitation de débit et nouvelle tentative

Gérez les limites de débit automatiquement avec un retrait exponentiel :

```python
import os
from simstudio import SimStudioClient, SimStudioError

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_with_retry_handling():
    try:
        # Automatically retries on rate limit
        result = client.execute_with_retry(
            "workflow-id",
            input_data={"message": "Process this"},
            max_retries=5,
            initial_delay=1.0,
            max_delay=60.0,
            backoff_multiplier=2.0
        )

        print(f"Success: {result}")
    except SimStudioError as error:
        if error.code == "RATE_LIMIT_EXCEEDED":
            print("Rate limit exceeded after all retries")

            # Check rate limit info
            rate_limit_info = client.get_rate_limit_info()
            if rate_limit_info:
                from datetime import datetime
                reset_time = datetime.fromtimestamp(rate_limit_info.reset)
                print(f"Rate limit resets at: {reset_time}")

execute_with_retry_handling()
```

### Surveillance de l'utilisation

Surveillez l'utilisation et les limites de votre compte :

```python
import os
from simstudio import SimStudioClient

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def check_usage():
    try:
        limits = client.get_usage_limits()

        print("=== Rate Limits ===")
        print("Sync requests:")
        print(f"  Limit: {limits.rate_limit['sync']['limit']}")
        print(f"  Remaining: {limits.rate_limit['sync']['remaining']}")
        print(f"  Resets at: {limits.rate_limit['sync']['resetAt']}")
        print(f"  Is limited: {limits.rate_limit['sync']['isLimited']}")

        print("\nAsync requests:")
        print(f"  Limit: {limits.rate_limit['async']['limit']}")
        print(f"  Remaining: {limits.rate_limit['async']['remaining']}")
        print(f"  Resets at: {limits.rate_limit['async']['resetAt']}")
        print(f"  Is limited: {limits.rate_limit['async']['isLimited']}")

        print("\n=== Usage ===")
        print(f"Current period cost: ${limits.usage['currentPeriodCost']:.2f}")
        print(f"Limit: ${limits.usage['limit']:.2f}")
        print(f"Plan: {limits.usage['plan']}")

        percent_used = (limits.usage['currentPeriodCost'] / limits.usage['limit']) * 100
        print(f"Usage: {percent_used:.1f}%")

        if percent_used > 80:
            print("⚠️  Warning: You are approaching your usage limit!")

    except Exception as error:
        print(f"Error checking usage: {error}")

check_usage()
```

### Exécution de workflow en streaming

Exécutez des workflows avec des réponses en streaming en temps réel :

```python
from simstudio import SimStudioClient
import os

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))   

def execute_with_streaming():
    """Execute workflow with streaming enabled."""
    try:
        # Enable streaming for specific block outputs
        result = client.execute_workflow(
            "workflow-id",
            input_data={"message": "Count to five"},
            stream=True,
            selected_outputs=["agent1.content"]  # Use blockName.attribute format
        )

        print("Workflow result:", result)
    except Exception as error:
        print("Error:", error)

execute_with_streaming()
```

La réponse en streaming suit le format Server-Sent Events (SSE) :

```
data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":"One"}

data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":", two"}

data: {"event":"done","success":true,"output":{},"metadata":{"duration":610}}

data: [DONE]
```

**Exemple de streaming avec Flask :**

```python
from flask import Flask, Response, stream_with_context
import requests
import json
import os

app = Flask(__name__)

@app.route('/stream-workflow')
def stream_workflow():
    """Stream workflow execution to the client."""

    def generate():
        response = requests.post(
            'https://sim.ai/api/workflows/WORKFLOW_ID/execute',
            headers={
                'Content-Type': 'application/json',
                'X-API-Key': os.getenv('SIM_API_KEY')
            },
            json={
                'message': 'Generate a story',
                'stream': True,
                'selectedOutputs': ['agent1.content']
            },
            stream=True
        )

        for line in response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                if decoded_line.startswith('data: '):
                    data = decoded_line[6:]  # Remove 'data: ' prefix

                    if data == '[DONE]':
                        break

                    try:
                        parsed = json.loads(data)
                        if 'chunk' in parsed:
                            yield f"data: {json.dumps(parsed)}\n\n"
                        elif parsed.get('event') == 'done':
                            yield f"data: {json.dumps(parsed)}\n\n"
                            print("Execution complete:", parsed.get('metadata'))
                    except json.JSONDecodeError:
                        pass

    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream'
    )

if __name__ == '__main__':
    app.run(debug=True)
```

### Configuration de l'environnement

Configurez le client en utilisant des variables d'environnement :

<Tabs items={['Development', 'Production']}>
  <Tab value="Development">

    ```python
    import os
    from simstudio import SimStudioClient

    # Development configuration
    client = SimStudioClient(
        api_key=os.getenv("SIM_API_KEY")
        base_url=os.getenv("SIM_BASE_URL", "https://sim.ai")
    )
    ```

  </Tab>
  <Tab value="Production">

    ```python
    import os
    from simstudio import SimStudioClient

    # Production configuration with error handling
    api_key = os.getenv("SIM_API_KEY")
    if not api_key:
        raise ValueError("SIM_API_KEY environment variable is required")

    client = SimStudioClient(
        api_key=api_key,
        base_url=os.getenv("SIM_BASE_URL", "https://sim.ai")
    )
    ```

  </Tab>
</Tabs>

## Obtention de votre clé API

<Steps>
  <Step title="Connectez-vous à Sim">
    Accédez à [Sim](https://sim.ai) et connectez-vous à votre compte.
  </Step>
  <Step title="Ouvrez votre workflow">
    Accédez au workflow que vous souhaitez exécuter par programmation.
  </Step>
  <Step title="Déployez votre workflow">
    Cliquez sur "Déployer" pour déployer votre workflow s'il n'a pas encore été déployé.
  </Step>
  <Step title="Créez ou sélectionnez une clé API">
    Pendant le processus de déploiement, sélectionnez ou créez une clé API.
  </Step>
  <Step title="Copiez la clé API">
    Copiez la clé API pour l'utiliser dans votre application Python.
  </Step>
</Steps>

## Prérequis

- Python 3.8+
- requests >= 2.25.0

## Licence

Apache-2.0
```

--------------------------------------------------------------------------------

````
