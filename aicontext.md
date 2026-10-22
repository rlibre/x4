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
**Quick start**: `npx x4js create demo` (list the templates with `npx x4js templates`)
**Claude Code plugin**: `claude plugin marketplace add rlibre/x4` then `claude plugin install x4js@rlibre` (skill that reads these files from the project)

---

## Class hierarchy

```
CoreElement<E>                 named timers + event surface (no DOM)
  ├── Component<P,E>           base DOM component
  │     ├── Box<P,E>
  │     │     ├── HBox / VBox → HSplitBox / VSplitBox
  │     │     ├── StackBox → AssistBox
  │     │     ├── GridBox / MasonryBox
  │     │     ├── Form
  │     │     ├── Popup → Dialog → MessageBox / InputBox / PromptBox / ProgressionBox
  │     │     │        → Menu, DropdownList, Notification
  │     │     ├── BtnGroup, Tabs, Video, Saturation
  │     ├── Button, Input, Icon, Label, SimpleText, Checkbox, Radio, Link, SimpleTextArea
  │     ├── Listbox, Gridview, Treeview, Select, Combobox, Slider, Gauge
  │     ├── Progress, TickLine, Canvas, Image, Spreadsheet, MonacoEditor
  │     ├── SvgComponent → Chart
  │     ├── CSizer → HSizer / VSizer
  │     ├── FileDialog, ScrollView, Viewport, DockingView, Flex, Space
  │     ├── HBox-based: ColorInput, Rating, Switch, Tag, Keyboard, TextEdit → AutoComplete, Breadcrumbs
  │     └── VBox-based: Calendar, ColorPicker, FileDrop, Panel, PropertyGrid, TextArea, SettingsView, SettingItem
  └── Application<E>           singleton, no DOM of its own

EventSource<E>                 standalone event registry
  ├── DataStore<T>
  ├── Router
  └── StateManager<T>

CoreElement-based (non-DOM): DataProxy, DataView, Store
Standalone: Rect, Timer, Color, DataModel, Shortcuts, Stylesheet (deprecated: CSS variables), ComputedStyle,
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
- A listener that throws: `fire()` sends its error to `console.error`, calls the next listeners, and returns
  normally; the one that fires never gets the error of a listener. (An `async` listener rejects its own promise.)

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
  style?: StyleProps                                 // numbers get "px" except unitless
  attrs?: Record<string, string | number | boolean>
  content?: ComponentContent
  dom_events?: GlobalDOMEvents
  width?: string | number
  height?: string | number
  flex?: number | boolean                            // true → "x4flex"; number → flex-grow
  disabled?: boolean
  hidden?: boolean
  tooltip?: string                                   // shown as html: escape a text from a user (see initTooltips)
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
setStyle(style: StyleProps): this  // numbers auto-suffixed "px" except unitless
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
static parentElement<T>(dom: Node, cls?: Constructor<T>): T   // starts at the parent of dom, not at dom:
                                                               // test componentFromDOM(dom) first for the component of dom itself
```

### Visibility / state / focus / geometry

```ts
show(vis?: boolean): this              // toggles "x4hidden" class (not display:none)
hide(): this
enable(ena?: boolean): this            // sets or removes "disabled" and "inert" on the component
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
addShortcut(keys: string | string[], callback: (ev: KeyboardEvent) => void, options?: ShortcutOptions): this   // see Shortcuts
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
class Flex extends Component    // new Flex(), no argument; CSS "x4flex"
class Space extends Component   // new Space(width?: number|string, cls?: string)
```

---

## `Application<E extends ApplicationEvents>`

Singleton. Extends `CoreElement` (no DOM of its own). (`src/core/core_application.ts`)

```ts
interface AppProps { mountPoint?: string }   // CSS selector, default "body"

constructor(props?: AppProps)                // auto-mounts the mainview on page load
setMainView(view: Component): void           // once, in the constructor of the app: each call sets up the keyboard (Tab, shortcuts) again
getMainView(): Component
static instance<P extends Application>(): P
setEnv(name: string, value: any): void
getEnv(name: string, def_value?: any): any
static fireGlobal(msg: string, params?: any): void
static setTheme(name: string): void         // the class x4theme-<name> on <html>: "" the light theme (default, no class),
                                            // "dark" the dark theme of x4, another name a theme of the application
static getTheme(): string                   // "" for the light theme, "dark", or the name given to setTheme
static setLocale(locale: string, currency?: string): void   // forces the locale of the formats (formatNumber, formatMoney,
                                            // formatDate, formatDateTime) over the one of the language; null: the language's
                                            // again. currency: "EUR" by default, kept when not given
static getLocale(): string                  // the forced one, else _tr.global.locale ("fr-FR" for fr, "en-US" for en)
static getCurrency(): string
focusNext(next: boolean): boolean
addShortcut(keys: string | string[], callback: (ev: KeyboardEvent) => void, options?: ShortcutOptions): void   // see Shortcuts
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

A Box is a `<div>` (another element with `tag`). Disabled (`disable()`, the prop `disabled`), its content is inert
(no click, no focus, no input) and faded by `--box-disabled-opacity` (0.5); a disabled Box in it is not faded twice.

### `Box.refs` — typed directory of the children to reach again later

Only a `Box` has `refs`: a class derived from `Component` (not from `Box`) has none, and `this.refs.x = ...` there
compiles with a `declare refs` but throws a `TypeError` at run time.

`Box` owns a `protected refs: Record<string, Component>`. Declare its shape in the subclass, then assign each child
to `refs` while building the content: the assignment evaluates to the component, so it is written inline in the
content array. Do not keep such children in separate private fields, and do not use `refs.x` for a child that was
not assigned.

```ts
class Panel extends VBox {
  declare protected refs: { title: Label; save: Button }

  constructor(props: BoxProps) {
    super(props)
    this.setContent([
      this.refs.title = new Label({ text: "" }),
      this.refs.save = new Button({ label: "Save", click: () => this.save() }),
    ])
  }

  setTitle(text: string) { this.refs.title.setText(text) }
}
```

In JSX, the same directory is filled with `ref={[owner, "name"]}` (the owner must be a `Box`).

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

## `DockingView` — panels the user arranges by dragging their title

Not a `Box`. Two kinds of panels, which never mix: **tools**, docked in a band on the left or on the right
(one above the other, side by side, or as tabs) and which can float; **contents**, what is worked on
(as the editors of an IDE), which share the room between the bands, split or as tabs.

```ts
interface DockPanel {
  id: string
  title?: string                           // shown in its tab; the id when missing
  content: Component
  kind?: 'tool' | 'content'                // default 'tool'
  closable?: boolean                       // for this panel, instead of the view's
  floating?: boolean                       // idem; a content never floats
  sides?: DockSide[]                       // a tool: the bands it may be docked in, instead of the view's
}
interface DockingViewProps extends ComponentProps {
  panels: DockPanel[]
  layout: DockLayout                       // where the panels are at first
  floating?: boolean                       // tools can float above the rest
  closable?: boolean                       // tools have a button that hides them
  sides?: DockSide[]                       // the bands tools may be docked in; left and right when missing
  persist?: string                         // a name: the layout is remembered under it (application storage)
  layoutChange?: EventCallback<ComponentEvent>
}
class DockingView extends Component {
  getState(): DockLayout                   // plain data, to save
  setState(layout: unknown): void          // a saved layout; what it lacks comes from props.layout
  resetLayout(): void                      // back to props.layout
  showPanel(id: string, show?: boolean): void
  isPanelVisible(id: string): boolean
}

interface DockLayout {
  left: DockBand; right: DockBand          // the tools, on the sides
  top?: DockBand; bottom?: DockBand        // the tools above and under the contents, between left and right
  content: DockNode                        // the contents; null when there is none
  floats: DockFloat[]                      // floating tools: { panel, x, y, w, h }
  hidden: string[]                         // ids of the closed panels
}
interface DockBand { size: number; root: DockNode }            // size: width in px (height for top/bottom); root: null when empty
type DockSide = 'left' | 'right' | 'top' | 'bottom'
type DockNode  = DockStack | DockSplit
interface DockStack { type: 'stack'; size: number; panels: string[]; active: string }    // one tab per panel
interface DockSplit { type: 'split'; dir: 'row' | 'column'; size: number; children: DockNode[] }
// size of a node: its share of its split (0 = an equal share)
```

```ts
const view = new DockingView({
  flex: true,
  floating: true,
  closable: true,
  persist: 'myapp.layout',
  panels: [
    { id: 'tools', title: 'Tools', content: tools },
    { id: 'props', title: 'Properties', content: props },
    { id: 'page', kind: 'content', content: editor },
  ],
  layout: {
    left:  { size: 180, root: { type: 'stack', size: 0, panels: ['tools'], active: 'tools' } },
    right: { size: 260, root: { type: 'stack', size: 0, panels: ['props'], active: 'props' } },
    content: { type: 'stack', size: 0, panels: ['page'], active: 'page' },
    floats: [],
    hidden: [],
  },
})
```

- A closed panel is hidden, not removed: `showPanel(id)` brings it back where it was. Offer it in a menu.
- Tools only go in the bands or in `floats`; contents only in `content`. A panel missing from the layout is added where its kind goes.
- A tool goes in `left` or `right` only, unless `sides` says otherwise (on the view, or on one panel): `sides: ['bottom']` for what is wide and low (a log, a list of results). It is never offered a place in a band it may not be in.
- A content alone has no title bar; with several contents, each stack has tabs.
- What a panel shows is built once (`content`) and moved as the layout changes: never rebuild it.
- CSS variables: `--dock-line`, `--dock-accent`, `--dock-title-background`, `--dock-title-background-hover`, `--dock-title-color`, `--dock-title-color-active`, `--dock-float-background`, `--dock-float-shadow`.

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
  click?: EventCallback<EvClick>           // ev.context = href; the link is followed unless ev.preventDefault()
  // content: the link is its content (no label: text, icon, align are not used)
}
interface LinkEvents extends ComponentEvents { click: EvClick }
class Link extends Component { setText(text: string|UnsafeHtml): void }   // the text of its label: the icon stays
```

### `Icon`

```ts
interface IconProps extends ComponentProps { iconId?: string }
class Icon extends Component { setIcon(iconId: string): void }
// iconId resolution: "var:name" or "var:--name" → the variable --name set on <html> by the code
//     (document.documentElement.style.setProperty("--name", svg); not one of a stylesheet) | "data:image/svg+xml,<svg..." → inline
//   | "<svg..." → raw inline | "*.svg" → async load + cache | else → <img src>
export const svgLoader: SvgLoader          // shared SVG cache: load(url): Promise<string>; a file not found rejects, and is not asked again
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

### `Tag` — a short text in a rounded frame, with an icon

```ts
interface TagProps extends ComponentProps {
  label?: string | UnsafeHtml              // the text: `label`, not `text` as in Label
  icon?: string
}
class Tag extends HBox {}                  // no method: its text and its icon are those of its props
// cls "alert": the colors of an alert
// CSS vars: --tag-background --tag-color --tag-icon-color --tag-border
```

```ts
new Tag({ label: 'Draft' })
new Tag({ label: 'Late', icon: 'assets/clock.svg', cls: 'alert' })
```

### `Progress`

```ts
interface ProgressProps extends ComponentProps { value: number; min?: number /* 0 */; max?: number /* 100 */ }
// the bar is where value is between min (0%) and max (100%)
class Progress extends Component { setValue(value: number): void }
```

### `Gauge`

```ts
interface GaugeProps extends ComponentProps { min?: number /* 0 */; max?: number /* 100 */; colors?: string[] }
class Gauge extends Component {
  setRange(min: number, max: number): void
  setPos(pos: number): void
  setColorStops(colors: string[]): void
}
```

### `Rating`

```ts
interface RatingProps extends ComponentProps {
  value?: number; steps?: number; icon?: string; name?: string   // value: the count of stars lit (0 to steps), the star of the value clicked again gives 0; steps: 5 by default; name: for a Form, which reads a number
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
  autofocus?: boolean; required?: boolean; readonly?: boolean; placeholder?: string   // required, readonly: not on checkbox, radio; placeholder: text, email, password, number
  focus?: EventCallback<EvFocus>; change?: EventCallback<EvChange>
}
// TextInputProps: type?: "text"|"email"|"password"; value?: string|number; maxlength?, minlength?,
//                 pattern?, spellcheck?, trim?
// NumberProps:    type: "number"; value?: string|number; min?, max?, step?   // as many decimals shown as the step, 4 at most
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
// style, tooltip, hidden, flex, stretch, height: on the box (label + field); dom_events: on the input
class TextEdit extends HBox {
  getValue(): string; setValue(value: string): void; getInput(): Input
}
```

### `TextArea`, `SimpleTextArea` — native `<textarea>`, with or without a label

```ts
interface SimpleTextAreaProps extends BaseProps {   // BaseProps: see Input (name, readonly, required, placeholder, autofocus, focus, change)
  value?: string
  resize?: boolean | "none" | "vertical" | "horizontal" | "both"   // no handle by default; true = "both", false = "none"
  trim?: boolean                           // getText() trims, unless false
}
interface TextAreaProps extends SimpleTextAreaProps { label?: string }

class SimpleTextArea extends Component {    // the <textarea> alone; never smaller than one character (min-height/min-width, padding included)
  getText(): string; setText(text: string): void
  scrollToBottom(): void
  isValid(): boolean                       // false when it is required and empty
}
class TextArea extends VBox {               // a Label above a SimpleTextArea; without a height, the textarea has its 2 rows (and the height the handle gives); with one, it fills it
  getText(): string; setText(text: string): void
  scrollToBottom(): void
  isValid(): boolean
}
```

```ts
new TextArea({ label: 'Comment', name: 'comment', placeholder: 'A few words...', resize: 'vertical' })   // in a form
new SimpleTextArea({ flex: 1, placeholder: 'Your message', resize: false })                              // no label
```

- `TextArea` in a form; `SimpleTextArea` where a label has no place (a message to type, a log).
- Both are form elements: with a `name`, `Form.getValues()` and `setValues()` read and write them.
- The value is read and written with `getText()` / `setText()`, not `getValue()` / `setValue()`.
- `change` is fired at each key that is typed, with the text as `ev.value`; `focus` when the focus comes and goes (`ev.focus_out`). As for an `Input`.
- `required`: an empty text is not valid. `Form.validate()` then returns `null`, or tells its validator that the form is not valid.
### `Checkbox`

```ts
interface CheckboxProps extends ComponentProps {
  label: string; checked?: boolean; value?: boolean|number|string; name?: string
  change?: EventCallback<EvChange>
}
// in a Form: without value (or a boolean one), a boolean; with one, the value when checked, null when not
class Checkbox extends Component {
  getCheck(): boolean; setCheck(ck: boolean): void
  setLabel(text: string): void; toggle(): void
  readonly _input: Input
}
```

### `Radio`

```ts
interface RadioProps extends ComponentProps {
  label: string; icon?: string
  name: string                             // required: the radios that have the same name are one group
  value: number | string                   // required
  checked?: boolean
  change?: EventCallback<EvChange>
}
class Radio extends Component {
  getValue(): string; setCheck(ck: boolean): void
  setLabel(text: string): void
  checkValue(vname: string): void          // check the radio whose value === vname, in the group of its form (else of the page)
}
```

### `Switch`

```ts
interface SwitchProps extends ComponentProps { label: string; checked?: boolean; value?: string; name?: string }
// with a name, a Form reads and writes it: a boolean, or with a value, the value when checked and null when not
class Switch extends HBox {}
```

### `Slider`

```ts
interface SliderProps extends ComponentProps {
  value: number; min: number; max: number  // required
  step?: number; vertical?: boolean
  name?: string                            // for a Form, which reads a number
  change?: EventCallback<EvChange>         // when the user moves the thumb (drag, arrows), not by the code
}
class Slider extends Component {
  getValue(): number
  setMin(min: number): void; setMax(max: number): void; setValue(v: number): void   // the value is kept between min and max, on the step
}
```

### `Select` — simple native select

```ts
interface SelectProps extends ComponentProps {
  items: ListItem[]                        // required
  value?: ListboxID                        // the id of the item that is selected
  multiple?: boolean; required?: boolean; name?: string
  change?: EventCallback<EvChange>; focus?: EventCallback<EvFocus>
}
class Select extends Component {
  getValue(): ListboxID; setValue(value: ListboxID): void
  getSelValues(): ListboxID[]; setSelValues(values: ListboxID[]): void   // multiple
  setItems(items: ListItem[]): void
}
```

### `Combobox` — input + dropdown list

```ts
interface ComboboxProps extends ComponentProps {
  items: ListItem[]                        // required
  value?: ListboxID                        // the id of the item that is selected
  label?: string; labelWidth?: number | string
  readonly?: boolean                       // true by default: the user picks, and cannot type. false to let him type
  renderer?: (item: ListItem) => Component // draws an item of the list (the field still shows item.text)
  required?: boolean; name?: string
  selectionChange?: EventCallback<EvSelectionChange>   // at each item reached with the arrows too
}
class Combobox extends Component {
  getValue(): string; setValue(value: string): void
  getInput(): Input
  getSelection(): ListboxID                // the item chosen (click or arrows); undefined when the text typed is not the one of an item
  selectItem(index: ListboxID): void       // null: none, the field is emptied
  setItems(items): void
  showDropDown(): void
}
```

### `AutoComplete` — text field with on-demand suggestions

```ts
interface AutoCompleteProps extends TextEditProps {   // label, labelWidth, required, placeholder, value...
  search: (ev: EvSearch) => void            // required; ev.text, ev.setItems(items) — may be called async
  change?                                   // EvAutoCompleteChange { value, item /* null = free text */ }
  strict?: boolean                          // only a picked item (or empty) is accepted; default false
  itemValue?: "text" | "id"                 // what goes into the field when an item is picked; default "text"
  delay?: number                            // ms before search, default 250
  minChars?: number                         // default 1; ↓ searches whatever the length (ev.text may be "")
  renderer?: (item: ListItem) => Component
}
class AutoComplete extends TextEdit {
  getSelection(): ListboxID                 // id of the picked item, undefined for a free text
  setSelection(item: ListItem): void;  showDropDown(): void
}
// Use Combobox for a fixed, known list; AutoComplete when suggestions come from a search (server).
// In a Form the value is the field content (text or id, per itemValue).
```

### `ColorInput`

```ts
interface ColorInputProps extends BoxProps {
  color: Color | string                    // null: no color shown
  name?: string
  format?: "rgb" | "hex"                   // text of the field, "rgb" by default; "rgba(...)" / "#rrggbbaa" when not opaque
  picker?: boolean                         // a click on the swatch opens a ColorPicker
  swatches?: (Color|string)[] | (() => (Color|string)[])   // a function is called each time the picker opens
  nullable?: boolean                       // "no color" can be chosen
  alpha?: boolean                          // false: colors kept opaque, no alpha slider in the picker (default true)
  placeholder?: string                     // text of the empty field
  change?: EventCallback<EvColorChange>    // user changes only, not setColor
}
// typing: the text is not rewritten while typed; on blur it is written from the color in the typed form (#... or rgb...)
class ColorInput extends HBox {            // queryInterface("form-element"): "#rrggbb" or null
  getColor(): Color; getValue(): string
  setColor(color: Color | string): void; setSwatches(swatches): void
}
interface EvColorChange extends EvChange { color: Color; value: string }  // "#rrggbb" or "#rrggbbaa"; both null for "no color"
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
  sub_cols?: (string | UnsafeHtml | Component)[]   // extra columns after text (9 at most, ref-c2...ref-c10, see Header);
                                           // a null value makes no cell. A Treeview draws them too
  iconId?: string; data?: any; cls?: string
  checked?: boolean                        // checkable: the starting state of the case (getChecked() gives the current one)
}
interface ListboxProps extends Omit<ComponentProps,"content"> {
  items?: ListItem[]
  renderer?: (item: ListItem) => Component
  title?: string; icon?: string
  header?: Header; footer?: Component
  checkable?: boolean                      // a case at the start of each line
  multisel?: true
  reselect?: boolean                       // a click on the item already selected fires selectionChange again
                                           // (lists linked together: the view shows what was clicked last)
  emptyMsg?: string                        // shown in place of the items while there are none
  dblClick?: EventCallback<EvDblClick>
  selectionChange?: EventCallback<EvSelectionChange>
  contextMenu?: EventCallback<EvContextMenu>
  checkChange?: EventCallback<EvCheckChange>   // EvCheckChange { id: ListboxID, checked: boolean }
}
// emptyMsg: without it the text is _tr.global.empty_list ("Empty list"). It is shown by setItems
//   (the constructor calls it) when there is no item. The listbox then has the class "empty".
// click: no prop; listbox.on( "click", ev => ... ), ev.context the id of the item. It is fired on the item
//   already selected too, which fires no selectionChange.
// checkable: renderItem puts the case (.x4check) first in the line, with a renderer of yours too;
//   a checked line has the class "checked". A click on the case, or Space for the last item
//   selected, changes it and fires checkChange: no click, no selection. A double click on the
//   case is ignored (its two clicks change it twice). setChecked fires nothing; updateItem keeps
//   the state of the case. With a header, the columns start after the case.
class Listbox extends Component {
  setItems(items: ListItem[], keepSel?: boolean): void   // one selectionChange at the end, with the selection it ends
                                           // with, when there was one before or there is one after (keepSel: the same ids too)
  appendItem(item: ListItem, prepend?: boolean, select?: boolean): void
  updateItem(id: any, item: ListItem): void
  getItem(id: ListboxID): ListItem
  select(ids: ListboxID | ListboxID[], notify?: boolean): void
  clearSelection(fireEvent?: boolean): void
  getSelection(): ListboxID[]
  getChecked(): ListboxID[]                // checkable: in the order of the list
  setChecked(ids: ListboxID[]): void       // these checked, the others not; no event
  filter(filter: string | RegExp): void
  navigate(sens: kbNav): boolean
  ensureSelectionVisible(): void
  renderItem(item: ListItem): Component     // override to customize
  defaultRenderer(item: ListItem): Component
}
```

### `Gridview` — data grid backed by a DataStore

```ts
interface GridviewProps extends ComponentProps {
  store: DataStore                          // required
  columns: GridColumn[]                     // required
  footer?: boolean; emptyMsg?: string
  multisel?: boolean                        // Ctrl+click adds or removes a row, Shift+click a range, Ctrl+A all
  sort?: { field_id: string; asc?: boolean }   // the first sort; ascending only when asc is true
  click?: EventCallback<EvClick>               // a click on a row; ev.context is its record
  dblClick?: EventCallback<EvDblClick>         // ev.context is the record of the row
  contextMenu?: EventCallback<EvContextMenu>
  selectionChange?: EventCallback<EvSelectionChange>
}
class Gridview extends Component {
  setStore(store: DataStore): void
  setColTitle(col_name: string, title: string): void
  sortCol(colId: any, ascending: boolean): void     // colId: the id of the column, not its index
  getView(): DataView
  getSelection(): DataRecord[]              // null when nothing is selected
  getFirstSel(): DataRecord                 // null when nothing is selected
  selectItem(id, ensureVisible?: boolean): void   // may be called before the grid is shown (then nothing is scrolled)
  clearSelection(): void
  selectAll(): void                         // multisel only; keeps the id of every record: costs memory on a very large view
  navigate(sens: kbNav): boolean
  lock(lock: boolean): void
}
// Selection: the selected records, not their rows. It survives a sort; a record that leaves the view (filter, delete) leaves it, with a selectionChange.
// getSelection(): every selected record, or null. selectionChange: ev.selection has them all.
// Column sizer: dragging it gives the column that width (it is not flex anymore); a double click on it makes the column flex again.
```

### `Treeview`

```ts
interface TreeItem extends ListItem { children?: TreeItem[]; open?: boolean }
interface TreeviewProps extends Omit<ComponentProps,"content"> {
  items: TreeItem[]                         // required
  footer?: Component
  emptyMsg?: string                        // shown in place of the items while there are none
  click?: EventCallback<EvClick>
  dblClick?: EventCallback<EvDblClick>
  selectionChange?: EventCallback<EvSelectionChange>
}
// emptyMsg: as for a Listbox. Without it the text is _tr.global.empty_list ("Empty list").
// There is no `renderer`: an item is drawn from its `text`, `iconId`, `cls` and `sub_cols`.
class Treeview extends Component {
  setItems(items: TreeItem[]): void
  getSelection(): ListboxID                 // one item, not an array
  selectItem(id: ListboxID): void
  clearSelection(): void
  navigate(sens: kbTreeNav): boolean        // first, prev, next, last, parent, child, expand, collapse, toggle
}
```

### `Spreadsheet` — editable grid backed by a `Store`

```ts
interface SpreadsheetProps extends ComponentProps {
  store: Store                              // required
  columns: SpreadsheetColumn[]              // required
  footer?: boolean
  rowClassifier?: RowClassifier
  enterMove?: "down" | "right" | "none"     // selection move after Enter in a cell editor (default "down")
  click?, dblClick?, contextMenu?, selectionChange?
  cellChange?                               // EvCellChange, fired before an edited value is written to the store
  cellKey?                                  // EvCellKey { key, row, col, uievent }, fired for each key before the default handling
}
interface SpreadsheetColumn {               // GridColumn +
  editable?: boolean | ((row, col) => boolean)       // inline edition (off by default), col = column index
  editor?: (row, col, value) => Component            // custom editor, must implement queryInterface("form-element")
}
interface EvCellChange { row; col /* index */; colId /* store key */; value /* writable */; oldValue }
class Spreadsheet extends Component {
  getSelection(): /* cell */; navigate(sens: kbNav): boolean; lock(lock): void
  editCell(row, col, clear = false): boolean         // cell must be visible
  stopEdit(commit = true): void;  isEditing(): boolean
}

// Column sizer: dragging it gives the column that width (it is not flex anymore); a double click on it makes the column flex again.
// Inline edition: F2 / Enter / double-click / typing starts, Enter / Tab / click elsewhere validates, Escape cancels,
// Delete clears, editable checkboxes toggle on double-click or Space (a single click only selects).
// Default editor is an Input matching the column type.
// cellKey: key hook (function keys...), not fired while a cell is edited; ev.preventDefault() skips the default handling.
// cellChange: ev.preventDefault() refuses the value, ev.value can be replaced.
// Select / Combobox in a cell (the store holds the id, use `formatter` to display the text):
//   { id: 2, title: "Status", width: 120, editable: true,
//     formatter: ( id ) => states.find( x => x.id===id )?.text,
//     editor: ( row, col, value ) => new Select( { items: states, value } ) }

// Store: in-memory cell store (extends CoreElement)
class Store extends CoreElement {
  setData(row, col, data): void;  getData(row, col): any;  hasData(row, col?): boolean
  removeRow(row_num): void;  getRowCount(): number;  setMaxRowCount(rows): void
  clear(): void;  lock(): void;  unlock(): void
}
```

### `Chart` — minimal svg chart (line, area, bar, pie, donut)

```ts
interface ChartProps extends SvgProps {
  type?: "line" | "area" | "bar" | "pie" | "donut"   // default "line"
  series: ChartSerie[]                      // required; pie & donut use the first serie
  labels?: string[]                         // default: 1, 2, 3...
  xaxis?: ChartAxis;  yaxis?: ChartAxis     // { name?, ticks?, min?, max?, step? }, all computed by default; on x: max = number of points, step = points between labels (>= 1), min not used
  legend?: boolean                          // default: shown when 2+ named series
  stacked?: boolean
  formatter?: (value: number) => string     // default: chartFormatUnit (1.5k, 2M...)
  click?                                    // EvChartClick { serie, index, value }
}
interface ChartSerie { name?; values: number[] /* undefined = hole */; color?; fill?; dots? }
class Chart extends SvgComponent {
  setType(type): void;  setSeries(series, labels?): void;  setLabels(labels): void
  setTicks(sens: "x" | "y", ticks: ChartTick[]): void
}
// Colors: CSS variables --chart-color-1..8 (or serie.color). Size it with width/height/flex like any component.
// Minimal by design: no dual axis, mixed types, time axis, zoom or animation — use a dedicated library for those.
```

### `PropertyGrid`

```ts
interface PropertyProps extends ComponentProps { groups: PropertyGroup[] }
class PropertyGrid extends VBox {
  setItems(groups: PropertyGroup[]): void
  setPropValue(name: string, value): void
}
// PropertyValue.type: 'boolean' | 'number' | 'string' | 'password' | 'options' | 'color' | 'label' | 'button'
// 'color': the editor is a ColorInput (hex, with picker); swatches?: string[] | (() => string[]), nullable?: boolean,
//          callback(name, value) receives "#rrggbb", or null for "no color"
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
  menu?: MenuElement[] | (() => MenuElement[])   // a click opens this Menu under the button, in place of the click event;
                                           // a function is called at each click; the button gets the class "with-menu"
}
// its <button> is type="button": in a <form>, Enter in a field does not click it. attrs: { type: "submit" } to submit
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
// A modal popup (a Dialog, a MessageBox...) keeps the element that had the focus when it opens and gives
// it back the focus when it closes, unless the focus was put elsewhere meanwhile.
```

### `Dialog`

```ts
interface DialogProps extends PopupProps {
  title: string                            // required
  buttons: BtnGroupItem[]                  // required
  icon?: string; form?: Form
  content?: ComponentContent                // without form: the content of its form
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
  show(): this                             // each time: the focus on its first field
  showAsync(): Promise<string>             // the name of the clicked button; null when closed without a button (Escape, close box)
}
// Keys: Escape closes it (or clicks `closable` when it is a button name). Enter clicks its default
//   button ("ok.default" in buttons), except in a textarea or an element contenteditable, where Enter is
//   a new line and Ctrl+Enter (Cmd+Enter) clicks it. Out of a dialog, Enter goes to the next field,
//   except in a textarea or a contenteditable.
```

### `MessageBox` / `InputBox` / `PromptBox` / `ProgressionBox`

```ts
class MessageBox extends Dialog {
  static showAsync(msg: string|UnsafeHtml, buttons?: BtnGroupItem[], title?: string,
                   icon_type?: "error"|"question"): Promise<string>
}
class InputBox extends Dialog {
  getValue(): string
  // static showAsync(msg, value, title?, options?: {password?, trim?}): Promise<string>  (null if cancelled or closed)
}
class PromptBox extends Dialog {
  static showAsync(msg: string|UnsafeHtml, editor: Component, title?: string): Promise<string>
}
class ProgressionBox extends Dialog {
  constructor(title: string)
  addText(text: string|UnsafeHtml, perc: number): void
  addError(text: string|UnsafeHtml, perc: number): void     // red, on a light red line, a red bar on its left;
                                                            // the title bar in red until clear()
  addWarning(text: string|UnsafeHtml, perc: number): void   // the same in orange
  addSection(title: string|UnsafeHtml, perc: number): void  // a section (<details>, open): the lines that follow go
                                           // in it; a click on its title folds it; its title has the icon
                                           // of the worst of its lines. Without any, the lines go in the log
  setText(text: string|UnsafeHtml, perc: number): void      // in place of all the lines
  clear(): void                            // no line, no error, no button OK
  done(): void                             // shows OK: after an error or a warning it waits for a click,
                                           // their counts on the left of the bar ("2 errors / 1 warning",
                                           // from _tr.global.progression), the icon of the worst;
                                           // else it counts "OK (5s)" and closes the box at 0
}
// ProgressionBox: its lines in a <pre> in a fixed font, a <div> each (class "line", plus "error" or "warning"),
//   10 lines high, scrolled both ways (the box keeps its size), every line as wide as the longest one;
//   a string is text, an UnsafeHtml html. Ctrl+A in the lines selects them only (a folded section too).
//   Colours: --msgbox-log-background, -border, -border-focus, -error-color, -error-background,
//   -warning-color, -warning-background, -scrollbar (the thumb of its scroll bars; their track is its background).
```

### `Notification`

```ts
interface NotificationProps extends ComponentProps {
  title: string; text: string | UnsafeHtml
  mode?: "success" | "danger"
  loading?: boolean                        // a turning icon
  iconId?: string
  closable?: boolean                       // a button that closes it
}
class Notification extends Popup { display(time_in_s?: number): void }   // 0: until it is closed
```

---

## Forms

```ts
type FormValues = Record<string, any>
interface FormProps extends BoxProps { autoComplete?: boolean }
class Form<P extends FormProps = FormProps, E extends ComponentEvents = ComponentEvents> extends Box<P, E> {
  // a class derived from Form declares its events: class EntryForm extends Form<EntryProps, EntryEvents>
  setValues(values: FormValues): void
  getValues<T extends FormValues>(): T
  setAutoComplete(on?: boolean): void      // attribute on the <form>: fields without their own follow it, added later too
  setValidator(validator: (values: FormValues, is_valid: boolean) => boolean): void   // a new call replaces the validator
  validate(): FormValues                   // null if invalid; the values the validator changes are written back in their fields (any element with the name, every radio of a group)
}
// Collects all children (recursive) that have a "name" attribute and implement queryInterface("form-element").
// Never sent by the browser: its "submit" is prevented (Enter in its only field would send it).
// A Form is flex by default (it takes the free height of its box) and has a padding of 16px.
//   flex: false: the height of its content (a toolbar, a line); its padding set back by a css rule.
```

---

## `SettingsView` — a page of settings, as the settings of VS Code

The summary of the sections on the left, the sections on the right, one after the other, each a panel with its title on a band; in a section, each `SettingItem` with its name, what it does, then its controls. A click in the summary brings its section to the top; the summary follows the scroll and marks the section at the top of the view.

```ts
interface SettingItemProps extends BoxProps {
  title: string
  description?: string                     // under the name
  content: Component | Component[]         // its controls, on a line that wraps
}
class SettingItem extends VBox {
  getSearchText(): string                  // the title and the description: what a search looks in
}
// A SettingItem has no value of its own: its controls keep theirs. To read and write them together,
// put the items in a Form (a section can hold a Form of SettingItem), give the controls a name,
// and use getValues / setValues. The item is marked on its left while one of its controls has the focus.

interface SettingsSection {
  id: string
  title: string
  description?: string                     // under the title
  content: Component[]                     // SettingItem, Form of SettingItem, or any component
}
interface SettingsViewProps extends BoxProps {
  sections?: SettingsSection[]
  searchable?: boolean                     // a search field above the sections
  searchPlaceholder?: string               // _tr.global.settings.search when missing
  noMatch?: string                         // shown when the search finds nothing; _tr.global.settings.nomatch when missing
  sectionChange?: EventCallback<EvSectionChange>
}
interface EvSectionChange extends ComponentEvent { readonly section: string }   // the id of the section at the top
class SettingsView<P extends SettingsViewProps = SettingsViewProps> extends VBox<P, SettingsViewEvents> {
  setSections(sections: SettingsSection[]): void   // replaces the sections
  showSection(id: string, smooth = true): void     // brings a section to the top
  getSection(): string                             // the id of the section at the top
}
// Search: the words typed are looked for without case nor accents; an item is shown when its title or
//   its description holds all of them. A section whose title or description holds them is shown whole;
//   otherwise only its items that hold them, and what holds those items (a Form, a box). What holds no
//   item (a table, a text) is shown with its whole section only. Escape empties the field.
// The section marked in the summary is the last one whose top is above the top of the view (40px of
//   margin); the first one while the view is hidden (in a tab not shown). The last section shown is at
//   least as high as the view (class "last"): a click in the summary can bring any section to the top.
// Classes: .x4settingsview > .search > .x4input, > .body > .toc (a Listbox), > .body > .sections;
//   .section(.last) > .title, .description; .sections > .nomatch; .x4settingitem > .name, .description, .controls
// CSS variables: --settingsview-toc-width, --settingsview-section-background,
//   --settingsview-section-title-background, --settingsview-hover-background, --settingsview-marker
```

A page that builds its sections with references to its own components (`this.refs.x = ...`) cannot give them to `super()`: `this` is not there yet. It calls `setSections` after `super()`. `SettingsView` keeps its own parts in private fields, not in `refs`: `refs` is left to the classes that derive from it.

```ts
class MySettings extends SettingsView {
  declare protected refs: { size: Input }

  constructor(props: BoxProps) {
    super({ ...props, searchable: true })

    this.setSections([
      { id: "editor", title: "Editor", content: [
        new Form({ content: [
          new SettingItem({ title: "Font size", description: "The size of the text, in pixels.",
            content: this.refs.size = new Input({ type: "number", name: "fontSize", value: 14 }) }),
        ] }),
      ] },
    ])
  }
}
```

---

## Sizers / viewport / misc

```ts
// PREFERRED for resizable panels: HSplitBox / VSplitBox (sizers are inserted automatically between panels).
// The panel with `flex` takes the remaining space, its neighbour is the one resized.
class HSplitBox extends HBox               // panels side by side, resizable width:  { content: Component[] }
class VSplitBox extends VBox               // panels stacked, resizable height:      { content: Component[] }
// new HSplitBox( { content: [ new Treeview( { width: 250 } ), new Panel( { flex: 1 } ) ] } )

// Low level: only place sizers by hand when a SplitBox does not fit (popup edges, header cells...).
class CSizer extends Component             // base splitter; events start, resize { size, width, height }, stop
class HSizer extends CSizer                // horizontal splitter
class VSizer extends CSizer                // vertical splitter
// A pointercancel (a touch taken by the browser) ends the resize as a pointerup does: stop is fired.
// The columns of a Gridview or a Spreadsheet are 16px wide at least (the min-width of a cell).
class ScrollView extends Component { getViewport(): Component }
class Viewport extends Component
class Canvas extends Component { getContext(): CanvasRenderingContext2D; paint(): void }
class Video extends Box {                   // class x4video
  play(): Promise<boolean>                 // false: could not start (a click of the user wanted, a source not playable); no source: waits for one
  pause(); mute(set: boolean)
  get player(): HTMLVideoElement; get duration(): number; get paused(): boolean
  get volume(): number; get videoWidth(): number; get videoHeight(): number
  set stream(stream: MediaStream)
}
class Calendar extends VBox {               // props: date?, minDate?, maxDate? (days out of them cannot be chosen), change ("change": the day clicked)
  getDate(): Date; setDate(date: Date): void   // copies: the calendar keeps its own date
}
class ColorPicker extends VBox {           // props: color, swatches?, nullable?, alpha? (false: no alpha slider, opaque colors); "change": EvColorChange, also fired once when built
  getColor(): Color; setColor(color: Color | string): void; setSwatches(swatches): void
}
class Panel extends VBox { setTitle(title: string): void }   // the text of its title: its icon stays
class Breadcrumbs extends HBox { setItems(elements): void }
interface KeyboardProps extends BoxProps {
  locale?: string      // "fr-FR" (default), "de-CH", "pl"...
  numpadOnly?: boolean    // number or date field: the pad has no "abc" key back to the letters
}
class Keyboard extends HBox {               // virtual keyboard, shown while an <input> has the focus
  setLocale(locale: string): void
  setZoom(perc: number): void
  showOn(el: Component): void
}
// languages: cs da de en es et fi fr ga hr hu it lt lv mt nl pl pt ro sk sl sv
// bottom row: 123 (numeric pad), the letters of the language (éè, none in en), the signs (#+=); Abc comes back
// a key acts on pointerdown; the keys that draw the keyboard again (shift, 123, abc, accents, signs) on the click
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
  field?: string; value?: string|number|RegExp; caseSensitive?: boolean   // a RegExp is tested on the field as it is: caseSensitive does not apply, the regexp handles the case (/^jo/i)
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
  close(): void                            // stops following the store; call it on a view you made (createView) and do not use anymore
  open(): void                             // follows the store again after a close(), filtered and sorted with its data of the moment
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
  get(uri: string|RegExp, handler: (params: any, path: string) => void): void   // the first route that matches is called, in the order of get: "/*" last is the route for the rest (params.wild)
  init(): void                             // trigger the current route
  navigate(uri: string, notify?: boolean, replace?: boolean): boolean
  // Events: "change" → { value: string } ; "error" → { code: 404, message: string }
}
parseRoute(str: string|RegExp, loose?: boolean): Segment
```

---

## Shortcuts (`core_shortcuts`)

Keyboard shortcuts. A sequence is written as it is read: `"Mod+C"`, `"Shift+Mod+Z"`, `"Delete"`, `"Alt+ArrowLeft"`, `"Ctrl+Space"`.
Modifiers: `Shift`, `Ctrl`, `Cmd`, `Alt`, and `Mod` = the key of the commands (Ctrl on Windows and Linux, Cmd on a Mac). Prefer `Mod`.

```ts
interface ShortcutOptions { editable?: boolean }       // true: also while the user types in a field

component.addShortcut(keys, callback, options?)         // a view: while the focus is in the component
Application.instance().addShortcut(keys, callback, options?)   // the whole application, wherever the focus is

shortcutText(keys: string): string                     // for a tooltip or a menu: "Ctrl+Z", "⌘Z" on a Mac

class Shortcuts {                                       // the list itself; rarely used directly
  add(keys: string | string[], callback: (ev: KeyboardEvent) => void, options?: ShortcutOptions): void
  clear(): void
  handle(ev: KeyboardEvent): boolean                   // true when the key was a shortcut
}
```

```ts
class MyView extends VBox {
  constructor(props: BoxProps) {
    super(props)
    this.addShortcut('Mod+C', () => this.copy())
    this.addShortcut(['Mod+Y', 'Shift+Mod+Z'], () => this.redo())
    this.setContent(new Button({ label: 'Undo', tooltip: shortcutText('Mod+Z'), click: () => this.undo() }))
  }
}
```

- A component shortcut also works while the focus is nowhere, if the component is the last one with shortcuts that had the focus: of two views shown together, the one the user works in answers. Not while that component is hidden (in a tab not shown, for instance).
- A key typed in an `input`, a `textarea` or a `select` is not a shortcut, unless `editable` is set.
- A key that what has the focus already used (it called `preventDefault` or `stopPropagation`) is not a shortcut.
- A shortcut always takes its key (`preventDefault`). For a key that must sometimes be left alone, use a `keydown` handler instead.
- An application shortcut also works while a dialog is open.
- Do not write a `keydown` handler with a `switch` on `ev.ctrlKey` for commands: use `addShortcut`.

---

## Clipboard (`core_clipboard`)

The clipboard of the system: a text, an image, files. Never call `navigator.clipboard` or `ev.clipboardData`.

```ts
interface ClipboardContent { text?: string; image?: Blob }
interface ClipboardRead extends ClipboardContent { files: File[] }   // files: only in an event

// from a menu or a button: asynchronous, never fail
setClipboard(data: ClipboardContent): Promise<boolean>   // false: the system refused
getClipboard(): Promise<ClipboardRead>
canReadClipboard(): boolean                              // false: nothing to paste, disable the item

// in a "copy", "cut" or "paste" event
setEventClipboard(ev: ClipboardEvent, data: ClipboardContent): void   // prevents the default
getEventClipboard(ev: ClipboardEvent): ClipboardRead                  // synchronous, default left as it is
```

```ts
this.addDOMEvent('copy', ev => setEventClipboard(ev, { text: this.getSelectedText() }))

this.addDOMEvent('paste', ev => {
  const data = getEventClipboard(ev)
  if (data.image) {
    ev.preventDefault()
    this.setPicture(data.image)
  }
})

new Button({ label: 'Paste', click: async () => {
  const data = await getClipboard()
  if (data.text) this.insert(data.text)
} })
```

- The keys of the user (Ctrl+C, Ctrl+V) are the `copy`, `cut` and `paste` events, not shortcuts: the browser then gives its clipboard without asking for a permission.
- The events go to the component that has the focus: give it a `tabindex`.
- Out of an event, the browser may refuse, and there is no system clipboard on a page that is not served in https. What the application set last is then what `getClipboard` gives: copy and paste still work inside the application.
- An image is written as a PNG; another format is converted. Files can be read in a `paste` event only, and cannot be written.

---

## Drag and drop (`core_dragdrop`)

`dragManager` makes a component something the user drags, and another one a place where things are dropped: components of the application, or files that come from the desktop.

```ts
interface DropInfo { pt: Point; data: DataTransfer }
type DropCallback = (command: 'enter' | 'leave' | 'drag' | 'drop', el: Component, infos: DropInfo) => void
type DropFilterCallback = (el: Component, data: DataTransfer) => boolean   // false: nothing can be dropped here

dragManager.registerDraggableElement(el: Component): void
dragManager.registerDropTarget(el: Component, cb: DropCallback, filterCB?: DropFilterCallback): void
```

```ts
dragManager.registerDraggableElement(card)

dragManager.registerDropTarget(column, (cmd, el, infos) => {
  if (cmd == 'drop') {
    if (infos.data.files.length) this.upload(infos.data.files)   // files from the desktop
    else this.moveCard(el, infos.pt)                              // el: the component that was dragged
  }
})
```

- `registerDraggableElement`: while it is dragged, the component has the class `dragging`, and a copy of it with the class `dragged`, added to the body, follows the pointer. Nothing else is done: no data of the application goes with the drag, the target gets the component itself.
- The callback of a target: `enter` and `leave` when the pointer comes over it and goes away, `drag` again and again while it is over it, `drop`. Only `drag` and `drop` have `infos`; `pt` is in the coordinates of the page.
- `enter` comes at once, before the first `drag`. `leave` is found by a timer: it comes up to 300 ms after the pointer went away (over the children of a target the browser sends dragleave and dragover in turn), and a `leave` also follows a `drop`. Between them the target has the class `drop-over`.
- `el` in the callbacks is the dragged component, not the target. There is none for files that come from the desktop: read `infos.data.files`.
- `Image` (`candrop`) and `FileDrop` already use it for files.

---

## i18n (`core_i18n`)

Four built-in languages: `fr` (default), `en` (based on `fr`), `es` and `de` (based on `en`). Dates: `D/M/Y` in fr and es, `M/D/Y` in en, `D.M.Y` in de.

```ts
export let _tr                             // current translation object (proxy)
createLanguage(name: string, base: string): void
addTranslation(name: string, ...parts: any[]): void   // seen at once, the language being selected or not
selectLanguage(name: string): typeof _tr
// a key missing in a language is taken from its base (createLanguage), at the same path;
// a key no language has: console.error "I18N error: unable to find _tr.x.y", undefined
getCurrentLanguage(): string
getAvailableLanguages(): string[]
isLanguage(name: string): boolean

// _tr.global keys: ok cancel yes no abort retry ignore error today open new delete close save
//   search search_tip required_field invalid_format invalid_email invalid_number invalid_date
//   empty_list err_403 property value copy cut paste filedrop
//   diff_date_seconds/minutes/hours, date_input_formats, date_format, date_time_format,
//   locale ("fr-FR", "en-US", "es-ES", "de-DE": the formats of numbers, amounts, dates),
//   day_short[] day_long[] month_short[] month_long[], keyboard.{next,numeric,alpha},
//   settings.{search,nomatch}, progression.{error,errors,warning,warnings}
getCurrentLocale(): string; getCurrentCurrency(): string   // as Application.getLocale / getCurrency
```

The language gives the texts and the locale of the formats: `selectLanguage("en")` changes both. A regional
variant is a language based on another: `createLanguage("fr-ch", "fr")`, `addTranslation("fr-ch", { global: { locale: "fr-CH" } })`.
`Application.setLocale(locale, currency)` forces the locale over the language's. The fields of date and the
Calendar follow the patterns of the language (`date_format`...), not the locale. A field of type number is shown
by the browser, in its own locale, whatever this one.

---

## Theme (`themes.scss`)

```css
--color-primary-a0 … --color-primary-a100     /* the scale: a0 the background, a100 the text, the accent between */
/* the globals the components use: --background-primary / -secondary / -ternary / -hover / -active / -input,
   --text-primary / -secondary / -ternary, --border / -light / -hover / -focus, --accent-background / -hover /
   -focus / -active / -light, --accent-color (the text on the accent), --disabled-*, --icon-color / -active,
   --alert-*, --warning-*, --success-* */
```
// The greys are mixes of a0 and a100: a theme that reverses the scale gets them light on dark.
// Each component reads its own variables (the @cssvar of its class), which point to these globals:
//   a theme redefines the globals, or one variable of a component.
// Themes: Application.setTheme(name) puts the class x4theme-<name> on <html>. "" is the light theme (by default),
//   "dark" the dark theme of x4 (the colours of VS Code Dark Modern). An application adds its own theme in its css,
//   html.x4theme-pink { --color-primary-a0: ...; ... }, then Application.setTheme("pink").

---

## Utilities (`core_tools`)

```ts
class UnsafeHtml extends String            // raw, unescaped HTML marker
unsafeHtml(x: string): UnsafeHtml
unsafe(strings, ...values): UnsafeHtml     // template tag: unsafe`<b>${x}</b>`; values escaped (an UnsafeHtml kept), null/undefined write nothing, 0 and false are written
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
  // new Color(value) | new Color(r,g,b,a?)   a: 0..1, default 1
  // value: "#rgb", "#rrggbb", "#rrggbbaa", "rgb()", "rgba()", a name ("cyan", "transparent"), "var(--name)",
  //   and any other colour the browser knows (hsl(), oklch(), color-mix()), read from the pixel it paints
  setValue(value): this; setRgb(r,g,b,a?): this; setHsv(h,s,v,a?): this; setAlpha(a): this
  getAlpha(): number
  lighten(percent): this; darken(percent): this   // toward white / black, 0-100, each component rounded
  mix(other: Color, amount): this                  // amount 0-1: 0 keeps this color, 1 gives the other one; alpha too
  luminance(): number                              // WCAG relative luminance, 0 (black) to 1 (white); alpha not used
  contrast(other: Color): number                   // WCAG ratio, 1 to 21
  textColor(light?: Color, dark?: Color): Color    // a copy of the one of the two that contrasts most with this color; white and black by default
  isInvalid(): boolean                     // the last setValue could not be read (the color is red); setRgb/setHsv make it valid
  toHexString(): string; toNumber(): number
  toRgbString(withAlpha = false): string   // "rgb(r,g,b)"; true: "rgba(r,g,b,0.500)" when not opaque, "rgb(...)" when opaque
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
measureText(str, size, bold?): number      // width in Helvetica, from core_pdf (see PDF)

// Dates
date_format(date, options?): string       // options: Intl.DateTimeFormat in the locale; without: formatIntlDate(date)

// Formats in the current locale (Application.setLocale, else the one of the language), Intl made once by locale
formatNumber(value, decimals?, grouping = true): string   // "1 234,5" in fr-FR; decimals: the most shown
formatMoney(value): string                 // "1 234,50 €": the currency of Application.getCurrency()
formatDate(date): string                   // "22/10/2026"
formatDateTime(date): string               // "22/10/2026 14:05"
// Gridview and Spreadsheet format their columns number, money, date, date-time with them (a formatter comes first)
date_diff(date1, date2, options?): string   // "30 secondes", "5 minutes", "2 heures 5 minutes" (either order); options not read
date_to_sql(date, withHours): string; date_sql_utc(date): Date
date_hash(date): number; date_clone(date): Date
date_calc_weeknum(date): number            // ISO 8601: weeks from monday, week 1 holds the first thursday (29/12/2025 → 1)
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
const dragManager                           // see Drag and drop
const svgLoader; const linearColorStops; const simpleColorStop
const unbubbleEvents       // the events that stay on their node: see "Important stupid notes"
const makeUniqueComponentId  // () => string, "x4-<n>" (exported as a value)
```

### `formatIntlDate` specifiers

```
d day (no zero)    D day (2 digits)     j short day (mon)   J long day (monday)
w week number (ISO 8601)      W week (2 digits)    m month (no zero)   M month (2 digits)
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
// arc(x, y, r, start, end): angles in degrees, 0 is the top, 90 the right; it starts a new subpath
// addStop(offset, color): a number is a percentage (20 → "20%"), "50%" as it is
// getNumAttr(name): 0 when not set; SvgIcon(svg): its svg needs xmlns="http://www.w3.org/2000/svg"
```

---

## PDF (`core_pdf`)

```ts
interface PDFProps { title?: string; author?: string; subject?: string }
class X4PDFBuilder {
  constructor(props?: PDFProps)
  page(width: number, height: number, callback: (ctx: PageContext) => void): void   // points; without size 612 x 792
  build(): Uint8Array
  buildAsync(): Promise<Uint8Array>          // streams compressed (FlateDecode)
}
export interface PageContext {                // origin bottom left, y goes up
  text(str, x, y, size, opts?: { align?: 'left'|'center'|'right'; width?; color?; bold? }): void
  rect(x, y, w, h, fill: string): void
  line(x1, y1, x2, y2, stroke: string, lineWidth?): void
  path(segments: PathSegment[], fill: string, stroke?: string, lineWidth?): void   // null: not drawn
  image(jpegBytes: Uint8Array, x, y, w, h): void
  link(url, x, y, w, h, opts?: { underline?: string }): void
  barcode(type: BarcodeType, text, x, y, w, h, opts?: BarcodeOptions): void   // datamatrix: square min(w,h), (x,y) bottom left; code128: bars on w x h; no quiet zone
  svgPath(d: string, x, y, scale, fill: string, stroke?: string, lineWidth?): void   // (x,y): the svg origin, its y going down; M L H V C S Q T A Z
  icon(svg: string, x, y, w, h, opts?: { color?: string; background?: string }): void   // as Icon takes it (not a file); viewBox fitted in w x h; opacity mixed with background
}
type PathSegment = ['m', x, y] | ['l', x, y] | ['c', x1, y1, x2, y2, x3, y3] | ['h']
type BarcodeType = 'datamatrix' | 'code128'
interface BarcodeOptions { gs1?: boolean /* "(01)...(17)..." */; color?: string }
renderBarcodeImage(type, text, opts?: BarcodeOptions & { module?: number }): string   // "data:image/svg+xml,..." for Image / Icon; on white, quiet zone included
// Data Matrix ECC200 10x10..26x26 (44 chars, 88 digits, Latin-1); Code 128 ASCII. Too long or not encodable: throws.
measureText(str: string, size: number, bold?: boolean): number   // Helvetica
// Text: Helvetica, Windows-1252 (é € … ’); another character comes out as '?'. Printed at its size (PrintScaling /None).
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

No tooltip is shown until the application calls `initTooltips()` once (the prop `tooltip` only sets an attribute).
`initTooltips()` shows the text of the attribute `tooltip` (the prop `tooltip`), or the one `getTip()`
of a `"tip-handler"` gives, **as html**. A text that comes from a user is escaped by the application
with `sanitizeHtml( text )`: `tooltip: \`Open <b>${sanitizeHtml( file.name )}</b>\``.

---

## State (`core_state`)

```ts
makeState<T>(initialState: T): StateProxy<T>     // the data itself + on / off / once / watch

const state = makeState({ count: 0, user: { name: '' }, items: [1, 2, 3] })
state.on('change', e => ...)                     // EvStateChange { path, value }
state.watch('user', e => ...)                    // 'user', anything below it, or a parent replaced; returns { off() }
state.count++                                    // path "count"
state.user.name = 'x'                            // path "user.name"
state.items.push(4)                              // path "items[3]"

class StateManager<T> extends EventSource<StateEvents> {
  constructor(initialState: T)
  proxify(): StateProxy<T>
  on(name, listener): { off(): void }
  off(name, listener): void
  once(name, listener): { off(): void }
  watch(path: string, cb: (ev: EvStateChange) => void): { off(): void }
}

// Component (protected): a state kept in localStorage under "x4@persist:<name>",
// saved 500 ms after a change
loadPState(name: string, defaults: Record<string, any>): any
```

- Plain objects and arrays are proxied when read; Date, Map, Set and class instances are not.
- Setting a property to the value it already has fires nothing.
- Reading a property that does not exist logs an error and returns `undefined`.

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
router.addListener('error', () => router.navigate('/home'))
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
		"dev": "x4js dev",
		"build": "x4js build"
	},
	"dependencies": {
		"@fontsource/montserrat": "^5.1.0",
		"@types/node": "^25.9.1",
		"x4js": "latest"
	}
}
```

`x4js dev` runs the dev server, `x4js build` writes `outdir` (add `--debug` for a debug build).
Both read `x4.config.json` (change the file with `--config <file>`).
Full reference of the command line (commands, options, config keys, troubleshooting): `aicli.md`.

### `x4.config.json`

```json
{
	"entryPoints": ["src/main.ts"],
	"outdir": "./bin",
	"copy": [
		{ "from": "./src/assets", "to": "assets" },
		{ "from": "./src/index.html", "to": "index.html" }
	]
}
```

Optional keys: `external`, `define`, `esbuild`, `dev` (`host`, `port`, `https`, `tls`).
`copy[].to` is relative to `outdir`.

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

`experimentalDecorators` is required: the decorators `@data.*` of a `DataModel` are written for it. Without it esbuild applies the standard JavaScript decorators, and the fields of a model are not declared.

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
- x4 sets `user-select: none` on every element (`*`): text that must be selectable needs `user-select: text` on it and on its descendants.
- `enable(false)` / `disable()` put `disabled` and `inert` on the component itself. Its children are not changed: the browser makes all that is inside an `inert` element inactive (no click, no focus).
- `Application` is a strict singleton — one instance per page (an assertion fails otherwise).
- `Popup.show()` routes to `displayCenter()`. To position, call `displayAt()` or `displayNear()` instead.
- `BtnGroup` accepts predefined strings (`"ok"`, `"cancel"`...) with options after a dot: `"ok.outline.default.disabled"`.
- `Form.getValues()` collects all recursive children with a `name` attribute implementing `queryInterface("form-element")`.
- The default language is `fr`. Call `selectLanguage('en')` to switch to English.
- `Gridview` is backed by a `DataStore`; `Spreadsheet` is backed by a `Store` (different, cell-based).
- `DataRecordID` is currently typed `any`; `strictNullChecks` is intentionally off in the recommended `tsconfig.json`.
- `MonacoEditor` requires `MonacoEditor.start()` (async) before use; register extra typings with `MonacoEditor.addTypelib(name, code)`.
- `x4_react.create_element` is the JSX pragma; 
- A DOM handler of an ancestor is called for the events of its descendants, as in the browser. Not for the events that do not bubble: `focus`, `blur`, `mouseenter`, `mouseleave` (use `focusin` / `focusout`, `mouseover` / `mouseout`), nor for those of x4: `created`, `removed`, `resized`.
- Several handlers of one event on one node are called in the order they were added. One that returns `true` stops those that follow it.