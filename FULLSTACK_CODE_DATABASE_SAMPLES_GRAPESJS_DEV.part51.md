---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 51
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 51 of 97)

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

---[FILE: nl.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/nl.js

```javascript
const traitInputAttr = { placeholder: 'bijv. Tekst hier' };

export default {
  assetManager: {
    addButton: 'Afbeelding toevoegen',
    inputPlh: 'http://path/to/the/image.jpg',
    modalTitle: 'Selecteer afbeelding',
    uploadTitle: 'Zet bestanden hier neer of klik om te uploaden',
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'Block Label',
    },
    categories: {
      // 'category-id': 'Categorie Label',
    },
  },
  domComponents: {
    names: {
      '': 'Box',
      wrapper: 'Body',
      text: 'Tekst',
      comment: 'Commentaar',
      image: 'Afbeelding',
      video: 'Video',
      label: 'Label',
      link: 'Link',
      map: 'Kaart',
      tfoot: 'Tabel foot',
      tbody: 'Tabel body',
      thead: 'Tabel head',
      table: 'Tabel',
      row: 'Tabel rij',
      cell: 'Tabel cel',
    },
  },
  deviceManager: {
    device: 'Apparaat',
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
        preview: 'Voorbeeld',
        fullscreen: 'Volledig scherm',
        'sw-visibility': 'Bekijk componenten',
        'export-template': 'Bekijk code',
        'open-sm': 'Open Stijl Manager',
        'open-tm': 'Instellingen',
        'open-layers': 'Open Laag Manager',
        'open-blocks': 'Open Blocks',
      },
    },
  },
  selectorManager: {
    label: 'Classes',
    selected: 'Selecteer',
    emptyState: '- Status -',
    states: {
      hover: 'Zweven',
      active: 'Klik',
      'nth-of-type(2n)': 'Even/oneven',
    },
  },
  styleManager: {
    empty: 'Selecteer een element voordat je Stijl Manager kan gebruiken.',
    layer: 'Laag',
    fileButton: 'Afbeeldingen',
    sectors: {
      general: 'Algemeen',
      layout: 'Indeling',
      typography: 'Typografie',
      decorations: 'Decoraties',
      extra: 'Extra',
      flex: 'Flex',
      dimension: 'Afmetingen',
    },
    // The core library generates the name by their `property` name
    properties: {
      float: 'Uitlijning',
      display: 'Weergave',
      position: 'Positie',
      top: 'Boven',
      right: 'Rechts',
      left: 'Links',
      bottom: 'Onder',
      width: 'Breedte',
      height: 'Hoogte',
      'max-width': 'Breedte max.',
      'max-height': 'Hoogte max.',
      margin: 'Buiten afstand',
      'margin-top': 'Buiten afstand boven',
      'margin-right': 'Buiten afstand rechts',
      'margin-left': 'Buiten afstand links',
      'margin-bottom': 'Buiten afstand onder',
      padding: 'Binnen afstand',
      'padding-top': 'Binnen afstand boven',
      'padding-left': 'Binnen afstand links',
      'padding-right': 'Binnen afstand rechts',
      'padding-bottom': 'Binnen afstand onder',
      'font-family': 'Lettertype',
      'font-size': 'Lettergrootte',
      'font-weight': 'Letter dikte',
      'letter-spacing': 'Letter afstand',
      color: 'Kleur',
      'line-height': 'Regelafstand',
      'text-align': 'Tekst richting',
      'text-shadow': 'Tekst schaduw',
      'text-shadow-h': 'Tekst schaduw: horizontaal',
      'text-shadow-v': 'Tekst schaduw: verticaal',
      'text-shadow-blur': 'Tekst schaduw: vervagen',
      'text-shadow-color': 'Tekst schaduw: kleur',
      'border-top-left': 'Rand boven links',
      'border-top-right': 'Rand boven rechts',
      'border-bottom-left': 'Rand onder links',
      'border-bottom-right': 'Rand onder rechts',
      'border-radius-top-left': 'Rand straal boven links',
      'border-radius-top-right': 'Rand straal boven rechts',
      'border-radius-bottom-left': 'Rand straal onder links',
      'border-radius-bottom-right': 'Rand straal onder rechts',
      'border-radius': 'Rand straal',
      border: 'Rand',
      'border-width': 'Rand breedte',
      'border-style': 'Rand stijl',
      'border-color': 'Rand kleur',
      'box-shadow': 'Box schaduw',
      'box-shadow-h': 'Box schaduw: Horizontaal',
      'box-shadow-v': 'Box schaduw: Verticaal',
      'box-shadow-blur': 'Box schaduw: Vervagen',
      'box-shadow-spread': 'Box schaduw: Verspreiding',
      'box-shadow-color': 'Box schaduw: Kleur',
      'box-shadow-type': 'Box schaduw: Type',
      background: 'Achtergrond',
      'background-image': 'Achtergrond afbeelding',
      'background-repeat': 'Achtergrond herhalen',
      'background-position': 'Achtergrond positie',
      'background-attachment': 'Achtergrond bijlage',
      'background-size': 'Achtergrond grootte',
      'background-color': 'Achtergrond kleur',
      transition: 'Overgang',
      'transition-property': 'Overgang: Type',
      'transition-duration': 'Overgang: Duur',
      'transition-timing-function': 'Overgang: Timing',
      perspective: 'Perspectief',
      transform: 'Transformatie',
      'transform-rotate-x': 'Transformatie: Rotatie x',
      'transform-rotate-y': 'Transformatie: Rotatie y',
      'transform-rotate-z': 'Transformatie: Rotatie z',
      'transform-scale-x': 'Transformatie: Schalen x',
      'transform-scale-y': 'Transformatie: Schalen y',
      'transform-scale-z': 'Transformatie: Schalen z',
      'flex-direction': 'Uitlijning Flex',
      'flex-wrap': 'Flex wrap',
      'justify-content': 'Uitlijning',
      'align-items': 'Element uitlijning',
      'align-content': 'Content uitlijning',
      order: 'Volgorde',
      'flex-basis': 'Flex basis',
      'flex-grow': 'Flex groei',
      'flex-shrink': 'Flex krimp',
      'align-self': 'Lijn jezelf uit',
    },
  },
  traitManager: {
    empty: 'Selecteer een element voordat je Trait Manager kan gebruiken.',
    label: 'Component instellingen',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        id: 'ID',
        alt: 'Tekst alternatief',
        title: 'Titel',
        href: 'Link',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'Bijv. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Dit scherm',
          _blank: 'Nieuw scherm',
        },
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: pl.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/pl.js

```javascript
const traitInputAttr = { placeholder: 'Wpisz tutaj' };

export default {
  assetManager: {
    addButton: 'Dodaj obrazek',
    inputPlh: 'http://path/to/the/image.jpg',
    modalTitle: 'Wybierz obrazek',
    uploadTitle: 'Wybierz lub przeciągnij plik z dysku',
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
      '': 'Blok',
      wrapper: 'Body',
      text: 'Tekst',
      comment: 'Komentarz',
      image: 'Obrazek',
      video: 'Wideo',
      label: 'Etykieta',
      link: 'Odnośnik',
      map: 'Mapa',
      tfoot: 'Stopka tabeli',
      tbody: 'Ciało tabeli',
      thead: 'Nagłówek tabeli',
      table: 'Tabela',
      row: 'Wiersz',
      cell: 'Komórka',
    },
  },
  deviceManager: {
    device: 'Urządzenie',
    devices: {
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobileLandscape: 'Telefon Poziomo',
      mobilePortrait: 'Telefon Pionowo',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Podgląd',
        fullscreen: 'Pełen ekran',
        'sw-visibility': 'Pokaż linie',
        'export-template': 'Zobacz źródło',
        'open-sm': 'Edytuj style i atrybuty CSS',
        'open-tm': 'Ustawienia elementu',
        'open-layers': 'Warstwy szablonu',
        'open-blocks': 'Komponenty',
      },
    },
  },
  selectorManager: {
    label: 'Klasy CSS',
    selected: 'Wybrane',
    emptyState: '- wybierz -',
    states: {
      hover: 'Hover',
      active: 'Click',
      'nth-of-type(2n)': 'Tylko parzyste',
    },
  },
  styleManager: {
    empty: 'Wybierz element aby edytować jego atrybuty',
    layer: 'Warstwa',
    fileButton: 'Obrazki',
    sectors: {
      general: 'Główne',
      layout: 'Szablon',
      typography: 'Typografia',
      decorations: 'Dekoracje',
      extra: 'Dodatki',
      flex: 'Flex',
      dimension: 'Wymiary',
    },
    // The core library generates the name by their `property` name
    properties: {
      float: 'Wyrównanie',
      display: 'Wyświetlanie',
      position: 'Pozycja',
      top: 'Góra',
      right: 'Prawo',
      bottom: 'Dół',
      left: 'Lewo',
      width: 'Szerokość',
      'min-width': 'Min. szerokość',
      'max-width': 'Maks. szerokość',
      height: 'Wysokość',
      'min-height': 'Min. wysokość',
      'max-height': 'Maks. wysokość',
      margin: 'Margines',
      'margin-top': 'Margines górny',
      'margin-right': 'Margines prawy',
      'margin-bottom': 'Margines dolny',
      'margin-left': 'Margines lewy',
      padding: 'Odstęp wewnętrzny',
      'padding-top': 'Odstęp górny',
      'padding-right': 'Odstęp prawy',
      'padding-bottom': 'Odstęp dolny',
      'padding-left': 'Odstęp lewy',
      'font-family': 'Krój czcionki',
      'font-size': 'Rozmiar',
      'font-weight': 'Grubość czcionki',
      'letter-spacing': 'Odstęp liter',
      'line-height': 'Wysokość wiersza',
      color: 'Kolor',
      'text-shadow': 'Cień tekstu',
      'text-align': 'Wyrównanie',
      'text-shadow-h': 'Przes. poziome',
      'text-shadow-v': 'Przes. pionowe',
      'text-shadow-blur': 'Rozmycie',
      'text-shadow-color': 'Kolor',
      'border-radius': 'Zaokrąglenie',
      'border-top-left-radius': 'Lewy górny róg',
      'border-top-right-radius': 'Prawy górny róg',
      'border-bottom-left-radius': 'Lewy dolny róg',
      'border-bottom-right-radius': 'Prawy dolny róg',
      border: 'Obramowanie',
      'border-width': 'Szerokość',
      'border-style': 'Styl',
      'border-color': 'Kolor',
      'box-shadow': 'Cień',
      'box-shadow-h': 'Przes. poziome',
      'box-shadow-v': 'Przes. pionowe',
      'box-shadow-blur': 'Rozmycie',
      'box-shadow-spread': 'Rozszerzanie',
      'box-shadow-color': 'Kolor',
      'box-shadow-type': 'Rodzaj',
      background: 'Tło',
      'background-image': 'Obrazek',
      'background-repeat': 'Powtarzanie',
      'background-position': 'Pozycja',
      'background-attachment': 'Przypięcie',
      'background-size': 'Rozmiar',
      'background-color': 'Kolor',
      transition: 'Efekty przejścia',
      'transition-property': 'Dotyczy atrybutu',
      'transition-duration': 'Czas trwania',
      'transition-timing-function': 'Funkcja czasu',
      perspective: 'Perspektywa',
      transform: 'Transformacje',
      'transform-rotate-x': 'Obrót osi X',
      'transform-rotate-y': 'Obrót osi Y',
      'transform-rotate-z': 'Obrót osi Z',
      'transform-scale-x': 'Skala osi X',
      'transform-scale-y': 'Skala osi Y',
      'transform-scale-z': 'Skala osi Z',
    },
  },
  traitManager: {
    empty: 'Wybierz element aby edytować jego ustawienia',
    label: 'Ustawienia elementu',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        id: 'Identyfikator',
        alt: 'Tekst alternatywny',
        title: 'Tytuł',
        href: 'Adres odnośnika',
        target: 'Cel',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'np. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Te okno',
          _blank: 'Nowe okno',
        },
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: pt.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/pt.js

```javascript
const traitInputAttr = { placeholder: 'ex: Insira o texto' };

export default {
  assetManager: {
    addButton: 'Adicionar imagem',
    inputPlh: 'http://caminho/para/a/imagem.jpg',
    modalTitle: 'Selecionar imagem',
    uploadTitle: 'Solte os arquivos aqui ou clique para enviar',
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
      '': 'Box',
      wrapper: 'Corpo',
      text: 'Texto',
      comment: 'Comentário',
      image: 'Imagem',
      video: 'Vídeo',
      label: 'Label',
      link: 'Link',
      map: 'Mapa',
      tfoot: 'Rodapé da tabela',
      tbody: 'Corpo da tabela',
      thead: 'Cabeçalho da tabela',
      table: 'Tabela',
      row: 'Linha da tabela',
      cell: 'Célula da tabela',
      section: 'Seção',
      body: 'Corpo',
    },
  },
  deviceManager: {
    device: 'Dispositivo',
    devices: {
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobileLandscape: 'Celular, modo panorâmico',
      mobilePortrait: 'Celular, modo retrato',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Pré-visualização',
        fullscreen: 'Tela cheia',
        'sw-visibility': 'Ver componentes',
        'export-template': 'Ver código',
        'open-sm': 'Abrir gerenciador de estilos',
        'open-tm': 'Configurações',
        'open-layers': 'Abrir gerenciador de camadas',
        'open-blocks': 'Abrir blocos',
      },
    },
  },
  selectorManager: {
    label: 'Classes',
    selected: 'Selecionado',
    emptyState: '- Estado -',
    states: {
      hover: 'Hover',
      active: 'Click',
      'nth-of-type(2n)': 'Even/Odd',
    },
  },
  styleManager: {
    empty: 'Selecione um elemento para usar o gerenciador de estilos',
    layer: 'Camada',
    fileButton: 'Imagens',
    sectors: {
      general: 'Geral',
      layout: 'Disposição',
      typography: 'Tipografia',
      decorations: 'Decorações',
      extra: 'Extra',
      flex: 'Flex',
      dimension: 'Dimensão',
    },
    // The core library generates the name by their `property` name
    properties: {
      float: 'Float',
      display: 'Exibição',
      position: 'Posição',
      top: 'Topo',
      right: 'Direita',
      left: 'Esquerda',
      bottom: 'Inferior',
      width: 'Largura',
      height: 'Altura',
      'max-width': 'Largura Max.',
      'max-height': 'Altura Max.',
      margin: 'Margem',
      'margin-top-sub': 'Superior',
      'margin-right-sub': 'Direita',
      'margin-left-sub': 'Esquerda',
      'margin-bottom-sub': 'Inferior',
      padding: 'Padding',
      'padding-top-sub': 'Superior',
      'padding-left-sub': 'Esquerda',
      'padding-right-sub': 'Direita',
      'padding-bottom-sub': 'Inferior',
      'font-family': 'Tipo de letra',
      'font-size': 'Tamanho da fonte',
      'font-weight': 'Espessura da fonte',
      'letter-spacing': 'Espaço entre letras',
      color: 'Cor',
      'line-height': 'Altura da linha',
      'text-align': 'Alinhamento do texto',
      'text-shadow': 'Sombra do texto',
      'text-shadow-h': 'Sombra do texto: horizontal',
      'text-shadow-v': 'Sombra do texto: vertical',
      'text-shadow-blur': 'Desfoque da sombra do texto',
      'text-shadow-color': 'Cor da sombra da fonte',
      'border-top-left': 'Borda superior a esquerda',
      'border-top-right': 'Borda superior a direita',
      'border-bottom-left': 'Borda inferior a esquerda',
      'border-bottom-right': 'Borda inferior a direita',
      'border-top-left-radius-sub': 'Superior esquerda',
      'border-top-right-radius-sub': 'Superior direita',
      'border-bottom-right-radius-sub': 'Inferior direita',
      'border-bottom-left-radius-sub': 'Inferior esquerda',
      'border-radius': 'Raio da borda',
      border: 'Borda',
      'border-width-sub': 'Largura',
      'border-style-sub': 'Estilo',
      'border-color-sub': 'Cor',
      'box-shadow': 'Sombra da box',
      'box-shadow-h': 'Sombra da box: horizontal',
      'box-shadow-v': 'Sombra da box: vertical',
      'box-shadow-blur': 'Desfoque da sombra da box',
      'box-shadow-spread': 'Extensão da sombra da box',
      'box-shadow-color': 'Cor da sombra da box',
      'box-shadow-type': 'Tipo de sombra da box',
      background: 'Fundo',
      'background-color': 'Cor de fundo',
      'background-image': 'Imagem de fundo',
      'background-repeat': 'Repetir fundo',
      'background-position': 'Posição do fundo',
      'background-attachment': 'Plugin de fundo',
      'background-size': 'Tamanho do fundo',
      opacity: 'Opacidade',
      transition: 'Transição',
      'transition-property': 'Tipo de transição',
      'transition-duration': 'Tempo de transição',
      'transition-timing-function': 'Função do tempo da transição',
      perspective: 'Perspectiva',
      transform: 'Transformação',
      'transform-rotate-x': 'Rotacionar horizontalmente',
      'transform-rotate-y': 'Rotacionar verticalmente',
      'transform-rotate-z': 'Rotacionar profundidade',
      'transform-scale-x': 'Escalar horizontalmente',
      'transform-scale-y': 'Escalar verticalmente',
      'transform-scale-z': 'Escalar profundidade',
      'flex-direction': 'Direção Flex',
      'flex-wrap': 'Flex wrap',
      'justify-content': 'Ajustar conteúdo',
      'align-items': 'Alinhar elementos',
      'align-content': 'Alinhar conteúdo',
      order: 'Ordem',
      'flex-basis': 'Base Flex',
      'flex-grow': 'Crescimento Flex',
      'flex-shrink': 'Contração Flex',
      'align-self': 'Alinhar-se',
    },
  },
  traitManager: {
    empty: 'Selecione um elemento para usar o gerenciador de características',
    label: 'Configurações do componente',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        // id: 'Id',
        // alt: 'Alt',
        title: 'Título',
        href: 'Link',
        target: 'Abrir em',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'ex: https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Esta janela',
          _blank: 'Nova janela',
        },
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: ru.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/ru.js

```javascript
const traitInputAttr = { placeholder: 'Прим. Текст здесь' };

export default {
  assetManager: {
    addButton: 'Добавить изображение',
    inputPlh: 'http://path/to/the/image.jpg',
    modalTitle: 'Выбрать изображение',
    uploadTitle: 'Перетащите файлы сюда или нажмите, чтобы загрузить',
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
      '': 'Область',
      wrapper: 'Тело',
      text: 'Текст',
      comment: 'Комментарий',
      image: 'Изобраение',
      video: 'Визео',
      label: 'Ярлык',
      link: 'Ссылка',
      map: 'Карта',
      tfoot: 'Подвал таблицы',
      tbody: 'Тело таблицы',
      thead: 'Заголовок таблицы',
      table: 'Таблица',
      row: 'Строка таблицы',
      cell: 'Ячейка таблицы',
    },
  },
  deviceManager: {
    device: 'Устройство',
    devices: {
      desktop: 'Десктоп',
      tablet: 'Планшет',
      mobileLandscape: 'Мобильный горизонтально',
      mobilePortrait: 'Мобильный верикально',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Предварительный просмотр',
        fullscreen: 'Полноэкранный режим',
        'sw-visibility': 'Просмотр компонентов',
        'export-template': 'Просмотреть код',
        'open-sm': 'Открыть диспетчер стилей',
        'open-tm': 'Настройки',
        'open-layers': 'Открыть диспетчер слоев',
        'open-blocks': 'Открытые блоки',
      },
    },
  },
  selectorManager: {
    label: 'Классы',
    selected: 'Выбрано',
    emptyState: '- Состояние -',
    states: {
      hover: 'Наведение',
      active: 'Клик',
      'nth-of-type(2n)': 'Четный/Нечетный',
    },
  },
  styleManager: {
    empty: 'Выберите элемент перед использованием Диспетчера стилей',
    layer: 'Слой',
    fileButton: 'Изображения',
    sectors: {
      general: 'Общее',
      layout: 'Макет',
      typography: 'Шрифты',
      decorations: 'Оформление',
      extra: 'Дополнительно',
      flex: 'Flex-атрибуты',
      dimension: 'Измерение',
    },
    // Default names for sub properties in Composite and Stack types.
    // Other labels are generated directly from their property names (eg. 'font-size' will be 'Font size').
    properties: {
      'text-shadow-h': 'X',
      'text-shadow-v': 'Y',
      'text-shadow-blur': 'Размытие',
      'text-shadow-color': 'Цвет',
      'box-shadow-h': 'X',
      'box-shadow-v': 'Y',
      'box-shadow-blur': 'Размытие',
      'box-shadow-spread': 'Распространение',
      'box-shadow-color': 'Цвет',
      'box-shadow-type': 'Тип',
      'margin-top-sub': 'Сверху',
      'margin-right-sub': 'Справа',
      'margin-bottom-sub': 'Снизу',
      'margin-left-sub': 'Слева',
      'padding-top-sub': 'Сверху',
      'padding-right-sub': 'Справа',
      'padding-bottom-sub': 'Снизу',
      'padding-left-sub': 'Слева',
      'border-width-sub': 'Ширина',
      'border-style-sub': 'Стиль',
      'border-color-sub': 'Цвет',
      'border-top-left-radius-sub': 'Вверху слева',
      'border-top-right-radius-sub': 'Вверху справа',
      'border-bottom-right-radius-sub': 'Внизу справа',
      'border-bottom-left-radius-sub': 'Внизу слева',
      'transform-rotate-x': 'Повернуть X',
      'transform-rotate-y': 'Повернуть Y',
      'transform-rotate-z': 'Повернуть Z',
      'transform-scale-x': 'Масштаб X',
      'transform-scale-y': 'Масштаб Y',
      'transform-scale-z': 'Масштаб Z',
      'transition-property-sub': 'Свойство',
      'transition-duration-sub': 'Продолжительность',
      'transition-timing-function-sub': 'Время',
      'background-image-sub': 'Изображение',
      'background-repeat-sub': 'Повтор',
      'background-position-sub': 'Позиция',
      'background-attachment-sub': 'Вложение',
      'background-size-sub': 'Размер',
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
    empty: 'Выберите элемент перед использованием Trait Manager',
    label: 'Настройки компонента',
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
        href: { placeholder: 'Прим. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Это окно',
          _blank: 'Новое окно',
        },
      },
    },
  },
  storageManager: {
    recover: 'Вы хотите восстановить несохраненные изменения?',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: se.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/se.js

```javascript
const traitInputAttr = { placeholder: 't.ex. Text här' };

export default {
  assetManager: {
    addButton: 'Lägg till bild',
    inputPlh: 'http://adress/till/bilden.jpg',
    modalTitle: 'Välj bild',
    uploadTitle: 'Dra och släpp filer här eller klicka för att ladda upp',
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
      '': 'Box',
      wrapper: 'Body',
      text: 'Text',
      comment: 'Kommentar',
      image: 'Bild',
      video: 'Video',
      label: 'Etikett',
      link: 'Länk',
      map: 'Karta',
      tfoot: 'Tabellfot',
      tbody: 'Tabellinnehåll',
      thead: 'Tabellhuvud',
      table: 'Tabell',
      row: 'Tabellrad',
      cell: 'Tabellcell',
    },
  },
  deviceManager: {
    device: 'Enhet',
    devices: {
      desktop: 'Dator',
      tablet: 'Surfplatta',
      mobileLandscape: 'Mobil liggande',
      mobilePortrait: 'Mobil stående',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Förhandsgranska',
        fullscreen: 'Helskärm',
        'sw-visibility': 'Visa komponenter',
        'export-template': 'Visa kod',
        'open-sm': 'Öppna stilhanterare',
        'open-tm': 'Inställningar',
        'open-layers': 'Öppna lagerhanterare',
        'open-blocks': 'Öppna block',
      },
    },
  },
  selectorManager: {
    label: 'Klasser',
    selected: 'Markerad',
    emptyState: '- Status -',
    states: {
      hover: 'Mus över',
      active: 'Klick',
      'nth-of-type(2n)': 'Jämn/udda',
    },
  },
  styleManager: {
    empty: 'Markera ett element innan du använder stilhanteraren',
    layer: 'Lager',
    fileButton: 'Bilder',
    sectors: {
      general: 'Allmänt',
      layout: 'Layout',
      typography: 'Typografi',
      decorations: 'Dekoration',
      extra: 'Extra',
      flex: 'Flex',
      dimension: 'Dimension',
    },
    // The core library generates the name by their `property` name
    properties: {
      float: 'Justering',
      display: 'Visning',
      position: 'Position',
      top: 'Topp',
      right: 'Höger',
      left: 'Vänster',
      bottom: 'Botten',
      width: 'Bredd',
      height: 'Höjd',
      'max-width': 'Maxbredd',
      'max-height': 'Maxhöjd',
      margin: 'Marginal',
      'margin-top': 'Övre marginal',
      'margin-right': 'Höger marginal',
      'margin-left': 'Vänster marginal',
      'margin-bottom': 'Undre marginal',
      padding: 'Utfyllnad',
      'padding-top': 'Övre utfyllnad',
      'padding-left': 'Vänster utfyllnad',
      'padding-right': 'Höger utfyllnad',
      'padding-bottom': 'Nedre utfyllnad',
      'font-family': 'Typsnitt',
      'font-size': 'Teckenstorlek',
      'font-weight': 'Texttyngd',
      'letter-spacing': 'Textmellanrum',
      color: 'Färg',
      'line-height': 'Radhöjd',
      'text-align': 'Textjustering',
      'text-shadow': 'Textskugga',
      'text-shadow-h': 'Horisontell textskugga',
      'text-shadow-v': 'Vertikal textskugga',
      'text-shadow-blur': 'Textskuggans luddighet',
      'text-shadow-color': 'Textskuggans färg',
      'border-top-left': 'Vänster övre kantlinje',
      'border-top-right': 'Höger övre kantlinje',
      'border-bottom-left': 'Vänster nedre kantlinje',
      'border-bottom-right': 'Höger nedre kantlinje',
      'border-left': 'Vänster kantlinje',
      'border-top': 'Övre kantlinje',
      'border-right': 'Höger kantlinje',
      'border-bottom': 'Nedre kantlinje',
      'border-radius-top-left': 'Vänster övre hörnradie',
      'border-radius-top-right': 'Höger övre hörnradie',
      'border-radius-bottom-left': 'Vänster nedre hörnradie',
      'border-radius-bottom-right': 'Höger nedre hörnradie',
      'border-radius': 'Hörnradie',
      border: 'Kantlinje',
      'border-width': 'Kantbredd',
      'border-style': 'Kantstil',
      'border-color': 'Kantfärg',
      'box-shadow': 'Skugga',
      'box-shadow-h': 'Horisontell skugga',
      'box-shadow-v': 'Vertikal skugga',
      'box-shadow-blur': 'Skuggans luddighet',
      'box-shadow-spread': 'Skuggans spridning',
      'box-shadow-color': 'Skuggans färg',
      'box-shadow-type': 'Typ av skugga',
      background: 'Bakgrund',
      'background-image': 'Bakgrundsbild',
      'background-repeat': 'Upprepa bakgrund',
      'background-position': 'Bakgrundsplacering',
      'background-attachment': 'Bakgrundslåsning',
      'background-size': 'Bakgrundsstorlek',
      'background-color': 'Bakgrundsfärg',
      transition: 'Övergång',
      'transition-property': 'Övergångstyp',
      'transition-duration': 'Övergångens varaktighet',
      'transition-timing-function': 'Övergångens tidsfunktion',
      perspective: 'Perspektiv',
      transform: 'Transformera',
      'transform-rotate-x': 'Rotera längs X-axeln',
      'transform-rotate-y': 'Rotera längs Y-axeln',
      'transform-rotate-z': 'Rotera längs Z-axeln',
      'transform-scale-x': 'Skala längs X-axeln',
      'transform-scale-y': 'Skala längs Y-axeln',
      'transform-scale-z': 'Skala längs Z-axeln',
      'flex-direction': 'Flexriktning',
      'flex-wrap': 'Flexbrytning',
      'justify-content': 'Justera innehåll',
      'align-items': 'Elementjustering',
      'align-content': 'Innehållsjustering',
      order: 'Ordning',
      'flex-basis': 'Flexbas',
      'flex-grow': 'Flex väx',
      'flex-shrink': 'Flex krymp',
      'align-self': 'Självjustering',
    },
  },
  traitManager: {
    empty: 'Markera ett element innan du använder egenskapshanteraren',
    label: 'Komponentinställningar',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        // id: 'Id',
        // alt: 'Alt',
        title: 'Titel',
        placeholder: 'Platshållartext',
        value: 'Värde',
        required: 'Obligatorisk',
        selected: 'Markerad',
        checked: 'Ikryssad',
        type: 'Typ',
        style: 'Stil',
        class: 'Klass',
        // href: 'Href',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 't.ex. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Detta fönster',
          _blank: 'Nytt fönster',
        },
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: tr.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/tr.js

```javascript
export default {
  assetManager: {
    addButton: 'Görsel Ekle',
    modalTitle: 'Görsel Seçin',
    uploadTitle: 'Dosya yüklemek için buraya sürükleyin veya tıklayın',
  },
  deviceManager: {
    device: 'Cihaz',
    devices: {
      desktop: 'Masaüstü',
      tablet: 'Tablet',
      mobileLandscape: 'Mobil Yatay',
      mobilePortrait: 'Mobil Dikey',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Önizleme',
        fullscreen: 'Tam Ekran',
        'sw-visibility': 'Bileşenleri Göster',
        'export-template': 'Kodu Göster',
        'open-sm': 'Stil Düzenleyiciyi Aç',
        'open-tm': 'Ayarlar',
        'open-layers': 'Katmanlar',
        'open-blocks': 'Bloklar',
      },
    },
  },
  selectorManager: {
    selected: 'Seçili',
    emptyState: '- DURUM -',
    label: 'Sınıflar',
  },
  styleManager: {
    empty: 'Stilini düzenlemek istediğiniz öğeyi seçiniz',
    layer: 'Katman',
    sectors: {
      general: 'Genel',
      layout: 'Düzen',
      typography: 'Tipografi',
      decorations: 'Dekorasyon',
      extra: 'Ekstra',
      flex: 'Flex',
      dimension: 'Boyut',
    },
    properties: {
      float: 'Kaydır',
      display: 'Görünüm',
      position: 'Pozisyon',
      top: 'Üst',
      right: 'Sağ',
      left: 'Sol',
      bottom: 'Alt',
      width: 'Genişlik',
      height: 'Yükseklik',
      'max-width': 'Maks. Genişlik',
      'max-height': 'Maks. Yükseklik',
      margin: 'Margin',
      'margin-top': 'Margin Üst',
      'margin-right': 'Margin Sağ',
      'margin-left': 'Margin Sol',
      'margin-bottom': 'Margin Alt',
      padding: 'Padding',
      'padding-top': 'Padding Üst',
      'padding-left': 'Padding Sol',
      'padding-right': 'Padding Sağ',
      'padding-bottom': 'Padding Alt',
      'font-family': 'Font Tipi',
      'font-size': 'Font Boyutu',
      'font-weight': 'Font Kalınlığı',
      'letter-spacing': 'Harf Boşluğu',
      color: 'Renk',
      'line-height': 'Satır Boşluğu',
      'text-align': 'Yazı Hizalaması',
      'text-shadow': 'Yazı Gölgesi',
      'text-shadow-h': 'Yazı Gölgesi - Yatay',
      'text-shadow-v': 'Yazı Gölgesi - Dikey',
      'text-shadow-blur': 'Yazı Gölgesi Bulanıklığı',
      'text-shadow-color': 'Yazı Gölgesi Rengi',
      'border-top-left': 'Kenar Üst Sol',
      'border-top-right': 'Kenar Üst Sağ',
      'border-bottom-left': 'Kenar Alt Sol',
      'border-bottom-right': 'Kenar Alt Sağ',
      'border-radius-top-left': 'Köşe Yumuşuması Üst Sol',
      'border-radius-top-right': 'Köşe Yumuşuması Üst Sağ',
      'border-radius-bottom-left': 'Köşe Yumuşuması Alt Sol',
      'border-radius-bottom-right': 'Köşe Yumuşuması Alt Sağ',
      'border-radius': 'Köşe Yumuşaması',
      border: 'Kenar',
      'border-width': 'Kenar Kalınlığı',
      'border-style': 'Kenar Stili',
      'border-color': 'Kenar Rengi',
      'box-shadow': 'Kutu Gölgesi',
      'box-shadow-h': 'Kutu Gölgesi - Yatay',
      'box-shadow-v': 'Kutu Gölgesi - Dikey',
      'box-shadow-blur': 'Kutu Gölgesi Bulanıklığı',
      'box-shadow-spread': 'Kutu Gölgesi Dağılımı',
      'box-shadow-color': 'Kutu Gölgesi Rengi',
      'box-shadow-type': 'Kutu Gölgesi Tipi',
      background: 'Arkaplan',
      'background-image': 'Arkaplan Resmi',
      'background-repeat': 'Arkaplan Tekrarı',
      'background-position': 'Arkaplan Pozisyonu',
      'background-attachment': 'Arkaplan Eklentisi',
      'background-size': 'Arkaplan Boyutu',
      transition: 'Geçiş',
      'transition-property': 'Geçiş Özelliği',
      'transition-duration': 'Geçiş Süresi',
      'transition-timing-function': 'Geçiş Zamanlaması Metodu',
      perspective: 'Perspektif',
      transform: 'Boyutlama',
      'transform-rotate-x': 'Yatay Yönlendirme',
      'transform-rotate-y': 'Dikey Yönlendirme',
      'transform-rotate-z': 'Hacimsel Yönlendirme',
      'transform-scale-x': 'Dikey Oran',
      'transform-scale-y': 'Yatay Oran',
      'transform-scale-z': 'Hacimsel Oran',
      'flex-direction': 'Flex Yönü',
      'flex-wrap': 'Flex Kesme',
      'justify-content': 'İçeriği Sığdır',
      'align-items': 'Öğeleri Hizala',
      'align-content': 'İçeriği Hizala',
      order: 'Sıra',
      'flex-basis': 'Flex Bazı',
      'flex-grow': 'Flex Büyüme',
      'flex-shrink': 'Flex Küçülme',
      'align-self': 'Kendini Hizala',
      'background-color': 'Arkaplan Rengi',
    },
  },
  traitManager: {
    empty: 'Özelliklerini düzenlemek istediğiniz öğeyi seçiniz',
    label: 'Bileşen Özellikleri',
    traits: {
      labels: {},
      attributes: {},
      options: {},
    },
  },
};
```

--------------------------------------------------------------------------------

````
