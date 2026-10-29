# x4: to do

Things noted for later, about the library and its command line. Nothing here is decided, unless it says so.

## Documentation of State, on the site

- Add a page about State (`makeState`, `on`, `watch`, `loadPState`) to the documentation of x4js.org, in `C:\dev\rlibre\x4-site\astro`. It is no longer experimental.

## Theme

Left from the colours that did not follow the scale `--color-primary-*` (reported on 2026-10-21, Timex):

- Popup is transparent, without border: it keeps the look it had (its variables did not exist). A plain Popup probably wants `--popup-background: var( --background-primary )` and a border: to decide.
- Not a colour, found with them: `--scrollbar-size` is read by Gridview and Spreadsheet (`right`, `bottom`, gridview.module.scss and spreadsheet.module.scss) and defined nowhere.


## Dialog: the cursor of its title bar

- Change the cursor of the title bar of a Dialog (asked on 2026-10-21). Today its title bar (`.caption.caption-element`, dialog.ts) has no cursor of its own, even when the dialog can be moved by it (Popup gives it a `CMover` when `movable`); only a popup of class `popup-caption` gets `cursor: move` (popup.module.scss). To decide: `move` or `grab` / `grabbing` while dragged, and only when the dialog is movable.

## Drawer

- A Drawer: a panel that slides in from an edge of the page (left, right, top, bottom) over the content, and goes away by a click outside or Escape (asked on 2026-10-21). x4 has nothing of the kind today. Nothing is designed: a Popup or a Component of its own, a mask behind it or not, pushing the content or over it.

## Fields with their label above

- A style of `TextEdit` with the label above the field, not on its left (asked on 2026-10-21); the same for the other fields that have a label: `AutoComplete` (a TextEdit), `Combobox` (both have `label` and `labelWidth`), `TextArea` (`label`). Decided: a class (2026-10-21), its name to choose.

## Box is a `<div>` (2.3.26)

- The gallery (demo) still builds its page with `tag: "div"` (page.ts): useless, it uses x4js 2.3.28.

## MasonryBox

- To revisit: it does not seem up to date any more (2026-10-21). Found while building the gallery (read, not checked): `setItems` does not measure the new items (boxes.ts, around line 600: `resizeAllItems( )` is not called), and only the elements of the class `content`, which is not documented, are measured.

## DataStore

- A paginated DataStore: one that holds a page of the records at a time and asks for the others when they are needed (asked on 2026-10-13; nothing is designed).
- The loading from an url is to be reviewed (`url`, `autoload`, `solver`, `load`, `reload`, `DataProxy`, deprecated in 2.3.19): `load(url)` throws on a store created with `data` or without `url` (no proxy); an HTTP error is not reported (`await load()` on a 404 resolves); two `load()` that cross apply the answer that comes last, not the last asked.
- `_convertField`: a field `array` stops in a `debugger;` (the devtools stop at each `unSerialize`), and its records are not converted (`data.array( ctor )` builds a model that nothing reads). A field `bool` is not converted either: `"false"` stays a string, which is true.

## Fixes that change what existing code gets

Found by a review of the sources on 2026-10-13. Each one is a real defect, but an application may have been written around it: to do in a version that says so.

- `addDOMEvent( name, handler, prepend )`: `prepend` is not read by `addEvent` (`core_dom.ts`), the handler always goes last. Honouring it puts first the handlers of the applications that pass `true`. In x4 itself only `DropdownList` passes it (`combobox.ts`, its `mousedown`), on a node where it is the only handler unless `dom_events` has one.
- A DOM handler is called once for each ancestor that listens to the same event (`dispatchEvent`, `core_dom.ts`): every node that has a handler has its own native listener, and each of them walks again from the target to the top. Enter on a `Button` in a `Dialog` (both listen to `keydown`) clicks the button twice. Seen on 2026-10-21: the backspace of `Keyboard` erased two letters (its key listens to `pointerdown` for its autorepeat, the keyboard too); worked around in `Keyboard`, which skips an event it already handled. To walk once for an event (e.g. a mark on the event, set by the first walk) changes how many times the handlers of every application are called. Seen in Timex (2026-10-21): Enter on a button of a `Dialog` fired two `btnclick`, OK added the entry twice; worked around by a flag `busy` in the `btnclick` (`entry-dialog.ts`, `preview.ts`). Expected there: one walk for an event, e.g. a `WeakSet` of the events already walked, at the top of `dispatchEvent`.
- `ev.stopPropagation( )` in a handler does not stop this walk: only `preventDefault( )` does (`core_dom.ts`). The handlers of the ancestors are still called: a click on the arrow of a `Treeview` folder, whose handler stops the propagation, also selects the line. To test `ev.cancelBubble` in the walk would stop the handlers of the ancestors of every application that calls `stopPropagation( )`. Seen in Timex (2026-10-21): to stop Enter in a `textarea` before the `Dialog`, `preventDefault( )` is needed, which also takes off the new line; worked around by `preventDefault( )` + `stopPropagation( )`, then the new line put back with `setRangeText` (`entry-dialog.ts`, `noteKey`).
- `prependContent( [a, b, c] )` puts the items in the reverse order (`c b a`): each one is inserted first, one after the other (`component.ts`). An application that gives its array reversed, to get the order it wants, would get the other one. In x4 itself the only call gives one item (`Listbox.appendItem`).

## Spreadsheet

Found by the review of 2026-10-13, put on hold on 2026-10-14. "Seen" means reproduced in the browser (projets/x4test), "read" means followed in the code only.

- A click on a column header selects the cell (0,0), with a `selectionChange`, and nothing is drawn as selected (seen: `npm run sheetsel`). `targetCell` stops on the first element of class `cell`, and the cells of the header and of the footer have that class too; it returns `{ ref: undefined }`, which the `click`, `dblclick` and `contextmenu` handlers take for a cell (`mousedown` tests `ref.row!==undefined`). The end of a column resize, whose `click` comes from the sizer in the header, does the same.
- `Store.setData` keeps a row index as the count of rows: `if( row > _maxrows ) _maxrows = row`. Filled by `setData` alone, a store has one row less than it holds, and its last row is never shown nor editable (read). `setMaxRowCount` that reduces keeps the row of index `rows` in the map (`row <= rows`), which comes back if the count grows again.
- After a change of the store, the selection keeps only the cells that hold data (`hasData`): a selected empty cell leaves it without `selectionChange`. When the `cellChange` handler of an application writes another cell, Enter after an edit sends the selection to the row 0 (read).
- A column of type `date` whose value is a string makes `Intl.DateTimeFormat.format` throw, and no row is drawn; the editor of such a cell starts empty (read). The `Gridview` turns such a string into a `Date`.
- `setStore` does not detach the store it replaces: the closure given to `off` is a new one. The old store still redraws the grid and keeps it alive; after `setStore( null )`, a change of the old store throws (read).
- `navigate` on a store without rows selects the row 0, or the row -1 (End, arrows up, left, right), with a `selectionChange` (read). The `Gridview` returns when there is no row.
- `cellClassifier` is not applied to a fixed column, nor called for an empty cell; `rowClassifier` is not applied to the cells of the fixed part (read).
- `_scrollToIndex` calls `scrollIntoView` on the cell of column 0, which is in the fixed part when that column is fixed (plausible: the root of the grid may scroll).

## DockingView

- What a panel shows loses its scroll position when the layout changes: its box is moved. Checked on 2026-10-22: any element moved to another parent goes back to `scrollTop` 0 (a `<div>` too), so DockingView would keep the scroll of its panels before the move and set it back after.
- Closing a tool that is beside others does not make its band narrower.
- A tool cannot be collapsed: kept where it is, reduced to its title, and opened again with a click (asked on 2026-10-12; nothing is designed).

## Stylesheet

- Deprecated in 2.3.21: the CSS variables (`setStyleVariable`, `--x` in the stylesheets) do what rules added at run time did, and nothing in x4 uses it. To remove in a later version.

## Dates

- The fields of date and the Calendar follow the patterns of the language (`date_format`, `date_input_formats`), not the locale (2.3.26, `Application.setLocale`): with a French language and an en-US locale, a field shows 22/10/2026 and a grid 10/22/2026. To make them follow the locale, the input of a date too (decided on 2026-10-22: later).
- `date_diff( date1, date2, options )`: `options` is read nowhere and no doc says what it is for (to think about: days, a precision, "in 5 minutes" / "5 minutes ago"...).

## i18n

- Translations loaded on demand (asked on 2026-10-15; nothing is designed): a language, or a part of it, fetched when it is selected or first needed, instead of being in the bundle.

## ColorInput

- `-` typed in the field (asked on 2026-10-15; nothing is decided): transparent, or "no color" (`null`) in a `nullable` field? With `alpha: false`, refused as a text that cannot be read? `transparent` is already read (`Color.setValue`). To keep `-` shown when the field is left, `_format` would return it while the color is transparent.
- A format selector as in the devtools (shift+click on the swatch: hex, rgb, hsl), instead of the form of the text typed.

## Visual inconsistencies

- No style of scroll bar: to align a header on the columns of a `Treeview`, the width of the bar must be known. x4 has `getScrollbarSize( )` (core_tools, used by Header); `--scrollbar-size`, read by Gridview and Spreadsheet, is defined nowhere (see Theme).

## x4 extra

- To think about (2026-10-29): put Monaco (`src/components/monaco`) in a folder of its own, "x4 extra", and the components that will join it. Nothing is designed.

## Seen while writing Timex: to decide

Noted on 2026-10-21.

- **`this.refs` exists only on `Box`**: `Component` has none, and `this.refs.x = ...` throws a `TypeError` at run time (now said in aicontext). In an async event handler the error goes unnoticed: in Timex, the button OK of the input dialog seemed to do nothing. To decide: initialize `refs` in `Component`.

## Found while building the gallery

Reported by the agent that built the gallery, in demo (2026-10-21): read, not checked.

- **Form**: its fields are stretched horizontally.
- **Button**: the style of a disabled button with the class `outline` (in a disabled Box).
- **Box**: `.x4box` has `align-self: stretch`.
- **Keyboard**: its `focusin` listeners are never removed; its id is fixed (`v-keyboard`).
- **Calendar**: under 314px wide, Sunday is cut.
- **ColorPicker**: no prop `change`.
- **PropertyGrid**: it ignores the width and the height it is given (x4test puts it in a VBox of a fixed height).
- **`selectionChange`**: a `Treeview` gives items, a `Gridview` may give `null`.
- **Canvas**: no `position: relative`.
- **Tabs**: its padding has no effect.
- **BtnGroup**: `reverse` is not used; its icons are white when `packed`.
- **Breadcrumbs**: the hover is on `#text`; a `margin-bottom` of 2em; `BreadcrumbElement` is not exported.
- **TextEdit**: the icons of its gadgets cannot be seen.
- **Types not exported**: `ComboboxProps`, `VideoProps`, `HeaderProps`.
- **aicontext**: missing `MenuItem.checked`, `MessageBox.show`, `PromptBox.show`, `PropertyGrid.enableGroup` and `loadProperties`, `Dialog.show`.

## Image

- To revisit: old code, to check that it is still right (asked on 2026-10-26). Seen while using it in Carousel (read, not checked):
  - `lazy` is written as `loading="true"` / `"false"`: the browser knows `"lazy"` and `"eager"` only, so `lazy: true` does nothing.
  - `src` is required, and `setImage( "" )` (or `clear( )`) puts a transparent gif of 1 pixel, not an empty image: no way to tell "no image" from an image.
  - `new Image( { ... } )` infers its props from the literal object (its class is generic on `P`): it cannot be put in an array of `Component` without `new Image<ImageProps>( ... )`.
  - `candrop`: the item of its context menu that clears the image is named `_tr.global.cut` ("Couper"), and the menu is there even with nothing to clear.

## Timeline as the steps of a wizard

- The steps of an `AssistBox` (1 ✓ — 2 ● — 3 ○) are a horizontal `Timeline` (`vertical: false`): `done` fills the mark, the line to the next step is in the accent when it is done and dashed after a step not done, `click` gives the item (back to a step: `assist.select`). Decided on 2026-10-26: no component of its own. The link to the `AssistBox` is code of the application (`pageChange` → `setItems`, `click` → `select`).
- Missing in `Timeline` for that: the step in progress, `current?: boolean` on `TimelineItem` (the mark outlined in the accent; today an item is done or not), and maybe the number of the step in the mark when it has no `icon` (today the mark is empty). To try first in the sandbox: an `AssistBox` with a horizontal `Timeline`, nothing changed, to see what is really missing.

























