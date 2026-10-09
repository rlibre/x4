# Changelog

What changes in x4js, the library and its command line. The newest first.
A version gets its date when it is published.

## 2.3.15

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
