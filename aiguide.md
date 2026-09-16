# x4js — AI Guide

This document explains how to write idiomatic x4 code.

For exact classes, properties and method signatures, always use `aicontext.md` or inspect the current x4 TypeScript sources.

**Do not invent x4 APIs.**

## 1. General rule

Use the simplest tool that fits.

x4 deliberately has a small application model. Do not introduce abstractions simply because they are common in other frameworks.

Prefer:

- TypeScript modules and imports
- classes when identity and lifecycle are useful
- plain objects for application data
- `State` for observable application state
- local events for things that happened locally
- `GlobalEvent` for application-wide or distributed messages
- `DataStore` for specialized tabular data
- persistent `Component` objects backed by the real DOM
- CSS and CSS variables for presentation and theming
- JSX only when it makes a complex component tree easier to read

Avoid introducing by default:

- dependency injection
- repositories
- controllers
- command buses
- binding frameworks
- multiple application stores
- wrapper layers around native browser APIs
- React-style component architecture

Before creating an abstraction, check whether TypeScript, JavaScript, the browser, or x4 already solves the problem directly.

---

## 2. Mental model

The main concepts are deliberately few.

### Component

A `Component` is a persistent TypeScript object associated with a real DOM element.

Use a `Component` when something has UI, DOM, lifecycle or component events.

Components are not temporary render descriptions.

Do not reason in terms of virtual DOM, reconciliation or repeatedly rendering component functions.

Components are persistent objects. When the UI changes, use their public API to update the existing instances rather than recreating them as render descriptions.

### State

`State` describes what currently **is**.

Use it for mutable observable application state.

```ts id="5phd4r"
const state = makeState({
    selectedDeviceId: "",
    connected: false
});
```

State remains ordinary property-oriented application data.

Do not create a specialized store abstraction around State unless the application has a demonstrated need for one.

### Events

Events describe what **happened**.

Use component/local events for communication between nearby objects.

For a simple event payload, `context` can carry the relevant identity or value when appropriate.

Do not put transient actions into State merely to trigger behavior.

### GlobalEvent

Use `GlobalEvent` for application-wide messages.

A GlobalEvent may also be transported between processes, clients or a server.

Views should not care how a GlobalEvent is transported.

In particular, do not expose WebSocket details to UI components merely because WebSocket is used as the transport.

### DataStore

Use `DataStore` for structured tabular data, especially components such as `Gridview` and `Spreadsheet`.

Do not use a DataStore as the general application State.

---

## 3. Component construction

For an application component derived from an x4 component, prefer:

```ts id="wx4z2p"
interface DeviceViewProps extends ComponentProps {
    device: Device;
}

class DeviceView extends VBox<DeviceViewProps> {
    constructor(props: DeviceViewProps) {
        super(props);

        this.setContent([
            // ...
        ]);
    }
}
```

Pass the component props to `super(props)`.

Do not automatically generate:

```ts id="y7mgvi"
super();
```

when the component expects props.

For derived application components, prefer building the component's main content explicitly after `super(props)`.

Ordinary nested x4 components may naturally use their `content` property where convenient.

---

## 4. References

Follow the existing x4 `refs` conventions.

Do not invent references that have not actually been assigned.

For example, do not generate code that later uses:

```ts id="6k48vt"
this.refs.temperature
```

unless that reference was actually created according to the component's ref convention.

When no later access is required, no reference is necessary.

---

## 5. DOM usage

x4 uses the real browser DOM internally.

Each `Component` is a persistent TypeScript object associated with a real DOM element.

Application code should normally work with `Component` objects and their APIs, not manipulate DOM elements directly.

Direct DOM access is possible, but should be rare.

Use it only when a browser API or a specific low-level operation cannot be expressed cleanly through the existing x4 API.

Do not generate direct DOM manipulation when an x4 `Component` method already provides the required operation.

In normal x4 application code, prefer:

```ts id="2dkh09"
label.setText("Ready");
button.setDisabled(true);
container.setContent([...]);
```

rather than manipulating the corresponding DOM elements.

The absence of a virtual DOM does **not** mean that application code is expected to manipulate the DOM manually.

The normal model is:

```text id="fqepqp"
Application code
      ↓
Component objects
      ↓
Real DOM
```

---

## 6. Objects vs JSX

Both are valid x4.

Object construction:

```ts id="ubp2j6"
this.setContent([
    new Label({ text: "Temperature" }),
    new Gauge({ min: 0, max: 100 }),
    new Button({ label: "Restart" })
]);
```

JSX may be preferable for a complicated tree.

JSX in x4 is construction syntax.

It does not imply a virtual DOM, reconciliation, functional rendering or a React-style application architecture.

Do not convert object-oriented x4 code to JSX merely because JSX is available.

Do not avoid JSX when it clearly improves readability.

The runtime model remains the same in both cases.

---

## 7. State usage

State is mutable.

Prefer direct, readable mutations:

```ts id="8qpf2j"
state.selectedDeviceId = device.id;
state.connected = true;
```

Do not introduce reducers, immutable update helpers or action objects merely to modify State.

Watch State when code genuinely needs to react to state changes.

Keep observation simple.

Do not create elaborate nested watcher abstractions merely to avoid observing a root State.

State answers:

> What is the current application state?

It should not become an event bus.

---

## 8. Events

Use events to report occurrences.

A child component can report that the user requested an operation, while its owner decides what the operation means.

Prefer explicit component ownership and events over introducing controllers or a command architecture.

Use typed event structures when the payload has meaningful structure.

For simple contextual information, use the existing `CoreEvent.context` mechanism when appropriate.

State and events have different roles:

```text id="f4gvwo"
State   → what is
Event   → what happened
```

Do not use State as a replacement for events.

Do not use events as a replacement for persistent application state.

---

## 9. GlobalEvent

Use `GlobalEvent` for messages whose scope is the application or distributed system rather than a local component relationship.

Global messages should normally use stable application-level names, for example:

```text id="5msmgk"
device.created
device.updated
device.deleted
device.telemetry
```

For CRUD-style notifications, sending identity can be sufficient:

```ts id="wz34qs"
{ id: deviceId }
```

The receiver can obtain the authoritative object through the application's model/API.

For high-frequency realtime information such as telemetry, carrying the actual data can be appropriate.

Do not force every GlobalEvent into the same payload strategy.

Most importantly:

> GlobalEvent represents the message, not its transport.

A view should normally not contain WebSocket-specific logic.

Whether a message is local, server/client or client/client should not change the view architecture.

---

## 10. Application models and server access

x4 does not require dependency injection, repositories or controllers.

Normal TypeScript modules and singletons are acceptable.

For example:

```ts id="fdjmdv"
class DeviceModel {
    // application-specific server operations
}

export const deviceModel = new DeviceModel();
```

A model may encapsulate server access directly.

Keep responsibilities simple:

```text id="t39sbp"
Model       obtains or modifies domain data
State       represents current application state
Component   presents that state
Events      communicate local occurrences
GlobalEvent communicates application-wide occurrences
```

Do not add additional layers unless they solve an actual problem.

---

## 11. Lists and trees

`ListItem.data` can contain the corresponding business object.

When the object naturally belongs to the item, prefer:

```ts id="esvskx"
{
    id: device.id,
    text: device.name,
    data: device
}
```

over creating an additional `id -> object` map without need.

Remember that selection semantics can differ between components.

Do not assume `Treeview`, `Listbox`, `Gridview` and `Spreadsheet` return the same kind of selection.

Check the current API.

---

## 12. Gridview and DataStore

`Gridview` is backed by a `DataStore`.

Use the DataStore/DataView model for grid data rather than turning general application State into a tabular store.

A `GridColumn` has its own exact contract.

Do not guess column properties, renderer signatures or selection types.

Check `aicontext.md` or the current source before generating Gridview code.

`DataStore` is a specialized tool, not a mandatory application architecture.

For very large remote datasets, do not assume loading the complete dataset into a local DataStore is appropriate.

---

## 13. Forms

Use `Form` as a form container and field discovery/validation mechanism.

Do not build a second binding framework around it by default.

`TextEdit` is useful for normal labelled fields.

Use raw `Input` when the lower-level control is what is actually needed.

Keep server/domain models separate from form presentation.

---

## 14. Dialogs

Prefer composition over subclassing `Dialog` when composition is sufficient.

For normal forms, build a `Dialog` containing a `Form` and the appropriate controls.

Use the actual Dialog and Button APIs documented by x4.

Do not invent generic modal APIs learned from other frameworks.

When asynchronous validation or saving must decide whether a dialog closes, check the exact behavior of `show`, `showAsync` and `btnclick` before choosing the implementation.

---

## 15. Long operations

Before inventing a task/progress abstraction, check existing x4 components.

For operations requiring progress text, percentage and error reporting, `ProgressionBox` already provides application-level UI for that purpose.

Use native `Promise` and `async` mechanisms for asynchronous execution unless another abstraction is genuinely required.

---

## 16. Timers and cleanup

`CoreElement` already provides named timers.

Use the exact timer API:

```ts id="paz1yj"
this.setTimeout("refresh", 500, () => {
    // ...
});

this.clearTimeout("refresh");
```

and similarly for named intervals.

Do not invent APIs such as `setTimer`.

Starting a timer with an existing name replaces the previous timer of that name.

Use the lifecycle and cleanup facilities already provided by `CoreElement` and `Component`.

---

## 17. Lifecycle

Component removal participates in the x4 lifecycle and cleanup system.

Do not assume that removing and later reinserting a component is equivalent to hiding and showing it.

For temporary visibility changes, use the component visibility mechanisms.

Use the existing lifecycle rather than manually reproducing cleanup behavior in application code.

---

## 18. CSS and themes

x4 components use CSS and CSS variables extensively.

Use the existing CSS/theming mechanisms.

Do not introduce a JavaScript theme abstraction simply to mirror CSS variables.

Presentation belongs in CSS when CSS already solves the problem.

---

## 19. Browser and TypeScript capabilities

Do not wrap native capabilities merely for architectural symmetry.

Examples include:

- TypeScript modules
- JavaScript objects and classes
- Promise
- async/await
- CSS
- browser APIs
- standard language mechanisms

An x4 abstraction is useful when it adds concrete application value, not simply because an abstraction layer could exist.

This does not mean application code should bypass x4 Components to manipulate DOM directly.

For UI, use the x4 Component API in normal application code.

---

## 20. Source inspection

The npm package distributes the x4 TypeScript sources.

When an API is unclear:

1. check `aicontext.md`;
2. inspect the installed x4 TypeScript source;
3. only then generate code.

The installed source can normally be found under the `x4js` package in `node_modules`.

Never infer an x4 API from React, Vue, Angular or another framework.

Never invent a plausible-looking x4 method.

Exact source code is preferable to guessing.

---

## 21. AI error classification

When generated x4 code is wrong, determine why before proposing framework changes.

There are three main possibilities:

1. documentation was insufficient;
2. the x4 API was ambiguous;
3. the AI made an error despite sufficient information.

Do not modify x4 architecture merely to accommodate habits learned from other frameworks.

Improve documentation when documentation is the actual problem.

Improve an API when the API itself is genuinely unclear.

Otherwise fix the generated code.

---

## 22. What good x4 code should look like

Good x4 application code should generally be:

- ordinary TypeScript
- explicit
- easy to follow
- directly connected to the application's domain
- light on framework ceremony
- unsurprising when read without specialized tooling

A typical application relationship may look like:

```text id="9sj16n"
Domain data
    ↓
Model
    ↓
State
    ↓
Components
```

Interactions remain similarly direct:

```text id="v1k1uv"
User interaction
       ↓
Component event
       ↓
Application operation
       ↓
State change / GlobalEvent
       ↓
Existing Components update
```

These diagrams are guidelines, not mandatory layers.

Do not introduce an object merely to fill one of the boxes.

The goal is not to use every x4 feature.

The goal is to build the application with the smallest set of mechanisms that keeps the code clear.

---

## Final rule

When generating x4 code:

> Prefer the simplest valid x4 solution that can be understood by reading the TypeScript.

If the solution requires several new architectural concepts to solve a simple application problem, reconsider it.

If the exact x4 API is uncertain, check the documentation or source instead of guessing.