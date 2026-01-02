---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 164
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 164 of 933)

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

---[FILE: intercom.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/intercom.mdx

```text
---
title: Intercom
description: Gérez les contacts, les entreprises, les conversations, les tickets
  et les messages dans Intercom
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="intercom"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Intercom](https://www.intercom.com/) est une plateforme de communication client de premier plan qui vous permet de gérer et d'automatiser vos interactions avec les contacts, les entreprises, les conversations, les tickets et les messages, le tout en un seul endroit. L'intégration d'Intercom dans Sim permet à vos agents de gérer par programmation les relations clients, les demandes d'assistance et les conversations directement à partir de vos flux de travail automatisés.

Avec les outils Intercom, vous pouvez :

- **Gestion des contacts :** créer, obtenir, mettre à jour, lister, rechercher et supprimer des contacts — automatisez vos processus de CRM et gardez vos dossiers clients à jour.
- **Gestion des entreprises :** créer de nouvelles entreprises, récupérer les détails d'une entreprise et lister toutes les entreprises liées à vos utilisateurs ou clients professionnels.
- **Gestion des conversations :** obtenir, lister, répondre et rechercher dans les conversations — permettant aux agents de suivre les fils de support en cours, de fournir des réponses et d'automatiser les actions de suivi.
- **Gestion des tickets :** créer et récupérer des tickets par programmation, vous aidant à automatiser le service client, le suivi des problèmes d'assistance et les escalades de flux de travail.
- **Envoi de messages :** déclencher des messages aux utilisateurs ou prospects pour l'intégration, le support ou le marketing, le tout depuis votre automatisation de flux de travail.

En intégrant les outils Intercom dans Sim, vous permettez à vos flux de travail de communiquer directement avec vos utilisateurs, d'automatiser les processus d'assistance client, de gérer les prospects et de rationaliser les communications à grande échelle. Que vous ayez besoin de créer de nouveaux contacts, de synchroniser les données clients, de gérer les tickets d'assistance ou d'envoyer des messages d'engagement personnalisés, les outils Intercom offrent un moyen complet de gérer les interactions client dans le cadre de vos automatisations intelligentes.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Intercom dans le flux de travail. Peut créer, obtenir, mettre à jour, lister, rechercher et supprimer des contacts ; créer, obtenir et lister des entreprises ; obtenir, lister, répondre et rechercher des conversations ; créer et obtenir des tickets ; et créer des messages.

## Outils

### `intercom_create_contact`

Créer un nouveau contact dans Intercom avec email, external_id ou role

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `email` | string | Non | L'adresse email du contact |
| `external_id` | string | Non | Un identifiant unique pour le contact fourni par le client |
| `phone` | string | Non | Le numéro de téléphone du contact |
| `name` | string | Non | Le nom du contact |
| `avatar` | string | Non | Une URL d'image d'avatar pour le contact |
| `signed_up_at` | number | Non | L'heure à laquelle l'utilisateur s'est inscrit sous forme d'horodatage Unix |
| `last_seen_at` | number | Non | L'heure à laquelle l'utilisateur a été vu pour la dernière fois sous forme d'horodatage Unix |
| `owner_id` | string | Non | L'identifiant d'un administrateur qui a été assigné comme propriétaire du compte du contact |
| `unsubscribed_from_emails` | boolean | Non | Indique si le contact est désabonné des emails |
| `custom_attributes` | string | Non | Attributs personnalisés sous forme d'objet JSON (par exemple, \{"nom_attribut": "valeur"\}) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données du contact créé |

### `intercom_get_contact`

Obtenir un seul contact par ID depuis Intercom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `contactId` | string | Oui | ID du contact à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données du contact |

### `intercom_update_contact`

Mettre à jour un contact existant dans Intercom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `contactId` | string | Oui | ID du contact à mettre à jour |
| `email` | string | Non | Adresse e-mail du contact |
| `phone` | string | Non | Numéro de téléphone du contact |
| `name` | string | Non | Nom du contact |
| `avatar` | string | Non | URL de l'image d'avatar pour le contact |
| `signed_up_at` | number | Non | Moment où l'utilisateur s'est inscrit, en timestamp Unix |
| `last_seen_at` | number | Non | Moment où l'utilisateur a été vu pour la dernière fois, en timestamp Unix |
| `owner_id` | string | Non | ID d'un administrateur qui a été assigné comme propriétaire du compte du contact |
| `unsubscribed_from_emails` | boolean | Non | Indique si le contact est désabonné des e-mails |
| `custom_attributes` | string | Non | Attributs personnalisés sous forme d'objet JSON (par exemple, \{"nom_attribut": "valeur"\}) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données du contact mises à jour |

### `intercom_list_contacts`

Lister tous les contacts d'Intercom avec prise en charge de la pagination

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `per_page` | nombre | Non | Nombre de résultats par page \(max : 150\) |
| `starting_after` | chaîne | Non | Curseur pour la pagination - ID pour commencer après |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération |
| `output` | objet | Liste des contacts |

### `intercom_search_contacts`

Rechercher des contacts dans Intercom à l'aide d'une requête

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `query` | chaîne | Oui | Requête de recherche \(ex., \{"field":"email","operator":"=","value":"user@example.com"\}\) |
| `per_page` | nombre | Non | Nombre de résultats par page \(max : 150\) |
| `starting_after` | chaîne | Non | Curseur pour la pagination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération |
| `output` | objet | Résultats de la recherche |

### `intercom_delete_contact`

Supprimer un contact d'Intercom par ID

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `contactId` | chaîne | Oui | ID du contact à supprimer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération |
| `output` | objet | Résultat de la suppression |

### `intercom_create_company`

Créer ou mettre à jour une entreprise dans Intercom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `company_id` | string | Oui | Votre identifiant unique pour l'entreprise |
| `name` | string | Non | Le nom de l'entreprise |
| `website` | string | Non | Le site web de l'entreprise |
| `plan` | string | Non | Le nom du forfait de l'entreprise |
| `size` | number | Non | Le nombre d'employés dans l'entreprise |
| `industry` | string | Non | Le secteur d'activité de l'entreprise |
| `monthly_spend` | number | Non | Le montant des revenus que l'entreprise génère pour votre activité. Remarque : ce champ tronque les décimales en nombres entiers (par exemple, 155,98 devient 155) |
| `custom_attributes` | string | Non | Attributs personnalisés sous forme d'objet JSON |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération |
| `output` | objet | Données de l'entreprise créée ou mise à jour |

### `intercom_get_company`

Récupérer une seule entreprise par ID depuis Intercom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `companyId` | chaîne | Oui | ID de l'entreprise à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | booléen | Statut de réussite de l'opération |
| `output` | objet | Données de l'entreprise |

### `intercom_list_companies`

Liste toutes les entreprises d'Intercom avec prise en charge de la pagination. Remarque : cet endpoint a une limite de 10 000 entreprises qui peuvent être renvoyées en utilisant la pagination. Pour les ensembles de données de plus de 10 000 entreprises, utilisez plutôt l'API Scroll.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `per_page` | number | Non | Nombre de résultats par page |
| `page` | number | Non | Numéro de page |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Liste des entreprises |

### `intercom_get_conversation`

Récupérer une seule conversation par ID depuis Intercom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `conversationId` | string | Oui | ID de la conversation à récupérer |
| `display_as` | string | Non | Définir à "plaintext" pour récupérer les messages en texte brut |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données de la conversation |

### `intercom_list_conversations`

Lister toutes les conversations depuis Intercom avec prise en charge de la pagination

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `per_page` | number | Non | Nombre de résultats par page \(max : 150\) |
| `starting_after` | string | Non | Curseur pour la pagination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Liste des conversations |

### `intercom_reply_conversation`

Répondre à une conversation en tant qu'administrateur dans Intercom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `conversationId` | string | Oui | ID de la conversation à laquelle répondre |
| `message_type` | string | Oui | Type de message : "comment" ou "note" |
| `body` | string | Oui | Le corps du texte de la réponse |
| `admin_id` | string | Non | L'ID de l'administrateur qui rédige la réponse. Si non fourni, un administrateur par défaut (Operator/Fin) sera utilisé. |
| `attachment_urls` | string | Non | Liste d'URLs d'images séparées par des virgules (max 10) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Conversation mise à jour avec la réponse |

### `intercom_search_conversations`

Rechercher des conversations dans Intercom à l'aide d'une requête

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Oui | Requête de recherche sous forme d'objet JSON |
| `per_page` | number | Non | Nombre de résultats par page (max : 150) |
| `starting_after` | string | Non | Curseur pour la pagination |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Résultats de la recherche |

### `intercom_create_ticket`

Créer un nouveau ticket dans Intercom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `ticket_type_id` | string | Oui | L'ID du type de ticket |
| `contacts` | string | Oui | Tableau JSON d'identifiants de contact (par ex., \[\{"id": "contact_id"\}\]) |
| `ticket_attributes` | string | Oui | Objet JSON avec les attributs du ticket incluant _default_title_ et _default_description_ |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données du ticket créé |

### `intercom_get_ticket`

Récupérer un ticket unique par ID depuis Intercom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `ticketId` | string | Oui | ID du ticket à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données du ticket |

### `intercom_create_message`

Créer et envoyer un nouveau message initié par l'administrateur dans Intercom

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `message_type` | string | Oui | Type de message : "inapp" ou "email" |
| `subject` | string | Non | Objet du message (pour le type email) |
| `body` | string | Oui | Corps du message |
| `from_type` | string | Oui | Type d'expéditeur : "admin" |
| `from_id` | string | Oui | ID de l'administrateur qui envoie le message |
| `to_type` | string | Oui | Type de destinataire : "contact" |
| `to_id` | string | Oui | ID du contact qui reçoit le message |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Statut de réussite de l'opération |
| `output` | object | Données du message créé |

## Notes

- Catégorie : `tools`
- Type : `intercom`
```

--------------------------------------------------------------------------------

---[FILE: jina.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/jina.mdx

```text
---
title: Jina
description: Recherchez sur le web ou extrayez du contenu à partir d'URLs
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="jina"
  color="#333333"
/>

{/* MANUAL-CONTENT-START:intro */}
[Jina AI](https://jina.ai/) est un puissant outil d'extraction de contenu qui s'intègre parfaitement à Sim pour transformer le contenu web en texte propre et lisible. Cette intégration permet aux développeurs d'incorporer facilement des capacités de traitement de contenu web dans leurs flux de travail d'agents.

Jina AI Reader se spécialise dans l'extraction du contenu le plus pertinent des pages web, en supprimant les éléments superflus, les publicités et les problèmes de formatage pour produire un texte propre et structuré, optimisé pour les modèles de langage et autres tâches de traitement de texte.

Avec l'intégration de Jina AI dans Sim, vous pouvez :

- **Extraire du contenu propre** de n'importe quelle page web en fournissant simplement une URL
- **Traiter des mises en page web complexes** en texte structuré et lisible
- **Maintenir le contexte important** tout en supprimant les éléments inutiles
- **Préparer le contenu web** pour un traitement ultérieur dans vos flux de travail d'agents
- **Simplifier les tâches de recherche** en convertissant rapidement les informations web en données utilisables

Cette intégration est particulièrement précieuse pour créer des agents qui doivent recueillir et traiter des informations du web, mener des recherches ou analyser du contenu en ligne dans le cadre de leur flux de travail.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Jina AI dans votre flux de travail. Recherchez sur le web et obtenez des résultats adaptés aux LLM, ou extrayez du contenu propre à partir d'URLs spécifiques avec des options d'analyse avancées.

## Outils

### `jina_read_url`

Extrayez et traitez le contenu web en texte propre et adapté aux LLM avec Jina AI Reader. Prend en charge l'analyse avancée du contenu, la collecte de liens et plusieurs formats de sortie avec des options de traitement configurables.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `url` | string | Oui | L'URL à lire et à convertir en markdown |
| `useReaderLMv2` | boolean | Non | Utiliser ReaderLM-v2 pour une meilleure qualité \(coût de jetons 3x plus élevé\) |
| `gatherLinks` | boolean | Non | Rassembler tous les liens à la fin |
| `jsonResponse` | boolean | Non | Renvoyer la réponse au format JSON |
| `apiKey` | string | Oui | Votre clé API Jina AI |
| `withImagesummary` | boolean | Non | Recueillir toutes les images de la page avec leurs métadonnées |
| `retainImages` | string | Non | Contrôler l'inclusion d'images : "none" supprime tout, "all" conserve tout |
| `returnFormat` | string | Non | Format de sortie : markdown, html, text, screenshot ou pageshot |
| `withIframe` | boolean | Non | Inclure le contenu des iframes dans l'extraction |
| `withShadowDom` | boolean | Non | Extraire le contenu du Shadow DOM |
| `noCache` | boolean | Non | Contourner le contenu mis en cache pour une récupération en temps réel |
| `withGeneratedAlt` | boolean | Non | Générer du texte alternatif pour les images en utilisant VLM |
| `robotsTxt` | string | Non | Agent utilisateur bot pour la vérification du robots.txt |
| `dnt` | boolean | Non | Ne pas suivre - empêche la mise en cache/le suivi |
| `noGfm` | boolean | Non | Désactiver le Markdown de style GitHub |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Le contenu extrait de l'URL, traité en texte propre et adapté aux LLM |
| `links` | array | Liste des liens trouvés sur la page (lorsque gatherLinks ou withLinksummary est activé) |
| `images` | array | Liste des images trouvées sur la page (lorsque withImagesummary est activé) |

### `jina_search`

Recherche sur le web et renvoie les 5 meilleurs résultats avec un contenu adapté aux LLM. Chaque résultat est automatiquement traité via l'API Jina Reader. Prend en charge le filtrage géographique, les restrictions de site et la pagination.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `q` | string | Oui | Chaîne de requête de recherche |
| `apiKey` | string | Oui | Votre clé API Jina AI |
| `num` | number | Non | Nombre maximum de résultats par page \(par défaut : 5\) |
| `site` | string | Non | Limiter les résultats à des domaines spécifiques. Peut être séparé par des virgules pour plusieurs sites \(ex. : "jina.ai,github.com"\) |
| `withFavicon` | boolean | Non | Inclure les favicons des sites web dans les résultats |
| `withImagesummary` | boolean | Non | Recueillir toutes les images des pages de résultats avec leurs métadonnées |
| `withLinksummary` | boolean | Non | Recueillir tous les liens des pages de résultats |
| `retainImages` | string | Non | Contrôler l'inclusion d'images : "none" supprime tout, "all" conserve tout |
| `noCache` | boolean | Non | Contourner le contenu mis en cache pour une récupération en temps réel |
| `withGeneratedAlt` | boolean | Non | Générer du texte alternatif pour les images en utilisant VLM |
| `respondWith` | string | Non | Définir sur "no-content" pour obtenir uniquement les métadonnées sans le contenu de la page |
| `returnFormat` | string | Non | Format de sortie : markdown, html, text, screenshot ou pageshot |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | Tableau de résultats de recherche, chacun contenant titre, description, url et contenu adapté aux LLM |

## Notes

- Catégorie : `tools`
- Type : `jina`
```

--------------------------------------------------------------------------------

````
