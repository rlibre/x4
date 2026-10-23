# Changelog

What changes in x4js, the library and its command line. The newest first.
A version gets its date when it is published.

## 2.3.28

### Package

- The package has its `LICENSE` file (MIT), and `"license": "MIT"` in its package.json.

### Themes

- `--background-odd`: the background of a row out of two (#f9f9f9 in the light theme); the odd rows of PropertyGrid take it.

### TextArea

- `required: true` puts a `*` before its label, as on a TextEdit. Its colour: `--textarea-required`.

```ts
new TextArea( { label: "Comment", name: "comment", required: true } );
```

### Gridview, Spreadsheet

- Disabled, they are faded as a Box (`--box-disabled-opacity`).
- The bars of a `percent` column are centered in the height of the row.

```ts
grid.enable( false );
```

### Treeview

- The icons of the items are grey: `--treeitem-icon-color`. Disabled, the texts and the icons take the disabled colour.

### Button

- An outline button held down keeps its icon visible, in the colour of its text.

### Tabs

- The icons of the tabs are grey: `--tab-icon-color`.

### Input, TextArea

- The placeholder is readable in the dark theme: `--input-placeholder` is `--disabled-color-dark` (it had the colour of the background of the field).

### ColorInput

- In a narrow box, its field gets narrower: it no longer overflows (a horizontal scroll in a PropertyGrid).

### PropertyGrid

- The description of a group is under its title, smaller, in italics and indented; a collapsible group is as high as the others.
- The button of a collapsible group keeps its icon visible when it has the focus.

### MessageBox, InputBox, PromptBox, ProgressionBox

- The style of their big icon is for it only: an icon of their message, of their editor or of a line of their log keeps its own. The stars of a Rating in a PromptBox show the rating again (they were all coloured as checked, 64px high).

### Checkbox

- `icon`: an icon before its label; `label` is optional (an icon alone, with a tooltip).
- `cls: "button"`, as for Radio: a toggle button (`button outline` rounded). The box is hidden, its input still reached by Tab and the space bar. Its colours: `--checkbox-button-*`.
- `left` puts its label before its box again.
- `cls: "danger"`: checked in the red of the alerts, its box, or its button with `button danger` (`--checkbox-danger-color`, `--checkbox-danger-background`).

```ts
new Checkbox( { cls: "button", icon: icon_bold, tooltip: "Bold" } );
```

### Radio

- `button`: a border of the theme around each radio (`--radio-button-border`); the icon of the one checked is in the accent, an icon drawn in currentColor too; its text is no longer bold, so that its width does not change with its state.
- `cls: "danger"`: checked in the red of the alerts, its round, or its button with `button danger` (`--radio-danger-color`, `--radio-danger-background`). The colours of `button` go through `--radio-button-*`, the round checked through `--radio-check-background`.
- `button`: the hidden round keeps its input in the page, so that Tab and the arrows reach the radios; the focus of the keyboard is shown around them (`--radio-focus`).

```ts
new Radio( { cls: "button", icon: icon_folder, label: "Folders", name: "view", value: "folders" } );
```

### HSplitBox, VSplitBox, HSizer, VSizer

- A sizer between two boxes keeps its panel in the box: dragged to an edge, the panel stops at the space left (its flex neighbour at its padding), and at 0 on the other side. Its basis is `flex: 0 1 <size>px`.
- `HSizer` and `VSizer` say the child they resize in words: `"before"` or `"after"` (the default). A boolean still works: `true` after, `false` before.

```ts
new HBox( { content: [ list, new HSizer( "before" ), new VBox( { flex: 1 } ) ] } );
```

### Combobox

- Its label is on the right of its `labelWidth`, its colon against the field, as the label of a TextEdit: in a form, they line up.

### Video

- The image fills the box of the Video, fitted (`object-fit: contain`): a camera or a file no longer makes it overflow its box.
- `src`: a file to play, as a prop or a property; `stream` is optional (a stream wins over src).

```ts
new Video( { src: "movie.mp4", width: 320, height: 180, muted: true, autoplay: true } );
```

### PDF

- `X4PDFBuilder.buildBlob()`: the document as a Blob of type application/pdf; `buildURL()`: an object url of it.

```ts
iframe.setAttribute( "src", pdf.buildURL( ) );
```

### SvgBuilder

- `SvgText.verticalAlign` sets `dominant-baseline`, read by all browsers (`alignment-baseline` is ignored by Firefox before 149). `"bottom"` puts the bottom of the text on y, `"baseline"` its baseline: code that used them sees its texts move.
- `SvgText.fontWeight( "light" )` gives the weight 300 (`light` is no value of font-weight).

```ts
svg.text( 10, 40, "Total" ).verticalAlign( "center" );
```

## 2.3.27 (2026-10-22)

### MonacoEditor

- `x4js/monaco` builds again: it still used `@class_ns`, removed in 2.3.26.

### Shortcuts

- `isMac` is exported: true on a Mac, an iPhone or an iPad, where `Mod` is Cmd.

### Component

- `closest( selector )` and `Component.closest( dom, selector )`: the nearest component whose element matches a css selector, starting at itself (`parentElement` starts at the parent).
- `contains( other )`: true when a node, or the element of a component, is the element of the component or inside it.
- `Listbox` and `Treeview` find the item clicked with `Component.closest`.

```ts
const item = Component.closest( ev.target as Element, ".x4timeline > .item" );
```

### Timeline

- `Timeline`: events one under the other on a line, each with its icon in a round mark, a title, a sentence and its date. The date is written relative to now, in the locale ("il y a 2 heures", "yesterday"); without a date, no time is shown. A `done` event has its mark in the accent; the line to the next mark is in the accent when the next event is done, dashed after an event not done. `vertical: false` puts the events side by side; `renderer` gives what is beside the mark. A click anywhere in an event fires `click`, its item as `context`. Its colours: `--timeline-*`.

```ts
new Timeline( {
	items: [
		{ icon: branch, title: "New branch", text: "fix-notifications, from master", date: created, done: true },
		{ icon: review, title: "Code review", text: "Waiting for a reviewer" },
	],
	click: ev => this.openStep( ev.context ),
} );
```

## 2.3.26 (2026-10-22)

### CSS classes

- A component of x4 declares the prefix of its css class with `static classPrefix = "x4"`. `PopupCalendar`, `FileDialog` and `SvgComponent` have it too: `x4popupcalendar`, `x4filedialog`, `x4svgcomponent`.
- The decorator `@class_ns` and `x4_class_ns_sym` are removed.
- Migration: an application had no reason to use `@class_ns`: take it off (its class then has no prefix), or declare `static classPrefix = "my"` in the class. A css rule on `.popupcalendar`, `.filedialog` or `.svgcomponent` gets the prefix `x4`.

```ts
class Badge extends Label { static classPrefix = "my"; }		// mybadge x4label x4
```

### Locale

- The formats of numbers, amounts and dates follow a locale: the one of the language (`_tr.global.locale`: "fr-FR" for fr, "en-US" for en, "es-ES", "de-DE"), or the one `Application.setLocale( locale, currency )` forces. The currency is "EUR" by default. `Application.getLocale( )`, `Application.getCurrency( )`.
- `formatNumber( value, decimals?, grouping? )`, `formatMoney( value )`, `formatDate( date )`, `formatDateTime( date )`: in the current locale. Gridview and Spreadsheet format their columns number, money, date, date-time with them; Chart its labels, TickLine its tooltips (the decimal separator of the locale).
- `date_format( date, options )` reads its options: Intl in the current locale.
- A regional variant: a language based on another, with its locale.
- Migration: an application in another language than French gets its grids, charts and amounts in the formats of that language. To keep the French formats: `Application.setLocale( "fr-FR" )` at the start.

```ts
Application.setLocale( "fr-CH", "CHF" );
createLanguage( "fr-ch", "fr" );
addTranslation( "fr-ch", { global: { locale: "fr-CH" } } );
```

### Sizers

- `HSizer` and `VSizer` that size the panel after them (in a `HSplitBox`, the panel after a flex one) fire `resize` too.
- A `pointercancel` (a touch taken by the browser...) ends the resize: `stop` is fired, the moves after do not resize.
- The column of a `Gridview` or a `Spreadsheet` dragged by its sizer is 16px wide at least, the min-width of a cell.

### Box

- A `Box` (so `HBox`, `VBox`, `Form`, `Panel`, `Popup`...) is a `<div>`. Disabled, its content is inert (no click, no focus, no input), as before, and all of it is faded by `--box-disabled-opacity` (0.5): the labels and the components too, not only the native fields. A disabled Box in a disabled Box is faded once.
- In Chrome, a Box that scrolls keeps its scroll when a Box in it changes.
- Migration: a css rule of the application on `fieldset`, or on `:disabled` for the fields in a disabled Box, does not apply any more: use `.x4box[disabled]`. A Box that must be a `<fieldset>`: `tag: "fieldset"`.

```css
:root { --box-disabled-opacity: 0.4; }
```

### Form

- `Form` takes the type of its events as a second parameter, as `VBox` does: a class derived from it declares its own events.

```ts
interface EntryEvents extends ComponentEvents { save: EvChange; }
class EntryForm extends Form<FormProps, EntryEvents> { }
```

### ProgressionBox

- Its lines are in a fixed font, a `<div>` each (class `line`). An error is red, on a light red line with a red bar on its left; a warning the same in orange; no icon on the line (the title of a section and the count beside OK keep theirs). Their colours: `--msgbox-log-error-background`, `--msgbox-log-warning-background`.

### Theme

- `--alert-background-light` and `--warning-background-light`: the red and the orange at 15%.

### Gridview

- The sort arrow of a column takes the colour of the header (`--gridview-header-sort-color`): light in the dark theme.

### SettingsView

- Its sections have no frame and the background of the page (white in the light theme); their title is in the accent colour, without band (`--settingsview-section-title-color`).

## 2.3.25 (2026-10-21)

### Shortcuts

- The shortcuts of a view answer while the focus is nowhere only when the view is shown: the view of a tab not shown does not answer any more.

### Events

- `fire` calls each listener in a `try/catch`: a listener that throws sends its error to `console.error`, the next listeners are called, and the code that fires goes on. This goes for the events of a component and for `Application.fireGlobal`.

### Button, Form

- A `Button` is `type="button"`: in a `<form>`, Enter in a field does not click it (the browser clicks the first `submit` of the form). `attrs: { type: "submit" }` gives a submit.
- A `Form` is never sent by the browser: its `submit` is prevented (Enter in its only field would send it, and reload the page).
- A `Form` with `flex: false` has the height of its content (a toolbar, a line).
- Migration: a `Button` that must submit a `<form>` of the page (not a `Form` of x4) gets `attrs: { type: "submit" }`.

```ts
new Button( { label: "Send", attrs: { type: "submit" } } );
```

### Dialog

- A modal box (a `Dialog`, a `MessageBox`, an `InputBox`...) keeps the element that had the focus when it opens, and gives it back the focus when it closes, unless the focus was put elsewhere meanwhile. After an `InputBox` over a `Dialog`, Enter and Escape work again in the `Dialog`.
- Enter in a `textarea` or an element `contenteditable` is a new line: the dialog does not click its default button there; Ctrl+Enter (Cmd+Enter on a Mac) does. Out of a dialog, Enter in such a field is a new line too, not the move to the next field.

### Notification

- Its props of a component are given to it: `id`, `cls`, `style`...
- With `loading`, its icon turns.

```ts
new Notification( { id: "saving", title: "Saving", text: "report.pdf...", loading: true } ).display( 5 );
```

### Listbox

- `appendItem` on an empty list takes off its message "Empty list".
- `reselect`: a click of the user on the item already selected fires `selectionChange` again, with the same selection. For lists linked together whose view shows what was clicked last. `select( )` by the code, the arrows and a right click do not.

```ts
new Listbox( { reselect: true, items: clients, selectionChange: ( ev ) => showClient( ev.selection[0] ) } );
```

- `setItems` fires one `selectionChange`, after the items are drawn, with the selection they end with, when there was a selection before or there is one after; with `keepSel` and the same ids too.
- `checkable`: a case at the start of each line, with a renderer of yours too. `ListItem.checked` is its starting state. A click on the case, or Space for the last item selected, changes it and fires `checkChange { id, checked }`, without click nor selection. `getChecked( )` gives the ids checked, `setChecked( ids )` changes them without event. Its colours: `--listbox-check-*`.

```ts
const list = new Listbox( {
	checkable: true,
	items: [ { id: 1, text: "alpha" }, { id: 2, text: "beta", checked: true } ],
	checkChange: ( ev ) => console.log( ev.id, ev.checked, list.getChecked( ) ),
} );
```

### PropertyGrid

- Its editors have no id: the name of a property (`label`, `icon`...) is not an id in the page. `setPropValue` finds an editor by the name of its property.
- `live` works for a text and a password too: the callback at each key.

```ts
{ name: "title", type: "string", value: "Save", live: true, callback: ( name, value ) => preview.setText( value ) }
```

### ProgressionBox

- Its lines are in a `<pre>`, 10 lines high, which scrolls both ways: the box keeps its size. A string is text, an `UnsafeHtml` html.
- An error has its icon and is in red, and puts the title bar of the box in red, as the one of an error of MessageBox, until `clear( )`. `addWarning( text, perc )` adds a warning, its icon, in orange. After an error or a warning, `done( )` waits for OK, and shows their counts on the left of the bar, with the icon of an error if there is one, else the one of a warning: "2 errors / 1 warning". Their texts: `_tr.global.progression` (`error`, `errors`, `warning`, `warnings`).
- `addSection( title, perc )` starts a section, open: the lines that follow go in it. A click on its title folds it or opens it. Its title has the icon of the worst of its lines, an error or a warning.
- Ctrl+A in the lines selects them only, those of a folded section too.
- Its colours: `--msgbox-log-border`, `--msgbox-log-border-focus`, `--msgbox-log-error-color`, `--msgbox-log-warning-color`, and `--msgbox-log-scrollbar` for the thumb of its scroll bars, whose track is the background of the lines.

```ts
box.addSection( "folder 1", 0 );
box.addWarning( "data-4.csv: 2 empty lines skipped", 40 );
box.addError( "data-6.csv cannot be read", 60 );
```

## 2.3.24 (2026-10-21)

### Theme

- Themes: `Application.setTheme( name )` puts the class `x4theme-<name>` on `<html>`. `""` is the light theme, by default; `"dark"` a dark theme, like the one of VS Code. An application adds its own under `html.x4theme-<name>` in its css. `Application.getTheme( )` gives the name of the theme.

```ts
Application.setTheme( "dark" );
```

### Label

- The classes `right` and `al-right` put its content on its right.

### ProgressionBox

- Its lines are in a textarea read only: they are text, a markup is shown as it is written.
- `done( )` shows the button OK. After an error it waits for it; else it counts the seconds left, "OK (5s)", and closes the box at 0. A click on OK closes it at once.
- `clear( )` puts the box back as at the start: no line, no error, no button OK.

### Keyboard

- Backspace pressed once erases one letter.

## 2.3.23 (2026-10-21)

### Theme

- The greys of the theme are mixes of the two ends of the scale, `--color-primary-a0` and `--color-primary-a100`. This covers `--background-ternary`, `--text-secondary`, `--text-ternary`, `--disabled-background`, `--disabled-color-dark`, `--border`, `--border-light` and `--border-hover`. With the scale of x4 they keep their values (`#999`, `#e1e1e1`…); a theme that reverses the scale gets them light on dark. `--disabled-color` is `--color-primary-a0`.
- `--alert-color`, `--warning-color` and `--success-color` are white: the red, orange and green do not follow the scale.
- New global variables, which the components use: `--background-hover` (`#eee`), `--background-active` (`#ccc`), `--background-input` (white at 60%), `--disabled-color-light` (`#ccc`), `--icon-color` (black at 44%) and `--icon-color-active` (`--accent-color` at 64%).
- The variables of the components point to the global ones and follow the scale with them:
	- backgrounds, `--background-primary`: Listbox, Treeview, Menu, BtnGroup, TickLine, Chart, PropertyGrid and its gadgets;
	- texts, `--text-primary`: Input, Tag, the gadgets of PropertyGrid, the needle of Gauge;
	- the fields of Input and PropertyGrid, `--background-input`;
	- the outline buttons (`--ol-button-*`), the background of Switch, the icons of Label and of a pressed button;
	- the title and the icon of a tooltip, `--color-primary-a0`.
- Chart: its texts take `--text-ternary` (`#666`), its grid `--border`, its axis `--border-hover`. The dot of the needle of Gauge takes `--text-ternary`.
- `--accent-background-light`: the accent at 25%. DockingView takes it for a title under the pointer and for the place where a dragged panel will go (`--dock-preview-background`, new).
- SettingsView: a setting under the pointer takes `--color-primary-a20`.
- The colours of the rules go through variables of their component, which point to the globals: the background of Dialog (`--color-dialog-background`), the title of Listbox (`--listbox-title-background`, `--listbox-title-color`), the title of Panel (`--panel-title-background`), the lines of a ProgressionBox (`--msgbox-log-background`), Checkbox (`--checkbox-check-color`), Radio (`--radio-background`, `--radio-check-color`, `--radio-square-border-checked`), the thumb of Switch (`--switch-thumb`), a tab under the pointer (`--tab-color-hover`), the image of a tooltip (`--tooltip-image-background`).
- Select: its variables are defined (`--select-border`, `--select-border-focus`, `--select-background`) with `--select-color` for its text. Its arrow is drawn in `--select-arrow-color` (`--text-ternary`): a small triangle.
- SimpleTextArea, TextArea: the background and the text of an input (`--textarea-background`, `--textarea-color`), and `--textarea-selection-color` for the text selected.
- The variables that the rules read are all defined, with the look the components have: the text of the tabs (`--tab-color`, `--tab-color-selected`), of the title of Panel (`--panel-title-color`, which the title reads), of the days of Calendar (`--calendar-day-color`), of the items of Treeview (`--treeitem-color`, and `--treeitem-color-hover`, which the item under the pointer reads), all `--text-primary`; the background of Form (`--form-background`) and of Popup (`--popup-background`), transparent.
- Dialog, the hue slider of ColorPicker, Menu and Popup have no border colour nor radius read from a variable that does not exist; the empty rows of Gridview and Spreadsheet no background.

```scss
:root {
	--color-primary-a0: #1e1e1e;		// the greys and the borders follow
	--color-primary-a100: #f0f0f0;
}
```

### MessageBox, InputBox, PromptBox

- Only an error has its title bar and its icon in the colour of the alerts (`--msgbox-caption-background`, `--msgbox-caption-color`, `--msgbox-icon-color`). A question, an InputBox and a PromptBox have the title bar of a Dialog, and their icon in `--msgbox-question-icon-color` (the accent).
- A MessageBox has the class of its kind: `error` (by default) or `question`.
- The pen of an InputBox and of a PromptBox takes the colour of its icon.

```ts
MessageBox.show( "Delete it ?", [ "yes", "no" ], "Question", "question" );	// the title bar of a Dialog
```

### Color

- `new Color( )` reads every colour the browser knows: `hsl( )`, `oklch( )`, `color-mix( )`, and a variable that holds one (`"var(--border)"`).
- `mix( other, amount )` mixes two colours, alpha included: 0 gives the colour, 1 the other one.
- `darken( percent )` goes toward black, as `lighten( percent )` goes toward white. Both round each component.
- `luminance( )` and `contrast( other )` give the relative luminance and the contrast ratio of WCAG.
- `textColor( light, dark )` gives a copy of the one of the two colours that contrasts most with the colour: white or black when none is given.

```ts
const band = new Color( logo ).mix( new Color( "#000000" ), 0.2 ).toHexString( );	// 20% toward black
label.setStyleValue( "color", new Color( client.color ).textColor( ).toHexString( ) );
```

## 2.3.22 (2026-10-21)

### SettingsView, SettingItem

- New: `SettingsView`, a page of settings as the settings of VS Code. The summary of the sections is on the left, the sections on the right, one after the other. A click in the summary brings its section to the top, and the summary follows the scroll (event `sectionChange`).
- `SettingItem`: one setting, its name, what it does, then its controls. Its controls keep their values: in a `Form`, `getValues` / `setValues` read and write them.
- `searchable`: a field above the sections shows the settings whose name or description holds the words typed, without case nor accents. Escape empties it.
- The default texts come from `_tr.global.settings` (`search`, `nomatch`).

```ts
new SettingsView( { searchable: true, sections: [
	{ id: "editor", title: "Editor", content: [
		new SettingItem( { title: "Font size", description: "The size of the text, in pixels.", content: new Input( { type: "number", name: "fontSize", value: 14 } ) } ),
	] },
] } );
```

### i18n

- Two new languages, `es` and `de`, with every text of `_tr.global`. A key they lack is taken in `en`, then in `fr`.
- Their dates: `D/M/Y` in es, `D.M.Y` in de (`21.10.2026`), with their names of days and months.

```ts
selectLanguage( "de" );
formatIntlDate( new Date( ) );		// "21.10.2026"
```

### Keyboard

- The keys that draw the keyboard again (shift, `123`, `abc`, the accents, the signs) act on the click of their key, the others still on the contact (`pointerdown`): under WebKitGTK, the field keeps the focus and the keyboard stays shown.
- `numpadOnly`: on a number or date field, the keyboard stays on the pad, without the `abc` key back to the letters. The other fields keep all the keys.

```ts
new Keyboard( { numpadOnly: true } );
```

## 2.3.21 (2026-10-15)

### Panel, GridBox

- `Panel.setTitle( )` changes the text of the title: its icon stays.
- `GridBox.setTemplate( )` lays the box out: `grid-template-areas` is set in its style.

### Dialog, MessageBox

- A dialog puts the focus on its first field each time it is shown, not only the first time.
- `new Dialog( { content } )`: without `form`, `content` is the content of its form.
- `MessageBox.show( msg, buttons, title, "question" )` shows the icon of question.

```ts
new Dialog( { title: "Name", buttons: ["ok","cancel"], content: new TextEdit( { name: "name", label: "Name" } ) } ).show( );
```

### Chart

- A `yaxis.min` above the values, or a `yaxis.max` under them, draws an empty range at that bound, without NaN.
- `xaxis.step` under 0.5 shows a label on each point, the page is no longer stuck.
- A stacked serie without `values` counts 0.
- `xaxis.min` is not used: the doc says so.

### SVG

- `SvgIcon` keeps all the elements of its svg, and reads a svg that has a `%` (`width="100%"`): a data url is decoded only when it is encoded.
- `addStop( "50%", ... )` writes `50%`, `addStop( 20, ... )` writes `20%`.
- `strokeCap( "square" )`.
- `addClass( "" )` returns the item: it can be chained.
- `getNumAttr( )` gives 0 for an attribute not set, and the decimals of a value (`1.5`).
- The doc of `arc( )`: 0 is the top, 90 the right.

### PDF

- `ctx.image( jpeg, ... )` reads the size of the image in its frame header: a JPEG with an EXIF thumbnail gets its own size, not the one of the thumbnail.

### Command line

- `x4js create`: the tsconfig.json of every template sets `experimentalDecorators`, which the decorators `@data.*` of a `DataModel` need. An application created before has to add `"experimentalDecorators": true` to its `compilerOptions`.

### Gridview, Spreadsheet

- Their colours come from the theme: the backgrounds from `--background-primary`, the texts from `--text-primary`, the lines from `--border`. A dark theme (the scale `--color-primary-*` reversed) gives a dark grid, without redefining the variables `--gridview-*` or `--spreadsheet-*`.

### Gridview

- `selectItem( id, true )` on a grid that is not shown yet selects the row without an error; nothing is scrolled.

### Keyboard

- A double click, or a quick double tap of a finger, on a key writes it twice, not three times: a key is read at each contact (`pointerdown`), the focus stays in the field.

### Video

- Its class is `x4video`: its stylesheet applies (a black background, the player over all the box). A stylesheet of the application that targets `.video` has to target `.x4video`.
- `play( )` returns a promise of `true` when the playback started, `false` when it could not (the browser wants a click of the user first, the source cannot be played): no "Uncaught (in promise)". Without any source, the browser waits for one.

```ts
if( !await video.play( ) ) {
	playButton.show( );		// the user starts it
}
```

### svgLoader

- A file not found is kept as such: `load( )` rejects it again, without asking for it again, instead of resolving `null`. An `Icon` on it stays empty, without the text `null`.
- The loads asked while a file is loading all get its answer, a failure too: none waits for ever.

### Icon

- `var:home` is read as the variable `--home`, as `var:--home` is: the name of the variable may be given without its `--`. It is the variable set on `<html>` by the code (`document.documentElement.style.setProperty( "--home", svg )`). `ctx.icon( )` of the PDF reads the same names.

### Link

- With a `click` handler, the link is followed unless the handler calls `ev.preventDefault( )`. A handler that only reacts to the click, without it, now lets the browser go to `href` (a link `href: "#"` goes to the top of the page).
- `content` given: the link is its content, it is no longer replaced by an empty label.
- `setText( )` changes the text of the label: its icon and its alignment stay.

```ts
new Link( { href: "#", text: "Open", click: ( ev ) => { ev.preventDefault( ); this.open( ); } } );
```

### Drag and drop

- A drop target is told `enter` at once, before the first `drag`, from the first drag of the page on. `leave` still comes up to 300 ms after the pointer went away.

### Stylesheet

- All the `Stylesheet` of a page share one `<style id="x4-dynamic-css">`: a rule set again by its name, from any of them, is replaced in its place.
- A definition that is not valid throws its error and leaves the rules as they are: the rule of that name stays, and the next `setRule( )` replaces it.
- Deprecated: `Stylesheet` (`setRule( )`, `getVar( )`). A CSS variable does it: `setStyleVariable( )` on a component, `var( --name )` in its stylesheet; `getStyleVariable( )` to read one.

### unsafe

- The template tag `unsafe` writes `0`, `false` and `NaN`, as a template does: `` unsafe`<b>${count}</b>` `` with a count of 0 gives `<b>0</b>`. Only `null` and `undefined` write nothing.

### Shortcuts

- The space bar is written `Space` in a sequence: `"Ctrl+Space"` is a shortcut.

### Dates

- `date_calc_weeknum( )`, and `w` / `W` of `formatIntlDate`, give the week of ISO 8601: weeks from monday, the week 1 holds the first thursday of the year. The 29/12/2025 is in the week 1, the 01/01/2027 in the week 53; there is no week 0, and summer time does not move the weeks. The weeks of the `Calendar` follow.
- `date_diff( )` gives the gap whichever date comes first, and the hours with their minutes: `"2 heures 5 minutes"` (`_tr.global.diff_date_hours`: `'{0} heures {1} minutes'`).

### i18n

- `addTranslation( )` on the language that is selected: `_tr` has the new translations at once.
- A key missing in a language is taken from its base at the same path, however it is read: a group kept in a variable (`const g = _tr.app; g.title`) too. A key that no language has is told once, with its path.

### Color

- `new Color( r, g, b )` and `setRgb( r, g, b )` without alpha give an opaque color: `toRgbString( )` gives `"rgb(255,0,0)"`, `toHexString( )` `"#ff0000"`.
- `isInvalid( )` tells about the last color given: after a text that cannot be read, `setRgb( )` or `setHsv( )` give a valid color.
- `toRgbString( )` never gives the alpha. `toRgbString( true )` gives it when the color is not opaque (`"rgba(255,0,0,0.500)"`), an opaque color stays `"rgb(...)"`. A code that needs the transparency asks for it with `true`.

```ts
const c = new Color( "#ff000080" );
c.toRgbString( );		// "rgb(255,0,0)"
c.toRgbString( true );	// "rgba(255,0,0,0.502)"
```

- `setRgb( )` and `setHsv( )` round the components: a color that goes through hsv keeps its value (`#c57c7c` stays `rgb(197,124,124)`).

### ColorPicker

- Opened, it shows its color: the thumb of the saturation on its saturation and its value, the alpha slider on its alpha.
- New `alpha: false`: no alpha slider, the colors are opaque (the one given, `setColor`, the swatches, the eye dropper, ctrl+↑/↓).
- The swatches are drawn over checkers: a color that is not opaque is seen as such. The swatch "no color" (`nullable`) is white, crossed out in red (`--colorpicker-none`).
- A click without a move takes the point, in the saturation, the hue and the alpha.
- The arrows move the picker only: the page or the popup that holds it does not scroll.

### ColorInput

- A color that is not opaque (its alpha changed in the picker, `rgba(...)` typed) is shown with its alpha: the text in `rgba(...)`, the swatch over checkers (`#00000000` shows the checkers alone).
- While it is typed, the text is left alone: the color follows it (`#111` then `#111fff`). When the field is left, the text is written from the color, in the form that was typed (`#...` or `rgb...`): a text that could not be read shows the color that was kept. The picker writes in the form of the field, `format` when it has none.
- New `alpha: false`: the colors are opaque, typed, picked or given, and the picker has no alpha slider.
- No color: the swatch is white, crossed out in red (`--colorinput-none`); the checkers are for a transparent color.
- New `placeholder`: the text shown in the field while it is empty.

```ts
new ColorInput( { color: "#126e9e", picker: true, alpha: false } );
```

### AutoComplete

- A text shorter than `minChars` closes the suggestions and forgets them: ↓ asks for new ones, on the text of the field (`search` with `ev.text` empty when the field is), and does not show those of the previous text.

### TextArea

- Without a height, its textarea has the height of its rows (2), and the height its handle gives (`resize`). Given a height, the `TextArea` is filled by its textarea under the label.
- A `SimpleTextArea` (the one of a `TextArea` too) is never smaller than one character, its padding and border included: a height or a handle that ask for less give a line high and a character wide.

### Form

- `autoComplete` (and `setAutoComplete( )`) is set on the `<form>`: its fields follow it, those added later too. A field with an `autocomplete` of its own keeps it.

## 2.3.20 (2026-10-14)

### PDF

- New `ctx.svgPath( d, x, y, scale, fill, stroke?, lineWidth? )`: the `d` of a SVG path, drawn in the PDF. The origin of the SVG falls on (x, y), its y going down as in SVG; `scale` is in points by unit of the SVG. `fill` and `stroke` as for `path( )`, `null` for what is not drawn. `M L H V C S Q T A Z`, absolute and relative: the quadratic curves and the arcs become Bézier curves. Another command throws an error: a drawing is never cut short.
- New `ctx.icon( svg, x, y, w, h, opts? )`: a whole SVG icon, as an `Icon` takes it (`"<svg..."`, `"data:image/svg+xml,..."`, an imported `.svg`, `"var:name"`). Its viewBox is fitted and centered in w x h, (x, y) the bottom left corner. `path`, `rect` (rounded too), `circle`, `ellipse`, `line`, `polyline`, `polygon`, in groups with their `transform`; `fill`, `stroke`, `stroke-width`, `opacity`, `fill-opacity`, `fill-rule`, as attributes or in `style`. Gradients, texts, images, `<use>` and the rules of a `<style>` are not drawn.
- `opts.color`: the color of `currentColor` and of what has no fill, black when not given: a one-color icon takes the color of the page. `opts.background`: an opacity is mixed with it, white when not given. A PDF has no transparency, which printers do not like: the part at 40 % of a duotone icon is its color mixed with the background.
- A file (`"icons/pills.svg"`) cannot be read while a page is drawn: `ctx.icon` throws. Load it first, with `await svgLoader.load( url )`.

```ts
import pills from "./assets/pills-duotone-solid.svg";

pdf.page( 595, 842, ctx => {
	ctx.icon( pills, 50, 700, 40, 40, { color: "#ffffff", background: "#D55E00" } );
	ctx.svgPath( "M0 0 A20 20 0 0 1 40 0 Z", 100, 760, 1, "#f2c94c" );
} );
```

## 2.3.19 (2026-10-14)

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

### Checkbox, Switch

- `value` is used. Without it, or with a boolean one, a `Form` reads a boolean, as always. With it, a `Form` reads the value when checked and `null` when not, as a `<form>` of the browser does; `setValues` checks it for that value (or `true`). The `<input>` carries it too.

### Radio

- `checkValue( v )` finds the radios of its group wherever they are in its form (a dialog has one), each in a box of its own too; out of a form, in the page. The radios of the same name in another form, of the page or of a dialog, are not touched.
- A `Form` reads the radios of its own group: two forms of a page can each have a group of the same name.

### TextEdit

- Its props go to the box or to the input, not to both: `style`, `tooltip`, `hidden`, `flex`, `stretch`, `height` are on the box; `dom_events` are on the input (`focus` and `blur` work, a `keydown` runs once by key).

### SimpleTextArea

- Alone in a box, it keeps its height (`flex-shrink: 0`): a box short of room does not crush it. In a `TextArea`, it follows the size of the `TextArea`.
- No handle to resize it by default (`resize: none`), in a `TextArea` too: `resize` asks for one. `resize: true` gives `"both"`. A textarea that has to keep its handle needs `resize: true`.

### Calendar

- A month further, by ◀ ▶ or by the menus of the month and of the year, keeps the day but not past the end of the month: from 31 January, ▶ gives 28 February (not 3 March); from 29 February 2024, the year 2025 gives 28 February 2025.
- `minDate` and `maxDate` are applied: the days out of them are struck through and cannot be chosen, and the date stays between them (navigation, the button "today", `date` of the props).
- `setDate( d )` keeps a copy of `d`, `getDate( )` gives a copy: the calendar and its caller do not share the object.
- A calendar too short for its weeks (6 in some months) cuts what does not fit: it is not drawn over what follows.

### Slider

- The thumb is placed from `min`: on `min: 10, max: 20`, the value 10 is at the start of the track, 15 in the middle. `min` and `max` can have decimals.
- `change` is fired when the user moves the thumb (drag, arrows): not at the construction, nor by `setValue`, `setMin`, `setMax`.
- New `name`: a `Form` reads the slider, as a number, and `setValues` moves its thumb. New `getValue( )`.

### Listbox

- The arrows go on from the item selected, by a click or by `select( )` in the code. After `setItems( )` or `clearSelection( )`, they start from the first item. An item of id `0` is one: ↓ goes to the next.

### Combobox

- The arrows choose: the item reached is shown in the field and `selectionChange` is fired, the popup stays open; Enter and Escape close it on that choice.
- Editable (`readonly: false`): a text typed that is no longer the one of the item chosen leaves no item chosen, with a `selectionChange` empty. `getSelection( )` and a `Form` read nothing.
- `selectItem( null )`, and `Form.setValues( { combo: null } )`, empty the field too.

### Input

- `required` and `readonly` are set for every type but checkbox and radio: a `date` or a `time` in `readonly` cannot be changed. `placeholder` is set on text, email, password and number, the types on which the browser shows it (`date` and `time` show their own pattern).
- The wheel on a `number` that has the focus keeps it between `min` and `max`, on the step, and starts from a valid value when the field is empty (`stepUp` / `stepDown` of the browser).
- A `number` with a `step` shows as many decimals as the step, 4 at most: `step: 0.25` keeps `1.25`, `step: 2.5` keeps `2.5`.
- The radios of a form are read without error when the form is under an element that is not a component (the element of `mountPoint`), or out of the document.

### Form

- `validate( )`: the values that the validator changes are written back in the fields that carry the name, whatever they are (`Select`, `TextArea`, `Combobox`, `Rating`...), and in every radio of a group: the one that holds the value is checked.
- `setValidator( )` called again replaces the validator.

### Rating

- Without `steps`, a rating has its 5 stars.
- A click on a star sets the value to its number (1 for the first) and fires `change` once, also after `setSteps( )`. `value` is the count of stars lit, for the props, `setValue` and the click alike. The star of the value, clicked again, sets it to 0: none is lit.
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
