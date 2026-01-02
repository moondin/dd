---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 180
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 180 of 933)

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

---[FILE: shopify.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/shopify.mdx

```text
---
title: Shopify
description: Gérez les produits, les commandes, les clients et l'inventaire dans
  votre boutique Shopify
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="shopify"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Shopify](https://www.shopify.com/) est une plateforme e-commerce de premier plan conçue pour aider les marchands à construire, gérer et développer leurs boutiques en ligne. Shopify facilite la gestion de tous les aspects de votre boutique, des produits et de l'inventaire aux commandes et aux clients.

Avec Shopify dans Sim, vos agents peuvent :

- **Créer et gérer des produits** : ajouter de nouveaux produits, mettre à jour les détails des produits et supprimer des produits de votre boutique.
- **Lister et récupérer les commandes** : obtenir des informations sur les commandes des clients, y compris le filtrage et la gestion des commandes.
- **Gérer les clients** : accéder et mettre à jour les détails des clients, ou ajouter de nouveaux clients à votre boutique.
- **Ajuster les niveaux d'inventaire** : modifier par programmation les niveaux de stock des produits pour maintenir votre inventaire précis.

Utilisez l'intégration Shopify de Sim pour automatiser les flux de travail courants de gestion de boutique — comme la synchronisation de l'inventaire, l'exécution des commandes ou la gestion des annonces — directement depuis vos automatisations. Donnez à vos agents les moyens d'accéder, de mettre à jour et d'organiser toutes les données de votre boutique à l'aide d'outils simples et programmatiques.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Shopify dans votre flux de travail. Gérez les produits, les commandes, les clients et l'inventaire. Créez, lisez, mettez à jour et supprimez des produits. Listez et gérez les commandes. Traitez les données clients et ajustez les niveaux d'inventaire.

## Outils

### `shopify_create_product`

Créer un nouveau produit dans votre boutique Shopify

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `title` | string | Oui | Titre du produit |
| `descriptionHtml` | string | Non | Description du produit \(HTML\) |
| `vendor` | string | Non | Fournisseur/marque du produit |
| `productType` | string | Non | Type/catégorie du produit |
| `tags` | array | Non | Tags du produit |
| `status` | string | Non | Statut du produit \(ACTIVE, DRAFT, ARCHIVED\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `product` | object | Le produit créé |

### `shopify_get_product`

Obtenir un produit unique par ID depuis votre boutique Shopify

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `productId` | string | Oui | ID du produit \(gid://shopify/Product/123456789\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `product` | object | Les détails du produit |

### `shopify_list_products`

Lister les produits de votre boutique Shopify avec filtrage optionnel

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `first` | number | Non | Nombre de produits à retourner \(par défaut : 50, max : 250\) |
| `query` | string | Non | Requête de recherche pour filtrer les produits \(ex., "title:chemise" ou "vendor:Nike" ou "status:active"\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `products` | array | Liste des produits |
| `pageInfo` | object | Informations de pagination |

### `shopify_update_product`

Mettre à jour un produit existant dans votre boutique Shopify

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `productId` | string | Oui | ID du produit à mettre à jour \(gid://shopify/Product/123456789\) |
| `title` | string | Non | Nouveau titre du produit |
| `descriptionHtml` | string | Non | Nouvelle description du produit \(HTML\) |
| `vendor` | string | Non | Nouveau fournisseur/marque du produit |
| `productType` | string | Non | Nouveau type/catégorie du produit |
| `tags` | array | Non | Nouvelles étiquettes du produit |
| `status` | string | Non | Nouveau statut du produit \(ACTIVE, DRAFT, ARCHIVED\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `product` | objet | Le produit mis à jour |

### `shopify_delete_product`

Supprimer un produit de votre boutique Shopify

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex. : maboutique.myshopify.com\) |
| `productId` | chaîne | Oui | ID du produit à supprimer \(gid://shopify/Product/123456789\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deletedId` | chaîne | L'ID du produit supprimé |

### `shopify_get_order`

Obtenir une commande spécifique par ID depuis votre boutique Shopify

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex. : maboutique.myshopify.com\) |
| `orderId` | chaîne | Oui | ID de la commande \(gid://shopify/Order/123456789\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `order` | objet | Les détails de la commande |

### `shopify_list_orders`

Lister les commandes de votre boutique Shopify avec filtrage optionnel

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex. : maboutique.myshopify.com\) |
| `first` | nombre | Non | Nombre de commandes à retourner \(par défaut : 50, max : 250\) |
| `status` | chaîne | Non | Filtrer par statut de commande \(open, closed, cancelled, any\) |
| `query` | chaîne | Non | Requête de recherche pour filtrer les commandes \(ex. : "financial_status:paid" ou "fulfillment_status:unfulfilled" ou "email:customer@example.com"\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `orders` | array | Liste des commandes |
| `pageInfo` | object | Informations de pagination |

### `shopify_update_order`

Mettre à jour une commande existante dans votre boutique Shopify (note, tags, email)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `orderId` | string | Oui | ID de la commande à mettre à jour \(gid://shopify/Order/123456789\) |
| `note` | string | Non | Nouvelle note de commande |
| `tags` | array | Non | Nouveaux tags de commande |
| `email` | string | Non | Nouvel email client pour la commande |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `order` | object | La commande mise à jour |

### `shopify_cancel_order`

Annuler une commande dans votre boutique Shopify

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `orderId` | string | Oui | ID de la commande à annuler \(gid://shopify/Order/123456789\) |
| `reason` | string | Oui | Motif d'annulation \(CUSTOMER, DECLINED, FRAUD, INVENTORY, STAFF, OTHER\) |
| `notifyCustomer` | boolean | Non | Indique s'il faut informer le client de l'annulation |
| `refund` | boolean | Non | Indique s'il faut rembourser la commande |
| `restock` | boolean | Non | Indique s'il faut réapprovisionner le stock |
| `staffNote` | string | Non | Une note sur l'annulation pour référence interne |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `order` | objet | Le résultat de l'annulation |

### `shopify_create_customer`

Créer un nouveau client dans votre boutique Shopify

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `email` | chaîne | Non | Adresse e-mail du client |
| `firstName` | chaîne | Non | Prénom du client |
| `lastName` | chaîne | Non | Nom de famille du client |
| `phone` | chaîne | Non | Numéro de téléphone du client |
| `note` | chaîne | Non | Note concernant le client |
| `tags` | tableau | Non | Tags du client |
| `addresses` | tableau | Non | Adresses du client |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `customer` | objet | Le client créé |

### `shopify_get_customer`

Obtenir un client unique par ID depuis votre boutique Shopify

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `customerId` | chaîne | Oui | ID du client \(gid://shopify/Customer/123456789\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `customer` | objet | Les détails du client |

### `shopify_list_customers`

Listez les clients de votre boutique Shopify avec filtrage optionnel

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex. : maboutique.myshopify.com\) |
| `first` | nombre | Non | Nombre de clients à retourner \(par défaut : 50, max : 250\) |
| `query` | chaîne | Non | Requête de recherche pour filtrer les clients \(ex. : "first_name:John" ou "last_name:Smith" ou "email:*@gmail.com" ou "tag:vip"\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `customers` | tableau | Liste des clients |
| `pageInfo` | objet | Informations de pagination |

### `shopify_update_customer`

Mettre à jour un client existant dans votre boutique Shopify

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex. : maboutique.myshopify.com\) |
| `customerId` | chaîne | Oui | ID du client à mettre à jour \(gid://shopify/Customer/123456789\) |
| `email` | chaîne | Non | Nouvelle adresse e-mail du client |
| `firstName` | chaîne | Non | Nouveau prénom du client |
| `lastName` | chaîne | Non | Nouveau nom de famille du client |
| `phone` | chaîne | Non | Nouveau numéro de téléphone du client |
| `note` | chaîne | Non | Nouvelle note concernant le client |
| `tags` | tableau | Non | Nouvelles étiquettes du client |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `customer` | objet | Le client mis à jour |

### `shopify_delete_customer`

Supprimer un client de votre boutique Shopify

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `customerId` | chaîne | Oui | ID du client à supprimer \(gid://shopify/Customer/123456789\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deletedId` | chaîne | L'ID du client supprimé |

### `shopify_list_inventory_items`

Lister les articles d'inventaire de votre boutique Shopify. Utilisez cette fonction pour trouver les ID d'articles d'inventaire par SKU.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `first` | nombre | Non | Nombre d'articles d'inventaire à retourner \(par défaut : 50, max : 250\) |
| `query` | chaîne | Non | Requête de recherche pour filtrer les articles d'inventaire \(ex., "sku:ABC123"\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `inventoryItems` | tableau | Liste des articles d'inventaire avec leurs ID, SKU et niveaux de stock |
| `pageInfo` | objet | Informations de pagination |

### `shopify_get_inventory_level`

Obtenir le niveau d'inventaire pour une variante de produit à un emplacement spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `inventoryItemId` | chaîne | Oui | ID de l'article d'inventaire \(gid://shopify/InventoryItem/123456789\) |
| `locationId` | chaîne | Non | ID de l'emplacement pour filtrer \(facultatif\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `inventoryLevel` | objet | Les détails du niveau d'inventaire |

### `shopify_adjust_inventory`

Ajuster la quantité d'inventaire pour une variante de produit à un emplacement spécifique

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `inventoryItemId` | chaîne | Oui | ID de l'article d'inventaire \(gid://shopify/InventoryItem/123456789\) |
| `locationId` | chaîne | Oui | ID de l'emplacement \(gid://shopify/Location/123456789\) |
| `delta` | nombre | Oui | Montant à ajuster \(positif pour augmenter, négatif pour diminuer\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `inventoryLevel` | objet | Le résultat de l'ajustement d'inventaire |

### `shopify_list_locations`

Lister les emplacements d'inventaire de votre boutique Shopify. Utilisez ceci pour trouver les ID d'emplacement nécessaires pour les opérations d'inventaire.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `first` | nombre | Non | Nombre d'emplacements à retourner \(par défaut : 50, max : 250\) |
| `includeInactive` | booléen | Non | Inclure ou non les emplacements désactivés \(par défaut : false\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `locations` | tableau | Liste des emplacements avec leurs ID, noms et adresses |
| `pageInfo` | objet | Informations de pagination |

### `shopify_create_fulfillment`

Créez un traitement pour marquer les articles de commande comme expédiés. Nécessite un ID de commande de traitement (obtenez-le à partir des détails de la commande).

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `fulfillmentOrderId` | chaîne | Oui | L'ID de commande de traitement \(ex., gid://shopify/FulfillmentOrder/123456789\) |
| `trackingNumber` | chaîne | Non | Numéro de suivi pour l'expédition |
| `trackingCompany` | chaîne | Non | Nom du transporteur \(ex., UPS, FedEx, USPS, DHL\) |
| `trackingUrl` | chaîne | Non | URL pour suivre l'expédition |
| `notifyCustomer` | booléen | Non | Indique s'il faut envoyer un e-mail de confirmation d'expédition au client \(par défaut : true\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `fulfillment` | objet | Le traitement créé avec les informations de suivi et les articles traités |

### `shopify_list_collections`

Listez les collections de produits de votre boutique Shopify. Filtrez par titre, type (personnalisé/intelligent) ou identifiant.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `first` | nombre | Non | Nombre de collections à retourner \(par défaut : 50, max : 250\) |
| `query` | chaîne | Non | Requête de recherche pour filtrer les collections \(ex., "title:Été" ou "collection_type:smart"\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `collections` | tableau | Liste des collections avec leurs IDs, titres et nombre de produits |
| `pageInfo` | objet | Informations de pagination |

### `shopify_get_collection`

Obtenez une collection spécifique par ID, y compris ses produits. Utilisez ceci pour récupérer les produits au sein d'une collection.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `shopDomain` | chaîne | Oui | Le domaine de votre boutique Shopify \(ex., maboutique.myshopify.com\) |
| `collectionId` | chaîne | Oui | L'ID de la collection \(ex., gid://shopify/Collection/123456789\) |
| `productsFirst` | nombre | Non | Nombre de produits à retourner de cette collection \(par défaut : 50, max : 250\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `collection` | objet | Les détails de la collection incluant ses produits |

## Remarques

- Catégorie : `tools`
- Type : `shopify`
```

--------------------------------------------------------------------------------

---[FILE: slack.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/slack.mdx

```text
---
title: Slack
description: Envoyez, mettez à jour, supprimez des messages, ajoutez des
  réactions dans Slack ou déclenchez des workflows à partir d'événements Slack
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="slack"
  color="#611f69"
/>

{/* MANUAL-CONTENT-START:intro */}
[Slack](https://www.slack.com/) est une plateforme de communication professionnelle qui offre aux équipes un espace unifié pour les messages, les outils et les fichiers.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/J5jz3UaWmE8"
  title="Intégration de Slack avec Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Avec Slack, vous pouvez :

- **Automatisez les notifications des agents** : Envoyez des mises à jour en temps réel depuis vos agents Sim vers n'importe quel canal Slack
- **Créez des points de terminaison webhook** : Configurez des bots Slack comme webhooks pour déclencher des workflows Sim à partir des activités Slack
- **Améliorez les workflows des agents** : Intégrez la messagerie Slack dans vos agents pour livrer des résultats, des alertes et des mises à jour de statut
- **Créez et partagez des canevas Slack** : Générez programmatiquement des documents collaboratifs (canevas) dans les canaux Slack
- **Lisez les messages des canaux** : Récupérez et traitez les messages récents de n'importe quel canal Slack pour la surveillance ou les déclencheurs de workflow
- **Gérez les messages des bots** : Mettez à jour, supprimez et ajoutez des réactions aux messages envoyés par votre bot

Dans Sim, l'intégration Slack permet à vos agents d'interagir programmatiquement avec Slack avec des capacités complètes de gestion des messages dans le cadre de leurs workflows :

- **Envoyez des messages** : Les agents peuvent envoyer des messages formatés à n'importe quel canal ou utilisateur Slack, prenant en charge la syntaxe mrkdwn de Slack pour un formatage enrichi
- **Mettez à jour des messages** : Modifiez les messages de bot précédemment envoyés pour corriger des informations ou fournir des mises à jour de statut
- **Supprimez des messages** : Supprimez les messages de bot lorsqu'ils ne sont plus nécessaires ou contiennent des erreurs
- **Ajoutez des réactions** : Exprimez un sentiment ou une reconnaissance en ajoutant des réactions emoji à n'importe quel message
- **Créez des canevas** : Créez et partagez des canevas Slack (documents collaboratifs) directement dans les canaux, permettant un partage de contenu et une documentation plus riches
- **Lisez des messages** : Lisez les messages récents des canaux, permettant la surveillance, le reporting ou le déclenchement d'actions supplémentaires basées sur l'activité du canal
- **Téléchargez des fichiers** : Récupérez les fichiers partagés dans les canaux Slack pour traitement ou archivage

Cela permet des scénarios d'automatisation puissants tels que l'envoi de notifications avec des mises à jour dynamiques, la gestion des flux conversationnels avec des messages de statut modifiables, la reconnaissance de messages importants avec des réactions, et le maintien de canaux propres en supprimant les messages de bot obsolètes. Vos agents peuvent fournir des informations opportunes, mettre à jour des messages au fur et à mesure que les workflows progressent, créer des documents collaboratifs, ou alerter les membres de l'équipe lorsqu'une attention est nécessaire. Cette intégration comble le fossé entre vos workflows d'IA et la communication de votre équipe, garantissant que tout le monde reste informé avec des informations précises et à jour. En connectant Sim avec Slack, vous pouvez créer des agents qui tiennent votre équipe informée avec des informations pertinentes au bon moment, améliorent la collaboration en partageant et en mettant à jour automatiquement des insights, et réduisent le besoin de mises à jour manuelles de statut—tout en tirant parti de votre espace de travail Slack existant où votre équipe communique déjà.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez Slack dans le flux de travail. Peut envoyer, mettre à jour et supprimer des messages, créer des canevas, lire des messages et ajouter des réactions. Nécessite un jeton de bot au lieu d'OAuth en mode avancé. Peut être utilisé en mode déclencheur pour lancer un flux de travail lorsqu'un message est envoyé à un canal.

## Outils

### `slack_message`

Envoyez des messages aux canaux Slack ou en messages directs. Prend en charge le formatage mrkdwn de Slack.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `authMethod` | chaîne | Non | Méthode d'authentification : oauth ou bot_token |
| `botToken` | chaîne | Non | Jeton du bot pour Bot personnalisé |
| `channel` | chaîne | Non | Canal Slack cible \(ex. : #general\) |
| `userId` | chaîne | Non | ID utilisateur Slack cible pour les messages directs \(ex. : U1234567890\) |
| `text` | chaîne | Oui | Texte du message à envoyer \(prend en charge le formatage mrkdwn de Slack\) |
| `thread_ts` | chaîne | Non | Horodatage du fil de discussion auquel répondre \(crée une réponse dans le fil\) |
| `files` | fichier[] | Non | Fichiers à joindre au message |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | objet | Objet de message complet avec toutes les propriétés renvoyées par Slack |
| `ts` | chaîne | Horodatage du message |
| `channel` | chaîne | ID du canal où le message a été envoyé |
| `fileCount` | nombre | Nombre de fichiers téléchargés \(lorsque des fichiers sont joints\) |

### `slack_canvas`

Créer et partager des canevas Slack dans les canaux. Les canevas sont des documents collaboratifs au sein de Slack.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `authMethod` | chaîne | Non | Méthode d'authentification : oauth ou bot_token |
| `botToken` | chaîne | Non | Jeton du bot pour le Bot personnalisé |
| `channel` | chaîne | Oui | Canal Slack cible (par ex., #general) |
| `title` | chaîne | Oui | Titre du canevas |
| `content` | chaîne | Oui | Contenu du canevas au format markdown |
| `document_content` | objet | Non | Contenu structuré du document canevas |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `canvas_id` | chaîne | ID du canevas créé |
| `channel` | chaîne | Canal où le canevas a été créé |
| `title` | chaîne | Titre du canevas |

### `slack_message_reader`

Lisez les derniers messages des canaux Slack. Récupérez l'historique des conversations avec des options de filtrage.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `authMethod` | chaîne | Non | Méthode d'authentification : oauth ou bot_token |
| `botToken` | chaîne | Non | Jeton du bot pour Bot personnalisé |
| `channel` | chaîne | Non | Canal Slack pour lire les messages \(ex. : #general\) |
| `userId` | chaîne | Non | ID utilisateur pour la conversation en MP \(ex. : U1234567890\) |
| `limit` | nombre | Non | Nombre de messages à récupérer \(par défaut : 10, max : 100\) |
| `oldest` | chaîne | Non | Début de la plage temporelle \(horodatage\) |
| `latest` | chaîne | Non | Fin de la plage temporelle \(horodatage\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `messages` | tableau | Tableau d'objets de messages du canal |

### `slack_list_channels`

Liste tous les canaux dans un espace de travail Slack. Renvoie les canaux publics et privés auxquels le bot a accès.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `authMethod` | chaîne | Non | Méthode d'authentification : oauth ou bot_token |
| `botToken` | chaîne | Non | Jeton du bot pour Bot personnalisé |
| `includePrivate` | booléen | Non | Inclure les canaux privés dont le bot est membre \(par défaut : true\) |
| `excludeArchived` | booléen | Non | Exclure les canaux archivés \(par défaut : true\) |
| `limit` | nombre | Non | Nombre maximum de canaux à renvoyer \(par défaut : 100, max : 200\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `channels` | tableau | Tableau d'objets de canaux de l'espace de travail |

### `slack_list_members`

Liste tous les membres (identifiants d'utilisateurs) dans un canal Slack. À utiliser avec Get User Info pour convertir les identifiants en noms.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `authMethod` | chaîne | Non | Méthode d'authentification : oauth ou bot_token |
| `botToken` | chaîne | Non | Jeton du bot pour Bot personnalisé |
| `channel` | chaîne | Oui | ID du canal dont il faut lister les membres |
| `limit` | nombre | Non | Nombre maximum de membres à renvoyer \(par défaut : 100, max : 200\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `members` | tableau | Tableau d'identifiants d'utilisateurs qui sont membres du canal \(par ex., U1234567890\) |

### `slack_list_users`

Liste tous les utilisateurs dans un espace de travail Slack. Renvoie les profils d'utilisateurs avec noms et avatars.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `authMethod` | chaîne | Non | Méthode d'authentification : oauth ou bot_token |
| `botToken` | chaîne | Non | Jeton du bot pour le Bot personnalisé |
| `includeDeleted` | booléen | Non | Inclure les utilisateurs désactivés/supprimés \(par défaut : false\) |
| `limit` | nombre | Non | Nombre maximum d'utilisateurs à renvoyer \(par défaut : 100, max : 200\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `users` | tableau | Tableau d'objets utilisateur de l'espace de travail |

### `slack_get_user`

Obtenir des informations détaillées sur un utilisateur Slack spécifique à partir de son ID utilisateur.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `authMethod` | chaîne | Non | Méthode d'authentification : oauth ou bot_token |
| `botToken` | chaîne | Non | Jeton du bot pour le Bot personnalisé |
| `userId` | chaîne | Oui | ID utilisateur à rechercher \(par ex., U1234567890\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `user` | objet | Informations détaillées sur l'utilisateur |

### `slack_download`

Télécharger un fichier depuis Slack

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `authMethod` | chaîne | Non | Méthode d'authentification : oauth ou bot_token |
| `botToken` | chaîne | Non | Jeton du bot pour le Bot personnalisé |
| `fileId` | chaîne | Oui | L'ID du fichier à télécharger |
| `fileName` | chaîne | Non | Remplacement optionnel du nom de fichier |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `file` | fichier | Fichier téléchargé stocké dans les fichiers d'exécution |

### `slack_update_message`

Mettre à jour un message précédemment envoyé par le bot dans Slack

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `authMethod` | chaîne | Non | Méthode d'authentification : oauth ou bot_token |
| `botToken` | chaîne | Non | Jeton du bot pour Bot personnalisé |
| `channel` | chaîne | Oui | ID du canal où le message a été publié \(ex. : C1234567890\) |
| `timestamp` | chaîne | Oui | Horodatage du message à mettre à jour \(ex. : 1405894322.002768\) |
| `text` | chaîne | Oui | Nouveau texte du message \(prend en charge le formatage mrkdwn de Slack\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `message` | objet | Objet de message mis à jour complet avec toutes les propriétés renvoyées par Slack |
| `content` | chaîne | Message de succès |
| `metadata` | objet | Métadonnées du message mis à jour |

### `slack_delete_message`

Supprimer un message précédemment envoyé par le bot dans Slack

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `authMethod` | chaîne | Non | Méthode d'authentification : oauth ou bot_token |
| `botToken` | chaîne | Non | Jeton du bot pour Bot personnalisé |
| `channel` | chaîne | Oui | ID du canal où le message a été publié \(ex. : C1234567890\) |
| `timestamp` | chaîne | Oui | Horodatage du message à supprimer \(ex. : 1405894322.002768\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Message de succès |
| `metadata` | objet | Métadonnées du message supprimé |

### `slack_add_reaction`

Ajouter une réaction emoji à un message Slack

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ---------- | ----------- |
| `authMethod` | chaîne | Non | Méthode d'authentification : oauth ou bot_token |
| `botToken` | chaîne | Non | Jeton du bot pour Bot personnalisé |
| `channel` | chaîne | Oui | ID du canal où le message a été publié \(ex. : C1234567890\) |
| `timestamp` | chaîne | Oui | Horodatage du message auquel réagir \(ex. : 1405894322.002768\) |
| `name` | chaîne | Oui | Nom de la réaction emoji \(sans les deux-points, ex. : thumbsup, heart, eyes\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `content` | chaîne | Message de succès |
| `metadata` | objet | Métadonnées de la réaction |

## Remarques

- Catégorie : `tools`
- Type : `slack`
```

--------------------------------------------------------------------------------

---[FILE: sms.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/sms.mdx

```text
---
title: SMS
description: Envoyez des messages SMS en utilisant le service SMS interne
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sms"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
Le bloc SMS vous permet d'envoyer des messages texte directement depuis vos flux de travail en utilisant l'infrastructure d'envoi de SMS de Sim, alimentée par Twilio. Cette intégration vous permet d'envoyer de manière programmatique des notifications, des alertes et d'autres informations importantes sur les appareils mobiles des utilisateurs sans nécessiter de configuration externe ou d'OAuth.

Notre service SMS interne est conçu pour être fiable et facile à utiliser, ce qui le rend idéal pour automatiser les communications et garantir que vos messages atteignent efficacement les destinataires.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Envoyez des messages SMS directement en utilisant le service SMS interne alimenté par Twilio. Aucune configuration externe ou OAuth n'est requise. Parfait pour envoyer des notifications, des alertes ou des messages texte à usage général depuis vos flux de travail. Nécessite des numéros de téléphone valides avec les indicatifs de pays.

## Outils

### `sms_send`

Envoyer un message SMS en utilisant le service SMS interne alimenté par Twilio

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `to` | string | Oui | Numéro de téléphone du destinataire \(inclure l'indicatif du pays, par ex., +1234567890\) |
| `body` | string | Oui | Contenu du message SMS |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si le SMS a été envoyé avec succès |
| `to` | string | Numéro de téléphone du destinataire |
| `body` | string | Contenu du message SMS |

## Remarques

- Catégorie : `tools`
- Type : `sms`
```

--------------------------------------------------------------------------------

---[FILE: smtp.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/smtp.mdx

```text
---
title: SMTP
description: Envoyez des emails via n'importe quel serveur de messagerie SMTP
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="smtp"
  color="#2D3748"
/>

{/* MANUAL-CONTENT-START:intro */}
[SMTP (Simple Mail Transfer Protocol)](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) est la norme fondamentale pour la transmission d'emails sur Internet. En vous connectant à n'importe quel serveur compatible SMTP—comme Gmail, Outlook, ou l'infrastructure de messagerie de votre organisation—vous pouvez envoyer des emails de manière programmatique et automatiser vos communications sortantes.

L'intégration SMTP vous permet de personnaliser entièrement l'envoi d'emails grâce à une connectivité directe au serveur, prenant en charge les cas d'utilisation d'email basiques et avancés. Avec SMTP, vous pouvez contrôler tous les aspects de la livraison des messages, de la gestion des destinataires et du formatage du contenu, ce qui le rend adapté aux notifications transactionnelles, aux envois en masse et à tout flux de travail automatisé nécessitant une livraison robuste d'emails sortants.

**Les fonctionnalités clés disponibles via l'intégration SMTP incluent :**

- **Livraison universelle d'emails :** Envoyez des emails en utilisant n'importe quel serveur SMTP en configurant les paramètres de connexion standard.
- **Expéditeur et destinataires personnalisables :** Spécifiez l'adresse de l'expéditeur, le nom d'affichage, les destinataires principaux, ainsi que les champs CC et BCC.
- **Prise en charge de contenu enrichi :** Envoyez des emails en texte brut ou au format HTML richement formaté selon vos besoins.
- **Pièces jointes :** Incluez plusieurs fichiers en pièces jointes dans les emails sortants.
- **Sécurité flexible :** Connectez-vous en utilisant les protocoles TLS, SSL ou standard (non chiffré) selon ce que prend en charge votre fournisseur SMTP.
- **En-têtes avancés :** Définissez les en-têtes de réponse et d'autres options d'email avancées pour répondre aux flux de messagerie complexes et aux interactions utilisateur.

En intégrant SMTP avec Sim, les agents et les flux de travail peuvent envoyer des emails de manière programmatique dans le cadre de tout processus automatisé—allant de l'envoi de notifications et de confirmations à l'automatisation des communications externes, des rapports et de la livraison de documents. Cela offre une approche hautement flexible et indépendante du fournisseur pour gérer les emails directement au sein de vos processus pilotés par l'IA.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Envoyez des emails en utilisant n'importe quel serveur SMTP (Gmail, Outlook, serveurs personnalisés, etc.). Configurez les paramètres de connexion SMTP et envoyez des emails avec un contrôle total sur le contenu, les destinataires et les pièces jointes.

## Outils

### `smtp_send_mail`

Envoyer des emails via un serveur SMTP

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `smtpHost` | string | Oui | Nom d'hôte du serveur SMTP \(ex., smtp.gmail.com\) |
| `smtpPort` | number | Oui | Port du serveur SMTP \(587 pour TLS, 465 pour SSL\) |
| `smtpUsername` | string | Oui | Nom d'utilisateur pour l'authentification SMTP |
| `smtpPassword` | string | Oui | Mot de passe pour l'authentification SMTP |
| `smtpSecure` | string | Oui | Protocole de sécurité \(TLS, SSL ou Aucun\) |
| `from` | string | Oui | Adresse email de l'expéditeur |
| `to` | string | Oui | Adresse email du destinataire |
| `subject` | string | Oui | Objet de l'email |
| `body` | string | Oui | Contenu du corps de l'email |
| `contentType` | string | Non | Type de contenu \(texte ou html\) |
| `fromName` | string | Non | Nom d'affichage de l'expéditeur |
| `cc` | string | Non | Destinataires en copie \(séparés par des virgules\) |
| `bcc` | string | Non | Destinataires en copie cachée \(séparés par des virgules\) |
| `replyTo` | string | Non | Adresse email de réponse |
| `attachments` | file[] | Non | Fichiers à joindre à l'email |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Indique si l'email a été envoyé avec succès |
| `messageId` | string | ID du message du serveur SMTP |
| `to` | string | Adresse email du destinataire |
| `subject` | string | Objet de l'email |
| `error` | string | Message d'erreur si l'envoi a échoué |

## Notes

- Catégorie : `tools`
- Type : `smtp`
```

--------------------------------------------------------------------------------

````
