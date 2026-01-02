---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 188
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 188 of 933)

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

---[FILE: wordpress.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/wordpress.mdx

```text
---
title: WordPress
description: Gérer le contenu WordPress
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wordpress"
  color="#21759B"
/>

{/* MANUAL-CONTENT-START:intro */}
[WordPress](https://wordpress.org/) est le système de gestion de contenu open-source le plus utilisé au monde, facilitant la publication et la gestion de sites web, blogs et tous types de contenus en ligne. Avec WordPress, vous pouvez créer et mettre à jour des articles ou des pages, organiser votre contenu avec des catégories et des étiquettes, gérer des fichiers multimédias, modérer des commentaires et gérer des comptes utilisateurs, vous permettant ainsi de faire fonctionner aussi bien des blogs personnels que des sites d'entreprise complexes.

L'intégration de Sim avec WordPress permet à vos agents d'automatiser des tâches essentielles du site web. Vous pouvez créer par programmation de nouveaux articles de blog avec des titres, contenus, catégories, étiquettes et images à la une spécifiques. La mise à jour d'articles existants (comme la modification de leur contenu, titre ou statut de publication) est simple. Vous pouvez également publier ou enregistrer du contenu comme brouillon, gérer des pages statiques, travailler avec des téléchargements de médias, superviser les commentaires et attribuer du contenu aux taxonomies organisationnelles pertinentes.

En connectant WordPress à vos automatisations, Sim permet à vos agents de rationaliser la publication de contenu, les flux de travail éditoriaux et la gestion quotidienne du site, vous aidant ainsi à maintenir votre site web à jour, organisé et sécurisé sans effort manuel.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez avec WordPress pour créer, mettre à jour et gérer des articles, pages, médias, commentaires, catégories, étiquettes et utilisateurs. Prend en charge les sites WordPress.com via OAuth et les sites WordPress auto-hébergés en utilisant l'authentification par mots de passe d'application.

## Outils

### `wordpress_create_post`

Créer un nouvel article de blog sur WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | chaîne | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `title` | chaîne | Oui | Titre de l'article |
| `content` | chaîne | Non | Contenu de l'article \(HTML ou texte brut\) |
| `status` | chaîne | Non | Statut de l'article : publish, draft, pending, private, ou future |
| `excerpt` | chaîne | Non | Extrait de l'article |
| `categories` | chaîne | Non | IDs de catégories séparés par des virgules |
| `tags` | chaîne | Non | IDs d'étiquettes séparés par des virgules |
| `featuredMedia` | nombre | Non | ID du média de l'image à la une |
| `slug` | chaîne | Non | Slug URL pour l'article |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `post` | object | L'article créé |

### `wordpress_update_post`

Mettre à jour un article de blog existant sur WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `postId` | number | Oui | L'ID de l'article à mettre à jour |
| `title` | string | Non | Titre de l'article |
| `content` | string | Non | Contenu de l'article \(HTML ou texte brut\) |
| `status` | string | Non | Statut de l'article : publish, draft, pending, private, ou future |
| `excerpt` | string | Non | Extrait de l'article |
| `categories` | string | Non | IDs de catégories séparés par des virgules |
| `tags` | string | Non | IDs de tags séparés par des virgules |
| `featuredMedia` | number | Non | ID du média de l'image à la une |
| `slug` | string | Non | Slug URL pour l'article |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `post` | object | L'article mis à jour |

### `wordpress_delete_post`

Supprimer un article de blog de WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `postId` | number | Oui | L'ID de l'article à supprimer |
| `force` | boolean | Non | Contourner la corbeille et forcer la suppression définitive |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Indique si l'article a été supprimé |
| `post` | object | L'article supprimé |

### `wordpress_get_post`

Obtenir un seul article de blog WordPress.com par ID

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine (par ex., 12345678 ou monsite.wordpress.com) |
| `postId` | number | Oui | L'ID de l'article à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `post` | object | L'article récupéré |

### `wordpress_list_posts`

Lister les articles de blog WordPress.com avec filtres optionnels

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine (par ex., 12345678 ou monsite.wordpress.com) |
| `perPage` | number | Non | Nombre d'articles par page (par défaut : 10, max : 100) |
| `page` | number | Non | Numéro de page pour la pagination |
| `status` | string | Non | Filtre par statut d'article : publish, draft, pending, private |
| `author` | number | Non | Filtrer par ID d'auteur |
| `categories` | string | Non | IDs de catégories séparés par des virgules pour filtrer |
| `tags` | string | Non | IDs de tags séparés par des virgules pour filtrer |
| `search` | string | Non | Terme de recherche pour filtrer les articles |
| `orderBy` | string | Non | Trier par champ : date, id, title, slug, modified |
| `order` | string | Non | Direction du tri : asc ou desc |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `posts` | array | Liste des articles |

### `wordpress_create_page`

Créer une nouvelle page sur WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `title` | string | Oui | Titre de la page |
| `content` | string | Non | Contenu de la page \(HTML ou texte brut\) |
| `status` | string | Non | Statut de la page : publish, draft, pending, private |
| `excerpt` | string | Non | Extrait de la page |
| `parent` | number | Non | ID de la page parente pour les pages hiérarchiques |
| `menuOrder` | number | Non | Ordre dans le menu des pages |
| `featuredMedia` | number | Non | ID du média de l'image mise en avant |
| `slug` | string | Non | Slug URL pour la page |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `page` | object | La page créée |

### `wordpress_update_page`

Mettre à jour une page existante sur WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `pageId` | number | Oui | L'ID de la page à mettre à jour |
| `title` | string | Non | Titre de la page |
| `content` | string | Non | Contenu de la page \(HTML ou texte brut\) |
| `status` | string | Non | Statut de la page : publish, draft, pending, private |
| `excerpt` | string | Non | Extrait de la page |
| `parent` | number | Non | ID de la page parente pour les pages hiérarchiques |
| `menuOrder` | number | Non | Ordre dans le menu des pages |
| `featuredMedia` | number | Non | ID du média de l'image mise en avant |
| `slug` | string | Non | Slug URL pour la page |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `page` | objet | La page mise à jour |

### `wordpress_delete_page`

Supprimer une page de WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | chaîne | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `pageId` | nombre | Oui | L'ID de la page à supprimer |
| `force` | booléen | Non | Contourner la corbeille et forcer la suppression définitive |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | booléen | Indique si la page a été supprimée |
| `page` | objet | La page supprimée |

### `wordpress_get_page`

Obtenir une seule page de WordPress.com par ID

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | chaîne | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `pageId` | nombre | Oui | L'ID de la page à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `page` | objet | La page récupérée |

### `wordpress_list_pages`

Lister les pages de WordPress.com avec filtres optionnels

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | chaîne | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `perPage` | nombre | Non | Nombre de pages par requête \(par défaut : 10, max : 100\) |
| `page` | nombre | Non | Numéro de page pour la pagination |
| `status` | chaîne | Non | Filtre de statut de page : publish, draft, pending, private |
| `parent` | nombre | Non | Filtrer par ID de page parente |
| `search` | chaîne | Non | Terme de recherche pour filtrer les pages |
| `orderBy` | chaîne | Non | Trier par champ : date, id, title, slug, modified, menu_order |
| `order` | chaîne | Non | Direction de tri : asc ou desc |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `pages` | array | Liste des pages |

### `wordpress_upload_media`

Télécharger un fichier média (image, vidéo, document) sur WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | chaîne | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `file` | fichier | Non | Fichier à télécharger \(objet UserFile\) |
| `filename` | chaîne | Non | Remplacement optionnel du nom de fichier \(ex., image.jpg\) |
| `title` | chaîne | Non | Titre du média |
| `caption` | chaîne | Non | Légende du média |
| `altText` | chaîne | Non | Texte alternatif pour l'accessibilité |
| `description` | chaîne | Non | Description du média |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `media` | object | L'élément média téléchargé |

### `wordpress_get_media`

Obtenir un élément média unique de WordPress.com par ID

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `mediaId` | number | Oui | L'ID de l'élément média à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `media` | object | L'élément média récupéré |

### `wordpress_list_media`

Lister les éléments multimédias de la bibliothèque multimédia WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | chaîne | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `perPage` | nombre | Non | Nombre d'éléments multimédias par requête \(par défaut : 10, max : 100\) |
| `page` | nombre | Non | Numéro de page pour la pagination |
| `search` | chaîne | Non | Terme de recherche pour filtrer les médias |
| `mediaType` | chaîne | Non | Filtrer par type de média : image, vidéo, audio, application |
| `mimeType` | chaîne | Non | Filtrer par type MIME spécifique \(ex., image/jpeg\) |
| `orderBy` | chaîne | Non | Trier par champ : date, id, titre, slug |
| `order` | chaîne | Non | Direction du tri : asc ou desc |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `media` | tableau | Liste des éléments multimédias |

### `wordpress_delete_media`

Supprimer un élément multimédia de WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | chaîne | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `mediaId` | nombre | Oui | L'ID de l'élément multimédia à supprimer |
| `force` | booléen | Non | Forcer la suppression \(les médias n'ont pas de corbeille, donc la suppression est permanente\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Indique si le média a été supprimé |
| `media` | object | L'élément média supprimé |

### `wordpress_create_comment`

Créer un nouveau commentaire sur un article WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `postId` | number | Oui | L'ID de l'article à commenter |
| `content` | string | Oui | Contenu du commentaire |
| `parent` | number | Non | ID du commentaire parent pour les réponses |
| `authorName` | string | Non | Nom d'affichage de l'auteur du commentaire |
| `authorEmail` | string | Non | Email de l'auteur du commentaire |
| `authorUrl` | string | Non | URL de l'auteur du commentaire |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `comment` | object | Le commentaire créé |

### `wordpress_list_comments`

Lister les commentaires de WordPress.com avec filtres optionnels

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `perPage` | number | Non | Nombre de commentaires par requête \(par défaut : 10, max : 100\) |
| `page` | number | Non | Numéro de page pour la pagination |
| `postId` | number | Non | Filtrer par ID d'article |
| `status` | string | Non | Filtrer par statut de commentaire : approved, hold, spam, trash |
| `search` | string | Non | Terme de recherche pour filtrer les commentaires |
| `orderBy` | string | Non | Trier par champ : date, id, parent |
| `order` | string | Non | Direction du tri : asc ou desc |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `comments` | array | Liste des commentaires |

### `wordpress_update_comment`

Mettre à jour un commentaire dans WordPress.com (contenu ou statut)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `commentId` | number | Oui | L'ID du commentaire à mettre à jour |
| `content` | string | Non | Contenu mis à jour du commentaire |
| `status` | string | Non | Statut du commentaire : approved, hold, spam, trash |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `comment` | object | Le commentaire mis à jour |

### `wordpress_delete_comment`

Supprimer un commentaire de WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `commentId` | number | Oui | L'ID du commentaire à supprimer |
| `force` | boolean | Non | Contourner la corbeille et forcer la suppression définitive |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Indique si le commentaire a été supprimé |
| `comment` | object | Le commentaire supprimé |

### `wordpress_create_category`

Créer une nouvelle catégorie dans WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine (par ex., 12345678 ou monsite.wordpress.com) |
| `name` | string | Oui | Nom de la catégorie |
| `description` | string | Non | Description de la catégorie |
| `parent` | number | Non | ID de la catégorie parente pour les catégories hiérarchiques |
| `slug` | string | Non | Slug URL pour la catégorie |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `category` | object | La catégorie créée |

### `wordpress_list_categories`

Lister les catégories de WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine (par ex., 12345678 ou monsite.wordpress.com) |
| `perPage` | number | Non | Nombre de catégories par requête (par défaut : 10, max : 100) |
| `page` | number | Non | Numéro de page pour la pagination |
| `search` | string | Non | Terme de recherche pour filtrer les catégories |
| `order` | string | Non | Direction de tri : asc ou desc |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `categories` | array | Liste des catégories |

### `wordpress_create_tag`

Créer un nouveau tag dans WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine (par ex., 12345678 ou monsite.wordpress.com) |
| `name` | string | Oui | Nom du tag |
| `description` | string | Non | Description du tag |
| `slug` | string | Non | Slug URL pour le tag |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `tag` | object | Le tag créé |

### `wordpress_list_tags`

Lister les tags de WordPress.com

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `perPage` | number | Non | Nombre de tags par requête \(par défaut : 10, max : 100\) |
| `page` | number | Non | Numéro de page pour la pagination |
| `search` | string | Non | Terme de recherche pour filtrer les tags |
| `order` | string | Non | Direction de tri : asc ou desc |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `tags` | array | Liste des tags |

### `wordpress_get_current_user`

Obtenir des informations sur l'utilisateur WordPress.com actuellement authentifié

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | L'utilisateur actuel |

### `wordpress_list_users`

Lister les utilisateurs de WordPress.com (nécessite des privilèges d'administrateur)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `perPage` | number | Non | Nombre d'utilisateurs par requête \(par défaut : 10, max : 100\) |
| `page` | number | Non | Numéro de page pour la pagination |
| `search` | string | Non | Terme de recherche pour filtrer les utilisateurs |
| `roles` | string | Non | Noms de rôles séparés par des virgules pour filtrer |
| `order` | string | Non | Direction de tri : asc ou desc |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `users` | array | Liste des utilisateurs |

### `wordpress_get_user`

Obtenir un utilisateur spécifique de WordPress.com par ID

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `userId` | number | Oui | L'ID de l'utilisateur à récupérer |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | L'utilisateur récupéré |

### `wordpress_search_content`

Rechercher dans tous les types de contenu sur WordPress.com (articles, pages, médias)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Oui | ID du site WordPress.com ou domaine \(ex., 12345678 ou monsite.wordpress.com\) |
| `query` | string | Oui | Requête de recherche |
| `perPage` | number | Non | Nombre de résultats par requête \(par défaut : 10, max : 100\) |
| `page` | number | Non | Numéro de page pour la pagination |
| `type` | string | Non | Filtrer par type de contenu : post, page, attachment |
| `subtype` | string | Non | Filtrer par slug de type de publication \(ex., post, page\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | Résultats de recherche |

## Notes

- Catégorie : `tools`
- Type : `wordpress`
```

--------------------------------------------------------------------------------

---[FILE: x.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/x.mdx

```text
---
title: X
description: Interagir avec X
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="x"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[X](https://x.com/) (anciennement Twitter) est une plateforme de médias sociaux populaire qui permet la communication en temps réel, le partage de contenu et l'engagement avec des audiences du monde entier.

L'intégration X dans Sim utilise l'authentification OAuth pour se connecter en toute sécurité à l'API X, permettant à vos agents d'interagir avec la plateforme de manière programmatique. Cette implémentation OAuth assure un accès sécurisé aux fonctionnalités de X tout en préservant la confidentialité et la sécurité des utilisateurs.

Avec l'intégration X, vos agents peuvent :

- **Publier du contenu** : créer de nouveaux tweets, répondre aux conversations existantes ou partager des médias directement depuis vos workflows
- **Surveiller les conversations** : suivre les mentions, les mots-clés ou des comptes spécifiques pour rester informé des discussions pertinentes
- **Interagir avec les audiences** : répondre automatiquement aux mentions, aux messages directs ou à des déclencheurs spécifiques
- **Analyser les tendances** : recueillir des informations sur les sujets tendance, les hashtags ou les modèles d'engagement des utilisateurs
- **Rechercher des informations** : chercher du contenu spécifique, des profils d'utilisateurs ou des conversations pour éclairer les décisions des agents

Dans Sim, l'intégration X permet des scénarios sophistiqués d'automatisation des médias sociaux. Vos agents peuvent surveiller les mentions de marque et y répondre de manière appropriée, planifier et publier du contenu basé sur des déclencheurs spécifiques, effectuer une veille sociale pour des études de marché, ou créer des expériences interactives qui couvrent à la fois l'IA conversationnelle et l'engagement sur les médias sociaux. En connectant Sim avec X via OAuth, vous pouvez construire des agents intelligents qui maintiennent une présence cohérente et réactive sur les médias sociaux tout en respectant les politiques de la plateforme et les meilleures pratiques d'utilisation de l'API.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez X dans le flux de travail. Peut publier un nouveau tweet, obtenir les détails d'un tweet, rechercher des tweets et consulter le profil utilisateur. Nécessite OAuth.

## Outils

### `x_write`

Publiez de nouveaux tweets, répondez à des tweets ou créez des sondages sur X (Twitter)

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `text` | chaîne | Oui | Le contenu textuel de votre tweet |
| `replyTo` | chaîne | Non | ID du tweet auquel répondre |
| `mediaIds` | tableau | Non | Tableau des ID de médias à joindre au tweet |
| `poll` | objet | Non | Configuration du sondage pour le tweet |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `tweet` | objet | Les données du tweet nouvellement créé |

### `x_read`

Lisez les détails des tweets, y compris les réponses et le contexte de la conversation

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `tweetId` | chaîne | Oui | ID du tweet à lire |
| `includeReplies` | booléen | Non | Indique s'il faut inclure les réponses au tweet |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `tweet` | objet | Les données principales du tweet |

### `x_search`

Recherchez des tweets à l'aide de mots-clés, de hashtags ou de requêtes avancées

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `query` | chaîne | Oui | Requête de recherche \(prend en charge les opérateurs de recherche X\) |
| `maxResults` | nombre | Non | Nombre maximum de résultats à renvoyer \(par défaut : 10, max : 100\) |
| `startTime` | chaîne | Non | Heure de début pour la recherche \(format ISO 8601\) |
| `endTime` | chaîne | Non | Heure de fin pour la recherche \(format ISO 8601\) |
| `sortOrder` | chaîne | Non | Ordre de tri des résultats \(récence ou pertinence\) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `tweets` | array | Tableau de tweets correspondant à la requête de recherche |

### `x_user`

Obtenir les informations du profil utilisateur

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `username` | string | Oui | Nom d'utilisateur à rechercher (sans le symbole @) |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | Informations du profil utilisateur X |

## Notes

- Catégorie : `tools`
- Type : `x`
```

--------------------------------------------------------------------------------

---[FILE: youtube.mdx]---
Location: sim-main/apps/docs/content/docs/fr/tools/youtube.mdx

```text
---
title: YouTube
description: Interagir avec les vidéos, chaînes et playlists YouTube
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="youtube"
  color="#FF0000"
/>

{/* MANUAL-CONTENT-START:intro */}
[YouTube](https://www.youtube.com/) est la plus grande plateforme de partage de vidéos au monde, hébergeant des milliards de vidéos et servant plus de 2 milliards d'utilisateurs connectés mensuellement.

Avec les capacités étendues de l'API YouTube, vous pouvez :

- **Rechercher du contenu** : trouver des vidéos pertinentes dans la vaste bibliothèque de YouTube en utilisant des mots-clés, filtres et paramètres spécifiques
- **Accéder aux métadonnées** : récupérer des informations détaillées sur les vidéos, y compris les titres, descriptions, nombres de vues et métriques d'engagement
- **Analyser les tendances** : identifier le contenu populaire et les sujets tendance dans des catégories ou régions spécifiques
- **Extraire des insights** : recueillir des données sur les préférences du public, la performance du contenu et les modèles d'engagement

Dans Sim, l'intégration YouTube permet à vos agents de rechercher et d'analyser programmatiquement le contenu YouTube dans le cadre de leurs flux de travail. Cela permet des scénarios d'automatisation puissants qui nécessitent des informations vidéo à jour. Vos agents peuvent rechercher des vidéos instructives, étudier les tendances de contenu, recueillir des informations à partir de chaînes éducatives ou surveiller des créateurs spécifiques pour de nouveaux téléchargements. Cette intégration comble le fossé entre vos flux de travail IA et le plus grand référentiel vidéo du monde, permettant des automatisations plus sophistiquées et conscientes du contenu. En connectant Sim avec YouTube, vous pouvez créer des agents qui restent à jour avec les dernières informations, fournissent des réponses plus précises et apportent plus de valeur aux utilisateurs - le tout sans nécessiter d'intervention manuelle ou de code personnalisé.
{/* MANUAL-CONTENT-END */}

## Instructions d'utilisation

Intégrez YouTube dans le flux de travail. Permet de rechercher des vidéos, obtenir les détails d'une vidéo, obtenir des informations sur une chaîne, récupérer toutes les vidéos d'une chaîne, obtenir les playlists d'une chaîne, récupérer les éléments d'une playlist, trouver des vidéos similaires et obtenir les commentaires d'une vidéo.

## Outils

### `youtube_search`

Recherchez des vidéos sur YouTube en utilisant l'API YouTube Data. Prend en charge le filtrage avancé par chaîne, plage de dates, durée, catégorie, qualité, sous-titres et plus encore.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `query` | chaîne | Oui | Requête de recherche pour les vidéos YouTube |
| `maxResults` | nombre | Non | Nombre maximum de vidéos à retourner (1-50) |
| `apiKey` | chaîne | Oui | Clé API YouTube |
| `channelId` | chaîne | Non | Filtrer les résultats pour un ID de chaîne YouTube spécifique |
| `publishedAfter` | chaîne | Non | Ne renvoyer que les vidéos publiées après cette date (format RFC 3339 : "2024-01-01T00:00:00Z") |
| `publishedBefore` | chaîne | Non | Ne renvoyer que les vidéos publiées avant cette date (format RFC 3339 : "2024-01-01T00:00:00Z") |
| `videoDuration` | chaîne | Non | Filtrer par durée de vidéo : "short" (moins de 4 minutes), "medium" (4-20 minutes), "long" (plus de 20 minutes), "any" |
| `order` | chaîne | Non | Trier les résultats par : "date", "rating", "relevance" (par défaut), "title", "videoCount", "viewCount" |
| `videoCategoryId` | chaîne | Non | Filtrer par ID de catégorie YouTube (ex. : "10" pour Musique, "20" pour Jeux vidéo) |
| `videoDefinition` | chaîne | Non | Filtrer par qualité vidéo : "high" (HD), "standard", "any" |
| `videoCaption` | chaîne | Non | Filtrer par disponibilité des sous-titres : "closedCaption" (avec sous-titres), "none" (sans sous-titres), "any" |
| `regionCode` | chaîne | Non | Renvoyer des résultats pertinents pour une région spécifique (code pays ISO 3166-1 alpha-2, ex. : "US", "FR") |
| `relevanceLanguage` | chaîne | Non | Renvoyer les résultats les plus pertinents pour une langue (code ISO 639-1, ex. : "en", "fr") |
| `safeSearch` | chaîne | Non | Niveau de filtrage du contenu : "moderate" (par défaut), "none", "strict" |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `items` | tableau | Tableau de vidéos YouTube correspondant à la requête de recherche |

### `youtube_video_details`

Obtenir des informations détaillées sur une vidéo YouTube spécifique.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `videoId` | chaîne | Oui | ID de la vidéo YouTube |
| `apiKey` | chaîne | Oui | Clé API YouTube |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `videoId` | chaîne | ID de la vidéo YouTube |
| `title` | chaîne | Titre de la vidéo |
| `description` | chaîne | Description de la vidéo |
| `channelId` | chaîne | ID de la chaîne |
| `channelTitle` | chaîne | Nom de la chaîne |
| `publishedAt` | chaîne | Date et heure de publication |
| `duration` | chaîne | Durée de la vidéo au format ISO 8601 |
| `viewCount` | nombre | Nombre de vues |
| `likeCount` | nombre | Nombre de j'aime |
| `commentCount` | nombre | Nombre de commentaires |
| `thumbnail` | chaîne | URL de la miniature de la vidéo |
| `tags` | tableau | Tags de la vidéo |

### `youtube_channel_info`

Obtenir des informations détaillées sur une chaîne YouTube.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `channelId` | chaîne | Non | ID de la chaîne YouTube \(utilisez soit channelId soit username\) |
| `username` | chaîne | Non | Nom d'utilisateur de la chaîne YouTube \(utilisez soit channelId soit username\) |
| `apiKey` | chaîne | Oui | Clé API YouTube |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `channelId` | chaîne | ID de la chaîne YouTube |
| `title` | chaîne | Nom de la chaîne |
| `description` | chaîne | Description de la chaîne |
| `subscriberCount` | nombre | Nombre d'abonnés |
| `videoCount` | nombre | Nombre de vidéos |
| `viewCount` | nombre | Nombre total de vues de la chaîne |
| `publishedAt` | chaîne | Date de création de la chaîne |
| `thumbnail` | chaîne | URL de la miniature de la chaîne |
| `customUrl` | chaîne | URL personnalisée de la chaîne |

### `youtube_channel_videos`

Obtenir toutes les vidéos d'une chaîne YouTube spécifique, avec options de tri.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `channelId` | chaîne | Oui | ID de la chaîne YouTube dont il faut récupérer les vidéos |
| `maxResults` | nombre | Non | Nombre maximum de vidéos à retourner \(1-50\) |
| `order` | chaîne | Non | Ordre de tri : "date" \(plus récentes d'abord\), "rating", "relevance", "title", "viewCount" |
| `pageToken` | chaîne | Non | Jeton de page pour la pagination |
| `apiKey` | chaîne | Oui | Clé API YouTube |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `items` | tableau | Tableau des vidéos de la chaîne |

### `youtube_channel_playlists`

Obtenir toutes les playlists d'une chaîne YouTube spécifique.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `channelId` | chaîne | Oui | ID de la chaîne YouTube dont il faut récupérer les playlists |
| `maxResults` | nombre | Non | Nombre maximum de playlists à retourner \(1-50\) |
| `pageToken` | chaîne | Non | Jeton de page pour la pagination |
| `apiKey` | chaîne | Oui | Clé API YouTube |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `items` | tableau | Tableau des playlists de la chaîne |

### `youtube_playlist_items`

Obtenir les vidéos d'une playlist YouTube.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `playlistId` | chaîne | Oui | ID de la playlist YouTube |
| `maxResults` | nombre | Non | Nombre maximum de vidéos à retourner |
| `pageToken` | chaîne | Non | Jeton de page pour la pagination |
| `apiKey` | chaîne | Oui | Clé API YouTube |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `items` | tableau | Tableau de vidéos dans la playlist |

### `youtube_comments`

Obtenir les commentaires d'une vidéo YouTube.

#### Entrée

| Paramètre | Type | Obligatoire | Description |
| --------- | ---- | ----------- | ----------- |
| `videoId` | chaîne | Oui | ID de la vidéo YouTube |
| `maxResults` | nombre | Non | Nombre maximum de commentaires à retourner |
| `order` | chaîne | Non | Ordre des commentaires : time (chronologique) ou relevance (pertinence) |
| `pageToken` | chaîne | Non | Jeton de page pour la pagination |
| `apiKey` | chaîne | Oui | Clé API YouTube |

#### Sortie

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `items` | tableau | Tableau des commentaires de la vidéo |

## Notes

- Catégorie : `tools`
- Type : `youtube`
```

--------------------------------------------------------------------------------

````
