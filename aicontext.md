# x4js — AI Context

> Généré exclusivement depuis les sources TypeScript du dépôt https://github.com/rlibre/x4  
> Fichiers lus : `src/x4.ts`, `src/core/core_element.ts`, `src/core/core_events.ts`, `src/core/component.ts`, `src/core/core_application.ts`, `src/core/core_tools.ts`, `src/core/core_i18n.ts`, `src/core/core_data.ts`, `src/core/core_router.ts`, `src/components/components.ts`, et les composants : `boxes`, `button`, `label`, `icon`, `input`, `textedit`, `checkbox`, `listbox`, `dialog`, `popup`, `form`, `menu`, `tabs`, `btngroup`, `messages`

---

## Présentation

x4js est un framework TypeScript pour applications Web ou Desktop. Point d'entrée unique :

```ts
import { ... } from 'x4js'  // src/x4.ts
```

**Dépôt actif** : https://github.com/rlibre/x4  
**Dépôt archivé** : https://github.com/rlibre/x4js (read-only depuis mars 2026)  
**Licence** : MIT  
**Démarrage rapide** :
```bash
npx x4build create demo --type=html
```

---

## Structure des modules

```
src/
├── x4.ts                    ← point d'entrée, re-exporte tout
├── core/
│   ├── core_element.ts      ← CoreElement (timers + events)
│   ├── core_events.ts       ← EventSource, EventMap, CoreEvent
│   ├── component.ts         ← Component, ComponentProps, events de base
│   ├── core_application.ts  ← Application (singleton)
│   ├── core_tools.ts        ← utilitaires (Rect, UnsafeHtml, dates, strings...)
│   ├── core_i18n.ts         ← i18n (_tr, createLanguage, addTranslation...)
│   ├── core_data.ts         ← DataModel, DataStore, DataView, DataProxy
│   ├── core_router.ts       ← Router
│   ├── core_colors.ts
│   ├── core_dom.ts
│   ├── core_dragdrop.ts
│   ├── core_pdf.ts
│   ├── core_react.ts
│   ├── core_state.ts
│   ├── core_styles.ts
│   └── core_svg.ts
└── components/
    └── (46 composants, voir liste ci-dessous)
```

---

## Hiérarchie des classes

```
CoreElement<E>               timers + événements (sans DOM)
  ├── Component<P,E>         composant DOM de base
  │     ├── Box<P,E>
  │     │     ├── HBox / VBox
  │     │     ├── StackBox → AssistBox
  │     │     ├── GridBox / MasonryBox
  │     │     ├── Form
  │     │     ├── Popup → Dialog → MessageBox / InputBox / PromptBox / ProgressionBox
  │     │     ├── Menu
  │     │     ├── BtnGroup
  │     │     ├── Listbox
  │     │     ├── Tabs
  │     │     └── ...tous les autres composants
  │     ├── Button
  │     ├── Input
  │     ├── Icon
  │     ├── Label / SimpleText
  │     ├── Flex / Space
  │     └── ...
  └── Application<E>         singleton, pas de DOM propre

EventSource<E>               registre d'événements autonome
  └── DataStore<T>
  └── Router
```

---

## `CoreElement<E extends EventMap>`

Classe de base sans DOM. Timers nommés + surface d'événements.

### Timers

```ts
setTimeout(name: string, ms: number, callback: () => void): void
clearTimeout(name: string): void
setInterval(name: string, ms: number, callback: () => void): void
clearInterval(name: string): void
clearTimeouts(): void   // stoppe TOUS les timers de l'instance
```

> Démarrer un timer avec un nom déjà utilisé stoppe l'ancien automatiquement.

### Événements

```ts
on<K extends keyof E>(name: K, listener: (ev: E[K]) => void): { off(): void }
off<K extends keyof E>(name: K, listener: (ev: E[K]) => void): void
fire<K extends keyof E>(name: K, ev: E[K]): void
```

`on()` retourne `{ off() }` pour se désabonner facilement.  
L'`EventSource` interne est créé paresseusement au premier `on()`.

---

## `EventSource<E extends EventMap>`

Registre d'événements réutilisable de façon autonome (utilisé par `DataStore`, `Router`...).

```ts
new EventSource(source?: unknown)

addListener<K>(name: K, callback: (ev: E[K]) => void, capturing?: boolean): () => void
removeListener<K>(name: K, callback: (ev: E[K]) => void): void
fire<K>(name: K, ev: E[K]): void
```

- `capturing = true` → insert en tête de liste
- `fire()` injecte automatiquement `source`, `type`, `stopPropagation()`, `preventDefault()` si absents
- Propagation s'arrête si `ev.propagationStopped === true`

---

## `CoreEvent`

Interface de base pour tous les événements.

```ts
interface CoreEvent {
  readonly type?: string
  readonly source?: CoreElement
  readonly context?: any
  propagationStopped?: boolean
  defaultPrevented?: boolean
  stopPropagation?(): void
  preventDefault?(): void
}
```

---

## `EventMap`

Interface vide à étendre pour typer les événements.

```ts
interface EventMap {}

// Usage
interface MyEvents extends EventMap {
  loaded: { ok: boolean }
  tick: number
}
```

---

## `Component<P extends ComponentProps, E extends ComponentEvents>`

Composant DOM de base. Crée un `HTMLElement` et génère des classes CSS depuis la hiérarchie.

### Génération automatique des classes CSS

Le décorateur `@class_ns("x4")` définit le préfixe. Les noms de classe viennent de la hiérarchie :

```
Component                           → "x4-comp"
@class_ns("x4") class Button       → "x4button x4-comp"
@class_ns("x4") class MyBtn extends Button → "x4mybtn x4button x4-comp"
```

Pour changer le préfixe dans sa propre classe :
```ts
static [x4_class_ns_sym] = "myprefix";
```

### `ComponentProps`

```ts
interface ComponentProps {
  tag?: string                           // balise HTML (défaut: "div")
  ns?: string                            // namespace SVG/MathML
  style?: Partial<CSSStyleDeclaration>
  attrs?: Record<string, string|number|boolean>
  content?: ComponentContent
  dom_events?: GlobalDOMEvents
  cls?: string                           // classes CSS supplémentaires
  id?: string
  ref?: { dom: T }                       // rempli à la création avec l'instance
  width?: string | number
  height?: string | number
  disabled?: boolean
  hidden?: boolean
  flex?: boolean | number                // true → classe "x4flex" ; number → flex-grow
  tooltip?: string
  existingDOM?: HTMLElement              // wrapper autour d'un DOM existant
}
```

### Constructeur

```ts
constructor(props: P)
```

### Propriétés

```ts
readonly dom: Element    // l'élément DOM
readonly props: P        // les props passées au constructeur
```

### Classes CSS

```ts
hasClass(cls: string): boolean
addClass(cls: string): void           // accepte plusieurs classes séparées par espaces
removeClass(cls: string): void        // "*" efface tout
removeClassEx(re: RegExp): void
toggleClass(cls: string): void
setClass(cls: string, set?: boolean): this
```

### Attributs HTML

```ts
setAttributes(attrs: Record<string, string|number|boolean>): this
setAttribute(name: string, value: string|number|boolean): void  // null/undefined/false → removeAttribute
getAttribute(name: string): string
getData(name: string): string           // lit data-<name>
getIntData(name: string): number        // lit data-<name> comme entier
setData(name: string, value: string): void
```

### Données internes (non-DOM)

```ts
setInternalData<T>(name: string|symbol, value: T): this
getInternalData<T>(name: string|symbol): T
```

### Styles

```ts
setStyle(style: Partial<CSSStyleDeclaration>): this   // nombres auto-suffixés "px" sauf unitless
setStyleValue<K>(name: K, value): this
getStyleValue<K>(name: K): CSSStyleDeclaration[K]
setWidth(w: number|string): void
setHeight(h: number|string): void
setStyleVariable(name: string, value: string): void   // CSS custom property
getStyleVariable(name: string): string
getComputedStyle(): CSSStyleDeclaration
setAria(name: keyof ariaValues, value: string|number|boolean): this
```

### Événements DOM

```ts
addDOMEvent<K extends keyof GlobalDOMEvents>(name: K, listener, prepend?: boolean): void
setDOMEvents(events: GlobalDOMEvents): void
```

### Contenu

```ts
type ComponentContent = Component | Component[] | string | string[] | UnsafeHtml | UnsafeHtml[] | number | boolean

setContent(content: ComponentContent): void      // clearContent + appendContent
appendContent(content: ComponentContent): void
prependContent(content: ComponentContent): void
clearContent(): void
removeChild(child: Component): void
```

### Navigation dans l'arbre

```ts
query<T extends Component>(selector: string): T
queryAll(selector: string): Component[]
firstChild<T extends Component>(): T
lastChild<T extends Component>(): T
nextElement<T extends Component>(): T
prevElement<T extends Component>(): T
parentElement<T extends Component>(cls?: Constructor<T>): T
childCount(): number
enumChildComponents(recursive: boolean): Component[]
enumChildNodes(recursive: boolean): Node[]
visitChildren(cb: (el: Component) => boolean): void

static parentElement<T extends Component>(dom: Node, cls?: Constructor<T>): T
```

### Visibilité / état

```ts
show(vis?: boolean): this    // toggle classe "x4hidden"
hide(): this
enable(ena?: boolean): this  // setAttribute "disabled" + propage aux <input>/<button> enfants
disable(): this
isDisabled(): string | null
isVisible(): boolean          // vérifie offsetParent !== null
```

### Focus / géométrie / pointer

```ts
focus(): this
hasFocus(): boolean
getBoundingRect(): Rect
scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void
setCapture(pointerId: number): void      // pointer capture
releaseCapture(pointerId: number): void
animate(keyframes: Keyframe[], duration: number): void
```

### Messages globaux

```ts
onGlobalEvent(cb: (ev: EvMessage) => void): void
// Auto-retiré quand le DOM du composant est supprimé
```

### Interfaces système

```ts
queryInterface<T>(name: string): T
// Interfaces connues :
//   "form-element"  → IFormElement { getRawValue, setRawValue, isValid }
//   "tab-handler"   → ITabHandler  { focusNext(next: boolean): boolean }
```

### Méthode utilitaire interne

```ts
protected mapPropEvents<N extends keyof E>(props: P, ...events: N[]): void
// Connecte props.onClick → this.on('click', ...) etc.
```

### JSX factory

```ts
static createElement(clsOrTag, attrs, ...children): Component | Component[]
static createFragment(): Component[]
```

### Fonctions exportées

```ts
componentFromDOM<T extends Component>(node: Element): T   // récupère le composant depuis un nœud DOM
wrapDOM(el: HTMLElement): Component                        // wrap un nœud existant
makeUniqueComponentId(): string                            // "x4-<n>"
```

### Événements définis dans `component.ts`

```ts
interface ComponentEvent extends CoreEvent {}
interface ComponentEvents extends EventMap {}

interface EvClick extends ComponentEvent { repeat?: number }
interface EvChange extends ComponentEvent { readonly value: any }
interface EvFocus extends ComponentEvent { readonly focus_out: boolean }
interface EvSelectionChange extends ComponentEvent {
  readonly selection: (number|string|any)[]
  readonly empty: boolean
}
interface EvContextMenu extends ComponentEvent { uievent: MouseEvent }
interface EvDrag extends ComponentEvent { element: unknown; data: any }
interface EvError extends ComponentEvent { code: number; message: string }
interface EvDblClick extends ComponentEvent {}
```

### Composants spéciaux de `component.ts`

```ts
class Flex extends Component    // spacer flex, CSS "x4flex"
class Space extends Component   // new Space(width?: number|string, cls?: string)
```

---

## `Application<E extends ApplicationEvents>`

Singleton. Étend `CoreElement<E>` (pas `Component`, pas de DOM propre).

```ts
interface EvMessage extends CoreEvent { msg: string; params: any }
interface ApplicationEvents extends EventMap {
  global: EvMessage
  message: EvMessage
}

interface AppProps {
  mountPoint?: string   // sélecteur CSS (défaut: "body")
}
```

### API

```ts
constructor(props?: AppProps)
// Monte automatiquement la mainview au chargement de la page

setMainView(view: Component): void
getMainView(): Component

static instance<P extends Application>(): P   // accès au singleton

setEnv(name: string, value: any): void
getEnv(name: string, def_value?: any): any

static fireGlobal(msg: string, params?: any): void

focusNext(next: boolean): boolean   // navigation Tab/Shift+Tab

setupSocketMessaging(path?: string, looseCallback?: () => void): void
// Connecte un WebSocket ; les messages globaux sont bidirectionnels

getStorage(name: string): string
setStorage(name: string, value: string|number): void
getStorageJSON(name: string): any
setStorageJSON(name: string, value: any): void

static readonly process: { getMaxTouchPoints(): number }
```

---

## Composants : Layouts / Containers

### `Box / HBox / VBox`

```ts
// Box : conteneur générique (CSS: x4box)
// HBox : flex horizontal (CSS: x4hbox)
// VBox : flex vertical (CSS: x4vbox)
interface BoxProps extends ComponentProps { tag?: string }
class Box<P,E> extends Component<P,E>
class HBox<P,E> extends Box<P,E>
class VBox<P,E> extends Box<P,E>
```

### `StackBox`

Une seule page visible à la fois. Les pages sont créées paresseusement.

```ts
interface StackItem {
  name: string
  content: Component | (() => Component)
  title?: string
}
interface StackBoxProps extends Omit<ComponentProps,"content"> {
  default: string
  items: StackItem[]
  pageChange?: EventCallback<EvSelectionChange>
}

class StackBox extends Box {
  select(name: string): Component
  addItem(item: StackItem): void
  removeItem(name: string): void
  getPage(name: string): Component | ContentBuilder
  getPageCount(): number
  enumPageNames(): string[]
  getItem(name: string): StackItem
  getCurPage(): string
}
```

### `AssistBox`

Étend `StackBox` — navigation séquentielle (wizard/carousel).

```ts
class AssistBox extends StackBox {
  selectNextPage(nxt?: boolean): void   // true = suivant, false = précédent
  isFirstPage(): boolean
  isLastPage(): boolean
}
```

### `GridBox`

```ts
interface GridBoxProps extends Omit<BoxProps,"content"> {
  rows?: number | string | string[]
  columns?: number | string | string[]
  items?: { row: number; col: number; item: Component }[]
}
class GridBox extends Box {
  setRows(r: number | string | string[]): void
  setCols(r: number | string | string[]): void
  setRowCount(n: number): void
  setColCount(n: number): void
  setTemplate(t: string[]): void
  setItems(items: { row: number; col: number; item: Component }[]): void
}
```

### `MasonryBox`

```ts
class MasonryBox extends Box {
  // constructor: new MasonryBox({ items: Component[] })
  setItems(items: Component[]): void
  resizeAllItems(): void
  resizeItem(item: Component): void
}
```

---

## Composants : Affichage

### `Label`

```ts
interface LabelProps extends ComponentProps {
  text?: string | UnsafeHtml
  icon?: string
  labelFor?: string
  align?: "left" | "center" | "right"
}
class Label extends Component {
  setText(text: string | UnsafeHtml): void
  setIcon(icon: string): void
}
```

### `SimpleText`

```ts
interface SimpleTextProps extends ComponentProps {
  text: string | UnsafeHtml
  align?: "left" | "center" | "right"
}
class SimpleText extends Component {
  setText(text: string | UnsafeHtml): void
}
```

### `Icon`

```ts
interface IconProps extends ComponentProps {
  iconId?: string   // URL, "var:css-var-name", data URL SVG, inline SVG, ou chemin .svg
}
class Icon extends Component {
  setIcon(iconId: string): void
  // Résolution :
  // "var:name"             → CSS variable
  // "data:image/svg+xml,<svg..." → inline direct
  // "<svg..."              → inline raw
  // "*.svg"                → chargement async + cache
  // autre                  → balise <img src="...">
}
export const svgLoader: SvgLoader   // cache SVG partagé
```

---

## Composants : Saisie

### `Input`

Composant de saisie multi-type — rendu comme un `<input>` natif.

```ts
// Types disponibles (union) :
type InputProps = TextInputProps | CheckboxProps | RadioProps | RangeProps | DateProps | NumberProps | FileProps | TimeProps

// Props communes (BaseProps) :
interface BaseProps extends ComponentProps {
  name?: string           // requis pour Form.getValues/setValues
  autofocus?: boolean
  required?: boolean
  readonly?: boolean
  placeholder?: string
  focus?: EventCallback<EvFocus>
  change?: EventCallback<EvChange>
}

class Input extends Component<InputProps> {
  getValue(): string
  setValue(value: string): void
  getNumValue(defNan?: number): number
  setNumValue(value: number, ndec?: number): void   // ndec: -1=auto, -2=step, ≥0=fixed
  getCheck(): boolean           // checkbox/radio
  setCheck(ck: boolean): void
  setReadOnly(ro: boolean): void
  selectAll(): void
  select(start: number, length?: number): void
  getSelection(): { start: number; length: number }
  isValid(): boolean
  // Implémente queryInterface("form-element")
}
```

### `TextEdit`

Label + Input en ligne (HBox).

```ts
type TextEditProps = (TextInputProps | NumberProps | DateProps | TimeProps) & {
  label: string | UnsafeHtml
  labelWidth?: number
  inputWidth?: number
  inputId?: string
  inputGadgets?: Component[]
  inputAttrs?: any
}
class TextEdit extends HBox {
  getValue(): string
  setValue(value: string): void
  getInput(): Input
}
```

### `Checkbox`

```ts
interface CheckboxProps extends ComponentProps {
  label: string
  checked?: boolean
  value?: boolean | number | string
  name?: string
  change?: EventCallback<EvChange>
}
class Checkbox extends Component {
  getCheck(): boolean
  setCheck(ck: boolean): void
  setLabel(text: string): void
  toggle(): void
}
```

---

## Composants : Listes

### `Listbox`

```ts
interface ListItem {
  id: ListboxID           // number | string
  text: string | UnsafeHtml
  iconId?: string
  data?: any
  cls?: string
  checked?: boolean
}
interface ListboxProps extends Omit<ComponentProps,'content'> {
  items?: ListItem[]
  renderer?: (item: ListItem) => Component
  title?: string
  icon?: string
  header?: Header
  footer?: Component
  checkable?: true
  multisel?: true
  dblClick?: EventCallback<EvDblClick>
  selectionChange?: EventCallback<EvSelectionChange>
  contextMenu?: EventCallback<EvContextMenu>
}
class Listbox extends Component {
  setItems(items: ListItem[], keepSel?: boolean): void
  appendItem(item: ListItem, prepend?: boolean, select?: boolean): void
  updateItem(id: any, item: ListItem): void
  getItem(id: ListboxID): ListItem
  select(ids: ListboxID | ListboxID[], notify?: boolean): void
  clearSelection(fireEvent?: boolean): void
  getSelection(): ListboxID[]
  filter(filter: string | RegExp): void
  navigate(sens: kbNav): boolean
  ensureSelectionVisible(): void
  renderItem(item: ListItem): Component      // override pour personnaliser
  defaultRenderer(item: ListItem): Component
}
```

---

## Composants : Menus

### `Menu`

```ts
interface MenuItem {
  cls?: string
  icon?: string
  text: string | UnsafeHtml
  menu?: Menu          // sous-menu
  disabled?: boolean
  click?: DOMEventHandler
}
type MenuElement = MenuItem | Component | string   // string "-" = titre

interface MenuProps extends Omit<PopupProps,"content"> {
  items: MenuElement[]
}
class Menu extends Popup {
  // Hérite de Popup : displayAt, displayNear, displayCenter, show, close, dismiss
}
```

### `BtnGroup`

Groupe de boutons (barre d'actions, barre de boutons de dialog).

```ts
type BtnGroupItem = "ok" | "cancel" | "yes" | "no" | "retry" | "abort"  // prédéfinis
                  | `ok.${string}` | `cancel.${string}` | ...           // avec options (.outline, .default, .disabled)
                  | "-" | ">>"    // Flex spacer
                  | "~"           // Space 1em
                  | Button | Label | Input                               // composants directs

interface BtnGroupProps extends Omit<ComponentProps,"content"> {
  align?: "left" | "center" | "right"
  vertical?: boolean
  reverse?: boolean
  items: BtnGroupItem[]
  btnclick?: EventCallback<EvBtnClick>
}
class BtnGroup extends Box {
  setButtons(btns: BtnGroupItem[]): void
  getButton(id: string): Button
  // Événement : "btnclick" → EvBtnClick { button: string }
}
```

---

## Composants : Onglets

### `Tabs`

```ts
interface TabItem {
  name: string
  title: string
  icon?: string
  content: Component | (() => Component)
  cls?: string
}
interface TabsProps extends Omit<ComponentProps,"content"> {
  default: string
  items: TabItem[]
  vertical?: boolean
}
class Tabs extends Box {
  selectTab(name: string): void
  getTab(name: string): Component | ContentBuilder
  getCurTab(): string
  addTab(item: TabItem): void
  removeTab(name: string): void
  enumTabs(): string[]
}
```

---

## Composants : Popup / Dialog

### `Popup`

Fenêtre flottante attachée au `<body>`. Gère auto-close, modal mask, redimensionnement, déplacement.

```ts
interface PopupProps extends ComponentProps {
  autoClose?: boolean | string   // true ou nom de groupe
  sizable?: boolean
  movable?: boolean
}
interface PopupEvents extends ComponentEvents {
  closed: ComponentEvent
  opened: ComponentEvent
}
class Popup extends Box {
  displayAt(x: number, y: number): void
  displayNear(rc: Rect, dst?: string, src?: string, offset?: {x,y}): void
  displayCenter(center?: boolean): void
  show(show?: boolean): this    // show() → displayCenter()
  close(): void
  dismiss(after?: boolean): void
  isOpen(): boolean
}
```

### `Dialog`

Étend `Popup`. Ajoute une barre de titre, un `Form`, et une `BtnGroup`.

```ts
interface DialogProps extends PopupProps {
  icon?: string
  title: string
  form?: Form
  buttons: BtnGroupItem[]
  closable?: boolean | string    // true = bouton fermer, string = nom du bouton envoyé
  modal?: boolean
  btnclick?: EventCallback<EvBtnClick>
}
interface EvBtnClick extends CoreEvent { button: string }

class Dialog extends Popup {
  setContent(form: Form): void
  getForm(): Form
  getValues(): FormValues
  validate(): FormValues
  getButton(name: string): Button
  getBtnBar(): BtnGroup
  setTitle(title: string): void
  async showAsync(): Promise<string>   // résout avec le nom du bouton cliqué
}
```

### `MessageBox`

```ts
class MessageBox extends Dialog {
  static show(
    msg: string | UnsafeHtml,
    buttons?: BtnGroupItem[],
    title?: string,
    icon_type?: "error" | "question"
  ): MessageBox
  
  static async showAsync(
    msg: string | UnsafeHtml,
    buttons?: BtnGroupItem[],
    title?: string,
    icon_type?: "error" | "question"
  ): Promise<string>
}
```

### `InputBox`

```ts
class InputBox extends Dialog {
  getValue(): string
  static async showAsync(
    msg: string | UnsafeHtml,
    value: string,
    title?: string,
    options?: { password?: boolean; trim?: boolean }
  ): Promise<string>   // null si annulé
}
```

### `PromptBox`

Dialog avec un éditeur libre passé en paramètre.

```ts
class PromptBox extends Dialog {
  static async showAsync(msg: string | UnsafeHtml, editor: Component, title?: string): Promise<string>
  static show(msg: string | UnsafeHtml, editor: Component, title: string, callback: (btn: string) => boolean | Promise<boolean | void>): void
}
```

### `ProgressionBox`

Dialog de progression avec barre et messages.

```ts
class ProgressionBox extends Dialog {
  constructor(title: string)
  addText(text: string | UnsafeHtml, perc: number): void
  addError(text: string | UnsafeHtml, perc: number): void
  setText(text: string | UnsafeHtml, perc: number): void
  clear(): void
  done(): void   // cache après 5s si pas d'erreurs, sinon affiche le bouton OK
}
```

---

## Composants : Formulaires

### `Form`

```ts
type FormValues = Record<string, any>

interface FormProps extends BoxProps {
  autoComplete?: boolean
}
class Form extends Box {
  setValues(values: FormValues): void
  getValues<T extends FormValues>(): T
  setAutoComplete(on?: boolean): void
  setValidator(validator: (values: FormValues, is_valid: boolean) => boolean): void
  validate(): FormValues   // null si invalide
}
// Collecte tous les éléments avec un attribut "name" qui implémentent queryInterface("form-element")
```

---

## Composants : Button

```ts
interface ButtonProps extends ComponentProps {
  label?: string | UnsafeHtml
  icon?: string
  tabindex?: boolean | number
  autorepeat?: number | boolean   // true=200ms, number=intervalle custom (premier tir après 500ms)
  click?: EventCallback<EvClick>
}
class Button extends Component<ButtonProps, { click: EvClick }> {
  click(): void                          // simule un clic
  setText(text: string | UnsafeHtml): void
  setIcon(icon: string): void
}
```

---

## Module Data

### `DataModel`

Décrit la structure d'un enregistrement via des décorateurs.

```ts
// Décorateurs de champs (namespace data)
namespace data {
  function id(): FieldDecorator                          // champ identifiant unique
  function string(props?: MetaData): FieldDecorator
  function int(props?: MetaData): FieldDecorator
  function float(props?: MetaData): FieldDecorator
  function bool(props?: MetaData): FieldDecorator
  function date(props?: MetaData): FieldDecorator
  function calc(props?: MetaData): FieldDecorator        // champ calculé (getter)
  function array(ctor: ModelConstructor, props?: MetaData): FieldDecorator
  function any(props?: MetaData): FieldDecorator
  function field(data: MetaData): FieldDecorator         // générique
}

class DataModel<T = any> {
  getFields(): FieldInfo[]
  getFieldIndex(name: string): number
  getID(rec: DataRecord): any
  getRaw(name: string | number, rec: DataRecord): any
  getField(name: string, rec: DataRecord): string        // comme string
  serialize<T>(input: DataRecord): T
  unSerialize(data: any, id?: DataRecordID): DataRecord<T>
  validate(record: DataRecord): Error[]
  addField(...fields: FieldInfo[]): void                 // ajout dynamique
}
```

### `DataStore<T>`

Étend `EventSource`. Stocke des enregistrements en mémoire, indexés et triés.

```ts
interface DataStoreProps {
  model: DataModel
  data?: any[]
  url?: string
  autoload?: false
  solver?: (data: any) => DataRecord[]
}
// Événement : "data_change" → EvDataChange { change_type: 'create'|'update'|'delete'|'data'|'change', id? }

class DataStore<T> extends EventSource {
  setData(records: any[]): void           // unSerialize puis setRawData
  setRawData(records: DataRecord[]): void
  append(rec: DataRecord): void
  appendRaw(rec: T): void
  update(rec: DataRecord): boolean
  delete(id: DataRecordID): boolean
  getById(id: DataRecordID): DataRecord<T>
  getByIndex(index: number): DataRecord<T>
  indexOfId(id: DataRecordID): number     // recherche binaire
  get count(): number
  get fields(): FieldInfo[]
  forEach(cb: (rec: DataRecord, index: number) => any): void
  find(cb: (rec: DataRecord) => boolean): DataRecord
  getMaxId(): number
  load(url?: string): Promise<any>
  reload(): Promise<any>
  export(): DataRecord[]
  changed(): void
  getModel(): DataModel
  createView(opts?: DataViewProps): DataView
}
```

### `DataView`

Vue filtrée/triée sur un `DataStore`. Étend `CoreElement`.

```ts
interface FilterInfo {
  op: '<' | '<=' | '=' | '>=' | '>' | '<>' | 'empty-result' | FilterFunc
  field?: string
  value?: string | RegExp
  caseSensitive?: boolean
}
interface SortProp {
  field: string
  ascending: boolean
  numeric?: boolean
  callback?: (v1: any, v2: any) => number
}
// Événement : "view_change" → EvViewChange { change_type: "change"|"filter"|"sort" }

class DataView extends CoreElement {
  filter(filter?: FilterInfo): number    // retourne le nb d'éléments filtrés
  sort(props: SortProp[]): void
  getCount(): number
  getById(id: DataRecordID): DataRecord
  getByIndex(index: number): DataRecord
  getIdByIndex(index: number): DataRecordID
  indexOfId(id: DataRecordID): number
  getStore(): DataStore
  getModel(): DataModel
  forEach(cb: (rec: DataRecord, index: number) => any): void
  changed(): void
}
```

### `DataProxy`

Charge des données depuis une URL et émet `change`.

```ts
interface DataProxyProps {
  url: string
  params?: string[]
  solver?: (data: any) => DataRecord[]
}
class DataProxy extends CoreElement {
  async load(url?: string): Promise<void>
  // Événement : "change" → EvChange { value: DataRecord[], context: rawJSON }
}
```

---

## Router

```ts
class Router extends EventSource {
  constructor(useHash?: boolean)    // défaut: true (# URLs)
  
  get(uri: string | RegExp, handler: (params: any, path: string) => void): void
  init(): void                       // déclenche la route courante
  navigate(uri: string, notify?: boolean, replace?: boolean): boolean
  // Événements :
  //   "change" → EvChange { value: string }  (nouvelle URL)
  //   "error"  → EvError  { code: 404, message: string }
}

// Utilitaire exporté :
function parseRoute(str: string | RegExp, loose?: boolean): { keys: string[], pattern: RegExp }
```

---

## i18n

Deux langues intégrées (`fr` et `en`). `fr` est la langue par défaut.

```ts
export let _tr: typeof fr   // objet de traduction courant (proxy)

createLanguage(name: string, base: string): void
addTranslation(name: string, ...parts: any[]): void
selectLanguage(name: string): typeof _tr
getCurrentLanguage(): string
getAvailableLanguages(): string[]
isLanguage(name: string): boolean
```

### Clés disponibles dans `_tr.global`

```ts
_tr.global.ok / cancel / yes / no / abort / retry / ignore
_tr.global.error / today / open / new / delete / close / save / search
_tr.global.required_field / invalid_format / invalid_email / invalid_number
_tr.global.diff_date_seconds / diff_date_minutes / diff_date_hours
_tr.global.invalid_date / empty_list
_tr.global.date_input_formats   // ex: 'd/m/y|d.m.y|d m y|d-m-y|dmy'
_tr.global.date_format          // ex: 'D/M/Y'
_tr.global.date_time_format     // ex: 'D/M/Y H:I:S'
_tr.global.day_short[]          // ['dim','lun',...]
_tr.global.day_long[]
_tr.global.month_short[]
_tr.global.month_long[]
_tr.global.property / value / err_403
_tr.global.copy / cut / paste / filedrop
_tr.global.keyboard.next / numeric / alpha
```

---

## Utilitaires (`core_tools.ts`)

### Types / classes

```ts
class UnsafeHtml extends String          // HTML brut non échappé
function unsafeHtml(x: string): UnsafeHtml
function unsafe(strings, ...values): UnsafeHtml   // template tag : unsafe`<b>${x}</b>`

class Rect {
  left: number; top: number; width: number; height: number
  get right(): number; get bottom(): number
  contains(pt: Point | Rect): boolean
  touches(rc: Rect): boolean
  normalize(): this
  inflate(dx: number, dy?: number): this
  scale(scale: number): this
}
interface Point { x: number; y: number }
interface Size { w: number; h: number }
interface IRect { left: number; top: number; height: number; width: number }

class Timer {     // timer standalone (hors CoreElement)
  setTimeout(name, time, callback): any
  clearTimeout(name): void
  setInterval(name, time, callback): any
  clearInterval(name): void
  clearAllTimeouts(): void
}

enum kbNav { first, prev, pgdn, pgup, next, last, left, right }
```

### Fonctions

```ts
// Type guards
isString(val): val is string
isNumber(v): v is number
isArray(val): val is any[]
isFunction(val): val is Function
isDate(v): v is Date
isPlainObject(value): value is Record<string, any>

// Géométrie
centerRect(inner: IRect, outer: IRect, margin?: number): IRect

// Strings
sprintf(format: string, ...args): string    // remplace {0} {1}...
pad(what: any, size: number, ch?: string): string  // >0=padEnd, <0=padStart
pascalCase(string): string                 // camelCase → kebab-case
camelCase(text): string
clamp<T>(v, min, max): T

// Dates
date_format(date, options?): string
date_diff(date1, date2, options?): string  // retourne "X secondes/minutes/heures"
date_to_sql(date, withHours): string       // "Y-M-D" ou "Y-M-D H:I:S"
date_sql_utc(date: string): Date
date_hash(date): number                    // hash comparable
date_clone(date): Date
date_calc_weeknum(date): number
parseIntlDate(value: string, fmts?: string): Date
formatIntlDate(date: Date, fmt?: string, utc?: boolean): string
calcAge(birth: Date, ref?: Date): number

// DOM
asap(callback: () => void): number         // requestAnimationFrame
oneshot(callback: () => void, ms?: number): number   // setTimeout
getFocusableElements(root: Element): Element[]
getScrollbarSize(): number
getGlobalZoom(): number
getSystemMetrics(part: "scrollbar" | "zoom"): number
setWaitCursor(wait: boolean): void
beep(): void

// Décorateur classe
function class_ns(ns: string): ClassDecorator
const x4_class_ns_sym: symbol

// Interfaces systèmes
interface IFormElement { getRawValue(): any; setRawValue(v): void; isValid(): boolean }
interface ITabHandler  { focusNext(next: boolean): boolean }
interface ITipHandler  { getTip(): string }

isFeatureAvailable(name: "eyedropper"): boolean
```

---

## `formatIntlDate` — spécificateurs de format

```
d  jour sans zéro        D  jour 2 chiffres
j  jour court (lun)      J  jour long (lundi)
w  numéro semaine        W  numéro semaine 2 chiffres
m  mois sans zéro        M  mois 2 chiffres
o  mois court (jan)      O  mois long (janvier)
y/Y  année               h  heure 24h      H  heure 2 chiffres
i  minutes               I  minutes 2 chiffres
s  secondes              S  secondes 2 chiffres
a  am/pm                 l  ms             L  ms 3 chiffres
{texte libre}            tout autre char → inséré tel quel
```

---

## Liste complète des composants

| Composant | Module |
|-----------|--------|
| `Box`, `HBox`, `VBox`, `StackBox`, `AssistBox`, `GridBox`, `MasonryBox` | boxes |
| `Button` | button |
| `Label`, `SimpleText` | label |
| `Icon` + `svgLoader` | icon |
| `Input` | input |
| `TextEdit` | textedit |
| `Checkbox` | checkbox |
| `Listbox` | listbox |
| `Menu` | menu |
| `BtnGroup` | btngroup |
| `Tabs` | tabs |
| `Popup`, `CMover` | popup |
| `Dialog`, `EvBtnClick` | dialog |
| `Form` | form |
| `MessageBox`, `InputBox`, `PromptBox`, `ProgressionBox` | messages |
| `Breadcrumb` | breadcrumb |
| `Calendar` | calendar |
| `Canvas`, `CanvasEx` | canvas |
| `ColorInput` | colorinput |
| `ColorPicker` | colorpicker |
| `ComboBox` | combobox |
| `FileDrop` | filedrop |
| `Gauge` | gauge |
| `GridView` | gridview |
| `Header` | header |
| `Image` | image |
| `Keyboard` | keyboard |
| `Link` | link |
| `Notification` | notification |
| `Panel` | panel |
| `Progress` | progress |
| `PropGrid` | propgrid |
| `Radio` | radio |
| `Rating` | rating |
| `Select` | select |
| `Sizer`, `CSizer` | sizers |
| `Slider` | slider |
| `Spreadsheet` | spreadsheet |
| `Switch` | switch |
| `TextArea` | textarea |
| `TickLine` | tickline |
| `Tooltip` | tooltips |
| `TreeView` | treeview |
| `Video` | video |
| `ScrollView`, `Viewport` | viewport |

---

## Patterns courants

### Composant personnalisé minimal

```ts
import { Component, ComponentProps, ComponentEvents, EvClick } from 'x4js'

interface MyProps extends ComponentProps {
  label: string
  click?: (ev: EvClick) => void
}
interface MyEvents extends ComponentEvents {
  click: EvClick
}

class MyButton extends Component<MyProps, MyEvents> {
  constructor(props: MyProps) {
    super({ ...props, tag: 'button' })
    this.mapPropEvents(props, 'click')
    this.addDOMEvent('click', () => this.fire('click', {}))
    this.setContent(props.label)
  }
}
```

### Application

```ts
import { Application, Component } from 'x4js'

class App extends Application {
  constructor() {
    super({ mountPoint: '#app' })
    this.setMainView(new Component({ content: 'Hello x4js' }))
  }
}
new App()
// Accès depuis n'importe où : Application.instance()
```

### Dialog async

```ts
const btn = await MessageBox.showAsync('Confirmer ?', ['ok.outline.default', 'cancel.outline'])
if (btn === 'ok') { /* ... */ }

// Dialog personnalisé
const dlg = new Dialog({
  title: 'Mon dialog',
  modal: true,
  movable: true,
  form: new Form({ content: [ new TextEdit({ label: 'Nom', name: 'name', value: '' }) ] }),
  buttons: ['ok.outline.default', 'cancel.outline'],
})
const btn = await dlg.showAsync()
if (btn === 'ok') {
  const values = dlg.getValues()  // { name: "..." }
}
```

### DataStore + DataView

```ts
import { DataModel, DataStore, data } from 'x4js'

class PersonModel extends DataModel {
  @data.id()   id: number
  @data.string() name: string
  @data.int()  age: number
}

const store = new DataStore({ model: new PersonModel(), data: [...] })
const view = store.createView({ filter: { op: '>=', field: 'age', value: '18' } })
view.on('view_change', () => listbox.setItems( ... ))
```

### Router

```ts
import { Router } from 'x4js'

const router = new Router(true)  // true = hash mode
router.get('/home',          (params) => showHome())
router.get('/detail/:id',    (params) => showDetail(params.id))
router.on('error',           () => router.navigate('/home'))
router.init()
// Navigation : router.navigate('/detail/42')
```

### Timers dans un composant

```ts
class Poller extends Component {
  constructor(props) {
    super(props)
    this.setInterval('poll', 5000, () => this.refresh())
  }
  refresh() { /* ... */ }
  // Arrêt : this.clearInterval('poll') ou this.clearTimeouts()
}
```

---

## Notes importantes

- `Component` stocke son instance sur son nœud DOM. Utilisez `componentFromDOM(el)` pour retrouver un composant depuis un `HTMLElement`.
- Les nombres passés à `setStyle`/`setStyleValue` sont auto-suffixés `"px"` sauf pour les propriétés sans unité (`zIndex`, `opacity`, `flexGrow`...).
- `show(false)` / `hide()` utilisent la classe CSS `"x4hidden"`, pas `display:none`.
- `enable(false)` / `disable()` propagent l'état `disabled` aux `<input>` et `<button>` enfants.
- `Application` est un singleton strict — une seule instance par page.
- `Popup.show()` appelle `displayCenter()`. Pour positionner, appeler `displayAt()` ou `displayNear()` à la place.
- `BtnGroup` accepte des chaînes prédéfinies (`"ok"`, `"cancel"`...) avec options après un `.` : `"ok.outline.default.disabled"`.
- `Form.getValues()` collecte tous les enfants (récursifs) ayant un attribut `name` et implémentant `queryInterface("form-element")`.
- La langue par défaut est `fr`. Appeler `selectLanguage('en')` pour passer en anglais.
