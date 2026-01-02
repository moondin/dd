---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 258
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 258 of 552)

````text
================================================================================
FULLSTACK USER CREATED CODE DATABASE (VERBATIM) - vscode-main
================================================================================
Generated: December 18, 2025
Source: user_created_projects/vscode-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: src/vs/editor/test/node/diffing/fixtures/noisy-move1/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/noisy-move1/legacy.expected.diff.json

```json
{
	"original": {
		"content": "\tcontextKeyService.onDidChangeContext(this.onDidChangeContext, this, this.disposables);\n\t\tthis.disposables.add(Event.filter(viewsRegistry.onDidChangeViewWelcomeContent, id => id === this.id)(this.onDidChangeViewWelcomeContent, this, this.disposables));\n\t\tthis.onDidChangeViewWelcomeContent();\n\t}\n\n\tprivate onDidChangeViewWelcomeContent(): void {\n\t\tconst descriptors = viewsRegistry.getViewWelcomeContent(this.id);\n\n\t\tthis.items = [];\n\n\t\tfor (const descriptor of descriptors) {\n\t\t\tif (descriptor.when === 'default') {\n\t\t\t\tthis.defaultItem = { descriptor, visible: true };\n\t\t\t} else {\n\t\t\t\tconst visible = descriptor.when ? this.contextKeyService.contextMatchesRules(descriptor.when) : true;\n\t\t\t\tthis.items.push({ descriptor, visible });\n\t\t\t}\n\t\t}\n\n\t\tthis._onDidChange.fire();\n\t}\n\n\tprivate onDidChangeContext(): void {\n\t\tlet didChange = false;\n\n\t\tfor (const item of this.items) {\n\t\t\tif (!item.descriptor.when || item.descriptor.when === 'default') {\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\tconst visible = this.contextKeyService.contextMatchesRules(item.descriptor.when);\n\n\t\t\tif (item.visible === visible) {\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\titem.visible = visible;\n\t\t\tdidChange = true;\n\t\t}\n\n\t\tif (didChange) {\n\t\t\tthis._onDidChange.fire();\n\t\t}\n\t}\n\n\tdispose(): void {\n\t\tthis.disposables.dispose();\n\t}\n}\n\nexport abstract class ViewPane extends Pane implements IView {\n\n\tprivate static readonly AlwaysShowActionsConfig = 'workbench.view.alwaysShowHeaderActions';\n\n\tprivate _onDidFocus = this._register(new Emitter<void>());\n\treadonly onDidFocus: Event<void> = this._onDidFocus.event;\n\n\tprivate _onDidBlur = this._register(new Emitter<void>());\n\treadonly onDidBlur: Event<void> = this._onDidBlur.event;\n\n\tprivate _onDidChangeBodyVisibility = this._register(new Emitter<boolean>());\n\treadonly onDidChangeBodyVisibility: Event<boolean> = this._onDidChangeBodyVisibility.event;\n\n\tprotected _onDidChangeTitleArea = this._register(new Emitter<void>());\n\treadonly onDidChangeTitleArea: Event<void> = this._onDidChangeTitleArea.event;\n\n\tprotected _onDidChangeViewWelcomeState = this._register(new Emitter<void>());\n\treadonly onDidChangeViewWelcomeState: Event<void> = this._onDidChangeViewWelcomeState.event;\n\n\tprivate _isVisible: boolean = false;\n\treadonly id: string;\n\n\tprivate _title: string;\n\tpublic get title(): string {\n\t\treturn this._title;\n\t}\n\n\tprivate _titleDescription: string | undefined;\n\tpublic get titleDescription(): string | undefined {\n\t\treturn this._titleDescription;\n\t}\n\n\treadonly menuActions: CompositeMenuActions;\n\n\tprivate progressBar!: ProgressBar;\n\tprivate progressIndicator!: IProgressIndicator;\n\n\tprivate toolbar?: WorkbenchToolBar;\n\tprivate readonly showActions: ViewPaneShowActions;\n\tprivate headerContainer?: HTMLElement;\n\tprivate titleContainer?: HTMLElement;\n\tprivate titleDescriptionContainer?: HTMLElement;\n\tprivate iconContainer?: HTMLElement;\n\tprotected twistiesContainer?: HTMLElement;\n\n\tprivate bodyContainer!: HTMLElement;\n\tprivate viewWelcomeContainer!: HTMLElement;\n\tprivate viewWelcomeDisposable: IDisposable = Disposable.None;\n\tprivate viewWelcomeController: ViewWelcomeController;\n\n\tprotected readonly scopedContextKeyService: IContextKeyService;\n\n\tconstructor(\n\t\toptions: IViewPaneOptions,\n\t\t@IKeybindingService protected keybindingService: IKeybindingService,\n\t\t@IContextMenuService protected contextMenuService: IContextMenuService,\n\t\t@IConfigurationService protected readonly configurationService: IConfigurationService,\n\t\t@IContextKeyService protected contextKeyService: IContextKeyService,\n\t\t@IViewDescriptorService protected viewDescriptorService: IViewDescriptorService,\n\t\t@IInstantiationService protected instantiationService: IInstantiationService,\n\t\t@IOpenerService protected openerService: IOpenerService,\n\t\t@IThemeService protected themeService: IThemeService,\n\t\t@ITelemetryService protected telemetryService: ITelemetryService,\n\t) {\n\t\tsuper({ ...options, ...{ orientation: viewDescriptorService.getViewLocationById(options.id) === ViewContainerLocation.Panel ? Orientation.HORIZONTAL : Orientation.VERTICAL } });\n\n\t\tthis.id = options.id;\n\t\tthis._title = options.title;\n\t\tthis._titleDescription = options.titleDescription;\n\t\tthis.showActions = options.showActions ?? ViewPaneShowActions.Default;\n\n\t\tthis.scopedContextKeyService = this._register(contextKeyService.createScoped(this.element));\n\t\tthis.scopedContextKeyService.createKey('view', this.id);\n\t\tconst viewLocationKey = this.scopedContextKeyService.createKey('viewLocation', ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!));\n\t\tthis._register(Event.filter(viewDescriptorService.onDidChangeLocation, e => e.views.some(view => view.id === this.id))(() => viewLocationKey.set(ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!))));\n\n\t\tthis.menuActions = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])).createInstance(CompositeMenuActions, options.titleMenuId ?? MenuId.ViewTitle, MenuId.ViewTitleContext, { shouldForwardArgs: !options.donotForwardArgs }));\n\t\tthis._register(this.menuActions.onDidChange(() => this.updateActions()));\n\n\t\tthis.viewWelcomeController = this._register(new ViewWelcomeController(this.id, contextKeyService));\n\t}\n\n\toverride get headerVisible(): boolean {\n\t\treturn super.headerVisible;\n\t}\n\n\toverride set headerVisible(visible: boolean) {\n\t\tsuper.headerVisible = visible;\n\t\tthis.element.classList.toggle('merged-header', !visible);\n\t}\n\n\tsetVisible(visible: boolean): void {\n\t\tif (this._isVisible !== visible) {\n\t\t\tthis._isVisible = visible;\n\n\t\t\tif (this.isExpanded()) {\n\t\t\t\tthis._onDidChangeBodyVisibility.fire(visible);\n\t\t\t}\n\t\t}\n\t}\n\n\tisVisible(): boolean {\n\t\treturn this._isVisible;\n\t}\n\n\tisBodyVisible(): boolean {\n\t\treturn this._isVisible && this.isExpanded();\n\t}\n\n\toverride setExpanded(expanded: boolean): boolean {\n\t\tconst changed = super.setExpanded(expanded);\n\t\tif (changed) {\n\t\t\tthis._onDidChangeBodyVisibility.fire(expanded);\n\t\t}\n\t\tif (this.twistiesContainer) {\n\t\t\tthis.twistiesContainer.classList.remove(...ThemeIcon.asClassNameArray(this.getTwistyIcon(!expanded)));\n\t\t\tthis.twistiesContainer.classList.add(...ThemeIcon.asClassNameArray(this.getTwistyIcon(expanded)));\n\t\t}\n\t\treturn changed;\n\t}\n\n\toverride render(): void {\n\t\tsuper.render();\n\n\t\tconst focusTracker = trackFocus(this.element);\n\t\tthis._register(focusTracker);\n\t\tthis._register(focusTracker.onDidFocus(() => this._onDidFocus.fire()));\n\t\tthis._register(focusTracker.onDidBlur(() => this._onDidBlur.fire()));\n\t}\n\n\tprotected renderHeader(container: HTMLElement): void {\n\t\tthis.headerContainer = container;\n\n\t\tthis.twistiesContainer = append(container, $(ThemeIcon.asCSSSelector(this.getTwistyIcon(this.isExpanded()))));\n\n\t\tthis.renderHeaderTitle(container, this.title);\n\n\t\tconst actions = append(container, $('.actions'));\n\t\tactions.classList.toggle('show-always', this.showActions === ViewPaneShowActions.Always);\n\t\tactions.classList.toggle('show-expanded', this.showActions === ViewPaneShowActions.WhenExpanded);\n\t\tthis.toolbar = this.instantiationService.createInstance(WorkbenchToolBar, actions, {\n\t\t\torientation: ActionsOrientation.HORIZONTAL,\n\t\t\tactionViewItemProvider: action => this.getActionViewItem(action),\n\t\t\tariaLabel: nls.localize('viewToolbarAriaLabel', \"{0} actions\", this.title),\n\t\t\tgetKeyBinding: action => this.keybindingService.lookupKeybinding(action.id),\n\t\t\trenderDropdownAsChildElement: true,\n\t\t\tactionRunner: this.getActionRunner(),\n\t\t\tresetMenu: this.menuActions.menuId\n\t\t});\n\n\t\tthis._register(this.toolbar);\n\t\tthis.setActions();\n\n\t\tthis._register(addDisposableListener(actions, EventType.CLICK, e => e.preventDefault()));\n\n\t\tconst viewContainerModel = this.viewDescriptorService.getViewContainerByViewId(this.id);\n\t\tif (viewContainerModel) {\n\t\t\tthis._register(this.viewDescriptorService.getViewContainerModel(viewContainerModel).onDidChangeContainerInfo(({ title }) => this.updateTitle(this.title)));\n\t\t} else {\n\t\t\tconsole.error(`View container model not found for view ${this.id}`);\n\t\t}\n\n\t\tconst onDidRelevantConfigurationChange = Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration(ViewPane.AlwaysShowActionsConfig));\n\t\tthis._register(onDidRelevantConfigurationChange(this.updateActionsVisibility, this));\n\t\tthis.updateActionsVisibility();\n\t}\n\n\tprotected getTwistyIcon(expanded: boolean): ThemeIcon {\n\t\treturn expanded ? viewPaneContainerExpandedIcon : viewPaneContainerCollapsedIcon;\n\t}\n\n\toverride style(styles: IPaneStyles): void {\n\t\tsuper.style(styles);\n\n\t\tconst icon = this.getIcon();\n\t\tif (this.iconContainer) {\n\t\t\tconst fgColor = asCssValueWithDefault(styles.headerForeground, asCssVariable(foreground));\n\t\t\tif (URI.isUri(icon)) {\n\t\t\t\t// Apply background color to activity bar item provided with iconUrls\n\t\t\t\tthis.iconContainer.style.backgroundColor = fgColor;\n\t\t\t\tthis.iconContainer.style.color = '';\n\t\t\t} else {\n\t\t\t\t// Apply foreground color to activity bar items provided with codicons\n\t\t\t\tthis.iconContainer.style.color = fgColor;\n\t\t\t\tthis.iconContainer.style.backgroundColor = '';\n\t\t\t}\n\t\t}\n\t}\n\n\tprivate getIcon(): ThemeIcon | URI {\n\t\treturn this.viewDescriptorService.getViewDescriptorById(this.id)?.containerIcon || defaultViewIcon;\n\t}\n\n\tprotected renderHeaderTitle(container: HTMLElement, title: string): void {\n\t\tthis.iconContainer = append(container, $('.icon', undefined));\n\t\tconst icon = this.getIcon();\n\n\t\tlet cssClass: string | undefined = undefined;\n\t\tif (URI.isUri(icon)) {\n\t\t\tcssClass = `view-${this.id.replace(/[\\.\\:]/g, '-')}`;\n\t\t\tconst iconClass = `.pane-header .icon.${cssClass}`;\n\n\t\t\tcreateCSSRule(iconClass, `\n\t\t\t\tmask: ${asCSSUrl(icon)} no-repeat 50% 50%;\n\t\t\t\tmask-size: 24px;\n\t\t\t\t-webkit-mask: ${asCSSUrl(icon)} no-repeat 50% 50%;\n\t\t\t\t-webkit-mask-size: 16px;\n\t\t\t`);\n\t\t} else if (ThemeIcon.isThemeIcon(icon)) {\n\t\t\tcssClass = ThemeIcon.asClassName(icon);\n\t\t}\n\n\t\tif (cssClass) {\n\t\t\tthis.iconContainer.classList.add(...cssClass.split(' '));\n\t\t}\n\n\t\tconst calculatedTitle = this.calculateTitle(title);\n\t\tthis.titleContainer = append(container, $('h3.title', { title: calculatedTitle }, calculatedTitle));\n\n\t\tif (this._titleDescription) {\n\t\t\tthis.setTitleDescription(this._titleDescription);\n\t\t}\n\n\t\tthis.iconContainer.title = calculatedTitle;\n\t\tthis.iconContainer.setAttribute('aria-label', calculatedTitle);\n\t}\n\n\tprotected updateTitle(title: string): void {\n\t\tconst calculatedTitle = this.calculateTitle(title);\n\t\tif (this.titleContainer) {\n\t\t\tthis.titleContainer.textContent = calculatedTitle;\n\t\t\tthis.titleContainer.setAttribute('title', calculatedTitle);\n\t\t}\n\n\t\tif (this.iconContainer) {\n\t\t\tthis.iconContainer.title = calculatedTitle;\n\t\t\tthis.iconContainer.setAttribute('aria-label', calculatedTitle);\n\t\t}\n\n\t\tthis._title = title;\n\t\tthis._onDidChangeTitleArea.fire();\n\t}\n\n\tprivate setTitleDescription(description: string | undefined) {\n\t\tif (this.titleDescriptionContainer) {\n\t\t\tthis.titleDescriptionContainer.textContent = description ?? '';\n\t\t\tthis.titleDescriptionContainer.setAttribute('title', description ?? '');\n\t\t}\n\t\telse if (description && this.titleContainer) {\n\t\t\tthis.titleDescriptionContainer = after(this.titleContainer, $('span.description', { title: description }, description));\n\t\t}\n\t}\n\n\tprotected updateTitleDescription(description?: string | undefined): void {\n\t\tthis.setTitleDescription(description);\n\n\t\tthis._titleDescription = description;\n\t\tthis._onDidChangeTitleArea.fire();\n\t}\n\n\tprivate calculateTitle(title: string): string {\n\t\tconst viewContainer = this.viewDescriptorService.getViewContainerByViewId(this.id)!;\n\t\tconst model = this.viewDescriptorService.getViewContainerModel(viewContainer);\n\t\tconst viewDescriptor = this.viewDescriptorService.getViewDescriptorById(this.id);\n\t\tconst isDefault = this.viewDescriptorService.getDefaultContainerById(this.id) === viewContainer;\n\n\t\tif (!isDefault && viewDescriptor?.containerTitle && model.title !== viewDescriptor.containerTitle) {\n\t\t\treturn `${viewDescriptor.containerTitle}: ${title}`;\n\t\t}\n\n\t\treturn title;\n\t}\n\n\tprivate scrollableElement!: DomScrollableElement;\n\n\tprotected renderBody(container: HTMLElement): void {\n\t\tthis.bodyContainer = container;\n\n\t\tconst viewWelcomeContainer = append(container, $('.welcome-view'));\n\t\tthis.viewWelcomeContainer = $('.welcome-view-content', { tabIndex: 0 });\n\t\tthis.scrollableElement = this._register(new DomScrollableElement(this.viewWelcomeContainer, {\n\t\t\talwaysConsumeMouseWheel: true,\n\t\t\thorizontal: ScrollbarVisibility.Hidden,\n\t\t\tvertical: ScrollbarVisibility.Visible,\n\t\t}));\n\n\t\tappend(viewWelcomeContainer, this.scrollableElement.getDomNode());\n\n\t\tconst onViewWelcomeChange = Event.any(this.viewWelcomeController.onDidChange, this.onDidChangeViewWelcomeState);\n\t\tthis._register(onViewWelcomeChange(this.updateViewWelcome, this));\n\t\tthis.updateViewWelcome();\n\t}\n\n\tprotected layoutBody(height: number, width: number): void {\n\t\tif (this.shouldShowWelcome()) {\n\t\t\tthis.viewWelcomeContainer.style.height = `${height}px`;\n\t\t\tthis.viewWelcomeContainer.style.width = `${width}px`;\n\t\t\tthis.viewWelcomeContainer.classList.toggle('wide', width > 640);\n\t\t\tthis.scrollableElement.scanDomNode();\n\t\t}\n\t}\n\n\tonDidScrollRoot() {\n\t\t// noop\n\t}\n\n\tgetProgressIndicator() {\n\t\tif (this.progressBar === undefined) {\n\t\t\t// Progress bar\n\t\t\tthis.progressBar = this._register(new ProgressBar(this.element, defaultProgressBarStyles));\n\t\t\tthis.progressBar.hide();\n\t\t}\n\n\t\tif (this.progressIndicator === undefined) {\n\t\t\tconst that = this;\n\t\t\tthis.progressIndicator = new ScopedProgressIndicator(assertIsDefined(this.progressBar), new class extends AbstractProgressScope {\n\t\t\t\tconstructor() {\n\t\t\t\t\tsuper(that.id, that.isBodyVisible());\n\t\t\t\t\tthis._register(that.onDidChangeBodyVisibility(isVisible => isVisible ? this.onScopeOpened(that.id) : this.onScopeClosed(that.id)));\n\t\t\t\t}\n\t\t\t}());\n\t\t}\n\t\treturn this.progressIndicator;\n\t}\n\n\tprotected getProgressLocation(): string {\n\t\treturn this.viewDescriptorService.getViewContainerByViewId(this.id)!.id;\n\t}\n\n\tprotected getBackgroundColor(): string {\n\t\tswitch (this.viewDescriptorService.getViewLocationById(this.id)) {\n\t\t\tcase ViewContainerLocation.Panel:\n\t\t\t\treturn PANEL_BACKGROUND;\n\t\t\tcase ViewContainerLocation.Sidebar:\n\t\t\tcase ViewContainerLocation.AuxiliaryBar:\n\t\t\t\treturn SIDE_BAR_BACKGROUND;\n\t\t}\n\n\t\treturn SIDE_BAR_BACKGROUND;\n\t}\n\n\tfocus(): void {\n\t\tif (this.shouldShowWelcome()) {\n\t\t\tthis.viewWelcomeContainer.focus();\n\t\t} else if (this.element) {\n\t\t\tthis.element.focus();\n\t\t\tthis._onDidFocus.fire();\n\t\t}\n\t}\n\n\tprivate setActions(): void {\n\t\tif (this.toolbar) {\n\t\t\tconst primaryActions = [...this.menuActions.getPrimaryActions()];\n\t\t\tif (this.shouldShowFilterInHeader()) {\n\t\t\t\tprimaryActions.unshift(VIEWPANE_FILTER_ACTION);\n\t\t\t}\n\t\t\tthis.toolbar.setActions(prepareActions(primaryActions), prepareActions(this.menuActions.getSecondaryActions()));\n\t\t\tthis.toolbar.context = this.getActionsContext();\n\t\t}\n\t}\n\n\tprivate updateActionsVisibility(): void {\n\t\tif (!this.headerContainer) {\n\t\t\treturn;\n\t\t}\n\t\tconst shouldAlwaysShowActions = this.configurationService.getValue<boolean>('workbench.view.alwaysShowHeaderActions');\n\t\tthis.headerContainer.classList.toggle('actions-always-visible', shouldAlwaysShowActions);\n\t}\n\n\tprotected updateActions(): void {\n\t\tthis.setActions();\n\t\tthis._onDidChangeTitleArea.fire();\n\t}\n\n\tgetActionViewItem(action: IAction, options?: IDropdownMenuActionViewItemOptions): IActionViewItem | undefined {\n\t\tif (action.id === VIEWPANE_FILTER_ACTION.id) {\n\t\t\tconst that = this;\n\t\t\treturn new class extends BaseActionViewItem {\n\t\t\t\tconstructor() { super(null, action); }\n\t\t\t\toverride setFocusable(): void { /* noop input elements are focusable by default */ }\n\t\t\t\toverride get trapsArrowNavigation(): boolean { return true; }\n\t\t\t\toverride render(container: HTMLElement): void {\n\t\t\t\t\tcontainer.classList.add('viewpane-filter-container');\n\t\t\t\t\tappend(container, that.getFilterWidget()!.element);\n\t\t\t\t}\n\t\t\t};\n\t\t}\n\t\treturn createActionViewItem(this.instantiationService, action, { ...options, ...{ menuAsChild: action instanceof SubmenuItemAction } });\n\t}\n\n\tgetActionsContext(): unknown {\n\t\treturn undefined;\n\t}\n\n\tgetActionRunner(): IActionRunner | undefined {\n\t\treturn undefined;\n\t}\n\n\tgetOptimalWidth(): number {\n\t\treturn 0;\n\t}\n\n\tsaveState(): void {\n\t\t// Subclasses to implement for saving state\n\t}\n\n\tprivate updateViewWelcome(): void {\n\t\tthis.viewWelcomeDisposable.dispose();\n\n\t\tif (!this.shouldShowWelcome()) {\n\t\t\tthis.bodyContainer.classList.remove('welcome');\n\t\t\tthis.viewWelcomeContainer.innerText = '';\n\t\t\tthis.scrollableElement.scanDomNode();\n\t\t\treturn;\n\t\t}\n\n\t\tconst contents = this.viewWelcomeController.contents;\n\n\t\tif (contents.length === 0) {\n\t\t\tthis.bodyContainer.classList.remove('welcome');\n\t\t\tthis.viewWelcomeContainer.innerText = '';\n\t\t\tthis.scrollableElement.scanDomNode();\n\t\t\treturn;\n\t\t}\n\n\t\tconst disposables = new DisposableStore();\n\t\tthis.bodyContainer.classList.add('welcome');\n\t\tthis.viewWelcomeContainer.innerText = '';\n\n\t\tfor (const { content, precondition } of contents) {\n\t\t\tconst lines = content.split('\\n');\n\n\t\t\tfor (let line of lines) {\n\t\t\t\tline = line.trim();\n\n\t\t\t\tif (!line) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tconst linkedText = parseLinkedText(line);\n\n\t\t\t\tif (linkedText.nodes.length === 1 && typeof linkedText.nodes[0] !== 'string') {\n\t\t\t\t\tconst node = linkedText.nodes[0];\n\t\t\t\t\tconst buttonContainer = append(this.viewWelcomeContainer, $('.button-container'));\n\t\t\t\t\tconst button = new Button(buttonContainer, { title: node.title, supportIcons: true, ...defaultButtonStyles });\n\t\t\t\t\tbutton.label = node.label;\n\t\t\t\t\tbutton.onDidClick(_ => {\n\t\t\t\t\t\tthis.telemetryService.publicLog2<{ viewId: string; uri: string }, WelcomeActionClassification>('views.welcomeAction', { viewId: this.id, uri: node.href });\n\t\t\t\t\t\tthis.openerService.open(node.href, { allowCommands: true });\n\t\t\t\t\t}, null, disposables);\n\t\t\t\t\tdisposables.add(button);\n\n\t\t\t\t\tif (precondition) {\n\t\t\t\t\t\tconst updateEnablement = () => button.enabled = this.contextKeyService.contextMatchesRules(precondition);\n\t\t\t\t\t\tupdateEnablement();\n\n\t\t\t\t\t\tconst keys = new Set();\n\t\t\t\t\t\tprecondition.keys().forEach(key => keys.add(key));\n\t\t\t\t\t\tconst onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));\n\t\t\t\t\t\tonDidChangeContext(updateEnablement, null, disposables);\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\tconst p = append(this.viewWelcomeContainer, $('p'));\n\n\t\t\t\t\tfor (const node of linkedText.nodes) {\n\t\t\t\t\t\tif (typeof node === 'string') {\n\t\t\t\t\t\t\tappend(p, document.createTextNode(node));\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tconst link = disposables.add(this.instantiationService.createInstance(Link, p, node, {}));\n\n\t\t\t\t\t\t\tif (precondition && node.href.startsWith('command:')) {\n\t\t\t\t\t\t\t\tconst updateEnablement = () => link.enabled = this.contextKeyService.contextMatchesRules(precondition);\n\t\t\t\t\t\t\t\tupdateEnablement();\n\n\t\t\t\t\t\t\t\tconst keys = new Set();\n\t\t\t\t\t\t\t\tprecondition.keys().forEach(key => keys.add(key));\n\t\t\t\t\t\t\t\tconst onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));\n\t\t\t\t\t\t\t\tonDidChangeContext(updateEnablement, null, disposables);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tthis.scrollableElement.scanDomNode();\n\t\tthis.viewWelcomeDisposable = disposables;\n\t}\n\n\tshouldShowWelcome(): boolean {\n\t\treturn false;\n\t}\n\n\tgetFilterWidget()",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "\n\tlayout(height: number, width: number) {\n\t\tif (!this.enabled) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.element!.style.height = `${height}px`;\n\t\tthis.element!.style.width = `${width}px`;\n\t\tthis.element!.classList.toggle('wide', width > 640);\n\t\tthis.scrollableElement!.scanDomNode();\n\t}\n\n\tfocus() {\n\t\tif (!this.enabled) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.element!.focus();\n\t}\n\n\tprivate onDidChangeViewWelcomeState(): void {\n\t\tconst enabled = this.delegate.shouldShowWelcome();\n\n\t\tif (this.enabled === enabled) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.enabled = enabled;\n\n\t\tif (!enabled) {\n\t\t\tthis.enabledDisposables.clear();\n\t\t\treturn;\n\t\t}\n\n\t\tthis.container.classList.add('welcome');\n\t\tconst viewWelcomeContainer = append(this.container, $('.welcome-view'));\n\t\tthis.element = $('.welcome-view-content', { tabIndex: 0 });\n\t\tthis.scrollableElement = new DomScrollableElement(this.element, { alwaysConsumeMouseWheel: true, horizontal: ScrollbarVisibility.Hidden, vertical: ScrollbarVisibility.Visible, });\n\t\tappend(viewWelcomeContainer, this.scrollableElement.getDomNode());\n\n\t\tthis.enabledDisposables.add(toDisposable(() => {\n\t\t\tthis.container.classList.remove('welcome');\n\t\t\tthis.scrollableElement!.dispose();\n\t\t\tviewWelcomeContainer.remove();\n\t\t\tthis.scrollableElement = undefined;\n\t\t\tthis.element = undefined;\n\t\t}));\n\n\t\tthis.contextKeyService.onDidChangeContext(this.onDidChangeContext, this, this.enabledDisposables);\n\t\tEvent.chain(viewsRegistry.onDidChangeViewWelcomeContent, $ => $.filter(id => id === this.delegate.id))\n\t\t\t(this.onDidChangeViewWelcomeContent, this, this.enabledDisposables);\n\t\tthis.onDidChangeViewWelcomeContent();\n\t}\n\n\tprivate onDidChangeViewWelcomeContent(): void {\n\t\tconst descriptors = viewsRegistry.getViewWelcomeContent(this.delegate.id);\n\n\t\tthis.items = [];\n\n\t\tfor (const descriptor of descriptors) {\n\t\t\tif (descriptor.when === 'default') {\n\t\t\t\tthis.defaultItem = { descriptor, visible: true };\n\t\t\t} else {\n\t\t\t\tconst visible = descriptor.when ? this.contextKeyService.contextMatchesRules(descriptor.when) : true;\n\t\t\t\tthis.items.push({ descriptor, visible });\n\t\t\t}\n\t\t}\n\n\t\tthis.render();\n\t}\n\n\tprivate onDidChangeContext(): void {\n\t\tlet didChange = false;\n\n\t\tfor (const item of this.items) {\n\t\t\tif (!item.descriptor.when || item.descriptor.when === 'default') {\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\tconst visible = this.contextKeyService.contextMatchesRules(item.descriptor.when);\n\n\t\t\tif (item.visible === visible) {\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\titem.visible = visible;\n\t\t\tdidChange = true;\n\t\t}\n\n\t\tif (didChange) {\n\t\t\tthis.render();\n\t\t}\n\t}\n\n\tprivate render(): void {\n\t\tthis.renderDisposables.clear();\n\n\t\tconst contents = this.getContentDescriptors();\n\n\t\tif (contents.length === 0) {\n\t\t\tthis.container.classList.remove('welcome');\n\t\t\tthis.element!.innerText = '';\n\t\t\tthis.scrollableElement!.scanDomNode();\n\t\t\treturn;\n\t\t}\n\n\t\tthis.container.classList.add('welcome');\n\t\tthis.element!.innerText = '';\n\n\t\tfor (const { content, precondition } of contents) {\n\t\t\tconst lines = content.split('\\n');\n\n\t\t\tfor (let line of lines) {\n\t\t\t\tline = line.trim();\n\n\t\t\t\tif (!line) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tconst linkedText = parseLinkedText(line);\n\n\t\t\t\tif (linkedText.nodes.length === 1 && typeof linkedText.nodes[0] !== 'string') {\n\t\t\t\t\tconst node = linkedText.nodes[0];\n\t\t\t\t\tconst buttonContainer = append(this.element!, $('.button-container'));\n\t\t\t\t\tconst button = new Button(buttonContainer, { title: node.title, supportIcons: true, ...defaultButtonStyles });\n\t\t\t\t\tbutton.label = node.label;\n\t\t\t\t\tbutton.onDidClick(_ => {\n\t\t\t\t\t\tthis.telemetryService.publicLog2<{ viewId: string; uri: string }, WelcomeActionClassification>('views.welcomeAction', { viewId: this.delegate.id, uri: node.href });\n\t\t\t\t\t\tthis.openerService.open(node.href, { allowCommands: true });\n\t\t\t\t\t}, null, this.renderDisposables);\n\t\t\t\t\tthis.renderDisposables.add(button);\n\n\t\t\t\t\tif (precondition) {\n\t\t\t\t\t\tconst updateEnablement = () => button.enabled = this.contextKeyService.contextMatchesRules(precondition);\n\t\t\t\t\t\tupdateEnablement();\n\n\t\t\t\t\t\tconst keys = new Set(precondition.keys());\n\t\t\t\t\t\tconst onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));\n\t\t\t\t\t\tonDidChangeContext(updateEnablement, null, this.renderDisposables);\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\tconst p = append(this.element!, $('p'));\n\n\t\t\t\t\tfor (const node of linkedText.nodes) {\n\t\t\t\t\t\tif (typeof node === 'string') {\n\t\t\t\t\t\t\tappend(p, document.createTextNode(node));\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tconst link = this.renderDisposables.add(this.instantiationService.createInstance(Link, p, node, {}));\n\n\t\t\t\t\t\t\tif (precondition && node.href.startsWith('command:')) {\n\t\t\t\t\t\t\t\tconst updateEnablement = () => link.enabled = this.contextKeyService.contextMatchesRules(precondition);\n\t\t\t\t\t\t\t\tupdateEnablement();\n\n\t\t\t\t\t\t\t\tconst keys = new Set(precondition.keys());\n\t\t\t\t\t\t\t\tconst onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));\n\t\t\t\t\t\t\t\tonDidChangeContext(updateEnablement, null, this.renderDisposables);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tthis.scrollableElement!.scanDomNode();\n\t}\n\n\tprivate getContentDescriptors(): IViewContentDescriptor[] {\n\t\tconst visibleItems = this.items.filter(v => v.visible);\n\n\t\tif (visibleItems.length === 0 && this.defaultItem) {\n\t\t\treturn [this.defaultItem.descriptor];\n\t\t}\n\n\t\treturn visibleItems.map(v => v.descriptor);\n\t}\n\n\tdispose(): void {\n\t\tthis.disposables.dispose();\n\t}\n\t}\n\n\texport abstract class ViewPane extends Pane implements IView {\n\n\tprivate static readonly AlwaysShowActionsConfig = 'workbench.view.alwaysShowHeaderActions';\n\n\tprivate _onDidFocus = this._register(new Emitter<void>());\n\treadonly onDidFocus: Event<void> = this._onDidFocus.event;\n\n\tprivate _onDidBlur = this._register(new Emitter<void>());\n\treadonly onDidBlur: Event<void> = this._onDidBlur.event;\n\n\tprivate _onDidChangeBodyVisibility = this._register(new Emitter<boolean>());\n\treadonly onDidChangeBodyVisibility: Event<boolean> = this._onDidChangeBodyVisibility.event;\n\n\tprotected _onDidChangeTitleArea = this._register(new Emitter<void>());\n\treadonly onDidChangeTitleArea: Event<void> = this._onDidChangeTitleArea.event;\n\n\tprotected _onDidChangeViewWelcomeState = this._register(new Emitter<void>());\n\treadonly onDidChangeViewWelcomeState: Event<void> = this._onDidChangeViewWelcomeState.event;\n\n\tprivate _isVisible: boolean = false;\n\treadonly id: string;\n\n\tprivate _title: string;\n\tpublic get title(): string {\n\t\treturn this._title;\n\t}\n\n\tprivate _titleDescription: string | undefined;\n\tpublic get titleDescription(): string | undefined {\n\t\treturn this._titleDescription;\n\t}\n\n\treadonly menuActions: CompositeMenuActions;\n\n\tprivate progressBar!: ProgressBar;\n\tprivate progressIndicator!: IProgressIndicator;\n\n\tprivate toolbar?: WorkbenchToolBar;\n\tprivate readonly showActions: ViewPaneShowActions;\n\tprivate headerContainer?: HTMLElement;\n\tprivate titleContainer?: HTMLElement;\n\tprivate titleDescriptionContainer?: HTMLElement;\n\tprivate iconContainer?: HTMLElement;\n\tprotected twistiesContainer?: HTMLElement;\n\tprivate viewWelcomeController!: ViewWelcomeController;\n\n\tprotected readonly scopedContextKeyService: IContextKeyService;\n\n\tconstructor(\n\t\toptions: IViewPaneOptions,\n\t\t@IKeybindingService protected keybindingService: IKeybindingService,\n\t\t@IContextMenuService protected contextMenuService: IContextMenuService,\n\t\t@IConfigurationService protected readonly configurationService: IConfigurationService,\n\t\t@IContextKeyService protected contextKeyService: IContextKeyService,\n\t\t@IViewDescriptorService protected viewDescriptorService: IViewDescriptorService,\n\t\t@IInstantiationService protected instantiationService: IInstantiationService,\n\t\t@IOpenerService protected openerService: IOpenerService,\n\t\t@IThemeService protected themeService: IThemeService,\n\t\t@ITelemetryService protected telemetryService: ITelemetryService,\n\t) {\n\t\tsuper({ ...options, ...{ orientation: viewDescriptorService.getViewLocationById(options.id) === ViewContainerLocation.Panel ? Orientation.HORIZONTAL : Orientation.VERTICAL } });\n\n\t\tthis.id = options.id;\n\t\tthis._title = options.title;\n\t\tthis._titleDescription = options.titleDescription;\n\t\tthis.showActions = options.showActions ?? ViewPaneShowActions.Default;\n\n\t\tthis.scopedContextKeyService = this._register(contextKeyService.createScoped(this.element));\n\t\tthis.scopedContextKeyService.createKey('view', this.id);\n\t\tconst viewLocationKey = this.scopedContextKeyService.createKey('viewLocation', ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!));\n\t\tthis._register(Event.filter(viewDescriptorService.onDidChangeLocation, e => e.views.some(view => view.id === this.id))(() => viewLocationKey.set(ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!))));\n\n\t\tthis.menuActions = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])).createInstance(CompositeMenuActions, options.titleMenuId ?? MenuId.ViewTitle, MenuId.ViewTitleContext, { shouldForwardArgs: !options.donotForwardArgs }));\n\t\tthis._register(this.menuActions.onDidChange(() => this.updateActions()));\n\t}\n\n\toverride get headerVisible(): boolean {\n\t\treturn super.headerVisible;\n\t}\n\n\toverride set headerVisible(visible: boolean) {\n\t\tsuper.headerVisible = visible;\n\t\tthis.element.classList.toggle('merged-header', !visible);\n\t}\n\n\tsetVisible(visible: boolean): void {\n\t\tif (this._isVisible !== visible) {\n\t\t\tthis._isVisible = visible;\n\n\t\t\tif (this.isExpanded()) {\n\t\t\t\tthis._onDidChangeBodyVisibility.fire(visible);\n\t\t\t}\n\t\t}\n\t}\n\n\tisVisible(): boolean {\n\t\treturn this._isVisible;\n\t}\n\n\tisBodyVisible(): boolean {\n\t\treturn this._isVisible && this.isExpanded();\n\t}\n\n\toverride setExpanded(expanded: boolean): boolean {\n\t\tconst changed = super.setExpanded(expanded);\n\t\tif (changed) {\n\t\t\tthis._onDidChangeBodyVisibility.fire(expanded);\n\t\t}\n\t\tif (this.twistiesContainer) {\n\t\t\tthis.twistiesContainer.classList.remove(...ThemeIcon.asClassNameArray(this.getTwistyIcon(!expanded)));\n\t\t\tthis.twistiesContainer.classList.add(...ThemeIcon.asClassNameArray(this.getTwistyIcon(expanded)));\n\t\t}\n\t\treturn changed;\n\t}\n\n\toverride render(): void {\n\t\tsuper.render();\n\n\t\tconst focusTracker = trackFocus(this.element);\n\t\tthis._register(focusTracker);\n\t\tthis._register(focusTracker.onDidFocus(() => this._onDidFocus.fire()));\n\t\tthis._register(focusTracker.onDidBlur(() => this._onDidBlur.fire()));\n\t}\n\n\tprotected renderHeader(container: HTMLElement): void {\n\t\tthis.headerContainer = container;\n\n\t\tthis.twistiesContainer = append(container, $(ThemeIcon.asCSSSelector(this.getTwistyIcon(this.isExpanded()))));\n\n\t\tthis.renderHeaderTitle(container, this.title);\n\n\t\tconst actions = append(container, $('.actions'));\n\t\tactions.classList.toggle('show-always', this.showActions === ViewPaneShowActions.Always);\n\t\tactions.classList.toggle('show-expanded', this.showActions === ViewPaneShowActions.WhenExpanded);\n\t\tthis.toolbar = this.instantiationService.createInstance(WorkbenchToolBar, actions, {\n\t\t\torientation: ActionsOrientation.HORIZONTAL,\n\t\t\tactionViewItemProvider: action => this.getActionViewItem(action),\n\t\t\tariaLabel: nls.localize('viewToolbarAriaLabel', \"{0} actions\", this.title),\n\t\t\tgetKeyBinding: action => this.keybindingService.lookupKeybinding(action.id),\n\t\t\trenderDropdownAsChildElement: true,\n\t\t\tactionRunner: this.getActionRunner(),\n\t\t\tresetMenu: this.menuActions.menuId\n\t\t});\n\n\t\tthis._register(this.toolbar);\n\t\tthis.setActions();\n\n\t\tthis._register(addDisposableListener(actions, EventType.CLICK, e => e.preventDefault()));\n\n\t\tconst viewContainerModel = this.viewDescriptorService.getViewContainerByViewId(this.id);\n\t\tif (viewContainerModel) {\n\t\t\tthis._register(this.viewDescriptorService.getViewContainerModel(viewContainerModel).onDidChangeContainerInfo(({ title }) => this.updateTitle(this.title)));\n\t\t} else {\n\t\t\tconsole.error(`View container model not found for view ${this.id}`);\n\t\t}\n\n\t\tconst onDidRelevantConfigurationChange = Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration(ViewPane.AlwaysShowActionsConfig));\n\t\tthis._register(onDidRelevantConfigurationChange(this.updateActionsVisibility, this));\n\t\tthis.updateActionsVisibility();\n\t}\n\n\tprotected getTwistyIcon(expanded: boolean): ThemeIcon {\n\t\treturn expanded ? viewPaneContainerExpandedIcon : viewPaneContainerCollapsedIcon;\n\t}\n\n\toverride style(styles: IPaneStyles): void {\n\t\tsuper.style(styles);\n\n\t\tconst icon = this.getIcon();\n\t\tif (this.iconContainer) {\n\t\t\tconst fgColor = asCssValueWithDefault(styles.headerForeground, asCssVariable(foreground));\n\t\t\tif (URI.isUri(icon)) {\n\t\t\t\t// Apply background color to activity bar item provided with iconUrls\n\t\t\t\tthis.iconContainer.style.backgroundColor = fgColor;\n\t\t\t\tthis.iconContainer.style.color = '';\n\t\t\t} else {\n\t\t\t\t// Apply foreground color to activity bar items provided with codicons\n\t\t\t\tthis.iconContainer.style.color = fgColor;\n\t\t\t\tthis.iconContainer.style.backgroundColor = '';\n\t\t\t}\n\t\t}\n\t}\n\n\tprivate getIcon(): ThemeIcon | URI {\n\t\treturn this.viewDescriptorService.getViewDescriptorById(this.id)?.containerIcon || defaultViewIcon;\n\t}\n\n\tprotected renderHeaderTitle(container: HTMLElement, title: string): void {\n\t\tthis.iconContainer = append(container, $('.icon', undefined));\n\t\tconst icon = this.getIcon();\n\n\t\tlet cssClass: string | undefined = undefined;\n\t\tif (URI.isUri(icon)) {\n\t\t\tcssClass = `view-${this.id.replace(/[\\.\\:]/g, '-')}`;\n\t\t\tconst iconClass = `.pane-header .icon.${cssClass}`;\n\n\t\t\tcreateCSSRule(iconClass, `\n\t\t\t\tmask: ${asCSSUrl(icon)} no-repeat 50% 50%;\n\t\t\t\tmask-size: 24px;\n\t\t\t\t-webkit-mask: ${asCSSUrl(icon)} no-repeat 50% 50%;\n\t\t\t\t-webkit-mask-size: 16px;\n\t\t\t`);\n\t\t} else if (ThemeIcon.isThemeIcon(icon)) {\n\t\t\tcssClass = ThemeIcon.asClassName(icon);\n\t\t}\n\n\t\tif (cssClass) {\n\t\t\tthis.iconContainer.classList.add(...cssClass.split(' '));\n\t\t}\n\n\t\tconst calculatedTitle = this.calculateTitle(title);\n\t\tthis.titleContainer = append(container, $('h3.title', { title: calculatedTitle }, calculatedTitle));\n\n\t\tif (this._titleDescription) {\n\t\t\tthis.setTitleDescription(this._titleDescription);\n\t\t}\n\n\t\tthis.iconContainer.title = calculatedTitle;\n\t\tthis.iconContainer.setAttribute('aria-label', calculatedTitle);\n\t}\n\n\tprotected updateTitle(title: string): void {\n\t\tconst calculatedTitle = this.calculateTitle(title);\n\t\tif (this.titleContainer) {\n\t\t\tthis.titleContainer.textContent = calculatedTitle;\n\t\t\tthis.titleContainer.setAttribute('title', calculatedTitle);\n\t\t}\n\n\t\tif (this.iconContainer) {\n\t\t\tthis.iconContainer.title = calculatedTitle;\n\t\t\tthis.iconContainer.setAttribute('aria-label', calculatedTitle);\n\t\t}\n\n\t\tthis._title = title;\n\t\tthis._onDidChangeTitleArea.fire();\n\t}\n\n\tprivate setTitleDescription(description: string | undefined) {\n\t\tif (this.titleDescriptionContainer) {\n\t\t\tthis.titleDescriptionContainer.textContent = description ?? '';\n\t\t\tthis.titleDescriptionContainer.setAttribute('title', description ?? '');\n\t\t}\n\t\telse if (description && this.titleContainer) {\n\t\t\tthis.titleDescriptionContainer = after(this.titleContainer, $('span.description', { title: description }, description));\n\t\t}\n\t}\n\n\tprotected updateTitleDescription(description?: string | undefined): void {\n\t\tthis.setTitleDescription(description);\n\n\t\tthis._titleDescription = description;\n\t\tthis._onDidChangeTitleArea.fire();\n\t}\n\n\tprivate calculateTitle(title: string): string {\n\t\tconst viewContainer = this.viewDescriptorService.getViewContainerByViewId(this.id)!;\n\t\tconst model = this.viewDescriptorService.getViewContainerModel(viewContainer);\n\t\tconst viewDescriptor = this.viewDescriptorService.getViewDescriptorById(this.id);\n\t\tconst isDefault = this.viewDescriptorService.getDefaultContainerById(this.id) === viewContainer;\n\n\t\tif (!isDefault && viewDescriptor?.containerTitle && model.title !== viewDescriptor.containerTitle) {\n\t\t\treturn `${viewDescriptor.containerTitle}: ${title}`;\n\t\t}\n\n\t\treturn title;\n\t}\n\n\tprotected renderBody(container: HTMLElement): void {\n\t\tthis.viewWelcomeController = this._register(new ViewWelcomeController(container, this, this.instantiationService, this.openerService, this.telemetryService, this.contextKeyService));\n\t}\n\n\tprotected layoutBody(height: number, width: number): void {\n\t\tthis.viewWelcomeController.layout(height, width);\n\t}\n\n\tonDidScrollRoot() {\n\t\t// noop\n\t}\n\n\tgetProgressIndicator() {\n\t\tif (this.progressBar === undefined) {\n\t\t\t// Progress bar\n\t\t\tthis.progressBar = this._register(new ProgressBar(this.element, defaultProgressBarStyles));\n\t\t\tthis.progressBar.hide();\n\t\t}\n\n\t\tif (this.progressIndicator === undefined) {\n\t\t\tconst that = this;\n\t\t\tthis.progressIndicator = new ScopedProgressIndicator(assertIsDefined(this.progressBar), new class extends AbstractProgressScope {\n\t\t\t\tconstructor() {\n\t\t\t\t\tsuper(that.id, that.isBodyVisible());\n\t\t\t\t\tthis._register(that.onDidChangeBodyVisibility(isVisible => isVisible ? this.onScopeOpened(that.id) : this.onScopeClosed(that.id)));\n\t\t\t\t}\n\t\t\t}());\n\t\t}\n\t\treturn this.progressIndicator;\n\t}\n\n\tprotected getProgressLocation(): string {\n\t\treturn this.viewDescriptorService.getViewContainerByViewId(this.id)!.id;\n\t}\n\n\tprotected getBackgroundColor(): string {\n\t\tswitch (this.viewDescriptorService.getViewLocationById(this.id)) {\n\t\t\tcase ViewContainerLocation.Panel:\n\t\t\t\treturn PANEL_BACKGROUND;\n\t\t\tcase ViewContainerLocation.Sidebar:\n\t\t\tcase ViewContainerLocation.AuxiliaryBar:\n\t\t\t\treturn SIDE_BAR_BACKGROUND;\n\t\t}\n\n\t\treturn SIDE_BAR_BACKGROUND;\n\t}\n\n\tfocus(): void {\n\t\tif (this.shouldShowWelcome()) {\n\t\t\tthis.viewWelcomeController.focus();\n\t\t} else if (this.element) {\n\t\t\tthis.element.focus();\n\t\t\tthis._onDidFocus.fire();\n\t\t}\n\t}\n\n\tprivate setActions(): void {\n\t\tif (this.toolbar) {\n\t\t\tconst primaryActions = [...this.menuActions.getPrimaryActions()];\n\t\t\tif (this.shouldShowFilterInHeader()) {\n\t\t\t\tprimaryActions.unshift(VIEWPANE_FILTER_ACTION);\n\t\t\t}\n\t\t\tthis.toolbar.setActions(prepareActions(primaryActions), prepareActions(this.menuActions.getSecondaryActions()));\n\t\t\tthis.toolbar.context = this.getActionsContext();\n\t\t}\n\t}\n\n\tprivate updateActionsVisibility(): void {\n\t\tif (!this.headerContainer) {\n\t\t\treturn;\n\t\t}\n\t\tconst shouldAlwaysShowActions = this.configurationService.getValue<boolean>('workbench.view.alwaysShowHeaderActions');\n\t\tthis.headerContainer.classList.toggle('actions-always-visible', shouldAlwaysShowActions);\n\t}\n\n\tprotected updateActions(): void {\n\t\tthis.setActions();\n\t\tthis._onDidChangeTitleArea.fire();\n\t}\n\n\tgetActionViewItem(action: IAction, options?: IDropdownMenuActionViewItemOptions): IActionViewItem | undefined {\n\t\tif (action.id === VIEWPANE_FILTER_ACTION.id) {\n\t\t\tconst that = this;\n\t\t\treturn new class extends BaseActionViewItem {\n\t\t\t\tconstructor() { super(null, action); }\n\t\t\t\toverride setFocusable(): void { /* noop input elements are focusable by default */ }\n\t\t\t\toverride get trapsArrowNavigation(): boolean { return true; }\n\t\t\t\toverride render(container: HTMLElement): void {\n\t\t\t\t\tcontainer.classList.add('viewpane-filter-container');\n\t\t\t\t\tappend(container, that.getFilterWidget()!.element);\n\t\t\t\t}\n\t\t\t};\n\t\t}\n\t\treturn createActionViewItem(this.instantiationService, action, { ...options, ...{ menuAsChild: action instanceof SubmenuItemAction } });\n\t}\n\n\tgetActionsContext(): unknown {\n\t\treturn undefined;\n\t}\n\n\tgetActionRunner(): IActionRunner | undefined {\n\t\treturn undefined;\n\t}\n\n\tgetOptimalWidth(): number {\n\t\treturn 0;\n\t}\n\n\tsaveState(): void {\n\t\t// Subclasses to implement for saving state\n\t}\n\n\tshouldShowWelcome(): boolean {\n\t\treturn false;\n\t}\n\n\tgetFilterWidget()",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,3)",
			"modifiedRange": "[1,52)",
			"innerChanges": null
		},
		{
			"originalRange": "[7,8)",
			"modifiedRange": "[56,57)",
			"innerChanges": [
				{
					"originalRange": "[7,64 -> 7,64]",
					"modifiedRange": "[56,64 -> 56,73]"
				}
			]
		},
		{
			"originalRange": "[20,21)",
			"modifiedRange": "[69,70)",
			"innerChanges": [
				{
					"originalRange": "[20,8 -> 20,25]",
					"modifiedRange": "[69,8 -> 69,14]"
				}
			]
		},
		{
			"originalRange": "[42,43)",
			"modifiedRange": "[91,172)",
			"innerChanges": null
		},
		{
			"originalRange": "[44,44)",
			"modifiedRange": "[173,175)",
			"innerChanges": null
		},
		{
			"originalRange": "[49,50)",
			"modifiedRange": "[180,181)",
			"innerChanges": [
				{
					"originalRange": "[49,1 -> 49,1]",
					"modifiedRange": "[180,1 -> 180,2]"
				}
			]
		},
		{
			"originalRange": "[51,52)",
			"modifiedRange": "[182,183)",
			"innerChanges": [
				{
					"originalRange": "[51,1 -> 51,1]",
					"modifiedRange": "[182,1 -> 182,2]"
				}
			]
		},
		{
			"originalRange": "[95,100)",
			"modifiedRange": "[226,227)",
			"innerChanges": [
				{
					"originalRange": "[95,1 -> 99,1]",
					"modifiedRange": "[226,1 -> 226,1]"
				},
				{
					"originalRange": "[99,31 -> 99,31]",
					"modifiedRange": "[226,31 -> 226,32]"
				}
			]
		},
		{
			"originalRange": "[129,131)",
			"modifiedRange": "[256,256)",
			"innerChanges": null
		},
		{
			"originalRange": "[324,326)",
			"modifiedRange": "[449,449)",
			"innerChanges": null
		},
		{
			"originalRange": "[327,342)",
			"modifiedRange": "[450,451)",
			"innerChanges": [
				{
					"originalRange": "[327,8 -> 329,9]",
					"modifiedRange": "[450,8 -> 450,8]"
				},
				{
					"originalRange": "[329,24 -> 330,26]",
					"modifiedRange": "[450,23 -> 450,27]"
				},
				{
					"originalRange": "[330,31 -> 331,28]",
					"modifiedRange": "[450,32 -> 450,32]"
				},
				{
					"originalRange": "[331,47 -> 331,74]",
					"modifiedRange": "[450,51 -> 450,52]"
				},
				{
					"originalRange": "[331,88 -> 333,9]",
					"modifiedRange": "[450,66 -> 450,74]"
				},
				{
					"originalRange": "[333,13 -> 337,30]",
					"modifiedRange": "[450,78 -> 450,88]"
				},
				{
					"originalRange": "[337,37 -> 339,5]",
					"modifiedRange": "[450,95 -> 450,96]"
				},
				{
					"originalRange": "[339,8 -> 339,78]",
					"modifiedRange": "[450,99 -> 450,114]"
				},
				{
					"originalRange": "[339,87 -> 340,3]",
					"modifiedRange": "[450,123 -> 450,137]"
				},
				{
					"originalRange": "[340,8 -> 340,59]",
					"modifiedRange": "[450,142 -> 450,157]"
				},
				{
					"originalRange": "[340,66 -> 341,26]",
					"modifiedRange": "[450,164 -> 450,183]"
				}
			]
		},
		{
			"originalRange": "[345,351)",
			"modifiedRange": "[454,455)",
			"innerChanges": [
				{
					"originalRange": "[345,1 -> 346,2]",
					"modifiedRange": "[454,1 -> 454,1]"
				},
				{
					"originalRange": "[346,24 -> 347,27]",
					"modifiedRange": "[454,23 -> 454,27]"
				},
				{
					"originalRange": "[347,30 -> 348,53]",
					"modifiedRange": "[454,30 -> 454,43]"
				},
				{
					"originalRange": "[348,60 -> 350,4 EOL]",
					"modifiedRange": "[454,50 -> 454,52 EOL]"
				}
			]
		},
		{
			"originalRange": "[394,395)",
			"modifiedRange": "[498,499)",
			"innerChanges": [
				{
					"originalRange": "[394,24 -> 394,27]",
					"modifiedRange": "[498,24 -> 498,28]"
				}
			]
		},
		{
			"originalRange": "[457,540)",
			"modifiedRange": "[561,561)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/penalize-fragmentation/1.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/penalize-fragmentation/1.txt

```text
import { IChange, IDiffComputationResult } from 'vs/editor/common/diff/diffComputer';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/penalize-fragmentation/2.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/penalize-fragmentation/2.txt

```text
import { IDocumentDiffProviderOptions } from 'vs/editor/common/diff/documentDiffProvider';
import { IChange } from 'vs/editor/common/diff/smartLinesDiffComputer';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/penalize-fragmentation/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/penalize-fragmentation/advanced.expected.diff.json

```json
{
	"original": {
		"content": "import { IChange, IDiffComputationResult } from 'vs/editor/common/diff/diffComputer';",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "import { IDocumentDiffProviderOptions } from 'vs/editor/common/diff/documentDiffProvider';\nimport { IChange } from 'vs/editor/common/diff/smartLinesDiffComputer';",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,3)",
			"innerChanges": [
				{
					"originalRange": "[1,1 -> 1,1]",
					"modifiedRange": "[1,1 -> 2,1]"
				},
				{
					"originalRange": "[1,17 -> 1,41]",
					"modifiedRange": "[2,17 -> 2,17]"
				},
				{
					"originalRange": "[1,72 -> 1,84]",
					"modifiedRange": "[2,48 -> 2,70]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/penalize-fragmentation/advanced.human.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/penalize-fragmentation/advanced.human.diff.json

```json
{
	"originalFileName": "./1.txt",
	"modifiedFileName": "./2.txt",
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,3)",
			"innerChanges": [
				{
					"originalRange": "[1,1 -> 1,1]",
					"modifiedRange": "[1,1 -> 1,91]"
				},
				{
					"originalRange": "[1,17 -> 1,41]",
					"modifiedRange": "[2,17 -> 2,17]"
				},
				{
					"originalRange": "[1,72 -> 1,73]",
					"modifiedRange": "[2,48 -> 2,59]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/penalize-fragmentation/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/penalize-fragmentation/legacy.expected.diff.json

```json
{
	"original": {
		"content": "import { IChange, IDiffComputationResult } from 'vs/editor/common/diff/diffComputer';",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "import { IDocumentDiffProviderOptions } from 'vs/editor/common/diff/documentDiffProvider';\nimport { IChange } from 'vs/editor/common/diff/smartLinesDiffComputer';",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,3)",
			"innerChanges": [
				{
					"originalRange": "[1,11 -> 1,20]",
					"modifiedRange": "[1,11 -> 1,77]"
				},
				{
					"originalRange": "[1,24 -> 1,41]",
					"modifiedRange": "[1,81 -> 2,17]"
				},
				{
					"originalRange": "[1,72 -> 1,73]",
					"modifiedRange": "[2,48 -> 2,59]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/random-match-1/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/random-match-1/1.tst

```text
const sourceActions = notebookKernelService.getSourceActions(notebook, editor.scopedContextKeyService);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/random-match-1/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/random-match-1/2.tst

```text
const sourceActions = notebookKernelService.getSourceActions(notebookTextModel, scopedContextKeyService);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/random-match-1/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/random-match-1/advanced.expected.diff.json

```json
{
	"original": {
		"content": "const sourceActions = notebookKernelService.getSourceActions(notebook, editor.scopedContextKeyService);\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "const sourceActions = notebookKernelService.getSourceActions(notebookTextModel, scopedContextKeyService);\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,2)",
			"innerChanges": [
				{
					"originalRange": "[1,62 -> 1,79]",
					"modifiedRange": "[1,62 -> 1,81]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/random-match-1/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/random-match-1/legacy.expected.diff.json

```json
{
	"original": {
		"content": "const sourceActions = notebookKernelService.getSourceActions(notebook, editor.scopedContextKeyService);\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "const sourceActions = notebookKernelService.getSourceActions(notebookTextModel, scopedContextKeyService);\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,2)",
			"innerChanges": [
				{
					"originalRange": "[1,70 -> 1,79]",
					"modifiedRange": "[1,70 -> 1,81]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/random-match-2/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/random-match-2/1.tst

```text
if (!all.length && !sourceActions.length) {
	const activeNotebookModel = getNotebookEditorFromEditorPane(editorService.activeEditorPane)?.textModel;
	if (activeNotebookModel) {
		const language = this.getSuggestedLanguage(activeNotebookModel);
		suggestedExtension = language ? this.getSuggestedKernelFromLanguage(activeNotebookModel.viewType, language) : undefined;
	}
	if (suggestedExtension) {
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/random-match-2/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/random-match-2/2.tst

```text
if (!all.length && !sourceActions.length) {
	const language = this.getSuggestedLanguage(notebookTextModel);
	suggestedExtension = language ? this.getSuggestedKernelFromLanguage(notebookTextModel.viewType, language) : undefined;
	if (suggestedExtension) {
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/random-match-2/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/random-match-2/advanced.expected.diff.json

```json
{
	"original": {
		"content": "if (!all.length && !sourceActions.length) {\n\tconst activeNotebookModel = getNotebookEditorFromEditorPane(editorService.activeEditorPane)?.textModel;\n\tif (activeNotebookModel) {\n\t\tconst language = this.getSuggestedLanguage(activeNotebookModel);\n\t\tsuggestedExtension = language ? this.getSuggestedKernelFromLanguage(activeNotebookModel.viewType, language) : undefined;\n\t}\n\tif (suggestedExtension) {\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "if (!all.length && !sourceActions.length) {\n\tconst language = this.getSuggestedLanguage(notebookTextModel);\n\tsuggestedExtension = language ? this.getSuggestedKernelFromLanguage(notebookTextModel.viewType, language) : undefined;\n\tif (suggestedExtension) {\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,7)",
			"modifiedRange": "[2,4)",
			"innerChanges": [
				{
					"originalRange": "[2,1 -> 4,2]",
					"modifiedRange": "[2,1 -> 2,1]"
				},
				{
					"originalRange": "[4,46 -> 4,53]",
					"modifiedRange": "[2,45 -> 2,46]"
				},
				{
					"originalRange": "[4,60 -> 4,60]",
					"modifiedRange": "[2,53 -> 2,57]"
				},
				{
					"originalRange": "[5,1 -> 5,2]",
					"modifiedRange": "[3,1 -> 3,1]"
				},
				{
					"originalRange": "[5,71 -> 5,78]",
					"modifiedRange": "[3,70 -> 3,71]"
				},
				{
					"originalRange": "[5,85 -> 5,85]",
					"modifiedRange": "[3,78 -> 3,82]"
				},
				{
					"originalRange": "[6,1 -> 7,1]",
					"modifiedRange": "[4,1 -> 4,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/random-match-2/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/random-match-2/legacy.expected.diff.json

```json
{
	"original": {
		"content": "if (!all.length && !sourceActions.length) {\n\tconst activeNotebookModel = getNotebookEditorFromEditorPane(editorService.activeEditorPane)?.textModel;\n\tif (activeNotebookModel) {\n\t\tconst language = this.getSuggestedLanguage(activeNotebookModel);\n\t\tsuggestedExtension = language ? this.getSuggestedKernelFromLanguage(activeNotebookModel.viewType, language) : undefined;\n\t}\n\tif (suggestedExtension) {\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "if (!all.length && !sourceActions.length) {\n\tconst language = this.getSuggestedLanguage(notebookTextModel);\n\tsuggestedExtension = language ? this.getSuggestedKernelFromLanguage(notebookTextModel.viewType, language) : undefined;\n\tif (suggestedExtension) {\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,7)",
			"modifiedRange": "[2,4)",
			"innerChanges": [
				{
					"originalRange": "[2,1 -> 4,2]",
					"modifiedRange": "[2,1 -> 2,1]"
				},
				{
					"originalRange": "[4,46 -> 4,53]",
					"modifiedRange": "[2,45 -> 2,46]"
				},
				{
					"originalRange": "[4,60 -> 4,60]",
					"modifiedRange": "[2,53 -> 2,57]"
				},
				{
					"originalRange": "[5,2 -> 5,3]",
					"modifiedRange": "[3,2 -> 3,2]"
				},
				{
					"originalRange": "[5,71 -> 5,78]",
					"modifiedRange": "[3,70 -> 3,71]"
				},
				{
					"originalRange": "[5,85 -> 5,85]",
					"modifiedRange": "[3,78 -> 3,82]"
				},
				{
					"originalRange": "[5,123 -> 6,3 EOL]",
					"modifiedRange": "[3,120 -> 3,120 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/random-match-3/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/random-match-3/1.tst

```text
const { selected, all, suggestions, hidden } = notebookKernelService.getMatchingKernel(notebook);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/random-match-3/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/random-match-3/2.tst

```text
const scopedContextKeyService = editor.scopedContextKeyService;
const matchResult = notebookKernelService.getMatchingKernel(notebook);
const { selected, all } = matchResult;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/random-match-3/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/random-match-3/advanced.expected.diff.json

```json
{
	"original": {
		"content": "const { selected, all, suggestions, hidden } = notebookKernelService.getMatchingKernel(notebook);\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "const scopedContextKeyService = editor.scopedContextKeyService;\nconst matchResult = notebookKernelService.getMatchingKernel(notebook);\nconst { selected, all } = matchResult;\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,4)",
			"innerChanges": [
				{
					"originalRange": "[1,6 -> 1,45]",
					"modifiedRange": "[1,6 -> 2,18]"
				},
				{
					"originalRange": "[2,1 -> 2,1 EOL]",
					"modifiedRange": "[3,1 -> 4,1 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/random-match-3/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/random-match-3/legacy.expected.diff.json

```json
{
	"original": {
		"content": "const { selected, all, suggestions, hidden } = notebookKernelService.getMatchingKernel(notebook);\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "const scopedContextKeyService = editor.scopedContextKeyService;\nconst matchResult = notebookKernelService.getMatchingKernel(notebook);\nconst { selected, all } = matchResult;\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,4)",
			"innerChanges": [
				{
					"originalRange": "[1,7 -> 1,32]",
					"modifiedRange": "[1,7 -> 2,2]"
				},
				{
					"originalRange": "[1,35 -> 1,45]",
					"modifiedRange": "[2,5 -> 2,18]"
				},
				{
					"originalRange": "[1,98 -> 1,98 EOL]",
					"modifiedRange": "[2,71 -> 3,39 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/shifting-parameters/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/shifting-parameters/1.tst

```text
function x(alignments: RangeMapping[]): x[] { }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/shifting-parameters/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/shifting-parameters/2.tst

```text
function x(alignments: RangeMapping[], originalLines: string[], modifiedLines: string[]): x[] { }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/shifting-parameters/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/shifting-parameters/advanced.expected.diff.json

```json
{
	"original": {
		"content": "function x(alignments: RangeMapping[]): x[] { }\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "function x(alignments: RangeMapping[], originalLines: string[], modifiedLines: string[]): x[] { }\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,2)",
			"innerChanges": [
				{
					"originalRange": "[1,38 -> 1,38]",
					"modifiedRange": "[1,38 -> 1,88]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/shifting-parameters/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/shifting-parameters/legacy.expected.diff.json

```json
{
	"original": {
		"content": "function x(alignments: RangeMapping[]): x[] { }\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "function x(alignments: RangeMapping[], originalLines: string[], modifiedLines: string[]): x[] { }\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,2)",
			"innerChanges": [
				{
					"originalRange": "[1,38 -> 1,38]",
					"modifiedRange": "[1,38 -> 1,88]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/shifting-twice/1.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/shifting-twice/1.txt

```text
		for (extendToBottom = 0; extendToBottom < linesBelow; extendToBottom++) {
			const origLine = move.original.endLineNumberExclusive + extendToBottom;
			const modLine = move.modified.endLineNumberExclusive + extendToBottom;
			if (origLine > originalLines.length || modLine > modifiedLines.length) {
				break;
			}
			if (modifiedSet.contains(modLine) || originalSet.contains(origLine)) {
				break;
			}
			if (!areLinesSimilar(originalLines[origLine - 1], modifiedLines[modLine - 1], timeout)) {
				break;
			}
		}

		if (extendToBottom > 0) {
			originalSet.addRange(new LineRange(move.original.endLineNumberExclusive, move.original.endLineNumberExclusive + extendToBottom));
			modifiedSet.addRange(new LineRange(move.modified.endLineNumberExclusive, move.modified.endLineNumberExclusive + extendToBottom));
		}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/shifting-twice/2.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/shifting-twice/2.txt

```text
		for (extendToBottom = 0; extendToBottom < linesBelow; extendToBottom++) {
			const origLine = move.original.endLineNumberExclusive + extendToBottom;
			const modLine = move.modified.endLineNumberExclusive + extendToBottom;
			if (origLine > originalLines.length || modLine > modifiedLines.length) {
				break;
			}
			if (modifiedSet.contains(modLine) || originalSet.contains(origLine)) {
				break;
			}
			if (!areLinesSimilar(originalLines[origLine - 1], modifiedLines[modLine - 1], timeout)) {
				break;
			}
			if (originalLines[origLine - 1].trim().length !== 0) {
				extendToBottomWithoutEmptyLines = extendToBottom + 1;
			}
		}

		if (extendToBottomWithoutEmptyLines > 0) {
			originalSet.addRange(new LineRange(move.original.endLineNumberExclusive, move.original.endLineNumberExclusive + extendToBottomWithoutEmptyLines));
			modifiedSet.addRange(new LineRange(move.modified.endLineNumberExclusive, move.modified.endLineNumberExclusive + extendToBottomWithoutEmptyLines));
		}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/shifting-twice/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/shifting-twice/advanced.expected.diff.json

```json
{
	"original": {
		"content": "\t\tfor (extendToBottom = 0; extendToBottom < linesBelow; extendToBottom++) {\n\t\t\tconst origLine = move.original.endLineNumberExclusive + extendToBottom;\n\t\t\tconst modLine = move.modified.endLineNumberExclusive + extendToBottom;\n\t\t\tif (origLine > originalLines.length || modLine > modifiedLines.length) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tif (modifiedSet.contains(modLine) || originalSet.contains(origLine)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tif (!areLinesSimilar(originalLines[origLine - 1], modifiedLines[modLine - 1], timeout)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\n\t\tif (extendToBottom > 0) {\n\t\t\toriginalSet.addRange(new LineRange(move.original.endLineNumberExclusive, move.original.endLineNumberExclusive + extendToBottom));\n\t\t\tmodifiedSet.addRange(new LineRange(move.modified.endLineNumberExclusive, move.modified.endLineNumberExclusive + extendToBottom));\n\t\t}",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "\t\tfor (extendToBottom = 0; extendToBottom < linesBelow; extendToBottom++) {\n\t\t\tconst origLine = move.original.endLineNumberExclusive + extendToBottom;\n\t\t\tconst modLine = move.modified.endLineNumberExclusive + extendToBottom;\n\t\t\tif (origLine > originalLines.length || modLine > modifiedLines.length) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tif (modifiedSet.contains(modLine) || originalSet.contains(origLine)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tif (!areLinesSimilar(originalLines[origLine - 1], modifiedLines[modLine - 1], timeout)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tif (originalLines[origLine - 1].trim().length !== 0) {\n\t\t\t\textendToBottomWithoutEmptyLines = extendToBottom + 1;\n\t\t\t}\n\t\t}\n\n\t\tif (extendToBottomWithoutEmptyLines > 0) {\n\t\t\toriginalSet.addRange(new LineRange(move.original.endLineNumberExclusive, move.original.endLineNumberExclusive + extendToBottomWithoutEmptyLines));\n\t\t\tmodifiedSet.addRange(new LineRange(move.modified.endLineNumberExclusive, move.modified.endLineNumberExclusive + extendToBottomWithoutEmptyLines));\n\t\t}",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[13,13)",
			"modifiedRange": "[13,16)",
			"innerChanges": [
				{
					"originalRange": "[13,1 -> 13,1]",
					"modifiedRange": "[13,1 -> 16,1]"
				}
			]
		},
		{
			"originalRange": "[15,18)",
			"modifiedRange": "[18,21)",
			"innerChanges": [
				{
					"originalRange": "[15,7 -> 15,21]",
					"modifiedRange": "[18,7 -> 18,38]"
				},
				{
					"originalRange": "[16,116 -> 16,130]",
					"modifiedRange": "[19,116 -> 19,147]"
				},
				{
					"originalRange": "[17,116 -> 17,130]",
					"modifiedRange": "[20,116 -> 20,147]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/shifting-twice/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/shifting-twice/legacy.expected.diff.json

```json
{
	"original": {
		"content": "\t\tfor (extendToBottom = 0; extendToBottom < linesBelow; extendToBottom++) {\n\t\t\tconst origLine = move.original.endLineNumberExclusive + extendToBottom;\n\t\t\tconst modLine = move.modified.endLineNumberExclusive + extendToBottom;\n\t\t\tif (origLine > originalLines.length || modLine > modifiedLines.length) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tif (modifiedSet.contains(modLine) || originalSet.contains(origLine)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tif (!areLinesSimilar(originalLines[origLine - 1], modifiedLines[modLine - 1], timeout)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\n\t\tif (extendToBottom > 0) {\n\t\t\toriginalSet.addRange(new LineRange(move.original.endLineNumberExclusive, move.original.endLineNumberExclusive + extendToBottom));\n\t\t\tmodifiedSet.addRange(new LineRange(move.modified.endLineNumberExclusive, move.modified.endLineNumberExclusive + extendToBottom));\n\t\t}",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "\t\tfor (extendToBottom = 0; extendToBottom < linesBelow; extendToBottom++) {\n\t\t\tconst origLine = move.original.endLineNumberExclusive + extendToBottom;\n\t\t\tconst modLine = move.modified.endLineNumberExclusive + extendToBottom;\n\t\t\tif (origLine > originalLines.length || modLine > modifiedLines.length) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tif (modifiedSet.contains(modLine) || originalSet.contains(origLine)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tif (!areLinesSimilar(originalLines[origLine - 1], modifiedLines[modLine - 1], timeout)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tif (originalLines[origLine - 1].trim().length !== 0) {\n\t\t\t\textendToBottomWithoutEmptyLines = extendToBottom + 1;\n\t\t\t}\n\t\t}\n\n\t\tif (extendToBottomWithoutEmptyLines > 0) {\n\t\t\toriginalSet.addRange(new LineRange(move.original.endLineNumberExclusive, move.original.endLineNumberExclusive + extendToBottomWithoutEmptyLines));\n\t\t\tmodifiedSet.addRange(new LineRange(move.modified.endLineNumberExclusive, move.modified.endLineNumberExclusive + extendToBottomWithoutEmptyLines));\n\t\t}",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[13,13)",
			"modifiedRange": "[13,16)",
			"innerChanges": null
		},
		{
			"originalRange": "[15,18)",
			"modifiedRange": "[18,21)",
			"innerChanges": [
				{
					"originalRange": "[15,21 -> 15,21]",
					"modifiedRange": "[18,21 -> 18,38]"
				},
				{
					"originalRange": "[16,130 -> 16,130]",
					"modifiedRange": "[19,130 -> 19,147]"
				},
				{
					"originalRange": "[17,130 -> 17,130]",
					"modifiedRange": "[20,130 -> 20,147]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/sorted-offsets/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/sorted-offsets/1.tst

```text
import { neverAbortedSignal } from './common/abort';
import { defer } from './common/defer';
import { EventEmitter } from './common/Event';
import { ExecuteWrapper } from './common/Executor';
import { BulkheadRejectedError } from './errors/BulkheadRejectedError';
import { TaskCancelledError } from './errors/Errors';
import { IDefaultPolicyContext, IPolicy } from './Policy';

interface IQueueItem<T> {
	signal: AbortSignal;
	fn(context: IDefaultPolicyContext): Promise<T> | T;
	resolve(value: T): void;
	reject(error: Error): void;
}

export class BulkheadPolicy implements IPolicy {
	public declare readonly _altReturn: never;

	private active = 0;
	private readonly queue: Array<IQueueItem<unknown>> = [];
	private readonly onRejectEmitter = new EventEmitter<void>();
	private readonly executor = new ExecuteWrapper();

	/**
	 * @inheritdoc
	 */
	public readonly onSuccess = this.executor.onSuccess;

	/**
	 * @inheritdoc
	 */
	public readonly onFailure = this.executor.onFailure;

	/**
	 * Emitter that fires when an item is rejected from the bulkhead.
	 */
	public readonly onReject = this.onRejectEmitter.addListener;

	/**
	 * Returns the number of available execution slots at this point in time.
	 */
	public get executionSlots() {
		return this.capacity - this.active;
	}

	/**
	 * Returns the number of queue slots at this point in time.
	 */
	public get queueSlots() {
		return this.queueCapacity - this.queue.length;
	}

	/**
	 * Bulkhead limits concurrent requests made.
	 */
	constructor(private readonly capacity: number, private readonly queueCapacity: number) { }

	/**
	 * Executes the given function.
	 * @param fn Function to execute
	 * @throws a {@link BulkheadRejectedException} if the bulkhead limits are exceeeded
	 */
	public async execute<T>(
		fn: (context: IDefaultPolicyContext) => PromiseLike<T> | T,
		signal = neverAbortedSignal,
	): Promise<T> {
		if (signal.aborted) {
			throw new TaskCancelledError();
		}

		if (this.active < this.capacity) {
			this.active++;
			try {
				return await fn({ signal });
			} finally {
				this.active--;
				this.dequeue();
			}
		}

		if (this.queue.length > this.queueCapacity) {
			const { resolve, reject, promise } = defer<T>();
			this.queue.push({ signal, fn, resolve, reject });
			return promise;
		}

		this.onRejectEmitter.emit();
		throw new BulkheadRejectedError(this.capacity, this.queueCapacity);
	}

	private dequeue() {
		const item = this.queue.shift();
		if (!item) {
			return;
		}

		Promise.resolve()
			.then(() => this.execute(item.fn, item.signal))
			.then(item.resolve)
			.catch(item.reject);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/sorted-offsets/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/sorted-offsets/2.tst

```text
import { neverAbortedSignal } from './common/abort';
import { defer } from './common/defer';
import { EventEmitter } from './common/Event';
import { ExecuteWrapper } from './common/Executor';
import { BulkheadRejectedError } from './errors/BulkheadRejectedError';
import { TaskCancelledError } from './errors/Errors';
import { IDefaultPolicyContext, IPolicy } from './Policy';

interface IQueueItem<T> {
	signal: AbortSignal;
	fn(context: IDefaultPolicyContext): Promise<T> | T;
	resolve(value: T): void;
	reject(error: Error): void;
}

export class BulkheadPolicy implements IPolicy {
	public declare readonly _altReturn: never;

	private active = 0;
	private readonly queue: Array<IQueueItem<unknown>> = [];
	private readonly onRejectEmitter = new EventEmitter<void>();
	private readonly executor = new ExecuteWrapper();

	/**
	 * @inheritdoc
	 */
	public readonly onSuccess = this.executor.onSuccess;

	/**
	 * @inheritdoc
	 */
	public readonly onFailure = this.executor.onFailure;

	/**
	 * Emitter that fires when an item is rejected from the bulkhead.
	 */
	public readonly onReject = this.onRejectEmitter.addListener;

	/**
	 * Returns the number of available execution slots at this point in time.
	 */
	public get executionSlots() {
		return this.capacity - this.active;
	}

	/**
	 * Returns the number of queue slots at this point in time.
	 */
	public get queueSlots() {
		return this.queueCapacity - this.queue.length;
	}

	/**
	 * Bulkhead limits concurrent requests made.
	 */
	constructor(private readonly capacity: number, private readonly queueCapacity: number) { }

	/**
	 * Executes the given function.
	 * @param fn Function to execute
	 * @throws a {@link BulkheadRejectedException} if the bulkhead limits are exceeeded
	 */
	public async execute<T>(
		fn: (context: IDefaultPolicyContext) => PromiseLike<T> | T,
		signal = neverAbortedSignal,
	): Promise<T> {
		if (signal.aborted) {
			throw new TaskCancelledError();
		}

		if (this.active < this.capacity) {
			this.active++;
			try {
				return await fn({ signal });
			} finally {
				this.active--;
				this.dequeue();
			}
		}

		if (this.queue.length >= this.queueCapacity) {
			this.onRejectEmitter.emit();
			throw new BulkheadRejectedError(this.capacity, this.queueCapacity);
		}
		const { resolve, reject, promise } = defer<T>();
		this.queue.push({ signal, fn, resolve, reject });
		return promise;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/sorted-offsets/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/sorted-offsets/advanced.expected.diff.json

```json
{
	"original": {
		"content": "import { neverAbortedSignal } from './common/abort';\nimport { defer } from './common/defer';\nimport { EventEmitter } from './common/Event';\nimport { ExecuteWrapper } from './common/Executor';\nimport { BulkheadRejectedError } from './errors/BulkheadRejectedError';\nimport { TaskCancelledError } from './errors/Errors';\nimport { IDefaultPolicyContext, IPolicy } from './Policy';\n\ninterface IQueueItem<T> {\n\tsignal: AbortSignal;\n\tfn(context: IDefaultPolicyContext): Promise<T> | T;\n\tresolve(value: T): void;\n\treject(error: Error): void;\n}\n\nexport class BulkheadPolicy implements IPolicy {\n\tpublic declare readonly _altReturn: never;\n\n\tprivate active = 0;\n\tprivate readonly queue: Array<IQueueItem<unknown>> = [];\n\tprivate readonly onRejectEmitter = new EventEmitter<void>();\n\tprivate readonly executor = new ExecuteWrapper();\n\n\t/**\n\t * @inheritdoc\n\t */\n\tpublic readonly onSuccess = this.executor.onSuccess;\n\n\t/**\n\t * @inheritdoc\n\t */\n\tpublic readonly onFailure = this.executor.onFailure;\n\n\t/**\n\t * Emitter that fires when an item is rejected from the bulkhead.\n\t */\n\tpublic readonly onReject = this.onRejectEmitter.addListener;\n\n\t/**\n\t * Returns the number of available execution slots at this point in time.\n\t */\n\tpublic get executionSlots() {\n\t\treturn this.capacity - this.active;\n\t}\n\n\t/**\n\t * Returns the number of queue slots at this point in time.\n\t */\n\tpublic get queueSlots() {\n\t\treturn this.queueCapacity - this.queue.length;\n\t}\n\n\t/**\n\t * Bulkhead limits concurrent requests made.\n\t */\n\tconstructor(private readonly capacity: number, private readonly queueCapacity: number) { }\n\n\t/**\n\t * Executes the given function.\n\t * @param fn Function to execute\n\t * @throws a {@link BulkheadRejectedException} if the bulkhead limits are exceeeded\n\t */\n\tpublic async execute<T>(\n\t\tfn: (context: IDefaultPolicyContext) => PromiseLike<T> | T,\n\t\tsignal = neverAbortedSignal,\n\t): Promise<T> {\n\t\tif (signal.aborted) {\n\t\t\tthrow new TaskCancelledError();\n\t\t}\n\n\t\tif (this.active < this.capacity) {\n\t\t\tthis.active++;\n\t\t\ttry {\n\t\t\t\treturn await fn({ signal });\n\t\t\t} finally {\n\t\t\t\tthis.active--;\n\t\t\t\tthis.dequeue();\n\t\t\t}\n\t\t}\n\n\t\tif (this.queue.length > this.queueCapacity) {\n\t\t\tconst { resolve, reject, promise } = defer<T>();\n\t\t\tthis.queue.push({ signal, fn, resolve, reject });\n\t\t\treturn promise;\n\t\t}\n\n\t\tthis.onRejectEmitter.emit();\n\t\tthrow new BulkheadRejectedError(this.capacity, this.queueCapacity);\n\t}\n\n\tprivate dequeue() {\n\t\tconst item = this.queue.shift();\n\t\tif (!item) {\n\t\t\treturn;\n\t\t}\n\n\t\tPromise.resolve()\n\t\t\t.then(() => this.execute(item.fn, item.signal))\n\t\t\t.then(item.resolve)\n\t\t\t.catch(item.reject);\n\t}\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { neverAbortedSignal } from './common/abort';\nimport { defer } from './common/defer';\nimport { EventEmitter } from './common/Event';\nimport { ExecuteWrapper } from './common/Executor';\nimport { BulkheadRejectedError } from './errors/BulkheadRejectedError';\nimport { TaskCancelledError } from './errors/Errors';\nimport { IDefaultPolicyContext, IPolicy } from './Policy';\n\ninterface IQueueItem<T> {\n\tsignal: AbortSignal;\n\tfn(context: IDefaultPolicyContext): Promise<T> | T;\n\tresolve(value: T): void;\n\treject(error: Error): void;\n}\n\nexport class BulkheadPolicy implements IPolicy {\n\tpublic declare readonly _altReturn: never;\n\n\tprivate active = 0;\n\tprivate readonly queue: Array<IQueueItem<unknown>> = [];\n\tprivate readonly onRejectEmitter = new EventEmitter<void>();\n\tprivate readonly executor = new ExecuteWrapper();\n\n\t/**\n\t * @inheritdoc\n\t */\n\tpublic readonly onSuccess = this.executor.onSuccess;\n\n\t/**\n\t * @inheritdoc\n\t */\n\tpublic readonly onFailure = this.executor.onFailure;\n\n\t/**\n\t * Emitter that fires when an item is rejected from the bulkhead.\n\t */\n\tpublic readonly onReject = this.onRejectEmitter.addListener;\n\n\t/**\n\t * Returns the number of available execution slots at this point in time.\n\t */\n\tpublic get executionSlots() {\n\t\treturn this.capacity - this.active;\n\t}\n\n\t/**\n\t * Returns the number of queue slots at this point in time.\n\t */\n\tpublic get queueSlots() {\n\t\treturn this.queueCapacity - this.queue.length;\n\t}\n\n\t/**\n\t * Bulkhead limits concurrent requests made.\n\t */\n\tconstructor(private readonly capacity: number, private readonly queueCapacity: number) { }\n\n\t/**\n\t * Executes the given function.\n\t * @param fn Function to execute\n\t * @throws a {@link BulkheadRejectedException} if the bulkhead limits are exceeeded\n\t */\n\tpublic async execute<T>(\n\t\tfn: (context: IDefaultPolicyContext) => PromiseLike<T> | T,\n\t\tsignal = neverAbortedSignal,\n\t): Promise<T> {\n\t\tif (signal.aborted) {\n\t\t\tthrow new TaskCancelledError();\n\t\t}\n\n\t\tif (this.active < this.capacity) {\n\t\t\tthis.active++;\n\t\t\ttry {\n\t\t\t\treturn await fn({ signal });\n\t\t\t} finally {\n\t\t\t\tthis.active--;\n\t\t\t\tthis.dequeue();\n\t\t\t}\n\t\t}\n\n\t\tif (this.queue.length >= this.queueCapacity) {\n\t\t\tthis.onRejectEmitter.emit();\n\t\t\tthrow new BulkheadRejectedError(this.capacity, this.queueCapacity);\n\t\t}\n\t\tconst { resolve, reject, promise } = defer<T>();\n\t\tthis.queue.push({ signal, fn, resolve, reject });\n\t\treturn promise;\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[81,103)",
			"modifiedRange": "[81,88)",
			"innerChanges": [
				{
					"originalRange": "[81,26 -> 81,26]",
					"modifiedRange": "[81,26 -> 81,27]"
				},
				{
					"originalRange": "[82,1 -> 82,1]",
					"modifiedRange": "[82,1 -> 85,1]"
				},
				{
					"originalRange": "[82,1 -> 82,2]",
					"modifiedRange": "[85,1 -> 85,1]"
				},
				{
					"originalRange": "[83,1 -> 83,2]",
					"modifiedRange": "[86,1 -> 86,1]"
				},
				{
					"originalRange": "[84,1 -> 84,2]",
					"modifiedRange": "[87,1 -> 87,1]"
				},
				{
					"originalRange": "[85,1 -> 103,1 EOL]",
					"modifiedRange": "[88,1 -> 88,1 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/sorted-offsets/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/sorted-offsets/legacy.expected.diff.json

```json
{
	"original": {
		"content": "import { neverAbortedSignal } from './common/abort';\nimport { defer } from './common/defer';\nimport { EventEmitter } from './common/Event';\nimport { ExecuteWrapper } from './common/Executor';\nimport { BulkheadRejectedError } from './errors/BulkheadRejectedError';\nimport { TaskCancelledError } from './errors/Errors';\nimport { IDefaultPolicyContext, IPolicy } from './Policy';\n\ninterface IQueueItem<T> {\n\tsignal: AbortSignal;\n\tfn(context: IDefaultPolicyContext): Promise<T> | T;\n\tresolve(value: T): void;\n\treject(error: Error): void;\n}\n\nexport class BulkheadPolicy implements IPolicy {\n\tpublic declare readonly _altReturn: never;\n\n\tprivate active = 0;\n\tprivate readonly queue: Array<IQueueItem<unknown>> = [];\n\tprivate readonly onRejectEmitter = new EventEmitter<void>();\n\tprivate readonly executor = new ExecuteWrapper();\n\n\t/**\n\t * @inheritdoc\n\t */\n\tpublic readonly onSuccess = this.executor.onSuccess;\n\n\t/**\n\t * @inheritdoc\n\t */\n\tpublic readonly onFailure = this.executor.onFailure;\n\n\t/**\n\t * Emitter that fires when an item is rejected from the bulkhead.\n\t */\n\tpublic readonly onReject = this.onRejectEmitter.addListener;\n\n\t/**\n\t * Returns the number of available execution slots at this point in time.\n\t */\n\tpublic get executionSlots() {\n\t\treturn this.capacity - this.active;\n\t}\n\n\t/**\n\t * Returns the number of queue slots at this point in time.\n\t */\n\tpublic get queueSlots() {\n\t\treturn this.queueCapacity - this.queue.length;\n\t}\n\n\t/**\n\t * Bulkhead limits concurrent requests made.\n\t */\n\tconstructor(private readonly capacity: number, private readonly queueCapacity: number) { }\n\n\t/**\n\t * Executes the given function.\n\t * @param fn Function to execute\n\t * @throws a {@link BulkheadRejectedException} if the bulkhead limits are exceeeded\n\t */\n\tpublic async execute<T>(\n\t\tfn: (context: IDefaultPolicyContext) => PromiseLike<T> | T,\n\t\tsignal = neverAbortedSignal,\n\t): Promise<T> {\n\t\tif (signal.aborted) {\n\t\t\tthrow new TaskCancelledError();\n\t\t}\n\n\t\tif (this.active < this.capacity) {\n\t\t\tthis.active++;\n\t\t\ttry {\n\t\t\t\treturn await fn({ signal });\n\t\t\t} finally {\n\t\t\t\tthis.active--;\n\t\t\t\tthis.dequeue();\n\t\t\t}\n\t\t}\n\n\t\tif (this.queue.length > this.queueCapacity) {\n\t\t\tconst { resolve, reject, promise } = defer<T>();\n\t\t\tthis.queue.push({ signal, fn, resolve, reject });\n\t\t\treturn promise;\n\t\t}\n\n\t\tthis.onRejectEmitter.emit();\n\t\tthrow new BulkheadRejectedError(this.capacity, this.queueCapacity);\n\t}\n\n\tprivate dequeue() {\n\t\tconst item = this.queue.shift();\n\t\tif (!item) {\n\t\t\treturn;\n\t\t}\n\n\t\tPromise.resolve()\n\t\t\t.then(() => this.execute(item.fn, item.signal))\n\t\t\t.then(item.resolve)\n\t\t\t.catch(item.reject);\n\t}\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { neverAbortedSignal } from './common/abort';\nimport { defer } from './common/defer';\nimport { EventEmitter } from './common/Event';\nimport { ExecuteWrapper } from './common/Executor';\nimport { BulkheadRejectedError } from './errors/BulkheadRejectedError';\nimport { TaskCancelledError } from './errors/Errors';\nimport { IDefaultPolicyContext, IPolicy } from './Policy';\n\ninterface IQueueItem<T> {\n\tsignal: AbortSignal;\n\tfn(context: IDefaultPolicyContext): Promise<T> | T;\n\tresolve(value: T): void;\n\treject(error: Error): void;\n}\n\nexport class BulkheadPolicy implements IPolicy {\n\tpublic declare readonly _altReturn: never;\n\n\tprivate active = 0;\n\tprivate readonly queue: Array<IQueueItem<unknown>> = [];\n\tprivate readonly onRejectEmitter = new EventEmitter<void>();\n\tprivate readonly executor = new ExecuteWrapper();\n\n\t/**\n\t * @inheritdoc\n\t */\n\tpublic readonly onSuccess = this.executor.onSuccess;\n\n\t/**\n\t * @inheritdoc\n\t */\n\tpublic readonly onFailure = this.executor.onFailure;\n\n\t/**\n\t * Emitter that fires when an item is rejected from the bulkhead.\n\t */\n\tpublic readonly onReject = this.onRejectEmitter.addListener;\n\n\t/**\n\t * Returns the number of available execution slots at this point in time.\n\t */\n\tpublic get executionSlots() {\n\t\treturn this.capacity - this.active;\n\t}\n\n\t/**\n\t * Returns the number of queue slots at this point in time.\n\t */\n\tpublic get queueSlots() {\n\t\treturn this.queueCapacity - this.queue.length;\n\t}\n\n\t/**\n\t * Bulkhead limits concurrent requests made.\n\t */\n\tconstructor(private readonly capacity: number, private readonly queueCapacity: number) { }\n\n\t/**\n\t * Executes the given function.\n\t * @param fn Function to execute\n\t * @throws a {@link BulkheadRejectedException} if the bulkhead limits are exceeeded\n\t */\n\tpublic async execute<T>(\n\t\tfn: (context: IDefaultPolicyContext) => PromiseLike<T> | T,\n\t\tsignal = neverAbortedSignal,\n\t): Promise<T> {\n\t\tif (signal.aborted) {\n\t\t\tthrow new TaskCancelledError();\n\t\t}\n\n\t\tif (this.active < this.capacity) {\n\t\t\tthis.active++;\n\t\t\ttry {\n\t\t\t\treturn await fn({ signal });\n\t\t\t} finally {\n\t\t\t\tthis.active--;\n\t\t\t\tthis.dequeue();\n\t\t\t}\n\t\t}\n\n\t\tif (this.queue.length >= this.queueCapacity) {\n\t\t\tthis.onRejectEmitter.emit();\n\t\t\tthrow new BulkheadRejectedError(this.capacity, this.queueCapacity);\n\t\t}\n\t\tconst { resolve, reject, promise } = defer<T>();\n\t\tthis.queue.push({ signal, fn, resolve, reject });\n\t\treturn promise;\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[81,103)",
			"modifiedRange": "[81,88)",
			"innerChanges": [
				{
					"originalRange": "[81,26 -> 81,26]",
					"modifiedRange": "[81,26 -> 81,27]"
				},
				{
					"originalRange": "[81,48 -> 86,1 EOL]",
					"modifiedRange": "[81,49 -> 81,49 EOL]"
				},
				{
					"originalRange": "[87,1 -> 87,1]",
					"modifiedRange": "[82,1 -> 82,2]"
				},
				{
					"originalRange": "[88,1 -> 88,1]",
					"modifiedRange": "[83,1 -> 83,2]"
				},
				{
					"originalRange": "[89,1 -> 89,1]",
					"modifiedRange": "[84,1 -> 84,2]"
				},
				{
					"originalRange": "[90,1 -> 92,1]",
					"modifiedRange": "[85,1 -> 85,1]"
				},
				{
					"originalRange": "[92,9 -> 97,4]",
					"modifiedRange": "[85,9 -> 85,29]"
				},
				{
					"originalRange": "[97,10 -> 97,20 EOL]",
					"modifiedRange": "[85,35 -> 85,51 EOL]"
				},
				{
					"originalRange": "[98,3 -> 98,16]",
					"modifiedRange": "[86,3 -> 86,3]"
				},
				{
					"originalRange": "[98,21 -> 98,43]",
					"modifiedRange": "[86,8 -> 86,21]"
				},
				{
					"originalRange": "[98,49 -> 99,15]",
					"modifiedRange": "[86,27 -> 86,33]"
				},
				{
					"originalRange": "[99,22 -> 100,16]",
					"modifiedRange": "[86,40 -> 86,42]"
				},
				{
					"originalRange": "[100,22 -> 100,22]",
					"modifiedRange": "[86,48 -> 86,50]"
				},
				{
					"originalRange": "[101,2 -> 102,2 EOL]",
					"modifiedRange": "[87,2 -> 87,18 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/subword/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/subword/1.tst

```text
import { EditorSimpleWorker } from 'vs/editor/common/services/editorSimpleWorker';
import { IEditorWorkerService, IUnicodeHighlightsResult } from 'vs/editor/common/services/editorWorker';
import { IModelService } from 'vs/editor/common/services/model';

let x: [IEditorWorkerService, EditorSimpleWorker, IModelService, IUnicodeHighlightsResult];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/subword/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/subword/2.tst

```text
import { EditorSimpleWorker } from 'vs/editor/common/services/editorSimpleWorker';
import { IDiffComputationResult, IEditorWorkerService, IUnicodeHighlightsResult } from 'vs/editor/common/services/editorWorker';
import { IModelService } from 'vs/editor/common/services/model';

let x: [IEditorWorkerService, EditorSimpleWorker, IModelService, IUnicodeHighlightsResult];
let y: IDiffComputationResult;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/subword/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/subword/advanced.expected.diff.json

```json
{
	"original": {
		"content": "import { EditorSimpleWorker } from 'vs/editor/common/services/editorSimpleWorker';\nimport { IEditorWorkerService, IUnicodeHighlightsResult } from 'vs/editor/common/services/editorWorker';\nimport { IModelService } from 'vs/editor/common/services/model';\n\nlet x: [IEditorWorkerService, EditorSimpleWorker, IModelService, IUnicodeHighlightsResult];",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { EditorSimpleWorker } from 'vs/editor/common/services/editorSimpleWorker';\nimport { IDiffComputationResult, IEditorWorkerService, IUnicodeHighlightsResult } from 'vs/editor/common/services/editorWorker';\nimport { IModelService } from 'vs/editor/common/services/model';\n\nlet x: [IEditorWorkerService, EditorSimpleWorker, IModelService, IUnicodeHighlightsResult];\nlet y: IDiffComputationResult;",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,3)",
			"modifiedRange": "[2,3)",
			"innerChanges": [
				{
					"originalRange": "[2,9 -> 2,9]",
					"modifiedRange": "[2,9 -> 2,33]"
				}
			]
		},
		{
			"originalRange": "[6,6)",
			"modifiedRange": "[6,7)",
			"innerChanges": [
				{
					"originalRange": "[5,92 -> 5,92 EOL]",
					"modifiedRange": "[5,92 -> 6,31 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/subword/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/subword/legacy.expected.diff.json

```json
{
	"original": {
		"content": "import { EditorSimpleWorker } from 'vs/editor/common/services/editorSimpleWorker';\nimport { IEditorWorkerService, IUnicodeHighlightsResult } from 'vs/editor/common/services/editorWorker';\nimport { IModelService } from 'vs/editor/common/services/model';\n\nlet x: [IEditorWorkerService, EditorSimpleWorker, IModelService, IUnicodeHighlightsResult];",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { EditorSimpleWorker } from 'vs/editor/common/services/editorSimpleWorker';\nimport { IDiffComputationResult, IEditorWorkerService, IUnicodeHighlightsResult } from 'vs/editor/common/services/editorWorker';\nimport { IModelService } from 'vs/editor/common/services/model';\n\nlet x: [IEditorWorkerService, EditorSimpleWorker, IModelService, IUnicodeHighlightsResult];\nlet y: IDiffComputationResult;",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,3)",
			"modifiedRange": "[2,3)",
			"innerChanges": [
				{
					"originalRange": "[2,11 -> 2,11]",
					"modifiedRange": "[2,11 -> 2,35]"
				}
			]
		},
		{
			"originalRange": "[6,6)",
			"modifiedRange": "[6,7)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/trivial/2.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/trivial/2.txt

```text
x
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/trivial/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/trivial/advanced.expected.diff.json

```json
{
	"original": {
		"content": "",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "x",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,2)",
			"innerChanges": [
				{
					"originalRange": "[1,1 -> 1,1 EOL]",
					"modifiedRange": "[1,1 -> 1,2 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/trivial/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/trivial/legacy.expected.diff.json

```json
{
	"original": {
		"content": "",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "x",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,2)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-advanced-bug/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-advanced-bug/1.tst

```text
function compileProgram(): ExitStatus {
    // First get any syntactic errors. 
    var diagnostics = program.getSyntacticDiagnostics();
    reportDiagnostics(diagnostics);

    // If we didn't have any syntactic errors, then also try getting the global and
    // semantic errors.
    if (diagnostics.length === 0)
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-advanced-bug/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-advanced-bug/2.tst

```text
function compileProgram(): ExitStatus {
    let diagnostics: Diagnostic[];
    
    // First get and report any syntactic errors.
    diagnostics = program.getSyntacticDiagnostics();

    // If we didn't have any syntactic errors, then also try getting the global and
    // semantic errors.
    if (diagnostics.length === 0) {
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-advanced-bug/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-advanced-bug/advanced.expected.diff.json

```json
{
	"original": {
		"content": "function compileProgram(): ExitStatus {\n    // First get any syntactic errors. \n    var diagnostics = program.getSyntacticDiagnostics();\n    reportDiagnostics(diagnostics);\n\n    // If we didn't have any syntactic errors, then also try getting the global and\n    // semantic errors.\n    if (diagnostics.length === 0) ",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "function compileProgram(): ExitStatus {\n    let diagnostics: Diagnostic[];\n    \n    // First get and report any syntactic errors.\n    diagnostics = program.getSyntacticDiagnostics();\n\n    // If we didn't have any syntactic errors, then also try getting the global and\n    // semantic errors.\n    if (diagnostics.length === 0) {",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,5)",
			"modifiedRange": "[2,6)",
			"innerChanges": [
				{
					"originalRange": "[2,1 -> 2,1]",
					"modifiedRange": "[2,1 -> 4,1]"
				},
				{
					"originalRange": "[2,17 -> 2,17]",
					"modifiedRange": "[4,17 -> 4,28]"
				},
				{
					"originalRange": "[2,39 -> 2,40 EOL]",
					"modifiedRange": "[4,50 -> 4,50 EOL]"
				},
				{
					"originalRange": "[3,5 -> 3,9]",
					"modifiedRange": "[5,5 -> 5,5]"
				},
				{
					"originalRange": "[4,1 -> 5,1 EOL]",
					"modifiedRange": "[6,1 -> 6,1 EOL]"
				}
			]
		},
		{
			"originalRange": "[8,9)",
			"modifiedRange": "[9,10)",
			"innerChanges": [
				{
					"originalRange": "[8,35 -> 8,35 EOL]",
					"modifiedRange": "[9,35 -> 9,36 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-advanced-bug/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-advanced-bug/legacy.expected.diff.json

```json
{
	"original": {
		"content": "function compileProgram(): ExitStatus {\n    // First get any syntactic errors. \n    var diagnostics = program.getSyntacticDiagnostics();\n    reportDiagnostics(diagnostics);\n\n    // If we didn't have any syntactic errors, then also try getting the global and\n    // semantic errors.\n    if (diagnostics.length === 0) ",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "function compileProgram(): ExitStatus {\n    let diagnostics: Diagnostic[];\n    \n    // First get and report any syntactic errors.\n    diagnostics = program.getSyntacticDiagnostics();\n\n    // If we didn't have any syntactic errors, then also try getting the global and\n    // semantic errors.\n    if (diagnostics.length === 0) {",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,5)",
			"modifiedRange": "[2,6)",
			"innerChanges": [
				{
					"originalRange": "[2,1 -> 2,1]",
					"modifiedRange": "[2,1 -> 4,1]"
				},
				{
					"originalRange": "[2,20 -> 2,20]",
					"modifiedRange": "[4,20 -> 4,31]"
				},
				{
					"originalRange": "[2,39 -> 2,40 EOL]",
					"modifiedRange": "[4,50 -> 4,50 EOL]"
				},
				{
					"originalRange": "[3,5 -> 3,9]",
					"modifiedRange": "[5,5 -> 5,5]"
				},
				{
					"originalRange": "[3,57 -> 4,36 EOL]",
					"modifiedRange": "[5,53 -> 5,53 EOL]"
				}
			]
		},
		{
			"originalRange": "[8,9)",
			"modifiedRange": "[9,10)",
			"innerChanges": [
				{
					"originalRange": "[8,35 -> 8,35 EOL]",
					"modifiedRange": "[9,35 -> 9,36 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-class/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-class/1.tst

```text

class Slice implements ISequence {
	private readonly elements: Int32Array;
	private readonly firstCharOnLineOffsets: Int32Array;

	constructor(public readonly lines: string[], public readonly lineRange: OffsetRange) {
		let chars = 0;
		this.firstCharOnLineOffsets = new Int32Array(lineRange.length);

		for (let i = lineRange.start; i < lineRange.endExclusive; i++) {
			const line = lines[i];
			chars += line.length;
			this.firstCharOnLineOffsets[i - lineRange.start] = chars + 1;
			chars++;
		}

		this.elements = new Int32Array(chars);
		let offset = 0;
		for (let i = lineRange.start; i < lineRange.endExclusive; i++) {
			const line = lines[i];

			for (let i = 0; i < line.length; i++) {
				this.elements[offset + i] = line.charCodeAt(i);
			}
			offset += line.length;
			if (i < lines.length - 1) {
				this.elements[offset] = '\n'.charCodeAt(0);
				offset += 1;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-class/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-class/2.tst

```text
class Slice implements ISequence {
	private readonly elements: number[] = [];
	private readonly firstCharOnLineOffsets: number[] = [];
	private readonly trimStartLength: number[] = [];

	constructor(public readonly lines: string[], public readonly lineRange: OffsetRange, public readonly considerWhitespaceChanges: boolean) {
		for (let i = lineRange.start; i < lineRange.endExclusive; i++) {
			const l = lines[i];
			const l1 = considerWhitespaceChanges ? l : l.trimStart();
			const line = considerWhitespaceChanges ? l1 : l1.trimEnd();
			this.trimStartLength.push(l.length - l1.length);

			for (let i = 0; i < line.length; i++) {
				this.elements.push(line.charCodeAt(i));
			}
			if (i < lines.length - 1) {
				this.elements.push('\n'.charCodeAt(0));
			}

			this.firstCharOnLineOffsets[i - lineRange.start] = this.elements.length;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-class/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-class/advanced.expected.diff.json

```json
{
	"original": {
		"content": "\nclass Slice implements ISequence {\n\tprivate readonly elements: Int32Array;\n\tprivate readonly firstCharOnLineOffsets: Int32Array;\n\n\tconstructor(public readonly lines: string[], public readonly lineRange: OffsetRange) {\n\t\tlet chars = 0;\n\t\tthis.firstCharOnLineOffsets = new Int32Array(lineRange.length);\n\n\t\tfor (let i = lineRange.start; i < lineRange.endExclusive; i++) {\n\t\t\tconst line = lines[i];\n\t\t\tchars += line.length;\n\t\t\tthis.firstCharOnLineOffsets[i - lineRange.start] = chars + 1;\n\t\t\tchars++;\n\t\t}\n\n\t\tthis.elements = new Int32Array(chars);\n\t\tlet offset = 0;\n\t\tfor (let i = lineRange.start; i < lineRange.endExclusive; i++) {\n\t\t\tconst line = lines[i];\n\n\t\t\tfor (let i = 0; i < line.length; i++) {\n\t\t\t\tthis.elements[offset + i] = line.charCodeAt(i);\n\t\t\t}\n\t\t\toffset += line.length;\n\t\t\tif (i < lines.length - 1) {\n\t\t\t\tthis.elements[offset] = '\\n'.charCodeAt(0);\n\t\t\t\toffset += 1;\n\t\t\t}\n\t\t}\n\t}\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "class Slice implements ISequence {\n\tprivate readonly elements: number[] = [];\n\tprivate readonly firstCharOnLineOffsets: number[] = [];\n\tprivate readonly trimStartLength: number[] = [];\n\n\tconstructor(public readonly lines: string[], public readonly lineRange: OffsetRange, public readonly considerWhitespaceChanges: boolean) {\n\t\tfor (let i = lineRange.start; i < lineRange.endExclusive; i++) {\n\t\t\tconst l = lines[i];\n\t\t\tconst l1 = considerWhitespaceChanges ? l : l.trimStart();\n\t\t\tconst line = considerWhitespaceChanges ? l1 : l1.trimEnd();\n\t\t\tthis.trimStartLength.push(l.length - l1.length);\n\n\t\t\tfor (let i = 0; i < line.length; i++) {\n\t\t\t\tthis.elements.push(line.charCodeAt(i));\n\t\t\t}\n\t\t\tif (i < lines.length - 1) {\n\t\t\t\tthis.elements.push('\\n'.charCodeAt(0));\n\t\t\t}\n\n\t\t\tthis.firstCharOnLineOffsets[i - lineRange.start] = this.elements.length;\n\t\t}\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,1)",
			"innerChanges": [
				{
					"originalRange": "[1,1 -> 2,1]",
					"modifiedRange": "[1,1 -> 1,1]"
				}
			]
		},
		{
			"originalRange": "[3,5)",
			"modifiedRange": "[2,5)",
			"innerChanges": [
				{
					"originalRange": "[3,29 -> 3,39]",
					"modifiedRange": "[2,29 -> 2,42]"
				},
				{
					"originalRange": "[4,43 -> 4,53]",
					"modifiedRange": "[3,43 -> 4,49]"
				}
			]
		},
		{
			"originalRange": "[6,10)",
			"modifiedRange": "[6,7)",
			"innerChanges": [
				{
					"originalRange": "[6,85 -> 9,1 EOL]",
					"modifiedRange": "[6,85 -> 6,140 EOL]"
				}
			]
		},
		{
			"originalRange": "[11,21)",
			"modifiedRange": "[8,12)",
			"innerChanges": [
				{
					"originalRange": "[11,10 -> 21,1 EOL]",
					"modifiedRange": "[8,10 -> 12,1 EOL]"
				}
			]
		},
		{
			"originalRange": "[23,24)",
			"modifiedRange": "[14,15)",
			"innerChanges": [
				{
					"originalRange": "[23,18 -> 23,33]",
					"modifiedRange": "[14,18 -> 14,24]"
				},
				{
					"originalRange": "[23,51 -> 23,51]",
					"modifiedRange": "[14,42 -> 14,43]"
				}
			]
		},
		{
			"originalRange": "[25,26)",
			"modifiedRange": "[16,16)",
			"innerChanges": [
				{
					"originalRange": "[25,1 -> 26,1]",
					"modifiedRange": "[16,1 -> 16,1]"
				}
			]
		},
		{
			"originalRange": "[27,29)",
			"modifiedRange": "[17,18)",
			"innerChanges": [
				{
					"originalRange": "[27,18 -> 27,29]",
					"modifiedRange": "[17,18 -> 17,24]"
				},
				{
					"originalRange": "[27,47 -> 28,16]",
					"modifiedRange": "[17,42 -> 17,43]"
				}
			]
		},
		{
			"originalRange": "[30,30)",
			"modifiedRange": "[19,21)",
			"innerChanges": [
				{
					"originalRange": "[30,1 -> 30,1]",
					"modifiedRange": "[19,1 -> 21,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-class/advanced.human.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-class/advanced.human.diff.json

```json
{
	"original": {
		"content": "\nclass Slice implements ISequence {\n\tprivate readonly elements: Int32Array;\n\tprivate readonly firstCharOnLineOffsets: Int32Array;\n\n\tconstructor(public readonly lines: string[], public readonly lineRange: OffsetRange) {\n\t\tlet chars = 0;\n\t\tthis.firstCharOnLineOffsets = new Int32Array(lineRange.length);\n\n\t\tfor (let i = lineRange.start; i < lineRange.endExclusive; i++) {\n\t\t\tconst line = lines[i];\n\t\t\tchars += line.length;\n\t\t\tthis.firstCharOnLineOffsets[i - lineRange.start] = chars + 1;\n\t\t\tchars++;\n\t\t}\n\n\t\tthis.elements = new Int32Array(chars);\n\t\tlet offset = 0;\n\t\tfor (let i = lineRange.start; i < lineRange.endExclusive; i++) {\n\t\t\tconst line = lines[i];\n\n\t\t\tfor (let i = 0; i < line.length; i++) {\n\t\t\t\tthis.elements[offset + i] = line.charCodeAt(i);\n\t\t\t}\n\t\t\toffset += line.length;\n\t\t\tif (i < lines.length - 1) {\n\t\t\t\tthis.elements[offset] = '\\n'.charCodeAt(0);\n\t\t\t\toffset += 1;\n\t\t\t}\n\t\t}\n\t}\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "class Slice implements ISequence {\n\tprivate readonly elements: number[] = [];\n\tprivate readonly firstCharOnLineOffsets: number[] = [];\n\tprivate readonly trimStartLength: number[] = [];\n\n\tconstructor(public readonly lines: string[], public readonly lineRange: OffsetRange, public readonly considerWhitespaceChanges: boolean) {\n\t\tfor (let i = lineRange.start; i < lineRange.endExclusive; i++) {\n\t\t\tconst l = lines[i];\n\t\t\tconst l1 = considerWhitespaceChanges ? l : l.trimStart();\n\t\t\tconst line = considerWhitespaceChanges ? l1 : l1.trimEnd();\n\t\t\tthis.trimStartLength.push(l.length - l1.length);\n\n\t\t\tfor (let i = 0; i < line.length; i++) {\n\t\t\t\tthis.elements.push(line.charCodeAt(i));\n\t\t\t}\n\t\t\tif (i < lines.length - 1) {\n\t\t\t\tthis.elements.push('\\n'.charCodeAt(0));\n\t\t\t}\n\n\t\t\tthis.firstCharOnLineOffsets[i - lineRange.start] = this.elements.length;\n\t\t}\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,1)",
			"innerChanges": null
		},
		{
			"originalRange": "[3,5)",
			"modifiedRange": "[2,5)",
			"innerChanges": [
				{
					"originalRange": "[3,29 -> 3,39]",
					"modifiedRange": "[2,29 -> 2,42]"
				},
				{
					"originalRange": "[4,43 -> 4,53]",
					"modifiedRange": "[3,43 -> 4,49]"
				}
			]
		},

		{
			"originalRange": "[6,7)",
			"modifiedRange": "[6,7)",
			"innerChanges": [
				{
					"originalRange": "[6,85 -> 6,85]",
					"modifiedRange": "[6,85 -> 6,137]"
				}
			]
		},
		{
			"originalRange": "[7,10)",
			"modifiedRange": "[7,7)",
			"innerChanges": null
		},
		{
			"originalRange": "[11,12)",
			"modifiedRange": "[8,9)",
			"innerChanges": [
				{
					"originalRange": "[11,11 -> 11,14]",
					"modifiedRange": "[8,11 -> 8,11]"
				}
			]
		},
		{
			"originalRange": "[12,21)",
			"modifiedRange": "[9,12)",
			"innerChanges": null
		},
		{
			"originalRange": "[23,24)",
			"modifiedRange": "[14,15)",
			"innerChanges": [
				{
					"originalRange": "[23,18 -> 23,33]",
					"modifiedRange": "[14,18 -> 14,24]"
				},
				{
					"originalRange": "[23,51 -> 23,51]",
					"modifiedRange": "[14,42 -> 14,43]"
				}
			]
		},
		{
			"originalRange": "[25,26)",
			"modifiedRange": "[16,16)",
			"innerChanges": null
		},
		{
			"originalRange": "[27,29)",
			"modifiedRange": "[17,18)",
			"innerChanges": [
				{
					"originalRange": "[27,18 -> 27,29]",
					"modifiedRange": "[17,18 -> 17,24]"
				},
				{
					"originalRange": "[27,47 -> 28,16]",
					"modifiedRange": "[17,42 -> 17,43]"
				}
			]
		},
		{
			"originalRange": "[30,30)",
			"modifiedRange": "[19,21)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-class/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-class/legacy.expected.diff.json

```json
{
	"original": {
		"content": "\nclass Slice implements ISequence {\n\tprivate readonly elements: Int32Array;\n\tprivate readonly firstCharOnLineOffsets: Int32Array;\n\n\tconstructor(public readonly lines: string[], public readonly lineRange: OffsetRange) {\n\t\tlet chars = 0;\n\t\tthis.firstCharOnLineOffsets = new Int32Array(lineRange.length);\n\n\t\tfor (let i = lineRange.start; i < lineRange.endExclusive; i++) {\n\t\t\tconst line = lines[i];\n\t\t\tchars += line.length;\n\t\t\tthis.firstCharOnLineOffsets[i - lineRange.start] = chars + 1;\n\t\t\tchars++;\n\t\t}\n\n\t\tthis.elements = new Int32Array(chars);\n\t\tlet offset = 0;\n\t\tfor (let i = lineRange.start; i < lineRange.endExclusive; i++) {\n\t\t\tconst line = lines[i];\n\n\t\t\tfor (let i = 0; i < line.length; i++) {\n\t\t\t\tthis.elements[offset + i] = line.charCodeAt(i);\n\t\t\t}\n\t\t\toffset += line.length;\n\t\t\tif (i < lines.length - 1) {\n\t\t\t\tthis.elements[offset] = '\\n'.charCodeAt(0);\n\t\t\t\toffset += 1;\n\t\t\t}\n\t\t}\n\t}\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "class Slice implements ISequence {\n\tprivate readonly elements: number[] = [];\n\tprivate readonly firstCharOnLineOffsets: number[] = [];\n\tprivate readonly trimStartLength: number[] = [];\n\n\tconstructor(public readonly lines: string[], public readonly lineRange: OffsetRange, public readonly considerWhitespaceChanges: boolean) {\n\t\tfor (let i = lineRange.start; i < lineRange.endExclusive; i++) {\n\t\t\tconst l = lines[i];\n\t\t\tconst l1 = considerWhitespaceChanges ? l : l.trimStart();\n\t\t\tconst line = considerWhitespaceChanges ? l1 : l1.trimEnd();\n\t\t\tthis.trimStartLength.push(l.length - l1.length);\n\n\t\t\tfor (let i = 0; i < line.length; i++) {\n\t\t\t\tthis.elements.push(line.charCodeAt(i));\n\t\t\t}\n\t\t\tif (i < lines.length - 1) {\n\t\t\t\tthis.elements.push('\\n'.charCodeAt(0));\n\t\t\t}\n\n\t\t\tthis.firstCharOnLineOffsets[i - lineRange.start] = this.elements.length;\n\t\t}\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,1)",
			"innerChanges": null
		},
		{
			"originalRange": "[3,5)",
			"modifiedRange": "[2,5)",
			"innerChanges": [
				{
					"originalRange": "[3,29 -> 3,39]",
					"modifiedRange": "[2,29 -> 2,42]"
				},
				{
					"originalRange": "[4,43 -> 4,53]",
					"modifiedRange": "[3,43 -> 4,49]"
				}
			]
		},
		{
			"originalRange": "[6,10)",
			"modifiedRange": "[6,7)",
			"innerChanges": [
				{
					"originalRange": "[6,85 -> 8,53]",
					"modifiedRange": "[6,85 -> 6,123]"
				},
				{
					"originalRange": "[8,57 -> 9,1 EOL]",
					"modifiedRange": "[6,127 -> 6,140 EOL]"
				}
			]
		},
		{
			"originalRange": "[11,21)",
			"modifiedRange": "[8,12)",
			"innerChanges": [
				{
					"originalRange": "[11,11 -> 11,14]",
					"modifiedRange": "[8,11 -> 8,11]"
				},
				{
					"originalRange": "[12,5 -> 13,14]",
					"modifiedRange": "[9,5 -> 9,33]"
				},
				{
					"originalRange": "[13,17 -> 13,64]",
					"modifiedRange": "[9,36 -> 9,60]"
				},
				{
					"originalRange": "[14,5 -> 17,39]",
					"modifiedRange": "[10,5 -> 10,61]"
				},
				{
					"originalRange": "[18,3 -> 19,27]",
					"modifiedRange": "[11,3 -> 11,14]"
				},
				{
					"originalRange": "[19,31 -> 20,25]",
					"modifiedRange": "[11,18 -> 11,51]"
				}
			]
		},
		{
			"originalRange": "[23,24)",
			"modifiedRange": "[14,15)",
			"innerChanges": [
				{
					"originalRange": "[23,18 -> 23,33]",
					"modifiedRange": "[14,18 -> 14,24]"
				},
				{
					"originalRange": "[23,51 -> 23,51]",
					"modifiedRange": "[14,42 -> 14,43]"
				}
			]
		},
		{
			"originalRange": "[25,26)",
			"modifiedRange": "[16,16)",
			"innerChanges": null
		},
		{
			"originalRange": "[27,29)",
			"modifiedRange": "[17,18)",
			"innerChanges": [
				{
					"originalRange": "[27,18 -> 27,29]",
					"modifiedRange": "[17,18 -> 17,24]"
				},
				{
					"originalRange": "[27,47 -> 28,16]",
					"modifiedRange": "[17,42 -> 17,43]"
				}
			]
		},
		{
			"originalRange": "[30,30)",
			"modifiedRange": "[19,21)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-comments/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-comments/1.tst

```text
interface Test {
    /**
     * Render +/- indicators for added/deleted changes.
     * Defaults to true.
     */
    renderIndicators?: boolean;
    /**
     * Original model should be editable?
     * Defaults to false.
     */
    originalEditable?: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-comments/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-comments/2.tst

```text
interface Test {
    /**
     * Render +/- indicators for added/deleted changes.
     * Defaults to true.
     */
    renderIndicators?: boolean;
    /**
     * Shows icons in the glyph margin to revert changes.
     * Default to true.
     */
    renderMarginRevertIcon?: boolean;
    /**
     * Original model should be editable?
     * Defaults to false.
     */
    originalEditable?: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-comments/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-comments/advanced.expected.diff.json

```json
{
	"original": {
		"content": "interface Test {\n    /**\n     * Render +/- indicators for added/deleted changes.\n     * Defaults to true.\n     */\n    renderIndicators?: boolean;\n    /**\n     * Original model should be editable?\n     * Defaults to false.\n     */\n    originalEditable?: boolean;\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "interface Test {\n    /**\n     * Render +/- indicators for added/deleted changes.\n     * Defaults to true.\n     */\n    renderIndicators?: boolean;\n    /**\n     * Shows icons in the glyph margin to revert changes.\n     * Default to true.\n     */\n    renderMarginRevertIcon?: boolean;\n    /**\n     * Original model should be editable?\n     * Defaults to false.\n     */\n    originalEditable?: boolean;\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[7,7)",
			"modifiedRange": "[7,12)",
			"innerChanges": [
				{
					"originalRange": "[7,1 -> 7,1]",
					"modifiedRange": "[7,1 -> 12,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-comments/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-comments/legacy.expected.diff.json

```json
{
	"original": {
		"content": "interface Test {\n    /**\n     * Render +/- indicators for added/deleted changes.\n     * Defaults to true.\n     */\n    renderIndicators?: boolean;\n    /**\n     * Original model should be editable?\n     * Defaults to false.\n     */\n    originalEditable?: boolean;\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "interface Test {\n    /**\n     * Render +/- indicators for added/deleted changes.\n     * Defaults to true.\n     */\n    renderIndicators?: boolean;\n    /**\n     * Shows icons in the glyph margin to revert changes.\n     * Default to true.\n     */\n    renderMarginRevertIcon?: boolean;\n    /**\n     * Original model should be editable?\n     * Defaults to false.\n     */\n    originalEditable?: boolean;\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[8,8)",
			"modifiedRange": "[8,13)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-confusing/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-confusing/1.tst

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from 'vs/base/common/uri';
import { IRange } from 'vs/editor/common/core/range';
import { IEditorWorkerService, IUnicodeHighlightsResult } from 'vs/editor/common/services/editorWorker';
import { TextEdit, IInplaceReplaceSupportResult } from 'vs/editor/common/languages';
import { IChange, IDiffComputationResult } from 'vs/editor/common/diff/diffComputer';

export class TestEditorWorkerService implements IEditorWorkerService {

	declare readonly _serviceBrand: undefined;

	canComputeUnicodeHighlights(uri: URI): boolean { return false; }
	async computedUnicodeHighlights(uri: URI): Promise<IUnicodeHighlightsResult> { return { ranges: [], hasMore: false, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 }; }
	async computeDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean, maxComputationTime: number): Promise<IDiffComputationResult | null> { return null; }
	canComputeDirtyDiff(original: URI, modified: URI): boolean { return false; }
	async computeDirtyDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): Promise<IChange[] | null> { return null; }
	async computeMoreMinimalEdits(resource: URI, edits: TextEdit[] | null | undefined): Promise<TextEdit[] | undefined> { return undefined; }
	canComputeWordRanges(resource: URI): boolean { return false; }
	async computeWordRanges(resource: URI, range: IRange): Promise<{ [word: string]: IRange[] } | null> { return null; }
	canNavigateValueSet(resource: URI): boolean { return false; }
	async navigateValueSet(resource: URI, range: IRange, up: boolean): Promise<IInplaceReplaceSupportResult | null> { return null; }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-confusing/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-confusing/2.tst

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from 'vs/base/common/uri';
import { IRange } from 'vs/editor/common/core/range';
import { IDiffComputationResult, IEditorWorkerService, IUnicodeHighlightsResult } from 'vs/editor/common/services/editorWorker';
import { TextEdit, IInplaceReplaceSupportResult } from 'vs/editor/common/languages';
import { IDocumentDiffProviderOptions } from 'vs/editor/common/diff/documentDiffProvider';
import { IChange } from 'vs/editor/common/diff/smartLinesDiffComputer';

export class TestEditorWorkerService implements IEditorWorkerService {

	declare readonly _serviceBrand: undefined;

	canComputeUnicodeHighlights(uri: URI): boolean { return false; }
	async computedUnicodeHighlights(uri: URI): Promise<IUnicodeHighlightsResult> { return { ranges: [], hasMore: false, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 }; }
	async computeDiff(original: URI, modified: URI, options: IDocumentDiffProviderOptions): Promise<IDiffComputationResult | null> { return null; }
	canComputeDirtyDiff(original: URI, modified: URI): boolean { return false; }
	async computeDirtyDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): Promise<IChange[] | null> { return null; }
	async computeMoreMinimalEdits(resource: URI, edits: TextEdit[] | null | undefined): Promise<TextEdit[] | undefined> { return undefined; }
	canComputeWordRanges(resource: URI): boolean { return false; }
	async computeWordRanges(resource: URI, range: IRange): Promise<{ [word: string]: IRange[] } | null> { return null; }
	canNavigateValueSet(resource: URI): boolean { return false; }
	async navigateValueSet(resource: URI, range: IRange, up: boolean): Promise<IInplaceReplaceSupportResult | null> { return null; }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-confusing/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-confusing/advanced.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { URI } from 'vs/base/common/uri';\nimport { IRange } from 'vs/editor/common/core/range';\nimport { IEditorWorkerService, IUnicodeHighlightsResult } from 'vs/editor/common/services/editorWorker';\nimport { TextEdit, IInplaceReplaceSupportResult } from 'vs/editor/common/languages';\nimport { IChange, IDiffComputationResult } from 'vs/editor/common/diff/diffComputer';\n\nexport class TestEditorWorkerService implements IEditorWorkerService {\n\n\tdeclare readonly _serviceBrand: undefined;\n\n\tcanComputeUnicodeHighlights(uri: URI): boolean { return false; }\n\tasync computedUnicodeHighlights(uri: URI): Promise<IUnicodeHighlightsResult> { return { ranges: [], hasMore: false, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 }; }\n\tasync computeDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean, maxComputationTime: number): Promise<IDiffComputationResult | null> { return null; }\n\tcanComputeDirtyDiff(original: URI, modified: URI): boolean { return false; }\n\tasync computeDirtyDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): Promise<IChange[] | null> { return null; }\n\tasync computeMoreMinimalEdits(resource: URI, edits: TextEdit[] | null | undefined): Promise<TextEdit[] | undefined> { return undefined; }\n\tcanComputeWordRanges(resource: URI): boolean { return false; }\n\tasync computeWordRanges(resource: URI, range: IRange): Promise<{ [word: string]: IRange[] } | null> { return null; }\n\tcanNavigateValueSet(resource: URI): boolean { return false; }\n\tasync navigateValueSet(resource: URI, range: IRange, up: boolean): Promise<IInplaceReplaceSupportResult | null> { return null; }\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { URI } from 'vs/base/common/uri';\nimport { IRange } from 'vs/editor/common/core/range';\nimport { IDiffComputationResult, IEditorWorkerService, IUnicodeHighlightsResult } from 'vs/editor/common/services/editorWorker';\nimport { TextEdit, IInplaceReplaceSupportResult } from 'vs/editor/common/languages';\nimport { IDocumentDiffProviderOptions } from 'vs/editor/common/diff/documentDiffProvider';\nimport { IChange } from 'vs/editor/common/diff/smartLinesDiffComputer';\n\nexport class TestEditorWorkerService implements IEditorWorkerService {\n\n\tdeclare readonly _serviceBrand: undefined;\n\n\tcanComputeUnicodeHighlights(uri: URI): boolean { return false; }\n\tasync computedUnicodeHighlights(uri: URI): Promise<IUnicodeHighlightsResult> { return { ranges: [], hasMore: false, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 }; }\n\tasync computeDiff(original: URI, modified: URI, options: IDocumentDiffProviderOptions): Promise<IDiffComputationResult | null> { return null; }\n\tcanComputeDirtyDiff(original: URI, modified: URI): boolean { return false; }\n\tasync computeDirtyDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): Promise<IChange[] | null> { return null; }\n\tasync computeMoreMinimalEdits(resource: URI, edits: TextEdit[] | null | undefined): Promise<TextEdit[] | undefined> { return undefined; }\n\tcanComputeWordRanges(resource: URI): boolean { return false; }\n\tasync computeWordRanges(resource: URI, range: IRange): Promise<{ [word: string]: IRange[] } | null> { return null; }\n\tcanNavigateValueSet(resource: URI): boolean { return false; }\n\tasync navigateValueSet(resource: URI, range: IRange, up: boolean): Promise<IInplaceReplaceSupportResult | null> { return null; }\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[8,9)",
			"modifiedRange": "[8,9)",
			"innerChanges": [
				{
					"originalRange": "[8,9 -> 8,9]",
					"modifiedRange": "[8,9 -> 8,33]"
				}
			]
		},
		{
			"originalRange": "[10,11)",
			"modifiedRange": "[10,12)",
			"innerChanges": [
				{
					"originalRange": "[10,1 -> 10,1]",
					"modifiedRange": "[10,1 -> 11,1]"
				},
				{
					"originalRange": "[10,17 -> 10,41]",
					"modifiedRange": "[11,17 -> 11,17]"
				},
				{
					"originalRange": "[10,72 -> 10,84]",
					"modifiedRange": "[11,48 -> 11,70]"
				}
			]
		},
		{
			"originalRange": "[18,19)",
			"modifiedRange": "[19,20)",
			"innerChanges": [
				{
					"originalRange": "[18,50 -> 18,107]",
					"modifiedRange": "[19,50 -> 19,87]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-confusing/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-confusing/legacy.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { URI } from 'vs/base/common/uri';\nimport { IRange } from 'vs/editor/common/core/range';\nimport { IEditorWorkerService, IUnicodeHighlightsResult } from 'vs/editor/common/services/editorWorker';\nimport { TextEdit, IInplaceReplaceSupportResult } from 'vs/editor/common/languages';\nimport { IChange, IDiffComputationResult } from 'vs/editor/common/diff/diffComputer';\n\nexport class TestEditorWorkerService implements IEditorWorkerService {\n\n\tdeclare readonly _serviceBrand: undefined;\n\n\tcanComputeUnicodeHighlights(uri: URI): boolean { return false; }\n\tasync computedUnicodeHighlights(uri: URI): Promise<IUnicodeHighlightsResult> { return { ranges: [], hasMore: false, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 }; }\n\tasync computeDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean, maxComputationTime: number): Promise<IDiffComputationResult | null> { return null; }\n\tcanComputeDirtyDiff(original: URI, modified: URI): boolean { return false; }\n\tasync computeDirtyDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): Promise<IChange[] | null> { return null; }\n\tasync computeMoreMinimalEdits(resource: URI, edits: TextEdit[] | null | undefined): Promise<TextEdit[] | undefined> { return undefined; }\n\tcanComputeWordRanges(resource: URI): boolean { return false; }\n\tasync computeWordRanges(resource: URI, range: IRange): Promise<{ [word: string]: IRange[] } | null> { return null; }\n\tcanNavigateValueSet(resource: URI): boolean { return false; }\n\tasync navigateValueSet(resource: URI, range: IRange, up: boolean): Promise<IInplaceReplaceSupportResult | null> { return null; }\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { URI } from 'vs/base/common/uri';\nimport { IRange } from 'vs/editor/common/core/range';\nimport { IDiffComputationResult, IEditorWorkerService, IUnicodeHighlightsResult } from 'vs/editor/common/services/editorWorker';\nimport { TextEdit, IInplaceReplaceSupportResult } from 'vs/editor/common/languages';\nimport { IDocumentDiffProviderOptions } from 'vs/editor/common/diff/documentDiffProvider';\nimport { IChange } from 'vs/editor/common/diff/smartLinesDiffComputer';\n\nexport class TestEditorWorkerService implements IEditorWorkerService {\n\n\tdeclare readonly _serviceBrand: undefined;\n\n\tcanComputeUnicodeHighlights(uri: URI): boolean { return false; }\n\tasync computedUnicodeHighlights(uri: URI): Promise<IUnicodeHighlightsResult> { return { ranges: [], hasMore: false, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 }; }\n\tasync computeDiff(original: URI, modified: URI, options: IDocumentDiffProviderOptions): Promise<IDiffComputationResult | null> { return null; }\n\tcanComputeDirtyDiff(original: URI, modified: URI): boolean { return false; }\n\tasync computeDirtyDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): Promise<IChange[] | null> { return null; }\n\tasync computeMoreMinimalEdits(resource: URI, edits: TextEdit[] | null | undefined): Promise<TextEdit[] | undefined> { return undefined; }\n\tcanComputeWordRanges(resource: URI): boolean { return false; }\n\tasync computeWordRanges(resource: URI, range: IRange): Promise<{ [word: string]: IRange[] } | null> { return null; }\n\tcanNavigateValueSet(resource: URI): boolean { return false; }\n\tasync navigateValueSet(resource: URI, range: IRange, up: boolean): Promise<IInplaceReplaceSupportResult | null> { return null; }\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[8,9)",
			"modifiedRange": "[8,9)",
			"innerChanges": [
				{
					"originalRange": "[8,11 -> 8,11]",
					"modifiedRange": "[8,11 -> 8,35]"
				}
			]
		},
		{
			"originalRange": "[10,11)",
			"modifiedRange": "[10,12)",
			"innerChanges": [
				{
					"originalRange": "[10,11 -> 10,20]",
					"modifiedRange": "[10,11 -> 10,77]"
				},
				{
					"originalRange": "[10,24 -> 10,41]",
					"modifiedRange": "[10,81 -> 11,17]"
				},
				{
					"originalRange": "[10,72 -> 10,73]",
					"modifiedRange": "[11,48 -> 11,59]"
				}
			]
		},
		{
			"originalRange": "[18,19)",
			"modifiedRange": "[19,20)",
			"innerChanges": [
				{
					"originalRange": "[18,50 -> 18,91]",
					"modifiedRange": "[19,50 -> 19,82]"
				},
				{
					"originalRange": "[18,95 -> 18,107]",
					"modifiedRange": "[19,86 -> 19,87]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-confusing-2/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-confusing-2/1.tst

```text
class Test {
    // ---- BEGIN diff --------------------------------------------------------------------------

	public async computeDiff(originalUrl: string, modifiedUrl: string, ignoreTrimWhitespace: boolean, maxComputationTime: number): Promise<IDiffComputationResult | null> {
		const original = this._getModel(originalUrl);
		const modified = this._getModel(modifiedUrl);
		if (!original || !modified) {
			return null;
		}

		return EditorSimpleWorker.computeDiff(original, modified, ignoreTrimWhitespace, maxComputationTime);
	}

	public static computeDiff(originalTextModel: ICommonModel | ITextModel, modifiedTextModel: ICommonModel | ITextModel, ignoreTrimWhitespace: boolean, maxComputationTime: number): IDiffComputationResult | null {
		const originalLines = originalTextModel.getLinesContent();
		const modifiedLines = modifiedTextModel.getLinesContent();
		const diffComputer = new DiffComputer(originalLines, modifiedLines, {
			shouldComputeCharChanges: true,
			shouldPostProcessCharChanges: true,
			shouldIgnoreTrimWhitespace: ignoreTrimWhitespace,
			shouldMakePrettyDiff: true,
			maxComputationTime: maxComputationTime
		});

		const diffResult = diffComputer.computeDiff();
		const identical = (diffResult.changes.length > 0 ? false : this._modelsAreIdentical(originalTextModel, modifiedTextModel));
		return {
			quitEarly: diffResult.quitEarly,
			identical: identical,
			changes: diffResult.changes
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-confusing-2/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-confusing-2/2.tst

```text
class Test {
	// ---- BEGIN diff --------------------------------------------------------------------------

	public async computeDiff(originalUrl: string, modifiedUrl: string, options: ILinesDiffComputerOptions): Promise<IDiffComputationResult | null> {
		const original = this._getModel(originalUrl);
		const modified = this._getModel(modifiedUrl);
		if (!original || !modified) {
			return null;
		}

		return EditorSimpleWorker.computeDiff(original, modified, options);
	}

	public static computeDiff(originalTextModel: ICommonModel | ITextModel, modifiedTextModel: ICommonModel | ITextModel, options: ILinesDiffComputerOptions): IDiffComputationResult {

		const diffAlgorithm: ILinesDiffComputer = options.diffAlgorithm === 'experimental' ? linesDiffComputers.experimental : linesDiffComputers.smart;

		const originalLines = originalTextModel.getLinesContent();
		const modifiedLines = modifiedTextModel.getLinesContent();

		const result = diffAlgorithm.computeDiff(originalLines, modifiedLines, options);

		const identical = (result.changes.length > 0 ? false : this._modelsAreIdentical(originalTextModel, modifiedTextModel));

		return {
			identical,
			quitEarly: result.quitEarly,
			changes: result.changes.map(m => ([m.originalRange.startLineNumber, m.originalRange.endLineNumberExclusive, m.modifiedRange.startLineNumber, m.modifiedRange.endLineNumberExclusive, m.innerChanges?.map(m => [
				m.originalRange.startLineNumber,
				m.originalRange.startColumn,
				m.originalRange.endLineNumber,
				m.originalRange.endColumn,
				m.modifiedRange.startLineNumber,
				m.modifiedRange.startColumn,
				m.modifiedRange.endLineNumber,
				m.modifiedRange.endColumn,
			])]))
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-confusing-2/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-confusing-2/advanced.expected.diff.json

```json
{
	"original": {
		"content": "class Test {\n    // ---- BEGIN diff --------------------------------------------------------------------------\n\n\tpublic async computeDiff(originalUrl: string, modifiedUrl: string, ignoreTrimWhitespace: boolean, maxComputationTime: number): Promise<IDiffComputationResult | null> {\n\t\tconst original = this._getModel(originalUrl);\n\t\tconst modified = this._getModel(modifiedUrl);\n\t\tif (!original || !modified) {\n\t\t\treturn null;\n\t\t}\n\n\t\treturn EditorSimpleWorker.computeDiff(original, modified, ignoreTrimWhitespace, maxComputationTime);\n\t}\n\n\tpublic static computeDiff(originalTextModel: ICommonModel | ITextModel, modifiedTextModel: ICommonModel | ITextModel, ignoreTrimWhitespace: boolean, maxComputationTime: number): IDiffComputationResult | null {\n\t\tconst originalLines = originalTextModel.getLinesContent();\n\t\tconst modifiedLines = modifiedTextModel.getLinesContent();\n\t\tconst diffComputer = new DiffComputer(originalLines, modifiedLines, {\n\t\t\tshouldComputeCharChanges: true,\n\t\t\tshouldPostProcessCharChanges: true,\n\t\t\tshouldIgnoreTrimWhitespace: ignoreTrimWhitespace,\n\t\t\tshouldMakePrettyDiff: true,\n\t\t\tmaxComputationTime: maxComputationTime\n\t\t});\n\n\t\tconst diffResult = diffComputer.computeDiff();\n\t\tconst identical = (diffResult.changes.length > 0 ? false : this._modelsAreIdentical(originalTextModel, modifiedTextModel));\n\t\treturn {\n\t\t\tquitEarly: diffResult.quitEarly,\n\t\t\tidentical: identical,\n\t\t\tchanges: diffResult.changes\n\t\t};\n\t}\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "class Test {\n\t// ---- BEGIN diff --------------------------------------------------------------------------\n\n\tpublic async computeDiff(originalUrl: string, modifiedUrl: string, options: ILinesDiffComputerOptions): Promise<IDiffComputationResult | null> {\n\t\tconst original = this._getModel(originalUrl);\n\t\tconst modified = this._getModel(modifiedUrl);\n\t\tif (!original || !modified) {\n\t\t\treturn null;\n\t\t}\n\n\t\treturn EditorSimpleWorker.computeDiff(original, modified, options);\n\t}\n\n\tpublic static computeDiff(originalTextModel: ICommonModel | ITextModel, modifiedTextModel: ICommonModel | ITextModel, options: ILinesDiffComputerOptions): IDiffComputationResult {\n\n\t\tconst diffAlgorithm: ILinesDiffComputer = options.diffAlgorithm === 'experimental' ? linesDiffComputers.experimental : linesDiffComputers.smart;\n\n\t\tconst originalLines = originalTextModel.getLinesContent();\n\t\tconst modifiedLines = modifiedTextModel.getLinesContent();\n\n\t\tconst result = diffAlgorithm.computeDiff(originalLines, modifiedLines, options);\n\n\t\tconst identical = (result.changes.length > 0 ? false : this._modelsAreIdentical(originalTextModel, modifiedTextModel));\n\n\t\treturn {\n\t\t\tidentical,\n\t\t\tquitEarly: result.quitEarly,\n\t\t\tchanges: result.changes.map(m => ([m.originalRange.startLineNumber, m.originalRange.endLineNumberExclusive, m.modifiedRange.startLineNumber, m.modifiedRange.endLineNumberExclusive, m.innerChanges?.map(m => [\n\t\t\t\tm.originalRange.startLineNumber,\n\t\t\t\tm.originalRange.startColumn,\n\t\t\t\tm.originalRange.endLineNumber,\n\t\t\t\tm.originalRange.endColumn,\n\t\t\t\tm.modifiedRange.startLineNumber,\n\t\t\t\tm.modifiedRange.startColumn,\n\t\t\t\tm.modifiedRange.endLineNumber,\n\t\t\t\tm.modifiedRange.endColumn,\n\t\t\t])]))\n\t\t};\n\t}\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,3)",
			"modifiedRange": "[2,3)",
			"innerChanges": [
				{
					"originalRange": "[2,1 -> 2,5]",
					"modifiedRange": "[2,1 -> 2,2]"
				}
			]
		},
		{
			"originalRange": "[4,5)",
			"modifiedRange": "[4,5)",
			"innerChanges": [
				{
					"originalRange": "[4,69 -> 4,126]",
					"modifiedRange": "[4,69 -> 4,103]"
				}
			]
		},
		{
			"originalRange": "[11,12)",
			"modifiedRange": "[11,12)",
			"innerChanges": [
				{
					"originalRange": "[11,61 -> 11,101]",
					"modifiedRange": "[11,61 -> 11,68]"
				}
			]
		},
		{
			"originalRange": "[14,15)",
			"modifiedRange": "[14,18)",
			"innerChanges": [
				{
					"originalRange": "[14,120 -> 15,1]",
					"modifiedRange": "[14,120 -> 18,1]"
				}
			]
		},
		{
			"originalRange": "[17,24)",
			"modifiedRange": "[20,22)",
			"innerChanges": [
				{
					"originalRange": "[17,1 -> 17,1]",
					"modifiedRange": "[20,1 -> 21,1]"
				},
				{
					"originalRange": "[17,9 -> 17,21]",
					"modifiedRange": "[21,9 -> 21,15]"
				},
				{
					"originalRange": "[17,24 -> 17,40]",
					"modifiedRange": "[21,18 -> 21,43]"
				},
				{
					"originalRange": "[17,71 -> 24,1 EOL]",
					"modifiedRange": "[21,74 -> 22,1 EOL]"
				}
			]
		},
		{
			"originalRange": "[25,27)",
			"modifiedRange": "[23,25)",
			"innerChanges": [
				{
					"originalRange": "[25,9 -> 26,18]",
					"modifiedRange": "[23,9 -> 23,18]"
				},
				{
					"originalRange": "[26,22 -> 26,32]",
					"modifiedRange": "[23,22 -> 23,28]"
				},
				{
					"originalRange": "[27,1 -> 27,1]",
					"modifiedRange": "[24,1 -> 25,1]"
				}
			]
		},
		{
			"originalRange": "[28,31)",
			"modifiedRange": "[26,38)",
			"innerChanges": [
				{
					"originalRange": "[28,1 -> 31,1]",
					"modifiedRange": "[26,1 -> 38,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-confusing-2/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-confusing-2/legacy.expected.diff.json

```json
{
	"original": {
		"content": "class Test {\n    // ---- BEGIN diff --------------------------------------------------------------------------\n\n\tpublic async computeDiff(originalUrl: string, modifiedUrl: string, ignoreTrimWhitespace: boolean, maxComputationTime: number): Promise<IDiffComputationResult | null> {\n\t\tconst original = this._getModel(originalUrl);\n\t\tconst modified = this._getModel(modifiedUrl);\n\t\tif (!original || !modified) {\n\t\t\treturn null;\n\t\t}\n\n\t\treturn EditorSimpleWorker.computeDiff(original, modified, ignoreTrimWhitespace, maxComputationTime);\n\t}\n\n\tpublic static computeDiff(originalTextModel: ICommonModel | ITextModel, modifiedTextModel: ICommonModel | ITextModel, ignoreTrimWhitespace: boolean, maxComputationTime: number): IDiffComputationResult | null {\n\t\tconst originalLines = originalTextModel.getLinesContent();\n\t\tconst modifiedLines = modifiedTextModel.getLinesContent();\n\t\tconst diffComputer = new DiffComputer(originalLines, modifiedLines, {\n\t\t\tshouldComputeCharChanges: true,\n\t\t\tshouldPostProcessCharChanges: true,\n\t\t\tshouldIgnoreTrimWhitespace: ignoreTrimWhitespace,\n\t\t\tshouldMakePrettyDiff: true,\n\t\t\tmaxComputationTime: maxComputationTime\n\t\t});\n\n\t\tconst diffResult = diffComputer.computeDiff();\n\t\tconst identical = (diffResult.changes.length > 0 ? false : this._modelsAreIdentical(originalTextModel, modifiedTextModel));\n\t\treturn {\n\t\t\tquitEarly: diffResult.quitEarly,\n\t\t\tidentical: identical,\n\t\t\tchanges: diffResult.changes\n\t\t};\n\t}\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "class Test {\n\t// ---- BEGIN diff --------------------------------------------------------------------------\n\n\tpublic async computeDiff(originalUrl: string, modifiedUrl: string, options: ILinesDiffComputerOptions): Promise<IDiffComputationResult | null> {\n\t\tconst original = this._getModel(originalUrl);\n\t\tconst modified = this._getModel(modifiedUrl);\n\t\tif (!original || !modified) {\n\t\t\treturn null;\n\t\t}\n\n\t\treturn EditorSimpleWorker.computeDiff(original, modified, options);\n\t}\n\n\tpublic static computeDiff(originalTextModel: ICommonModel | ITextModel, modifiedTextModel: ICommonModel | ITextModel, options: ILinesDiffComputerOptions): IDiffComputationResult {\n\n\t\tconst diffAlgorithm: ILinesDiffComputer = options.diffAlgorithm === 'experimental' ? linesDiffComputers.experimental : linesDiffComputers.smart;\n\n\t\tconst originalLines = originalTextModel.getLinesContent();\n\t\tconst modifiedLines = modifiedTextModel.getLinesContent();\n\n\t\tconst result = diffAlgorithm.computeDiff(originalLines, modifiedLines, options);\n\n\t\tconst identical = (result.changes.length > 0 ? false : this._modelsAreIdentical(originalTextModel, modifiedTextModel));\n\n\t\treturn {\n\t\t\tidentical,\n\t\t\tquitEarly: result.quitEarly,\n\t\t\tchanges: result.changes.map(m => ([m.originalRange.startLineNumber, m.originalRange.endLineNumberExclusive, m.modifiedRange.startLineNumber, m.modifiedRange.endLineNumberExclusive, m.innerChanges?.map(m => [\n\t\t\t\tm.originalRange.startLineNumber,\n\t\t\t\tm.originalRange.startColumn,\n\t\t\t\tm.originalRange.endLineNumber,\n\t\t\t\tm.originalRange.endColumn,\n\t\t\t\tm.modifiedRange.startLineNumber,\n\t\t\t\tm.modifiedRange.startColumn,\n\t\t\t\tm.modifiedRange.endLineNumber,\n\t\t\t\tm.modifiedRange.endColumn,\n\t\t\t])]))\n\t\t};\n\t}\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,3)",
			"modifiedRange": "[2,3)",
			"innerChanges": [
				{
					"originalRange": "[2,1 -> 2,5]",
					"modifiedRange": "[2,1 -> 2,2]"
				}
			]
		},
		{
			"originalRange": "[4,5)",
			"modifiedRange": "[4,5)",
			"innerChanges": [
				{
					"originalRange": "[4,69 -> 4,103]",
					"modifiedRange": "[4,69 -> 4,88]"
				},
				{
					"originalRange": "[4,109 -> 4,110]",
					"modifiedRange": "[4,94 -> 4,98]"
				},
				{
					"originalRange": "[4,114 -> 4,126]",
					"modifiedRange": "[4,102 -> 4,103]"
				}
			]
		},
		{
			"originalRange": "[11,12)",
			"modifiedRange": "[11,12)",
			"innerChanges": [
				{
					"originalRange": "[11,61 -> 11,93]",
					"modifiedRange": "[11,61 -> 11,63]"
				},
				{
					"originalRange": "[11,97 -> 11,101]",
					"modifiedRange": "[11,67 -> 11,68]"
				}
			]
		},
		{
			"originalRange": "[14,15)",
			"modifiedRange": "[14,18)",
			"innerChanges": [
				{
					"originalRange": "[14,120 -> 14,154]",
					"modifiedRange": "[14,120 -> 14,162]"
				},
				{
					"originalRange": "[14,165 -> 14,178]",
					"modifiedRange": "[14,173 -> 16,22]"
				},
				{
					"originalRange": "[14,181 -> 14,181]",
					"modifiedRange": "[16,25 -> 16,30]"
				},
				{
					"originalRange": "[14,191 -> 14,192]",
					"modifiedRange": "[16,40 -> 16,47]"
				},
				{
					"originalRange": "[14,196 -> 14,211 EOL]",
					"modifiedRange": "[16,51 -> 17,1 EOL]"
				}
			]
		},
		{
			"originalRange": "[17,24)",
			"modifiedRange": "[20,24)",
			"innerChanges": [
				{
					"originalRange": "[17,1 -> 17,1]",
					"modifiedRange": "[20,1 -> 21,1]"
				},
				{
					"originalRange": "[17,9 -> 17,21]",
					"modifiedRange": "[21,9 -> 21,15]"
				},
				{
					"originalRange": "[17,24 -> 17,29]",
					"modifiedRange": "[21,18 -> 21,19]"
				},
				{
					"originalRange": "[17,32 -> 17,33]",
					"modifiedRange": "[21,22 -> 21,33]"
				},
				{
					"originalRange": "[17,39 -> 17,40]",
					"modifiedRange": "[21,39 -> 21,43]"
				},
				{
					"originalRange": "[17,71 -> 17,72 EOL]",
					"modifiedRange": "[21,74 -> 22,1 EOL]"
				},
				{
					"originalRange": "[18,3 -> 19,26]",
					"modifiedRange": "[23,3 -> 23,30]"
				},
				{
					"originalRange": "[19,32 -> 19,32]",
					"modifiedRange": "[23,36 -> 23,56]"
				},
				{
					"originalRange": "[19,35 -> 23,4]",
					"modifiedRange": "[23,59 -> 23,120]"
				}
			]
		},
		{
			"originalRange": "[25,27)",
			"modifiedRange": "[25,25)",
			"innerChanges": null
		},
		{
			"originalRange": "[28,31)",
			"modifiedRange": "[26,38)",
			"innerChanges": [
				{
					"originalRange": "[28,1 -> 28,1]",
					"modifiedRange": "[26,1 -> 27,1]"
				},
				{
					"originalRange": "[28,15 -> 28,20]",
					"modifiedRange": "[27,15 -> 27,16]"
				},
				{
					"originalRange": "[29,4 -> 29,24]",
					"modifiedRange": "[28,4 -> 32,30]"
				},
				{
					"originalRange": "[30,4 -> 30,6]",
					"modifiedRange": "[33,4 -> 33,16]"
				},
				{
					"originalRange": "[30,10 -> 30,13]",
					"modifiedRange": "[33,20 -> 34,9]"
				},
				{
					"originalRange": "[30,16 -> 30,26]",
					"modifiedRange": "[34,12 -> 36,16]"
				},
				{
					"originalRange": "[30,30 -> 30,31 EOL]",
					"modifiedRange": "[36,20 -> 37,9 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-diff-word-split/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-diff-word-split/1.tst

```text
import { findLast } from 'vs/base/common/arrays';
import { Disposable } from 'vs/base/common/lifecycle';
import { ITransaction, observableValue, transaction } from 'vs/base/common/observable';
import { Range } from 'vs/editor/common/core/range';
import { ScrollType } from 'vs/editor/common/editorCommon';
import { IFooBar, IFoo } from 'foo';

console.log(observableValue);

console.log(observableValue);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-diff-word-split/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-diff-word-split/2.tst

```text
import { findLast } from 'vs/base/common/arrays';
import { Disposable } from 'vs/base/common/lifecycle';
import { ITransaction, observableFromEvent, observableValue, transaction } from 'vs/base/common/observable';
import { Range } from 'vs/editor/common/core/range';
import { ScrollType } from 'vs/editor/common/editorCommon';
import { IFooBar, IBar, IFoo } from 'foo';

console.log(observableFromEvent, observableValue);

console.log(observableValue, observableFromEvent);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-diff-word-split/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-diff-word-split/advanced.expected.diff.json

```json
{
	"original": {
		"content": "import { findLast } from 'vs/base/common/arrays';\nimport { Disposable } from 'vs/base/common/lifecycle';\nimport { ITransaction, observableValue, transaction } from 'vs/base/common/observable';\nimport { Range } from 'vs/editor/common/core/range';\nimport { ScrollType } from 'vs/editor/common/editorCommon';\nimport { IFooBar, IFoo } from 'foo';\n\nconsole.log(observableValue);\n\nconsole.log(observableValue);\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { findLast } from 'vs/base/common/arrays';\nimport { Disposable } from 'vs/base/common/lifecycle';\nimport { ITransaction, observableFromEvent, observableValue, transaction } from 'vs/base/common/observable';\nimport { Range } from 'vs/editor/common/core/range';\nimport { ScrollType } from 'vs/editor/common/editorCommon';\nimport { IFooBar, IBar, IFoo } from 'foo';\n\nconsole.log(observableFromEvent, observableValue);\n\nconsole.log(observableValue, observableFromEvent);\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,4)",
			"innerChanges": [
				{
					"originalRange": "[3,23 -> 3,23]",
					"modifiedRange": "[3,23 -> 3,44]"
				}
			]
		},
		{
			"originalRange": "[6,7)",
			"modifiedRange": "[6,7)",
			"innerChanges": [
				{
					"originalRange": "[6,18 -> 6,18]",
					"modifiedRange": "[6,18 -> 6,24]"
				}
			]
		},
		{
			"originalRange": "[8,9)",
			"modifiedRange": "[8,9)",
			"innerChanges": [
				{
					"originalRange": "[8,13 -> 8,13]",
					"modifiedRange": "[8,13 -> 8,34]"
				}
			]
		},
		{
			"originalRange": "[10,11)",
			"modifiedRange": "[10,11)",
			"innerChanges": [
				{
					"originalRange": "[10,28 -> 10,28]",
					"modifiedRange": "[10,28 -> 10,49]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-diff-word-split/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-diff-word-split/legacy.expected.diff.json

```json
{
	"original": {
		"content": "import { findLast } from 'vs/base/common/arrays';\nimport { Disposable } from 'vs/base/common/lifecycle';\nimport { ITransaction, observableValue, transaction } from 'vs/base/common/observable';\nimport { Range } from 'vs/editor/common/core/range';\nimport { ScrollType } from 'vs/editor/common/editorCommon';\nimport { IFooBar, IFoo } from 'foo';\n\nconsole.log(observableValue);\n\nconsole.log(observableValue);\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import { findLast } from 'vs/base/common/arrays';\nimport { Disposable } from 'vs/base/common/lifecycle';\nimport { ITransaction, observableFromEvent, observableValue, transaction } from 'vs/base/common/observable';\nimport { Range } from 'vs/editor/common/core/range';\nimport { ScrollType } from 'vs/editor/common/editorCommon';\nimport { IFooBar, IBar, IFoo } from 'foo';\n\nconsole.log(observableFromEvent, observableValue);\n\nconsole.log(observableValue, observableFromEvent);\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,4)",
			"innerChanges": [
				{
					"originalRange": "[3,34 -> 3,34]",
					"modifiedRange": "[3,34 -> 3,55]"
				}
			]
		},
		{
			"originalRange": "[6,7)",
			"modifiedRange": "[6,7)",
			"innerChanges": [
				{
					"originalRange": "[6,20 -> 6,20]",
					"modifiedRange": "[6,20 -> 6,26]"
				}
			]
		},
		{
			"originalRange": "[8,9)",
			"modifiedRange": "[8,9)",
			"innerChanges": [
				{
					"originalRange": "[8,23 -> 8,23]",
					"modifiedRange": "[8,23 -> 8,44]"
				}
			]
		},
		{
			"originalRange": "[10,11)",
			"modifiedRange": "[10,11)",
			"innerChanges": [
				{
					"originalRange": "[10,28 -> 10,28]",
					"modifiedRange": "[10,28 -> 10,49]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-example1/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-example1/1.tst

```text
export class EditorWorkerServiceDiffComputer implements IDiffComputer {
	constructor(@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService) { }

	async computeDiff(textModel1: ITextModel, textModel2: ITextModel): Promise<LineDiff[] | null> {
		const diffs = await this.editorWorkerService.computeDiff(textModel1.uri, textModel2.uri, false, 1000);
		if (!diffs || diffs.quitEarly) {
			return null;
		}
		return diffs.changes.map((c) => LineDiff.fromLineChange(c, textModel1, textModel2));
	}
}

function wait(ms: number): Promise<void> {
	return new Promise(r => setTimeout(r, ms));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-example1/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-example1/2.tst

```text
export class EditorWorkerServiceDiffComputer implements IDiffComputer {
	constructor(@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService) { }

	async computeDiff(textModel1: ITextModel, textModel2: ITextModel): Promise<LineDiff[] | null> {
		const diffs = await this.editorWorkerService.computeDiff(textModel1.uri, textModel2.uri, false, 1000);
		if (!diffs || diffs.quitEarly) {
			return null;
		}
		return EditorWorkerServiceDiffComputer.fromDiffComputationResult(diffs, textModel1, textModel2);
	}

	public static fromDiffComputationResult(result: IDiffComputationResult, textModel1: ITextModel, textModel2: ITextModel): LineDiff[] {
		return result.changes.map((c) => fromLineChange(c, textModel1, textModel2));
	}
}

function fromLineChange(lineChange: ILineChange, originalTextModel: ITextModel, modifiedTextModel: ITextModel): LineDiff {
	let originalRange: LineRange;
	if (lineChange.originalEndLineNumber === 0) {
		// Insertion
		originalRange = new LineRange(lineChange.originalStartLineNumber + 1, 0);
	} else {
		originalRange = new LineRange(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber - lineChange.originalStartLineNumber + 1);
	}

	let modifiedRange: LineRange;
	if (lineChange.modifiedEndLineNumber === 0) {
		// Deletion
		modifiedRange = new LineRange(lineChange.modifiedStartLineNumber + 1, 0);
	} else {
		modifiedRange = new LineRange(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber - lineChange.modifiedStartLineNumber + 1);
	}

	let innerDiffs = lineChange.charChanges?.map(c => fromCharChange(c));
	if (!innerDiffs) {
		innerDiffs = [diffFromLineRanges(originalRange, modifiedRange)];
	}

	return new LineDiff(
		originalTextModel,
		originalRange,
		modifiedTextModel,
		modifiedRange,
		innerDiffs
	);
}

function diffFromLineRanges(originalRange: LineRange, modifiedRange: LineRange): Diff {
	// [1,1) -> [100, 101)

	if (originalRange.startLineNumber !== 1 && modifiedRange.startLineNumber !== 1) {

	}

	let original = new Range(
		originalRange.startLineNumber - 1,
		Number.MAX_SAFE_INTEGER,
		originalRange.endLineNumberExclusive - 1,
		Number.MAX_SAFE_INTEGER,
	);

	let modified = new Range(
		modifiedRange.startLineNumber - 1,
		Number.MAX_SAFE_INTEGER,
		modifiedRange.endLineNumberExclusive - 1,
		Number.MAX_SAFE_INTEGER,
	);

	return new Diff(
		original,
		modified
	);
}

function fromCharChange(charChange: ICharChange): Diff {
	return new Diff(
		new Range(charChange.originalStartLineNumber, charChange.originalStartColumn, charChange.originalEndLineNumber, charChange.originalEndColumn),
		new Range(charChange.modifiedStartLineNumber, charChange.modifiedStartColumn, charChange.modifiedEndLineNumber, charChange.modifiedEndColumn)
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-example1/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-example1/advanced.expected.diff.json

```json
{
	"original": {
		"content": "export class EditorWorkerServiceDiffComputer implements IDiffComputer {\n\tconstructor(@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService) { }\n\n\tasync computeDiff(textModel1: ITextModel, textModel2: ITextModel): Promise<LineDiff[] | null> {\n\t\tconst diffs = await this.editorWorkerService.computeDiff(textModel1.uri, textModel2.uri, false, 1000);\n\t\tif (!diffs || diffs.quitEarly) {\n\t\t\treturn null;\n\t\t}\n\t\treturn diffs.changes.map((c) => LineDiff.fromLineChange(c, textModel1, textModel2));\n\t}\n}\n\nfunction wait(ms: number): Promise<void> {\n\treturn new Promise(r => setTimeout(r, ms));\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "export class EditorWorkerServiceDiffComputer implements IDiffComputer {\n\tconstructor(@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService) { }\n\n\tasync computeDiff(textModel1: ITextModel, textModel2: ITextModel): Promise<LineDiff[] | null> {\n\t\tconst diffs = await this.editorWorkerService.computeDiff(textModel1.uri, textModel2.uri, false, 1000);\n\t\tif (!diffs || diffs.quitEarly) {\n\t\t\treturn null;\n\t\t}\n\t\treturn EditorWorkerServiceDiffComputer.fromDiffComputationResult(diffs, textModel1, textModel2);\n\t}\n\n\tpublic static fromDiffComputationResult(result: IDiffComputationResult, textModel1: ITextModel, textModel2: ITextModel): LineDiff[] {\n\t\treturn result.changes.map((c) => fromLineChange(c, textModel1, textModel2));\n\t}\n}\n\nfunction fromLineChange(lineChange: ILineChange, originalTextModel: ITextModel, modifiedTextModel: ITextModel): LineDiff {\n\tlet originalRange: LineRange;\n\tif (lineChange.originalEndLineNumber === 0) {\n\t\t// Insertion\n\t\toriginalRange = new LineRange(lineChange.originalStartLineNumber + 1, 0);\n\t} else {\n\t\toriginalRange = new LineRange(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber - lineChange.originalStartLineNumber + 1);\n\t}\n\n\tlet modifiedRange: LineRange;\n\tif (lineChange.modifiedEndLineNumber === 0) {\n\t\t// Deletion\n\t\tmodifiedRange = new LineRange(lineChange.modifiedStartLineNumber + 1, 0);\n\t} else {\n\t\tmodifiedRange = new LineRange(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber - lineChange.modifiedStartLineNumber + 1);\n\t}\n\n\tlet innerDiffs = lineChange.charChanges?.map(c => fromCharChange(c));\n\tif (!innerDiffs) {\n\t\tinnerDiffs = [diffFromLineRanges(originalRange, modifiedRange)];\n\t}\n\n\treturn new LineDiff(\n\t\toriginalTextModel,\n\t\toriginalRange,\n\t\tmodifiedTextModel,\n\t\tmodifiedRange,\n\t\tinnerDiffs\n\t);\n}\n\nfunction diffFromLineRanges(originalRange: LineRange, modifiedRange: LineRange): Diff {\n\t// [1,1) -> [100, 101)\n\n\tif (originalRange.startLineNumber !== 1 && modifiedRange.startLineNumber !== 1) {\n\n\t}\n\n\tlet original = new Range(\n\t\toriginalRange.startLineNumber - 1,\n\t\tNumber.MAX_SAFE_INTEGER,\n\t\toriginalRange.endLineNumberExclusive - 1,\n\t\tNumber.MAX_SAFE_INTEGER,\n\t);\n\n\tlet modified = new Range(\n\t\tmodifiedRange.startLineNumber - 1,\n\t\tNumber.MAX_SAFE_INTEGER,\n\t\tmodifiedRange.endLineNumberExclusive - 1,\n\t\tNumber.MAX_SAFE_INTEGER,\n\t);\n\n\treturn new Diff(\n\t\toriginal,\n\t\tmodified\n\t);\n}\n\nfunction fromCharChange(charChange: ICharChange): Diff {\n\treturn new Diff(\n\t\tnew Range(charChange.originalStartLineNumber, charChange.originalStartColumn, charChange.originalEndLineNumber, charChange.originalEndColumn),\n\t\tnew Range(charChange.modifiedStartLineNumber, charChange.modifiedStartColumn, charChange.modifiedEndLineNumber, charChange.modifiedEndColumn)\n\t);\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[9,10)",
			"modifiedRange": "[9,14)",
			"innerChanges": [
				{
					"originalRange": "[9,10 -> 9,15]",
					"modifiedRange": "[9,10 -> 13,16]"
				},
				{
					"originalRange": "[9,35 -> 9,44]",
					"modifiedRange": "[13,36 -> 13,36]"
				}
			]
		},
		{
			"originalRange": "[13,15)",
			"modifiedRange": "[17,80)",
			"innerChanges": [
				{
					"originalRange": "[13,10 -> 15,1]",
					"modifiedRange": "[17,10 -> 80,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-example1/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-example1/legacy.expected.diff.json

```json
{
	"original": {
		"content": "export class EditorWorkerServiceDiffComputer implements IDiffComputer {\n\tconstructor(@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService) { }\n\n\tasync computeDiff(textModel1: ITextModel, textModel2: ITextModel): Promise<LineDiff[] | null> {\n\t\tconst diffs = await this.editorWorkerService.computeDiff(textModel1.uri, textModel2.uri, false, 1000);\n\t\tif (!diffs || diffs.quitEarly) {\n\t\t\treturn null;\n\t\t}\n\t\treturn diffs.changes.map((c) => LineDiff.fromLineChange(c, textModel1, textModel2));\n\t}\n}\n\nfunction wait(ms: number): Promise<void> {\n\treturn new Promise(r => setTimeout(r, ms));\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "export class EditorWorkerServiceDiffComputer implements IDiffComputer {\n\tconstructor(@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService) { }\n\n\tasync computeDiff(textModel1: ITextModel, textModel2: ITextModel): Promise<LineDiff[] | null> {\n\t\tconst diffs = await this.editorWorkerService.computeDiff(textModel1.uri, textModel2.uri, false, 1000);\n\t\tif (!diffs || diffs.quitEarly) {\n\t\t\treturn null;\n\t\t}\n\t\treturn EditorWorkerServiceDiffComputer.fromDiffComputationResult(diffs, textModel1, textModel2);\n\t}\n\n\tpublic static fromDiffComputationResult(result: IDiffComputationResult, textModel1: ITextModel, textModel2: ITextModel): LineDiff[] {\n\t\treturn result.changes.map((c) => fromLineChange(c, textModel1, textModel2));\n\t}\n}\n\nfunction fromLineChange(lineChange: ILineChange, originalTextModel: ITextModel, modifiedTextModel: ITextModel): LineDiff {\n\tlet originalRange: LineRange;\n\tif (lineChange.originalEndLineNumber === 0) {\n\t\t// Insertion\n\t\toriginalRange = new LineRange(lineChange.originalStartLineNumber + 1, 0);\n\t} else {\n\t\toriginalRange = new LineRange(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber - lineChange.originalStartLineNumber + 1);\n\t}\n\n\tlet modifiedRange: LineRange;\n\tif (lineChange.modifiedEndLineNumber === 0) {\n\t\t// Deletion\n\t\tmodifiedRange = new LineRange(lineChange.modifiedStartLineNumber + 1, 0);\n\t} else {\n\t\tmodifiedRange = new LineRange(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber - lineChange.modifiedStartLineNumber + 1);\n\t}\n\n\tlet innerDiffs = lineChange.charChanges?.map(c => fromCharChange(c));\n\tif (!innerDiffs) {\n\t\tinnerDiffs = [diffFromLineRanges(originalRange, modifiedRange)];\n\t}\n\n\treturn new LineDiff(\n\t\toriginalTextModel,\n\t\toriginalRange,\n\t\tmodifiedTextModel,\n\t\tmodifiedRange,\n\t\tinnerDiffs\n\t);\n}\n\nfunction diffFromLineRanges(originalRange: LineRange, modifiedRange: LineRange): Diff {\n\t// [1,1) -> [100, 101)\n\n\tif (originalRange.startLineNumber !== 1 && modifiedRange.startLineNumber !== 1) {\n\n\t}\n\n\tlet original = new Range(\n\t\toriginalRange.startLineNumber - 1,\n\t\tNumber.MAX_SAFE_INTEGER,\n\t\toriginalRange.endLineNumberExclusive - 1,\n\t\tNumber.MAX_SAFE_INTEGER,\n\t);\n\n\tlet modified = new Range(\n\t\tmodifiedRange.startLineNumber - 1,\n\t\tNumber.MAX_SAFE_INTEGER,\n\t\tmodifiedRange.endLineNumberExclusive - 1,\n\t\tNumber.MAX_SAFE_INTEGER,\n\t);\n\n\treturn new Diff(\n\t\toriginal,\n\t\tmodified\n\t);\n}\n\nfunction fromCharChange(charChange: ICharChange): Diff {\n\treturn new Diff(\n\t\tnew Range(charChange.originalStartLineNumber, charChange.originalStartColumn, charChange.originalEndLineNumber, charChange.originalEndColumn),\n\t\tnew Range(charChange.modifiedStartLineNumber, charChange.modifiedStartColumn, charChange.modifiedEndLineNumber, charChange.modifiedEndColumn)\n\t);\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[9,10)",
			"modifiedRange": "[9,53)",
			"innerChanges": null
		},
		{
			"originalRange": "[11,11)",
			"modifiedRange": "[54,73)",
			"innerChanges": null
		},
		{
			"originalRange": "[13,15)",
			"modifiedRange": "[75,80)",
			"innerChanges": [
				{
					"originalRange": "[13,10 -> 13,20]",
					"modifiedRange": "[75,10 -> 77,42]"
				},
				{
					"originalRange": "[13,25 -> 14,9]",
					"modifiedRange": "[77,47 -> 78,3]"
				},
				{
					"originalRange": "[14,13 -> 14,37]",
					"modifiedRange": "[78,7 -> 78,112]"
				},
				{
					"originalRange": "[14,40 -> 14,43]",
					"modifiedRange": "[78,115 -> 79,2]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-example2-ts/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-example2-ts/1.tst

```text
function cloneTypeReference(source: TypeReference): TypeReference {
    const type = <TypeReference>createType(source.flags);
    type.symbol = source.symbol;
    type.objectFlags = source.objectFlags;
    type.target = source.target;
    type.typeArguments = source.typeArguments;
    return type;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-example2-ts/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-example2-ts/2.tst

```text
function cloneTypeReference(source: TypeReference): TypeReference {
    const type = <TypeReference>createType(source.flags);
    type.symbol = source.symbol;
    type.objectFlags = source.objectFlags;
    type.target = source.target;
    type.resolvedTypeArguments = source.resolvedTypeArguments;
    return type;
}

function createDeferredTypeReference(): DeferredTypeReference {
    const aliasSymbol = getAliasSymbolForTypeNode(node);
    const aliasTypeArguments = getTypeArgumentsForAliasSymbol(aliasSymbol);
    type.target = target;
    type.node = node;
    type.mapper = mapper;
    type.aliasSymbol = aliasSymbol;
    return type;
}

function getTypeArguments(type: TypeReference): ReadonlyArray<Type> {
    if (!type.resolvedTypeArguments) {
        const node = type.node;
    }
    return type.resolvedTypeArguments;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-example2-ts/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-example2-ts/advanced.expected.diff.json

```json
{
	"original": {
		"content": "function cloneTypeReference(source: TypeReference): TypeReference {\n    const type = <TypeReference>createType(source.flags);\n    type.symbol = source.symbol;\n    type.objectFlags = source.objectFlags;\n    type.target = source.target;\n    type.typeArguments = source.typeArguments;\n    return type;\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "function cloneTypeReference(source: TypeReference): TypeReference {\n    const type = <TypeReference>createType(source.flags);\n    type.symbol = source.symbol;\n    type.objectFlags = source.objectFlags;\n    type.target = source.target;\n    type.resolvedTypeArguments = source.resolvedTypeArguments;\n    return type;\n}\n\nfunction createDeferredTypeReference(): DeferredTypeReference {\n    const aliasSymbol = getAliasSymbolForTypeNode(node);\n    const aliasTypeArguments = getTypeArgumentsForAliasSymbol(aliasSymbol);\n    type.target = target;\n    type.node = node;\n    type.mapper = mapper;\n    type.aliasSymbol = aliasSymbol;\n    return type;\n}\n\nfunction getTypeArguments(type: TypeReference): ReadonlyArray<Type> {\n    if (!type.resolvedTypeArguments) {\n        const node = type.node;\n    }\n    return type.resolvedTypeArguments;\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[6,7)",
			"modifiedRange": "[6,17)",
			"innerChanges": [
				{
					"originalRange": "[6,10 -> 6,11]",
					"modifiedRange": "[6,10 -> 6,19]"
				},
				{
					"originalRange": "[6,33 -> 6,34]",
					"modifiedRange": "[6,41 -> 6,50]"
				},
				{
					"originalRange": "[7,1 -> 7,1]",
					"modifiedRange": "[7,1 -> 17,1]"
				}
			]
		},
		{
			"originalRange": "[9,9)",
			"modifiedRange": "[19,26)",
			"innerChanges": [
				{
					"originalRange": "[8,2 -> 8,2 EOL]",
					"modifiedRange": "[18,2 -> 25,2 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-example2-ts/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-example2-ts/legacy.expected.diff.json

```json
{
	"original": {
		"content": "function cloneTypeReference(source: TypeReference): TypeReference {\n    const type = <TypeReference>createType(source.flags);\n    type.symbol = source.symbol;\n    type.objectFlags = source.objectFlags;\n    type.target = source.target;\n    type.typeArguments = source.typeArguments;\n    return type;\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "function cloneTypeReference(source: TypeReference): TypeReference {\n    const type = <TypeReference>createType(source.flags);\n    type.symbol = source.symbol;\n    type.objectFlags = source.objectFlags;\n    type.target = source.target;\n    type.resolvedTypeArguments = source.resolvedTypeArguments;\n    return type;\n}\n\nfunction createDeferredTypeReference(): DeferredTypeReference {\n    const aliasSymbol = getAliasSymbolForTypeNode(node);\n    const aliasTypeArguments = getTypeArgumentsForAliasSymbol(aliasSymbol);\n    type.target = target;\n    type.node = node;\n    type.mapper = mapper;\n    type.aliasSymbol = aliasSymbol;\n    return type;\n}\n\nfunction getTypeArguments(type: TypeReference): ReadonlyArray<Type> {\n    if (!type.resolvedTypeArguments) {\n        const node = type.node;\n    }\n    return type.resolvedTypeArguments;\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[6,7)",
			"modifiedRange": "[6,17)",
			"innerChanges": [
				{
					"originalRange": "[6,10 -> 6,11]",
					"modifiedRange": "[6,10 -> 6,19]"
				},
				{
					"originalRange": "[6,33 -> 6,33]",
					"modifiedRange": "[6,41 -> 7,12]"
				},
				{
					"originalRange": "[6,37 -> 6,37]",
					"modifiedRange": "[7,16 -> 12,20]"
				},
				{
					"originalRange": "[6,46 -> 6,46]",
					"modifiedRange": "[12,29 -> 16,35]"
				}
			]
		},
		{
			"originalRange": "[9,9)",
			"modifiedRange": "[19,26)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing/1.tst

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IHistoryNavigationWidget } from 'vs/base/browser/history';
import { IContextViewProvider } from 'vs/base/browser/ui/contextview/contextview';
import { FindInput, IFindInputOptions } from 'vs/base/browser/ui/findinput/findInput';
import { IReplaceInputOptions, ReplaceInput } from 'vs/base/browser/ui/findinput/replaceInput';
import { HistoryInputBox, IHistoryInputOptions } from 'vs/base/browser/ui/inputbox/inputBox';
import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from 'vs/platform/contextkey/common/contextkey';
import { KeybindingsRegistry, KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';
import { localize } from 'vs/nls';
import { DisposableStore, IDisposable, toDisposable } from 'vs/base/common/lifecycle';

export const historyNavigationVisible = new RawContextKey<boolean>('suggestWidgetVisible', false, localize('suggestWidgetVisible', "Whether suggestion are visible"));

const HistoryNavigationWidgetFocusContext = 'historyNavigationWidgetFocus';
const HistoryNavigationForwardsEnablementContext = 'historyNavigationForwardsEnabled';
const HistoryNavigationBackwardsEnablementContext = 'historyNavigationBackwardsEnabled';

export interface IHistoryNavigationContext extends IDisposable {
	scopedContextKeyService: IContextKeyService;
	historyNavigationForwardsEnablement: IContextKey<boolean>;
	historyNavigationBackwardsEnablement: IContextKey<boolean>;
}

let lastFocusedWidget: IHistoryNavigationWidget | undefined = undefined;
const widgets: IHistoryNavigationWidget[] = [];

export function registerAndCreateHistoryNavigationContext(contextKeyService: IContextKeyService, widget: IHistoryNavigationWidget): IHistoryNavigationContext {
	if (widgets.includes(widget)) {
		throw new Error('Cannot register the same widget multiple times');
	}

	widgets.push(widget);
	const disposableStore = new DisposableStore();
	const scopedContextKeyService = disposableStore.add(contextKeyService.createScoped(widget.element));
	const historyNavigationWidgetFocus = new RawContextKey<boolean>(HistoryNavigationWidgetFocusContext, false).bindTo(scopedContextKeyService);
	const historyNavigationForwardsEnablement = new RawContextKey<boolean>(HistoryNavigationForwardsEnablementContext, true).bindTo(scopedContextKeyService);
	const historyNavigationBackwardsEnablement = new RawContextKey<boolean>(HistoryNavigationBackwardsEnablementContext, true).bindTo(scopedContextKeyService);

	const onDidFocus = () => {
		historyNavigationWidgetFocus.set(true);
		lastFocusedWidget = widget;
	};

	const onDidBlur = () => {
		historyNavigationWidgetFocus.set(false);
		if (lastFocusedWidget === widget) {
			lastFocusedWidget = undefined;
		}
	};

	// Check for currently being focused
	if (widget.element === document.activeElement) {
		onDidFocus();
	}

	disposableStore.add(widget.onDidFocus(() => onDidFocus()));
	disposableStore.add(widget.onDidBlur(() => onDidBlur()));
	disposableStore.add(toDisposable(() => {
		widgets.splice(widgets.indexOf(widget), 1);
		onDidBlur();
	}));

	return {
		scopedContextKeyService,
		historyNavigationForwardsEnablement,
		historyNavigationBackwardsEnablement,
		dispose() {
			disposableStore.dispose();
		}
	};
}

export class ContextScopedHistoryInputBox extends HistoryInputBox {

	constructor(container: HTMLElement, contextViewProvider: IContextViewProvider | undefined, options: IHistoryInputOptions,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super(container, contextViewProvider, options);
		this._register(registerAndCreateHistoryNavigationContext(contextKeyService, this));
	}

}

export class ContextScopedFindInput extends FindInput {

	constructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider, options: IFindInputOptions,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super(container, contextViewProvider, options);
		this._register(registerAndCreateHistoryNavigationContext(contextKeyService, this.inputBox));
	}
}

export class ContextScopedReplaceInput extends ReplaceInput {

	constructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider | undefined, options: IReplaceInputOptions,
		@IContextKeyService contextKeyService: IContextKeyService, showReplaceOptions: boolean = false
	) {
		super(container, contextViewProvider, showReplaceOptions, options);
		this._register(registerAndCreateHistoryNavigationContext(contextKeyService, this.inputBox));
	}

}

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'history.showPrevious',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(
		ContextKeyExpr.has(HistoryNavigationWidgetFocusContext),
		ContextKeyExpr.equals(HistoryNavigationBackwardsEnablementContext, true),
		historyNavigationVisible.isEqualTo(false),
	),
	primary: KeyCode.UpArrow,
	secondary: [KeyMod.Alt | KeyCode.UpArrow],
	handler: (accessor) => {
		lastFocusedWidget?.showPreviousValue();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'history.showNext',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(
		ContextKeyExpr.has(HistoryNavigationWidgetFocusContext),
		ContextKeyExpr.equals(HistoryNavigationForwardsEnablementContext, true),
		historyNavigationVisible.isEqualTo(false),
	),
	primary: KeyCode.DownArrow,
	secondary: [KeyMod.Alt | KeyCode.DownArrow],
	handler: (accessor) => {
		lastFocusedWidget?.showNextValue();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/ts-fragmented-eager-diffing/2.tst

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IHistoryNavigationWidget } from 'vs/base/browser/history';
import { IContextViewProvider } from 'vs/base/browser/ui/contextview/contextview';
import { FindInput, IFindInputOptions } from 'vs/base/browser/ui/findinput/findInput';
import { IReplaceInputOptions, ReplaceInput } from 'vs/base/browser/ui/findinput/replaceInput';
import { HistoryInputBox, IHistoryInputOptions } from 'vs/base/browser/ui/inputbox/inputBox';
import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from 'vs/platform/contextkey/common/contextkey';
import { KeybindingsRegistry, KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';
import { localize } from 'vs/nls';
import { DisposableStore, IDisposable, toDisposable } from 'vs/base/common/lifecycle';

export const historyNavigationVisible = new RawContextKey<boolean>('suggestWidgetVisible', false, localize('suggestWidgetVisible', "Whether suggestion are visible"));

const HistoryNavigationWidgetFocusContext = 'historyNavigationWidgetFocus';
const HistoryNavigationForwardsEnablementContext = 'historyNavigationForwardsEnabled';
const HistoryNavigationBackwardsEnablementContext = 'historyNavigationBackwardsEnabled';

export interface IHistoryNavigationContext extends IDisposable {
	historyNavigationForwardsEnablement: IContextKey<boolean>;
	historyNavigationBackwardsEnablement: IContextKey<boolean>;
}

let lastFocusedWidget: IHistoryNavigationWidget | undefined = undefined;
const widgets: IHistoryNavigationWidget[] = [];

export function registerAndCreateHistoryNavigationContext(scopedContextKeyService: IContextKeyService, widget: IHistoryNavigationWidget): IHistoryNavigationContext {
	if (widgets.includes(widget)) {
		throw new Error('Cannot register the same widget multiple times');
	}

	widgets.push(widget);
	const disposableStore = new DisposableStore();
	const historyNavigationWidgetFocus = new RawContextKey<boolean>(HistoryNavigationWidgetFocusContext, false).bindTo(scopedContextKeyService);
	const historyNavigationForwardsEnablement = new RawContextKey<boolean>(HistoryNavigationForwardsEnablementContext, true).bindTo(scopedContextKeyService);
	const historyNavigationBackwardsEnablement = new RawContextKey<boolean>(HistoryNavigationBackwardsEnablementContext, true).bindTo(scopedContextKeyService);

	const onDidFocus = () => {
		historyNavigationWidgetFocus.set(true);
		lastFocusedWidget = widget;
	};

	const onDidBlur = () => {
		historyNavigationWidgetFocus.set(false);
		if (lastFocusedWidget === widget) {
			lastFocusedWidget = undefined;
		}
	};

	// Check for currently being focused
	if (widget.element === document.activeElement) {
		onDidFocus();
	}

	disposableStore.add(widget.onDidFocus(() => onDidFocus()));
	disposableStore.add(widget.onDidBlur(() => onDidBlur()));
	disposableStore.add(toDisposable(() => {
		widgets.splice(widgets.indexOf(widget), 1);
		onDidBlur();
	}));

	return {
		historyNavigationForwardsEnablement,
		historyNavigationBackwardsEnablement,
		dispose() {
			disposableStore.dispose();
		}
	};
}

export class ContextScopedHistoryInputBox extends HistoryInputBox {

	constructor(container: HTMLElement, contextViewProvider: IContextViewProvider | undefined, options: IHistoryInputOptions,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super(container, contextViewProvider, options);
		const scopedContextKeyService = this._register(contextKeyService.createScoped(this.element));
		this._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this));
	}

}

export class ContextScopedFindInput extends FindInput {

	constructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider, options: IFindInputOptions,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super(container, contextViewProvider, options);
		const scopedContextKeyService = this._register(contextKeyService.createScoped(this.inputBox.element));
		this._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this.inputBox));
	}
}

export class ContextScopedReplaceInput extends ReplaceInput {

	constructor(container: HTMLElement | null, contextViewProvider: IContextViewProvider | undefined, options: IReplaceInputOptions,
		@IContextKeyService contextKeyService: IContextKeyService, showReplaceOptions: boolean = false
	) {
		super(container, contextViewProvider, showReplaceOptions, options);
		const scopedContextKeyService = this._register(contextKeyService.createScoped(this.inputBox.element));
		this._register(registerAndCreateHistoryNavigationContext(scopedContextKeyService, this.inputBox));
	}

}

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'history.showPrevious',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(
		ContextKeyExpr.has(HistoryNavigationWidgetFocusContext),
		ContextKeyExpr.equals(HistoryNavigationBackwardsEnablementContext, true),
		historyNavigationVisible.isEqualTo(false),
	),
	primary: KeyCode.UpArrow,
	secondary: [KeyMod.Alt | KeyCode.UpArrow],
	handler: (accessor) => {
		lastFocusedWidget?.showPreviousValue();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'history.showNext',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(
		ContextKeyExpr.has(HistoryNavigationWidgetFocusContext),
		ContextKeyExpr.equals(HistoryNavigationForwardsEnablementContext, true),
		historyNavigationVisible.isEqualTo(false),
	),
	primary: KeyCode.DownArrow,
	secondary: [KeyMod.Alt | KeyCode.DownArrow],
	handler: (accessor) => {
		lastFocusedWidget?.showNextValue();
	}
});
```

--------------------------------------------------------------------------------

````
