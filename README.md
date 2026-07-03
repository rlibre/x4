# x4js
**A TypeScript framework for people who build applications, not markup.**

## Home page
see [home](https://x4js.org)

## API Documentation
see [API](https://rlibre.github.io/x4/index.html)
see [AI](./aicontext.md)

---

## The translation you never signed up for

Modern web frameworks share a hidden assumption: that your job is to describe the DOM. Whether through JSX, templates, or reactive object trees, they all keep you close to the metal — writing `<div>`s, wiring class names, juggling attributes. You spend your days translating what you *mean* into how the browser *renders it*, then debugging the translation.

x4js removes that layer entirely.

You don't assemble elements. You compose high-level objects — `Button`, `DataGrid`, `Dialog`, `Form` — that model your application, not the page. A button has a `text`, not a `textContent`. A grid has columns, not a `<table><thead><tr>`. You describe intent; the framework handles the rest.

---

## The paradox nobody talks about

Millions of developers building with reactive frameworks — React, Vue, Svelte, and the rest — spend their day inside VS Code, Slack, Figma, Discord. Applications they hold up as benchmarks of speed and polish.

Not one of them is built the way those same developers build their own work.

VS Code is written in TypeScript, around high-level object components, with direct, surgical DOM manipulation — **no virtual DOM**. That isn't an accident. Routing every keystroke through a virtual-tree reconciliation pass would make a code editor unusable. So the tool you use to write your reactive app could never have been written in that same reactive framework and stayed fast.

This isn't an isolated curiosity. It's a pattern. The applications that must be genuinely fast — editors, IDEs, terminals, design tools, spreadsheets — converge on the same architecture again and again: object components, direct DOM updates, fine-grained and intentional reactivity. Exactly the philosophy x4js is built on.

The virtual DOM is a comfortable abstraction that trades performance for ease of reasoning. It's a fair trade for a landing page, a dashboard, a form. But the moment an interface becomes dense, dynamic, and latency-sensitive, the teams building the industry's reference tools quietly abandon that trade. They don't choose it for their own product — they only recommend it for everyone else's.

> When performance actually matters, the industry votes with its code.
> x4js brings to *your* applications the architecture your tools already use for theirs.

A fair caveat: VS Code doesn't run on x4js, and reactive frameworks aren't "bad." React, Vue, and Svelte optimize for a different problem — productivity on interfaces of moderate complexity — and they do it well. The point is architectural family, not brand. x4js belongs to the same lineage as the dense, demanding tools you already trust: object-first, direct-DOM, precisely reactive.

---

## Why the object-first approach wins

### No virtual DOM, no diffing

x4js builds and updates the real DOM directly. There's no reconciliation pass, no shadow tree to compare against, no per-render overhead. Updates are direct — which makes them fast and, just as importantly, predictable.

### Code that runs when you call it — and only then

In a reactive framework, your component is a function the framework re-executes whenever it decides to. Every variable is recreated on each pass; every closure can silently capture a stale value. Entire categories of bugs — stale closures, dependency arrays, effects firing twice, memoization tuning — exist *only* because the execution model is inverted: the framework calls you.

An x4js component is an object. Its state lives in fields that persist for its whole lifetime. Its methods run when you call them, once, in the order you wrote. There is nothing to memoize, no dependency list to maintain, no rule about where you're allowed to declare things. The mental model is the one you already have from every other kind of software you've written.

### State you can simply assign

In reactive frameworks, changing a value is a discipline in itself. State is immutable, so a one-field update becomes a pyramid of spreads: `setUser({ ...user, address: { ...user.address, city: "Paris" } })` — and entire libraries exist just to make that bearable. State setters are asynchronous and batched, so the line after `setCount(count + 1)` still reads the old value; you must remember updater functions (`setCount(c => c + 1)`) or debug why your counter skips. And the primitives themselves come with a rulebook — hooks only at the top level, never in a condition or a loop, always in the same order — rules the language cannot enforce, so a linter has to police your code where the compiler should have.

None of this is your application. All of it is ceremony imposed by the framework's model of change.

In x4js, state is an object and change is assignment: `state.count++`, `state.user.address.city = "Paris"`. The value is updated on the next line, because of course it is. Deep mutation works, because objects are objects. There are no placement rules, because a property assignment is not a framework primitive — it's JavaScript. Years of accumulated workarounds — updater callbacks, spread pyramids, immutability helpers, exhaustive-deps lint rules — simply have nothing left to fix.

### Debugging your code, not the framework's

Set a breakpoint in an x4js method and the call stack reads like your application: your event handler, your component, your logic. In virtual-DOM frameworks, the same breakpoint lands you in a scheduler — fiber trees, hook lists, reconciliation frames — with your actual code buried somewhere inside the machinery. Dedicated browser devtools extensions exist for those frameworks precisely because the native debugger stopped being enough. x4js needs none: what you wrote is what executes, and the standard debugger tells the whole story.

### No re-render tax on memory

A virtual-DOM render allocates a full tree of description objects — on every update, for every component involved — and immediately hands it to the garbage collector once diffed. Under load (typing, scrolling, dragging), that is a constant allocation churn competing with your application for CPU and memory. x4js components are allocated once and mutated in place. A text change is a property assignment and one DOM write. Nothing to allocate, nothing to collect, nothing to diff.

### Built for dense, professional interfaces

Reactive ecosystems treat data grids, tree views, dockable panels, and virtual scrolling as third-party problems — an `npm install` and a licensing page away. That is because rendering ten thousand live rows through a diffing pipeline is genuinely hard, so the hard components get outsourced. In x4js, the demanding components are first-class citizens of the framework itself, built on the same direct-DOM foundation as everything else. Business applications — the ones with toolbars, grids, trees, and forms that people use eight hours a day — are the primary use case, not an afterthought.

### No build step required

No JSX to transpile, no template compiler, no toolchain to configure. x4js is TypeScript that runs. You get type safety and autocompletion out of the box, with nothing standing between your source and your running app — and nothing in your supply chain but the compiler you already trust.

### An API that survives the churn

The reactive world reinvents itself every few years: class components gave way to hooks, options API to composition API, stores to signals — each transition deprecating the patterns, tutorials, and muscle memory of the previous one. Code written against browser primitives and plain TypeScript objects doesn't churn like that. `Proxy`, `EventTarget`, classes, and the DOM are stable, standardized ground. An x4js codebase written today will compile and run unchanged years from now, because there is no framework-specific paradigm to be deprecated out from under it.

### You ship what you use — nothing else

Reactive frameworks make you ship their runtime before your first component renders: the scheduler, the reconciler, the hooks machinery — a fixed entry fee, paid by every user on every load, whether your page is an app or a button. x4js has no such core tax. Components are plain TypeScript classes, so standard tree-shaking keeps exactly what you import: use only `Button`, and your bundle contains `Button` — about 22 KB, core included. No runtime to amortize, no framework floor below which your app cannot shrink. Small tools stay small; big applications pay only for the components they actually use.

If you come from C or C++, you already know this model: it's **static linking against a library**. The linker pulls in only the symbols you reference, dead code never makes it into the binary. A reactive framework's runtime is the opposite — a mandatory DLL shipped whole with every executable, whether you call one function from it or a thousand. x4js links; it doesn't bundle a runtime.

### End-to-end TypeScript

Components, properties, and events are fully typed. The compiler catches mistakes before the browser does — not only in your logic, but in the way your components fit together.

### One codebase, web and desktop

Because x4js produces standard DOM from plain TypeScript — no framework-specific runtime, no build-time magic — the same application runs unchanged in the browser or packaged as a desktop app through Electron, Tauri, or NW.js. Nothing to adapt, nothing to port: the wrapper provides the window, x4js provides the application.

---

**Think differently. Escape the DOM. Focus on the concept, not the format.**

