<picture>
	<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/rlibre/x4/main/logox4-v3-dark.svg">
	<img src="https://raw.githubusercontent.com/rlibre/x4/main/logox4-v3.svg" alt="x4 logo" width="96">
</picture>

# x4js

**Build applications. Not markup.**

A TypeScript framework for dense, professional interfaces. Persistent objects, real DOM, typed events — and JSX when it makes the tree easier to read.

TypeScript · Web + Desktop · MIT

[Home page](https://x4js.org) · [Getting started](https://x4js.org/doc/en/getting-started/) · [Documentation](https://x4js.org/doc/en/) · [Gallery](https://x4js.org/doc/gallery/) · [API reference](https://rlibre.github.io/x4/index.html) · [llms.txt](https://x4js.org/llms.txt)

## Try x4

```sh
npx x4js create my-app
cd my-app
npm run dev
```

`x4js create` installs the dependencies; `npm run dev` serves the application (`http://127.0.0.1:8000`, or the next free port) and rebuilds it on every change. In an existing project: `npm install x4js`.

---

Most UI frameworks start with `<div>`. x4 starts with what the application is.

## A small mental model

Use the language and the browser when they already solve the problem. Add framework concepts only where they earn their place.

- **Component** — a persistent TypeScript object associated with its real DOM. Lifecycle, events and content stay where you expect them.
- **State** — observable application state through `Proxy`. Read and mutate ordinary JavaScript-shaped data: `state.count++`.
- **Events** — local communication between components and objects. Typed, explicit, unsurprising: `button.on( "click", ... )`.
- **Global messages** — application-wide messages (`Application.fireGlobal`). Transport can be local or remote without leaking into the views.

## Objects that stay objects

Components are persistent instances. Create them, keep references, call methods, listen to events. No render loop to appease.

- Real DOM, updated directly
- Classes when identity and lifecycle are useful
- Modules and imports instead of a container
- CSS and CSS variables for styling

```ts
import { BoxProps, Button, Gauge, Label, VBox } from "x4js";

interface DevicePanelProps extends BoxProps {
	name: string;
}

class DevicePanel extends VBox<DevicePanelProps> {
	constructor( props: DevicePanelProps ) {
		super( props );

		this.setContent( [
			new Label( { text: props.name } ),
			new Gauge( { min: 0, max: 100 } ),
			new Button( { label: "Restart" } ),
		] );
	}
}
```

## A complete UI toolkit. Not just primitives.

x4 ships with more than 50 components, the CSS foundation they use, and a theme system based on CSS variables. Start with the defaults, create your own controls, or integrate third-party UI components when they fit the job.

- `HBox` `VBox` `Tabs` `Form` `Dialog`
- `Button` `TextEdit` `Combobox` `ColorPicker` `Calendar`
- `Gridview` `Spreadsheet` `Treeview` `PropertyGrid`
- `Chart` `Gauge` `DockingView` `Timeline`
- Drag & drop, PDF generation

Try them all, with their code, in the [gallery](https://x4js.org/doc/gallery/).

**Easy to extend.** Your own controls use exactly the same Component model as the built-ins. A custom component is just a TypeScript class with the lifecycle and DOM you need.

```ts
import { Component, ComponentProps } from "x4js";

interface StatusBadgeProps extends ComponentProps {
	text: string;
}

class StatusBadge extends Component<StatusBadgeProps> {
	constructor( props: StatusBadgeProps ) {
		super( props );
		this.setContent( props.text );
	}
}
```

**Bring other components too.** x4 does not require every control to come from x4. Third-party UI libraries can live alongside x4 components when they fit the job: one browser DOM.

**The visual system comes with it.** Component styles, layouts, visual states and theming are part of x4. The default theme is usable as-is, CSS variables keep product customization direct, and `Application.setTheme( "dark" )` switches to the dark theme.

## The difficult UI is not an afterthought

x4's natural habitat is software people work in: data-heavy screens, industrial tools, dashboards, business applications and desktop-like interfaces.

- **Gridview + Spreadsheet** — tabular data is a first-class use case, backed by specialized `DataStore` structures.
- **Treeview** — hierarchies and navigation for serious application shells.
- **Forms + Dialogs** — structured editing without rebuilding basic application controls yourself.
- **Gauge + Chart** — live operational data fits naturally beside the rest of the interface.

## JSX when it helps. Same runtime.

JSX is optional syntax, not an application architecture. Use object construction for directness, JSX for readable trees — both create x4 Components and real DOM.

```ts
// objects
this.setContent( [
	new Label( { text: "Temperature" } ),
	new Gauge( { min: 0, max: 100 } ),
] );
```

```tsx
// JSX
this.setContent(
	<VBox>
		<Label text="Temperature" />
		<Gauge min={0} max={100} />
	</VBox>
);
```

For JSX, in `tsconfig.json`: `"jsx": "react"` and `"jsxFactory": "x4_react.create_element"`, then `import { x4_react } from "x4js"` in the `.tsx` file.

## Ship only what you use

The npm package ships TypeScript sources. Your bundler sees x4 and your application in the same module graph, so ordinary tree-shaking can remove components you never import. No virtual DOM runtime.

Measured with x4js 2.3.32: an application that only shows a `Button`, built with `x4js build`, has 65 KB of JavaScript, 23 KB gzipped. Its stylesheet holds the styles of every component: 123 KB, 22 KB gzipped.

## Fast feedback. No ceremony.

- **Live reload** — `npm run dev` rebuilds on every change and reloads the page; a style change applies without a reload.
- **TypeScript end to end** — your application and x4 stay in the same module graph.
- **Simple tooling** — `x4js create`, `x4js dev` and `x4js build`: create, run and build without adding another framework layer ([aicli.md](https://github.com/rlibre/x4/blob/main/aicli.md)).
- **i18n ready** — build multilingual interfaces without changing the component model (`addTranslation`, `selectLanguage`).

## Readable by humans. Predictable for machines.

Three files written for AI assistants ship with the package, in `node_modules/x4js/`. Give them to your assistant before asking it to write x4js code:

- [aicontext.md](https://github.com/rlibre/x4/blob/main/aicontext.md): compact API reference, with exact signatures
- [aiguide.md](https://github.com/rlibre/x4/blob/main/aiguide.md): how to write idiomatic x4js code
- [aicli.md](https://github.com/rlibre/x4/blob/main/aicli.md): the `x4js` command line and `x4.config.json`

With Claude Code, install the x4js plugin instead: its skill reads these files from your project by itself.

```sh
claude plugin marketplace add rlibre/x4
claude plugin install x4js@rlibre
```

For an assistant that reads the web: [llms.txt](https://x4js.org/llms.txt), and [llms-full.txt](https://x4js.org/llms-full.txt) with the three files in full.

## z4js: the same idea, server side

*In development.* z4js is the backend counterpart of x4js: plain TypeScript classes, very few dependencies, secure by default. Routes, sessions, access rights, migrations, Postgres or SQLite, workers and logs come in one package, written together.

[z4js.org](https://z4js.org) · [z4js on GitHub](https://github.com/rlibre/z4js)

## License

MIT — see [LICENSE](https://github.com/rlibre/x4/blob/main/LICENSE).

**Type less framework. Build more application.**
