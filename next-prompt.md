On continue la correction des bugs trouvés par la revue complète de x4js (C:\dev\rlibre\x4-2025), pas à pas.

## Méthode (à suivre strictement)
- Un bloc = un composant ou un fichier. Pour chaque bug : la cause en une phrase, le code **avant / après**, et tu attends mon OK avant de toucher x4. Pas de nouveau membre de classe sans me le montrer. Cherche toujours la correction la plus simple.
- Style : lignes courtes, pas de chaînes `?.` / `??` à rallonge, des commentaires qui disent ce que fait le code et pourquoi (jamais « avant ça faisait… »).
- Après mon OK : appliquer, puis `npx tsc --noEmit -p .` à la racine, puis un test Playwright dans projets/x4test.
- Chaque composant modifié va **visible dans la page de x4test**, pour que je le teste à la main.
- changelog.md : une entrée sous `## 2.3.19` (version non datée, ne jamais toucher l'historique daté). aicontext.md : tu le mets à jour toi-même et tu me dis ce que tu as changé.
- Un bloc fini : tu t'arrêtes et tu attends. Je pousse chaque bloc seul.
- Vérifie le comportement des navigateurs et des libs sur les sources (MDN, un essai dans Chromium), et dis ce qui est vérifié.

## projets/x4test
- `src/main.ts` : une page en onglets (Tabs id `main`) : popups, form, lists, grid, sheet. `?tab=<nom>` choisit l'onglet ouvert, `?up` et `?mount` sont des modes de test. `window.x4test` contient `byId(id)` et des fabriques (`makeStore`, `makeCombo`, `makeInput`, `makeRadioDialog`…).
- Tests : `test/*.mjs`, un script npm par test. Lancer `npm run build`, puis `node test/<nom>.mjs`. Les captures vont dans test/shots.
- Toute la suite passe sauf `sheetsel`, qui échoue exprès : c'est un bug Spreadsheet en attente dans todo.md.

## En cours : 3 corrections proposées, en attente de mon OK (ordre 24, 21, 25)
1. **24. Molette d'un `Input` number** (src/components/input/input.ts, handler `wheel`) : elle ignore min/max et ne fait rien sur un champ vide. Correction : `input.stepUp()` / `stepDown()`, puis `this.setNumValue( this.getNumValue( ), -2 )` pour les décimales du step, puis l'événement `input`. Vérifier dans Chromium : au-delà de max, en dessous de min (MDN ne dit rien de stepDown face à min), champ vide.
2. **21. AutoComplete** (autocomplete.ts `_on_input`) : sous `minChars`, mettre `this._count = 0`. Sinon ↓ réaffiche les anciennes suggestions.
3. **25. Form `autoComplete`** (form.ts `setAutoComplete`) : poser l'attribut `autocomplete` sur le `<form>` lui-même plutôt que sur chaque champ présent à la construction. Vérifier d'abord sur MDN que les champs suivent l'`autocomplete` de leur form.

Dans la page de test : un nombre min 0 / max 5, un AutoComplete sur des villes, le second form (`secondForm`, onglet Form) en `autoComplete: false` avec un bouton qui lui ajoute un champ.

## Ensuite, les blocs restants (à revérifier dans le code avant de proposer)
**Outils du noyau**
- Color : `new Color(r,g,b)` donne un alpha `undefined` ; `invalid` n'est remis à zéro que par `setValue` ; `toRgbString(true)` ne force pas l'alpha.
- i18n : `addTranslation` après `selectLanguage` n'est pas vu ; `req_path` s'accumule ; une traduction qui n'est pas une chaîne devient un objet vide proxifié.
- Dates : `date_calc_weeknum` (semaine 0, semaines commençant le samedi, dépend de l'heure d'été) ; `date_format` et `date_diff` ignorent `options`.
- Raccourcis : la touche Espace ne peut pas être un raccourci.
- Tag `unsafe` : il perd `0` et `false`.
- `Stylesheet` : cherche par `title` mais crée avec `id`.
- À revérifier : l'intervalle de 300 ms de dragManager, et deux points mineurs de core_clipboard.

**Éditeurs et affichage**
- ColorPicker : la saturation et l'alpha ne partent pas de la couleur initiale ; un clic sans glisser ne fait rien ; les flèches font défiler la page.
- ColorInput : le texte est réécrit pendant la frappe ; la valeur affichée diffère de la valeur rendue.
- Link : `click` empêche toujours la navigation ; `content` est écrasé ; `setText` perd l'icône.
- Icon : `setIcon` sur des `.svg` peut croiser les réponses ; `var:` ne marche pas comme documenté.
- svgLoader : un échec est mis en cache comme un succès.
- Video : la classe est `video` au lieu de `x4video` ; `play()` sans `catch`.
- Keyboard virtuel : le retour arrière ignore la sélection ; écouteurs sur `document` jamais retirés ; le cas des champs `type=…` ; un double clic insère trois fois.
- FileDrop : `accept` et `multiple` ne s'appliquent pas au dépôt.
- Image : `lazy` et `draggable` sans effet.
- PropertyGrid : état des groupes, `setPropValue`, callback en double, valeurs `null`.
- Label : `labelFor` sans effet sur un div.
- Progress : pas de bornes.
- FileDialog : choisir deux fois le même fichier.

**Docking et boîtes**
- `rebuild()` rejoue `created` à chaque changement d'agencement.
- `StackBox.removeItem` ne corrige pas `_cur`.
- `Tabs.removeTab` de l'onglet courant laisse le composant sans onglet ; `Tabs` sans `default` n'a aucun onglet sélectionné.
- `Panel.setTitle` efface l'icône.
- `GridBox.setTemplate` pose un attribut au lieu du style.
- `MasonryBox` mesure l'enveloppe, pas le contenu.
- L'aperçu d'un panneau flottant sans largeur a une taille nulle.
- Des props déclarées jamais lues.

**Popups, dialogues et menus** (showAsync et autoClose sont déjà faits)
- Bouton : `autorepeat` donne un clic de trop au relâchement et ne marche pas au clavier ; `tabindex: false` sans effet ; `BtnGroup.reverse` jamais lu.
- ProgressionBox : `clear()` marque des erreurs.
- Dialog : le focus initial n'est posé qu'une fois ; Entrée dans un textarea ne fait pas de retour à la ligne ; une prop `content` fait planter le constructeur ; `close` déclaré mais jamais émis ; `displayCenter` centre sur body et non sur la fenêtre.
- MessageBox : `icon_type` sans effet.
- Menu : pas de clavier, et Échap ferme le dialogue dessous ; le timer d'un item feuille n'est pas annulé ; un titre est cliquable.
- CMover : pas de bornes, coordonnées mixtes ; mélange viewport/document dans le placement.
- Infobulles : paramètre `pt` ignoré.
- Écouteurs qui s'accumulent (mineur).

**Dessin** (les 3 points du PDF sont faits)
- Chart : une borne min/max hors des données donne un graphique NaN ; `xaxis.step` < 0,5 bloque le navigateur ; `computeStack` sans `values` ; `xaxis.min` jamais lu.
- core_svg : `SvgIcon` perd un enfant sur deux et plante sur `%` ; `addStop` produit `"%%"` ; `strokeCap` mal orthographié (`"sqaure"`) ; `addClass("")` rend `undefined` ; `getNumAttr` rend NaN ; la doc de `arc()` donne le mauvais repère.
- TickLine : `setValues` remet la plage à 0..100 ; largeurs négatives en mode bars ; `viewport` sans effet.
- canvas_ex : `smoothLine` ignore `move` ; `smoothLineEx([])` lève une erreur ; `setFontSize` échoue avec une taille fractionnaire. Le `<canvas>` n'a pas de parent positionné.
- Gauge : premier rendu à 0×0. PDF : détection de la taille JPEG.

**En attente dans todo.md** (ne pas toucher sans que je le demande) : Spreadsheet (8), Sizers (3), et la partie « Fixes that change what existing code gets ».





# a ajouter pour verification

Listbox et Treeview
L1. Listbox.select( ) ne mémorise pas l'élément courant (listbox.ts:369) : dans une Combobox avec value, flèche bas repart du premier élément.
L2. Un id 0 ou "" est pris pour « rien » : navigation (listbox.ts:184), getFirstSel (L630), et dans Treeview la navigation (treeview.ts:416) et clearSelection (L492).
L3. appendItem sur une liste vide garde « Empty list » (listbox.ts:569).
L4. select( [1] ) en multisélection ne retire pas les autres (listbox.ts:389).
L5. updateItem( id, item ) cherche la ligne avec item.id (listbox.ts:613).
L6. checkable et ListItem.checked ne sont jamais lus (listbox.ts:68).
L7. Un double-clic dans un Treeview émet trois selectionChange (treeview.ts:456).

Non revérifiées par moi
Des cas mineurs : 
navigation et filtre sur une Listbox vide, 
selectionChange en double dans setItems, 
en-tête fixe du Gridview quand la vue se vide, 
setColTitle sur une colonne fixe, 
classifier ignoré sur les colonnes fixes, 
touches interceptées depuis un champ placé dans un footer, 
existingDOM qui ignore les autres props, 
setStyleValue( "width", "10" ) sans unité. 
header.ts et core_events.ts n'ont rien donné.

Popups et boutons (21) :

autorepeat émet un clic de trop au relâchement, et ne réagit ni au clavier ni à click( ).
ProgressionBox.clear( ) marque des erreurs au lieu de les effacer.
Entrée dans un TextArea d'un dialogue valide le dialogue au lieu de passer à la ligne.
L'icône de MessageBox est toujours celle d'erreur.
new Dialog( { content } ) plante dans le constructeur.
Conteneurs et docking (9) :

StackBox.removeItem et Tabs.removeTab laissent l'onglet courant faux.
Panel.setTitle efface l'icône.
GridBox.setTemplate pose un attribut au lieu du style.
La relecture n'a rien trouvé de solide dans le modèle de l'agencement (docklayout.ts), après l'avoir déroulé sur des cas précis.
Couleur, propriétés, clavier, petits composants (24) :

Link avec un handler click ne suit jamais le lien.
ColorPicker : le marqueur de saturation ne part pas de la couleur initiale, et le curseur alpha non plus.
ColorInput réécrit le texte pendant la frappe : taper #126e9e donne #112266e9.
Video n'a pas @class_ns( "x4" ) : sa feuille de style ne s'applique jamais, et il importe x4js par son nom depuis l'intérieur de x4.
Clavier virtuel : l'effacement ignore la sélection, et ses écouteurs sur le document ne sont jamais retirés. Ses tables de dispositions, écrites hier, n'ont rien montré.









