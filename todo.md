# x4: to do

Things noted for later, about the library and its command line. Nothing here is decided, unless it says so.

## Documentation of State, on the site

- Add a page about State (`makeState`, `on`, `watch`, `loadPState`) to the documentation of x4js.org, in `C:\dev\rlibre\x4-site\astro`. It is no longer experimental.

## DataStore

- A paginated DataStore: one that holds a page of the records at a time and asks for the others when they are needed (asked on 2026-10-13; nothing is designed).

## Fixes that change what existing code gets

Found by a review of the sources on 2026-10-13. Each one is a real defect, but an application may have been written around it: to do in a version that says so.

- `addDOMEvent( name, handler, prepend )`: `prepend` is not read by `addEvent` (`core_dom.ts`), the handler always goes last. Honouring it puts first the handlers of the applications that pass `true`. In x4 itself only `DropdownList` passes it (`combobox.ts`, its `mousedown`), on a node where it is the only handler unless `dom_events` has one.
- A DOM handler is called once for each ancestor that listens to the same event (`dispatchEvent`, `core_dom.ts`): every node that has a handler has its own native listener, and each of them walks again from the target to the top. Enter on a `Button` in a `Dialog` (both listen to `keydown`) clicks the button twice. To walk once for an event changes how many times the handlers of every application are called.
- `ev.stopPropagation( )` in a handler does not stop this walk: only `preventDefault( )` does (`core_dom.ts`). The handlers of the ancestors are still called: a click on the arrow of a `Treeview` folder, whose handler stops the propagation, also selects the line. To test `ev.cancelBubble` in the walk would stop the handlers of the ancestors of every application that calls `stopPropagation( )`.
- `prependContent( [a, b, c] )` puts the items in the reverse order (`c b a`): each one is inserted first, one after the other (`component.ts`). An application that gives its array reversed, to get the order it wants, would get the other one. In x4 itself the only call gives one item (`Listbox.appendItem`).

## DockingView

- What a panel shows loses its scroll position when the layout changes: its box is moved.
- Closing a tool that is beside others does not make its band narrower.
- A tool cannot be collapsed: kept where it is, reduced to its title, and opened again with a click (asked on 2026-10-12; nothing is designed).
