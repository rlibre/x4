# x4js — AI Context

> Regenerated from the TypeDoc API documentation of the repository https://github.com/rlibre/x4 (commit `70fd5c0`).
> This file is a compact API reference intended for AI assistants. Signatures are exact; prose is condensed.

---

## Overview

x4js is a TypeScript framework for Web or Desktop applications. Single entry point:

```ts
import { ... } from 'x4js'   // src/x4.ts
```

**Active repository**: https://github.com/rlibre/x4
**Archived repository**: https://github.com/rlibre/x4js (read-only since March 2026)
**License**: MIT
**Quick start**: `npx x4build create demo --type=html`

---

## Class hierarchy

```
CoreElement<E>                 named timers + event surface (no DOM)
  ├── Component<P,E>           base DOM component
  │     ├── Box<P,E>
  │     │     ├── HBox / VBox
  │     │     ├── StackBox → AssistBox
  │     │     ├── GridBox / MasonryBox
  │     │     ├── Form
  │     │     ├── Popup → Dialog → MessageBox / InputBox / PromptBox / ProgressionBox
  │     │     │        → Menu, DropdownList, Notification
  │     │     ├── BtnGroup, Tabs, Video, Saturation
  │     ├── Button, Input, Icon, Label, SimpleText, Checkbox, Radio, Link
  │     ├── Listbox, Gridview, Treeview, Select, Combobox, Slider, Gauge
  │     ├── Progress, TickLine, Canvas, Image, SvgComponent, Spreadsheet, MonacoEditor
  │     ├── CSizer → HSizer / VSizer
  │     ├── FileDialog, ScrollView, Viewport, Flex, Space
  │     ├── HBox-based: ColorInput, Rating, Switch, Keyboard, TextEdit, Breadcrumbs
  │     └── VBox-based: Calendar, ColorPicker, FileDrop, Panel, PropertyGrid, TextArea
  └── Application<E>           singleton, no DOM of its own

EventSource<E>                 standalone event registry
  ├── DataStore<T>
  └── Router

CoreElement-based (non-DOM): DataProxy, DataView, Store
Standalone: Rect, Timer, Color, DataModel, StateManager, Stylesheet, ComputedStyle,
            SvgBuilder, X4PDFBuilder, x4_react, CMover, UnsafeHtml (extends String)
```

---

## `CoreElement<E extends EventMap>`

Base class without DOM. Named timers + event surface. (`src/core/core_element.ts`)

```ts
// Timers (named — starting a timer with an existing name stops the previous one)
setTimeout(name: string, ms: number, callback: () => void): void
clearTimeout(name: string): void
setInterval(name: string, ms: number, callback: () => void): void
clearInterval(name: string): void
clearTimeouts(): void   // stops ALL timers of the instance

// Events
on<K extends keyof E>(name: K, listener: (ev: E[K]) => void): { off(): void }
off<K extends keyof E>(name: K, listener: (ev: E[K]) => void): void
fire<K extends keyof E>(name: K, ev: E[K]): void
```

`on()` returns `{ off() }` for easy unsubscription.

---

## `EventSource<E extends EventMap>`

Standalone reusable event registry, used by `DataStore`, `Router`. (`src/core/core_events.ts`)

```ts
new EventSource<E>(source?: unknown)
addListener<K>(name: K, callback: (ev: E[K]) => void, capturing?: boolean): () => void
removeListener<K>(name: K, callback: (ev: E[K]) => void): void
fire<K>(name: K, ev: E[K]): void
```

- `capturing = true` inserts at the head of the listener list.
- `fire()` automatically injects `source`, `type`, `stopPropagation()`, `preventDefault()` when absent.

### `CoreEvent`

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

### `EventMap`

Empty interface to extend in order to type events.

```ts
interface MyEvents extends EventMap {
  loaded: { ok: boolean }
  tick: number
}
```

---

## `Component<P extends ComponentProps, E extends ComponentEvents>`

Base DOM component. Creates an `HTMLElement`, generates CSS classes from the class hierarchy. (`src/core/component.ts`)

### `ComponentProps`

```ts
interface ComponentProps {
  tag?: string                                       // HTML tag (default "div")
  ns?: string                                        // SVG/MathML namespace
  cls?: string                                       // extra CSS classes
  id?: string
  style?: Partial<CSSStyleDeclaration>
  attrs?: Record<string, string | number | boolean>
  content?: ComponentContent
  dom_events?: GlobalDOMEvents
  ref?: RefType<any>                                 // filled at creation with the instance
  width?: string | number
  height?: string | number
  flex?: number | boolean                            // true → "x4flex"; number → flex-grow
  disabled?: boolean
  hidden?: boolean
  tooltip?: string
  existingDOM?: HTMLElement                          // wrap an existing DOM node
}

type ComponentContent =
  Component | Component[] | string | string[] | UnsafeHtml | UnsafeHtml[] | number | boolean
```

### Properties

```ts
readonly dom: Element
readonly props: P
protected readonly clsprefix: string
```

### CSS classes

```ts
hasClass(cls: string): boolean
addClass(cls: string): void            // space-separated allowed
removeClass(cls: string): void         // "*" clears all
removeClassEx(re: RegExp): void
toggleClass(cls: string): void
setClass(cls: string, set?: boolean): this
```

### HTML attributes & ARIA

```ts
setAttributes(attrs: Record<string, string|number|boolean>): this
setAttribute(name: string, value: string|number|boolean): void  // null/undefined/false → removeAttribute
getAttribute(name: string): string
getData(name: string): string          // reads data-<name>
getIntData(name: string): number
setData(name: string, value: string): void
setAria(name: keyof AriaAttributes, value: string|number|boolean): this
```

### Internal data (non-DOM)

```ts
setInternalData<T>(name: string|symbol, value: T): this
getInternalData<T>(name: string|symbol): T
```

### Styles

```ts
setStyle(style: Partial<CSSStyleDeclaration>): this  // numbers auto-suffixed "px" except unitless
setStyleValue<K>(name: K, value): this
getStyleValue<K>(name: K): CSSStyleDeclaration[K]
setWidth(w: number|string): void
setHeight(h: number|string): void
setStyleVariable(name: string, value: string): void  // CSS custom property
getStyleVariable(name: string): string
getComputedStyle(): CSSStyleDeclaration
```

### DOM events / content / tree

```ts
addDOMEvent<K extends keyof GlobalDOMEvents>(name: K, listener, prepend?: boolean): void
setDOMEvents(events: GlobalDOMEvents): void

setContent(content: ComponentContent): void
appendContent(content: ComponentContent): void
prependContent(content: ComponentContent): void
clearContent(): void
removeChild(child: Component): void

query<T extends Component>(selector: string): T
queryAll(selector: string): Component[]
firstChild<T>(): T;  lastChild<T>(): T
nextElement<T>(): T; prevElement<T>(): T
parentElement<T>(cls?: Constructor<T>): T
childCount(): number
enumChildComponents(recursive: boolean): Component[]
enumChildNodes(recursive: boolean): Node[]
visitChildren(cb: (el: Component) => boolean): void
static parentElement<T>(dom: Node, cls?: Constructor<T>): T
```

### Visibility / state / focus / geometry

```ts
show(vis?: boolean): this              // toggles "x4hidden" class (not display:none)
hide(): this
enable(ena?: boolean): this            // sets "disabled" + propagates to child <input>/<button>
disable(): this
isDisabled(): string | null
isVisible(): boolean
focus(): this
hasFocus(): boolean
getBoundingRect(): Rect
scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void
setCapture(pointerId: number): void;  releaseCapture(pointerId: number): void
animate(keyframes: Keyframe[], duration: number): void
onGlobalEvent(cb: (ev: EvMessage) => void): void   // auto-removed on DOM removal
queryInterface<T>(name: string): T     // "form-element" → IFormElement; "tab-handler" → ITabHandler
```

### Exported helpers

```ts
componentFromDOM<T extends Component>(node: Element): T
wrapDOM(el: HTMLElement): Component
makeUniqueComponentId(): string         // "x4-<n>"
```

### Component events (`component.ts`)

```ts
interface EvClick extends ComponentEvent { repeat?: number }
interface EvChange extends ComponentEvent { readonly value: any }
interface EvFocus extends ComponentEvent { readonly focus_out: boolean }
interface EvSelectionChange extends ComponentEvent { readonly selection: (number|string|any)[]; readonly empty: boolean }
interface EvContextMenu extends ComponentEvent { uievent: MouseEvent }
interface EvDrag extends ComponentEvent { element: unknown; data: any }
interface EvError extends ComponentEvent { code: number; message: string }
interface EvDblClick extends ComponentEvent {}
interface EvBtnClick extends CoreEvent { button: string }

// Spacers
class Flex extends Component    // CSS "x4flex"
class Space extends Component   // new Space(width?: number|string, cls?: string)
```

---

## `Application<E extends ApplicationEvents>`

Singleton. Extends `CoreElement` (no DOM of its own). (`src/core/core_application.ts`)

```ts
interface AppProps { mountPoint?: string }   // CSS selector, default "body"

constructor(props?: AppProps)                // auto-mounts the mainview on page load
setMainView(view: Component): void
getMainView(): Component
static instance<P extends Application>(): P
setEnv(name: string, value: any): void
getEnv(name: string, def_value?: any): any
static fireGlobal(msg: string, params?: any): void
focusNext(next: boolean): boolean
setupSocketMessaging(path?: string, looseCallback?: () => void): void
getStorage(name: string): string
setStorage(name: string, value: string|number): void
getStorageJSON(name: string): any
setStorageJSON(name: string, value: any): void
readonly static process: { getMaxTouchPoints(): number }
```

---

## Layout containers (`boxes`)

```ts
// Box: generic (x4box) | HBox: horizontal flex (x4hbox) | VBox: vertical flex (x4vbox)
class Box<P, E> extends Component<P, E>
class HBox<P, E> extends Box<P, E>
class VBox<P, E> extends Box<P, E>
interface BoxProps extends ComponentProps { tag?: string }
```

### `StackBox` — one page visible at a time (lazily created)

```ts
interface StackBoxProps extends Omit<ComponentProps,"content"> {
  default: string
  items: StackItem[]                       // { name, content: Component | (() => Component), title? }
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

### `AssistBox` — sequential navigation (wizard/carousel)

```ts
class AssistBox extends StackBox {
  selectNextPage(nxt?: boolean): void      // true=next, false=previous
  isFirstPage(): boolean
  isLastPage(): boolean
}
```

### `GridBox`

```ts
interface GridBoxProps extends Omit<BoxProps,"content"> {
  rows?: string | number | string[]
  columns?: string | number | string[]
  items?: { row: number; col: number; item: Component }[]
}
class GridBox extends Box {
  setRows(r); setCols(r); setRowCount(n); setColCount(n)
  setTemplate(t: string[]): void
  setItems(items): void
}
```

### `MasonryBox` — Pinterest-like layout

```ts
class MasonryBox extends Box {
  setItems(items: Component[]): void
  resizeAllItems(): void
  resizeItem(item: Component): void
}
```

---

## Display components

### `Label`

```ts
interface LabelProps extends ComponentProps {
  text?: string | UnsafeHtml
  icon?: string
  labelFor?: string
  align?: "left" | "center" | "right"
}
class Label extends Component { setText(text: string|UnsafeHtml): void; setIcon(icon: string): void }
```

### `SimpleText`

```ts
interface SimpleTextProps extends ComponentProps {
  text: string | UnsafeHtml                // required
  align?: "left" | "center" | "right"
}
class SimpleText extends Component { setText(text: string|UnsafeHtml): void }
```

### `Link`

```ts
interface LinkProps extends ComponentProps {
  href: string                             // required
  text?: string | UnsafeHtml
  icon?: string
  align?: "left" | "center" | "right"
  click?: EventCallback<EvClick>
}
interface LinkEvents extends ComponentEvents { click: EvClick }
class Link extends Component { setText(text: string|UnsafeHtml): void }
```

### `Icon`

```ts
interface IconProps extends ComponentProps { iconId?: string }
class Icon extends Component { setIcon(iconId: string): void }
// iconId resolution: "var:name" → CSS var | "data:image/svg+xml,<svg..." → inline
//   | "<svg..." → raw inline | "*.svg" → async load + cache | else → <img src>
export const svgLoader: SvgLoader          // shared SVG cache
```

### `Image`

```ts
interface ImageProps extends ComponentProps {
  src: string                              // required
  alt?: string
  fit?: "fill" | "contain" | "cover" | "scale-down"
  position?: string
  lazy?: boolean
  candrop?: boolean                        // accept drag&drop of a file
  accept?: string
  draggable?: boolean
  change?: EventCallback<EvDropChange>
  clear?: EventCallback<CoreEvent>
}
class Image extends Component {
  setImage(src: string): void
  setBase64(mime: string, base64: string): void
  clear(): void
}
```

### `Progress`

```ts
interface ProgressProps extends ComponentProps { /* min/max/value */ }
class Progress extends Component { setValue(value: number): void }
```

### `Gauge`

```ts
interface GaugeProps extends ComponentProps { min?: number; max?: number; colors?: string[] }
class Gauge extends Component {
  setRange(min: number, max: number): void
  setPos(pos: number): void
  setColorStops(colors: string[]): void
}
```

### `Rating`

```ts
interface RatingProps extends ComponentProps {
  value?: number; steps?: number; icon?: string; name?: string
  change?: EventCallback<EvChange>
}
class Rating extends HBox {
  getValue(): number; setValue(v: number): void
  setSteps(n: number): void; setShape(icon: string): void
}
```

---

## Input components

### `Input` — multi-type native `<input>`

```ts
type InputProps = TextInputProps | CheckboxProps | RadioProps | RangeProps
                | DateProps | NumberProps | FileProps | TimeProps

interface BaseProps extends ComponentProps {
  name?: string                            // required for Form.getValues/setValues
  autofocus?: boolean; required?: boolean; readonly?: boolean; placeholder?: string
  focus?: EventCallback<EvFocus>; change?: EventCallback<EvChange>
}
// TextInputProps: type?: "text"|"email"|"password"; value?: string|number; maxlength?, minlength?,
//                 pattern?, spellcheck?, trim?
// NumberProps:    type: "number"; value?: string|number; min?, max?, step?
// RangeProps:     type: "range"; min: number; max: number; step?; value?: number
// DateProps:      type: "date"; value?: string|Date
// TimeProps:      type: "time"; value?: string
// FileProps:      type: "file"; accept: string|string[]

class Input extends Component<InputProps> {
  getValue(): string;  setValue(value: string): void
  getNumValue(defNan?: number): number
  setNumValue(value: number, ndec?: number): void   // ndec: -1=auto, -2=step, ≥0=fixed
  getCheck(): boolean; setCheck(ck: boolean): void   // checkbox/radio
  setReadOnly(ro: boolean): void
  selectAll(): void; select(start: number, length?: number): void
  getSelection(): { start: number; length: number }
  isValid(): boolean
}
```

### `TextEdit` — Label + Input inline (HBox)

by default, TextEdit.getValue() result is timed

```ts
type TextEditProps = (TextInputProps | NumberProps | DateProps | TimeProps) & {
  label: string | UnsafeHtml
  labelWidth?: number; inputWidth?: number; inputId?: string
  inputGadgets?: Component[]; inputAttrs?: any
}
class TextEdit extends HBox {
  getValue(): string; setValue(value: string): void; getInput(): Input
}
```

### `TextArea`

```ts
class TextArea extends VBox { getText(): string; setText(text: string): void }
```

### `Checkbox`

```ts
interface CheckboxProps extends ComponentProps {
  label: string; checked?: boolean; value?: boolean|number|string; name?: string
  change?: EventCallback<EvChange>
}
class Checkbox extends Component {
  getCheck(): boolean; setCheck(ck: boolean): void
  setLabel(text: string): void; toggle(): void
  readonly _input: Input
}
```

### `Radio`

```ts
interface RadioProps extends ComponentProps { /* label, value, name, group */ }
class Radio extends Component {
  getValue(): string; setCheck(ck: boolean): void
  setLabel(text: string): void
  checkValue(vname: string): void          // check the radio whose value === vname (group)
}
```

### `Switch`

```ts
interface SwitchProps extends ComponentProps { /* label, checked, name */ }
class Switch extends HBox {}
```

### `Slider`

```ts
interface SliderProps extends ComponentProps { /* min, max, value, step */ }
class Slider extends Component {
  setMin(min: number): void; setMax(max: number): void; setValue(v: number): void
}
```

### `Select` — simple native select

```ts
interface SelectProps extends ComponentProps {
  items: ListItem[]                        // required
  value: string                            // required
  multiple?: boolean; name?: string
  change?: EventCallback<EvChange>; focus?: EventCallback<EvFocus>
}
class Select extends Component { getValue(): string; setValue(value: string): void; setItems(items: ListItem[]): void }
```

### `Combobox` — input + dropdown list

```ts
interface ComboboxProps extends ComponentProps { /* items, value, renderer... */ }
class Combobox extends Component {
  getValue(): string; setValue(value: string): void
  getInput(): Input
  getSelection(): ListboxID
  selectItem(index: number): void
  setItems(items): void
  showDropDown(): void
}
```

### `ColorInput`

```ts
class ColorInput extends HBox {}           // queryInterface("form-element")
```

### `FileDrop` / `FileDialog`

```ts
class FileDrop extends VBox {}             // drag&drop file zone, fires FileDropEvents
class FileDialog extends Component {}      // programmatic file picker
```

---

## Lists / grids / trees

### `Listbox`

```ts
interface ListItem {
  id: ListboxID                            // number | string
  text: string | UnsafeHtml
  iconId?: string; data?: any; cls?: string; checked?: boolean
}
interface ListboxProps extends Omit<ComponentProps,"content"> {
  items?: ListItem[]
  renderer?: (item: ListItem) => Component
  title?: string; icon?: string
  header?: Header; footer?: Component
  checkable?: true; multisel?: true
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
  renderItem(item: ListItem): Component     // override to customize
  defaultRenderer(item: ListItem): Component
  preventFocus: boolean
}
```

### `Gridview` — data grid backed by a DataStore

```ts
interface GridviewProps extends ComponentProps {
  store: DataStore                          // required
  columns: GridColumn[]                     // required
  footer?: boolean; emptyMsg?: string
  sort?: object
  click?: EventCallback<EvClick>
  dblClick?: EventCallback<EvDblClick>
  contextMenu?: EventCallback<EvContextMenu>
  selectionChange?: EventCallback<EvSelectionChange>
}
class Gridview extends Component {
  setStore(store: DataStore): void
  setColumns(columns: GridColumn[]): void
  setColTitle(col_name: string, title: string): void
  sortCol(colIdx: number, ascending: boolean): void
  getView(): DataView
  getSelection(): DataRecord[]
  getFirstSel(): DataRecord
  selectItem(id, ensureVisible?: boolean): void
  clearSelection(): void
  navigate(sens: kbNav): boolean
  lock(lock: boolean): void
}
```

### `Treeview`

```ts
interface TreeItem extends ListItem { children?: TreeItem[]; open?: boolean }
interface TreeviewProps extends ComponentProps { /* items, renderer... */ }
class Treeview extends Component {
  setItems(items: TreeItem[]): void
  getSelection(): ListboxID
  selectItem(id): void
  clearSelection(): void
  navigate(sens: kbNav): boolean            // see kbTreeNav enum
}
```

### `Spreadsheet` — editable grid backed by a `Store`

```ts
interface SpreadsheetProps extends ComponentProps {
  store: Store                              // required
  columns: SpreadsheetColumn[]              // required
  footer?: boolean
  rowClassifier?: RowClassifier
  click?, dblClick?, contextMenu?, selectionChange?
}
class Spreadsheet extends Component {
  getSelection(): /* cell */; navigate(sens: kbNav): boolean; lock(lock): void
}

// Store: in-memory cell store (extends CoreElement)
class Store extends CoreElement {
  setData(row, col, data): void;  getData(row, col): any;  hasData(row, col?): boolean
  removeRow(row_num): void;  getRowCount(): number;  setMaxRowCount(rows): void
  clear(): void;  lock(): void;  unlock(): void
}
```

### `PropertyGrid`

```ts
interface PropertyProps extends ComponentProps { groups: PropertyGroup[] }
class PropertyGrid extends VBox {
  setItems(groups: PropertyGroup[]): void
  setPropValue(name: string, value): void
}
```

---

## Menus / button groups / tabs

### `Menu`

```ts
interface MenuItem {
  text: string | UnsafeHtml
  cls?: string; icon?: string; menu?: Menu; disabled?: boolean
  click?: DOMEventHandler
}
type MenuElement = MenuItem | Component | string    // string "-" = title/separator
interface MenuProps extends Omit<PopupProps,"content"> { items: MenuElement[] }
class Menu extends Popup {}                          // displayAt/displayNear/displayCenter/close
```

### `BtnGroup`

```ts
type BtnGroupItem = predefined | Button | Label | Input
// predefined strings: "ok","cancel","yes","no","retry","abort" + options after a dot:
//   "ok.outline.default.disabled" ; "-"/">>" = Flex spacer ; "~" = Space 1em
interface BtnGroupProps extends Omit<ComponentProps,"content"> {
  items: BtnGroupItem[]
  align?: "left"|"center"|"right"; vertical?: boolean; reverse?: boolean
  btnclick?: EventCallback<EvBtnClick>
}
class BtnGroup extends Box {
  setButtons(btns: BtnGroupItem[]): void
  getButton(id: string): Button
}
```

### `Button`

```ts
interface ButtonProps extends ComponentProps {
  label?: string | UnsafeHtml
  icon?: string
  tabindex?: number | boolean
  autorepeat?: number | boolean            // true=200ms; number=interval (first fire after 500ms)
  click?: EventCallback<EvClick>
}
class Button extends Component {
  click(): void                            // simulate a click
  setText(text: string|UnsafeHtml): void
  setIcon(icon: string): void
}
```

### `Tabs`

```ts
interface TabItem { name: string; title: string; content: Component | (() => Component); icon?: string; cls?: string }
interface TabsProps extends Omit<ComponentProps,"content"> { default: string; items: TabItem[]; vertical?: boolean }
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

## Popup / Dialog

### `Popup`

```ts
interface PopupProps extends ComponentProps {
  autoClose?: boolean | string             // true, or a group name
  sizable?: boolean; movable?: boolean
}
class Popup extends Box {
  displayAt(x: number, y: number): void
  displayNear(rc: Rect, dst?: string, src?: string, offset?: {x,y}): void
  displayCenter(center?: boolean): void
  close(): void
  dismiss(after?: boolean): void
  isOpen(): boolean
  // show()/hide() inherited from Component; show() routes to displayCenter()
}
```

### `Dialog`

```ts
interface DialogProps extends PopupProps {
  title: string                            // required
  buttons: BtnGroupItem[]                  // required
  icon?: string; form?: Form
  closable?: boolean | string; modal?: boolean
  btnclick?: EventCallback<EvBtnClick>
}
class Dialog extends Popup {
  getForm(): Form
  getValues(): FormValues
  validate(): FormValues
  getButton(name: string): Button
  getBtnBar(): BtnGroup
  setTitle(title: string): void
  showAsync(): Promise<string>             // resolves with the clicked button name
}
```

### `MessageBox` / `InputBox` / `PromptBox` / `ProgressionBox`

```ts
class MessageBox extends Dialog {
  static showAsync(msg: string|UnsafeHtml, buttons?: BtnGroupItem[], title?: string,
                   icon_type?: "error"|"question"): Promise<string>
}
class InputBox extends Dialog {
  getValue(): string
  // static showAsync(msg, value, title?, options?: {password?, trim?}): Promise<string>  (null if cancelled)
}
class PromptBox extends Dialog {
  static showAsync(msg: string|UnsafeHtml, editor: Component, title?: string): Promise<string>
}
class ProgressionBox extends Dialog {
  constructor(title: string)
  addText(text: string|UnsafeHtml, perc: number): void
  addError(text: string|UnsafeHtml, perc: number): void
  clear(): void
  done(): void                             // hide after 5s if no error, else show OK button
}
```

### `Notification`

```ts
class Notification extends Popup { display(time_in_s?: number): void }
```

---

## Forms

```ts
type FormValues = Record<string, any>
interface FormProps extends BoxProps { autoComplete?: boolean }
class Form extends Box {
  setValues(values: FormValues): void
  getValues<T extends FormValues>(): T
  setAutoComplete(on?: boolean): void
  setValidator(validator: (values: FormValues, is_valid: boolean) => boolean): void
  validate(): FormValues                   // null if invalid
}
// Collects all children (recursive) that have a "name" attribute and implement queryInterface("form-element").
```

---

## Sizers / viewport / misc

```ts
class CSizer extends Component             // base splitter
class HSizer extends CSizer                // horizontal splitter
class VSizer extends CSizer                // vertical splitter
class ScrollView extends Component { getViewport(): Component }
class Viewport extends Component
class Canvas extends Component { getContext(): CanvasRenderingContext2D; paint(): void }
class Video extends Box {
  play(); pause(); mute(set: boolean)
  get player(): HTMLVideoElement; get duration(): number; get paused(): boolean
  get volume(): number; get videoWidth(): number; get videoHeight(): number
  set stream(stream: MediaStream)
}
class Calendar extends VBox { getDate(): Date; setDate(date: Date): void }
class ColorPicker extends VBox             // queryInterface("form-element")
class Panel extends VBox { setTitle(title: string): void }
class Breadcrumbs extends HBox { setItems(elements): void }
class Keyboard extends HBox                // virtual keyboard
class TickLine extends Component
class Header extends HBox                  // resizable column header; updates target style "--{name}-width"
```

---

## Data module (`core_data`)

### `DataModel`

```ts
namespace data {                           // field decorators
  id(): FieldDecorator
  string(props?: MetaData); int(props?); float(props?); bool(props?); date(props?)
  calc(props?: MetaData)                   // computed field (getter)
  array(ctor: ModelConstructor, props?: MetaData)
  any(props?: MetaData)
  field(data: MetaData)                    // generic
}
type FieldType = "string"|"int"|"float"|"date"|"bool"|"array"|"object"|"any"|"calc"
interface MetaData { type?: FieldType; required?: boolean; prec?: number; calc?: (rec)=>any; model?: DataModel }
interface FieldInfo extends MetaData { name: string }
type DataRecord<T> = Partial<T> & object
type DataRecordID = any

class DataModel<T = any> {
  getFields(): FieldInfo[]
  getFieldIndex(name: string): number
  getID(rec: DataRecord): any
  getRaw(name: string|number, rec: DataRecord): any
  getField(name: string, rec: DataRecord): string
  serialize<T>(input: DataRecord): T
  unSerialize(data: any, id?: DataRecordID): DataRecord<T>
  validate(record: DataRecord): Error[]
  addField(...fields: FieldInfo[]): void
}
```

### `DataStore<T>` (extends EventSource)

```ts
interface DataStoreProps { model: DataModel; data?: any[]; url?: string; autoload?: false; solver?: (data:any)=>DataRecord[] }
// Event "data_change" → { change_type: 'create'|'update'|'delete'|'data'|'change', id? }
class DataStore<T> extends EventSource {
  setData(records: any[]): void; setRawData(records: DataRecord[]): void
  append(rec); appendRaw(rec); update(rec): boolean; delete(id): boolean
  getById(id): DataRecord<T>; getByIndex(index): DataRecord<T>; indexOfId(id): number  // binary search
  get count(): number; get fields(): FieldInfo[]
  forEach(cb); find(cb): DataRecord; getMaxId(): number
  load(url?): Promise<void>; reload(): Promise<any>; export(): DataRecord<T>[]
  createIndex(filter): DataIndex; createView(opts?): DataView; moveTo(other): void
  changed(): void; getModel(): DataModel<T>
}
```

### `DataView` (extends CoreElement)

```ts
interface FilterInfo {
  op: "<"|">"|"<="|"="|">="|"<>"|"empty-result"|FilterFunc
  field?: string; value?: string|RegExp; caseSensitive?: boolean
}
interface SortProp { field: string; ascending: boolean; numeric?: boolean; callback?: SortCallback }
// Event "view_change" → { change_type: "change"|"filter"|"sort" }
class DataView extends CoreElement {
  filter(filter?: FilterInfo): number      // returns count of filtered items
  sort(props: SortProp[]): void
  getCount(): number
  getById(id): DataRecord; getByIndex(index): DataRecord; getIdByIndex(index): any
  getRecId(rec): any; indexOfId(id): number
  getStore(): DataStore; getModel(): DataModel
  forEach(cb): void; changed(): void
}
```

### `DataProxy` (extends CoreElement)

```ts
interface DataProxyProps { url: string; params?: string[]; solver?: DataSolver }
class DataProxy extends CoreElement { load(url?): Promise<void> }   // Event "change" → { value: DataRecord[] }
```

---

## Router (`core_router`, extends EventSource)

```ts
class Router extends EventSource {
  constructor(useHash?: boolean)           // default true (# URLs)
  get(uri: string|RegExp, handler: (params: any, path: string) => void): void
  init(): void                             // trigger the current route
  navigate(uri: string, notify?: boolean, replace?: boolean): boolean
  // Events: "change" → { value: string } ; "error" → { code: 404, message: string }
}
parseRoute(str: string|RegExp, loose?: boolean): Segment
```

---

## i18n (`core_i18n`)

Two built-in languages (`fr` default, and `en`).

```ts
export let _tr                             // current translation object (proxy)
createLanguage(name: string, base: string): void
addTranslation(name: string, ...parts: any[]): void
selectLanguage(name: string): typeof _tr
getCurrentLanguage(): string
getAvailableLanguages(): string[]
isLanguage(name: string): boolean

// _tr.global keys: ok cancel yes no abort retry ignore error today open new delete close save
//   search search_tip required_field invalid_format invalid_email invalid_number invalid_date
//   empty_list err_403 property value copy cut paste filedrop
//   diff_date_seconds/minutes/hours, date_input_formats, date_format, date_time_format,
//   day_short[] day_long[] month_short[] month_long[], keyboard.{next,numeric,alpha}
```

---

## Utilities (`core_tools`)

```ts
class UnsafeHtml extends String            // raw, unescaped HTML marker
unsafeHtml(x: string): UnsafeHtml
unsafe(strings, ...values): UnsafeHtml     // template tag: unsafe`<b>${x}</b>`
sanitizeHtml(input: string): string        // escape &<>"' for safe text insertion
safeText(v: string | UnsafeHtml): string   // UnsafeHtml passes through; plain string is escaped

class Rect {
  left; top; width; height; get right(): number; get bottom(): number
  // new Rect() | new Rect(l,t,w,h) | new Rect(otherRect)
  contains(pt): boolean; touches(rc): boolean
  normalize(): this; inflate(dx, dy?): Rect; scale(scale): Rect
}
interface Point { x: number; y: number }
interface Size { w: number; h: number }
interface IRect { left; top; height; width: number }

class Timer { setTimeout; clearTimeout; setInterval; clearInterval; clearAllTimeouts }

class Color {
  // new Color(value) | new Color(r,g,b,a?)
  setValue(value): this; setRgb(r,g,b,a): this; setHsv(h,s,v,a?): this; setAlpha(a): this
  getAlpha(): number; lighten(percent): this; isInvalid(): boolean
  toHexString(): string; toRgbString(withAlpha?): string; toNumber(): number
  toRgb(): Rgb; toHsv(): Hsv
}

enum kbNav { first, prev, pgdn, pgup, next, last, left, right }
enum kbTreeNav { first, prev, next, last, parent, child, expand, collapse, toggle }

// Type guards
isString(v): v is string; isNumber(v): v is number; isArray(v): v is any[]
isFunction(v): v is Function; isDate(v): v is Date; isPlainObject(v): v is Record<string,any>

// Geometry / strings
centerRect(inner: IRect, outer: IRect, margin?): IRect
sprintf(format, ...args): string           // replaces {0} {1}...
pad(what, size, ch?): string               // >0 padEnd, <0 padStart
pascalCase(s): string; camelCase(s): string; clamp<T>(v, min, max): T
measureText(str, size): number

// Dates
date_format(date, options?): string
date_diff(date1, date2, options?): string
date_to_sql(date, withHours): string; date_sql_utc(date): Date
date_hash(date): number; date_clone(date): Date; date_calc_weeknum(date): number
parseIntlDate(value, fmts?): Date; formatIntlDate(date, fmt?, utc?): string
calcAge(birth, ref?): number

// DOM / system
asap(cb): number                            // requestAnimationFrame
oneshot(cb, ms?): number                    // setTimeout
addEvent(node, name, handler, prepend?): void
dispatchEvent(ev): void
getFocusableElements(root): Element[]
getScrollbarSize(): number; getGlobalZoom(): number
getSystemMetrics(part: "scrollbar"|"zoom"): number
setWaitCursor(wait: boolean): void; beep(): void
isUnitLess(name): boolean; isFeatureAvailable(name: "eyedropper"): boolean

// Class decorator
class_ns(ns: string): ClassDecorator
const x4_class_ns_sym: symbol
const unitless                              // set of unitless CSS props

// System interfaces
interface IFormElement { getRawValue(): any; setRawValue(v): void; isValid(): boolean }
interface ITabHandler  { focusNext(next: boolean): boolean }
interface ITipHandler  { getTip(): string }

// Other variables
const dragManager; const svgLoader; const linearColorStops; const simpleColorStop
const unbubbleEvents       // set of DOM event names that do NOT bubble through the x4 tree
const makeUniqueComponentId  // () => string, "x4-<n>" (exported as a value)
```

### `formatIntlDate` specifiers

```
d day (no zero)    D day (2 digits)     j short day (mon)   J long day (monday)
w week number      W week (2 digits)    m month (no zero)   M month (2 digits)
o short month      O long month         y/Y year            h 24h hour
H hour (2 digits)  i minutes            I minutes (2 dig)   s seconds
S seconds (2 dig)  a am/pm              l ms                L ms (3 digits)
{free text}        any other char inserted as-is
```

---

## SVG (`core_svg`)

```ts
class SvgComponent extends Component { addItems(...) }   // <svg> container
interface SvgProps extends ComponentProps { viewbox?: string; svg?: SvgBuilder }
class SvgBuilder extends SvgGroup {
  // shapes: rect, circle, ellipse, path, text, icon, group
  // transforms: translate, rotate, scale, transform, add_translation, add_rotation, add_scale
  // style: fill, no_fill, stroke, strokeWidth, strokeCap, strokeOpacity, setStyle, addClass, clip, addClip
  // gradients: linear_gradient, addPattern
}
// Items: SvgGroup, SvgPath (moveTo/lineTo/curveTo/arc/closePath), SvgText (font/fontSize/textAlign),
//        SvgShape, SvgIcon, SvgGradient (addStop)
```

---

## PDF (`core_pdf`)

```ts
class X4PDFBuilder {
  page(width: number, height: number, callback): void
  build(): Uint8Array
}
```

---

## Code editor (`MonacoEditor`)

Monaco-based code editor component. Monaco is part of the framework surface, so exclude it from `tsc` compilation (see Default project notes).

```ts
interface MonacoEditorProps extends ComponentProps {
  language: "typescript" | "javascript" | "json" | "css" | "html"
  theme?: string
  content?: string
  options?: Monaco.editor.IEditorOptions & Monaco.editor.IGlobalEditorOptions
}
class MonacoEditor extends Component<MonacoEditorProps> {
  constructor(props: MonacoEditorProps)
  static start(): Promise<void>                       // load/initialize Monaco
  static addTypelib(name: string, code: string): void // register a .d.ts for IntelliSense
  static basePath: string
  static monaco: typeof Monaco
}
```

---

## JSX factory & helpers

```ts
class x4_react {
  static create_element(tag: string, props: any, ...content: any[]): Component   // JSX pragma
}
class CMover {
  constructor(x: Component, ref?: Component)           // pointer-driven move helper
}
createPainter(c2d: CanvasRenderingContext2D, w: number, h: number): CanvasEx   // Canvas painter
initTooltips(): void                                   // initialize the global tooltip system
```

---

## State (`core_state`) — Experimental

```ts
class StateManager {
  constructor(initialState)
  getState(path: string, defaultValue?): any
  setState(path: string, value, context?): void
}
// NOTE: marked @Experimental in the sources.
```

---

## Common patterns

### Minimal custom component

```ts
import { Component, ComponentProps, ComponentEvents, EvClick } from 'x4js'

interface MyProps extends ComponentProps { label: string; click?: (ev: EvClick) => void }
interface MyEvents extends ComponentEvents { click: EvClick }

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
    super({ })   // do NOT specify mountPoint: the app mounts directly into <body>
    this.setMainView(new Component({ content: 'Hello x4js' }))
  }
}
new App()
// Access from anywhere: Application.instance()
```

### Async Dialog

```ts
const btn = await MessageBox.showAsync('Confirm?', ['ok.outline.default', 'cancel.outline'])
if (btn === 'ok') { /* ... */ }

const dlg = new Dialog({
  title: 'My dialog',
  modal: true,
  movable: true,
  form: new Form({ content: [ new TextEdit({ label: 'Name', name: 'name', value: '' }) ] }),
  buttons: ['ok.outline.default', 'cancel.outline'],
})
if (await dlg.showAsync() === 'ok') {
  const values = dlg.getValues()   // { name: "..." }
}
```

### DataStore + DataView + Gridview

```ts
import { DataModel, DataStore, Gridview, data } from 'x4js'

class PersonModel extends DataModel {
  @data.id()    id: number
  @data.string() name: string
  @data.int()   age: number
}

const store = new DataStore({ model: new PersonModel(), data: [...] })
const grid  = new Gridview({
  store,
  columns: [ { id: 'name', title: 'Name', width: 200 }, { id: 'age', title: 'Age', width: 80 } ],
})

/* not needed because grid will reflect data changes
const view = store.createView({ filter: { op: '>=', field: 'age', value: '18' } })
view.on('view_change', () => {  })
*/
```

### Router

```ts
import { Router } from 'x4js'

const router = new Router(true)              // hash mode
router.get('/home',       () => showHome())
router.get('/detail/:id', (p) => showDetail(p.id))
router.on('error',        () => router.navigate('/home'))
router.init()
```

### Timers in a component

```ts
class Poller extends Component {
  constructor(props) { super(props); this.setInterval('poll', 5000, () => this.refresh()) }
  refresh() { /* ... */ }
  // stop: this.clearInterval('poll') or this.clearTimeouts()
}
```

---

## Default project

When creating a new x4js project, use these files as a base.

### `package.json`

```json
{
	"name": "min demo",
	"version": "1.0",
	"scripts": {
		"build-debug": "x4build --watch --hmr --serve --ip=0.0.0.0:8080",
		"build-release": "x4build --release"
	},
	"devDependencies": {
		"x4build": "latest"
	},
	"dependencies": {
		"@fontsource/montserrat": "^5.1.0",
		"@types/node": "^25.9.1",
		"x4js": "latest"
	},
	"x4build": {
		"outdir": "./bin",
		"entryPoints": [
			"src/main.ts"
		],
		"copy": [
			{
				"from": "./src/assets",
				"to": "assets"
			},
			{
				"from": "./src/index.html",
				"to": "index.html"
			}
		]
	}
}
```

### `tsconfig.json`

```jsonc
{
	"compilerOptions": {
		"target": "ES2022",
		"lib": ["DOM", "ES2022",],
		"module": "es2022",
		"strict": true, 
		"strictNullChecks": false,
		"moduleResolution": "bundler",
		"experimentalDecorators": true,
		"paths": {
		}
	},
	"include": [ "src/**/*" ],
	"exclude": [ "node_modules", "bin", "**/monaco-editor/**" ]
}
```

### `src/index.html`

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf8">
		<link rel="stylesheet" href="main.css"></style>
		<script src="main.js"></script>
	</head>
</html>
```

### `src/main.scss`

```scss
```

---

## Important stupid notes for IA

- as possible, never use DOM function directly, search in x4, it's probably done.

- `Component` stores its instance on its DOM node. Use `componentFromDOM(el)` to retrieve a component from an `HTMLElement`.
- Numbers passed to `setStyle`/`setStyleValue` are auto-suffixed with `"px"` except for unitless properties (see the `unitless` set: `zIndex`, `opacity`, `flexGrow`...).
- `show(false)` / `hide()` toggle the `"x4hidden"` CSS class, not `display:none`.
- `enable(false)` / `disable()` propagate the `disabled` state to child `<input>` and `<button>` elements.
- `Application` is a strict singleton — one instance per page (an assertion fails otherwise).
- `Popup.show()` routes to `displayCenter()`. To position, call `displayAt()` or `displayNear()` instead.
- `BtnGroup` accepts predefined strings (`"ok"`, `"cancel"`...) with options after a dot: `"ok.outline.default.disabled"`.
- `Form.getValues()` collects all recursive children with a `name` attribute implementing `queryInterface("form-element")`.
- The default language is `fr`. Call `selectLanguage('en')` to switch to English.
- `Gridview` is backed by a `DataStore`; `Spreadsheet` is backed by a `Store` (different, cell-based).
- `DataRecordID` is currently typed `any`; `strictNullChecks` is intentionally off in the recommended `tsconfig.json`.
- `StateManager` (`core_state`) is marked **Experimental** — verify before relying on it.
- `MonacoEditor` requires `MonacoEditor.start()` (async) before use; register extra typings with `MonacoEditor.addTypelib(name, code)`.
- `x4_react.create_element` is the JSX pragma; 
- `unbubbleEvents` is the set of DOM events that do not bubble through the x4 component tree.