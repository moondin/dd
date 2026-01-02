---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 50
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 50 of 97)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - grapesjs-dev
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/grapesjs-dev
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: es.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/es.js

```javascript
const traitInputAttr = { placeholder: 'ej. Texto aquí' };

export default {
  assetManager: {
    addButton: 'Añadir imagen',
    inputPlh: 'http://camino/a/la/imagen.jpg',
    modalTitle: 'Seleccionar imagen',
    uploadTitle: 'Arrastre los archivos aquí o haga clic para cargar',
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'Block Label',
    },
    categories: {
      // 'category-id': 'Category Label',
    },
  },
  domComponents: {
    names: {
      '': 'Caja',
      wrapper: 'Cuerpo',
      text: 'Texto',
      comment: 'Comentario',
      image: 'Imagen',
      video: 'Video',
      label: 'Etiqueta',
      link: 'Vínculo',
      map: 'Mapa',
      tfoot: 'Pie de lista',
      tbody: 'Cuerpo de lista',
      thead: 'Encabezado de lista',
      table: 'Lista',
      row: 'Fila de lista',
      cell: 'Celda de lista',
    },
  },
  deviceManager: {
    device: 'Dispositivos',
    devices: {
      desktop: 'Escritorio',
      tablet: 'Tableta',
      mobileLandscape: 'Mobile Landscape',
      mobilePortrait: 'Mobile Portrait',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Vista previa',
        fullscreen: 'Pantalla completa',
        'sw-visibility': 'Ver componentes',
        'export-template': 'Ver código',
        'open-sm': 'Abrir Administrador de estilos',
        'open-tm': 'Ajustes',
        'open-layers': 'Abrir Aministrador de capas',
        'open-blocks': 'Abrir Bloques',
      },
    },
  },
  selectorManager: {
    label: 'Clases',
    selected: 'Seleccionado',
    emptyState: '- Estado -',
    states: {
      hover: 'Hover',
      active: 'Click',
      'nth-of-type(2n)': 'Par/Impar',
    },
  },
  styleManager: {
    empty: 'Seleccione un elemento antes de usar el Administrador de estilos',
    layer: 'Capa',
    fileButton: 'Imágenes',
    sectors: {
      general: 'General',
      layout: 'Diseño',
      typography: 'Tipografía',
      decorations: 'Decoraciones',
      extra: 'Extras',
      flex: 'Flex',
      dimension: 'Dimensión',
    },
    // The core library generates the name by their `property` name
    properties: {
      float: 'Float',
      display: 'Vista',
      position: 'Posición',
      top: 'Superior',
      right: 'Derecho',
      left: 'Izquierdo',
      bottom: 'Inferior',
      width: 'Ancho',
      height: 'Altura',
      'max-width': 'Max. ancho',
      'max-height': 'Max. altura',
      margin: 'Margen',
      'margin-top': 'Margen Superior',
      'margin-right': 'Margen Derecho',
      'margin-left': 'Margen Izquierdo',
      'margin-bottom': 'Margen Inferior',
      padding: 'Padding',
      'padding-top': 'Padding Superior',
      'padding-left': 'Padding Sol',
      'padding-right': 'Padding Derecho',
      'padding-bottom': 'Padding Inferior',
      'font-family': 'Tipo de letra',
      'font-size': 'Tamaño de fuente',
      'font-weight': 'Espesor',
      'letter-spacing': 'Espacio de letras',
      color: 'Color',
      'line-height': 'Interlineado',
      'text-align': 'Alineación de texto',
      'text-shadow': 'Sombra de texto',
      'text-shadow-h': 'Sombra de texto: horizontal',
      'text-shadow-v': 'Sombra de texto: vertical',
      'text-shadow-blur': 'Desenfoque de sombra de texto',
      'text-shadow-color': 'Color de sombra de fuente',
      'border-top-left': 'Borde Superior Izquierdo',
      'border-top-right': 'Borde Superior Derecho',
      'border-bottom-left': 'Borde Inferior Izquierdo',
      'border-bottom-right': 'Borde Inferior Derecho',
      'border-radius-top-left': 'Borde Redondeado Superior Izquierdo',
      'border-radius-top-right': 'Borde Redondeado Superior Derecho',
      'border-radius-bottom-left': 'Borde Redondeado Inferior Izquierdo',
      'border-radius-bottom-right': 'Borde Redondeado Inferior Derecho',
      'border-radius': 'Borde Redondeado',
      border: 'Bordes',
      'border-width': 'Grosor del Borde',
      'border-style': 'Estilo del Borde',
      'border-color': 'Color de Borde',
      'box-shadow': 'Sombra de caja',
      'box-shadow-h': 'Sombra de caja: horizontal',
      'box-shadow-v': 'Sombra de caja: vertical',
      'box-shadow-blur': 'Desenfoque de sombra de caja',
      'box-shadow-spread': 'Extensión de sombra de caja',
      'box-shadow-color': 'Color de sombra de caja',
      'box-shadow-type': 'Tipo de sombra de caja',
      background: 'Fondo',
      'background-image': 'Imagen de Fondo',
      'background-repeat': 'Repetir fondo',
      'background-position': 'Posición de fondo',
      'background-attachment': 'Plugin de fondo',
      'background-size': 'Tamaño de fondo',
      transition: 'Transición',
      'transition-property': 'Tipo de transición',
      'transition-duration': 'Tiempo de transición',
      'transition-timing-function': 'Función de tiempo de la transición',
      perspective: 'Perspectiva',
      transform: 'Transformación',
      'transform-rotate-x': 'Rotar horizontalmente',
      'transform-rotate-y': 'Rotar verticalmente',
      'transform-rotate-z': 'Rotar profundidad',
      'transform-scale-x': 'Escalar horizontalmente',
      'transform-scale-y': 'Escalar verticalmente',
      'transform-scale-z': 'Escalar profundidad',
      'flex-direction': 'Dirección Flex',
      'flex-wrap': 'Flex wrap',
      'justify-content': 'Ajustar contenido',
      'align-items': 'Alinear elementos',
      'align-content': 'Alinear contenido',
      order: 'Orden',
      'flex-basis': 'Base Flex',
      'flex-grow': 'Crecimiento Flex',
      'flex-shrink': 'Contracción Flex',
      'align-self': 'Alinearse',
      'background-color': 'Color de fondo',
    },
  },
  traitManager: {
    empty: 'Seleccione un elemento antes de usar el Administrador de rasgos',
    label: 'Ajustes de componentes',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        id: 'Identificador',
        alt: 'Título alterno',
        title: 'Título',
        href: 'Vínculo',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'ej. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Esta ventana',
          _blank: 'Nueva ventana',
        },
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: fa.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/fa.js

```javascript
const traitInputAttr = { placeholder: 'متن را اینجا وارد کنید' };

export default {
  assetManager: {
    addButton: 'افزودن تصویر',
    inputPlh: 'http://path/to/the/image.jpg',
    modalTitle: 'انتخاب تصویر',
    uploadTitle: 'فایل را انتخاب کنید یا در این مکان رها کنید',
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'Block Label',
    },
    categories: {
      // 'category-id': 'Category Label',
    },
  },
  domComponents: {
    names: {
      '': 'باکس',
      wrapper: 'یدنه',
      text: 'متن',
      comment: 'اظهار نظر',
      image: 'تصویر',
      video: 'ویدئو',
      label: 'برچسب',
      link: 'پیوند',
      map: 'نقشه',
      tfoot: 'پا جدول',
      tbody: 'بدنه جدول',
      thead: 'سر جدول',
      table: 'جدول',
      row: 'ردیف جدول',
      cell: 'سلول جدول',
    },
  },
  deviceManager: {
    device: 'دستگاه',
    devices: {
      desktop: 'دسک تاپ',
      tablet: 'تبلت',
      mobileLandscape: 'موبایل خوابیده',
      mobilePortrait: 'موبایل ایستاده',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'پیش نمایش',
        fullscreen: 'تمام صفحه',
        'sw-visibility': 'مشاهده اجزاء',
        'export-template': 'نمایش کد',
        'open-sm': 'باز کردن مدیریت استایل',
        'open-tm': 'تنظیمات',
        'open-layers': 'باز کردن مدیریت لایه‌ها',
        'open-blocks': 'باز کردن مدیریت بلوک‌ها',
      },
    },
  },
  selectorManager: {
    label: 'کلاس‌ها',
    selected: 'انتخاب شده',
    emptyState: '- حالت -',
    states: {
      hover: 'هاور',
      active: 'کلیک',
      'nth-of-type(2n)': 'زوج/فرد',
    },
  },
  styleManager: {
    empty: 'قبل از استفاده از مدیریت استایل یک عنصر را انتخاب کنید',
    layer: 'لایه',
    fileButton: 'تصاویر',
    sectors: {
      general: 'کلی',
      layout: 'چیدمان',
      typography: 'شیوه نگارش',
      decorations: 'تزئینات',
      extra: 'اضافی',
      flex: 'فلکس',
      dimension: 'ابعاد',
    },
    // The core library generates the name by their `property` name
    properties: {
      // float: 'Float',
    },
    traitManager: {
      empty: 'قبل از استفاده از مدیر ویژگی ، یک عنصر را انتخاب کنید',
      label: 'تنظیمات جزء',
      traits: {
        // The core library generates the name by their `name` property
        labels: {
          // id: 'Id',
          // alt: 'Alt',
          // title: 'Title',
          // href: 'Href',
        },
        // In a simple trait, like text input, these are used on input attributes
        attributes: {
          id: traitInputAttr,
          alt: traitInputAttr,
          title: traitInputAttr,
          href: { placeholder: 'مثال: https://google.com' },
        },
        // In a trait like select, these are used to translate option names
        options: {
          target: {
            false: 'پنجره فعلی',
            _blank: 'پنجره جدید',
          },
        },
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: fr.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/fr.js

```javascript
const traitInputAttr = { placeholder: 'ex. Votre texte ici' };

export default {
  assetManager: {
    addButton: 'Ajouter image',
    inputPlh: 'http://chemin/vers/image.jpg',
    modalTitle: 'Sélectionner une image',
    uploadTitle: 'Déposez des fichiers ici ou cliquez pour envoyer des fichiers',
  },
  blockManager: {
    labels: {
      // 'block-id': 'Identifiant du bloc',
    },
    categories: {
      // 'category-id': 'Identifiant de la catégorie',
    },
  },
  domComponents: {
    names: {
      '': 'Boîte',
      wrapper: 'Corps',
      text: 'Texte',
      comment: 'Commentaire',
      image: 'Image',
      video: 'Vidéo',
      label: 'Libellé',
      link: 'Lien',
      map: 'Carte',
      tfoot: 'Pied de tableau',
      tbody: 'Corps de tableau',
      thead: 'En-tête de tableau',
      table: 'Tableau',
      row: 'Ligne tableau',
      cell: 'Cellule tableau',
    },
  },
  deviceManager: {
    device: 'Appareil',
    devices: {
      desktop: 'Ordinateur de bureau',
      tablet: 'Tablette',
      mobileLandscape: 'Mobile format paysage',
      mobilePortrait: 'Mobile format portrait',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Prévisualisation',
        fullscreen: 'Plein écran',
        'sw-visibility': 'Voir les composants',
        'export-template': 'Voir le code',
        'open-sm': 'Ouvrir le gestionnaire de style',
        'open-tm': 'Paramètres',
        'open-layers': 'Ouvrir le gestionnaire de calques',
        'open-blocks': 'Ouvrir le gestionnaire de blocs',
      },
    },
  },
  selectorManager: {
    label: 'Classes',
    selected: 'Sélectionné',
    emptyState: '- État -',
    states: {
      hover: 'Survol',
      active: 'Clic',
      'nth-of-type(2n)': 'Paire/Impaire',
    },
  },
  styleManager: {
    empty: "Veuillez sélectionner un élément avant d'utiliser le gestionnaire de style",
    layer: 'Calque',
    fileButton: 'Images',
    sectors: {
      general: 'Général',
      layout: 'Disposition',
      typography: 'Typographie',
      decorations: 'Décorations',
      extra: 'Extra',
      flex: 'Flex',
      dimension: 'Dimension',
    },
    // The core library generates the name by their `property` name
    properties: {
      float: 'Flottant',
      display: 'Affichage',
      position: 'Position',
      top: 'Supérieur',
      right: 'Droite',
      left: 'Gauche',
      bottom: 'Inférieur',
      width: 'Largeur',
      height: 'Hauteur',
      'max-width': 'Largeur max.',
      'max-height': 'Hauteur max.',
      margin: 'Marge externe',
      'margin-top': 'Marge externe supérieure',
      'margin-right': 'Marge externe droite',
      'margin-left': 'Marge externe gauche',
      'margin-bottom': 'Marge externe inférieure',
      padding: 'Marge interne',
      'padding-top': 'Marge interne supérieure',
      'padding-left': 'Marge interne gauche',
      'padding-right': 'Marge interne droite',
      'padding-bottom': 'Marge interne inférieure',
      'font-family': 'Police de caractères',
      'font-size': 'Taille de police',
      'font-weight': 'Épaisseur de police',
      'letter-spacing': 'Espacement entre les lettres',
      color: 'Couleur',
      'line-height': 'Espacement des lignes',
      'text-align': 'Alignement de texte',
      'text-shadow': 'Ombre de texte',
      'text-shadow-h': 'Ombre de texte: horizontale',
      'text-shadow-v': 'Ombre de texte: verticale',
      'text-shadow-blur': 'Flou ombre de texte',
      'text-shadow-color': 'Couleur ombre de texte',
      'border-top-left': 'Bord supérieur gauche',
      'border-top-right': 'Bord supérieur droit',
      'border-bottom-left': 'Bord inférieur gauche',
      'border-bottom-right': 'Bord inférieur droit',
      'border-radius-top-left': 'Bord supérieur arrondi gauche',
      'border-radius-top-right': 'Bord supérieur arrondi droit',
      'border-radius-bottom-left': 'Bord arrondi inférieur gauche',
      'border-radius-bottom-right': 'Bord arrondi inférieur droit',
      'border-radius': 'Bord arrondi',
      border: 'Bordure',
      'border-width': 'Largeur de bordure',
      'border-style': 'Style de bordure',
      'border-color': 'Couleur de bordure',
      'box-shadow': 'Ombre de boîte',
      'box-shadow-h': 'Ombre de boîte: horizontale',
      'box-shadow-v': 'Ombre de boîte: verticale',
      'box-shadow-blur': 'Flou ombre de boîte',
      'box-shadow-spread': "Extension d'ombre de boîte",
      'box-shadow-color': "Couleur d'ombre de boîte",
      'box-shadow-type': "Type d'ombre de boîte",
      background: 'Fond',
      'background-image': 'Image de fond',
      'background-repeat': 'Répéter fond',
      'background-position': 'Position du fond',
      'background-attachment': 'Plugin de fond',
      'background-size': 'Taille du fond',
      'background-color': 'Couleur de fond',
      transition: 'Transition',
      'transition-property': 'Type de transition',
      'transition-duration': 'Durée de la transition',
      'transition-timing-function': 'Timing transition',
      perspective: 'Perspective',
      transform: 'Transformation',
      'transform-rotate-x': 'Rotation horizontale',
      'transform-rotate-y': 'Rotation verticale',
      'transform-rotate-z': 'Rotation profondeur',
      'transform-scale-x': 'Échelle horizontale',
      'transform-scale-y': 'Échelle verticale',
      'transform-scale-z': 'Échelle profondeur',
      'flex-direction': 'Direction Flex',
      'flex-wrap': 'Flex wrap',
      'justify-content': 'Ajuster contenu',
      'align-items': 'Aligner éléments',
      'align-content': 'Aligner contenu',
      order: 'Ordre',
      'flex-basis': 'Base Flex',
      'flex-grow': 'Flex grow',
      'flex-shrink': 'Flex shrink',
      'align-self': 'Aligner',
    },
  },
  traitManager: {
    empty: 'Veuillez sélectionner un élément pour modifier les paramètres de cet élément',
    label: 'Paramètres composant',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        id: 'Identifiant',
        alt: 'Texte alternatif',
        title: 'Titre',
        href: 'Source lien',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'eg. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Cette fenêtre',
          _blank: 'Nouvelle fenêtre',
        },
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: he.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/he.js

```javascript
const traitInputAttr = { placeholder: 'eg. Text here' };

export default {
  assetManager: {
    addButton: 'הוספת תמונה',
    inputPlh: 'http://path/to/the/image.jpg',
    modalTitle: 'בחירת תמונה',
    uploadTitle: 'גררו קבצים לכאן או לחצו להעלאה',
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'תווית בלוק',
    },
    categories: {
      // 'category-id': 'תווית קטגוריה',
    },
  },
  domComponents: {
    names: {
      '': 'קופסה',
      wrapper: 'גוף',
      text: 'טקסט',
      comment: 'תגובה',
      image: 'תמונה',
      video: 'וידיאו',
      label: 'תווית',
      link: 'קישור',
      map: 'מפה',
      tfoot: 'תחתית טבלה',
      tbody: 'גוף טבלה',
      thead: 'ראש טבלה',
      table: 'טבלה',
      row: 'שורת טבלה',
      cell: 'תא טבלה',
    },
  },
  deviceManager: {
    device: 'מכשיר',
    devices: {
      desktop: 'מחשב שולחני',
      tablet: 'טאבלט',
      mobileLandscape: 'תצוגה רוחבית',
      mobilePortrait: 'תצוגה ישרה',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'תצוגה מקדימה',
        fullscreen: 'מסך מלא',
        'sw-visibility': 'צפייה ברכיבים',
        'export-template': 'צפייה בקוד',
        'open-sm': 'פתיחת ניהול סגנון',
        'open-tm': 'הגדרות',
        'open-layers': 'פתיחת מנהל השכבות',
        'open-blocks': 'פתיחת בלוקים',
      },
    },
  },
  selectorManager: {
    label: 'מחלקות',
    selected: 'נבחרו',
    emptyState: '- מצב -',
    states: {
      hover: 'מעבר על',
      active: 'לחיצה',
      'nth-of-type(2n)': 'זוגי/אי זוגי',
    },
  },
  styleManager: {
    empty: 'בחרו אלמנט לפני השימוש במנהל הסגנון',
    layer: 'שכבה',
    fileButton: 'תמונות',
    sectors: {
      general: 'כללי',
      layout: 'מבנה',
      typography: 'טיפוגרפיה',
      decorations: 'קישוטים',
      extra: 'נוסף',
      flex: 'גמיש',
      dimension: 'מימד',
    },
    // Default names for sub properties in Composite and Stack types.
    // Other labels are generated directly from their property names (eg. 'font-size' will be 'Font size').
    properties: {
      'text-shadow-h': 'X',
      'text-shadow-v': 'Y',
      'text-shadow-blur': 'מטושטש',
      'text-shadow-color': 'צבע',
      'box-shadow-h': 'X',
      'box-shadow-v': 'Y',
      'box-shadow-blur': 'מטושטש',
      'box-shadow-spread': 'פיזור',
      'box-shadow-color': 'צבע',
      'box-shadow-type': 'סוג',
      'margin-top-sub': 'עליון',
      'margin-right-sub': 'ימין',
      'margin-bottom-sub': 'תחתון',
      'margin-left-sub': 'שמאל',
      'padding-top-sub': 'עליון',
      'padding-right-sub': 'ימין',
      'padding-bottom-sub': 'תחתון',
      'padding-left-sub': 'שמאל',
      'border-width-sub': 'רוחב',
      'border-style-sub': 'סגנון',
      'border-color-sub': 'צבע',
      'border-top-left-radius-sub': 'שמאל עליון',
      'border-top-right-radius-sub': 'ימין עליון',
      'border-bottom-right-radius-sub': 'ימין תחתון',
      'border-bottom-left-radius-sub': 'שמאל תחלון',
      'transform-rotate-x': 'סיבוב X',
      'transform-rotate-y': 'סיבוב Y',
      'transform-rotate-z': 'סיבוב Z',
      'transform-scale-x': 'קנה מידה X',
      'transform-scale-y': 'קנה מידה Y',
      'transform-scale-z': 'קנה מידה Z',
      'transition-property-sub': 'תכונה',
      'transition-duration-sub': 'משך',
      'transition-timing-function-sub': 'תזמון',
      'background-image-sub': 'תמונה',
      'background-repeat-sub': 'חזרה',
      'background-position-sub': 'מיקום',
      'background-attachment-sub': 'נספח',
      'background-size-sub': 'גודל',
    },
    // Translate options in style properties
    // options: {
    //   float: { // Id of the property
    //     ...
    //     left: 'שמאל', // {option id}: {Option label}
    //   }
    // }
  },
  traitManager: {
    empty: 'בחר אלמנט לפני השימוש במנהל התכונות',
    label: 'הגדרות רכיב',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        // id: 'Id',
        // alt: 'Alt',
        // title: 'Title',
        // href: 'Href',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'דוג. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'חלון נוכחי',
          _blank: 'חלון חדש',
        },
      },
    },
  },
  storageManager: {
    recover: 'רוצה לשחזר שינויים שטרם נשמרו?',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: id.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/id.js

```javascript
const traitInputAttr = { placeholder: 'cth. Ketik disini' };

export default {
  assetManager: {
    addButton: 'Tambah gambar',
    inputPlh: 'http://path/menuju/gambar.jpg',
    modalTitle: 'Pilih Gambar',
    uploadTitle: 'Tarik gambar kesini atau klik upload',
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'Block Label',
    },
    categories: {
      // 'category-id': 'Category Label',
    },
  },
  domComponents: {
    names: {
      '': 'Kotak',
      wrapper: 'Badan',
      text: 'Teks',
      comment: 'Komentar',
      image: 'Gambar',
      video: 'Video',
      label: 'Label',
      link: 'Link',
      map: 'Peta',
      tfoot: 'Kaki tabel',
      tbody: 'Badan tabel',
      thead: 'Kepala tabel',
      table: 'Tabel',
      row: 'Baris tabel',
      cell: 'Cell tabel',
    },
  },
  deviceManager: {
    device: 'Perangkat',
    devices: {
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobileLandscape: 'Mobile Landscape',
      mobilePortrait: 'Mobile Portrait',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Pra-tayang',
        fullscreen: 'Tampilan penuh',
        'sw-visibility': 'Lihat komponen',
        'export-template': 'Lihat kode',
        'open-sm': 'Buka Manajemen Style',
        'open-tm': 'Pengaturan',
        'open-layers': 'Buka Layer Manager',
        'open-blocks': 'Buka Blocks',
      },
    },
  },
  selectorManager: {
    label: 'Class',
    selected: 'Terpilih',
    emptyState: '- State -',
    states: {
      hover: 'Hover',
      active: 'Klik',
      'nth-of-type(2n)': 'Rata/Ganjil',
    },
  },
  styleManager: {
    empty: 'Pilih elemen sebelum menggunakan Manajemen Style',
    layer: 'Layer',
    fileButton: 'Gambar',
    sectors: {
      general: 'Umum',
      layout: 'Pemetaan',
      typography: 'Tipografi',
      decorations: 'Dekorasi',
      extra: 'Ekstra',
      flex: 'Flex',
      dimension: 'Dimensi',
    },
    // Default names for sub properties in Composite and Stack types.
    // Other labels are generated directly from their property names (eg. 'font-size' will be 'Font size').
    properties: {
      'text-shadow-h': 'X',
      'text-shadow-v': 'Y',
      'text-shadow-blur': 'Blur',
      'text-shadow-color': 'Warna',
      'box-shadow-h': 'X',
      'box-shadow-v': 'Y',
      'box-shadow-blur': 'Blur',
      'box-shadow-spread': 'Spread',
      'box-shadow-color': 'Warna',
      'box-shadow-type': 'Tipe',
      'margin-top-sub': 'Atas',
      'margin-right-sub': 'Kanan',
      'margin-bottom-sub': 'Bawah',
      'margin-left-sub': 'Kiri',
      'padding-top-sub': 'Atas',
      'padding-right-sub': 'Kanan',
      'padding-bottom-sub': 'Bawah',
      'padding-left-sub': 'Kiri',
      'border-width-sub': 'Panjang',
      'border-style-sub': 'Gaya',
      'border-color-sub': 'Warna',
      'border-top-left-radius-sub': 'Atas Kiri',
      'border-top-right-radius-sub': 'Atas Kanan',
      'border-bottom-right-radius-sub': 'Bawah Kanan',
      'border-bottom-left-radius-sub': 'Bawah Kiri',
      'transform-rotate-x': 'Putar X',
      'transform-rotate-y': 'Putar Y',
      'transform-rotate-z': 'Putar Z',
      'transform-scale-x': 'Scale X',
      'transform-scale-y': 'Scale Y',
      'transform-scale-z': 'Scale Z',
      'transition-property-sub': 'Properti',
      'transition-duration-sub': 'Durasi',
      'transition-timing-function-sub': 'Timing',
      'background-image-sub': 'Gambar',
      'background-repeat-sub': 'Berulang',
      'background-position-sub': 'Posisi',
      'background-attachment-sub': 'Lampiran',
      'background-size-sub': 'Ukuran',
    },
    // Translate options in style properties
    // options: {
    //   float: { // Id of the property
    //     ...
    //     left: 'Left', // {option id}: {Option label}
    //   }
    // }
  },
  traitManager: {
    empty: 'Pilih elemen terlebih dulu sebelum menggunakan Manajemen Trait',
    label: 'Pengaturan komponen',
    categories: {
      categoryId: 'Label kategori',
    },
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        title: 'Judul',
        href: 'Url (href)',
        // id: 'Id',
        // alt: 'Alt',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'cth. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Jendela ini',
          _blank: 'Jendela baru',
        },
      },
    },
  },
  storageManager: {
    recover: 'Apakah kamu ingin mengembalikan draft yang belum tersimpan?',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: it.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/it.js

```javascript
const traitInputAttr = { placeholder: 'es. Testo' };

export default {
  assetManager: {
    addButton: 'Aggiungi immagine',
    inputPlh: 'http://percorso/immagine.jpg',
    modalTitle: 'Seleziona immagine',
    uploadTitle: 'Trascina qui i tuoi file o clicca per caricarli',
  },
  domComponents: {
    names: {
      '': 'Elemento',
      wrapper: 'Contenitore',
      text: 'Testo',
      comment: 'Commento',
      image: 'Immagine',
      video: 'Video',
      label: 'Label',
      link: 'Link',
      map: 'Mappa',
      tfoot: 'Tabella piede',
      tbody: 'Tabella corpo',
      thead: 'Tabella testa',
      table: 'Tabella',
      row: 'Tabella riga',
      cell: 'Tabella colonna',
    },
  },
  deviceManager: {
    device: 'Dispositivo',
    devices: {
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobileLandscape: 'Mobile panoramica',
      mobilePortrait: 'Mobile',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Anteprima',
        fullscreen: 'Schermo intero',
        'sw-visibility': 'Mostra componenti',
        'export-template': 'Mostra codice',
        'open-sm': 'Mostra Style Manager',
        'open-tm': 'Configurazioni',
        'open-layers': 'Mostra Livelli',
        'open-blocks': 'Mostra Blocchi',
      },
    },
  },
  selectorManager: {
    label: 'Classi',
    selected: 'Selezionato',
    emptyState: '- Stati -',
    states: {
      hover: 'Hover',
      active: 'Click',
      'nth-of-type(2n)': 'Pari/Dispari',
    },
  },
  styleManager: {
    empty: 'Seleziona un elemento prima di usare il Style Manager',
    layer: 'Livello',
    fileButton: 'Immagini',
    sectors: {
      general: 'Generale',
      layout: 'Layout',
      typography: 'Tipografia',
      decorations: 'Decorazioni',
      extra: 'Extra',
      flex: 'Flex',
      dimension: 'Dimensioni',
    },
    // The core library generates the name by their `property` name
    properties: {
      // float: 'Float',
    },
  },
  traitManager: {
    empty: 'Seleziona un elemento prima di usare il Trait Manager',
    label: 'Configurazione componente',
    traits: {
      labels: {
        id: 'Id',
        alt: 'Alt',
        title: 'Titolo',
      },
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'es. https://google.com' },
      },
      options: {
        target: {
          false: 'Questa finestra',
          _blank: 'Nuova finestra',
        },
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: ko.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/ko.js

```javascript
const traitInputAttr = { placeholder: 'eg. 텍스트 입력' };

export default {
  assetManager: {
    addButton: '이미지 추가',
    inputPlh: 'http://path/to/the/image.jpg',
    modalTitle: '이미지 선택',
    uploadTitle: '원하는 파일을 여기에 놓거나 업로드를 위해 클릭',
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'Block Label',
    },
    categories: {
      // 'category-id': 'Category Label',
    },
  },
  domComponents: {
    names: {
      '': '상자',
      wrapper: 'Body',
      text: '텍스트',
      comment: 'Comment',
      image: '이미지',
      video: '동영상',
      label: 'Label',
      link: '링크',
      map: '지도',
      tfoot: 'Table foot',
      tbody: 'Table body',
      thead: 'Table head',
      table: 'Table',
      row: 'Table row',
      cell: 'Table cell',
    },
  },
  deviceManager: {
    device: 'Device',
    devices: {
      desktop: '데스크탑',
      tablet: '태블릿',
      mobileLandscape: '모바일 환경',
      mobilePortrait: '모바일 Portrait',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: '미리보기',
        fullscreen: '전체화면',
        'sw-visibility': 'components 보기',
        'export-template': '코드 보기',
        'open-sm': 'Style Manager 열기',
        'open-tm': '설정',
        'open-layers': 'Layer Manager 열기',
        'open-blocks': 'Blocks 열기',
      },
    },
  },
  selectorManager: {
    label: 'Classes',
    selected: '선택된',
    emptyState: '- 상태 -',
    states: {
      hover: 'Hover',
      active: 'Click',
      'nth-of-type(2n)': '짝수/홀수',
    },
  },
  styleManager: {
    empty: 'Style Manager 사용하려면, 먼저 element를 선택해주세요',
    layer: '레이어',
    fileButton: 'Images',
    sectors: {
      general: '기본설정',
      layout: '레이아웃',
      typography: '글꼴',
      decorations: '꾸미기',
      extra: 'Extra',
      flex: 'Flex',
      dimension: '크기 및 위치',
    },
    // The core library generates the name by their `property` name
    properties: {
      // float: 'Float',
    },
  },
  traitManager: {
    empty: 'Trait Manager 사용하려면, 먼저 element를 선택해주세요',
    label: 'Component 설정',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        // id: 'Id',
        // alt: 'Alt',
        // title: 'Title',
        // href: 'Href',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'eg. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: '현재 창',
          _blank: '새 창',
        },
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: nb.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/nb.js

```javascript
const traitInputAttr = { placeholder: 'f.eks. Tekst her' };

export default {
  assetManager: {
    addButton: 'Legg til bilde',
    inputPlh: 'http://vei/til/bilde.jpg',
    modalTitle: 'Velg bilde',
    uploadTitle: 'Slipp filer her eller trykk for å laste opp',
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'Block Label',
    },
    categories: {
      // 'category-id': 'Category Label',
    },
  },
  domComponents: {
    names: {
      '': 'Boks',
      wrapper: 'Innhold',
      text: 'Tekst',
      comment: 'Kommentar',
      image: 'Bilde',
      video: 'Video',
      label: 'Etikett',
      link: 'Lenke',
      map: 'Kart',
      tfoot: 'Tabellfot',
      tbody: 'Tabellinnhold',
      thead: 'Tabellhode',
      table: 'Tabell',
      row: 'Tabellrad',
      cell: 'Tabellcelle',
    },
  },
  deviceManager: {
    device: 'Enhet',
    devices: {
      desktop: 'Skrivebord',
      tablet: 'Nettbrett',
      mobileLandscape: 'Mobil landskapsmodus',
      mobilePortrait: 'Mobil portrettmodus',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Forhåndsvisning',
        fullscreen: 'Fullskjerm',
        'sw-visibility': 'Vis komponenter',
        'export-template': 'Vis kode',
        'open-sm': 'Åpne stiladministrator',
        'open-tm': 'Innstillinger',
        'open-layers': 'Åpne lagadministrator',
        'open-blocks': 'Åpne blokker',
      },
    },
  },
  selectorManager: {
    label: 'Klasser',
    selected: 'Valgt',
    emptyState: '- Tilstand -',
    states: {
      hover: 'Hover',
      active: 'Trykk',
      'nth-of-type(2n)': 'Partall/Oddetall',
    },
  },
  styleManager: {
    empty: 'Velg et element før du bruker stiladministrator',
    layer: 'Lag',
    fileButton: 'Bilder',
    sectors: {
      general: 'Generelt',
      layout: 'Utforming',
      typography: 'Typografi',
      decorations: 'Dekorasjoner',
      extra: 'Ekstra',
      flex: 'Flex',
      dimension: 'Dimensjon',
    },
    // Default names for sub properties in Composite and Stack types.
    // Other labels are generated directly from their property names (eg. 'font-size' will be 'Font size').
    properties: {
      'text-shadow-h': 'X',
      'text-shadow-v': 'Y',
      'text-shadow-blur': 'Uklarhet',
      'text-shadow-color': 'Farge',
      'box-shadow-h': 'X',
      'box-shadow-v': 'Y',
      'box-shadow-blur': 'Uklarhet',
      'box-shadow-spread': 'Spredning',
      'box-shadow-color': 'Farge',
      'box-shadow-type': 'Type',
      'margin-top-sub': 'Topp',
      'margin-right-sub': 'Høyre',
      'margin-bottom-sub': 'Bunn',
      'margin-left-sub': 'Venstre',
      'padding-top-sub': 'Topp',
      'padding-right-sub': 'Høyre',
      'padding-bottom-sub': 'Bunn',
      'padding-left-sub': 'Venstre',
      'border-width-sub': 'Bredde',
      'border-style-sub': 'Stil',
      'border-color-sub': 'Farge',
      'border-top-left-radius-sub': 'Venstre topp',
      'border-top-right-radius-sub': 'Høyre topp',
      'border-bottom-right-radius-sub': 'Høyre bunn',
      'border-bottom-left-radius-sub': 'Venstre bunn',
      'transform-rotate-x': 'Roter X',
      'transform-rotate-y': 'Roter Y',
      'transform-rotate-z': 'Roter Z',
      'transform-scale-x': 'Skaler X',
      'transform-scale-y': 'Skaler Y',
      'transform-scale-z': 'Skaler Z',
      'transition-property-sub': 'Egenskap',
      'transition-duration-sub': 'Varighet',
      'transition-timing-function-sub': 'Timing',
      'background-image-sub': 'Bilde',
      'background-repeat-sub': 'Gjenta',
      'background-position-sub': 'Posisjon',
      'background-attachment-sub': 'Vedlegg',
      'background-size-sub': 'Størrelse',
    },
    // Translate options in style properties
    // options: {
    //   float: { // Id of the property
    //     ...
    //     left: 'Left', // {option id}: {Option label}
    //   }
    // }
  },
  traitManager: {
    empty: 'Velg et element før du bruker egenskapsadministrator',
    label: 'Komponentinnstillinger',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        // id: 'Id',
        // alt: 'Alt',
        // title: 'Title',
        // href: 'Href',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'f.eks. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Dette vinduet',
          _blank: 'Nytt vindu',
        },
      },
    },
  },
  storageManager: {
    recover: 'Vil du gjenopprette ulagrede endringer?',
  },
};
```

--------------------------------------------------------------------------------

````
