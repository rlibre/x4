# Changelog

What changes in x4js, the library and its command line. The newest first.
A version gets its date when it is published.

## 2.3.18

### Clipboard

- New: the clipboard of the system, in `core_clipboard`: a text, an image, files. An application does not have to call `navigator.clipboard` anymore.
- `setClipboard( data )` and `getClipboard( )`: from a menu or a button. They are asynchronous and never fail: `setClipboard` gives `false` when the system refused. What the application set last is kept, and it is what `getClipboard` gives when the system refuses or cannot be asked (a page that is not served in https): copy and paste still work inside the application.
- `canReadClipboard( )`: `false` when `getClipboard` has nothing to give, to disable a "Paste" item.
- `setEventClipboard( ev, data )` and `getEventClipboard( ev )`: in a `copy`, `cut` or `paste` event, where the browser gives its clipboard at once and asks nothing. `getEventClipboard` is the only way to read files.
- An image is written as a PNG: another format is converted. Files cannot be written.
- The events `copy`, `cut` and `paste` are known to `addDOMEvent` and to `dom_events`: no `dom.addEventListener` and no cast for them.

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
