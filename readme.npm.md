# x4js

**A TypeScript framework for building applications, not markup.**

x4js is designed for rich web and desktop applications: business software, industrial interfaces, dashboards, data-heavy tools and desktop-like applications.

It uses persistent TypeScript objects associated with the real DOM. No virtual DOM, no reconciliation layer, and no application architecture imposed by JSX.

**TypeScript objects. JSX when it helps. Real DOM.**

## Install

```bash
npm install x4js
```

## Quick start

Create a project:

```bash
npx x4build create demo --type=html
cd demo
npm install
```

Run it in development mode with HMR:

```bash
npx x4build --watch --hmr --serve
```

## More than 50 UI components

x4 includes a complete UI toolkit for building real applications.

Among the available components:

`Button`, `Input`, `TextEdit`, `TextArea`, `Checkbox`, `Radio`, `Switch`, `Select`, `Combobox`, `Slider`, `ColorPicker`, `Form`, `Dialog`, `Popup`, `Menu`, `Tabs`, `Gridview`, `Treeview`, `PropertyGrid`, `Spreadsheet`, `Calendar`, `Gauge`, `Progress`, `FileDrop`, `MonacoEditor`, layouts and more.

The framework also provides:

* drag & drop
* SVG primitives and builder
* routing
* PDF generation
* internationalization
* data stores and views
* application-wide events
* persistence helpers
* CSS infrastructure and theming

## Easy to extend

x4 components are ordinary TypeScript classes.

```ts
import { Component, ComponentProps } from 'x4js'

interface StatusBadgeProps extends ComponentProps {
    text: string
}

class StatusBadge extends Component<StatusBadgeProps> {
    constructor(props: StatusBadgeProps) {
        super(props)

        this.setContent(props.text)
    }
}
```

Your own components use the same DOM, lifecycle and event model as the components provided by x4.

Because x4 works with the real browser DOM, third-party UI libraries can also be integrated where they make sense. There is no separate plugin architecture to satisfy.

## Real DOM

A `Component` is a persistent TypeScript object associated with an actual DOM element.

```ts
const button = new Button({
    label: 'Restart'
})

button.on('click', () => restartMachine())
```

The object remains alive for the lifetime of the component. You can keep references, call methods and listen to events directly.

There is no virtual tree to rebuild or reconcile.

## JSX is optional

x4 supports JSX, but JSX is syntax — not the application architecture.

Object API:

```ts
this.setContent([
    new Label({
        text: 'Temperature'
    }),

    new Gauge({
        min: 0,
        max: 100
    })
])
```

JSX:

```tsx
this.setContent(
    <VBox>
        <Label text="Temperature" />
        <Gauge min={0} max={100} />
    </VBox>
)
```

Both create the same x4 Components and the same real DOM.

Use whichever makes the code clearer.

## Data-heavy applications

x4 treats grids, trees, forms and structured data as first-class application concerns.

`DataStore`, `DataView` and `Gridview` are designed to work together for tabular data:

```ts
const store = new DataStore({
    model,
    data
})

const grid = new Gridview({
    store,
    columns: [
        { id: 'name', title: 'Name', width: 200 },
        { id: 'age', title: 'Age', width: 80 }
    ]
})
```

Changes to the data are reflected by the components using it.

## Routing

```ts
const router = new Router(true)

router.get('/home', () => showHome())
router.get('/device/:id', p => showDevice(p.id))

router.init()
```

## Internationalization

Internationalization support is built in.

```ts
createLanguage('de', 'en')
addTranslation('de', translations)

selectLanguage('de')
```

x4 includes French and English translations by default and allows applications to add their own languages.

## SVG and PDF

SVG is part of the framework surface through `SvgComponent` and `SvgBuilder`.

PDF documents can be generated programmatically with `X4PDFBuilder`:

```ts
const pdf = new X4PDFBuilder()

pdf.page(595, 842, page => {
    // draw page
})

const data = pdf.build()
```

## CSS and themes

x4 includes the CSS foundation used by its components.

Applications can use the default styling, adapt it to their product, or provide their own CSS. Components expose their real DOM and CSS classes, so standard browser styling techniques remain available.

No CSS-in-JS runtime is required.

## HMR and development workflow

The standard x4 build workflow supports watch mode, development serving and HMR:

```bash
x4build --watch --hmr --serve
```

Edit the application, save, see the result.

## Ship only what you use

The `x4js` npm package ships its TypeScript sources directly.

Your application and x4 therefore participate in the same module graph, allowing the bundler to tree-shake unused code.

Import a small part of x4 and the rest of the component library does not need to become part of your application bundle.

## Web and desktop

x4 targets both browser and desktop applications.

The same component model can be used in the browser or inside a desktop wrapper such as Electron, Tauri or NW.js.

## AI-friendly documentation

x4 provides a generated `aicontext.md` containing the actual TypeScript API signatures.

AI coding agents can also inspect the framework sources directly because they are distributed with the npm package:

```text
node_modules/x4js/src/
```

The goal is not to make x4 an “AI framework”.

The goal is simpler: an explicit architecture and an API that are readable by humans and predictable for machines.

## Philosophy

x4 deliberately keeps its conceptual model small.

Use TypeScript when TypeScript is enough.
Use the browser when the browser is enough.
Add an abstraction only when it solves a real problem.

**Use the simplest tool that fits.**

---

MIT License
