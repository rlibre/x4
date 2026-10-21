# x4: to do

Things noted for later, about the library and its command line. Nothing here is decided, unless it says so.

## Documentation of State, on the site

- Add a page about State (`makeState`, `on`, `watch`, `loadPState`) to the documentation of x4js.org, in `C:\dev\rlibre\x4-site\astro`. It is no longer experimental.

## Theme

Colours that do not follow the scale `--color-primary-*`, reported on 2026-10-21 (Timex). Done (2.3.23): the base variables of `themes.scss`; the variables of the components point to globals of the theme, with no `color-mix` in the components; the colours of the rules go through variables; the variables read are all defined; MessageBox, InputBox and PromptBox by kind. Agreed, one block at a time, the light theme unchanged to the pixel:

- then a dark theme of x4, like the one of VS Code (asked on 2026-10-21); then use it in demo/gallery, in place of the dark rules of its main.scss (the gallery runs on the npm package: it needs the version that brings the theme);
- aiguide §18: what a dark theme defines (the danger scale, `--color-dialog-caption*`), to ask before writing it.
- Popup is transparent, without border: it keeps the look it had (its variables did not exist). A plain Popup probably wants `--popup-background: var( --background-primary )` and a border: to decide.
- Not a colour, found with them: `--scrollbar-size` is read by Gridview and Spreadsheet (`right`, `bottom`, gridview.module.scss and spreadsheet.module.scss) and defined nowhere.

## Drawer

- A Drawer: a panel that slides in from an edge of the page (left, right, top, bottom) over the content, and goes away by a click outside or Escape (asked on 2026-10-21). x4 has nothing of the kind today. Nothing is designed: a Popup or a Component of its own, a mask behind it or not, pushing the content or over it.

## Button toggle

- A toggle button: a Button that stays pressed after a click and is released by the next one, with its state readable and settable, and an event when it changes (asked on 2026-10-21). Button has nothing of the kind today (no pressed or checked state). Nothing is designed: a prop of Button or a class of its own, its look (the accent while pressed?), its value in a Form.

## Fields with their label above

- A style of `TextEdit` with the label above the field, not on its left (asked on 2026-10-21); the same for the other fields that have a label: `AutoComplete` (a TextEdit), `Combobox` (both have `label` and `labelWidth`), `TextArea` (`label`). Decided: a class (2026-10-21), its name to choose.

## Box is a `<fieldset>`

A `Box` is a `<fieldset>`, so that `disabled` reaches every field inside it. There may be a better way (asked on 2026-10-21): a `<div>` with `inert` (no click, no focus in the subtree) and `aria-disabled`, and a class for the look; or `disabled` given by the code to the fields of the box. What the `<fieldset>` costs:

- Chrome (seen, 2026-10-21): in a fieldset, a fieldset that scrolls loses its scroll (back to 0) when the content of a fieldset beside it changes. All three must be fieldsets: an HBox holding a VBox that scrolls and a VBox whose page is replaced. Found in demo/gallery (its navigation), worked around there with a `<div>` for the page.
- `min-height` on a Box does not reach the flex box inside it: its children are not stretched nor centered (read in the gallery).
- the style of a disabled button tests `[disabled]`, which a button in a disabled fieldset does not have (it is `:disabled`), button.module.scss (read in the gallery).

## MasonryBox

- To revisit: it does not seem up to date any more (2026-10-21). Found while building the gallery (read, not checked): `setItems` does not measure the new items (boxes.ts, around line 600: `resizeAllItems( )` is not called), and only the elements of the class `content`, which is not documented, are measured.

## DataStore

- A paginated DataStore: one that holds a page of the records at a time and asks for the others when they are needed (asked on 2026-10-13; nothing is designed).
- The loading from an url is to be reviewed (`url`, `autoload`, `solver`, `load`, `reload`, `DataProxy`, deprecated in 2.3.19): `load(url)` throws on a store created with `data` or without `url` (no proxy); an HTTP error is not reported (`await load()` on a 404 resolves); two `load()` that cross apply the answer that comes last, not the last asked.
- `_convertField`: a field `array` stops in a `debugger;` (the devtools stop at each `unSerialize`), and its records are not converted (`data.array( ctor )` builds a model that nothing reads). A field `bool` is not converted either: `"false"` stays a string, which is true.

## Fixes that change what existing code gets

Found by a review of the sources on 2026-10-13. Each one is a real defect, but an application may have been written around it: to do in a version that says so.

- `addDOMEvent( name, handler, prepend )`: `prepend` is not read by `addEvent` (`core_dom.ts`), the handler always goes last. Honouring it puts first the handlers of the applications that pass `true`. In x4 itself only `DropdownList` passes it (`combobox.ts`, its `mousedown`), on a node where it is the only handler unless `dom_events` has one.
- A DOM handler is called once for each ancestor that listens to the same event (`dispatchEvent`, `core_dom.ts`): every node that has a handler has its own native listener, and each of them walks again from the target to the top. Enter on a `Button` in a `Dialog` (both listen to `keydown`) clicks the button twice. To walk once for an event changes how many times the handlers of every application are called.
- `ev.stopPropagation( )` in a handler does not stop this walk: only `preventDefault( )` does (`core_dom.ts`). The handlers of the ancestors are still called: a click on the arrow of a `Treeview` folder, whose handler stops the propagation, also selects the line. To test `ev.cancelBubble` in the walk would stop the handlers of the ancestors of every application that calls `stopPropagation( )`.
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

## Sizers

- `CSizer` has no minimum: dragged to the left of the column, it gives a negative size, kept as the width of the column by the `Gridview` and the `Spreadsheet`; the body then gets a width smaller than its columns (read).
- `HSizer` and `VSizer` (types `-next`) leave `_onMouseMove` before they fire `resize`; and `isFlex` tests `flexGrow !== undefined`, which is always true (`""` when it is not set) (read).
- `pointercancel` is not handled: the sizer keeps its reference and goes on resizing while the pointer moves over it (plausible).

## DockingView

- What a panel shows loses its scroll position when the layout changes: its box is moved.
- Closing a tool that is beside others does not make its band narrower.
- A tool cannot be collapsed: kept where it is, reduced to its title, and opened again with a click (asked on 2026-10-12; nothing is designed).

## Stylesheet

- Deprecated in 2.3.21: the CSS variables (`setStyleVariable`, `--x` in the stylesheets) do what rules added at run time did, and nothing in x4 uses it. To remove in a later version.

## Dates

- `date_format( date, options )` does not read `options`: it gives `formatIntlDate( date )`, while its doc passes `Intl` options (`{ day: 'numeric', month: 'long' }`). The `Intl.DateTimeFormat( cur_locale, options )` line is in a comment; `cur_locale` is "fr-FR", changed by `_date_set_locale` only, not by `selectLanguage`.
- `date_diff( date1, date2, options )`: `options` is read nowhere and no doc says what it is for (to think about: days, a precision, "in 5 minutes" / "5 minutes ago"...).

## i18n

- Translations loaded on demand (asked on 2026-10-15; nothing is designed): a language, or a part of it, fetched when it is selected or first needed, instead of being in the bundle.

## ColorInput

- `-` typed in the field (asked on 2026-10-15; nothing is decided): transparent, or "no color" (`null`) in a `nullable` field? With `alpha: false`, refused as a text that cannot be read? `transparent` is already read (`Color.setValue`). To keep `-` shown when the field is left, `_format` would return it while the color is transparent.
- A format selector as in the devtools (shift+click on the swatch: hex, rgb, hsl), instead of the form of the text typed.

























