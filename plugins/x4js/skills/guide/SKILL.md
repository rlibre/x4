---
name: guide
description: Write, review and debug code that uses x4js, the TypeScript object-component UI framework (`import { ... } from 'x4js'`), and run its `x4js` command line. Use this skill whenever a project depends on x4js, or the user mentions x4js, x4, an x4 component (Component, VBox, HBox, Listbox, Gridview, Treeview, Spreadsheet, Chart, Dialog, Form, Combobox...), `x4.config.json`, `x4js create`, `x4js dev` or `x4js build`, even for a small change. The x4js API is small and specific, and code written from habits of React or other frameworks does not compile, so the exact API must be read from the files this skill points to.
---

# x4js

x4js is a TypeScript framework in which every component is a persistent object bound to a real DOM element. There is no virtual DOM, no template language, and JSX is optional.

The `x4js` package installs its own documentation for assistants. This skill tells you which file to read and when. Read before you write: these files describe the version installed in the project, which is more reliable than anything remembered or found online.

## Where the documentation is

In the project, under `node_modules/x4js/`:

| File | Read it when | How |
|---|---|---|
| `aiguide.md` | Before writing or reviewing any x4js code | Read it in full once per session. It is the set of rules for idiomatic x4js code. |
| `aicontext.md` | You need a class, a prop, an event or a method signature | Read "Overview" and "Class hierarchy" first, then only the sections of the classes you use. Search for the class name; each class has its own heading. |
| `aicli.md` | Creating a project, running the dev server, building, editing `x4.config.json`, or a build problem | Read the part that matches the command. |

When the documentation does not answer the question, read the TypeScript sources: the package ships them in `node_modules/x4js/src/`, with one folder per component in `src/components/`. The sources are the final authority.

If one of the files is missing, the installed version predates it or x4js is not installed yet. Fetch it from `https://raw.githubusercontent.com/rlibre/x4/main/<file>` instead, and tell the user that it may describe a newer version than the one installed.

## Working rules

**Do not invent an API.** Check every class, prop and method you use against `aicontext.md` or the sources. A plausible method name borrowed from another framework is the most common failure, and it looks correct until the compiler runs.

**Build with objects and keep them.** A component is created once and then updated through its own methods. Do not rebuild a tree to change a label, and do not touch the DOM when a component method does the job.

```ts
import { Application, Button, Label, VBox } from 'x4js';

const status = new Label( { text: "Ready" } );

const app = new Application( );
app.setMainView( new VBox( {
	content: [
		status,
		new Button( { label: "Run", click: ( ) => status.setText( "Done" ) } ),
	]
}) );
```

**Keep the application model small.** x4js deliberately has few concepts: components, state, events, data stores. Do not add dependency injection, controllers, repositories or extra stores because they are usual elsewhere; `aiguide.md` explains what to use instead.

**Use the command line for the build.** `x4js create`, `x4js dev` and `x4js build` cover project creation, the dev server and the production build; do not write a bundler configuration. Prefer `npm run dev` and `npm run build`, which run the copy of the command installed in the project. A bare `x4js` may run an older global copy.

## Before you finish

- Every x4js symbol in the code you wrote was checked in the documentation or the sources.
- The project type-checks (`npx tsc --noEmit`) when a TypeScript configuration is present.
- If the documentation was wrong or silent about something you needed, say so to the user instead of working around it quietly: the library author uses these reports to fix the documentation.
