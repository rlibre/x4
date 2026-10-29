# PagedStore — reprise de la discussion

Prompt pour reprendre, dans une nouvelle session, la conception du `PagedStore` de x4js
(dépôt `c:\dev\rlibre\x4`). Discussion du 2026-10-26.

## Avant tout

- Lis `aicontext.md` et `aiguide.md` à la racine du dépôt : ce sont des règles, pas des suggestions.
- **On discute d'abord, on ne code pas.** Pas une ligne de code tant que l'utilisateur ne l'a pas
  demandé explicitement. Un « ok » de sa part peut vouloir dire « on reprend la discussion » et pas
  « implémente » : en cas de doute, demande. Pose les questions une par une ou par petits groupes,
  sans réponses pré-remplies.
- Ensuite seulement : le code dans `sandbox/` (un projet `x4js create`, construit sur les sources du
  dépôt par un alias `x4js → ../src/x4.ts` dans `x4.config.json` et `paths` dans `tsconfig.json`).
  Une fois validé : dans `src/`, puis `aicontext.md`, `changelog.md` (2.3.29) et la galerie (`demo/`).

## Ce qui est décidé

| Sujet | Décision |
|---|---|
| Nom | `PagedStore` |
| Classe | dérive de `DataStore` (`src/core/core_data.ts`) |
| Gridview | **ne doit pas savoir qu'elle a affaire à un `PagedStore`** : pas de `instanceof`, pas de code propre à lui ; seulement l'API générale de `DataStore` / `DataView` (une méthode générale ajoutée à `DataStore` est acceptable si toute autre classe peut l'implémenter) |
| Volume | environ 100 000 enregistrements |
| Serveur | une API |
| Total | le serveur donne le nombre total de lignes |
| Chargement | une **fonction fournie par l'application** (pas d'URL dans le store : aiguide veut que tout accès serveur passe par un modèle qui possède le seul `fetch`) |
| Requête | position de départ + nombre de lignes |
| Taille de bloc | réglable |
| Bloc suivant | chargé à l'avance |
| Mémoire | limite réglable (valeur par défaut à fixer : sans limite ?) |
| Tri | côté serveur |
| Filtre | côté serveur |
| Ligne pas encore chargée | un enregistrement vide (ligne vide dans la Gridview) ; **pas** de texte `--LOADING--` dans les champs (casse les colonnes nombre/date/checkbox/image et les `formatter` / `renderer`) |
| Indicateur | le store déclenche des événements **`loadstart` / `loadend`** ; l'application affiche ce qu'elle veut |
| Avant le 1er bloc (« Liste vide ») | réglé par `loadstart` : l'application affiche « chargement » |
| Sélection après tri ou filtre | **gardée** |
| Données changées sur le serveur | l'application le sait (WebSocket) et le dit au store (le parent du store lui parle) |
| Plusieurs vues sur un même store | **oui**, avec des tris différents |
| Usage hors Gridview | peut-être |

Proposé, à faire confirmer : la signature
`load( { start, count, sort, filter, signal } ) => Promise<{ rows, total }>`
(`sort` : `SortProp[]`, `filter` : `FilterInfo`, `signal` : `AbortSignal` pour abandonner un bloc
dépassé lors d'un défilement rapide ; `rows` passés par `model.unSerialize` comme `setData`).

## Questions encore ouvertes

1. **`loadstart` / `loadend`** : une paire par période d'activité (de « rien en cours » à « plus rien
   en cours », proposé : pas de clignotement) ou une par bloc ? Que transmettent-ils : l'erreur dans
   `loadend` (ce qui réglerait la question des erreurs réseau, avec un `refresh()` pour relancer) ?
   la plage `start` / `count` ?
2. **Ctrl+A** (la Gridview parcourt toutes les lignes d'un coup, synchrone ; les lignes non chargées
   n'ont pas d'id) : a. seulement les lignes chargées ; b. le store dit par une méthode générale s'il
   a toutes ses lignes, sinon Ctrl+A ne fait rien ; c. une sélection « tout » sans liste d'ids (gros
   changement de la Gridview).
3. **Maj+clic** à travers des lignes non chargées : a. elles sont sautées (règle générale : une ligne
   sans id ne se sélectionne pas) ; b. refusé si l'intervalle n'est pas chargé.
4. **Garder la sélection** (décidé) — comment, sans que la Gridview sache : proposition, une méthode
   générale `store.has( id )` que la Gridview interroge au lieu de « l'id est-il dans la vue » ;
   `DataStore` répond comme aujourd'hui, `PagedStore` « oui » pour tout enregistrement reçu et non
   supprimé. Conséquence : une ligne exclue par le filtre resterait sélectionnée (seul le serveur sait
   qu'elle est exclue). À confirmer. Note : aicontext dit aujourd'hui « a record that leaves the view
   (filter, delete) leaves the selection ».
5. **`update` / `append` / `delete`** : à réfléchir (modifier seulement la mémoire, recharger, ou
   envoyer au serveur par la fonction de l'application ?).
6. **API de rafraîchissement** pour l'application prévenue par WebSocket : proposé `update( rec )`
   (remplace en mémoire si présent) et `refresh( )` (positions changées : recharge les blocs
   visibles, garde le défilement). Faut-il plus fin (recharger le bloc d'un id) ?
7. **Plusieurs vues avec des tris différents** (décidé « oui ») : la `DataView` demande ses lignes par
   position (`store.getByIndex( m_index[i] )`) sans dire qui elle est. Faisable sans toucher la
   `DataView` : un cache de positions par (tri, filtre), les enregistrements partagés par id, et pour
   chaque vue des index dans une plage qui lui est propre (le store sait ainsi de quel ordre il
   s'agit). Plus complexe : confirmer que c'est un vrai besoin (deux grilles triées différemment sur
   les mêmes données) et pas « plusieurs vues avec le même tri ».
8. **Valeurs par défaut** : taille de bloc (100 ?), limite mémoire (aucune, vu 100 000 lignes ?).
9. **Filtres** : seulement `FilterInfo` sur un champ (`op`, `field`, `value`) ? Un filtre fonction
   (`op` est une fonction JS) ne peut pas partir au serveur : refusé avec une erreur ?

## Ce que fait le code aujourd'hui (lu, pour la conception)

- `DataStore` (`src/core/core_data.ts`, vers la ligne 583) : `m_records`, `m_rec_index` (un
  `Uint32Array`) ; `count` ; `getByIndex( i )` → `m_records[ m_rec_index[i] ]` ; `indexOfId` fait une
  recherche dichotomique (suppose les enregistrements triés par id) ; `getById` ; `createIndex( filter )`
  et `sortIndex( index, sort )` travaillent sur **tous** les enregistrements ; événement
  `data_change` (`change_type` : `create`, `update`, `delete`, `data`, `change`). `_rebuildIndex` et
  `_getRecord` sont `private`. Le chargement par `url` / `DataProxy` est déprécié (2.3.19).
- `DataView` (même fichier, vers la ligne 1182) : créée par la Gridview (`setStore` → `new DataView( { store } )`) ;
  `open( )` écoute `data_change` et `_storeChange` refait `createIndex( m_filter )` puis `sortIndex` ;
  `filter( )` et `sort( )` passent par le store ; `getByIndex( i )` → `store.getByIndex( m_index[i] )` ;
  `indexOfId( id )` → `m_index.findIndex( … )` (parcours complet) ; `getIdByIndex` → `model.getID( rec )`.
- `Gridview` (`src/components/gridview/gridview.ts`) :
  - ne construit que les lignes visibles (`_update`, vers la ligne 1331) avec `getCount( )` et
    `getByIndex( row )`, de façon synchrone ;
  - la sélection est un `Set` d'ids (ligne 165) ; clic, Ctrl+clic (`toggleRow`), Maj+clic
    (`selectTo` : `indexOfId` de la dernière, puis toutes les lignes entre) lisent `getIdByIndex( row )`
    (lignes 280–380) ;
  - sur un `view_change` qui n'est pas un tri, elle retire de la sélection les ids dont
    `indexOfId < 0` (vers la ligne 595) ;
  - `selectAll` parcourt toutes les lignes (vers la ligne 1432) ;
  - `_renderCell` (ligne 951) : valeur `undefined`/`null` → cellule vide ; colonne `number` /
    `money` avec une chaîne → `NaN` ; `checkbox` : vrai si non vide ; `image` : `src` ; un `renderer`
    ou un `formatter` de l'application reçoit la valeur telle quelle.
  - le tri d'une colonne : `this._dataview.sort( [ { field, ascending, numeric, callback } ] )`.
- `todo.md` (section DataStore) note déjà la demande d'un DataStore paginé (2026-10-13) et les
  défauts du chargement par url.
