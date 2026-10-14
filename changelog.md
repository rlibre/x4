# Changelog

What changes in x4js, the library and its command line. The newest first.
A version gets its date when it is published.

## 2.3.19

### Application

- `mountPoint` is honored: the main view is mounted in the element it selects, whenever `setMainView` is called, a page whose script is a module too. An app that gives `mountPoint` has to check its layout: its view is in that element, not in `<body>`.
- `fireGlobal` right after `setupSocketMessaging( )`: the message is sent once the socket is open, those fired while it connects are dropped (`send` throws on a socket that connects).

### DataStore, DataView

- The filters `<`, `<=`, `=`, `>=`, `>`, `<>` on a field `int`, `float` or `date` compare numbers, a date by its time: `{ op: "<", field: "age", value: 9 }` keeps the ages under 9, not those whose text comes before `"9"`. `value` can be a number. A field that is null passes no comparison but `<>`.
- Sort on several fields: a `callback` follows `ascending`, and two records it finds equal are sorted by the next field. `numeric: true` sorts by the numbers of the values (Gridview gives it for its columns `number`, `money`, `percent`, `checkbox`): `"9"` comes before `"10"`.
- A filter whose `value` is a `RegExp` is tested on the field as it is: `caseSensitive` does not apply to it, the regexp handles the case (`/^jo/i`).
- `moveTo( other )` gives the records to `other` and empties the store: the two stores do not share the same array.
- A model whose class declares an id while its parent class has one gives an assertion (`cannot define multiple record id`). A class without decorators of its own gives none.
- Deprecated: the loading from an url (`url`, `autoload`, `solver`, `load( )`, `reload( )`, `DataProxy`). It is to be reviewed; load the data, then give them to `setData( )`.

### Form

- `validate( )`: the values that the validator changes are written back in the fields that carry the name, whatever they are (`Select`, `TextArea`, `Combobox`, `Rating`...), and in every radio of a group: the one that holds the value is checked.
- `setValidator( )` called again replaces the validator.

### Rating

- Without `steps`, a rating has its 5 stars.
- A click on a star sets the value to its number (1 for the first) and fires `change` once, also after `setSteps( )`. `value` is the count of stars lit, for the props, `setValue` and the click alike.
- `setShape( icon )` redraws the stars with the icon.
- In a `Form`, the `name` is on the rating: `setValues( { note: 3 } )` lights 3 stars, `getValues( )` gives the number. The rating has no hidden `<input>` any more: a `<form>` sent by the browser itself does not get the value.

### State

- The methods of an array that move its elements (`shift`, `unshift`, `splice`, `sort`, `reverse`) keep the state right: the array holds the objects themselves, and a change of an element gives one event, on the path where the element is now (`items[0].n` after a `shift`).
- An object written back where it already is fires nothing, as for the other values (`state.items[0] = state.items[0]`).

### Router

- The back button of the browser calls the route that `navigate( )` calls: the first that matches, in the order of `get( )`. `"/*"`, declared last, is the route for the rest (`params.wild`); for what runs at each navigation, the event `change`.
- The handler gets the same `path` from both, as in the address: `"/detail/5"`, without `#`.
- The parameters are decoded: `/detail/caf%C3%A9` gives `params.id === "café"`. A lone `%` is left as it is.

### Command line

- `x4js <command> --help` (or `-h`) shows the help, which now gives the options of every command.
- `x4js templates` takes no argument: one given is an error.
- `dev --open`: when no browser can be started (no `xdg-open` on Linux), a warning is shown and the server goes on.
- `copy`: `to` accepts environment variables (`$NAME`), as the other paths do. It is checked once expanded: it cannot go out of `outdir`, nor be on a drive of its own (`"D:assets"` on Windows).
- `copy`: a `from` that does not exist gives a warning (`copy: not found: …`). In `dev`, its folder is watched: the file is copied as soon as it is created.
- A `.svg` imported from a package (`import icon from "@acme/icons/close.svg"`) is found in `node_modules`, and is a `data:` URL in base64 as a local one.
- `.less`: when `less` is not installed, the error is not kept: once `less` is installed, the next build of `dev` uses it.
- `create`: when a file of the template cannot be downloaded, the folder is removed once every other download is over. A path of the template that holds a `\` is refused.

### Keyboard

- The letters of the language (`é è à ç`, `ä ö ü ß`...) are no longer on rows of their own above the space bar: they are on a page of their own, called by a key of the bottom row that shows the first two of them (`éè`, `äö`). The page of the letters has its five rows again, whatever the language. A language that adds no letter (`en`) has no such key.
- New page of the signs that the letters do not have (`- / : ; ( ) € & @ "`, `\ | ~ _ § £ $ ^ %`, `[ ] { } < > = + * #`), called by the key `#+=` of the bottom row.
- On these two pages, `Abc`, at the place of the key that called the page, comes back to the letters. Shift changes the case of the letters of the language, as it does on the page of the letters.
- `mode` gives the page that is shown: `"alpha"`, `"accents"`, `"symbols"`, `"number"` or `"date"`. On the page of the letters it was `"lower"` or `"upper"`: the case is now the new field `upper`. The class of the page follows `mode`: a stylesheet that styled `.lower` or `.upper` has to style `.alpha`.
- The keys of each page have a color of their own: white for the letters, `--keyboard-accents-color` for the letters of the language, `--keyboard-symbols-color` for the signs. The key that calls a page has its color. New CSS variables: `--keyboard-key-color`, `--keyboard-accents-color`, `--keyboard-symbols-color`.

### PDF

- Accented letters and the signs of Windows-1252 (`é à ç œ € … « » ’ ™`...) are written as they are. The text was written in UTF-8, which the font does not read: `é` came out as `Ã©`. A character that Windows-1252 does not have comes out as `?`. `measureText` gives these characters their own width: `align: "center"` and `"right"` are right with them.
- `text( )` writes every text in WinAnsiEncoding, one that starts with `(` too: `"(note) total"` is shown as it is.
- Bold: `bold: true` in the options of `text( )` writes in Helvetica-Bold. `measureText( str, size, bold )` measures it.
- New `path( segments, fill, stroke?, lineWidth? )` on the page: a path of `m` (move), `l` (line), `c` (curve) and `h` (close), filled, outlined, or both. `null` for what is not drawn.
- Colors were wrong, all but black: their components were written from 0 to 255, where PDF reads them from 0 to 1. `#808080` came out white.
- New props of the builder: `title`, `author`, `subject`. The reader shows the title in place of the name of the file.
- The document is printed at its size, not fitted to the paper (`PrintScaling /None`). It is a PDF 1.6.
- New `buildAsync( )`: the same document, its streams compressed (`FlateDecode`, by the `CompressionStream` of the browser). `build( )` does not compress, as before.

```ts
const pdf = new X4PDFBuilder( { title: "Invoice 42" } );
pdf.page( 595, 842, ctx => {
	ctx.text( "Total : 1 250 €", 50, 800, 14, { bold: true } );
	ctx.path( [ ["m", 50, 700], ["l", 150, 700], ["c", 170, 720, 170, 760, 150, 780], ["h"] ], "#7cc7ff", "#000000" );
} );
const bytes = await pdf.buildAsync( );
```

- New `ctx.barcode( type, text, x, y, w, h, opts? )`: a Data Matrix (`"datamatrix"`) or a Code 128 (`"code128"`), drawn in the PDF without any dependency. A Data Matrix is the square of side min( w, h ), (x, y) its bottom left corner; a Code 128 has its bars on w x h. The quiet zone is left to the page: 1 module around a Data Matrix, 10 on the sides of a Code 128. `opts.color`: black when not given.
- `opts.gs1`: the text is a GS1 element string, its AIs between parentheses (`"(01)03400930000120(17)270101(10)AB12"`). FNC1 starts the code and ends the fields of variable length: a GS1 DataMatrix, a GS1-128.
- Data Matrix: ECC200, square, from 10 x 10 to 26 x 26: up to 44 characters or 88 digits, characters from 0 to 255. Code 128: ASCII, its sets A, B and C chosen for the shortest code. A text that does not fit, or a character that cannot be encoded, throws an error: a code is never cut.
- New `renderBarcodeImage( type, text, opts? )`, for the screen: the same codes as an SVG image (`data:image/svg+xml,...`), for the `src` of an `Image` or of an `Icon`. On white, with its quiet zone: it can be read on a dark theme too. `opts.module`: the size of a module in px, 4 when not given; a Code 128 is 50 modules high. It is in `core_pdf` because it shares its encoders; it is the only function of the module that needs the DOM.
- `PageContext`, the type of the `ctx` given to `page( )`, is exported: a function that draws on a page can name it.

```ts
pdf.page( 595, 842, ctx => {
	ctx.barcode( "datamatrix", "G1234K7", 50, 700, 21, 21 );
	ctx.barcode( "code128", "(01)03400930000120(17)270101", 50, 600, 200, 40, { gs1: true } );
} );

new Image( { src: renderBarcodeImage( "datamatrix", "G1234K7" ) } )
```

## 2.3.18 (2026-10-13)

### Command line

- `outdir` cannot be a folder that contains the project (`".."`, or a variable that points to a parent): `x4js build` empties the output folder before it builds, so such a folder is refused with an error, as the project root itself is.

### Clipboard

- New: the clipboard of the system, in `core_clipboard`: a text, an image, files. It keeps `navigator.clipboard` out of the applications: that it is missing out of https, and that the browser may refuse, is handled there.
- `setClipboard( data )` and `getClipboard( )`: from a menu or a button. They are asynchronous and never fail: `setClipboard` gives `false` when the system refused. What the application set last is kept, and it is what `getClipboard` gives when the system refuses or cannot be asked (a page that is not served in https): copy and paste still work inside the application.
- `canReadClipboard( )`: `false` when `getClipboard` has nothing to give, to disable a "Paste" item.
- `setEventClipboard( ev, data )` and `getEventClipboard( ev )`: in a `copy`, `cut` or `paste` event, where the browser gives its clipboard at once and asks nothing. `getEventClipboard` is the only way to read files.
- An image is written as a PNG: another format is converted. Files cannot be written.
- The events `copy`, `cut` and `paste` are known to `addDOMEvent` and to `dom_events`, with a `ClipboardEvent`.

```ts
// the keys of the user
this.addDOMEvent( "copy", ev => {
	setEventClipboard( ev, { text: this.getSelectedText( ) } );
} );

this.addDOMEvent( "paste", ev => {
	const data = getEventClipboard( ev );		// { text, image, files }
	if( data.image ) {
		ev.preventDefault( );
		this.setPicture( data.image );
	}
} );

// a menu, a button
new Button( { label: "Copy", click: ( ) => setClipboard( { text: this.getSelectedText( ) } ) } )

new Button( { label: "Paste", click: async ( ) => {
	const data = await getClipboard( );
	if( data.text ) {
		this.insert( data.text );
	}
} } )
```

### Gridview, Spreadsheet

- With a fixed column, the flex columns fill the grid up to its right edge: the width they share is the one of the scrolled part, which the fixed columns are not in.
- When a column was resized by its sizer, the body of the grid gets the width of its columns once the flex columns have taken what is left: every column is shown, and there is nothing to scroll beyond the last one.
- A double click on the sizer of a column makes it flex: a column that is not (it was given no flex, or its sizer was dragged) takes its share of the place that is left, with a flex of 1. To stop being flex, a column has its sizer dragged. In a `Gridview` the column is not sorted: this is the double click on the rest of its header.

### Gridview

- The selection is made of records, not of rows: when the grid is sorted or filtered, the same records stay selected, and `getSelection( )` and `getFirstSel( )` give them. What they return is the same: records, or `null`.
- A record that leaves the view leaves the selection, and `selectionChange` is fired: a filter that hides it, a record that is deleted, data that is replaced. The selected records that are still in the view stay selected.
- A click in a column header keeps the selection: it sorts or sizes the column. After a sort by a double click on a header, the grid scrolls to what is selected.
- New prop `multisel`: several rows can be selected. Ctrl + click (Cmd on a Mac) adds a row or removes it, Shift + click selects from the row that was selected last to the one that is clicked, Ctrl + A selects every record of the view, as the new method `selectAll( )` does. A click alone selects one row. `getSelection( )` gives all the selected records, and `selectionChange` too, in its `selection`. To select all keeps the id of each record: on a very large view it costs memory.

```ts
const grid = new Gridview( {
	store,
	columns,
	multisel: true,
	selectionChange: ev => remove.enable( !ev.empty ),
} );

const records = grid.getSelection( );		// every selected record, or null
```

- `setStore( )` closes the view of the store it replaces: a store that is not shown anymore does not redraw the grid, and does not keep it alive.
- A grid that leaves the document closes its view, and opens it when it comes back: out of the document it is not redrawn by its store, and its store does not keep it alive. Nothing has to be called by the application.
- A grid that comes back in the document (the one of a dialog that is opened again) draws its rows, and has its mouse handlers once: `dblClick`, `contextMenu` and the wheel act once for one gesture.
- A column whose `id` is not a field of the model (a column of actions) is drawn by its `renderer`: it has nothing else to draw it. A column that is a field still gives its `renderer` the records where the field has a value.
- The event `click` is fired by a click on a row, once the row is selected: `ev.context` is its record, as for `dblClick`. A handler given as `click` in the props is called from now on.
- One column has the mark of the sort, the one that is sorted, also when the sort comes from `sortCol( )`.
- The sort given in the props (`sort`) is applied whenever the grid comes in the document, however long after it was made. The sorted column is kept with the columns, not read in the header: a grid that leaves the document and comes back still shows it.
- With 200 rows and more, a notch of the wheel over a fixed column scrolls one row, as it does over the rest of the grid.
- The arrow keys do nothing in a grid that has no row.
- `getSelection( )` and `getFirstSel( )` only give records that exist: one that was deleted while the grid was out of the document is left out.

### DataStore

- A store finds its records by id when the model declares its id after other fields: its index is sorted by the field marked `@data.id( )`, the one `getById`, `update` and `delete` search, and no more by the first field. A view without a sort is in the order of the ids too. `unSerialize( data, id )` puts `id` in that field.

### DataView

- New methods `close( )` and `open( )`: the view stops following its store, and follows it again, filtered and sorted with what the store holds at that moment. A store keeps every view that listens to it, so a view that is not used anymore has to be closed, or it is still filtered and sorted at each change of the store. A view is open when it is made.
- A sorted view is sorted once when its store changes: records that compare equal keep the order they have after `sort( )`.

- One `view_change` for one change: `change` when the store changes, `filter` when the view is filtered. The view is filtered and sorted again before it, without an event for each of these steps: a `Gridview` is redrawn once.

```ts
const view = store.createView( { filter } );
...
view.close( );		// done with it
```

### Spreadsheet

- The cells of a fixed column follow its sizer while it is dragged, as its header does: they have the `data-col` of their column, by which the sizer finds them.
- A spreadsheet that comes back in the document (the one of a dialog that is opened again) draws its rows, and has its mouse handlers once: `dblClick`, `contextMenu` and the wheel act once for one gesture.
- With 200 rows and more, a notch of the wheel over a fixed column scrolls one row, as it does over the rest of the grid.
- `lock( false )` called once too many leaves the spreadsheet unlocked: it goes on drawing. The `Gridview` does the same.

### Popup

- A press outside the popups that close by themselves (`autoClose`) closes the group opened last; the next press closes the one before. A color picker or a context menu opened from a popup closes first, then the popup. One listener on the document serves all the popups, and it is removed when the last one closes, whichever it is.

### Dialog, MessageBox, InputBox, PromptBox

- The promise of `showAsync( )` is settled whatever closes the box: with the name of the button that was clicked, or with `null` when the box is closed without a button (Escape, the close box). The code that awaits it goes on.

### Keyboard

- New prop `locale` and new method `setLocale( locale )`: the language of the keys of the virtual keyboard, with or without its country (`"fr-FR"`, `"de-CH"`, `"pl"`). `"fr-FR"` when nothing is said.
- 22 languages: `cs` `da` `de` `en` `es` `et` `fi` `fr` `ga` `hr` `hu` `it` `lt` `lv` `mt` `nl` `pl` `pt` `ro` `sk` `sl` `sv`. A layout is an AZERTY, a QWERTY or a QWERTZ, plus the letters of the language (`é è à ç`, `ä ö ü ß`, `ą ć ę ł`...) on rows of their own, above the space bar.
- The countries whose keyboard is not the one of their language have theirs: `de-CH` (no `ß`), `fr-CH`, `it-CH` and `fr-LU` (QWERTZ), `nl-BE` (AZERTY). Any other country gets the keyboard of its language, and a language that is not in the list a QWERTY.
- `en` is a QWERTY.

```ts
const keyboard = new Keyboard( { locale: "de-CH" } );
keyboard.setLocale( "pl" );
```

### TextArea

- A `TextArea` and a `SimpleTextArea` handle all the props of `BaseProps`, as an `Input` does: they are the props they take.
- `placeholder` is shown, drawn as the one of an `Input`.
- `autofocus` and `required` are set on the field.
- The events `change` (at each key that is typed, the text is `ev.value`) and `focus` (`ev.focus_out`) are fired.
- New method `isValid( )`: `false` when the text is required and empty. A `Form` reads it: `validate( )` fails on a `TextArea` that is `required` and empty.
- `SimpleTextAreaProps`, `TextAreaProps` and `TextAreaEvents` are exported: an application can name them, to type its own props or to derive a class. `TextAreaProps` is `SimpleTextAreaProps` plus `label`: a `SimpleTextArea` has no label.

```ts
new TextArea( { label: "Comment", name: "comment", placeholder: "A few words...", required: true } )
new SimpleTextArea( { flex: 1, placeholder: "Your message", change: ev => send.enable( ev.value!=="" ) } )
```

### DOM events

- A component moved from one place of the document to another in the same task gets no `created`, also when it is moved into a node that is new: it was created before. A `DockingView` puts its panels in new boxes at each change of its layout, so a `Gridview` or a `Spreadsheet` in a panel goes on drawing its rows.
- Of several handlers of one event on one node, one that returns `true` stops those that follow it. Only `true` does: an arrow function without braces returns what its expression does (`( ) => panel.show( false )` returns the panel), and this stops nothing. The handler a component puts for itself is then always called, whatever the one given in `dom_events` returns.
- An event of `unbubbleEvents` that the browser does not bubble (`focus`, `blur`, `mouseenter`, `mouseleave`...) stops at the node that gets it: the handler of an ancestor is not called for one of its descendants. `focusin` and `focusout` are the ones that go up. Those of the table that the browser bubbles (`contextmenu`, `dragenter`, `dragover`) go up.
- `resized` is for the node that changed size only, as `created` and `removed` are for theirs: the handler of an ancestor is not called when one of its descendants changes size. `unbubbleEvents` has `resized`, the name that is sent.

### Component

- `content: 0`, in the props of a component, shows `0`: a number is a content as another.
- `loadPState`: a change of the state is written 500 ms later, also when the component left the DOM in between. The write has a timer of its own: the timers of a component are cleared when it leaves.
- `removeClass` and `toggleClass` skip the empty names that a space too many makes (`" a"`, `"a  b"`), as `addClass` does: the browser refuses an empty class name.

### Drag and drop

- `dragManager` forgets the dragged component when its drag ends: a drag of files that come from the desktop has no source, and its target must not be given one. The target that was left gets its `leave` at that moment, while the source is known.
- `DropInfo`, `DropCallback` and `DropFilterCallback`, the types of what `registerDropTarget` takes, are exported.

## 2.3.17 (2026-10-12)

### ColorInput, ColorPicker

- "No color" (`nullable`) is drawn as a fine checkerboard, the usual sign of what is transparent, in the swatch of the field and in the picker. It was a red line across, drawn on nothing, which could hardly be read on a dark theme.

### Combobox

- New prop `renderer`: a function that draws an item of the list, as the one of a `Listbox`. Without it, nothing changes. The field itself still shows the text of the item that is chosen.

```ts
new Combobox( {
	label: "Country",
	items: countries,
	renderer: item => new Label( { icon: flags[item.id], text: item.text } ),
} )
```

### Notification

- A notification follows the theme. Its background was white whatever the theme, and its text took its color from a variable that does not exist (`--color-gray-7`), so it had the color of the text around: on a dark theme, a light text on white. The background is now `--background-primary`, and three variables are new: `--notification-title-color` (`--text-primary`), `--notification-text-color` and `--notification-button-color` (`--text-ternary`). On the default theme the background is still white; the text is the grey it was meant to be.

### Progress, Gauge, Switch

- `Progress`: `min` and `max` may be left out, they are then 0 and 100. Without them the bar had no width at all. And the bar now starts at `min`: a value of 50 between 50 and 100 is an empty bar, where it was a full one (the value was divided by the range without `min` being taken off it first).
- `Gauge`: without `min` and `max`, the range is 0 to 100. Without them the needle was not drawn where it should.
- `Switch`: new prop `name`. With it, a `Form` reads and writes the switch as it does a `Checkbox`.

```ts
new Progress( { value: 30 } )                       // 30% of 0..100
new Progress( { value: 75, min: 50, max: 100 } )    // half of the bar
new Switch( { label: "Notifications", name: "notify", checked: true } )
```

### DockingView

- Tools can be docked above and under the contents: two more bands, `top` and `bottom`, between those of the left and of the right. They are for what is wide and low (a log, a list of results, a timeline). Their tools are side by side; one put above or under another makes the band higher.
- New prop `sides`, on the view and on a panel: the bands a tool may be docked in. The left and the right ones when nothing is said, as before: an application that does not use it behaves as it did. A tool is never offered a place in a band it may not be in, neither beside one of its tools nor as one of their tabs.
- `DockLayout` has two optional bands, `top` and `bottom`; a layout that does not use them does not have them, and is saved as it always was. A tool that a saved layout has in a band it may not be in anymore goes where the default layout has it.

```ts
const view = new DockingView( {
	sides: ["left", "right"],                                  // what tools may do, when they say nothing
	panels: [
		{ id: "tree", title: "Objects", content: tree },
		{ id: "log", title: "Log", content: log, sides: ["bottom"] },
		{ id: "page", kind: "content", content: editor },
	],
	layout: {
		left: { size: 180, root: { type: "stack", size: 0, panels: ["tree"], active: "tree" } },
		right: { size: 0, root: null },
		bottom: { size: 160, root: { type: "stack", size: 0, panels: ["log"], active: "log" } },
		content: { type: "stack", size: 0, panels: ["page"], active: "page" },
		floats: [],
		hidden: [],
	},
} );
```

### Input

- A number field built without a value no longer throws when it has a `step` under 1 or over 1. `setNumValue` empties the field when it is given no number (undefined, null or NaN), instead of formatting it.

## 2.3.16 (2026-10-09)

### DockingView

- New component: a view whose panels the user arranges by dragging their title.
- Two kinds of panels, which never mix. Tools are docked in a band on the left or on the right: one above the other, side by side, or as tabs. Contents (what is worked on, as the editors of an IDE) share the room between the bands: split, or as tabs.
- Props `floating` (tools can float above the rest) and `closable` (tools have a button that hides them); `showPanel()` brings a panel back where it was.
- The layout is plain data (`DockLayout`): `getState()`, `setState()`, `resetLayout()`, and the event `layoutChange`. With the prop `persist`, it is remembered in the storage of the application, floating panels included.

```ts
const view = new DockingView( {
	floating: true,
	closable: true,
	persist: "myapp.layout",
	panels: [
		{ id: "tools", title: "Tools", content: tools },
		{ id: "page", kind: "content", content: editor },
	],
	layout: {
		left: { size: 180, root: { type: "stack", size: 0, panels: ["tools"], active: "tools" } },
		right: { size: 0, root: null },
		content: { type: "stack", size: 0, panels: ["page"], active: "page" },
		floats: [],
		hidden: [],
	},
} );

view.showPanel( "tools", false );		// hidden; view.showPanel( "tools" ) shows it again
```

## 2.3.15 (2026-10-09)

### Shortcuts

- New: keyboard shortcuts, in `core_shortcuts`. A sequence is written as it is read: `"Mod+C"`, `"Shift+Mod+Z"`, `"Delete"`. `Mod` is the key of the commands: Ctrl on Windows and Linux, Cmd on a Mac.
- `Component.addShortcut( keys, callback, options? )`: a shortcut of a view. It works while the focus is in the component, and while the focus is nowhere if it is the last component with shortcuts that had it.
- `Application.addShortcut( keys, callback, options? )`: a shortcut of the whole application.
- A key typed in a field (`input`, `textarea`, `select`) is not a shortcut, unless the option `editable` is set. Nor is a key that what has the focus already used.
- `shortcutText( keys )` writes a sequence for the user: `"Ctrl+Z"`, `"⌘Z"` on a Mac.

```ts
class MyView extends VBox {
	constructor( props: BoxProps ) {
		super( props );

		this.addShortcut( "Mod+C", ( ) => this.copy( ) );
		this.addShortcut( ["Mod+Y", "Shift+Mod+Z"], ( ) => this.redo( ) );

		this.setContent( new Button( { label: "Undo", tooltip: shortcutText( "Mod+Z" ), click: ( ) => this.undo( ) } ) );
	}
}

Application.instance( ).addShortcut( "Mod+S", ( ) => save( ), { editable: true } );
```

### Popup

- A popup with `autoClose` (a menu, the picker of a `ColorInput`) now closes on any press outside of it, even when what is pressed stops the propagation of the event. The press is no longer cancelled (`preventDefault`): what is pressed handles it as usual.

### Core

- `Component.loadPState()`: a property set on the state it returns was never saved. It wrote the object the state was made from, which the state copies; it now writes the state itself.
- `JSON.stringify()` of a state, or of a part of it, no longer logs `state error, unable to find toJSON` for each object and array it goes through. The JSON was already right.
- `makeState()`: the example in its comment gave `"items.3"` as the path of an array element; it is `"items[3]"`.

## 2.3.14 (2026-10-09)

### ColorInput

- New `change` event, fired when the user changes the color (typing, eye dropper, picker). It gives the `Color` and its text, `"#rrggbb"`.
- New methods: `getColor()`, `getValue()`, `setColor()`, `setSwatches()`.
- New props, all optional:
  - `picker`: a click on the swatch opens a color picker.
  - `swatches`: colors offered in the picker, as a list or as a function called each time the picker opens.
  - `nullable`: "no color" can be chosen; the value is then `null`.
  - `format`: `"rgb"` (default, as before) or `"hex"`, how the field writes the color.
  - `name`: with it, a `Form` reads and writes the color.
- Answers to `queryInterface( "form-element" )`.
- The eye dropper button is as high as the field and easier to aim at.
- A color that is `null`, `undefined` or `""` shows nothing, instead of red or `rgb(NaN,NaN,NaN)`.

```ts
const input = new ColorInput( {
	color: "#126e9e",
	format: "hex",
	picker: true,
	nullable: true,
	swatches: ["#002a40", "#126e9e", "#8ad0f5"],
	change: ev => console.log( ev.value ),		// "#rrggbb", or null for "no color"
} );

input.setColor( "#ff0000" );					// does not fire change
```

### ColorPicker

- New props `swatches` and `nullable`: colors, and "no color", offered under the sliders.
- New methods: `getColor()`, `setColor()`, `setSwatches()`.
- The `change` event keeps `color` and gains `value`, the color as `"#rrggbb"` (`"#rrggbbaa"` when it is not opaque).
- After the eye dropper, the saturation marker follows the color that was taken.

```ts
const picker = new ColorPicker( { color: "#126e9e", swatches: ["#002a40", "#8ad0f5"] } );

picker.on( "change", ev => console.log( ev.value, ev.color ) );
picker.setColor( "#ff0000" );					// does not fire change
```

### PropertyGrid

- New type `'color'`: the editor is a `ColorInput` with its picker. `swatches` and `nullable` are passed to it; the callback receives `"#rrggbb"`, or `null` for "no color".
- The column of the titles is as wide as the longest title, and at most half of the grid. It was always half of it.
- A row has no box of its own anymore (`display: contents`): its background and its bottom line are carried by its cells. A stylesheet that styled `.row` has to style `.row > .cell`.
- New CSS variables, with the values that were hard coded: `--propertygrid-hover-background`, `--propertygrid-focus-background`, `--propertygrid-input-background`, `--propertygrid-group-color`.

```ts
new PropertyGrid( {
	groups: [ {
		title: "Text",
		items: [
			{ type: "string", name: "text", title: "Text", value: "Hello" },
			{
				type: "color", name: "back", title: "Background", value: null,
				nullable: true,
				swatches: ( ) => ["#002a40", "#126e9e"],
				callback: ( name, value ) => console.log( name, value ),
			},
		],
	} ],
} );
```

### Core

- `style` (props) and `setStyle()` accept numbers, as `setStyleValue()` did: `px` is added unless the property has no unit. New type `StyleProps`.
- `Rect.moveTo()` moved the rectangle to `( x, x )`; fixed.

```ts
box.setStyle( { left: 10, top: 20 } );
```
