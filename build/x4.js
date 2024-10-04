var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);

// src/core/core_i18n.ts
var sym_lang = Symbol("i18n");
var languages = {};
function createLanguage(name, base) {
  languages[name] = {
    name,
    base,
    src_translations: {},
    translations: {}
  };
}
__name(createLanguage, "createLanguage");
function isLanguage(name) {
  return languages[name] !== void 0;
}
__name(isLanguage, "isLanguage");
function addTranslation(name, ...parts) {
  if (!isLanguage(name)) {
    return;
  }
  const lang = languages[name];
  parts.forEach((p) => {
    _patch(lang.src_translations, p);
  });
  lang.translations = _proxyfy(lang.src_translations, lang.base, true);
}
__name(addTranslation, "addTranslation");
function _patch(obj, by) {
  for (let n in by) {
    const src = by[n];
    if (typeof src === "string") {
      obj[n] = src;
    } else {
      if (Array.isArray(src) && (!obj[n] || !Array.isArray(obj[n]))) {
        obj[n] = [...src];
      } else if (!obj[n] || typeof obj[n] !== "object") {
        obj[n] = { ...src };
      } else {
        _patch(obj[n], by[n]);
      }
    }
  }
}
__name(_patch, "_patch");
function _proxyfy(obj, base, root) {
  const result = {};
  for (const n in obj) {
    if (typeof obj[n] !== "string" && !Array.isArray(obj[n])) {
      result[n] = _proxyfy(obj[n], base, false);
    } else {
      result[n] = obj[n];
    }
  }
  return _mk_proxy(result, base, root);
}
__name(_proxyfy, "_proxyfy");
function _mk_proxy(obj, base, root) {
  return new Proxy(obj, {
    get: /* @__PURE__ */ __name((target, prop) => {
      if (root) {
        req_path = [prop];
      } else {
        req_path.push(prop);
      }
      let value = target[prop];
      if (value === void 0) {
        if (base) {
          value = _findBaseTrans(base);
        }
        if (value === void 0) {
          console.error("I18N error: unable to find", "_tr." + req_path.join("."));
        }
      }
      return value;
    }, "get")
  });
}
__name(_mk_proxy, "_mk_proxy");
var req_path;
function _findBaseTrans(base) {
  while (base) {
    const lang = languages[base];
    let trans = lang.translations;
    let value;
    for (const p of req_path) {
      value = trans[p];
      if (value === void 0) {
        break;
      }
      trans = value;
    }
    if (value !== void 0) {
      return trans;
    }
    base = lang.base;
  }
  return void 0;
}
__name(_findBaseTrans, "_findBaseTrans");
var _tr = {};
function selectLanguage(name) {
  if (!isLanguage(name)) {
    return;
  }
  _tr = languages[name].translations;
  _tr[sym_lang] = name;
  return _tr;
}
__name(selectLanguage, "selectLanguage");
function getCurrentLanguage() {
  return _tr[sym_lang];
}
__name(getCurrentLanguage, "getCurrentLanguage");
function getAvailableLanguages() {
  return Object.keys(languages);
}
__name(getAvailableLanguages, "getAvailableLanguages");
var fr = {
  global: {
    ok: "OK",
    cancel: "Annuler",
    ignore: "Ignorer",
    yes: "Oui",
    no: "Non",
    abort: "Abandonner",
    retry: "Réessayer",
    error: "Erreur",
    today: "Aujourd'hui",
    open: "Ouvrir",
    new: "Nouveau",
    delete: "Supprimer",
    close: "Fermer",
    save: "Enregistrer",
    search: "Rechercher",
    search_tip: "Saisissez le texte à rechercher. <b>Enter</b> pour lancer la recherche. <b>Esc</b> pour annuler.",
    required_field: "information requise",
    invalid_format: "format invalide",
    invalid_email: "adresse mail invalide",
    invalid_number: "valeur numérique invalide",
    diff_date_seconds: "{0} secondes",
    diff_date_minutes: "{0} minutes",
    diff_date_hours: "{0} heures",
    invalid_date: "Date non reconnue ({0})",
    empty_list: "Liste vide",
    date_input_formats: "d/m/y|d.m.y|d m y|d-m-y|dmy",
    date_format: "D/M/Y",
    day_short: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
    day_long: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    month_short: ["jan", "fév", "mar", "avr", "mai", "jun", "jui", "aoû", "sep", "oct", "nov", "déc"],
    month_long: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    property: "Propriété",
    value: "Valeur",
    err_403: `Vous n'avez pas les droits suffisants pour effectuer cette action`,
    copy: "Copier",
    cut: "Couper",
    paste: "Coller"
  }
};
var en = {
  global: {
    ok: "OK",
    cancel: "Cancel",
    ignore: "Ignore",
    yes: "Yes",
    no: "No",
    abort: "Abort",
    retry: "Retry",
    error: "Error",
    today: "Today",
    open: "Open",
    new: "New",
    delete: "Delete",
    close: "Close",
    save: "Save",
    search: "Search",
    search_tip: "Type in the text to search. <b>Enter</b> to start the search. <b>Esc</b> to cancel.",
    required_field: "missing information",
    invalid_format: "invalid format",
    invalid_email: "invalid email address",
    invalid_number: "bad numeric value",
    diff_date_seconds: "{0} seconds",
    diff_date_minutes: "{0} minutes",
    diff_date_hours: "{0} hours",
    invalid_date: "Unrecognized date({0})",
    empty_list: "Empty list",
    date_input_formats: "m/d/y|m.d.y|m d y|m-d-y|mdy",
    date_format: "M/D/Y",
    day_short: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
    day_long: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    month_short: ["jan", "feb", "mar", "apr", "may", "jun", "jui", "aug", "sep", "oct", "nov", "dec"],
    month_long: ["january", "february", "march", "april", "mau", "june", "jully", "august", "september", "october", "november", "december"],
    property: "Property",
    value: "Value",
    err_403: `You do not have sufficient rights to do that action`,
    copy: "Copy",
    cut: "Cut",
    paste: "Paste"
  }
};
createLanguage("fr", null);
addTranslation("fr", fr);
createLanguage("en", "fr");
addTranslation("en", en);
selectLanguage("fr");

// src/core/core_tools.ts
function isString(val) {
  return typeof val === "string";
}
__name(isString, "isString");
function isNumber(v) {
  return typeof v === "number" && isFinite(v);
}
__name(isNumber, "isNumber");
function isArray(val) {
  return val instanceof Array;
}
__name(isArray, "isArray");
function isFunction(val) {
  return val instanceof Function;
}
__name(isFunction, "isFunction");
var _UnsafeHtml = class _UnsafeHtml extends String {
  constructor(value) {
    super(value);
  }
};
__name(_UnsafeHtml, "UnsafeHtml");
var UnsafeHtml = _UnsafeHtml;
function unsafeHtml(x) {
  return new UnsafeHtml(x);
}
__name(unsafeHtml, "unsafeHtml");
function clamp(v, min, max) {
  if (v < min) {
    return min;
  }
  if (v > max) {
    return max;
  }
  return v;
}
__name(clamp, "clamp");
var _Rect = class _Rect {
  constructor(l, t, w, h) {
    if (l !== void 0) {
      if (isNumber(l)) {
        this.left = l;
        this.top = t;
        this.width = w;
        this.height = h;
      } else {
        Object.assign(this, l);
      }
    }
  }
  get right() {
    return this.left + this.width;
  }
  get bottom() {
    return this.top + this.height;
  }
};
__name(_Rect, "Rect");
var Rect = _Rect;
function isFeatureAvailable(name) {
  switch (name) {
    case "eyedropper":
      return "EyeDropper" in window;
  }
  return false;
}
__name(isFeatureAvailable, "isFeatureAvailable");
var _Timer = class _Timer {
  /**
   * 
   */
  setTimeout(name, time, callback) {
    if (!this._timers) {
      this._timers = /* @__PURE__ */ new Map();
    } else {
      this.clearTimeout(name);
    }
    const tm = setTimeout(callback, time);
    this._timers.set(name, tm);
    return tm;
  }
  clearTimeout(name) {
    if (this._timers && this._timers.has(name)) {
      clearTimeout(this._timers.get(name));
      this._timers.delete(name);
    }
  }
  /**
   * 
   */
  setInterval(name, time, callback) {
    if (!this._timers) {
      this._timers = /* @__PURE__ */ new Map();
    } else {
      this.clearInterval(name);
    }
    const tm = setInterval(callback, time);
    this._timers.set(name, tm);
    return tm;
  }
  clearInterval(name) {
    if (this._timers && this._timers.has(name)) {
      clearInterval(this._timers.get(name));
      this._timers.delete(name);
    }
  }
  clearAllTimeouts() {
    var _a;
    (_a = this._timers) == null ? void 0 : _a.forEach((t) => {
      clearTimeout(t);
    });
    this._timers = null;
  }
};
__name(_Timer, "Timer");
var Timer = _Timer;
function asap(callback) {
  return requestAnimationFrame(callback);
}
__name(asap, "asap");
function pad(what, size, ch = "0") {
  let value;
  if (!isString(what)) {
    value = "" + what;
  } else {
    value = what;
  }
  if (size > 0) {
    return value.padEnd(size, ch);
  } else {
    return value.padStart(-size, ch);
  }
}
__name(pad, "pad");
function sprintf(format, ...args) {
  return format.replace(/{(\d+)}/g, function(match, index) {
    return typeof args[index] != "undefined" ? args[index] : match;
  });
}
__name(sprintf, "sprintf");
function pascalCase(string) {
  let result = string;
  result = result.replace(/([a-z])([A-Z])/g, "$1 $2");
  result = result.toLowerCase();
  result = result.replace(/[^- a-z0-9]+/g, " ");
  if (result.indexOf(" ") < 0) {
    return result;
  }
  result = result.trim();
  return result.replace(/ /g, "-");
}
__name(pascalCase, "pascalCase");
function camelCase(text) {
  let result = text.toLowerCase();
  result = result.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => {
    return chr.toUpperCase();
  });
  return result;
}
__name(camelCase, "camelCase");
var cur_locale = "fr-FR";
function _date_set_locale(locale) {
  cur_locale = locale;
}
__name(_date_set_locale, "_date_set_locale");
function date_format(date, options) {
  return formatIntlDate(date);
}
__name(date_format, "date_format");
function date_diff(date1, date2, options) {
  var dt = (date1.getTime() - date2.getTime()) / 1e3;
  let sec = dt;
  if (sec < 60) {
    return sprintf(_tr.global.diff_date_seconds, Math.round(sec));
  }
  let min = Math.floor(sec / 60);
  if (min < 60) {
    return sprintf(_tr.global.diff_date_minutes, Math.round(min));
  }
  let hrs = Math.floor(min / 60);
  return sprintf(_tr.global.diff_date_hours, hrs, min % 60);
}
__name(date_diff, "date_diff");
function date_to_sql(date, withHours) {
  if (withHours) {
    return formatIntlDate(date, "Y-M-D H:I:S");
  } else {
    return formatIntlDate(date, "Y-M-D");
  }
}
__name(date_to_sql, "date_to_sql");
function date_sql_utc(date) {
  let result = /* @__PURE__ */ new Date(date + " GMT");
  return result;
}
__name(date_sql_utc, "date_sql_utc");
function date_hash(date) {
  return date.getFullYear() << 16 | date.getMonth() << 8 | date.getDate();
}
__name(date_hash, "date_hash");
function date_clone(date) {
  return new Date(date.getTime());
}
__name(date_clone, "date_clone");
function date_calc_weeknum(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 864e5;
  return Math.floor((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
__name(date_calc_weeknum, "date_calc_weeknum");
function parseIntlDate(value, fmts = _tr.global.date_input_formats) {
  var _a, _b, _c, _d, _e, _f;
  let formats = fmts.split("|");
  for (let fmatch of formats) {
    let smatch = "";
    for (let c of fmatch) {
      if (c == "d" || c == "D") {
        smatch += "(?<day>\\d{1,2})";
      } else if (c == "m" || c == "M") {
        smatch += "(?<month>\\d{1,2})";
      } else if (c == "y" || c == "Y") {
        smatch += "(?<year>\\d{1,4})";
      } else if (c == "h" || c == "H") {
        smatch += "(?<hour>\\d{1,2})";
      } else if (c == "i" || c == "I") {
        smatch += "(?<min>\\d{1,2})";
      } else if (c == "s" || c == "S") {
        smatch += "(?<sec>\\d{1,2})";
      } else if (c == " ") {
        smatch += "\\s+";
      } else {
        smatch += "\\s*\\" + c + "\\s*";
      }
    }
    let rematch = new RegExp("^" + smatch + "$", "m");
    let match = rematch.exec(value);
    if (match) {
      const now = /* @__PURE__ */ new Date();
      let d = parseInt((_a = match.groups.day) != null ? _a : "1");
      let m = parseInt((_b = match.groups.month) != null ? _b : "1");
      let y = parseInt((_c = match.groups.year) != null ? _c : now.getFullYear() + "");
      let h = parseInt((_d = match.groups.hour) != null ? _d : "0");
      let i = parseInt((_e = match.groups.min) != null ? _e : "0");
      let s = parseInt((_f = match.groups.sec) != null ? _f : "0");
      if (y > 0 && y < 100) {
        y += 2e3;
      }
      let result = new Date(y, m - 1, d, h, i, s, 0);
      let ty = result.getFullYear(), tm = result.getMonth() + 1, td = result.getDate();
      if (ty != y || tm != m || td != d) {
        return null;
      }
      return result;
    }
  }
  return null;
}
__name(parseIntlDate, "parseIntlDate");
function formatIntlDate(date, fmt = _tr.global.date_format) {
  if (!date) {
    return "";
  }
  let now = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    wday: date.getDay(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    milli: date.getMilliseconds()
  };
  let result = "";
  let esc = 0;
  for (let c of fmt) {
    if (c == "{") {
      if (++esc == 1) {
        continue;
      }
    } else if (c == "}") {
      if (--esc == 0) {
        continue;
      }
    }
    if (esc) {
      result += c;
      continue;
    }
    if (c == "d") {
      result += now.day;
    } else if (c == "D") {
      result += pad(now.day, -2);
    } else if (c == "j") {
      result += _tr.global.day_short[now.wday];
    } else if (c == "J") {
      result += _tr.global.day_long[now.wday];
    } else if (c == "w") {
      result += date_calc_weeknum(date);
    } else if (c == "W") {
      result += pad(date_calc_weeknum(date), -2);
    } else if (c == "m") {
      result += now.month;
    } else if (c == "M") {
      result += pad(now.month, -2);
    } else if (c == "o") {
      result += _tr.global.month_short[now.month - 1];
    } else if (c == "O") {
      result += _tr.global.month_long[now.month - 1];
    } else if (c == "y" || c == "Y") {
      result += pad(now.year, -4);
    } else if (c == "a" || c == "A") {
      result += now.hours < 12 ? "am" : "pm";
    } else if (c == "h") {
      result += now.hours;
    } else if (c == "H") {
      result += pad(now.hours, -2);
    } else if (c == "i") {
      result += now.minutes;
    } else if (c == "I") {
      result += pad(now.minutes, -2);
    } else if (c == "s") {
      result += now.seconds;
    } else if (c == "S") {
      result += pad(now.seconds, -2);
    } else if (c == "l") {
      result += now.milli;
    } else if (c == "L") {
      result += pad(now.milli, -3);
    } else {
      result += c;
    }
  }
  return result;
}
__name(formatIntlDate, "formatIntlDate");
function calcAge(birth, ref) {
  if (ref === void 0) {
    ref = /* @__PURE__ */ new Date();
  }
  if (!birth) {
    return 0;
  }
  let age = ref.getFullYear() - birth.getFullYear();
  if (ref.getMonth() < birth.getMonth() || ref.getMonth() == birth.getMonth() && ref.getDate() < birth.getDate()) {
    age--;
  }
  return age;
}
__name(calcAge, "calcAge");

// src/core/core_events.ts
var stopPropagation = /* @__PURE__ */ __name(function() {
  this.propagationStopped = true;
}, "stopPropagation");
var preventDefault = /* @__PURE__ */ __name(function() {
  this.defaultPrevented = true;
}, "preventDefault");
var _EventSource = class _EventSource {
  constructor(source = null) {
    this._source = source != null ? source : this;
  }
  addListener(name, callback, capturing = false) {
    if (!this._registry) {
      this._registry = /* @__PURE__ */ new Map();
    }
    let listeners = this._registry.get(name);
    if (!listeners) {
      listeners = [];
      this._registry.set(name, listeners);
    }
    const cb = callback;
    if (listeners.indexOf(cb) == -1) {
      if (capturing) {
        listeners.unshift(cb);
      } else {
        listeners.push(cb);
      }
    }
  }
  fire(name, evx) {
    var _a;
    let listeners = (_a = this._registry) == null ? void 0 : _a.get(name);
    if (listeners && listeners.length) {
      let ev = evx;
      if (!ev) {
        ev = {};
      }
      if (!ev.source) {
        ev.source = this._source;
      }
      if (!ev.type) {
        ev.type = name;
      }
      if (!ev.preventDefault) {
        ev.preventDefault = preventDefault;
      }
      if (!ev.stopPropagation) {
        ev.stopPropagation = stopPropagation;
      }
      if (listeners.length == 1) {
        listeners[0](ev);
      } else {
        const temp = listeners.slice();
        for (let i = 0, n = temp.length; i < n; i++) {
          temp[i](ev);
          if (ev.propagationStopped) {
            break;
          }
        }
      }
    }
  }
};
__name(_EventSource, "EventSource");
var EventSource = _EventSource;

// src/core/core_element.ts
var _events, _timers;
var _CoreElement = class _CoreElement {
  constructor() {
    __privateAdd(this, _events);
    __privateAdd(this, _timers);
  }
  __startTimer(name, ms, repeat, callback) {
    if (!__privateGet(this, _timers)) {
      __privateSet(this, _timers, /* @__PURE__ */ new Map());
    } else {
      this.__stopTimer(name);
    }
    const id = (repeat ? setInterval : setTimeout)(callback, ms);
    __privateGet(this, _timers).set(name, () => {
      (repeat ? clearInterval : clearTimeout)(id);
      __privateGet(this, _timers).delete(name);
    });
  }
  __stopTimer(name) {
    const clear = __privateGet(this, _timers).get(name);
    if (clear) {
      clear();
    }
  }
  setTimeout(name, ms, callback) {
    this.__startTimer(name, ms, false, callback);
  }
  clearTimeout(name) {
    this.__stopTimer(name);
  }
  setInterval(name, ms, callback) {
    this.__startTimer(name, ms, true, callback);
  }
  clearInterval(name) {
    this.__stopTimer(name);
  }
  clearTimeouts() {
    for (const [id, val] of __privateGet(this, _timers)) {
      val();
    }
    __privateGet(this, _timers).clear();
  }
  // :: EVENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * attach to an event
   */
  on(name, listener) {
    console.assert(listener !== void 0 && listener !== null);
    if (!__privateGet(this, _events)) {
      __privateSet(this, _events, new EventSource(this));
    }
    __privateGet(this, _events).addListener(name, listener);
  }
  /**
   * 
   */
  fire(name, ev) {
    if (__privateGet(this, _events)) {
      __privateGet(this, _events).fire(name, ev);
    }
  }
};
_events = new WeakMap();
_timers = new WeakMap();
__name(_CoreElement, "CoreElement");
var CoreElement = _CoreElement;

// src/core/core_styles.ts
var unitless = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};
function isUnitLess(name) {
  return unitless[name] ? true : false;
}
__name(isUnitLess, "isUnitLess");
var _Stylesheet = class _Stylesheet {
  constructor() {
    this.m_rules = /* @__PURE__ */ new Map();
    function getStyleSheet(name) {
      for (let i = 0; i < document.styleSheets.length; i++) {
        let sheet = document.styleSheets[i];
        if (sheet.title === name) {
          return sheet;
        }
      }
    }
    __name(getStyleSheet, "getStyleSheet");
    this.m_sheet = getStyleSheet("x4-dynamic-css");
    if (!this.m_sheet) {
      const dom = document.createElement("style");
      dom.setAttribute("id", "x4-dynamic-css");
      document.head.appendChild(dom);
      this.m_sheet = dom.sheet;
    }
  }
  /**
   * add a new rule to the style sheet
   * @param {string} name - internal rule name 
   * @param {string} definition - css definition of the rule 
   * @example
   * setRule('xbody', "body { background-color: #ff0000; }" );
   */
  setRule(name, definition) {
    if (isString(definition)) {
      let index = this.m_rules.get(name);
      if (index !== void 0) {
        this.m_sheet.deleteRule(index);
      } else {
        index = this.m_sheet.cssRules.length;
      }
      this.m_rules.set(name, this.m_sheet.insertRule(definition, index));
    } else {
      let idx = 1;
      for (let r in definition) {
        let rule = r + " { ", css = definition[r];
        for (let i in css) {
          let values = css[i];
          for (let j = 0; j < values.length; j++) {
            rule += i + ": " + values[j] + "; ";
          }
        }
        rule += "}";
        this.setRule(name + "--" + idx, rule);
        idx++;
      }
    }
  }
  /**
   * return the style variable value
   * @param name - variable name 
   * @example
   * ```
   * let color = Component.getCss( ).getVar( 'button-color' );
   * ```
   */
  static getVar(name) {
    if (!_Stylesheet.doc_style) {
      _Stylesheet.doc_style = getComputedStyle(document.documentElement);
    }
    if (!name.startsWith("--")) {
      name = "--" + name;
    }
    return _Stylesheet.doc_style.getPropertyValue(name);
  }
};
__name(_Stylesheet, "Stylesheet");
_Stylesheet.guid = 1;
var Stylesheet = _Stylesheet;
var _ComputedStyle = class _ComputedStyle {
  constructor(style) {
    this.m_style = style;
  }
  /**
   * return the raw value
   */
  value(name) {
    return this.m_style[name];
  }
  /**
   * return the interpreted value
   */
  parse(name) {
    return parseInt(this.m_style[name]);
  }
  /**
   * 
   */
  get style() {
    return this.m_style;
  }
};
__name(_ComputedStyle, "ComputedStyle");
var ComputedStyle = _ComputedStyle;

// src/core/core_dom.ts
var unbubbleEvents = {
  mouseleave: 1,
  mouseenter: 1,
  load: 1,
  unload: 1,
  scroll: 1,
  focus: 1,
  blur: 1,
  rowexit: 1,
  beforeunload: 1,
  stop: 1,
  dragdrop: 1,
  dragenter: 1,
  dragexit: 1,
  draggesture: 1,
  dragover: 1,
  contextmenu: 1,
  created: 2,
  removed: 2,
  sizechange: 2
};
var event_handlers = /* @__PURE__ */ new WeakMap();
var mutObserver = null;
var observeMutation = /* @__PURE__ */ __name((mutations, observer) => {
  const sendEvent = /* @__PURE__ */ __name((node, code) => {
    const store = event_handlers.get(node);
    if (store && store[code]) {
      node.dispatchEvent(new Event(code, {}));
    }
  }, "sendEvent");
  const notify = /* @__PURE__ */ __name((node, create) => {
    if (create) {
      sendEvent(node, "created");
    }
    for (let c = node.firstChild; c; c = c.nextSibling) {
      notify(c, create);
    }
    if (!create) {
      sendEvent(node, "removed");
    }
  }, "notify");
  for (const mutation of mutations) {
    if (mutation.type == "childList") {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          notify(node, true);
        });
      }
      if (mutation.removedNodes) {
        mutation.removedNodes.forEach((node) => {
          notify(node, false);
        });
      }
    }
  }
}, "observeMutation");
var sizeObserver = null;
function observeSize(entries) {
  entries.forEach((entry) => {
    let dom = entry.target;
    if (dom.offsetParent !== null) {
      dom.dispatchEvent(new Event("resized"));
    }
  });
}
__name(observeSize, "observeSize");
function dispatchEvent(ev) {
  let target = ev.target, noup = unbubbleEvents[ev.type] === 2;
  while (target) {
    const store = event_handlers.get(target);
    if (store) {
      const callback = store[ev.type];
      if (callback) {
        if (Array.isArray(callback)) {
          callback.some((c) => c(ev));
        } else {
          callback(ev);
        }
        if (ev.stopPropagation || ev.defaultPrevented || noup) {
          break;
        }
      }
    }
    target = target.parentNode;
    if (target == document) {
      break;
    }
  }
}
__name(dispatchEvent, "dispatchEvent");
function addEvent(node, name, handler, prepend = false) {
  if (name == "removed" || name == "created") {
    if (!mutObserver) {
      mutObserver = new MutationObserver(observeMutation);
      mutObserver.observe(document.body, { childList: true, subtree: true });
    }
  } else if (name == "resized") {
    if (!sizeObserver) {
      sizeObserver = new ResizeObserver(observeSize);
    }
    sizeObserver.observe(node);
  }
  let store = event_handlers.get(node);
  if (!store) {
    store = {};
    event_handlers.set(node, store);
  }
  if (!store[name]) {
    store[name] = handler;
    node.addEventListener(name, dispatchEvent);
  } else {
    const entry = store[name];
    if (Array.isArray(entry)) {
      entry.push(handler);
    } else {
      store[name] = [entry, handler];
    }
  }
}
__name(addEvent, "addEvent");

// src/core/component.ts
var FRAGMENT = Symbol("fragment");
var COMPONENT = Symbol("component");
var RE_NUMBER = /^-?\d+(\.\d*)?$/;
function genClassNames(x) {
  let classes = [];
  let self = Object.getPrototypeOf(x);
  while (self && self.constructor !== Component) {
    let clsname = self.constructor.name;
    classes.push("x4" + clsname.toLowerCase());
    self = Object.getPrototypeOf(self);
  }
  return classes;
}
__name(genClassNames, "genClassNames");
var gen_id = 1e3;
var makeUniqueComponentId = /* @__PURE__ */ __name(() => {
  return `x4-${gen_id++}`;
}, "makeUniqueComponentId");
var _Component = class _Component extends CoreElement {
  constructor(props) {
    var _a, _b;
    super();
    this.props = props;
    if (props.existingDOM) {
      this.dom = props.existingDOM;
    } else {
      if (props.ns) {
        this.dom = document.createElementNS(props.ns, (_a = props.tag) != null ? _a : "div");
      } else {
        this.dom = document.createElement((_b = props.tag) != null ? _b : "div");
      }
      if (props.attrs) {
        this.setAttributes(props.attrs);
      }
      if (props.cls) {
        this.addClass(props.cls);
      }
      if (props.hidden) {
        this.show(false);
      }
      if (props.id !== void 0) {
        this.setAttribute("id", props.id);
      }
      if (props.width !== void 0) {
        this.setStyleValue("width", props.width);
      }
      if (props.height !== void 0) {
        this.setStyleValue("height", props.height);
      }
      if (props.tooltip) {
        this.setAttribute("tooltip", props.tooltip);
      }
      if (props.style) {
        this.setStyle(props.style);
      }
      if (props.content) {
        this.setContent(props.content);
      }
      if (props.dom_events) {
        this.setDOMEvents(props.dom_events);
      }
      const classes = genClassNames(this);
      this.dom.classList.add(...classes);
      if (props.disabled) {
        this.addDOMEvent("created", () => {
          this.enable(false);
        });
      }
    }
    this.dom[COMPONENT] = this;
  }
  // :: CLASSES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * 
   */
  hasClass(cls) {
    return this.dom.classList.contains(cls);
  }
  /**
   * 
   */
  addClass(cls) {
    if (!cls) return;
    if (cls.indexOf(" ") >= 0) {
      const ccs = cls.split(" ");
      this.dom.classList.add(...ccs);
    } else {
      this.dom.classList.add(cls);
    }
  }
  /**
   * 
   */
  removeClass(cls) {
    if (!cls) return;
    if (cls.indexOf(" ") >= 0) {
      const ccs = cls.split(" ");
      this.dom.classList.remove(...ccs);
    } else {
      this.dom.classList.remove(cls);
    }
  }
  /**
   * 
   */
  toggleClass(cls) {
    if (!cls) return;
    const toggle = /* @__PURE__ */ __name((x) => {
      this.dom.classList.toggle(x);
    }, "toggle");
    if (cls.indexOf(" ") >= 0) {
      const ccs = cls.split(" ");
      ccs.forEach(toggle);
    } else {
      toggle(cls);
    }
  }
  /**
   * 
   */
  setClass(cls, set = true) {
    if (set) this.addClass(cls);
    else this.removeClass(cls);
  }
  // :: ATTRIBUTES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * attributes
   */
  setAttributes(attrs) {
    for (const name in attrs) {
      const value = attrs[name];
      this.setAttribute(name, value);
    }
  }
  /**
   * 
   */
  setAttribute(name, value) {
    if (value === null || value === void 0) {
      this.dom.removeAttribute(name);
    } else {
      this.dom.setAttribute(name, "" + value);
    }
  }
  /**
   * 
   */
  getAttribute(name) {
    return this.dom.getAttribute(name);
  }
  /**
   * 
   */
  getData(name) {
    return this.getAttribute("data-" + name);
  }
  /**
   * 
   */
  setData(name, value) {
    return this.setAttribute("data-" + name, value);
  }
  /**
   * idem as setData but onot on dom, you can store anything 
   */
  setInternalData(name, value) {
    if (!this.store) {
      this.store = /* @__PURE__ */ new Map();
    }
    this.store.set(name, value);
    return this;
  }
  getInternalData(name) {
    var _a;
    return (_a = this.store) == null ? void 0 : _a.get(name);
  }
  // :: DOM EVENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * 
   */
  addDOMEvent(name, listener, prepend = false) {
    addEvent(this.dom, name, listener, prepend);
  }
  /**
   * 
   */
  setDOMEvents(events) {
    for (const name in events) {
      this.addDOMEvent(name, events[name]);
    }
  }
  // :: HILEVEL EVENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * tool to move named events to internal event map
   * @internal
   */
  mapPropEvents(props, ...elements) {
    const p = props;
    elements.forEach((n) => {
      if (p.hasOwnProperty(n)) {
        this.on(n, p[n]);
      }
    });
  }
  // :: CONTENT ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * remove all content from component
   */
  clearContent() {
    const d = this.dom;
    while (d.firstChild) {
      d.removeChild(d.firstChild);
    }
  }
  /**
   * change the whole content of the component
   * clear the content before
   * @param content new content
   */
  setContent(content) {
    this.clearContent();
    this.appendContent(content);
  }
  /**
   * cf. appendContent
   * @param content content to append
   */
  appendContent(content) {
    const set = /* @__PURE__ */ __name((d, c) => {
      if (c instanceof _Component) {
        d.appendChild(c.dom);
      } else if (c instanceof UnsafeHtml) {
        d.insertAdjacentHTML("beforeend", c.toString());
      } else if (typeof c === "string" || typeof c === "number") {
        const tnode = document.createTextNode(c.toString());
        d.appendChild(tnode);
      } else if (c) {
        console.warn("Unknown type to append: ", c);
      }
    }, "set");
    if (!isArray(content)) {
      set(this.dom, content);
    } else if (content.length <= 8) {
      for (const c of content) {
        set(this.dom, c);
      }
    } else {
      const fragment = document.createDocumentFragment();
      for (const child of content) {
        set(fragment, child);
      }
      this.dom.appendChild(fragment);
    }
  }
  /**
   * cf. appendContent
   * @param content content to append
   */
  prependContent(content) {
    const d = this.dom;
    const set = /* @__PURE__ */ __name((c) => {
      if (c instanceof _Component) {
        d.insertBefore(d.firstChild, c.dom);
      } else if (c instanceof UnsafeHtml) {
        d.insertAdjacentHTML("beforebegin", c.toString());
      } else if (typeof c === "string" || typeof c === "number") {
        const tnode = document.createTextNode(c.toString());
        d.insertBefore(d.firstChild, tnode);
      } else {
        console.warn("Unknown type to append: ", c);
      }
    }, "set");
    if (!isArray(content)) {
      set(content);
    } else {
      const fragment = document.createDocumentFragment();
      for (const child of content) {
        set(child);
      }
      d.insertBefore(d.firstChild, fragment);
    }
  }
  /**
   * remove a single child
   * @see clearContent
   */
  removeChild(child) {
    this.dom.removeChild(child.dom);
  }
  /**
   * query all elements by selector
   */
  queryAll(selector) {
    const all = this.dom.querySelectorAll(selector);
    const rc = new Array(all.length);
    all.forEach((x, i) => rc[i] = componentFromDOM(x));
    return rc;
  }
  /**
   * 
   */
  query(selector) {
    const r = this.dom.querySelector(selector);
    return componentFromDOM(r);
  }
  // :: STYLES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * 
   */
  setAria(name, value) {
    this.setAttribute(name, value);
    return this;
  }
  /**
   * 
   */
  setStyle(style) {
    const _style = this.dom.style;
    for (const name in style) {
      let value = style[name];
      if (!unitless[name] && (isNumber(value) || RE_NUMBER.test(value))) {
        value += "px";
      }
      _style[name] = value;
    }
    return this;
  }
  /**
   * 
   */
  setStyleValue(name, value) {
    const _style = this.dom.style;
    if (isNumber(value)) {
      let v = value + "";
      if (!unitless[name]) {
        v += "px";
      }
      _style[name] = v;
    } else {
      _style[name] = value;
    }
    return this;
  }
  /**
   * 
   * @param name 
   * @returns 
   */
  getStyleValue(name) {
    const _style = this.dom.style;
    return _style[name];
  }
  setWidth(w) {
    this.setStyleValue("width", isNumber(w) ? w + "px" : w);
  }
  setHeight(h) {
    this.setStyleValue("height", isNumber(h) ? h + "px" : h);
  }
  /**
   * 
   */
  setStyleVariable(name, value) {
    this.dom.style.setProperty(name, value);
  }
  /**
   * 
   */
  getStyleVariable(name) {
    const style = this.getComputedStyle();
    return style.getPropertyValue(name);
  }
  /**
   * 
   * @returns 
   */
  getComputedStyle() {
    return getComputedStyle(this.dom);
  }
  /**
   * 
   */
  setCapture(pointerId) {
    this.dom.setPointerCapture(pointerId);
  }
  /**
   * 
   */
  releaseCapture(pointerId) {
    this.dom.releasePointerCapture(pointerId);
  }
  /**
   * 
   */
  getBoundingRect() {
    const rc = this.dom.getBoundingClientRect();
    return new Rect(rc.x, rc.y, rc.width, rc.height);
  }
  // :: MISC ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * 
   */
  focus() {
    this.dom.focus();
  }
  /**
   * 
   */
  scrollIntoView(arg) {
    this.dom.scrollIntoView(arg);
  }
  /**
   * 
   */
  isVisible() {
    return this.dom.offsetParent !== null;
  }
  /**
   * 
   */
  show(vis = true) {
    this.setClass("x4hidden", !vis);
  }
  /**
   * 
   */
  hide() {
    this.show(false);
  }
  /**
   * enable or disable a component (all sub HTMLElement will be also disabled)
   */
  enable(ena = true) {
    this.setAttribute("disabled", !ena);
    const nodes = this.enumChildNodes(true);
    nodes.forEach((x) => {
      if (x instanceof HTMLInputElement) {
        x.disabled = !ena;
      }
    });
  }
  /**
   * 
   */
  disable() {
    this.enable(false);
  }
  /**
   * check if element is marked disabled
   */
  isDisabled() {
    return this.getAttribute("disabled");
  }
  /**
   * 
   */
  nextElement() {
    const nxt = this.dom.nextElementSibling;
    return componentFromDOM(nxt);
  }
  /**
   * 
   * @returns 
   */
  prevElement() {
    const nxt = this.dom.previousElementSibling;
    return componentFromDOM(nxt);
  }
  /**
   * search for parent that match the given contructor 
   */
  parentElement(cls) {
    let p = this.dom;
    while (p.parentElement) {
      const cp = componentFromDOM(p.parentElement);
      if (!cls) {
        return cp;
      }
      if (cp && cp instanceof cls) {
        return cp;
      }
      p = p.parentElement;
    }
    return null;
  }
  /**
   * 
   * @returns 
   */
  firstChild() {
    const nxt = this.dom.firstElementChild;
    return componentFromDOM(nxt);
  }
  /**
   * 
   * @returns 
   */
  lastChild() {
    const nxt = this.dom.lastElementChild;
    return componentFromDOM(nxt);
  }
  /**
   * renvoie la liste des Composants enfants
   */
  enumChildComponents(recursive) {
    let children = [];
    const nodes = this.enumChildNodes(recursive);
    nodes.forEach((c) => {
      const cc = componentFromDOM(c);
      if (cc) {
        children.push(cc);
      }
    });
    return children;
  }
  /**
   * return children list of node (not all should be components)
   */
  enumChildNodes(recursive) {
    let children = Array.from(recursive ? this.dom.querySelectorAll("*") : this.dom.children);
    return children;
  }
  /**
   * 
   */
  animate(keyframes, duration) {
    this.dom.animate(keyframes, duration);
  }
  // :: TSX/REACT ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * called by the compiler when a jsx element is seen
   */
  static createElement(clsOrTag, attrs, ...children) {
    let comp;
    if (clsOrTag == this.createFragment || clsOrTag === FRAGMENT) {
      return children;
    }
    if (clsOrTag instanceof Function) {
      attrs = attrs != null ? attrs : {};
      if (!attrs.children && children && children.length) {
        attrs.content = children;
      }
      comp = new clsOrTag(attrs != null ? attrs : {});
    } else {
      comp = new _Component({
        tag: clsOrTag,
        content: children,
        ...attrs
      });
    }
    if (children && children.length) {
    }
    return comp;
  }
  /**
   * 
   */
  static createFragment() {
    return this.createElement(FRAGMENT, null);
  }
  // :: SPECIALS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  /**
   * 
   */
  queryInterface(name) {
    return null;
  }
};
__name(_Component, "Component");
var Component = _Component;
function componentFromDOM(node) {
  return node ? node[COMPONENT] : null;
}
__name(componentFromDOM, "componentFromDOM");
function wrapDOM(el) {
  const com = componentFromDOM(el);
  if (com) {
    return com;
  }
  return new Component({ existingDOM: el });
}
__name(wrapDOM, "wrapDOM");
var _Flex = class _Flex extends Component {
  constructor() {
    super({});
  }
};
__name(_Flex, "Flex");
var Flex = _Flex;

// src/core/core_colors.ts
function hx(v) {
  const hex = v.toString(16);
  return hex.padStart(2, "0");
}
__name(hx, "hx");
function round(v) {
  return Math.round(v);
}
__name(round, "round");
var _Color = class _Color {
  constructor(...args) {
    this.rgb = [0, 0, 0, 1];
    this.invalid = false;
    if (isString(args[0])) {
      this.setValue(args[0]);
    } else {
      this.setRgb(args[0], args[1], args[2], args[3]);
    }
  }
  /**
   * accepts:
   * 	#aaa
   *  #ababab
   *  #ababab55
   *  rgb(a,b,c)
   *  rgba(a,b,c,d)
   *  var( --color-5 )
   */
  setValue(value) {
    this.invalid = false;
    if (value.length == 4 && /#[0-9a-fA-F]{3}/.test(value)) {
      const r1 = parseInt(value[1], 16);
      const g1 = parseInt(value[2], 16);
      const b1 = parseInt(value[3], 16);
      return this.setRgb(r1 << 4 | r1, g1 << 4 | g1, b1 << 4 | b1, 1);
    }
    if (value.length == 7 && /#[0-9a-fA-F]{6}/.test(value)) {
      const r1 = parseInt(value[1], 16);
      const r2 = parseInt(value[2], 16);
      const g1 = parseInt(value[3], 16);
      const g2 = parseInt(value[4], 16);
      const b1 = parseInt(value[5], 16);
      const b2 = parseInt(value[6], 16);
      return this.setRgb(r1 << 4 | r2, g1 << 4 | g2, b1 << 4 | b2, 1);
    }
    if (value.length == 9 && /#[0-9a-fA-F]{8}/.test(value)) {
      const r1 = parseInt(value[1], 16);
      const r2 = parseInt(value[2], 16);
      const g1 = parseInt(value[3], 16);
      const g2 = parseInt(value[4], 16);
      const b1 = parseInt(value[5], 16);
      const b2 = parseInt(value[6], 16);
      const a1 = parseInt(value[7], 16);
      const a2 = parseInt(value[8], 16);
      return this.setRgb(r1 << 4 | r2, g1 << 4 | g2, b1 << 4 | b2, (a1 << 4 | a2) / 255);
    }
    if (value.startsWith("rgba")) {
      const re = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*((\d+)|(\d*\.\d+)|(\.\d+))\s*\)/;
      const m = re.exec(value);
      if (m) {
        return this.setRgb(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseFloat(m[4]));
      }
    } else if (value.startsWith("rgb")) {
      const re = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
      const m = re.exec(value);
      if (m) {
        return this.setRgb(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), 1);
      }
    } else if (value.startsWith("var")) {
      const re = /var\s*\(([^)]*)\)/;
      const m = re.exec(value);
      if (m) {
        const expr = m[1].trim();
        const style = getComputedStyle(document.documentElement);
        const value2 = style.getPropertyValue(expr);
        return this.setValue(value2);
      }
    }
    this.invalid = true;
    return this.setRgb(255, 0, 0, 1);
  }
  setHsv(h, s, v, a = 1) {
    let i = Math.min(5, Math.floor(h * 6)), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
    let R, G, B;
    switch (i) {
      case 0:
        R = v;
        G = t;
        B = p;
        break;
      case 1:
        R = q;
        G = v;
        B = p;
        break;
      case 2:
        R = p;
        G = v;
        B = t;
        break;
      case 3:
        R = p;
        G = q;
        B = v;
        break;
      case 4:
        R = t;
        G = p;
        B = v;
        break;
      case 5:
        R = v;
        G = p;
        B = q;
        break;
    }
    return this.setRgb(R * 255, G * 255, B * 255, a);
  }
  setRgb(r, g, b, a) {
    this.rgb = [clamp(r, 0, 255), clamp(g, 0, 255), clamp(b, 0, 255), clamp(a, 0, 1)];
    return this;
  }
  toRgbString(withAlpha) {
    const _ = this.rgb;
    return withAlpha === false || _[3] == 1 ? `rgb(${round(_[0])},${round(_[1])},${round(_[2])})` : `rgba(${round(_[0])},${round(_[1])},${round(_[2])},${_[3].toFixed(3)})`;
  }
  toHexString() {
    const _ = this.rgb;
    return _[3] == 1 ? `#(${hx(_[0])},${hx(_[1])},${hx(_[2])})` : `rgba(${hx(_[0])},${hx(_[1])},${hx(_[2])},${hx(_[3] * 255)})`;
  }
  toRgb() {
    const _ = this.rgb;
    return { red: _[0], green: _[1], blue: _[2], alpha: _[3] };
  }
  toHsv() {
    let el = this.toRgb();
    el.red /= 255;
    el.green /= 255;
    el.blue /= 255;
    const max = Math.max(el.red, el.green, el.blue);
    const min = Math.min(el.red, el.green, el.blue);
    const delta = max - min;
    const saturation = max === 0 ? 0 : delta / max;
    const value = max;
    let hue;
    if (delta === 0) {
      hue = 0;
    } else {
      switch (max) {
        case el.red:
          hue = (el.green - el.blue) / delta / 6 + (el.green < el.blue ? 1 : 0);
          break;
        case el.green:
          hue = (el.blue - el.red) / delta / 6 + 1 / 3;
          break;
        case el.blue:
          hue = (el.red - el.green) / delta / 6 + 2 / 3;
          break;
      }
    }
    return { hue, saturation, value, alpha: el.alpha };
  }
  getAlpha() {
    return this.rgb[3];
  }
  setAlpha(a) {
    this.rgb[3] = clamp(a, 0, 1);
    return this;
  }
  isInvalid() {
    return this.invalid;
  }
};
__name(_Color, "Color");
var Color = _Color;

// src/core/core_dragdrop.ts
var x_drag_cb = Symbol("x-drag-cb");
var _DragManager = class _DragManager {
  // pb with name of settimeout return
  /**
   * 
   */
  registerDraggableElement(el) {
    el.addDOMEvent("dragstart", (ev) => {
      this.dragSource = el;
      this.dragGhost = el.dom.cloneNode(true);
      this.dragGhost.classList.add("dragged");
      document.body.appendChild(this.dragGhost);
      el.addClass("dragging");
      ev.dataTransfer.setData("text/string", "1");
      ev.dataTransfer.setDragImage(new Image(), 0, 0);
      ev.stopPropagation();
    });
    el.addDOMEvent("drag", (ev) => {
      this.dragGhost.style.left = ev.pageX + "px";
      this.dragGhost.style.top = ev.pageY + "px";
    });
    el.addDOMEvent("dragend", (ev) => {
      el.removeClass("dragging");
      this.dragGhost.remove();
    });
    el.setAttribute("draggable", "true");
  }
  /**
   * 
   */
  registerDropTarget(el, cb, filterCB) {
    const dragEnter = /* @__PURE__ */ __name((ev) => {
      if (filterCB && !filterCB(this.dragSource)) {
        console.log("reject ", el);
        ev.dataTransfer.dropEffect = "none";
        return;
      }
      console.log("accepted ", el);
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "copy";
    }, "dragEnter");
    const dragOver = /* @__PURE__ */ __name((ev) => {
      if (filterCB && !filterCB(this.dragSource)) {
        console.log("reject ", el);
        ev.dataTransfer.dropEffect = "none";
        return;
      }
      ev.preventDefault();
      if (this.dropTarget != el) {
        this.dropTarget = el;
        this._startCheck();
      }
      if (this.dropTarget) {
        const infos = {
          pt: { x: ev.pageX, y: ev.pageY },
          data: ev.dataTransfer
        };
        cb("drag", this.dragSource, infos);
      }
      ev.dataTransfer.dropEffect = "copy";
    }, "dragOver");
    const dragLeave = /* @__PURE__ */ __name((ev) => {
      this.dropTarget = null;
      ev.preventDefault();
    }, "dragLeave");
    const drop = /* @__PURE__ */ __name((ev) => {
      const infos = {
        pt: { x: ev.pageX, y: ev.pageY },
        data: ev.dataTransfer
      };
      cb("drop", this.dragSource, infos);
      this.dropTarget = null;
      el.removeClass("drop-over");
      ev.preventDefault();
    }, "drop");
    el.addDOMEvent("dragenter", dragEnter);
    el.addDOMEvent("dragover", dragOver);
    el.addDOMEvent("dragleave", dragLeave);
    el.addDOMEvent("drop", drop);
    el.setInternalData(x_drag_cb, cb);
  }
  _startCheck() {
    if (this.timer) {
      clearInterval(this.timer);
      this._check();
    }
    this.timer = setInterval(() => this._check(), 300);
  }
  _check() {
    const leaving = /* @__PURE__ */ __name((x) => {
      x.removeClass("drop-over");
      const cb = x.getInternalData(x_drag_cb);
      cb("leave", this.dragSource);
    }, "leaving");
    const entering = /* @__PURE__ */ __name((x) => {
      x.addClass("drop-over");
      const cb = x.getInternalData(x_drag_cb);
      cb("enter", this.dragSource);
    }, "entering");
    if (this.dropTarget) {
      if (!this.notified || this.notified != this.dropTarget) {
        if (this.notified) {
          leaving(this.notified);
        }
        this.notified = this.dropTarget;
        entering(this.notified);
      }
    } else {
      if (this.notified) {
        leaving(this.notified);
        this.notified = null;
        clearInterval(this.timer);
      }
    }
  }
};
__name(_DragManager, "DragManager");
var DragManager = _DragManager;
var dragManager = new DragManager();

// src/core/core_router.ts
function parseRoute(str, loose = false) {
  if (str instanceof RegExp) {
    return {
      keys: null,
      pattern: str
    };
  }
  const arr = str.split("/");
  let keys = [];
  let pattern = "";
  if (arr[0] == "") {
    arr.shift();
  }
  for (const tmp of arr) {
    const c = tmp[0];
    if (c === "*") {
      keys.push("wild");
      pattern += "/(.*)";
    } else if (c === ":") {
      const o = tmp.indexOf("?", 1);
      const ext = tmp.indexOf(".", 1);
      keys.push(tmp.substring(1, o >= 0 ? o : ext >= 0 ? ext : tmp.length));
      pattern += o >= 0 && ext < 0 ? "(?:/([^/]+?))?" : "/([^/]+?)";
      if (ext >= 0) {
        pattern += (o >= 0 ? "?" : "") + "\\" + tmp.substring(ext);
      }
    } else {
      pattern += "/" + tmp;
    }
  }
  return {
    keys,
    pattern: new RegExp(`^${pattern}${loose ? "(?=$|/)" : "/?$"}`, "i")
  };
}
__name(parseRoute, "parseRoute");
var _Router = class _Router extends EventSource {
  constructor(useHash = true) {
    super();
    this.m_routes = [];
    this.m_useHash = useHash;
    window.addEventListener("popstate", (event) => {
      const url = this._getLocation();
      const found = this._find(url);
      found.handlers.forEach((h) => {
        h(found.params, url);
      });
    });
  }
  get(uri, handler) {
    let { keys, pattern } = parseRoute(uri);
    this.m_routes.push({ keys, pattern, handler });
  }
  init() {
    this.navigate(this._getLocation());
  }
  _getLocation() {
    return this.m_useHash ? "/" + document.location.hash.substring(1) : document.location.pathname;
  }
  navigate(uri, notify = true, replace = false) {
    if (!uri.startsWith("/")) {
      uri = "/" + uri;
    }
    const found = this._find(uri);
    if (!found || found.handlers.length == 0) {
      console.log("route not found: " + uri);
      this.fire("error", { code: 404, message: "route not found" });
      return;
    }
    if (this.m_useHash) {
      while (uri.at(0) == "/") {
        uri = uri.substring(1);
      }
      uri = "#" + uri;
    }
    if (replace) {
      window.history.replaceState({}, "", uri);
    } else {
      window.history.pushState({}, "", uri);
    }
    if (notify) {
      found.handlers.forEach((h) => {
        h(found.params, uri);
      });
    }
  }
  _find(url) {
    let matches = [];
    let params = {};
    let handlers = [];
    for (const tmp of this.m_routes) {
      if (!tmp.keys) {
        matches = tmp.pattern.exec(url);
        if (!matches) {
          continue;
        }
        if (matches["groups"]) {
          for (const k in matches["groups"]) {
            params[k] = matches["groups"][k];
          }
        }
        handlers = [...handlers, tmp.handler];
      } else if (tmp.keys.length > 0) {
        matches = tmp.pattern.exec(url);
        if (matches === null) {
          continue;
        }
        for (let j = 0; j < tmp.keys.length; ) {
          params[tmp.keys[j]] = matches[++j];
        }
        handlers = [...handlers, tmp.handler];
      } else if (tmp.pattern.test(url)) {
        handlers = [...handlers, tmp.handler];
      }
    }
    return { params, handlers };
  }
};
__name(_Router, "Router");
var Router = _Router;

// src/core/core_svg.ts
var SVG_NS = "http://www.w3.org/2000/svg";
function d2r(d) {
  return d * Math.PI / 180;
}
__name(d2r, "d2r");
function p2c(x, y, r, deg) {
  const rad = d2r(deg);
  return {
    x: x + r * Math.cos(rad),
    y: y + r * Math.sin(rad)
  };
}
__name(p2c, "p2c");
function num(x) {
  return Math.round(x * 1e3) / 1e3;
}
__name(num, "num");
function clean(a, ...b) {
  b = b.map((v) => {
    if (typeof v === "number" && isFinite(v)) {
      return num(v);
    }
    return v;
  });
  return String.raw(a, ...b);
}
__name(clean, "clean");
var _SvgItem = class _SvgItem {
  constructor(tag) {
    this._dom = document.createElementNS("http://www.w3.org/2000/svg", tag);
  }
  getDom() {
    return this._dom;
  }
  /**
   * change the stroke color
   * @param color 
   */
  stroke(color, width) {
    this.setAttr("stroke", color);
    if (width !== void 0) {
      this.setAttr("stroke-width", width + "px");
    }
    return this;
  }
  /**
   * change the stroke width
   * @param width 
   */
  strokeWidth(width) {
    this.setAttr("stroke-width", width + "px");
    return this;
  }
  strokeCap(cap) {
    return this.setAttr("stroke-linecap", cap);
  }
  strokeOpacity(opacity) {
    return this.setAttr("stroke-opacity", opacity + "");
  }
  /**
   * 
   */
  antiAlias(set) {
    return this.setAttr("shape-rendering", set ? "auto" : "crispEdges");
  }
  /**
   * change the fill color
   * @param color 
   */
  fill(color) {
    this.setAttr("fill", color);
    return this;
  }
  no_fill() {
    this.setAttr("fill", "transparent");
    return this;
  }
  /**
   * define a new attribute
   * @param name attibute name
   * @param value attribute value
   * @returns this
   */
  setAttr(name, value) {
    this._dom.setAttribute(name, value);
    return this;
  }
  /**
   * 
   */
  setStyle(name, value) {
    const _style = this._dom.style;
    if (isNumber(value)) {
      let v = value + "";
      if (!isUnitLess(name)) {
        v += "px";
      }
      _style[name] = v;
    } else {
      _style[name] = value;
    }
    return this;
  }
  /**
   * add a class
   * @param name class name to add 
   */
  addClass(cls) {
    if (!cls) return;
    if (cls.indexOf(" ") >= 0) {
      const ccs = cls.split(" ");
      this._dom.classList.add(...ccs);
    } else {
      this._dom.classList.add(cls);
    }
  }
  /**
   * 
   */
  clip(id) {
    this.setAttr("clip-path", `url(#${id})`);
    return this;
  }
  /**
   * 
   */
  transform(tr) {
    this.setAttr("transform", tr);
    return this;
  }
  /**
   * 
   */
  rotate(deg, cx, cy) {
    this.transform(`rotate( ${deg} ${cx} ${cy} )`);
    return this;
  }
  translate(dx, dy) {
    this.transform(`translate( ${dx} ${dy} )`);
    return this;
  }
  scale(x) {
    this.transform(`scale( ${x} )`);
    return this;
  }
  /**
   * 
   */
  addDOMEvent(name, listener, prepend = false) {
    addEvent(this._dom, name, listener, prepend);
    return this;
  }
};
__name(_SvgItem, "SvgItem");
var SvgItem = _SvgItem;
var _SvgPath = class _SvgPath extends SvgItem {
  constructor() {
    super("path");
    this._path = "";
  }
  _update() {
    this.setAttr("d", this._path);
    return this;
  }
  /**
   * move the current pos
   * @param x new pos x
   * @param y new pos y
   * @returns this
   */
  moveTo(x, y) {
    this._path += clean`M${x},${y}`;
    return this._update();
  }
  /**
   * draw aline to the given point
   * @param x end x
   * @param y end y
   * @returns this
   */
  lineTo(x, y) {
    this._path += clean`L${x},${y}`;
    return this._update();
  }
  /**
   * close the currentPath
   */
  closePath() {
    this._path += "Z";
    return this._update();
  }
  /**
   * draw an arc
   * @param x center x
   * @param y center y
   * @param r radius
   * @param start angle start in degrees
   * @param end angle end in degrees
   * @returns this
   */
  arc(x, y, r, start, end) {
    const st = p2c(x, y, r, start - 90);
    const en2 = p2c(x, y, r, end - 90);
    const flag = end - start <= 180 ? "0" : "1";
    this._path += clean`M${st.x},${st.y}A${r},${r} 0 ${flag} 1 ${en2.x},${en2.y}`;
    return this._update();
  }
};
__name(_SvgPath, "SvgPath");
var SvgPath = _SvgPath;
var _SvgText = class _SvgText extends SvgItem {
  constructor(x, y, txt) {
    super("text");
    this.setAttr("x", num(x) + "");
    this.setAttr("y", num(y) + "");
    this._dom.innerHTML = txt;
  }
  font(font) {
    return this.setAttr("font-family", font);
  }
  fontSize(size) {
    return this.setAttr("font-size", size + "");
  }
  fontWeight(weight) {
    return this.setAttr("font-weight", weight);
  }
  textAlign(align) {
    let al;
    switch (align) {
      case "left":
        al = "start";
        break;
      case "center":
        al = "middle";
        break;
      case "right":
        al = "end";
        break;
      default:
        return this;
    }
    return this.setAttr("text-anchor", al);
  }
  verticalAlign(align) {
    let al;
    switch (align) {
      case "top":
        al = "hanging";
        break;
      case "center":
        al = "middle";
        break;
      case "bottom":
        al = "baseline";
        break;
      case "baseline":
        al = "mathematical";
        break;
      default:
        return;
    }
    return this.setAttr("alignment-baseline", al);
  }
};
__name(_SvgText, "SvgText");
var SvgText = _SvgText;
var _SvgShape = class _SvgShape extends SvgItem {
  constructor(tag) {
    super(tag);
  }
};
__name(_SvgShape, "SvgShape");
var SvgShape = _SvgShape;
var _SvgGradient = class _SvgGradient extends SvgItem {
  constructor(x1, y1, x2, y2) {
    super("linearGradient");
    this._id = "gx-" + _SvgGradient.g_id;
    _SvgGradient.g_id++;
    this.setAttr("id", this._id);
    this.setAttr("x1", isString(x1) ? x1 : num(x1) + "");
    this.setAttr("x2", isString(x2) ? x2 : num(x2) + "");
    this.setAttr("y1", isString(y1) ? y1 : num(y1) + "");
    this.setAttr("y2", isString(y2) ? y2 : num(y2) + "");
    this._stops = [];
  }
  get id() {
    return "url(#" + this._id + ")";
  }
  addStop(offset, color) {
    this._dom.insertAdjacentHTML("beforeend", `<stop offset="${offset}%" stop-color="${color}"></stop>`);
    return this;
  }
};
__name(_SvgGradient, "SvgGradient");
_SvgGradient.g_id = 1;
var SvgGradient = _SvgGradient;
var _SvgGroup = class _SvgGroup extends SvgItem {
  constructor(tag = "g") {
    super(tag);
  }
  /**
   * 
   */
  append(item) {
    this._dom.appendChild(item.getDom());
    return item;
  }
  /**
   * 
   */
  path() {
    const path = new SvgPath();
    return this.append(path);
  }
  text(x, y, txt) {
    const text = new SvgText(x, y, txt);
    return this.append(text);
  }
  ellipse(x, y, r1, r2 = r1) {
    const shape = new SvgShape("ellipse");
    shape.setAttr("cx", num(x) + "");
    shape.setAttr("cy", num(y) + "");
    shape.setAttr("rx", num(r1) + "");
    shape.setAttr("ry", num(r2) + "");
    return this.append(shape);
  }
  rect(x, y, w, h) {
    if (h < 0) {
      y = y + h;
      h = -h;
    }
    const shape = new SvgShape("rect");
    shape.setAttr("x", num(x) + "");
    shape.setAttr("y", num(y) + "");
    shape.setAttr("width", num(w) + "");
    shape.setAttr("height", num(h) + "");
    return this.append(shape);
  }
  group() {
    const group = new _SvgGroup();
    return this.append(group);
  }
  /**
   * 
   * example
   * ```ts
   * const g = c.linear_gradient( '0%', '0%', '0%', '100%' )
   * 				.addStop( 0, 'red' )
   * 				.addStop( 100, 'green' );
   * 
   * p.rect( 0, 0, 100, 100 )
   * 		.stroke( g.id );
   * 
   * ```
   */
  linear_gradient(x1, y1, x2, y2) {
    const grad = new SvgGradient(x1, y1, x2, y2);
    return this.append(grad);
  }
  /**
   * clear 
   */
  clear() {
    const dom = this._dom;
    while (dom.firstChild) {
      dom.removeChild(dom.firstChild);
    }
  }
};
__name(_SvgGroup, "SvgGroup");
var SvgGroup = _SvgGroup;
var _SvgBuilder = class _SvgBuilder extends SvgGroup {
  constructor() {
    super();
  }
  addClip(x, y, w, h) {
    const id = "c-" + _SvgBuilder.g_clip_id++;
    const clip = new SvgGroup("clipPath");
    clip.setAttr("id", id);
    clip.rect(x, y, w, h);
    this.append(clip);
    return id;
  }
};
__name(_SvgBuilder, "SvgBuilder");
_SvgBuilder.g_clip_id = 1;
var SvgBuilder = _SvgBuilder;
var _SvgComponent = class _SvgComponent extends Component {
  constructor(props) {
    super({ ...props, tag: "svg", ns: SVG_NS });
    this.setAttribute("xmlns", SVG_NS);
    if (props.viewbox) {
      this.setAttribute("viewbox", props.viewbox);
    }
    if (props.svg) {
      this.dom.appendChild(props.svg.getDom());
    }
  }
};
__name(_SvgComponent, "SvgComponent");
var SvgComponent = _SvgComponent;

// src/components/boxes/boxes.ts
var _Box = class _Box extends Component {
};
__name(_Box, "Box");
var Box = _Box;
var _HBox = class _HBox extends Box {
};
__name(_HBox, "HBox");
var HBox = _HBox;
var _VBox = class _VBox extends Box {
  constructor(p) {
    super(p);
  }
};
__name(_VBox, "VBox");
var VBox = _VBox;
var _StackBox = class _StackBox extends Box {
  constructor(props) {
    var _a;
    super(props);
    this._items = (_a = props.items) == null ? void 0 : _a.map((itm) => {
      return { ...itm, page: null };
    });
    if (props.default) {
      this.select(props.default);
    } else if (this._items.length) {
      this.select(this._items[0].name);
    }
  }
  select(name) {
    let sel = this.query(`.selected`);
    if (sel) {
      sel.setClass("selected", false);
    }
    const pg = this._items.find((x) => x.name == name);
    if (pg) {
      if (!pg.page) {
        pg.page = this._createPage(pg);
        this.appendContent(pg.page);
      }
      sel = pg.page;
      if (sel) {
        sel.setClass("selected", true);
      }
    }
  }
  /**
   * 
   */
  _createPage(page) {
    let content;
    content = page.content;
    content == null ? void 0 : content.setData("stackname", page.name);
    return content;
  }
};
__name(_StackBox, "StackBox");
var StackBox = _StackBox;

// src/components/icon/icon.ts
var _SvgLoader = class _SvgLoader {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
    this.waiters = /* @__PURE__ */ new Map();
  }
  async load(file) {
    if (this.cache.has(file)) {
      return Promise.resolve(this.cache.get(file));
    }
    return new Promise((resolve, reject) => {
      if (this.waiters.has(file)) {
        this.waiters.get(file).push(resolve);
      } else {
        this.waiters.set(file, [resolve]);
        this._load(file).then((data) => {
          console.timeEnd(file);
          this.cache.set(file, data);
          const ww = this.waiters.get(file);
          ww.forEach((cb) => cb(data));
        });
      }
    });
  }
  async _load(file) {
    console.time(file);
    const res = await fetch(file);
    if (res.ok) {
      return res.text();
    }
  }
};
__name(_SvgLoader, "SvgLoader");
var SvgLoader = _SvgLoader;
var svgLoader = new SvgLoader();
var _Icon = class _Icon extends Component {
  constructor(props) {
    super(props);
    this.setIcon(props.iconId);
  }
  /**
   * change the icon content
   * @param iconId if name is starting with var: then we use css variable name a path
   * @example
   * 
   * setIcon( "var:home" )
   * 
   * import myicon from "./myicon.svg"
   * setIcon( myicon );
   * 
   */
  setIcon(iconId) {
    if (iconId) {
      if (iconId.startsWith("var:")) {
        do {
          const path = iconId.substring(4);
          iconId = document.documentElement.style.getPropertyValue(path);
        } while (iconId.startsWith("var:"));
      }
      if (iconId.startsWith("data:image/svg+xml,<svg")) {
        this.dom.insertAdjacentHTML("beforeend", iconId.substring(19));
      } else if (iconId.endsWith(".svg")) {
        svgLoader.load(iconId).then((svg) => {
          this.clearContent();
          this.dom.insertAdjacentHTML("beforeend", svg);
        });
      } else {
        this.setContent(new Component({ tag: "img", attrs: { src: iconId } }));
      }
    } else {
      this.clearContent();
      this.addClass("empty");
    }
  }
};
__name(_Icon, "Icon");
var Icon = _Icon;

// src/components/button/button.ts
var _Button = class _Button extends Component {
  /**
      * Creates an instance of Button.
      * 
      * @param props - The properties for the button component, including label and icon.
      * @example
      * const button = new Button({ label: 'Submit', icon: 'check-icon' });
      */
  constructor(props) {
    super({ ...props, tag: "button", content: null });
    this.mapPropEvents(props, "click");
    this.addDOMEvent("click", (e) => this._on_click(e));
    this.setContent([
      new Icon({ id: "icon", iconId: this.props.icon }),
      new Component({ id: "label", content: this.props.label })
    ]);
  }
  /**
   * called by the system on click event
   */
  _on_click(ev) {
    this.fire("click", {});
    ev.preventDefault();
    ev.stopPropagation();
  }
  /**
      * Sets the text content of the button's label.
      * 
      * @param text - The new text or HTML content for the label.
      * @example
      * button.setText('Click Me');
      * button.setText(new UnsafeHtml('<b>Bold Text</b>'));
      */
  setText(text) {
    this.query("#label").setContent(text);
  }
  /**
      * Sets the icon of the button.
      * 
      * @param icon - The new icon ID to set on the button.
      * @example
      * button.setIcon('new-icon-id');
      */
  setIcon(icon) {
    this.query("#icon").setIcon(icon);
  }
};
__name(_Button, "Button");
var Button = _Button;

// src/components/btngroup/btngroup.ts
var _BtnGroup = class _BtnGroup extends Box {
  constructor(props) {
    super(props);
    if (props.align) {
      this.addClass("align-" + props.align);
    }
    this.addClass(props.vertical ? "x4vbox" : "x4hbox");
    if (props.items) {
      this.setButtons(props.items);
    }
    this.mapPropEvents(props, "btnclick");
  }
  /**
   * 
   * @param btns 
   */
  setButtons(btns) {
    this.clearContent();
    const childs = [];
    btns == null ? void 0 : btns.forEach((b) => {
      if (b === "-") {
        b = new Flex();
      } else if (isString(b)) {
        let title;
        const nm = b;
        switch (b) {
          case "ok":
            title = _tr.global.ok;
            break;
          case "cancel":
            title = _tr.global.cancel;
            break;
          case "abort":
            title = _tr.global.abort;
            break;
          case "no":
            title = _tr.global.no;
            break;
          case "yes":
            title = _tr.global.yes;
            break;
          case "retry":
            title = _tr.global.retry;
            break;
        }
        b = new Button({ label: title, click: /* @__PURE__ */ __name(() => {
          this.fire("btnclick", { emitter: nm });
        }, "click") });
      }
      childs.push(b);
    });
    super.setContent(childs);
  }
};
__name(_BtnGroup, "BtnGroup");
var BtnGroup = _BtnGroup;

// src/components/label/label.ts
var _Label = class _Label extends Component {
  constructor(p) {
    var _a;
    super({ ...p, content: null });
    this.setContent([
      new Icon({ id: "icon", iconId: this.props.icon }),
      new Component({ tag: "span", id: "text", content: (_a = this.props.text) != null ? _a : p.content })
    ]);
    if (p.labelFor) {
      this.setAttribute("for", p.labelFor);
    }
  }
  setText(text) {
    this.query("#text").setContent(text);
  }
  setIcon(icon) {
    this.query("#icon").setIcon(icon);
  }
};
__name(_Label, "Label");
var Label = _Label;

// src/components/sizers/sizer.ts
var _CSizer = class _CSizer extends Component {
  constructor(type, target) {
    super({});
    this._type = type;
    this.addClass(type);
    this.addDOMEvent("pointerdown", (e) => {
      this.setCapture(e.pointerId);
      this._ref = target != null ? target : componentFromDOM(this.dom.parentElement);
      this._delta = { x: 0, y: 0 };
      const rc = this._ref.getBoundingRect();
      if (this._type.includes("left")) {
        this._delta.x = e.pageX - rc.left;
      } else {
        this._delta.x = e.pageX - (rc.left + rc.width);
      }
      if (this._type.includes("top")) {
        this._delta.y = e.pageY - rc.top;
      } else {
        this._delta.y = e.pageY - (rc.top + rc.height);
      }
    });
    this.addDOMEvent("pointerup", (e) => {
      this.releaseCapture(e.pointerId);
      this._ref = null;
    });
    this.addDOMEvent("pointermove", (e) => {
      this._onMouseMove(e);
    });
  }
  _onMouseMove(e) {
    if (!this._ref) {
      return;
    }
    const pt = { x: e.pageX - this._delta.x, y: e.pageY - this._delta.y };
    const rc = this._ref.getBoundingRect();
    let nr = {};
    let horz = true;
    if (this._type.includes("top")) {
      nr.top = pt.y, nr.height = rc.top + rc.height - pt.y;
      horz = false;
    }
    if (this._type.includes("bottom")) {
      nr.height = pt.y - rc.top;
      horz = false;
    }
    if (this._type.includes("left")) {
      nr.left = pt.x;
      nr.width = rc.left + rc.width - pt.x;
    }
    if (this._type.includes("right")) {
      nr.width = pt.x - rc.left;
    }
    this._ref.setStyle(nr);
    const nrc = this._ref.getBoundingRect();
    this.fire("resize", { size: horz ? nrc.width : nrc.height });
    e.preventDefault();
    e.stopPropagation();
  }
};
__name(_CSizer, "CSizer");
var CSizer = _CSizer;

// src/components/popup/popup.ts
var modal_mask;
var modal_count = 0;
var modal_stack = [];
var autoclose_list = [];
var popup_list = [];
var _Popup = class _Popup extends Component {
  constructor(props) {
    super(props);
    this._isopen = false;
    this._isshown = false;
    /**
     * binded
     */
    this._dismiss = /* @__PURE__ */ __name((e) => {
      const onac = autoclose_list.some((x) => x.dom.contains(e.target));
      if (onac) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      this.dismiss();
    }, "_dismiss");
    if (this.props.sizable) {
      this._createSizers();
    }
  }
  displayNear(rc, dst = "top left", src = "top left", offset = { x: 0, y: 0 }) {
    this.setStyle({ left: "0px", top: "0px" });
    this._show();
    let rm = this.getBoundingRect();
    let xref = rc.left;
    let yref = rc.top;
    if (src.indexOf("right") >= 0) {
      xref = rc.left + rc.width;
    } else if (src.indexOf("center") >= 0) {
      xref = rc.left + rc.width / 2;
    }
    if (src.indexOf("bottom") >= 0) {
      yref = rc.bottom;
    } else if (src.indexOf("middle") >= 0) {
      yref = rc.top + rc.height / 2;
    }
    let halign = "l";
    if (dst.indexOf("right") >= 0) {
      xref -= rm.width;
    } else if (dst.indexOf("center") >= 0) {
      xref -= rm.width / 2;
    }
    let valign = "t";
    if (dst.indexOf("bottom") >= 0) {
      yref -= rm.height;
    } else if (dst.indexOf("middle") >= 0) {
      yref -= rm.height / 2;
    }
    if (offset) {
      xref += offset.x;
      yref += offset.y;
    }
    xref += document.scrollingElement.scrollLeft;
    yref += document.scrollingElement.scrollTop;
    this.displayAt(xref, yref);
  }
  /**
   * 
   */
  displayCenter() {
    this.displayNear(new Rect(window.innerWidth / 2, window.innerHeight / 2, 0, 0), "center middle");
  }
  /**
   * 
   */
  displayAt(x, y) {
    this.setStyle({
      left: x + "px",
      top: y + "px"
    });
    this._show();
    const rc = this.getBoundingRect();
    const width = window.innerWidth - 16;
    const height = window.innerHeight - 16;
    if (rc.right > width) {
      this.setStyleValue("left", width - rc.width);
    }
    if (rc.bottom > height) {
      this.setStyleValue("top", height - rc.height);
    }
    if (this.props.movable) {
      const movers = this.queryAll(".caption-element");
      movers.forEach((m) => new CMover(m, this));
      if (this.hasClass("popup-caption")) {
        new CMover(this, this);
      }
    }
    this.fire("opened", {});
  }
  _show() {
    if (this.props.modal && !this._isshown) {
      this._showModalMask();
      modal_stack.push(this);
      modal_count++;
    }
    this._isshown = true;
    if (this.props.autoClose) {
      if (autoclose_list.length == 0) {
        document.addEventListener("pointerdown", this._dismiss);
      }
      autoclose_list.push(this);
      this.setData("close", this.props.autoClose === true ? makeUniqueComponentId() : this.props.autoClose);
    }
    popup_list.push(this);
    document.body.appendChild(this.dom);
    this.show();
  }
  show(show = true) {
    this._isopen = show;
    super.show(show);
  }
  isOpen() {
    return this._isopen;
  }
  /**
   * 
   */
  close() {
    document.body.removeChild(this.dom);
    const idx = popup_list.indexOf(this);
    console.assert(idx >= 0);
    popup_list.splice(idx, 1);
    if (this.props.autoClose) {
      const idx2 = autoclose_list.indexOf(this);
      if (idx2 >= 0) {
        autoclose_list.splice(idx2, 1);
        if (autoclose_list.length == 0) {
          document.removeEventListener("pointerdown", this._dismiss);
        }
      }
    }
    if (this.props.modal) {
      const top = modal_stack.pop();
      console.assert(top == this);
      this._updateModalMask();
    }
    this._isshown = false;
    this.fire("closed", {});
  }
  /**
   * dismiss all popup belonging to the same group as 'this'
   */
  dismiss(after = false) {
    if (autoclose_list.length == 0) {
      return;
    }
    const cgroup = this.getData("close");
    const inc_group = [];
    const excl_group = [];
    let aidx = -1;
    if (after) {
      aidx = autoclose_list.indexOf(this);
    }
    autoclose_list.forEach((x, idx) => {
      const group = x.getData("close");
      if (group == cgroup && idx > aidx) {
        inc_group.push(x);
      } else {
        excl_group.push(x);
      }
    });
    const list = inc_group.reverse();
    autoclose_list = excl_group;
    if (autoclose_list.length == 0) {
      document.removeEventListener("pointerdown", this._dismiss);
    }
    list.forEach((x) => x.close());
  }
  /**
   * 
   */
  _showModalMask() {
    if (!modal_mask) {
      modal_mask = new Component({
        cls: "x4modal-mask",
        domEvents: {
          click: this._dismiss
        }
      });
    }
    modal_mask.show(true);
    document.body.insertAdjacentElement("beforeend", modal_mask.dom);
  }
  /**
   * 
   */
  _updateModalMask() {
    if (--modal_count == 0) {
      modal_mask.show(false);
    } else {
      this.dom.insertAdjacentElement("beforebegin", modal_mask.dom);
    }
  }
  /**
   * 
   */
  _createSizers() {
    this.appendContent([
      new CSizer("top"),
      new CSizer("bottom"),
      new CSizer("left"),
      new CSizer("right"),
      new CSizer("top-left"),
      new CSizer("bottom-left"),
      new CSizer("top-right"),
      new CSizer("bottom-right")
    ]);
  }
};
__name(_Popup, "Popup");
var Popup = _Popup;
var _CMover = class _CMover {
  constructor(x, ref) {
    this.self = ref ? true : false;
    x.addDOMEvent("pointerdown", (e) => {
      if (this.self && e.target != x.dom) {
        return;
      }
      x.setCapture(e.pointerId);
      this.ref = ref != null ? ref : componentFromDOM(x.dom.parentElement);
      this.delta = { x: 0, y: 0 };
      const rc = this.ref.getBoundingRect();
      this.delta.x = e.pageX - rc.left;
      this.delta.y = e.pageY - rc.top;
    });
    x.addDOMEvent("pointerup", (e) => {
      x.releaseCapture(e.pointerId);
      this.ref = null;
    });
    x.addDOMEvent("pointermove", (e) => {
      this._onMouseMove(e);
    });
  }
  _onMouseMove(e) {
    if (!this.ref) {
      return;
    }
    const pt = { x: e.pageX - this.delta.x, y: e.pageY - this.delta.y };
    const rc = this.ref.getBoundingRect();
    let nr = {};
    this.ref.setStyle({
      top: pt.y + "",
      left: pt.x + ""
    });
    e.preventDefault();
    e.stopPropagation();
  }
};
__name(_CMover, "CMover");
var CMover = _CMover;

// src/components/menu/menu.ts
var OPEN_DELAY = 400;
var _CMenuSep = class _CMenuSep extends Component {
  constructor() {
    super({});
  }
};
__name(_CMenuSep, "CMenuSep");
var CMenuSep = _CMenuSep;
var openTimer = new Timer();
var _CMenuItem = class _CMenuItem extends Component {
  constructor(itm) {
    super({ disabled: itm.disabled, cls: itm.cls });
    if (itm.menu) {
      this.addClass("popup");
    }
    this.setContent([
      new Icon({ id: "icon", iconId: itm.icon }),
      new Component({ id: "text", content: itm.text })
    ]);
    if (itm.menu) {
      this.menu = itm.menu;
      this.addDOMEvent("mouseenter", () => this.openSub(true));
      this.addDOMEvent("click", () => this.openSub(false));
      this.addDOMEvent("mouseleave", () => this.closeSub());
      this.menu.on("opened", () => this.addClass("opened"));
      this.menu.on("closed", () => this.removeClass("opened"));
    } else {
      this.addDOMEvent("mouseenter", () => {
        openTimer.setTimeout("open", OPEN_DELAY, () => {
          this.dismiss(true);
        });
      });
      this.addDOMEvent("click", () => {
        this.dismiss(false);
        if (itm.click) {
          itm.click(new Event("click"));
        }
      });
    }
  }
  /**
   * 
   */
  dismiss(after) {
    const menu = this.parentElement(Menu);
    if (menu) {
      menu.dismiss(after);
    }
  }
  /**
   * 
   */
  openSub(delayed) {
    const open = /* @__PURE__ */ __name(() => {
      this.dismiss(true);
      const rc = this.getBoundingRect();
      this.menu.displayAt(rc.right - 4, rc.top);
    }, "open");
    if (delayed) {
      openTimer.setTimeout("open", OPEN_DELAY, open);
    } else {
      openTimer.clearTimeout("open");
      open();
    }
  }
  closeSub() {
    openTimer.clearTimeout("open");
  }
};
__name(_CMenuItem, "CMenuItem");
var CMenuItem = _CMenuItem;
var _Menu = class _Menu extends Popup {
  constructor(props) {
    var _a;
    super({ ...props, autoClose: "menu", modal: false });
    this.addClass("x4vbox");
    const children = (_a = props.items) == null ? void 0 : _a.map((itm) => {
      if (itm === "-") {
        return new CMenuSep();
      } else if (isString(itm)) {
        return new CMenuItem({ text: itm, click: null, cls: "title" });
      } else if (itm instanceof Component) {
        return itm;
      } else {
        return new CMenuItem(itm);
      }
    });
    this.setContent(children);
  }
};
__name(_Menu, "Menu");
var Menu = _Menu;

// src/components/calendar/chevron-left-sharp-light.svg
var chevron_left_sharp_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M9.4 256l11.3-11.3 192-192L224 41.4 246.6 64 235.3 75.3 54.6 256 235.3 436.7 246.6 448 224 470.6l-11.3-11.3-192-192L9.4 256z"/></svg>';

// src/components/calendar/calendar-check-sharp-light.svg
var calendar_check_sharp_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M128 16l0-16L96 0l0 16 0 48L32 64 0 64 0 96l0 64 0 32L0 480l0 32 32 0 384 0 32 0 0-32 0-288 0-32 0-64 0-32-32 0-64 0 0-48 0-16L320 0l0 16 0 48L128 64l0-48zM32 192l384 0 0 288L32 480l0-288zm0-96l384 0 0 64L32 160l0-64zM331.3 283.3L342.6 272 320 249.4l-11.3 11.3L208 361.4l-52.7-52.7L144 297.4 121.4 320l11.3 11.3 64 64L208 406.6l11.3-11.3 112-112z"/></svg>';

// src/components/calendar/chevron-right-sharp-light.svg
var chevron_right_sharp_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M310.6 256l-11.3 11.3-192 192L96 470.6 73.4 448l11.3-11.3L265.4 256 84.7 75.3 73.4 64 96 41.4l11.3 11.3 192 192L310.6 256z"/></svg>';

// src/components/calendar/calendar.ts
var _Calendar = class _Calendar extends VBox {
  constructor(props) {
    super(props);
    this.mapPropEvents(props, "change");
    this.m_date = props.date ? date_clone(props.date) : /* @__PURE__ */ new Date();
    this._update();
  }
  /** @ignore */
  _update() {
    let month_start = date_clone(this.m_date);
    month_start.setDate(1);
    let day = month_start.getDay();
    if (day == 0) {
      day = 7;
    }
    month_start.setDate(-day + 1 + 1);
    let dte = date_clone(month_start);
    let selection = date_hash(this.m_date);
    let today = date_hash(/* @__PURE__ */ new Date());
    let month_end = date_clone(this.m_date);
    month_end.setDate(1);
    month_end.setMonth(month_end.getMonth() + 1);
    month_end.setDate(0);
    let end_of_month = date_hash(month_end);
    let rows = [];
    let header = new HBox({
      cls: "month-sel",
      content: [
        new Label({
          cls: "month",
          text: formatIntlDate(this.m_date, "O"),
          dom_events: {
            click: /* @__PURE__ */ __name(() => this._choose("month"), "click")
          }
        }),
        new Label({
          cls: "year",
          text: formatIntlDate(this.m_date, "Y"),
          dom_events: {
            click: /* @__PURE__ */ __name(() => this._choose("year"), "click")
          }
        }),
        new Flex(),
        new Button({ icon: chevron_left_sharp_light_default, click: /* @__PURE__ */ __name(() => this._next(false), "click") }),
        new Button({ icon: calendar_check_sharp_light_default, click: /* @__PURE__ */ __name(() => this.setDate(/* @__PURE__ */ new Date()), "click"), tooltip: _tr.global.today }),
        new Button({ icon: chevron_right_sharp_light_default, click: /* @__PURE__ */ __name(() => this._next(true), "click") })
      ]
    });
    rows.push(header);
    let day_names = [];
    day_names.push(new HBox({
      cls: "weeknum cell"
    }));
    for (let d = 0; d < 7; d++) {
      day_names.push(new Label({
        cls: "cell",
        text: _tr.global.day_short[(d + 1) % 7]
      }));
    }
    rows.push(new HBox({
      cls: "week header",
      content: day_names
    }));
    let cmonth = this.m_date.getMonth();
    let first = true;
    while (date_hash(dte) <= end_of_month) {
      let days = [
        new HBox({ cls: "weeknum cell", content: new Component({ tag: "span", content: formatIntlDate(dte, "w") }) })
      ];
      for (let d = 0; d < 7; d++) {
        let cls = "cell day";
        if (date_hash(dte) == selection) {
          cls += " selection";
        }
        if (date_hash(dte) == today) {
          cls += " today";
        }
        if (dte.getMonth() != cmonth) {
          cls += " out";
        }
        const mkItem = /* @__PURE__ */ __name((dte2) => {
          return new HBox({
            cls,
            flex: 1,
            content: new Component({
              cls: "text",
              content: unsafeHtml(`<span>${formatIntlDate(dte2, "d")}</span>`)
            }),
            dom_events: {
              click: /* @__PURE__ */ __name(() => this.select(dte2), "click")
            }
          });
        }, "mkItem");
        days.push(mkItem(date_clone(dte)));
        dte.setDate(dte.getDate() + 1);
        first = false;
      }
      rows.push(new HBox({
        cls: "week",
        flex: 1,
        content: days
      }));
    }
    this.setContent(rows);
  }
  /**
   * select the given date
   * @param date 
   */
  select(date) {
    this.m_date = date;
    this.fire("change", { value: date });
    this._update();
  }
  /**
   * 
   */
  _next(n) {
    this.m_date.setMonth(this.m_date.getMonth() + (n ? 1 : -1));
    this._update();
  }
  /**
   * 
   */
  _choose(type) {
    var _a, _b, _c, _d;
    let items = [];
    if (type == "month") {
      for (let m = 0; m < 12; m++) {
        items.push({
          text: _tr.global.month_long[m],
          click: /* @__PURE__ */ __name(() => {
            this.m_date.setMonth(m);
            this._update();
          }, "click")
        });
      }
    } else if (type == "year") {
      let min = (_b = (_a = this.props.minDate) == null ? void 0 : _a.getFullYear()) != null ? _b : 1900;
      let max = (_d = (_c = this.props.maxDate) == null ? void 0 : _c.getFullYear()) != null ? _d : 2037;
      for (let m = max; m >= min; m--) {
        items.push({
          text: "" + m,
          click: /* @__PURE__ */ __name(() => {
            this.m_date.setFullYear(m);
            this._update();
          }, "click")
        });
      }
    }
    let menu = new Menu({
      items
    });
    let rc = this.getBoundingRect();
    menu.displayAt(rc.left, rc.top);
  }
  getDate() {
    return this.m_date;
  }
  setDate(date) {
    this.m_date = date;
    this._update();
  }
};
__name(_Calendar, "Calendar");
var Calendar = _Calendar;

// src/components/input/input.ts
var _Input = class _Input extends Component {
  constructor(props) {
    var _a;
    super({ tag: "input", ...props });
    this.setAttribute("type", (_a = props.type) != null ? _a : "text");
    this.setAttribute("name", props.name);
    switch (props.type) {
      case "checkbox":
      case "radio": {
        const ck = this.dom;
        ck.checked = props.checked;
        ck.value = props.value + "";
        break;
      }
      case "range": {
        this.setAttribute("min", props.min);
        this.setAttribute("max", props.max);
        this.setAttribute("step", props.step);
        this.setAttribute("value", props.value);
        break;
      }
      case "number": {
        this.setAttribute("required", props.required);
        this.setAttribute("readonly", props.readonly);
        this.setAttribute("min", props.min);
        this.setAttribute("max", props.max);
        this.setAttribute("step", props.step);
        this.setAttribute("value", props.value + "");
        break;
      }
      case "date": {
        this.setAttribute("required", props.required);
        let v = props.value;
        if (v instanceof Date) {
        } else {
          this.setAttribute("value", v);
        }
        break;
      }
      case "file": {
        let v;
        if (Array.isArray(props.accept)) {
          v = props.accept.join(",");
        } else {
          v = props.accept;
        }
        this.setAttribute("accept", v);
        break;
      }
      default: {
        this.setAttribute("required", props.required);
        this.setAttribute("readonly", props.readonly);
        if (props.value !== null && props.value !== void 0) {
          this.setAttribute("value", props.value);
        }
        if (props.pattern !== null && props.pattern !== void 0) {
          this.setAttribute("pattern", props.pattern);
        }
        if (props.placeholder !== null && props.placeholder !== void 0) {
          this.setAttribute("placeholder", props.placeholder);
        }
        if (props.spellcheck === false) {
          this.setAttribute("spellcheck", false);
        }
        break;
      }
    }
  }
  /**
   * @returns 
   */
  getValue() {
    return this.dom.value;
  }
  /**
   * 
   * @param value 
   */
  setValue(value) {
    this.dom.value = value + "";
  }
  /**
   * 
   * @returns 
   */
  getNumValue() {
    return parseFloat(this.getValue());
  }
  /**
   * 
   * @param value 
   */
  setNumValue(value) {
    this.setValue(value + "");
  }
  /**
   * 
   */
  setReadOnly(ro) {
    const d = this.dom;
    d.readOnly = ro;
  }
  /**
   * select all the text
   */
  selectAll() {
    const d = this.dom;
    d.select();
  }
  /**
   * select a part of the text
   * @param start 
   * @param length 
   */
  select(start, length = 9999) {
    const d = this.dom;
    d.setSelectionRange(start, start + length);
  }
  /**
   * get the selection as { start, length }
   */
  getSelection() {
    const d = this.dom;
    return {
      start: d.selectionStart,
      length: d.selectionEnd - d.selectionStart
    };
  }
  /**
   * 
   */
  queryInterface(name) {
    if (name == "form-element") {
      const i = {
        getRawValue: /* @__PURE__ */ __name(() => {
          return this.getValue();
        }, "getRawValue"),
        setRawValue: /* @__PURE__ */ __name((v) => {
          this.setValue(v);
        }, "setRawValue")
      };
      return i;
    }
    return super.queryInterface(name);
  }
};
__name(_Input, "Input");
var Input = _Input;

// src/components/checkbox/check.svg
var check_default = 'data:image/svg+xml,<svg viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">%0A%09<path d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">%0A%09</path>%0A</svg>';

// src/components/checkbox/checkbox.ts
var _Checkbox = class _Checkbox extends Component {
  /**
      * Creates an instance of the Checkbox component.
      * 
      * @param {CheckboxProps} props - The properties for the checkbox component, including label, checked state, and value.
      * @example
      * const checkbox = new Checkbox({ label: 'Accept Terms', checked: true });
      */
  constructor(props) {
    super(props);
    const inputId = makeUniqueComponentId();
    this.mapPropEvents(props, "change");
    this.setContent([
      new Component({
        cls: "inner",
        content: [
          this._input = new Input({
            type: "checkbox",
            id: inputId,
            checked: props.checked,
            dom_events: {
              change: /* @__PURE__ */ __name(() => this._on_change(), "change")
            }
          })
        ]
      }),
      new Label({
        tag: "label",
        text: props.label,
        labelFor: inputId,
        id: void 0
      })
    ]);
    svgLoader.load(check_default).then((svg) => {
      this.query(".inner").dom.insertAdjacentHTML("beforeend", svg);
    });
  }
  /**
   * check state changed
   */
  _on_change() {
    this.fire("change", { value: this.getCheck() });
  }
  /**
   * @return the checked value
   */
  getCheck() {
    const d = this._input.dom;
    return d.checked;
  }
  /**
   * change the checked value
   * @param {boolean} ck new checked value	
   */
  setCheck(ck) {
    const d = this._input.dom;
    d.checked = ck;
  }
  /**
   * change the checkbox label
   * @param text 
   */
  setLabel(text) {
    this.query("label").setText(text);
  }
  /**
   * toggle the checkbox
   */
  toggle() {
    this.setCheck(!this.getCheck());
  }
};
__name(_Checkbox, "Checkbox");
var Checkbox = _Checkbox;

// src/components/colorinput/crosshairs-simple-sharp-light.svg
var crosshairs_simple_sharp_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M479.4 240L384 240l-16 0 0 32 16 0 95.4 0C471.6 383 383 471.6 272 479.4l0-95.4 0-16-32 0 0 16 0 95.4C129 471.6 40.4 383 32.6 272l95.4 0 16 0 0-32-16 0-95.4 0C40.4 129 129 40.4 240 32.6l0 95.4 0 16 32 0 0-16 0-95.4C383 40.4 471.6 129 479.4 240zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/></svg>';

// src/components/colorinput/colorinput.ts
var _ColorInput = class _ColorInput extends HBox {
  constructor(props) {
    super(props);
    let swatch;
    let edit;
    this.setContent([
      swatch = new Component({ cls: "swatch" }),
      edit = new Input({ type: "text", value: "", spellcheck: false }),
      isFeatureAvailable("eyedropper") ? new Button({ icon: crosshairs_simple_sharp_light_default, click: /* @__PURE__ */ __name(() => {
        const eyeDropper = new window.EyeDropper();
        eyeDropper.open().then((result) => {
          color = new Color(result.sRGBHex);
          updateColor(color);
        });
      }, "click") }) : null
    ]);
    edit.addDOMEvent("input", () => {
      const txt = edit.getValue();
      const clr = new Color(txt);
      if (!clr.isInvalid()) {
        color = clr;
        updateColor(color);
      }
    });
    const updateColor = /* @__PURE__ */ __name((clr) => {
      swatch.setStyleValue("backgroundColor", clr.toRgbString(false));
      edit.setValue(clr.toRgbString(false));
    }, "updateColor");
    let color;
    if (props.color instanceof Color) {
      color = props.color;
    } else {
      color = new Color(props.color);
    }
    updateColor(color);
  }
};
__name(_ColorInput, "ColorInput");
var ColorInput = _ColorInput;

// src/components/colorpicker/colorpicker.ts
var _Saturation = class _Saturation extends Box {
  constructor(props, init) {
    super(props);
    this.mdown = false;
    this.hsv = { hue: 1, saturation: 1, value: 1, alpha: 1 };
    this.setContent([
      this.color = new Component({ cls: "overlay" }),
      new Component({ cls: "overlay", style: { backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255), transparent)" } }),
      new Component({ cls: "overlay", style: { backgroundImage: "linear-gradient(0deg, rgb(0, 0, 0), transparent)" } }),
      this.thumb = new Component({ cls: "thumb" })
    ]);
    this.setDOMEvents({
      pointerdown: /* @__PURE__ */ __name((e) => this.mousedown(e), "pointerdown"),
      pointermove: /* @__PURE__ */ __name((e) => this.mousemove(e), "pointermove"),
      pointerup: /* @__PURE__ */ __name((e) => this.mouseup(e), "pointerup"),
      created: /* @__PURE__ */ __name(() => this.updateThumbMarker(), "created")
    });
    this.updateBaseColor(init);
  }
  mousedown(ev) {
    this.mdown = true;
    this.irect = this.getBoundingRect();
    this.setCapture(ev.pointerId);
  }
  mousemove(ev) {
    if (this.mdown) {
      const ir = this.irect;
      let hpos = clamp(ev.clientX - ir.left, 0, ir.width);
      let hperc = hpos / ir.width;
      let vpos = clamp(ev.clientY - ir.top, 0, ir.height);
      let vperc = vpos / ir.height;
      this.hsv.saturation = hperc;
      this.hsv.value = 1 - vperc;
      this.updateThumbMarker();
      this.fire("sat_change", { saturation: this.hsv.saturation, value: this.hsv.value });
    }
  }
  mouseup(ev) {
    if (this.mdown) {
      this.releaseCapture(ev.pointerId);
      this.mdown = false;
    }
  }
  updateThumbMarker() {
    const rc = this.color.getBoundingRect();
    this.thumb.setStyle({
      left: this.hsv.saturation * rc.width + "px",
      bottom: this.hsv.value * rc.height + "px"
    });
  }
  updateBaseColor(hsv) {
    const base = new Color(0, 0, 0);
    base.setHsv(hsv.hue, 1, 1, 1);
    this.color.setStyleValue("backgroundColor", base.toRgbString(false));
  }
  move(sens, delta) {
    switch (sens) {
      case "saturation": {
        this.hsv.saturation += delta;
        if (this.hsv.saturation < 0) {
          this.hsv.saturation = 0;
        } else if (this.hsv.saturation > 1) {
          this.hsv.saturation = 1;
        }
        this.fire("sat_change", { saturation: this.hsv.saturation, value: this.hsv.value });
        this.updateThumbMarker();
        break;
      }
      case "value": {
        this.hsv.value += delta;
        if (this.hsv.value < 0) {
          this.hsv.value = 0;
        } else if (this.hsv.value > 1) {
          this.hsv.value = 1;
        }
        this.fire("sat_change", { saturation: this.hsv.saturation, value: this.hsv.value });
        this.updateThumbMarker();
        break;
      }
    }
  }
};
__name(_Saturation, "Saturation");
var Saturation = _Saturation;
var _HueSlider = class _HueSlider extends Box {
  constructor(props, init) {
    super(props);
    this.hsv = { hue: 1, saturation: 1, value: 1, alpha: 1 };
    this.mdown = false;
    this.setContent([
      this.thumb = new Component({ cls: "thumb", left: "50%" })
    ]);
    this.setDOMEvents({
      pointerdown: /* @__PURE__ */ __name((e) => this.mousedown(e), "pointerdown"),
      pointermove: /* @__PURE__ */ __name((e) => this.mousemove(e), "pointermove"),
      pointerup: /* @__PURE__ */ __name((e) => this.mouseup(e), "pointerup")
    });
    this.updateHue(init);
  }
  mousedown(ev) {
    this.mdown = true;
    this.irect = this.getBoundingRect();
    this.setCapture(ev.pointerId);
  }
  mousemove(ev) {
    if (this.mdown) {
      const ir = this.irect;
      let hpos = clamp(ev.clientX - ir.left, 0, ir.width);
      let hperc = hpos / ir.width;
      this.hsv.hue = hperc;
      this.updateHue(this.hsv);
      this.fire("hue_change", { hue: this.hsv.hue });
    }
  }
  mouseup(ev) {
    if (this.mdown) {
      this.releaseCapture(ev.pointerId);
      this.mdown = false;
    }
  }
  updateHue(hsv) {
    this.hsv.hue = hsv.hue;
    this.thumb.setStyleValue("left", hsv.hue * 100 + "%");
  }
  move(delta) {
    this.hsv.hue += delta;
    if (this.hsv.hue < 0) {
      this.hsv.hue = 0;
    } else if (this.hsv.hue > 1) {
      this.hsv.hue = 1;
    }
    this.fire("hue_change", { hue: this.hsv.hue });
    this.updateHue(this.hsv);
  }
};
__name(_HueSlider, "HueSlider");
var HueSlider = _HueSlider;
var _AlphaSlider = class _AlphaSlider extends Box {
  constructor(props, init) {
    super(props);
    this.hsv = { hue: 1, saturation: 1, value: 1, alpha: 1 };
    this.mdown = false;
    this.setContent([
      new Component({ cls: "overlay checkers" }),
      this.color = new Component({ cls: "overlay color" }),
      this.thumb = new Component({ cls: "thumb", left: "50%" })
    ]);
    this.setDOMEvents({
      pointerdown: /* @__PURE__ */ __name((e) => this._on_mousedown(e), "pointerdown"),
      pointermove: /* @__PURE__ */ __name((e) => this._on_mousemove(e), "pointermove"),
      pointerup: /* @__PURE__ */ __name((e) => this._on_mouseup(e), "pointerup")
    });
    this.updateAlpha();
    this.updateBaseColor(init);
  }
  _on_mousedown(ev) {
    this.mdown = true;
    this.irect = this.getBoundingRect();
    this.setCapture(ev.pointerId);
  }
  _on_mousemove(ev) {
    if (this.mdown) {
      const ir = this.irect;
      let hpos = clamp(ev.clientX - ir.left, 0, ir.width);
      let hperc = hpos / ir.width;
      this.hsv.alpha = hperc;
      this.updateAlpha();
      this.fire("alpha_change", { alpha: this.hsv.alpha });
    }
  }
  _on_mouseup(ev) {
    if (this.mdown) {
      this.releaseCapture(ev.pointerId);
      this.mdown = false;
    }
  }
  updateAlpha() {
    this.thumb.setStyleValue("left", this.hsv.alpha * 100 + "%");
  }
  updateBaseColor(hsv) {
    const base = new Color(0, 0, 0);
    base.setHsv(hsv.hue, hsv.saturation, hsv.value, 1);
    this.color.setStyleValue("backgroundImage", `linear-gradient(90deg, transparent, ${base.toRgbString(false)})`);
  }
  setColor(hsv) {
    this.hsv = hsv;
    this.updateBaseColor(hsv);
    this.updateAlpha();
  }
  move(delta) {
    this.hsv.alpha += delta;
    if (this.hsv.alpha < 0) {
      this.hsv.alpha = 0;
    } else if (this.hsv.alpha > 1) {
      this.hsv.alpha = 1;
    }
    this.fire("alpha_change", { alpha: this.hsv.alpha });
    this.updateAlpha();
  }
};
__name(_AlphaSlider, "AlphaSlider");
var AlphaSlider = _AlphaSlider;
var _ColorPicker = class _ColorPicker extends VBox {
  constructor(props) {
    super(props);
    if (props.color instanceof Color) {
      this._base = props.color;
    } else {
      this._base = new Color(props.color);
    }
    let hsv = this._base.toHsv();
    this.setAttribute("tabindex", 0);
    this.setContent([
      this._sat = new Saturation({}, hsv),
      new HBox({
        cls: "body",
        content: [
          new VBox({ cls: "x4flex", content: [
            this._hue = new HueSlider({}, hsv),
            this._alpha = new AlphaSlider({}, hsv)
          ] }),
          new Box({ cls: "swatch", content: [
            new Component({ cls: "overlay checkers" }),
            this._swatch = new Component({ cls: "overlay" })
          ] })
        ]
      })
    ]);
    this._sat.on("sat_change", (ev) => {
      hsv.saturation = ev.saturation;
      hsv.value = ev.value;
      updateColor();
      this._alpha.updateBaseColor(hsv);
    });
    this._hue.on("hue_change", (ev) => {
      hsv.hue = ev.hue;
      this._sat.updateBaseColor(hsv);
      this._alpha.updateBaseColor(hsv);
      updateColor();
    });
    this._alpha.on("alpha_change", (ev) => {
      hsv.alpha = ev.alpha;
      updateColor();
    });
    const updateColor = /* @__PURE__ */ __name(() => {
      this._base.setHsv(hsv.hue, hsv.saturation, hsv.value, hsv.alpha);
      this._swatch.setStyleValue("backgroundColor", this._base.toRgbString());
      this._swatch.setAttribute("tooltip", this._base.toRgbString());
      this.fire("change", { color: this._base });
    }, "updateColor");
    if (isFeatureAvailable("eyedropper")) {
      this._swatch.addDOMEvent("click", (e) => {
        const eyeDropper = new window.EyeDropper();
        eyeDropper.open().then((result) => {
          const color = new Color(result.sRGBHex);
          hsv = color.toHsv();
          this._alpha.setColor(hsv);
          this._sat.updateBaseColor(hsv);
          this._hue.updateHue(hsv);
          updateColor();
        });
      });
    }
    this.addDOMEvent("keydown", (ev) => this._onkey(ev));
    updateColor();
  }
  _onkey(ev) {
    switch (ev.key) {
      case "ArrowLeft": {
        if (ev.ctrlKey) {
          this._hue.move(-0.01);
        } else {
          this._sat.move("saturation", -0.01);
        }
        break;
      }
      case "ArrowRight": {
        if (ev.ctrlKey) {
          this._hue.move(0.01);
        } else {
          this._sat.move("saturation", 0.01);
        }
        break;
      }
      case "ArrowUp": {
        if (ev.ctrlKey) {
          this._alpha.move(0.01);
        } else {
          this._sat.move("value", 0.01);
        }
        break;
      }
      case "ArrowDown": {
        if (ev.ctrlKey) {
          this._alpha.move(-0.01);
        } else {
          this._sat.move("value", -0.01);
        }
        break;
      }
    }
  }
};
__name(_ColorPicker, "ColorPicker");
var ColorPicker = _ColorPicker;

// src/components/viewport/viewport.ts
var _Viewport = class _Viewport extends Component {
  constructor(props) {
    super(props);
  }
};
__name(_Viewport, "Viewport");
var Viewport = _Viewport;
var _ScrollView = class _ScrollView extends Component {
  constructor(props) {
    super(props);
    this.setContent(new Viewport({}));
  }
  getViewport() {
    return this.firstChild();
  }
};
__name(_ScrollView, "ScrollView");
var ScrollView = _ScrollView;

// src/components/listbox/listbox.ts
var kbNav = /* @__PURE__ */ ((kbNav2) => {
  kbNav2[kbNav2["first"] = 0] = "first";
  kbNav2[kbNav2["prev"] = 1] = "prev";
  kbNav2[kbNav2["next"] = 2] = "next";
  kbNav2[kbNav2["last"] = 3] = "last";
  return kbNav2;
})(kbNav || {});
var _Listbox = class _Listbox extends Component {
  constructor(props) {
    super({ ...props });
    this.preventFocus = false;
    this.setAttribute("tabindex", 0);
    const scroller = new ScrollView({ cls: "body" });
    this._view = scroller.getViewport();
    this.setContent([
      //props.header ? props.header : null,
      scroller
    ]);
    this.setDOMEvents({
      click: /* @__PURE__ */ __name((ev) => this._on_click(ev), "click"),
      keydown: /* @__PURE__ */ __name((ev) => this._on_key(ev), "keydown"),
      dblclick: /* @__PURE__ */ __name((e) => this._on_click(e), "dblclick"),
      contextmenu: /* @__PURE__ */ __name((e) => this._on_ctx_menu(e), "contextmenu")
    });
    if (props.items) {
      this.setItems(props.items);
    }
  }
  /**
   * 
   */
  _on_key(ev) {
    if (this.isDisabled()) {
      return;
    }
    switch (ev.key) {
      case "ArrowDown": {
        this.navigate(2 /* next */);
        break;
      }
      case "ArrowUp": {
        this.navigate(1 /* prev */);
        break;
      }
      case "Home": {
        this.navigate(0 /* first */);
        break;
      }
      case "End": {
        this.navigate(3 /* last */);
        break;
      }
      default:
        return;
    }
    ev.preventDefault();
    ev.stopPropagation();
  }
  /**
   * 
   */
  navigate(sens) {
    if (!this._selitem) {
      if (sens == 2 /* next */) sens = 0 /* first */;
      else sens = 3 /* last */;
    }
    const next_visible = /* @__PURE__ */ __name((el, down) => {
      while (el && !el.isVisible()) {
        el = down ? el.nextElement() : el.prevElement();
      }
      return el;
    }, "next_visible");
    if (sens == 0 /* first */ || sens == 3 /* last */) {
      let fel = sens == 0 /* first */ ? this._view.firstChild() : this._view.lastChild();
      fel = next_visible(fel, sens == 0 /* first */);
      if (fel) {
        const id = fel.getData("id");
        this._selectItem(id, fel);
        return true;
      }
    } else {
      let nel = sens == 2 /* next */ ? this._selitem.nextElement() : this._selitem.prevElement();
      nel = next_visible(nel, sens == 2 /* next */);
      if (nel) {
        const id = nel.getData("id");
        this._selectItem(id, nel);
        return true;
      }
    }
    return false;
  }
  /**
   * 
   */
  _on_click(ev) {
    ev.stopImmediatePropagation();
    ev.preventDefault();
    let target = ev.target;
    while (target && target != this.dom) {
      const c = componentFromDOM(target);
      if (c && c.hasClass("x4item")) {
        const id = c.getData("id");
        const fev = { context: id };
        if (ev.type == "click") {
          this.fire("click", fev);
        } else {
          this.fire("dblClick", fev);
        }
        if (!fev.defaultPrevented) {
          this._selectItem(id, c);
        }
        return;
      }
      target = target.parentElement;
    }
    this.clearSelection();
  }
  /**
   * 
   */
  _on_ctx_menu(ev) {
    ev.preventDefault();
    let target = ev.target;
    while (target && target != this.dom) {
      const c = componentFromDOM(target);
      if (c && c.hasClass("x4item")) {
        const id = c.getData("id");
        this._selectItem(id, c);
        this.fire("contextMenu", { uievent: ev, context: id });
        return;
      }
      target = target.parentElement;
    }
    this.fire("contextMenu", { uievent: ev, context: null });
  }
  /**
   * 
   */
  _selectItem(id, item) {
    if (this._selitem) {
      this._selitem.removeClass("selected");
      this._selitem = void 0;
    }
    this._selitem = item;
    this._selection = id;
    if (item) {
      item.addClass("selected");
      item.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
    const itm = this._findItem(id);
    this.fire("selectionChange", { selection: itm });
  }
  /**
   * 
   */
  _findItem(id) {
    return this._items.find((x) => x.id == id);
  }
  /**
   * 
   */
  _findItemIndex(id) {
    return this._items.findIndex((x) => x.id == id);
  }
  /**
   * 
   */
  clearSelection() {
    if (this._selitem) {
      this._selitem.removeClass("selected");
      this._selitem = void 0;
    }
    this._selection = void 0;
    this.fire("selectionChange", { selection: void 0 });
  }
  /**
   * 
   */
  setItems(items) {
    this.clearSelection();
    this._view.clearContent();
    this._items = items;
    if (items) {
      const content = items.map((x) => this.renderItem(x));
      this._view.setContent(content);
    }
  }
  /**
   * 
   */
  renderItem(item) {
    var _a;
    const renderer = (_a = this.props.renderer) != null ? _a : this.defaultRenderer;
    const line = renderer(item);
    line.addClass("x4item");
    line.setData("id", item.id + "");
    return line;
  }
  /**
   * 
   */
  defaultRenderer(item) {
    return new HBox({
      cls: item.cls,
      content: new Label({ icon: item.iconId, text: item.text })
    });
  }
  /**
   * 
   */
  filter(filter) {
    const childs = this._view.enumChildComponents(false);
    if (!filter) {
      childs.forEach((x) => x.show(true));
    } else {
      const filtred = this._items.filter((x) => x.text.includes(filter)).map((x) => x.id + "");
      childs.forEach((x) => {
        x.show(filtred.includes(x.getData("id")));
      });
    }
  }
  /**
   * append or prepend a new item
   * @param item 
   * @param prepend 
   * @param select 
   */
  appendItem(item, prepend = false, select = true) {
    if (select) {
      this.clearSelection();
    }
    let el = this.renderItem(item);
    if (prepend) {
      this._items.unshift(item);
      this._view.prependContent(el);
    } else {
      this._items.push(item);
      this._view.appendContent(el);
    }
    if (select) {
      this._selectItem(item.id, el);
    }
  }
  /**
   * update an item
   */
  updateItem(id, item) {
    var _a;
    const idx = this._findItemIndex(id);
    if (idx < 0) {
      return;
    }
    let was_sel = false;
    if (this._selection && this._selection === id) {
      was_sel = true;
    }
    this._items[idx] = item;
    const oldDOM = (_a = this.query(`[data-id="${item.id}"]`)) == null ? void 0 : _a.dom;
    if (oldDOM) {
      const _new = this.renderItem(item);
      this._view.dom.replaceChild(_new.dom, oldDOM);
      if (was_sel) {
        this._selectItem(item.id, _new);
      }
    }
  }
};
__name(_Listbox, "Listbox");
var Listbox = _Listbox;

// src/components/combobox/updown.svg
var updown_default = 'data:image/svg+xml,<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">%0A%09<path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">%0A%09</path>%0A</svg>';

// src/components/combobox/combobox.ts
var _Dropdown = class _Dropdown extends Popup {
  constructor(props, content) {
    super(props);
    this._list = new Listbox({ items: props.items });
    this.setContent(this._list);
    this.addDOMEvent("mousedown", (ev) => {
      console.log("trap");
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      ev.preventDefault();
    }, true);
    this._list.on("selectionChange", (ev) => {
      this.fire("selectionChange", ev);
    });
  }
  getList() {
    return this._list;
  }
};
__name(_Dropdown, "Dropdown");
var Dropdown = _Dropdown;
var _Combobox = class _Combobox extends Component {
  constructor(props) {
    super(props);
    this._prevent_close = false;
    const id = makeUniqueComponentId();
    this.setContent([
      new HBox({ id: "label", content: new Label({ tag: "label", text: props.label, labelFor: id, width: props.labelWidth }) }),
      this._edit = new HBox({ id: "edit", content: [
        this._input = new Input({ type: "text", value: "", readonly: props.readonly }),
        this._button = new Button({ icon: updown_default })
      ] })
    ]);
    this._dropdown = new Dropdown({ items: props.items });
    this._dropdown.on("selectionChange", (ev) => {
      const sel = ev.selection;
      this._input.setValue(sel ? sel.text : "");
      if (!this._prevent_close) {
        this._dropdown.show(false);
      }
    });
    this._button.addDOMEvent("click", () => this._on_click());
    this._input.addDOMEvent("input", () => this._on_input());
    this._input.addDOMEvent("keydown", (ev) => this._on_key(ev));
    this.setDOMEvents({
      focusout: /* @__PURE__ */ __name(() => this._on_focusout(), "focusout"),
      click: /* @__PURE__ */ __name(() => this._on_click(), "click")
    });
  }
  _on_key(ev) {
    switch (ev.key) {
      case "Enter":
      case "Escape": {
        this._dropdown.show(false);
        break;
      }
      case "ArrowUp":
        this._prevent_close = true;
        if (!this._dropdown.isOpen()) {
          this.showDropDown();
        } else {
          this._dropdown.getList().navigate(1 /* prev */);
        }
        this._prevent_close = false;
        break;
      case "ArrowDown":
        this._prevent_close = true;
        if (!this._dropdown.isOpen()) {
          this.showDropDown();
        } else {
          this._dropdown.getList().navigate(2 /* next */);
        }
        this._prevent_close = false;
        break;
      default: {
        return;
      }
    }
    ev.preventDefault();
    ev.stopPropagation();
  }
  _on_input() {
    if (!this._dropdown.isOpen()) {
      this.showDropDown();
    }
    this._dropdown.getList().filter(this._input.getValue());
  }
  _on_focusout() {
    this._dropdown.show(false);
  }
  _on_click() {
    this.showDropDown();
  }
  showDropDown() {
    if (this.isDisabled()) {
      return;
    }
    const rc = this._edit.getBoundingRect();
    this._dropdown.setStyleValue("width", rc.width + "px");
    this._dropdown.displayNear(rc, "top left", "bottom left", { x: 0, y: 6 });
  }
};
__name(_Combobox, "Combobox");
var Combobox = _Combobox;

// src/components/dialog/xmark-sharp-light.svg
var xmark_sharp_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M192 233.4L59.5 100.9 36.9 123.5 169.4 256 36.9 388.5l22.6 22.6L192 278.6 324.5 411.1l22.6-22.6L214.6 256 347.1 123.5l-22.6-22.6L192 233.4z"/></svg>';

// src/components/dialog/dialog.ts
var _Dialog = class _Dialog extends Popup {
  constructor(props) {
    super(props);
    this.appendContent([
      new HBox({
        cls: "caption",
        content: [
          new Label({
            id: "title",
            cls: "caption-element",
            icon: props.icon,
            text: props.title
          }),
          props.closable ? new Button({
            id: "closebox",
            icon: xmark_sharp_light_default,
            click: /* @__PURE__ */ __name(() => {
              this.close();
            }, "click")
          }) : null
        ]
      }),
      props.form,
      new BtnGroup({
        id: "btnbar",
        reverse: true,
        items: props.buttons,
        btnclick: /* @__PURE__ */ __name((ev) => {
          this.fire("btnclick", ev);
        }, "btnclick")
      })
    ]);
  }
  display() {
    super.displayCenter();
  }
  close() {
    this.fire("close", {});
    super.close();
  }
};
__name(_Dialog, "Dialog");
var Dialog = _Dialog;

// src/components/form/form.ts
var _Form = class _Form extends Box {
  setValues(values) {
    const items = this.queryAll("input[name]");
    console.log(items);
  }
  getValues() {
    const result = {};
    return result;
  }
};
__name(_Form, "Form");
var Form = _Form;

// src/components/header/header.ts
var _Header = class _Header extends HBox {
  constructor(props) {
    var _a;
    super(props);
    this._els = (_a = props.items) == null ? void 0 : _a.map((x) => {
      const cell = new Label({ cls: "cell", text: x.title, icon: x.iconId });
      const sizer = new CSizer("right");
      if (x.width > 0) {
        cell.setStyleValue("width", x.width + "px");
        cell.setInternalData("width", x.width);
      } else if (x.width < 0) {
        cell.setInternalData("flex", -x.width);
      } else {
        cell.setInternalData("width", 0);
      }
      sizer.addDOMEvent("dblclick", (e) => {
        cell.setInternalData("flex", 1);
        this._calc_sizes();
      });
      sizer.on("resize", (ev) => {
        cell.setInternalData("flex", 0);
        cell.setInternalData("width", ev.size);
        this._calc_sizes();
      });
      cell.appendContent(sizer);
      cell.setInternalData("data", x);
      return cell;
    });
    this.addDOMEvent("resized", () => this._on_resize());
    this.addDOMEvent("created", () => this._calc_sizes());
    this._vwp = new HBox({ content: this._els });
    this.setContent(this._vwp);
  }
  _calc_sizes() {
    let count = 0;
    let filled = 0;
    this._els.forEach((c) => {
      const flex = c.getInternalData("flex");
      if (flex) {
        count += flex;
      } else {
        let width = c.getInternalData("width");
        if (width == 0) {
          const rc2 = c.getBoundingRect();
          width = Math.ceil(rc2.width) + 2;
          c.setInternalData("width", width);
        }
        filled += width;
      }
    });
    const rc = this.getBoundingRect();
    let rest = rc.width - filled;
    const unit = Math.ceil(rest / count);
    console.log("filled", filled);
    console.log("count", count);
    console.log("rest", rest);
    console.log("unit", unit);
    let fullw = 0;
    this._els.forEach((c) => {
      let width = 0;
      const flex = c.getInternalData("flex");
      if (flex) {
        width = Math.min(unit * flex, rest);
        rest -= width;
      } else {
        width = c.getInternalData("width");
      }
      c.setWidth(width);
      fullw += width;
    });
    this._vwp.setWidth(fullw);
  }
  _on_resize() {
    this._calc_sizes();
  }
};
__name(_Header, "Header");
var Header = _Header;

// src/components/image/image.ts
var _Image = class _Image extends Component {
  constructor(props) {
    var _a;
    super(props);
    this._img = new Component({
      tag: "img",
      attrs: {
        loading: props.lazy,
        alt: props.alt,
        draggable: (_a = props.draggable) != null ? _a : false
      },
      style: {
        width: "100%",
        height: "100%",
        objectFit: props.fit,
        objectPosition: props.position
      }
    });
    this.setContent(this._img);
    this.setImage(props.src);
  }
  /**
   * 
   */
  setImage(src) {
    this._img.setAttribute("src", src);
  }
};
__name(_Image, "Image");
var Image2 = _Image;

// src/components/messages/circle-exclamation.svg
var circle_exclamation_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>';

// src/components/messages/messages.ts
var _MessageBox = class _MessageBox extends Dialog {
  constructor(props) {
    super(props);
  }
  setText(txt) {
    this.m_label.setText(txt);
  }
  /**
   * display a messagebox
   */
  static show(msg) {
    const box = new _MessageBox({
      modal: true,
      title: _tr.global.error,
      movable: true,
      form: new Form({
        content: [
          new HBox({
            content: [
              new Icon({ iconId: circle_exclamation_default }),
              new Label({ text: msg })
            ]
          })
        ]
      }),
      buttons: ["ok", "cancel"]
    });
    box.on("btnclick", (ev) => {
      asap(() => box.close());
    });
    box.display();
    return box;
  }
};
__name(_MessageBox, "MessageBox");
var MessageBox = _MessageBox;

// src/components/notification/circle-check-solid.svg
var circle_check_solid_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>';

// src/components/notification/circle-exclamation-solid.svg
var circle_exclamation_solid_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>';

// src/components/notification/circle-notch-light.svg
var circle_notch_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Pro 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M207.4 20.4c2.4 8.5-2.6 17.3-11.2 19.7C101.5 66.2 32 153 32 256c0 123.7 100.3 224 224 224s224-100.3 224-224c0-103-69.5-189.8-164.3-215.9c-8.5-2.4-13.5-11.2-11.2-19.7s11.2-13.5 19.7-11.2C432.5 39.1 512 138.2 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 138.2 79.5 39.1 187.7 9.2c8.5-2.4 17.3 2.6 19.7 11.2z"/></svg>';

// src/components/notification/xmark-sharp-light.svg
var xmark_sharp_light_default2 = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M192 233.4L59.5 100.9 36.9 123.5 169.4 256 36.9 388.5l22.6 22.6L192 278.6 324.5 411.1l22.6-22.6L214.6 256 347.1 123.5l-22.6-22.6L192 233.4z"/></svg>';

// src/components/notification/notification.ts
var _Notification = class _Notification extends Popup {
  constructor(props) {
    super({});
    let icon = props.iconId;
    if (!icon) {
      if (props.loading) {
        icon = circle_notch_light_default;
        this.addClass("");
      } else if (props.mode == "danger") {
        icon = circle_exclamation_solid_default;
      } else {
        icon = circle_check_solid_default;
      }
    }
    this.addClass(props.mode);
    const _icon = new Icon({ iconId: icon });
    if (props.loading) {
      _icon.addClass("rotate");
      this.props.modal = true;
    }
    this.setContent(new HBox({
      content: [
        _icon,
        new VBox({ cls: "body", content: [
          new Label({ cls: "title", text: props.title }),
          new Label({ cls: "text", text: props.text })
        ] }),
        new Button({ cls: "outline", icon: xmark_sharp_light_default2, click: /* @__PURE__ */ __name(() => {
          this.close();
        }, "click") })
      ]
    }));
  }
  close() {
    this.clearTimeout("close");
    super.close();
  }
  display(time_in_s = 0) {
    const r = new Rect(0, 0, window.innerWidth, window.innerHeight);
    this.displayNear(r, "bottom right", "bottom right", { x: -20, y: -10 });
    if (time_in_s) {
      this.setTimeout("close", time_in_s * 1e3, () => {
        this.close();
      });
    }
  }
};
__name(_Notification, "Notification");
var Notification = _Notification;

// src/components/panel/panel.ts
var _Panel = class _Panel extends VBox {
  constructor(props) {
    var _a;
    super({ ...props, content: void 0 });
    const model = (_a = props.bodyModel) != null ? _a : VBox;
    super.setContent([
      this._title = new Label({ tag: "legend", text: props.title, icon: props.icon }),
      this._body = new model({ cls: "body", content: props.content })
    ]);
  }
  setContent(content) {
    this._body.setContent(content);
  }
  setTitle(title) {
    this._title.setContent(title);
  }
};
__name(_Panel, "Panel");
var Panel = _Panel;

// src/components/progress/progress.ts
var _Progress = class _Progress extends Component {
  constructor(props) {
    super(props);
    this.setContent(this._bar = new Component({ cls: "bar" }));
    this.setValue(props.value);
  }
  setValue(value) {
    const perc = value / (this.props.max - this.props.min) * 100;
    this._bar.setStyleValue("width", perc + "%");
  }
};
__name(_Progress, "Progress");
var Progress = _Progress;

// src/components/rating/star-sharp-solid.svg
var star_sharp_solid_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg>';

// src/components/rating/rating.ts
var _Rating = class _Rating extends HBox {
  constructor(props) {
    var _a;
    super(props);
    props.steps = (_a = props.steps) != null ? _a : 5;
    this._update();
  }
  _update() {
    var _a, _b;
    const props = this.props;
    let shape = (_a = props.icon) != null ? _a : star_sharp_solid_default;
    let value = (_b = props.value) != null ? _b : 0;
    this.m_input = new Input({
      type: "text",
      hidden: true,
      name: props.name,
      value: "" + value
    });
    this.addDOMEvent("click", (e) => this._on_click(e));
    this.m_els = [];
    for (let i = 0; i < props.steps; i++) {
      let cls = "item";
      if (i + 1 <= value) {
        cls += " checked";
      }
      let c = new Icon({
        cls,
        iconId: shape
      });
      c.setInternalData("value", i);
      this.m_els.push(c);
    }
    this.m_els.push(this.m_input);
    this.setContent(this.m_els);
  }
  getValue() {
    var _a;
    return (_a = this.props.value) != null ? _a : 0;
  }
  setValue(v) {
    this.props.value = v;
    for (let c = 0; c < this.props.steps; c++) {
      this.m_els[c].setClass("checked", this.m_els[c].getInternalData("value") <= v);
    }
    this.m_input.setValue("" + this.props.value);
  }
  setSteps(n) {
    this.props.steps = n;
    this._update();
  }
  setShape(icon) {
    this.removeClass(this.props.icon);
    this.props.icon = icon;
  }
  _on_click(ev) {
    let item = componentFromDOM(ev.target);
    item = item.parentElement(Icon);
    if (item) {
      this.setValue(item.getInternalData("value"));
    }
    this.fire("change", { value: this.props.value });
  }
};
__name(_Rating, "Rating");
var Rating = _Rating;

// src/components/slider/slider.ts
var _Slider = class _Slider extends Component {
  constructor(props) {
    super(props);
    this._mdown = false;
    this._irect = null;
    this._thumb = null;
    this._bar = null;
    this._range = null;
    this.setContent([
      new HBox({ cls: "track", content: [
        this._bar = new Component({ cls: "bar" }),
        this._thumb = new Component({ cls: "thumb" })
      ] }),
      this._range = new Input({ type: "range", hidden: true, value: props.value, min: props.min, max: props.max, step: props.step })
    ]);
    this.setAttribute("tabindex", 0);
    this.setDOMEvents({
      pointerdown: /* @__PURE__ */ __name((ev) => this._on_mousedown(ev), "pointerdown"),
      pointermove: /* @__PURE__ */ __name((ev) => this._on_mousemove(ev), "pointermove"),
      pointerup: /* @__PURE__ */ __name((ev) => this._on_mouseup(ev), "pointerup"),
      keydown: /* @__PURE__ */ __name((ev) => this._on_key(ev), "keydown")
    });
    this._range.addDOMEvent("change", (ev) => {
    });
  }
  _on_mousedown(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.focus();
    this._mdown = true;
    this._irect = this.getBoundingRect();
    this.setCapture(ev.pointerId);
  }
  _on_mousemove(ev) {
    if (this._mdown) {
      let pos = ev.pageX - this._irect.left;
      if (pos < 0) {
        pos = 0;
      } else if (pos > this._irect.width) {
        pos = this._irect.width;
      }
      let perc = pos / this._irect.width * 100;
      this._range.setNumValue(perc);
      this._update();
    }
  }
  _update() {
    const value = this._range.getNumValue();
    const perc = value / (this.props.max - this.props.min) * 100;
    this._thumb.setStyleValue("left", perc + "%");
    this._bar.setStyleValue("width", perc + "%");
    this.fire("change", { value });
  }
  _on_mouseup(ev) {
    if (this._mdown) {
      this.releaseCapture(ev.pointerId);
      this._mdown = false;
    }
  }
  _on_key(ev) {
    var _a;
    console.log(ev.key);
    let stp = (_a = this.props.step) != null ? _a : 1;
    let inc = 0;
    switch (ev.key) {
      case "ArrowRight":
      case "ArrowUp":
        inc = stp;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        inc = -stp;
        break;
    }
    if (inc) {
      if (ev.ctrlKey) {
        inc *= 10;
      }
      this._range.setNumValue(this._range.getNumValue() + inc);
      this._update();
    }
  }
};
__name(_Slider, "Slider");
var Slider = _Slider;

// src/components/switch/switch.ts
var _Switch = class _Switch extends HBox {
  constructor(props) {
    super(props);
    const inputId = makeUniqueComponentId();
    this.setContent([
      new Component({
        cls: "switch",
        content: [
          new Input({ type: "checkbox", id: inputId, checked: props.checked }),
          new Component({ cls: "track" }),
          new Component({ cls: "thumb" })
        ]
      }),
      new Label({
        tag: "label",
        text: props.label,
        labelFor: inputId
      })
    ]);
  }
};
__name(_Switch, "Switch");
var Switch = _Switch;

// src/components/tabs/tabs.ts
var _CTab = class _CTab extends Button {
  constructor(props, item) {
    super(props);
    this.addClass("outline");
    this.setIcon(item.icon);
    this.setText(item.title);
    this.setData("tabname", item.name);
  }
};
__name(_CTab, "CTab");
var CTab = _CTab;
var _CTabList = class _CTabList extends HBox {
  constructor(props, content) {
    super(props);
    const tabs = content.map((tab) => {
      return new CTab({
        click: /* @__PURE__ */ __name((ev) => this._on_click(ev), "click")
      }, tab);
    });
    this.mapPropEvents(props, "click");
    this.setContent(tabs);
  }
  _on_click(ev) {
    const name = ev.source.getData("tabname");
    this.fire("click", { name });
  }
  select(name) {
    const tab = this.query(`[data-tabname="${name}"]`);
    if (this._selitem) {
      this._selitem.setClass("selected", false);
    }
    this._selitem = tab;
    this._selection = name;
    if (this._selitem) {
      this._selitem.setClass("selected", true);
    }
  }
};
__name(_CTabList, "CTabList");
var CTabList = _CTabList;
var _Tabs = class _Tabs extends VBox {
  constructor(props) {
    var _a;
    super(props);
    const pages = (_a = props.items) == null ? void 0 : _a.map((x) => {
      return {
        name: x.name,
        content: x.tab
      };
    });
    this.setContent([
      this._list = new CTabList(
        {
          click: /* @__PURE__ */ __name((ev) => this._onclick(ev), "click")
        },
        props.items
      ),
      this._stack = new StackBox({
        cls: "body x4flex",
        default: props.default,
        items: pages
      })
    ]);
    if (props.default) {
      this.selectTab(props.default);
    }
  }
  selectTab(name) {
    this._list.select(name);
    this._stack.select(name);
  }
  _onclick(ev) {
    this.selectTab(ev.name);
  }
};
__name(_Tabs, "Tabs");
var Tabs = _Tabs;

// src/components/textarea/textarea.ts
var _TextArea = class _TextArea extends VBox {
  constructor(props) {
    super(props);
    this.setContent([
      new Label({ text: props.label }),
      this._input = new Component({ tag: "textarea" })
    ]);
    this._input.setAttribute("name", props.name);
    this._input.setAttribute("value", props.value + "");
    if (!props.resize) {
      this._input.setAttribute("resize", false);
    }
  }
};
__name(_TextArea, "TextArea");
var TextArea = _TextArea;

// src/components/textedit/textedit.ts
var _TextEdit = class _TextEdit extends HBox {
  constructor(props) {
    var _a, _b;
    super(props);
    if (!props.inputId) {
      props.inputId = makeUniqueComponentId();
    }
    if (props.required) {
      this.setAttribute("required", true);
    }
    const gadgets = (_a = props.inputGadgets) != null ? _a : [];
    this.setContent([
      new HBox({ id: "label", width: props.labelWidth, content: [
        new Label({ tag: "label", text: props.label, labelFor: props.inputId })
      ] }),
      new HBox({ id: "edit", content: [
        new Input({
          type: (_b = props.type) != null ? _b : "text",
          readonly: props.readonly,
          value: props.value,
          id: props.inputId,
          required: props.required,
          disabled: props.disabled,
          placeholder: props.placeholder
        }),
        ...gadgets
      ] })
    ]);
  }
};
__name(_TextEdit, "TextEdit");
var TextEdit = _TextEdit;

// src/components/tooltips/circle-info-sharp-light.svg
var circle_info_sharp_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"  fill="currentColor"> <!--!Font Awesome Pro 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M256 32a224 224 0 1 1 0 448 224 224 0 1 1 0-448zm0 480A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM192 352v32h16 96 16V352H304 272V240 224H256 216 200v32h16 24v96H208 192zm88-168V136H232v48h48z"/></svg>';

// src/components/tooltips/tooltips.ts
var last_hit = null;
var tooltip = null;
var timer = new Timer();
function initTooltips() {
  document.addEventListener("mouseenter", (ev) => {
    if (ev.target === document) {
      return;
    }
    const c = wrapDOM(ev.target);
    const tt = c.getAttribute("tooltip");
    if (tt) {
      last_hit = ev.target;
      const rc = c.getBoundingRect();
      showTT(tt, rc, { x: ev.pageX, y: ev.pageY });
    }
  }, true);
  document.addEventListener("mouseleave", (ev) => {
    if (last_hit && ev.target == last_hit) {
      last_hit = null;
      closeTT();
    }
  }, true);
}
__name(initTooltips, "initTooltips");
function showTT(text, rc, pt) {
  if (!tooltip) {
    tooltip = new Tooltip({});
  }
  timer.setTimeout(null, 300, () => {
    tooltip.setText(unsafeHtml(text));
    tooltip.displayAt(pt.x, pt.y);
  });
}
__name(showTT, "showTT");
function closeTT() {
  tooltip.show(false);
  timer.clearTimeout(null);
}
__name(closeTT, "closeTT");
var _Tooltip = class _Tooltip extends Popup {
  constructor(props) {
    super(props);
    this.setContent(
      new HBox({ content: [
        new Icon({ iconId: circle_info_sharp_light_default }),
        new Component({ id: "text" })
      ] })
    );
  }
  /**
   * 
   */
  setText(text) {
    this.query("#text").setContent(text);
  }
};
__name(_Tooltip, "Tooltip");
var Tooltip = _Tooltip;

// src/components/treeview/chevron-down-light.svg
var chevron_down_light_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Pro 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M267.3 395.3c-6.2 6.2-16.4 6.2-22.6 0l-192-192c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L256 361.4 436.7 180.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6l-192 192z"/></svg>';

// src/components/treeview/treeview.ts
var kbTreeNav = /* @__PURE__ */ ((kbTreeNav2) => {
  kbTreeNav2[kbTreeNav2["first"] = 0] = "first";
  kbTreeNav2[kbTreeNav2["prev"] = 1] = "prev";
  kbTreeNav2[kbTreeNav2["next"] = 2] = "next";
  kbTreeNav2[kbTreeNav2["last"] = 3] = "last";
  kbTreeNav2[kbTreeNav2["parent"] = 4] = "parent";
  kbTreeNav2[kbTreeNav2["child"] = 5] = "child";
  kbTreeNav2[kbTreeNav2["expand"] = 6] = "expand";
  kbTreeNav2[kbTreeNav2["collapse"] = 7] = "collapse";
  kbTreeNav2[kbTreeNav2["toggle"] = 8] = "toggle";
  return kbTreeNav2;
})(kbTreeNav || {});
var _CTreeViewItem = class _CTreeViewItem extends Box {
  constructor(props, item) {
    super({ ...props });
    this._item = item;
    if (item) {
      this._label = new HBox({ cls: "label item", content: [
        this._icon = new Icon({ iconId: item.children ? chevron_down_light_default : item.iconId }),
        new Label({ tag: "span", cls: "", text: item.text })
      ] });
      this._label.setData("id", item.id + "");
      if (item.children) {
        this._childs = new VBox({ cls: "body" });
        if (item.open === void 0) {
          item.open = false;
        }
        this.addClass("folder");
        this.setClass("open", item.open);
        this.setItems(item.children);
        this._icon.addDOMEvent("click", (ev) => this.toggle(ev));
      }
    } else {
      this._childs = new VBox({ cls: "body" });
    }
    this.setContent([
      this._label,
      this._childs
    ]);
  }
  toggle(ev) {
    const isOpen = this.hasClass("open");
    this.open(!isOpen);
    if (ev) {
      ev.stopPropagation();
    }
  }
  open(open = true) {
    this.setClass("open", open);
    this._item.open = open;
  }
  setItems(items) {
    if (items) {
      const childs = items.map((itm) => {
        return new _CTreeViewItem({}, itm);
      });
      this._childs.setContent(childs);
    } else {
      this._childs.clearContent();
    }
  }
};
__name(_CTreeViewItem, "CTreeViewItem");
var CTreeViewItem = _CTreeViewItem;
var _Treeview = class _Treeview extends Component {
  constructor(props) {
    super(props);
    if (props.items) {
      this.setItems(props.items);
    }
    this.setAttribute("tabindex", 0);
    this.setDOMEvents({
      click: /* @__PURE__ */ __name((ev) => this._onclick(ev), "click"),
      keydown: /* @__PURE__ */ __name((ev) => this._onkey(ev), "keydown")
    });
  }
  /**
   * 
   */
  setItems(items) {
    this._items = items;
    const root = new CTreeViewItem({ cls: "root" }, null);
    root.setItems(items);
    this.setContent(root);
  }
  _onclick(ev) {
    let target = ev.target;
    while (target && target != this.dom) {
      const c = componentFromDOM(target);
      if (c && c.hasClass("item")) {
        const id = c.getData("id");
        this._selectItem(id, c);
        return;
      }
      target = target.parentElement;
    }
    this.clearSelection();
  }
  _onkey(ev) {
    switch (ev.key) {
      case "ArrowDown": {
        this.navigate(2 /* next */);
        break;
      }
      case "ArrowUp": {
        this.navigate(1 /* prev */);
        break;
      }
      case "Home": {
        this.navigate(0 /* first */);
        break;
      }
      case "End": {
        this.navigate(3 /* last */);
        break;
      }
      case "ArrowRight": {
        this.navigate(5 /* child */);
        break;
      }
      case "+": {
        this.navigate(6 /* expand */);
        break;
      }
      case "ArrowLeft": {
        this.navigate(4 /* parent */);
        break;
      }
      case "-": {
        this.navigate(7 /* collapse */);
        break;
      }
      case " ": {
        this.navigate(8 /* toggle */);
        break;
      }
      default:
        console.log(ev.key);
        return;
    }
    ev.preventDefault();
    ev.stopPropagation();
  }
  /**
   * 
   */
  navigate(sens) {
    var _a;
    if (!this._items || this._items.length == 0) {
      return;
    }
    if (!this._selitem) {
      if (sens == 2 /* next */ || sens == 4 /* parent */) sens = 0 /* first */;
      else if (sens == 1 /* prev */) sens = 3 /* last */;
      else return;
    }
    const p = (_a = this._selitem) == null ? void 0 : _a.parentElement();
    const isFolder = p == null ? void 0 : p.hasClass("folder");
    if (p && sens == 4 /* parent */ && isFolder && p.hasClass("open")) {
      sens = 7 /* collapse */;
    } else if (sens == 5 /* child */) {
      if (isFolder) {
        if (!p.hasClass("open")) {
          sens = 6 /* expand */;
        } else {
          sens = 2 /* next */;
        }
      } else {
        sens = 2 /* next */;
      }
    }
    if (sens == 6 /* expand */ || sens == 7 /* collapse */ || sens == 8 /* toggle */) {
      if (isFolder) {
        if (sens == 8 /* toggle */) {
          p.toggle();
          return true;
        } else {
          p.open(sens == 6 /* expand */);
          return true;
        }
      }
    } else {
      const all = this._flattenOpenItems();
      let cur = all.findIndex((x) => this._selection == x.id);
      let newSel;
      if (sens == 0 /* first */) {
        newSel = all[0].id;
      } else if (sens == 3 /* last */) {
        newSel = all[all.length - 1].id;
      } else if (cur >= 0) {
        if (sens == 1 /* prev */) {
          if (cur > 0) {
            newSel = all[cur - 1].id;
          }
        } else if (sens == 2 /* next */) {
          if (cur < all.length - 1) {
            newSel = all[cur + 1].id;
          }
        } else if (sens == 4 /* parent */) {
          const clevel = all[cur].level;
          while (cur > 0) {
            cur--;
            if (all[cur].level < clevel) {
              newSel = all[cur].id;
              break;
            }
          }
        }
      }
      if (newSel) {
        const nsel = this.query(`[data-id="${newSel}"]`);
        this._selectItem(newSel, nsel);
        return true;
      }
    }
    return false;
  }
  _flattenOpenItems() {
    let all = [];
    const build = /* @__PURE__ */ __name((x, level) => {
      all.push({ id: x.id + "", level });
      if (x.children && x.open) {
        x.children.forEach((y) => build(y, level + 1));
      }
    }, "build");
    this._items.forEach((y) => build(y, 0));
    return all;
  }
  _flattenItems() {
    let all = [];
    const build = /* @__PURE__ */ __name((x) => {
      all.push(x);
      if (x.children) {
        x.children.forEach((y) => build(y));
      }
    }, "build");
    this._items.forEach((y) => build(y));
    return all;
  }
  _selectItem(id, item) {
    if (this._selitem) {
      this._selitem.removeClass("selected");
      this._selitem = void 0;
    }
    this._selitem = item;
    this._selection = id;
    if (item) {
      item.addClass("selected");
      item.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
    const itm = this._findItem(id);
    this.fire("change", { selection: itm });
  }
  _findItem(id) {
    const all = this._flattenItems();
    return all.find((x) => x.id == id);
  }
  /**
   * 
   */
  clearSelection() {
    if (this._selitem) {
      this._selitem.removeClass("selected");
      this._selitem = void 0;
    }
    this._selection = void 0;
    this.fire("change", { selection: void 0 });
  }
};
__name(_Treeview, "Treeview");
var Treeview = _Treeview;
export {
  Box,
  BtnGroup,
  Button,
  CSizer,
  Calendar,
  Checkbox,
  Color,
  ColorInput,
  ColorPicker,
  Combobox,
  Component,
  ComputedStyle,
  CoreElement,
  Dialog,
  EventSource,
  Flex,
  Form,
  HBox,
  Header,
  Icon,
  Image2 as Image,
  Input,
  Label,
  Listbox,
  Menu,
  MessageBox,
  Notification,
  Panel,
  Popup,
  Progress,
  Rating,
  Rect,
  Router,
  Saturation,
  ScrollView,
  Slider,
  StackBox,
  Stylesheet,
  SvgBuilder,
  SvgComponent,
  SvgGradient,
  SvgGroup,
  SvgPath,
  SvgShape,
  SvgText,
  Switch,
  Tabs,
  TextArea,
  TextEdit,
  Timer,
  Treeview,
  UnsafeHtml,
  VBox,
  Viewport,
  _date_set_locale,
  _tr,
  addEvent,
  addTranslation,
  asap,
  calcAge,
  camelCase,
  clamp,
  componentFromDOM,
  createLanguage,
  date_calc_weeknum,
  date_clone,
  date_diff,
  date_format,
  date_hash,
  date_sql_utc,
  date_to_sql,
  dispatchEvent,
  dragManager,
  formatIntlDate,
  getAvailableLanguages,
  getCurrentLanguage,
  initTooltips,
  isArray,
  isFeatureAvailable,
  isFunction,
  isLanguage,
  isNumber,
  isString,
  isUnitLess,
  kbNav,
  kbTreeNav,
  makeUniqueComponentId,
  pad,
  parseIntlDate,
  pascalCase,
  selectLanguage,
  sprintf,
  svgLoader,
  unbubbleEvents,
  unitless,
  unsafeHtml,
  wrapDOM
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2NvcmUvY29yZV9pMThuLnRzIiwgIi4uL3NyYy9jb3JlL2NvcmVfdG9vbHMudHMiLCAiLi4vc3JjL2NvcmUvY29yZV9ldmVudHMudHMiLCAiLi4vc3JjL2NvcmUvY29yZV9lbGVtZW50LnRzIiwgIi4uL3NyYy9jb3JlL2NvcmVfc3R5bGVzLnRzIiwgIi4uL3NyYy9jb3JlL2NvcmVfZG9tLnRzIiwgIi4uL3NyYy9jb3JlL2NvbXBvbmVudC50cyIsICIuLi9zcmMvY29yZS9jb3JlX2NvbG9ycy50cyIsICIuLi9zcmMvY29yZS9jb3JlX2RyYWdkcm9wLnRzIiwgIi4uL3NyYy9jb3JlL2NvcmVfcm91dGVyLnRzIiwgIi4uL3NyYy9jb3JlL2NvcmVfc3ZnLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2JveGVzL2JveGVzLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2ljb24vaWNvbi50cyIsICIuLi9zcmMvY29tcG9uZW50cy9idXR0b24vYnV0dG9uLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2J0bmdyb3VwL2J0bmdyb3VwLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2xhYmVsL2xhYmVsLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3NpemVycy9zaXplci50cyIsICIuLi9zcmMvY29tcG9uZW50cy9wb3B1cC9wb3B1cC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9tZW51L21lbnUudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvY2FsZW5kYXIvY2FsZW5kYXIudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvaW5wdXQvaW5wdXQudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvY2hlY2tib3gvY2hlY2tib3gudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvY29sb3JpbnB1dC9jb2xvcmlucHV0LnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2NvbG9ycGlja2VyL2NvbG9ycGlja2VyLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3ZpZXdwb3J0L3ZpZXdwb3J0LnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2xpc3Rib3gvbGlzdGJveC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9jb21ib2JveC9jb21ib2JveC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9kaWFsb2cvZGlhbG9nLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2Zvcm0vZm9ybS50cyIsICIuLi9zcmMvY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2ltYWdlL2ltYWdlLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL21lc3NhZ2VzL21lc3NhZ2VzLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9ub3RpZmljYXRpb24udHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvcGFuZWwvcGFuZWwudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvcHJvZ3Jlc3MvcHJvZ3Jlc3MudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvcmF0aW5nL3JhdGluZy50cyIsICIuLi9zcmMvY29tcG9uZW50cy9zbGlkZXIvc2xpZGVyLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3N3aXRjaC9zd2l0Y2gudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvdGFicy90YWJzLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3RleHRhcmVhL3RleHRhcmVhLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3RleHRlZGl0L3RleHRlZGl0LnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3Rvb2x0aXBzL3Rvb2x0aXBzLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3RyZWV2aWV3L3RyZWV2aWV3LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKiogXG4gKiAgX19fICBfX18gX19cbiAqICBcXCAgXFwvICAvICAvIF9cbiAqICAgXFwgICAgLyAgL198IHxfXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxuICogIC9fXy9cXF9fXFwgICB8X3xcbiAqIFxuICogQGZpbGUgY29yZV9pMThuLnRzXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcbiAqIFxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiovXG5cblxuLyoqXG4gKiBsYW5ndWFnZSBkZWZpbml0aW9uXG4gKi9cblxuIGludGVyZmFjZSBMYW5ndWFnZSB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGJhc2U6IHN0cmluZztcblx0c3JjX3RyYW5zbGF0aW9uczogYW55O1xuICAgIHRyYW5zbGF0aW9uczogYW55O1xufVxuXG5jb25zdCBzeW1fbGFuZyA9IFN5bWJvbCggXCJpMThuXCIgKTtcblxubGV0IGxhbmd1YWdlczogUmVjb3JkPHN0cmluZyxMYW5ndWFnZT4gPSB7XG59O1xuXG4vKipcbiAqIGNyZWF0ZSBhIG5ldyBsYW5ndWFnZVxuICogQHBhcmFtIG5hbWUgbGFuZ3VhZ2UgbmFtZSAoY29kZSlcbiAqIEBwYXJhbSBiYXNlIGJhc2UgbGFuZ3VhZ2UgKGNvZGUpXG4gKiBAZXhhbXBsZTpcbiAqIGBgYGpzXG4gKiBjcmVhdGVMYW5ndWFnZSggJ2VuJywgJ2ZyJyApO1xuICogYGBgXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxhbmd1YWdlKCBuYW1lOiBzdHJpbmcsIGJhc2U6IHN0cmluZyApIHtcbiAgICBsYW5ndWFnZXNbbmFtZV0gPSB7IFxuICAgICAgICBuYW1lLFxuICAgICAgICBiYXNlLFxuXHRcdHNyY190cmFuc2xhdGlvbnM6IHt9LFxuICAgICAgICB0cmFuc2xhdGlvbnM6IHt9XG4gICAgfTtcbn1cblxuLyoqXG4gKiBjaGVjayBpZiB0aGUgZ2l2ZW4gbGFuZ3VhZ2UgaXMga25vd25cbiAqIEBwYXJhbSBuYW1lIGxhbmd1YWdlIG5hbWUgKGNvZGUpXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTGFuZ3VhZ2UoIG5hbWU6IHN0cmluZyApOiBib29sZWFuIHtcbiAgICByZXR1cm4gbGFuZ3VhZ2VzW25hbWVdIT09dW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIGJ1aWxkIHRoZSBsYW5ndWFnZSB3aXRoIGdpdmVuIGZyYWdtZW50c1xuICogQHBhcmFtIG5hbWUgbGFuZ3VhZ2UgbmFtZSAoY29kZSlcbiAqIEBwYXJhbSBwYXJ0cyBtaXNjIGVsZW1lbnRzIHRoYXQgbWFrZSB0aGUgbGFuZ3VhZ2VcbiAqIEBleGFtcGxlOlxuICogYGBganNcbiAqIGNyZWF0ZUxhbmd1YWdlKCAnZW4nLCAnZnInICk7XG4gKiBjb25zdCBhcHAgPSB7XG4gKiBcdGNsaWVudHM6IHtcbiAqIFx0XHR0cmFuc2xhdGlvbjE6IFwiaGVsbG9cIixcbiAqICB9XG4gKiB9XG4gKiBhZGRUcmFuc2xhdGlvbiggJ2VuJywgYXBwICk7XG4gKiBgYGBcbiAgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRyYW5zbGF0aW9uKCBuYW1lOiBzdHJpbmcsIC4uLnBhcnRzOiBhbnlbXSApIHtcblx0XG5cdGlmKCAhaXNMYW5ndWFnZShuYW1lKSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBsYW5nID0gbGFuZ3VhZ2VzW25hbWVdO1xuICAgIFxuXHRwYXJ0cy5mb3JFYWNoKCBwID0+IHtcblx0XHRfcGF0Y2goIGxhbmcuc3JjX3RyYW5zbGF0aW9ucywgcCApO1xuXHR9ICk7XG5cblx0bGFuZy50cmFuc2xhdGlvbnMgPSBfcHJveHlmeSggbGFuZy5zcmNfdHJhbnNsYXRpb25zLCBsYW5nLmJhc2UsIHRydWUgKTtcbn1cblxuLyoqXG4gKiBwYXRjaCB0aGUgYmFzZSBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0XG4gKiAocmVhbCBwYXRjaClcbiAqL1xuXG5mdW5jdGlvbiBfcGF0Y2goIG9iajogYW55LCBieTogYW55ICkge1xuXG5cdGZvciggbGV0IG4gaW4gYnkgKSB7XG5cdFx0Y29uc3Qgc3JjID0gYnlbbl07XG5cdFx0aWYoIHR5cGVvZiBzcmMgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRvYmpbbl0gPSBzcmM7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aWYoIEFycmF5LmlzQXJyYXkoc3JjKSAmJiAoIW9ialtuXSB8fCAhQXJyYXkuaXNBcnJheShvYmpbbl0pKSApIHtcblx0XHRcdFx0b2JqW25dID0gWy4uLnNyY107XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCAhb2JqW25dIHx8ICh0eXBlb2Ygb2JqW25dICE9PSBcIm9iamVjdFwiKSApIHtcblx0XHRcdFx0b2JqW25dID0geyAuLi5zcmMgfTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRfcGF0Y2goIG9ialtuXSwgYnlbbl0gKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBjcmVhdGUgYSBwcm94eSBmb3IgYWxsIHN1YiBvYmplY3RzXG4gKiAoZGVlcCB0cmF2ZXJzZSlcbiAqL1xuXG5mdW5jdGlvbiBfcHJveHlmeSggb2JqOiBhbnksIGJhc2U6IGFueSwgcm9vdDogYW55ICkge1xuXG5cdGNvbnN0IHJlc3VsdDogYW55ID0ge31cblxuXHRmb3IoIGNvbnN0IG4gaW4gb2JqICkge1xuXHRcdGlmKCB0eXBlb2Ygb2JqW25dIT09XCJzdHJpbmdcIiAmJiAhQXJyYXkuaXNBcnJheShvYmpbbl0pKSB7XG5cdFx0XHRyZXN1bHRbbl0gPSBfcHJveHlmeSggb2JqW25dLCBiYXNlLCBmYWxzZSApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJlc3VsdFtuXSA9IG9ialtuXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gX21rX3Byb3h5KCByZXN1bHQsIGJhc2UsIHJvb3QgKTtcbn1cblxuXG4vKipcbiAqIGNyZWF0ZSBhIHByb3h5IGZvciB0aGUgZ2l2ZW4gb2JqZWN0XG4gKi9cblxuZnVuY3Rpb24gX21rX3Byb3h5KCBvYmo6IGFueSwgYmFzZTogc3RyaW5nLCByb290OiBib29sZWFuICkgOiBhbnkge1xuXHRyZXR1cm4gbmV3IFByb3h5KCBvYmosIHtcblx0XHRnZXQ6ICh0YXJnZXQsIHByb3ApID0+IHtcblx0XHRcdGlmKCByb290ICkge1xuXHRcdFx0XHRyZXFfcGF0aCA9IFtwcm9wXTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRyZXFfcGF0aC5wdXNoKCBwcm9wICk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCB2YWx1ZSA9IHRhcmdldFtwcm9wXTtcblx0XHRcdGlmKCB2YWx1ZT09PXVuZGVmaW5lZCApIHtcblx0XHRcdFx0aWYoIGJhc2UgKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBfZmluZEJhc2VUcmFucyggYmFzZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoIHZhbHVlPT09dW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoIFwiSTE4TiBlcnJvcjogdW5hYmxlIHRvIGZpbmRcIiwgJ190ci4nK3JlcV9wYXRoLmpvaW4oJy4nKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cdH0pO1xufVxuXG5cbi8qKlxuICogd2hlbiB3ZSBhc2sgZm9yIF90ci54eHhcbiAqIHJlcXBhdGggaXMgc2V0IHRvIFt4eHhdXG4gKiBcbiAqIHRoZW4gd2hlbiB3ZSB0cnkgdG8gZ2V0IF90ci54eHgueXl5XG4gKiByZXFwYXRoIGlzIFt4eHgseXl5XVxuICogaWYgeXl5IGlzIG5vdCBmb3VuZCwgd2UgdHJ5IHdpdGggYmFzZSBsYW5nYWdlIGZvciB0aGUgZnVsbCByZXFwYXRoIFxuICogdW50aWwgbm8gYmFzZSBmb3VuZFxuICovXG5cbmxldCByZXFfcGF0aDogKHN0cmluZyB8IHN5bWJvbClbXTtcblxuLyoqXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBfZmluZEJhc2VUcmFucyggYmFzZTogYW55ICkge1xuXG5cdHdoaWxlKCBiYXNlICkge1xuXHRcdGNvbnN0IGxhbmcgPSBsYW5ndWFnZXNbYmFzZV07XG5cdFx0bGV0IHRyYW5zID0gbGFuZy50cmFuc2xhdGlvbnM7XG5cdFx0bGV0IHZhbHVlO1xuXG5cdFx0Zm9yKCBjb25zdCBwIG9mIHJlcV9wYXRoICkge1xuXHRcdFx0dmFsdWUgPSB0cmFuc1twXTtcblx0XHRcdGlmKCB2YWx1ZT09PXVuZGVmaW5lZCApIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdHRyYW5zID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0aWYoIHZhbHVlIT09dW5kZWZpbmVkICkge1xuXHRcdFx0cmV0dXJuIHRyYW5zO1xuXHRcdH1cblxuXHRcdGJhc2UgPSBsYW5nLmJhc2U7XG5cdH1cblxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgbGV0IF90cjogUGFydGlhbDx0eXBlb2YgZnI+ID0ge307XG5cbi8qKlxuICogc2VsZWN0IHRoZSBnaXZlbiBsYW5ndWFnZSBhcyBjdXJyZW50XG4gKiBAcGFyYW0gbmFtZSBsYWd1YWdlIG5hbWUgKGNvZGUpXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdExhbmd1YWdlKCBuYW1lOiBzdHJpbmcgKSB7XG5cblx0aWYoICFpc0xhbmd1YWdlKG5hbWUpICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdF90ciA9IGxhbmd1YWdlc1tuYW1lXS50cmFuc2xhdGlvbnM7XG5cdChfdHIgYXMgYW55KVtzeW1fbGFuZ10gPSBuYW1lO1xuXHRyZXR1cm4gX3RyO1xufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50TGFuZ3VhZ2UoICk6IHN0cmluZyB7XG5cdHJldHVybiAoX3RyIGFzIGFueSlbc3ltX2xhbmddO1xufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdmFpbGFibGVMYW5ndWFnZXMoICk6IHN0cmluZ1tdIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKCBsYW5ndWFnZXMgKTtcbn1cblxuXG5cblxuLyoqXG4gKiBsYW5ndWFnZSBkZWZpbml0aW9uXG4gKiB4NCBzcGVjaWZpYyBzdHJpbmdzXG4gKi9cblxubGV0IGZyID0ge1xuXHRnbG9iYWw6IHtcblx0XHRvazogJ09LJyxcblx0XHRjYW5jZWw6ICdBbm51bGVyJyxcblx0XHRpZ25vcmU6ICdJZ25vcmVyJyxcblx0XHR5ZXM6ICdPdWknLFxuXHRcdG5vOiAnTm9uJyxcblx0XHRhYm9ydDogXCJBYmFuZG9ubmVyXCIsXG5cdFx0cmV0cnk6IFwiUsOpZXNzYXllclwiLFxuXG5cdFx0ZXJyb3I6IFwiRXJyZXVyXCIsXG5cdFx0dG9kYXk6IFwiQXVqb3VyZCdodWlcIixcblxuXHRcdG9wZW46ICdPdXZyaXInLFxuXHRcdG5ldzogJ05vdXZlYXUnLFxuXHRcdGRlbGV0ZTogJ1N1cHByaW1lcicsXG5cdFx0Y2xvc2U6ICdGZXJtZXInLFxuXHRcdHNhdmU6ICdFbnJlZ2lzdHJlcicsXG5cblx0XHRzZWFyY2g6ICdSZWNoZXJjaGVyJyxcblx0XHRzZWFyY2hfdGlwOiAnU2Fpc2lzc2V6IGxlIHRleHRlIMOgIHJlY2hlcmNoZXIuIDxiPkVudGVyPC9iPiBwb3VyIGxhbmNlciBsYSByZWNoZXJjaGUuIDxiPkVzYzwvYj4gcG91ciBhbm51bGVyLicsXG5cblx0XHRyZXF1aXJlZF9maWVsZDogXCJpbmZvcm1hdGlvbiByZXF1aXNlXCIsXG5cdFx0aW52YWxpZF9mb3JtYXQ6IFwiZm9ybWF0IGludmFsaWRlXCIsXG5cdFx0aW52YWxpZF9lbWFpbDogJ2FkcmVzc2UgbWFpbCBpbnZhbGlkZScsXG5cdFx0aW52YWxpZF9udW1iZXI6ICd2YWxldXIgbnVtw6lyaXF1ZSBpbnZhbGlkZScsXG5cblx0XHRkaWZmX2RhdGVfc2Vjb25kczogJ3swfSBzZWNvbmRlcycsXG5cdFx0ZGlmZl9kYXRlX21pbnV0ZXM6ICd7MH0gbWludXRlcycsXG5cdFx0ZGlmZl9kYXRlX2hvdXJzOiAnezB9IGhldXJlcycsXG5cblx0XHRpbnZhbGlkX2RhdGU6ICdEYXRlIG5vbiByZWNvbm51ZSAoezB9KScsXG5cdFx0ZW1wdHlfbGlzdDogJ0xpc3RlIHZpZGUnLFxuXG5cdFx0ZGF0ZV9pbnB1dF9mb3JtYXRzOiAnZC9tL3l8ZC5tLnl8ZCBtIHl8ZC1tLXl8ZG15Jyxcblx0XHRkYXRlX2Zvcm1hdDogJ0QvTS9ZJyxcblxuXHRcdGRheV9zaG9ydDogWyAnZGltJywgJ2x1bicsICdtYXInLCAnbWVyJywgJ2pldScsICd2ZW4nLCAnc2FtJyBdLFxuXHRcdGRheV9sb25nOiBbICdkaW1hbmNoZScsICdsdW5kaScsICdtYXJkaScsICdtZXJjcmVkaScsICdqZXVkaScsICd2ZW5kcmVkaScsICdzYW1lZGknIF0sXG5cblx0XHRtb250aF9zaG9ydDogWyAnamFuJywgJ2bDqXYnLCAnbWFyJywgJ2F2cicsICdtYWknLCAnanVuJywgJ2p1aScsICdhb8O7JywgJ3NlcCcsICdvY3QnLCAnbm92JywgJ2TDqWMnIF0sXG5cdFx0bW9udGhfbG9uZzogWyAnamFudmllcicsICdmw6l2cmllcicsICdtYXJzJywgJ2F2cmlsJywgJ21haScsICdqdWluJywgJ2p1aWxsZXQnLCAnYW/Du3QnLCAnc2VwdGVtYnJlJywgJ29jdG9icmUnLCAnbm92ZW1icmUnLCAnZMOpY2VtYnJlJyBdLFxuXG5cdFx0cHJvcGVydHk6ICdQcm9wcmnDqXTDqScsXG5cdFx0dmFsdWU6ICdWYWxldXInLFxuXG5cdFx0ZXJyXzQwMzogYFZvdXMgbidhdmV6IHBhcyBsZXMgZHJvaXRzIHN1ZmZpc2FudHMgcG91ciBlZmZlY3R1ZXIgY2V0dGUgYWN0aW9uYCxcblxuXHRcdGNvcHk6ICdDb3BpZXInLFxuXHRcdGN1dDogJ0NvdXBlcicsXG5cdFx0cGFzdGU6ICdDb2xsZXInXG5cdH1cbn07XG5cbi8qKiBAaWdub3JlICovXG5cbmxldCBlbiA9IHtcblx0Z2xvYmFsOiB7XG5cdFx0b2s6ICdPSycsXG5cdFx0Y2FuY2VsOiAnQ2FuY2VsJyxcblx0XHRpZ25vcmU6ICdJZ25vcmUnLFxuXHRcdHllczogJ1llcycsXG5cdFx0bm86ICdObycsXG5cdFx0YWJvcnQ6IFwiQWJvcnRcIixcblx0XHRyZXRyeTogXCJSZXRyeVwiLFxuXG5cdFx0ZXJyb3I6IFwiRXJyb3JcIixcblx0XHR0b2RheTogXCJUb2RheVwiLFxuXG5cdFx0b3BlbjogJ09wZW4nLFxuXHRcdG5ldzogJ05ldycsXG5cdFx0ZGVsZXRlOiAnRGVsZXRlJyxcblx0XHRjbG9zZTogJ0Nsb3NlJyxcblx0XHRzYXZlOiAnU2F2ZScsXG5cblx0XHRzZWFyY2g6ICdTZWFyY2gnLFxuXHRcdHNlYXJjaF90aXA6ICdUeXBlIGluIHRoZSB0ZXh0IHRvIHNlYXJjaC4gPGI+RW50ZXI8L2I+IHRvIHN0YXJ0IHRoZSBzZWFyY2guIDxiPkVzYzwvYj4gdG8gY2FuY2VsLicsXG5cblx0XHRyZXF1aXJlZF9maWVsZDogXCJtaXNzaW5nIGluZm9ybWF0aW9uXCIsXG5cdFx0aW52YWxpZF9mb3JtYXQ6IFwiaW52YWxpZCBmb3JtYXRcIixcblx0XHRpbnZhbGlkX2VtYWlsOiAnaW52YWxpZCBlbWFpbCBhZGRyZXNzJyxcblx0XHRpbnZhbGlkX251bWJlcjogJ2JhZCBudW1lcmljIHZhbHVlJyxcblxuXHRcdGRpZmZfZGF0ZV9zZWNvbmRzOiAnezB9IHNlY29uZHMnLFxuXHRcdGRpZmZfZGF0ZV9taW51dGVzOiAnezB9IG1pbnV0ZXMnLFxuXHRcdGRpZmZfZGF0ZV9ob3VyczogJ3swfSBob3VycycsXG5cblx0XHRpbnZhbGlkX2RhdGU6ICdVbnJlY29nbml6ZWQgZGF0ZSh7MH0pJyxcblx0XHRlbXB0eV9saXN0OiAnRW1wdHkgbGlzdCcsXG5cblx0XHRkYXRlX2lucHV0X2Zvcm1hdHM6ICdtL2QveXxtLmQueXxtIGQgeXxtLWQteXxtZHknLFxuXHRcdGRhdGVfZm9ybWF0OiAnTS9EL1knLFxuXG5cdFx0ZGF5X3Nob3J0OiBbICdzdW4nLCAnbW9uJywgJ3R1ZScsICd3ZWQnLCAndGh1JywgJ2ZyaScsICdzYXQnIF0sXG5cdFx0ZGF5X2xvbmc6IFsgJ3N1bmRheScsICdtb25kYXknLCAndHVlc2RheScsICd3ZWRuZXNkYXknLCAndGh1cnNkYXknLCAnZnJpZGF5JywgJ3NhdHVyZGF5JyBdLFxuXG5cdFx0bW9udGhfc2hvcnQ6IFsgJ2phbicsICdmZWInLCAnbWFyJywgJ2FwcicsICdtYXknLCAnanVuJywgJ2p1aScsICdhdWcnLCAnc2VwJywgJ29jdCcsICdub3YnLCAnZGVjJyBdLFxuXHRcdG1vbnRoX2xvbmc6IFsgJ2phbnVhcnknLCAnZmVicnVhcnknLCAnbWFyY2gnLCAnYXByaWwnLCAnbWF1JywgJ2p1bmUnLCAnanVsbHknLCAnYXVndXN0JywgJ3NlcHRlbWJlcicsICdvY3RvYmVyJywgJ25vdmVtYmVyJywgJ2RlY2VtYmVyJyBdLFxuXG5cdFx0cHJvcGVydHk6ICdQcm9wZXJ0eScsXG5cdFx0dmFsdWU6ICdWYWx1ZScsXG5cblx0XHRlcnJfNDAzOiBgWW91IGRvIG5vdCBoYXZlIHN1ZmZpY2llbnQgcmlnaHRzIHRvIGRvIHRoYXQgYWN0aW9uYCxcblxuXHRcdGNvcHk6ICdDb3B5Jyxcblx0XHRjdXQ6ICdDdXQnLFxuXHRcdHBhc3RlOiAnUGFzdGUnXG5cdH1cbn07XG5cbmNyZWF0ZUxhbmd1YWdlKCAnZnInLCBudWxsICk7XG5hZGRUcmFuc2xhdGlvbiggJ2ZyJywgZnIgKTtcblxuY3JlYXRlTGFuZ3VhZ2UoICdlbicsICdmcicgKTtcbmFkZFRyYW5zbGF0aW9uKCAnZW4nLCBlbiApO1xuXG5zZWxlY3RMYW5ndWFnZSggJ2ZyJyApO1x0Ly8gYnkgZGVmYXVsdFxuXG5cblxuXG5cbiIsICIvKiogXG4gKiAgX19fICBfX18gX19cbiAqICBcXCAgXFwvICAvICAvIF9cbiAqICAgXFwgICAgLyAgL198IHxfXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxuICogIC9fXy9cXF9fXFwgICB8X3xcbiAqIFxuICogQGZpbGUgY29yZV90b29scy50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBfdHIgfSBmcm9tIFwiLi9jb3JlX2kxOG4uanNcIjtcblxuLyoqXG4gKiBAcmV0dXJucyB0cnVlIGlmIG9iamVjdCBpcyBhIHN0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmcodmFsOiBhbnkpOiB2YWwgaXMgc3RyaW5nIHtcblx0cmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHRydWUgaWYgb2JqZWN0IGlzIGEgbnVtYmVyXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyKCB2OiBhbnkgKTogdiBpcyBudW1iZXIge1xuXHRyZXR1cm4gdHlwZW9mIHYgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHYpO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHRydWUgaWYgb2JqZWN0IGlzIGFuIGFycmF5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KHZhbDogYW55KTogdmFsIGlzIGFueVtdIHtcblx0cmV0dXJuIHZhbCBpbnN0YW5jZW9mIEFycmF5O1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHRydWUgaWYgb2JqZWN0IGlzIGEgZnVuY3Rpb25cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWw6IGFueSk6IHZhbCBpcyBGdW5jdGlvbiB7XG5cdHJldHVybiB2YWwgaW5zdGFuY2VvZiBGdW5jdGlvbjtcbn1cblxuLyoqXG4gKiBnZW5lcmljIGNvbnN0cnVjdG9yXG4gKi9cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8UD4gPSB7XG5cdG5ldyguLi5wYXJhbXM6IGFueVtdKTogUDtcbn07XG5cblxuLyoqXG4gKiBhIHdheSB0byBleHBsYWluIHRoYXQgdGhlIGdpdmVuIHN0cmluZyBtYXkgYmUgdW5zYWZlIGJ1dCBtdXN0IGJlIHRyZWF0ZWQgYSBzc3RyaW5nXG4gKiBAZXhhbXBsZVxuICogbGFiZWwuc2V0VGV4dCggdW5zYWZlaHRtbGA8Yj5Cb2xkPC9iPiB0ZXh0YCApO1xuICogbGFiZWwuc2V0VGV4dCggbmV3IFVuc2FmZUh0bWwoXCI8Yj5Cb2xkPC9iPiB0ZXh0YFwiICkgKTtcbiAqL1xuXG5leHBvcnQgY2xhc3MgVW5zYWZlSHRtbCBleHRlbmRzIFN0cmluZyB7XG5cdGNvbnN0cnVjdG9yKCB2YWx1ZTogc3RyaW5nICkge1xuXHRcdHN1cGVyKCB2YWx1ZSApO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnNhZmVIdG1sKCB4OiBzdHJpbmcgKTogVW5zYWZlSHRtbCB7XG5cdHJldHVybiBuZXcgVW5zYWZlSHRtbCggeCApO1xufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBjbGFtcDxUPiggdjogVCwgbWluOiBULCBtYXg6IFQgKSA6IFQge1xuXHRpZiggdjxtaW4gKSB7IHJldHVybiBtaW47IH1cblx0aWYoIHY+bWF4ICkgeyByZXR1cm4gbWF4OyB9XG5cdHJldHVybiB2O1xufVxuXG5cbi8qKlxuICogZ2VuZXJpYyBSZWN0YW5nbGUgXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBJUmVjdCB7XG5cdGxlZnQ6IG51bWJlcjtcbiAgICB0b3A6IG51bWJlcjtcbiAgICBoZWlnaHQ6IG51bWJlcjtcbiAgICB3aWR0aDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBjbGFzcyBSZWN0IGltcGxlbWVudHMgSVJlY3Qge1xuXHRsZWZ0OiBudW1iZXI7XG5cdHRvcDogbnVtYmVyO1xuXHRoZWlnaHQ6IG51bWJlcjtcblx0d2lkdGg6IG51bWJlcjtcblxuXHRjb25zdHJ1Y3RvciggKTtcblx0Y29uc3RydWN0b3IoIGw6IG51bWJlciwgdDogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlciApO1xuXHRjb25zdHJ1Y3RvciggbDogUmVjdCApO1xuXHRjb25zdHJ1Y3RvciggbD86IG51bWJlciB8IElSZWN0LCB0PzogbnVtYmVyLCB3PzogbnVtYmVyLCBoPzogbnVtYmVyICkge1xuXHRcdGlmKCBsIT09dW5kZWZpbmVkICkge1xuXHRcdFx0aWYoIGlzTnVtYmVyKCBsICkgKSB7XG5cdFx0XHRcdHRoaXMubGVmdCA9IGw7XG5cdFx0XHRcdHRoaXMudG9wID0gdDtcblx0XHRcdFx0dGhpcy53aWR0aCA9IHc7XG5cdFx0XHRcdHRoaXMuaGVpZ2h0ID0gaDtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRPYmplY3QuYXNzaWduKCB0aGlzLCBsICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdFxuXHRnZXQgcmlnaHQoICkge1xuXHRcdHJldHVybiB0aGlzLmxlZnQrdGhpcy53aWR0aDsgXG5cdH1cblxuXHRnZXQgYm90dG9tKCApIHtcblx0XHRyZXR1cm4gdGhpcy50b3ArdGhpcy5oZWlnaHQ7XG5cdH1cbn1cblxuXG4vKipcbiAqIGdlbmVyaWMgUG9pbnRcbiAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIFBvaW50IHtcblx0eDogbnVtYmVyO1xuXHR5OiBudW1iZXI7XG59XG5cbi8qKlxuICogXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBJQ29tcG9uZW50SW50ZXJmYWNlIHtcbn1cblxuLy8gZm9ybS1lbGVtZW50XG5leHBvcnQgaW50ZXJmYWNlIElGb3JtRWxlbWVudCBleHRlbmRzIElDb21wb25lbnRJbnRlcmZhY2Uge1xuXHRnZXRSYXdWYWx1ZSggKTogYW55O1xuXHRzZXRSYXdWYWx1ZSggdjogYW55ICk6IHZvaWQ7XG59XG5cbi8qKlxuICogXG4gKi9cblxuaW50ZXJmYWNlIEZlYXR1cmVzIHtcblx0ZXllZHJvcHBlcjogMSxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmVhdHVyZUF2YWlsYWJsZSggbmFtZToga2V5b2YgRmVhdHVyZXMgKTogYm9vbGVhbiB7XG5cdHN3aXRjaCggbmFtZSApIHtcblx0XHRjYXNlIFwiZXllZHJvcHBlclwiOiByZXR1cm4gXCJFeWVEcm9wcGVyXCIgaW4gd2luZG93O1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgY2xhc3MgVGltZXIge1xuXHRcblx0cHJvdGVjdGVkIF90aW1lcnM6IE1hcDxzdHJpbmcsYW55Pjtcblx0XG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0c2V0VGltZW91dCggbmFtZTogc3RyaW5nLCB0aW1lOiBudW1iZXIsIGNhbGxiYWNrOiBGdW5jdGlvbiApIHtcblx0XHRpZiggIXRoaXMuX3RpbWVycyApIHtcblx0XHRcdHRoaXMuX3RpbWVycyA9IG5ldyBNYXAoICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5jbGVhclRpbWVvdXQoIG5hbWUgKTtcblx0XHR9XG5cblx0XHRjb25zdCB0bSA9IHNldFRpbWVvdXQoIGNhbGxiYWNrLCB0aW1lICk7XG5cdFx0dGhpcy5fdGltZXJzLnNldCggbmFtZSwgdG0gKTtcblxuXHRcdHJldHVybiB0bTtcblx0fVxuXG5cdGNsZWFyVGltZW91dCggbmFtZTogc3RyaW5nICkge1xuXHRcdGlmKCB0aGlzLl90aW1lcnMgJiYgdGhpcy5fdGltZXJzLmhhcyhuYW1lKSApIHtcblx0XHRcdGNsZWFyVGltZW91dCggdGhpcy5fdGltZXJzLmdldChuYW1lKSApO1xuXHRcdFx0dGhpcy5fdGltZXJzLmRlbGV0ZSggbmFtZSApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0c2V0SW50ZXJ2YWwoIG5hbWU6IHN0cmluZywgdGltZTogbnVtYmVyLCBjYWxsYmFjazogRnVuY3Rpb24gKSB7XG5cdFx0aWYoICF0aGlzLl90aW1lcnMgKSB7XG5cdFx0XHR0aGlzLl90aW1lcnMgPSBuZXcgTWFwKCApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuY2xlYXJJbnRlcnZhbCggbmFtZSApO1xuXHRcdH1cblxuXHRcdGNvbnN0IHRtID0gc2V0SW50ZXJ2YWwoIGNhbGxiYWNrLCB0aW1lICk7XG5cdFx0dGhpcy5fdGltZXJzLnNldCggbmFtZSwgdG0gKTtcblxuXHRcdHJldHVybiB0bTtcblx0fVxuXG5cdGNsZWFySW50ZXJ2YWwoIG5hbWU6IHN0cmluZyApIHtcblx0XHRpZiggdGhpcy5fdGltZXJzICYmIHRoaXMuX3RpbWVycy5oYXMobmFtZSkgKSB7XG5cdFx0XHRjbGVhckludGVydmFsKCB0aGlzLl90aW1lcnMuZ2V0KG5hbWUpICk7XG5cdFx0XHR0aGlzLl90aW1lcnMuZGVsZXRlKCBuYW1lICk7XG5cdFx0fVxuXHR9XG5cblx0Y2xlYXJBbGxUaW1lb3V0cyggKSB7XG5cdFx0dGhpcy5fdGltZXJzPy5mb3JFYWNoKCB0ID0+IHtcblx0XHRcdGNsZWFyVGltZW91dCggdCApO1xuXHRcdH0gKTtcblxuXHRcdHRoaXMuX3RpbWVycyA9IG51bGw7XG5cdH1cbn1cblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gYXNhcCggY2FsbGJhY2s6ICggKSA9PiB2b2lkICkge1xuXHRyZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBjYWxsYmFjayApO1xufVxuXG5cbi8vIDo6IFNUUklORyBVVElMUyA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxuXG5cbi8qKlxuICogcHJlcGVuZCAwIHRvIGEgdmFsdWUgdG8gYSBnaXZlbiBsZW5ndGhcbiAqIEBwYXJhbSB2YWx1ZSBcbiAqIEBwYXJhbSBsZW5ndGggXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHBhZCh3aGF0OiBhbnksIHNpemU6IG51bWJlciwgY2g6IHN0cmluZyA9ICcwJykge1xuXG5cdGxldCB2YWx1ZTogc3RyaW5nO1xuXG5cdGlmICghaXNTdHJpbmcod2hhdCkpIHtcblx0XHR2YWx1ZSA9ICcnICsgd2hhdDtcblx0fVxuXHRlbHNlIHtcblx0XHR2YWx1ZSA9IHdoYXQ7XG5cdH1cblxuXHRpZiAoc2l6ZSA+IDApIHtcblx0XHRyZXR1cm4gdmFsdWUucGFkRW5kKHNpemUsIGNoKTtcblx0fVxuXHRlbHNlIHtcblx0XHRyZXR1cm4gdmFsdWUucGFkU3RhcnQoLXNpemUsIGNoKTtcblx0fVxufVxuXG4vKipcbiAqIHJlcGxhY2UgezAuLjl9IGJ5IGdpdmVuIGFyZ3VtZW50c1xuICogQHBhcmFtIGZvcm1hdCBzdHJpbmdcbiAqIEBwYXJhbSBhcmdzIFxuICogXG4gKiBAZXhhbXBsZSBgYGB0c1xuICogXG4gKiBjb25zb2xlLmxvZyggc3ByaW50ZiggJ2hlcmUgaXMgYXJnIDEgezF9IGFuZCBhcmcgMCB7MH0nLCAnYXJndW1lbnQgMCcsICdhcmd1bWVudCAxJyApIClcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gc3ByaW50ZiggZm9ybWF0OiBzdHJpbmcsIC4uLmFyZ3M6YW55W10gKSB7XG5cdHJldHVybiBmb3JtYXQucmVwbGFjZSgveyhcXGQrKX0vZywgZnVuY3Rpb24gKG1hdGNoLCBpbmRleCkge1xuXHRcdHJldHVybiB0eXBlb2YgYXJnc1tpbmRleF0gIT0gJ3VuZGVmaW5lZCcgPyBhcmdzW2luZGV4XSA6IG1hdGNoO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBpbnZlcnNlIG9mIGNhbWVsIGNhc2VcbiAqIHRoZVRoaW5nVG9DYXNlIC0+IHRoZS10aGluZy10by1jYXNlXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXNjYWxDYXNlKHN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcblxuXHRsZXQgcmVzdWx0ID0gc3RyaW5nO1xuXG5cdHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBcIiQxICQyXCIpO1xuXHRyZXN1bHQgPSByZXN1bHQudG9Mb3dlckNhc2UoKTtcblx0cmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoL1teLSBhLXowLTldKy9nLCAnICcpO1xuXG5cdGlmIChyZXN1bHQuaW5kZXhPZignICcpIDwgMCkge1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRyZXN1bHQgPSByZXN1bHQudHJpbSgpO1xuXHRyZXR1cm4gcmVzdWx0LnJlcGxhY2UoLyAvZywgJy0nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbWVsQ2FzZSggdGV4dDogc3RyaW5nICkge1xuXHRsZXQgcmVzdWx0ID0gdGV4dC50b0xvd2VyQ2FzZSggKTtcblx0cmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoIC9bXmEtekEtWjAtOV0rKC4pL2csIChtLGNocikgPT4ge1xuXHRcdHJldHVybiBjaHIudG9VcHBlckNhc2UoKTtcblx0fSApO1xuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG4vLyA6OiBEQVRFUyA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxuXG5sZXQgY3VyX2xvY2FsZTogc3RyaW5nID0gJ2ZyLUZSJztcblxuLyoqXG4gKiBjaGFuZ2UgdGhlIGN1cnJlbnQgbG9jYWxlIGZvciBtaXNjIHRyYW5zbGF0aW9ucyAoZGF0ZS4uLilcbiAqIEBwYXJhbSBsb2NhbGUgXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIF9kYXRlX3NldF9sb2NhbGUobG9jYWxlOiBzdHJpbmcpIHtcblx0Y3VyX2xvY2FsZSA9IGxvY2FsZTtcbn1cblxuLyoqXG4gKiBcbiAqIEBwYXJhbSBkYXRlIFxuICogQHBhcmFtIG9wdGlvbnMgXG4gKiBAZXhhbXBsZVxuICogbGV0IGRhdGUgPSBuZXcgRGF0ZSggKTtcbiAqIGxldCBvcHRpb25zID0geyBkYXk6ICdudW1lcmljJywgbW9udGg6ICdudW1lcmljJywgeWVhcjogJ251bWVyaWMnLCBob3VyOiAnbnVtZXJpYycsIG1pbnV0ZTogJ251bWVyaWMnIH07XG4gKiBsZXQgdGV4dCA9IGRhdGVfZm9ybWF0KCBkYXRlLCBvcHRpb25zICk7XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVfZm9ybWF0KGRhdGU6IERhdGUsIG9wdGlvbnM/OiBhbnkpOiBzdHJpbmcge1xuXHQvL3JldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChjdXJfbG9jYWxlLCBvcHRpb25zKS5mb3JtYXQoIGRhdGUgKTtcblx0cmV0dXJuIGZvcm1hdEludGxEYXRlKGRhdGUpO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIGRhdGUgXG4gKiBAcGFyYW0gb3B0aW9ucyBcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZGF0ZV9kaWZmKGRhdGUxOiBEYXRlLCBkYXRlMjogRGF0ZSwgb3B0aW9ucz86IGFueSk6IHN0cmluZyB7XG5cblx0dmFyIGR0ID0gKGRhdGUxLmdldFRpbWUoKSAtIGRhdGUyLmdldFRpbWUoKSkgLyAxMDAwO1xuXG5cdC8vIHNlY29uZHNcblx0bGV0IHNlYyA9IGR0O1xuXHRpZiAoc2VjIDwgNjApIHtcblx0XHRyZXR1cm4gc3ByaW50ZihfdHIuZ2xvYmFsLmRpZmZfZGF0ZV9zZWNvbmRzLCBNYXRoLnJvdW5kKHNlYykpO1xuXHR9XG5cblx0Ly8gbWludXRlc1xuXHRsZXQgbWluID0gTWF0aC5mbG9vcihzZWMgLyA2MCk7XG5cdGlmIChtaW4gPCA2MCkge1xuXHRcdHJldHVybiBzcHJpbnRmKF90ci5nbG9iYWwuZGlmZl9kYXRlX21pbnV0ZXMsIE1hdGgucm91bmQobWluKSk7XG5cdH1cblxuXHQvLyBob3Vyc1xuXHRsZXQgaHJzID0gTWF0aC5mbG9vcihtaW4gLyA2MCk7XG5cdHJldHVybiBzcHJpbnRmKF90ci5nbG9iYWwuZGlmZl9kYXRlX2hvdXJzLCBocnMsIG1pbiAlIDYwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVfdG9fc3FsKGRhdGU6IERhdGUsIHdpdGhIb3VyczogYm9vbGVhbikge1xuXG5cdGlmICh3aXRoSG91cnMpIHtcblx0XHRyZXR1cm4gZm9ybWF0SW50bERhdGUoZGF0ZSwgJ1ktTS1EIEg6STpTJyk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0cmV0dXJuIGZvcm1hdEludGxEYXRlKGRhdGUsICdZLU0tRCcpO1xuXHR9XG59XG5cbi8qKlxuICogY29uc3RydWN0IGEgZGF0ZSBmcm9tIGFuIHV0YyBkYXRlIHRpbWUgKHNxbCBmb3JtYXQpXG4gKiBZWVlZLU1NLUREIEhIOk1NOlNTXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVfc3FsX3V0YyhkYXRlOiBzdHJpbmcpOiBEYXRlIHtcblx0bGV0IHJlc3VsdCA9IG5ldyBEYXRlKGRhdGUgKyAnIEdNVCcpO1xuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5cblxuLyoqXG4gKiByZXR1cm4gYSBudW1iZXIgdGhhdCBpcyBhIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkYXRlXG4gKiB0aGlzIG51bWJlciBjYW4gYmUgY29tcGFyZWQgd2l0aCBhbm90aGVyIGhhc2hcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZGF0ZV9oYXNoKGRhdGU6IERhdGUpOiBudW1iZXIge1xuXHRyZXR1cm4gZGF0ZS5nZXRGdWxsWWVhcigpIDw8IDE2IHwgZGF0ZS5nZXRNb250aCgpIDw8IDggfCBkYXRlLmdldERhdGUoKTtcbn1cblxuLyoqXG4gKiByZXR1cm4gYSBjb3B5IG9mIGEgZGF0ZVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBkYXRlX2Nsb25lKGRhdGU6IERhdGUpOiBEYXRlIHtcblx0cmV0dXJuIG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcbn1cblxuLyoqXG4gKiByZXR1cm4gdGhlIHdlZWsgbnVtYmVyIG9mIGEgZGF0ZVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBkYXRlX2NhbGNfd2Vla251bShkYXRlOiBEYXRlKTogbnVtYmVyIHtcblx0Y29uc3QgZmlyc3REYXlPZlllYXIgPSBuZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIDAsIDEpO1xuXHRjb25zdCBwYXN0RGF5c09mWWVhciA9IChkYXRlLnZhbHVlT2YoKSAtIGZpcnN0RGF5T2ZZZWFyLnZhbHVlT2YoKSkgLyA4NjQwMDAwMDtcblx0cmV0dXJuIE1hdGguZmxvb3IoKHBhc3REYXlzT2ZZZWFyICsgZmlyc3REYXlPZlllYXIuZ2V0RGF5KCkgKyAxKSAvIDcpO1xufVxuXG5cblxuLyoqXG4gKiBwYXJzZSBhIGRhdGUgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBmb3JtYXQgXG4gKiBAcGFyYW0gdmFsdWUgLSBzdHJpbmcgZGF0ZSB0byBwYXJzZVxuICogQHBhcmFtIGZtdHMgLSBmb3JtYXQgbGlzdCAtIGkxOCB0cmFubGF0aW9uIGJ5IGRlZmF1bHRcbiAqIGFsbG93ZWQgZm9ybWF0IHNwZWNpZmllcnM6XG4gKiBkIG9yIEQ6IGRhdGUgKDEgb3IgMiBkaWdpdHMpXG4gKiBtIG9yIE06IG1vbnRoICgxIG9yIDIgZGlnaXRzKVxuICogeSBvciBZOiB5ZWFyICgyIG9yIDQgZGlnaXRzKVxuICogaCBvciBIOiBob3VycyAoMSBvciAyIGRpZ2l0cylcbiAqIGkgb3IgSTogbWludXRlcyAoMSBvciAyIGRpZ2l0cylcbiAqIHMgb3IgUzogc2Vjb25kcyAoMSBvciAyIGRpZ2l0cylcbiAqIDxzcGFjZT46IDEgb3IgbW9yZSBzcGFjZXNcbiAqIGFueSBvdGhlciBjaGFyOiA8MCBvciBtb3JlIHNwYWNlcz48dGhlIGNoYXI+PDAgb3IgbW9yZSBzcGFjZXM+XG4gKiBlYWNoIHNwZWNpZmllcnMgaXMgc2VwYXJhdGVkIGZyb20gb3RoZXIgYnkgYSBwaXBlICh8KVxuICogbW9yZSBzcGVjaWZpYyBhdCBmaXJzdFxuICogQGV4YW1wbGVcbiAqICdkL20veXxkIG0gWXxkbXl8eS1tLWQgaDppOnN8eS1tLWQnXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSW50bERhdGUodmFsdWU6IHN0cmluZywgZm10czogc3RyaW5nID0gX3RyLmdsb2JhbC5kYXRlX2lucHV0X2Zvcm1hdHMpOiBEYXRlIHtcblxuXHRsZXQgZm9ybWF0cyA9IGZtdHMuc3BsaXQoJ3wnKTtcblx0Zm9yIChsZXQgZm1hdGNoIG9mIGZvcm1hdHMpIHtcblxuXHRcdC8vcmV2aWV3OiBjb3VsZCBkbyB0aGF0IG9ubHkgb25jZSAmIGtlZXAgcmVzdWx0XG5cdFx0Ly9yZXZpZXc6IGFkZCBob3VycywgbWludXRlcywgc2Vjb25kc1xuXG5cdFx0bGV0IHNtYXRjaCA9ICcnO1xuXHRcdGZvciAobGV0IGMgb2YgZm1hdGNoKSB7XG5cblx0XHRcdGlmIChjID09ICdkJyB8fCBjID09ICdEJykge1xuXHRcdFx0XHRzbWF0Y2ggKz0gJyg/PGRheT5cXFxcZHsxLDJ9KSc7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChjID09ICdtJyB8fCBjID09ICdNJykge1xuXHRcdFx0XHRzbWF0Y2ggKz0gJyg/PG1vbnRoPlxcXFxkezEsMn0pJztcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGMgPT0gJ3knIHx8IGMgPT0gJ1knKSB7XG5cdFx0XHRcdHNtYXRjaCArPSAnKD88eWVhcj5cXFxcZHsxLDR9KSc7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChjID09ICdoJyB8fCBjID09ICdIJykge1xuXHRcdFx0XHRzbWF0Y2ggKz0gJyg/PGhvdXI+XFxcXGR7MSwyfSknO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoYyA9PSAnaScgfHwgYyA9PSAnSScpIHtcblx0XHRcdFx0c21hdGNoICs9ICcoPzxtaW4+XFxcXGR7MSwyfSknO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoYyA9PSAncycgfHwgYyA9PSAnUycpIHtcblx0XHRcdFx0c21hdGNoICs9ICcoPzxzZWM+XFxcXGR7MSwyfSknO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoYyA9PSAnICcpIHtcblx0XHRcdFx0c21hdGNoICs9ICdcXFxccysnO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHNtYXRjaCArPSAnXFxcXHMqXFxcXCcgKyBjICsgJ1xcXFxzKic7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IHJlbWF0Y2ggPSBuZXcgUmVnRXhwKCdeJyArIHNtYXRjaCArICckJywgJ20nKTtcblxuXHRcdGxldCBtYXRjaCA9IHJlbWF0Y2guZXhlYyh2YWx1ZSk7XG5cblx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdGNvbnN0IG5vdyA9IG5ldyBEYXRlKCApO1xuXG5cdFx0XHRsZXQgZCA9IHBhcnNlSW50KG1hdGNoLmdyb3Vwcy5kYXkgPz8gJzEnKTtcblx0XHRcdGxldCBtID0gcGFyc2VJbnQobWF0Y2guZ3JvdXBzLm1vbnRoID8/ICcxJyk7XG5cdFx0XHRsZXQgeSA9IHBhcnNlSW50KG1hdGNoLmdyb3Vwcy55ZWFyID8/IG5vdy5nZXRGdWxsWWVhcigpKycnKTtcblx0XHRcdGxldCBoID0gcGFyc2VJbnQobWF0Y2guZ3JvdXBzLmhvdXIgPz8gJzAnKTtcblx0XHRcdGxldCBpID0gcGFyc2VJbnQobWF0Y2guZ3JvdXBzLm1pbiA/PyAnMCcpO1xuXHRcdFx0bGV0IHMgPSBwYXJzZUludChtYXRjaC5ncm91cHMuc2VjID8/ICcwJyk7XG5cblx0XHRcdGlmICh5ID4gMCAmJiB5IDwgMTAwKSB7XG5cdFx0XHRcdHkgKz0gMjAwMDtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHJlc3VsdCA9IG5ldyBEYXRlKHksIG0gLSAxLCBkLCBoLCBpLCBzLCAwKTtcblxuXHRcdFx0Ly8gd2UgdGVzdCB0aGUgdmRhdGUgdmFsaWRpdHkgKHdpdGhvdXQgYWRqdXN0bWVudHMpXG5cdFx0XHQvLyB3aXRob3V0IHRoaXMgdGVzdCwgZGF0ZSAoIDAsIDAsIDApIGlzIGFjY2VwdGVkIGFuZCB0cmFuc2Zvcm1lZCB0byAxOTY5LzExLzMxIChub3QgZnVuKVxuXHRcdFx0bGV0IHR5ID0gcmVzdWx0LmdldEZ1bGxZZWFyKCksXG5cdFx0XHRcdHRtID0gcmVzdWx0LmdldE1vbnRoKCkgKyAxLFxuXHRcdFx0XHR0ZCA9IHJlc3VsdC5nZXREYXRlKCk7XG5cblx0XHRcdGlmICh0eSAhPSB5IHx8IHRtICE9IG0gfHwgdGQgIT0gZCkge1xuXHRcdFx0XHQvL2RlYnVnZ2VyO1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBmb3JtYXQgYSBkYXRlIGFzIHN0cmluZyBcbiAqIEBwYXJhbSBkYXRlIC0gZGF0ZSB0byBmb3JtYXRcbiAqIEBwYXJhbSBmbXQgLSBmb3JtYXQgXG4gKiBmb3JtYXQgc3BlY2lmaWVyczpcbiAqIGQ6IGRhdGUgKG5vIHBhZClcbiAqIEQ6IDIgZGlnaXRzIGRhdGUgcGFkZGVkIHdpdGggMFxuICogajogZGF5IG9mIHdlZWsgc2hvcnQgbW9kZSAnbW9uJ1xuICogSjogZGF5IG9mIHdlZWsgbG9uZyBtb2RlICdtb25kYXknXG4gKiB3OiB3ZWVrIG51bWJlclxuICogbTogbW9udGggKG5vIHBhZClcbiAqIE06IDIgZGlnaXRzIG1vbnRoIHBhZGRlZCB3aXRoIDBcbiAqIG86IG1vbnRoIHNob3J0IG1vZGUgJ2phbidcbiAqIE86IG1vbnRoIGxvbmcgbW9kZSAnamFudWFyeSdcbiAqIHkgb3IgWTogeWVhclxuICogaDogaG91ciAoMjQgZm9ybWF0KVxuICogSDogMiBkaWdpdHMgaG91ciAoMjQgZm9ybWF0KSBwYWRkZWQgd2l0aCAwXG4gKiBpOiBtaW51dGVzXG4gKiBJOiAyIGRpZ2l0cyBtaW51dGVzIHBhZGRlZCB3aXRoIDBcbiAqIHM6IHNlY29uZHNcbiAqIFM6IDIgZGlnaXRzIHNlY29uZHMgcGFkZGVkIHdpdGggMFxuICogYTogYW0gb3IgcG1cbiAqIGFueXRoaW5nIGVsc2UgaXMgaW5zZXJ0ZWRcbiAqIGlmIHlvdSBuZWVkIHRvIGluc2VydCBzb21lIHRleHQsIHB1dCBpdCBiZXR3ZWVuIHt9XG4gKiBcbiAqIEBleGFtcGxlXG4gKiBcbiAqIDAxLzAxLzE5NzAgMTE6MjU6MDAgd2l0aCAne3RoaXMgaXMgbXkgZGVtbyBkYXRlIGZvcm1hdHRlcjogfUgtaSpNJ1xuICogXCJ0aGlzIGlzIG15IGRlbW8gZGF0ZSBmb3JtYXR0ZXI6IDExLTI1KmphbnVhcnlcIlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRJbnRsRGF0ZShkYXRlOiBEYXRlLCBmbXQ6IHN0cmluZyA9IF90ci5nbG9iYWwuZGF0ZV9mb3JtYXQpIHtcblxuXHRpZiAoIWRhdGUpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblxuXHRsZXQgbm93ID0ge1xuXHRcdHllYXI6IGRhdGUuZ2V0RnVsbFllYXIoKSxcblx0XHRtb250aDogZGF0ZS5nZXRNb250aCgpICsgMSxcblx0XHRkYXk6IGRhdGUuZ2V0RGF0ZSgpLFxuXHRcdHdkYXk6IGRhdGUuZ2V0RGF5KCksXG5cdFx0aG91cnM6IGRhdGUuZ2V0SG91cnMoKSxcblx0XHRtaW51dGVzOiBkYXRlLmdldE1pbnV0ZXMoKSxcblx0XHRzZWNvbmRzOiBkYXRlLmdldFNlY29uZHMoKSxcblx0XHRtaWxsaTogZGF0ZS5nZXRNaWxsaXNlY29uZHMoKVxuXHR9O1xuXG5cblx0bGV0IHJlc3VsdCA9ICcnO1xuXHRsZXQgZXNjID0gMDtcblxuXHRmb3IgKGxldCBjIG9mIGZtdCkge1xuXG5cdFx0aWYgKGMgPT0gJ3snKSB7XG5cdFx0XHRpZiAoKytlc2MgPT0gMSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoYyA9PSAnfScpIHtcblx0XHRcdGlmICgtLWVzYyA9PSAwKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChlc2MpIHtcblx0XHRcdHJlc3VsdCArPSBjO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0aWYgKGMgPT0gJ2QnKSB7XG5cdFx0XHRyZXN1bHQgKz0gbm93LmRheTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoYyA9PSAnRCcpIHtcblx0XHRcdHJlc3VsdCArPSBwYWQobm93LmRheSwgLTIpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChjID09ICdqJykgeyAvLyBkYXkgc2hvcnRcblx0XHRcdHJlc3VsdCArPSBfdHIuZ2xvYmFsLmRheV9zaG9ydFtub3cud2RheV07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGMgPT0gJ0onKSB7IC8vIGRheSBsb25nXG5cdFx0XHRyZXN1bHQgKz0gX3RyLmdsb2JhbC5kYXlfbG9uZ1tub3cud2RheV07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGMgPT0gJ3cnKSB7XHQvLyB3ZWVrXG5cdFx0XHRyZXN1bHQgKz0gZGF0ZV9jYWxjX3dlZWtudW0oZGF0ZSk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGMgPT0gJ1cnKSB7XHQvLyB3ZWVrXG5cdFx0XHRyZXN1bHQgKz0gcGFkKGRhdGVfY2FsY193ZWVrbnVtKGRhdGUpLCAtMik7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGMgPT0gJ20nKSB7XG5cdFx0XHRyZXN1bHQgKz0gbm93Lm1vbnRoO1xuXHRcdH1cblx0XHRlbHNlIGlmIChjID09ICdNJykge1xuXHRcdFx0cmVzdWx0ICs9IHBhZChub3cubW9udGgsIC0yKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoYyA9PSAnbycpIHtcdC8vIG1vbnRoIHNob3J0XG5cdFx0XHRyZXN1bHQgKz0gX3RyLmdsb2JhbC5tb250aF9zaG9ydFtub3cubW9udGggLSAxXTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoYyA9PSAnTycpIHtcdC8vIG1vbnRoIGxvbmdcblx0XHRcdHJlc3VsdCArPSBfdHIuZ2xvYmFsLm1vbnRoX2xvbmdbbm93Lm1vbnRoIC0gMV07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGMgPT0gJ3knIHx8IGMgPT0gJ1knKSB7XG5cdFx0XHRyZXN1bHQgKz0gcGFkKG5vdy55ZWFyLCAtNCk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGMgPT0gJ2EnIHx8IGMgPT0gJ0EnKSB7XG5cdFx0XHRyZXN1bHQgKz0gbm93LmhvdXJzIDwgMTIgPyAnYW0nIDogJ3BtJztcblx0XHR9XG5cdFx0ZWxzZSBpZiAoYyA9PSAnaCcpIHtcblx0XHRcdHJlc3VsdCArPSBub3cuaG91cnM7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGMgPT0gJ0gnKSB7XG5cdFx0XHRyZXN1bHQgKz0gcGFkKG5vdy5ob3VycywgLTIpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChjID09ICdpJykge1xuXHRcdFx0cmVzdWx0ICs9IG5vdy5taW51dGVzO1xuXHRcdH1cblx0XHRlbHNlIGlmIChjID09ICdJJykge1xuXHRcdFx0cmVzdWx0ICs9IHBhZChub3cubWludXRlcywgLTIpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChjID09ICdzJykge1xuXHRcdFx0cmVzdWx0ICs9IG5vdy5zZWNvbmRzO1xuXHRcdH1cblx0XHRlbHNlIGlmIChjID09ICdTJykge1xuXHRcdFx0cmVzdWx0ICs9IHBhZChub3cuc2Vjb25kcywgLTIpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChjID09ICdsJykge1xuXHRcdFx0cmVzdWx0ICs9IG5vdy5taWxsaTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoYyA9PSAnTCcpIHtcblx0XHRcdHJlc3VsdCArPSBwYWQobm93Lm1pbGxpLCAtMyk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmVzdWx0ICs9IGM7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGNBZ2UoYmlydGg6IERhdGUsIHJlZj86IERhdGUpIHtcblx0aWYgKHJlZiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0cmVmID0gbmV3IERhdGUoKTtcblx0fVxuXG5cdGlmICghYmlydGgpIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdGxldCBhZ2UgPSByZWYuZ2V0RnVsbFllYXIoKSAtIGJpcnRoLmdldEZ1bGxZZWFyKCk7XG5cdGlmIChyZWYuZ2V0TW9udGgoKSA8IGJpcnRoLmdldE1vbnRoKCkgfHwgKHJlZi5nZXRNb250aCgpID09IGJpcnRoLmdldE1vbnRoKCkgJiYgcmVmLmdldERhdGUoKSA8IGJpcnRoLmdldERhdGUoKSkpIHtcblx0XHRhZ2UtLTtcblx0fVxuXG5cdHJldHVybiBhZ2U7XG59XG5cblxuIiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSBjb3JlX2V2ZW50cy50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBDb3JlRWxlbWVudCB9IGZyb20gJy4vY29yZV9lbGVtZW50JztcblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIENvcmVFdmVudCB7XG5cdHJlYWRvbmx5IHR5cGU/OiBzdHJpbmc7XHRcdFx0Ly8gdHlwZSBvZiB0aGUgZXZlbnQgJ2NsaWNrJywgJ2NoYW5nZScsIC4uLlxuXHRyZWFkb25seSBzb3VyY2U/OiBDb3JlRWxlbWVudDtcdC8vIG9iamVjdCB0aGF0IGZpcmVzIHRoZSBldmVudFxuXHRyZWFkb25seSBjb250ZXh0PzogYW55O1x0XHRcdC8vIGNvbnRleHR1YWwgZGF0YSwgbGVmdCB0byB0aGUgdXNlclxuXG5cdHByb3BhZ2F0aW9uU3RvcHBlZD86IGJvb2xlYW47XHQvLyBpZiB0cnVlLCBkbyBub3QgcHJvcGFnYXRlIHRoZSBldmVudFxuXHRkZWZhdWx0UHJldmVudGVkPzogYm9vbGVhbjtcdFx0Ly8gaWYgdHJ1ZSwgZG8gbm90IGNhbGwgZGVmYXVsdCBoYW5kbGVyIChpZiBhbnkpXG5cblx0c3RvcFByb3BhZ2F0aW9uPygpOiB2b2lkO1x0XHQvLyBzdG9wIHRoZSBwcm9wYWdhdGlvblxuXHRwcmV2ZW50RGVmYXVsdD8oKTogdm9pZDtcdFx0Ly8gcHJldmVudCB0aGUgZGVmYXVsdCBoYW5kbGVyXG59XG5cbi8vIGRlZmF1bHQgc3RvcFByb3BhZ2F0aW9uIGltcGxlbWVudGF0aW9uIGZvciBFdmVudHNcbmNvbnN0IHN0b3BQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uICggdGhpczogQ29yZUV2ZW50ICkge1xuXHR0aGlzLnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XG59XG5cbi8vIGRlZmF1bHQgcHJldmVudERlZmF1bHQgaW1wbGVtZW50YXRpb24gZm9yIEV2ZW50c1xuY29uc3QgcHJldmVudERlZmF1bHQgPSBmdW5jdGlvbiAoIHRoaXM6IENvcmVFdmVudCApIHtcblx0dGhpcy5kZWZhdWx0UHJldmVudGVkID0gdHJ1ZTtcbn1cblxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRNYXAge1xufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCB0eXBlIEV2ZW50Q2FsbGJhY2s8VCBleHRlbmRzIENvcmVFdmVudCA9IENvcmVFdmVudD4gPSAoZXZlbnQ6IFQpID0+IGFueTtcblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgY2xhc3MgRXZlbnRTb3VyY2U8RSBleHRlbmRzIEV2ZW50TWFwID0gRXZlbnRNYXAgPiB7XG5cblx0cHJpdmF0ZSBfc291cmNlOiB1bmtub3duO1xuXHRwcml2YXRlIF9yZWdpc3RyeTogTWFwPHN0cmluZyxFdmVudENhbGxiYWNrW10+O1xuXG5cdGNvbnN0cnVjdG9yKHNvdXJjZTogdW5rbm93biA9IG51bGwpIHtcblx0XHR0aGlzLl9zb3VyY2UgPSBzb3VyY2UgPz8gdGhpcztcblx0fVxuXG5cdGFkZExpc3RlbmVyPEsgZXh0ZW5kcyBrZXlvZiBFPiggbmFtZTogSywgY2FsbGJhY2s6ICggZXY6IEVbS10gKSA9PiB2b2lkLCBjYXB0dXJpbmcgPSBmYWxzZSApIHtcblx0XHRcblx0XHRpZiAoIXRoaXMuX3JlZ2lzdHJ5KSB7XG5cdFx0XHR0aGlzLl9yZWdpc3RyeSA9IG5ldyBNYXAoKTtcblx0XHR9XG5cblx0XHRsZXQgbGlzdGVuZXJzID0gdGhpcy5fcmVnaXN0cnkuZ2V0KG5hbWUgYXMgc3RyaW5nKTtcblx0XHRpZiAoIWxpc3RlbmVycykge1xuXHRcdFx0bGlzdGVuZXJzID0gW107XG5cdFx0XHR0aGlzLl9yZWdpc3RyeS5zZXQobmFtZSBhcyBzdHJpbmcsIGxpc3RlbmVycyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2IgPSBjYWxsYmFjayBhcyBFdmVudENhbGxiYWNrO1xuXG5cdFx0aWYgKGxpc3RlbmVycy5pbmRleE9mKGNiKSA9PSAtMSkge1xuXHRcdFx0aWYgKGNhcHR1cmluZykge1xuXHRcdFx0XHRsaXN0ZW5lcnMudW5zaGlmdChjYik7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bGlzdGVuZXJzLnB1c2goY2IpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZpcmU8SyBleHRlbmRzIGtleW9mIEU+KG5hbWU6IEssIGV2eDogRVtLXSkge1xuXHRcdFxuXHRcdGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9yZWdpc3RyeT8uZ2V0KG5hbWUgYXMgc3RyaW5nKTtcblx0XHQvL2NvbnN0IGRlZmF1bHRIYW5kbGVyID0gdGhpcy5tX2RlZmF1bHRIYW5kbGVycz8uZ2V0KGV2ZW50TmFtZSk7XG5cblx0XHRpZiAobGlzdGVuZXJzICYmIGxpc3RlbmVycy5sZW5ndGgpIHtcblx0XHRcdGxldCBldiA9IGV2eCBhcyBDb3JlRXZlbnQ7XG5cdFx0XHRpZiAoIWV2KSB7XG5cdFx0XHRcdGV2ID0ge307XG5cdFx0XHR9XG5cblx0XHRcdGlmICghZXYuc291cmNlKSB7XG5cdFx0XHRcdC8vIHJlYWRvbmx5XG5cdFx0XHRcdChldiBhcyBhbnkpLnNvdXJjZSA9IHRoaXMuX3NvdXJjZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFldi50eXBlKSB7XG5cdFx0XHRcdC8vIHJlYWRvbmx5XG5cdFx0XHRcdChldiBhcyBhbnkpLnR5cGUgPSBuYW1lO1xuXHRcdFx0fVxuXG5cdFx0XHRcblx0XHRcdGlmICghZXYucHJldmVudERlZmF1bHQpIHtcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQgPSBwcmV2ZW50RGVmYXVsdDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFldi5zdG9wUHJvcGFnYXRpb24pIHtcblx0XHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uID0gc3RvcFByb3BhZ2F0aW9uO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBzbWFsbCBvcHRpbWlzYXRpb25cblx0XHRcdGlmIChsaXN0ZW5lcnMubGVuZ3RoID09IDEpIHtcblx0XHRcdFx0bGlzdGVuZXJzWzBdKGV2KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRjb25zdCB0ZW1wID0gbGlzdGVuZXJzLnNsaWNlKCk7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwLCBuID0gdGVtcC5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0XHR0ZW1wW2ldKGV2KTtcblx0XHRcdFx0XHRpZiAoZXYucHJvcGFnYXRpb25TdG9wcGVkKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvL2lmIChkZWZhdWx0SGFuZGxlciAmJiBkZWZhdWx0SGFuZGxlci5sZW5ndGggJiYgIWUuZGVmYXVsdFByZXZlbnRlZCkge1xuXHRcdC8vXHRyZXR1cm4gZGVmYXVsdEhhbmRsZXJbMF0oZSk7XG5cdFx0Ly99XG5cdH1cbn1cblxuXG5cblxuIiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSBjb3JlX2VsZW1lbnQudHNcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxuICogXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqKi9cblxuaW1wb3J0IHsgRXZlbnRNYXAsIEV2ZW50U291cmNlIH0gZnJvbSAnLi9jb3JlX2V2ZW50cy5qcyc7XG5cbi8qKlxuICogXG4gKi9cblxuZXhwb3J0IGNsYXNzIENvcmVFbGVtZW50PEUgZXh0ZW5kcyBFdmVudE1hcCA9IEV2ZW50TWFwPiB7XG5cblx0I2V2ZW50czogRXZlbnRTb3VyY2U8RT47XG5cdCN0aW1lcnM6IE1hcDxzdHJpbmcsIEZ1bmN0aW9uPjtcblxuXHRwcml2YXRlIF9fc3RhcnRUaW1lciggbmFtZTogc3RyaW5nLCBtczogbnVtYmVyLCByZXBlYXQ6IGJvb2xlYW4sIGNhbGxiYWNrOiAoICkgPT4gdm9pZCApIHtcblx0XHRpZiAoIXRoaXMuI3RpbWVycykge1xuXHRcdFx0dGhpcy4jdGltZXJzID0gbmV3IE1hcCgpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuX19zdG9wVGltZXIobmFtZSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaWQgPSAocmVwZWF0ID8gc2V0SW50ZXJ2YWwgOiBzZXRUaW1lb3V0KSggY2FsbGJhY2ssIG1zICk7XG5cblx0XHR0aGlzLiN0aW1lcnMuc2V0KG5hbWUsICgpID0+IHsgXG5cdFx0XHQocmVwZWF0ID8gY2xlYXJJbnRlcnZhbCA6IGNsZWFyVGltZW91dCkoaWQpOyBcblx0XHRcdHRoaXMuI3RpbWVycy5kZWxldGUobmFtZSkgXG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIF9fc3RvcFRpbWVyKCBuYW1lOiBzdHJpbmcgKSB7XG5cdFx0Y29uc3QgY2xlYXIgPSB0aGlzLiN0aW1lcnMuZ2V0KG5hbWUpO1xuXHRcdGlmIChjbGVhcikgeyBjbGVhcigpOyB9XG5cdH1cblxuXHRzZXRUaW1lb3V0KCBuYW1lOiBzdHJpbmcsIG1zOiBudW1iZXIsIGNhbGxiYWNrOiAoKSA9PiB2b2lkICkge1xuXHRcdHRoaXMuX19zdGFydFRpbWVyKCBuYW1lLCBtcywgZmFsc2UsIGNhbGxiYWNrICk7XG5cdH1cblxuXHRjbGVhclRpbWVvdXQoIG5hbWU6IHN0cmluZyApIHtcblx0XHR0aGlzLl9fc3RvcFRpbWVyKCBuYW1lICk7XG5cdH1cblxuXHRzZXRJbnRlcnZhbCggbmFtZTogc3RyaW5nLCBtczogbnVtYmVyLCBjYWxsYmFjazogKCApID0+IHZvaWQgKSB7XG5cdFx0dGhpcy5fX3N0YXJ0VGltZXIoIG5hbWUsIG1zLCB0cnVlLCBjYWxsYmFjayApO1xuXHR9XG5cblx0Y2xlYXJJbnRlcnZhbCggbmFtZTogc3RyaW5nICkge1xuXHRcdHRoaXMuX19zdG9wVGltZXIoIG5hbWUgKTtcblx0fVxuXG5cdGNsZWFyVGltZW91dHMoICkge1xuXHRcdGZvciggY29uc3QgW2lkLHZhbF0gb2YgdGhpcy4jdGltZXJzICkge1xuXHRcdFx0dmFsKCApO1xuXHRcdH1cblx0XHRcblx0XHR0aGlzLiN0aW1lcnMuY2xlYXIoICk7XG5cdH1cblxuXHQvLyA6OiBFVkVOVFMgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcblxuXHQvKipcblx0ICogYXR0YWNoIHRvIGFuIGV2ZW50XG5cdCAqL1xuXG5cdG9uPEsgZXh0ZW5kcyBrZXlvZiBFPiggbmFtZTogSywgbGlzdGVuZXI6ICggZXY6IEVbS10gKSA9PiB2b2lkICkge1xuXHRcdGNvbnNvbGUuYXNzZXJ0KCBsaXN0ZW5lciE9PXVuZGVmaW5lZCAmJiBsaXN0ZW5lciE9PW51bGwgKTtcblxuXHRcdGlmKCAhdGhpcy4jZXZlbnRzICkge1xuXHRcdFx0dGhpcy4jZXZlbnRzID0gbmV3IEV2ZW50U291cmNlKCB0aGlzICk7XG5cdFx0fVxuXHRcdFxuXHRcdHRoaXMuI2V2ZW50cy5hZGRMaXN0ZW5lciggbmFtZSwgbGlzdGVuZXIgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0ZmlyZTxLIGV4dGVuZHMga2V5b2YgRT4oIG5hbWU6IEssIGV2OiBFW0tdICkge1xuXHRcdGlmKCB0aGlzLiNldmVudHMgKSB7XG5cdFx0XHR0aGlzLiNldmVudHMuZmlyZSggbmFtZSwgZXYgKTtcblx0XHR9XG5cdH1cbn0iLCAiLyoqIFxuICogIF9fXyAgX19fIF9fXG4gKiAgXFwgIFxcLyAgLyAgLyBfXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xuICogICAvICAgIFxcX19fXyAgIF98ICBcbiAqICAvX18vXFxfX1xcICAgfF98XG4gKiBcbiAqIEBmaWxlIGNvcmVfc3R5bGVzLnRzXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcbiAqIFxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiovXG5cbmltcG9ydCB7IHBhc2NhbENhc2UsIGlzU3RyaW5nIH0gZnJvbSAnLi9jb3JlX3Rvb2xzLmpzJztcblxuZXhwb3J0IGNvbnN0IHVuaXRsZXNzOiBSZWNvcmQ8c3RyaW5nLDE+ID0ge1xuXHRhbmltYXRpb25JdGVyYXRpb25Db3VudDogMSxcblx0YXNwZWN0UmF0aW86IDEsXG5cdGJvcmRlckltYWdlT3V0c2V0OiAxLFxuXHRib3JkZXJJbWFnZVNsaWNlOiAxLFxuXHRib3JkZXJJbWFnZVdpZHRoOiAxLFxuXHRib3hGbGV4OiAxLFxuXHRib3hGbGV4R3JvdXA6IDEsXG5cdGJveE9yZGluYWxHcm91cDogMSxcblx0Y29sdW1uQ291bnQ6IDEsXG5cdGNvbHVtbnM6IDEsXG5cdGZsZXg6IDEsXG5cdGZsZXhHcm93OiAxLFxuXHRmbGV4UG9zaXRpdmU6IDEsXG5cdGZsZXhTaHJpbms6IDEsXG5cdGZsZXhOZWdhdGl2ZTogMSxcblx0ZmxleE9yZGVyOiAxLFxuXHRncmlkUm93OiAxLFxuXHRncmlkUm93RW5kOiAxLFxuXHRncmlkUm93U3BhbjogMSxcblx0Z3JpZFJvd1N0YXJ0OiAxLFxuXHRncmlkQ29sdW1uOiAxLFxuXHRncmlkQ29sdW1uRW5kOiAxLFxuXHRncmlkQ29sdW1uU3BhbjogMSxcblx0Z3JpZENvbHVtblN0YXJ0OiAxLFxuXHRtc0dyaWRSb3c6IDEsXG5cdG1zR3JpZFJvd1NwYW46IDEsXG5cdG1zR3JpZENvbHVtbjogMSxcblx0bXNHcmlkQ29sdW1uU3BhbjogMSxcblx0Zm9udFdlaWdodDogMSxcblx0bGluZUhlaWdodDogMSxcblx0b3BhY2l0eTogMSxcblx0b3JkZXI6IDEsXG5cdG9ycGhhbnM6IDEsXG5cdHRhYlNpemU6IDEsXG5cdHdpZG93czogMSxcblx0ekluZGV4OiAxLFxuXHR6b29tOiAxLFxuXHRXZWJraXRMaW5lQ2xhbXA6IDEsXG4gIFxuXHQvLyBTVkctcmVsYXRlZCBwcm9wZXJ0aWVzXG5cdGZpbGxPcGFjaXR5OiAxLFxuXHRmbG9vZE9wYWNpdHk6IDEsXG5cdHN0b3BPcGFjaXR5OiAxLFxuXHRzdHJva2VEYXNoYXJyYXk6IDEsXG5cdHN0cm9rZURhc2hvZmZzZXQ6IDEsXG5cdHN0cm9rZU1pdGVybGltaXQ6IDEsXG5cdHN0cm9rZU9wYWNpdHk6IDEsXG5cdHN0cm9rZVdpZHRoOiAxXG59XG5cbmV4cG9ydCB0eXBlIGFyaWFWYWx1ZXMgPSB7XG5cdFwiYXJpYS1hY3RpdmVkZXNjZW5kYW50XCI6IDEsXG5cdFwicm9sZVwiOiAxLFxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNVbml0TGVzcyggbmFtZTogc3RyaW5nICkge1xuXHRyZXR1cm4gdW5pdGxlc3NbbmFtZV0gPyB0cnVlIDogZmFsc2U7XG59XG5cbi8qKlxuICogXG4gKi9cblxuZXhwb3J0IGNsYXNzIFN0eWxlc2hlZXQge1xuXG5cdHByaXZhdGUgbV9zaGVldDogQ1NTU3R5bGVTaGVldDtcblx0cHJpdmF0ZSBtX3J1bGVzOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcCggKTtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRcblx0XHRmdW5jdGlvbiBnZXRTdHlsZVNoZWV0KCBuYW1lOiBzdHJpbmcgKSA6IENTU1N0eWxlU2hlZXQge1xuXHRcdFx0Zm9yKGxldCBpPTA7IGk8ZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdCAgXHRsZXQgc2hlZXQgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXTtcblx0XHRcdCAgXHRpZihzaGVldC50aXRsZSA9PT0gbmFtZSApIHtcblx0XHRcdFx0XHRyZXR1cm4gPENTU1N0eWxlU2hlZXQ+c2hlZXQ7XG5cdFx0XHQgIFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMubV9zaGVldCA9IGdldFN0eWxlU2hlZXQoICd4NC1keW5hbWljLWNzcycgKTtcblx0XHRpZiggIXRoaXMubV9zaGVldCApIHtcblx0XHRcdGNvbnN0IGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzdHlsZScgKTtcblx0XHRcdGRvbS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3g0LWR5bmFtaWMtY3NzJyApO1xuXHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChkb20pO1xuXHRcdFx0dGhpcy5tX3NoZWV0ID0gPENTU1N0eWxlU2hlZXQ+ZG9tLnNoZWV0XG5cdFx0fVxuXHR9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgYSBuZXcgcnVsZSB0byB0aGUgc3R5bGUgc2hlZXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIGludGVybmFsIHJ1bGUgbmFtZSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGVmaW5pdGlvbiAtIGNzcyBkZWZpbml0aW9uIG9mIHRoZSBydWxlIFxuICAgICAqIEBleGFtcGxlXG4gICAgICogc2V0UnVsZSgneGJvZHknLCBcImJvZHkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwOyB9XCIgKTtcbiAgICAgKi9cblxuXHRwdWJsaWMgc2V0UnVsZShuYW1lOiBzdHJpbmcsIGRlZmluaXRpb246IGFueSApIHtcblxuXHRcdGlmKCBpc1N0cmluZyhkZWZpbml0aW9uKSApIHtcblx0XHRcdGxldCBpbmRleCA9IHRoaXMubV9ydWxlcy5nZXQoIG5hbWUgKTtcblx0XHRcdGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRoaXMubV9zaGVldC5kZWxldGVSdWxlKGluZGV4KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpbmRleCA9IHRoaXMubV9zaGVldC5jc3NSdWxlcy5sZW5ndGg7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubV9ydWxlcy5zZXQoIG5hbWUsIHRoaXMubV9zaGVldC5pbnNlcnRSdWxlKCBkZWZpbml0aW9uLCBpbmRleCkgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRsZXQgaWR4ID0gMTtcblx0XHRcdGZvciggbGV0IHIgaW4gZGVmaW5pdGlvbiApIHtcblxuXHRcdFx0XHRsZXQgcnVsZSA9IHIgKyBcIiB7IFwiLFxuXHRcdFx0XHRcdGNzcyA9IGRlZmluaXRpb25bcl07XG5cblx0XHRcdFx0Zm9yIChsZXQgaSBpbiBjc3MpIHtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRsZXQgdmFsdWVzID0gY3NzW2ldO1x0Ly8gdGhpcyBpcyBhbiBhcnJheSAhXG5cdFx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB2YWx1ZXMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRcdHJ1bGUgKz0gaSArIFwiOiBcIiArIHZhbHVlc1tqXSArIFwiOyBcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJ1bGUgKz0gJ30nO1xuXG5cdFx0XHRcdC8vY29uc29sZS5sb2coIHJ1bGUgKTtcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMuc2V0UnVsZSggbmFtZSsnLS0nK2lkeCwgcnVsZSApO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogcmV0dXJuIHRoZSBzdHlsZSB2YXJpYWJsZSB2YWx1ZVxuXHQgKiBAcGFyYW0gbmFtZSAtIHZhcmlhYmxlIG5hbWUgXG5cdCAqIEBleGFtcGxlXG5cdCAqIGBgYFxuXHQgKiBsZXQgY29sb3IgPSBDb21wb25lbnQuZ2V0Q3NzKCApLmdldFZhciggJ2J1dHRvbi1jb2xvcicgKTtcblx0ICogYGBgXG5cdCAqL1xuXG5cdHB1YmxpYyBzdGF0aWMgZ2V0VmFyKCBuYW1lOiBzdHJpbmcgKSA6IGFueSB7XG5cdFx0aWYoICFTdHlsZXNoZWV0LmRvY19zdHlsZSApIHtcblx0XHRcdFN0eWxlc2hlZXQuZG9jX3N0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSggZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICk7XG5cdFx0fVxuXG5cdFx0aWYoICFuYW1lLnN0YXJ0c1dpdGgoJy0tJykgKSB7XG5cdFx0XHRuYW1lID0gJy0tJytuYW1lO1xuXHRcdH1cblxuICAgIFx0cmV0dXJuIFN0eWxlc2hlZXQuZG9jX3N0eWxlLmdldFByb3BlcnR5VmFsdWUoIG5hbWUgKTsgLy8gIzk5OTk5OVxuXHR9XG5cblx0c3RhdGljIGd1aWQ6IG51bWJlciA9IDE7XG5cdHN0YXRpYyBkb2Nfc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb247XG59XG5cbi8qKlxuICogXG4gKi9cblxuZXhwb3J0IGNsYXNzIENvbXB1dGVkU3R5bGUge1xuXHRtX3N0eWxlOkNTU1N0eWxlRGVjbGFyYXRpb247XG5cblx0Y29uc3RydWN0b3IoIHN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uICkge1xuXHRcdHRoaXMubV9zdHlsZSA9IHN0eWxlO1xuXHR9XG5cblx0LyoqXG5cdCAqIHJldHVybiB0aGUgcmF3IHZhbHVlXG5cdCAqL1xuXG5cdHZhbHVlKCBuYW1lOiBrZXlvZiBDU1NTdHlsZURlY2xhcmF0aW9uICkgOiBhbnkge1xuXHRcdHJldHVybiB0aGlzLm1fc3R5bGVbbmFtZV07XG5cdH1cblxuXHQvKipcblx0ICogcmV0dXJuIHRoZSBpbnRlcnByZXRlZCB2YWx1ZVxuXHQgKi9cblx0XG5cdHBhcnNlKCBuYW1lOiBrZXlvZiBDU1NTdHlsZURlY2xhcmF0aW9uICkgOiBudW1iZXIge1xuXHRcdHJldHVybiBwYXJzZUludCggdGhpcy5tX3N0eWxlW25hbWVdIGFzIGFueSAgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0Z2V0IHN0eWxlKCApIHtcblx0XHRyZXR1cm4gdGhpcy5tX3N0eWxlO1xuXHR9XG59XG5cbiIsICIvKiogXG4gKiAgX19fICBfX18gX19cbiAqICBcXCAgXFwvICAvICAvIF9cbiAqICAgXFwgICAgLyAgL198IHxfXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxuICogIC9fXy9cXF9fXFwgICB8X3xcbiAqIFxuICogQGZpbGUgY29yZV9kb20udHNcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxuICogXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqKi9cblxuLyoqIEBpZ25vcmUgdGhpcyBldmVudHMgbXVzdCBiZSBkZWZpbmVkIG9uIGRvbU5vZGUgKGRvIG5vdCBidWJibGUpICovXG5leHBvcnQgY29uc3QgdW5idWJibGVFdmVudHMgPSB7XG5cdG1vdXNlbGVhdmU6IDEsIG1vdXNlZW50ZXI6IDEsIGxvYWQ6IDEsIHVubG9hZDogMSwgc2Nyb2xsOiAxLCBmb2N1czogMSwgYmx1cjogMSwgcm93ZXhpdDogMSwgYmVmb3JldW5sb2FkOiAxLCBzdG9wOiAxLFxuXHRkcmFnZHJvcDogMSwgZHJhZ2VudGVyOiAxLCBkcmFnZXhpdDogMSwgZHJhZ2dlc3R1cmU6IDEsIGRyYWdvdmVyOiAxLCBjb250ZXh0bWVudTogMSwgY3JlYXRlZDogMiwgcmVtb3ZlZDogMiwgc2l6ZWNoYW5nZTogMlxufTtcblxuZXhwb3J0IHR5cGUgRE9NRXZlbnRIYW5kbGVyID0gKCBldjogRXZlbnQgKSA9PiB2b2lkO1xudHlwZSBFdmVudEVudHJ5ID0gUmVjb3JkPHN0cmluZyxET01FdmVudEhhbmRsZXIgfCBET01FdmVudEhhbmRsZXJbXT47XG5cbmNvbnN0IGV2ZW50X2hhbmRsZXJzID0gbmV3IFdlYWtNYXA8Tm9kZSxFdmVudEVudHJ5PiggKTtcblxuLyoqXG4gKiBoYW5kbGUgZG9tIG11dGF0aW9uc1xuICovXG5cbmxldCBtdXRPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciA9IG51bGw7XG5cbmNvbnN0IG9ic2VydmVNdXRhdGlvbiA9IChtdXRhdGlvbnM6IE11dGF0aW9uUmVjb3JkW10sIG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyKTogdm9pZCA9PiB7XG5cblx0Y29uc3Qgc2VuZEV2ZW50ID0gKCBub2RlOiBOb2RlLCBjb2RlOiBcImNyZWF0ZWRcIiB8IFwicmVtb3ZlZFwiICkgPT4ge1xuLy9cdFx0Y29uc29sZS5sb2coIFwibm90aWZ5XCIsIG5vZGUsIGNvZGUgKTtcblx0XHRcdFxuXHRcdGNvbnN0IHN0b3JlID0gZXZlbnRfaGFuZGxlcnMuZ2V0KCBub2RlICk7XG5cdFx0aWYgKCBzdG9yZSAmJiBzdG9yZVtjb2RlXSApIHtcblx0XHRcdG5vZGUuZGlzcGF0Y2hFdmVudCggbmV3IEV2ZW50KCBjb2RlLCB7fSApICk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3Qgbm90aWZ5ID0gKCBub2RlOiBOb2RlLCBjcmVhdGU6IGJvb2xlYW4gKSA9PiB7XG5cblx0XHRpZiggY3JlYXRlICkge1xuXHRcdFx0c2VuZEV2ZW50KCBub2RlLCBcImNyZWF0ZWRcIiApO1xuXHRcdH1cblxuXHRcdGZvciggbGV0IGM9bm9kZS5maXJzdENoaWxkOyBjOyBjPWMubmV4dFNpYmxpbmcgKSB7XG5cdFx0XHRub3RpZnkoIGMsIGNyZWF0ZSApO1xuXHRcdH1cblxuXHRcdGlmKCAhY3JlYXRlICkge1xuXHRcdFx0c2VuZEV2ZW50KCBub2RlLCBcInJlbW92ZWRcIiApO1xuXHRcdH1cblx0fVxuXG5cdFxuXHRmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucykgIHtcblx0XHRpZiggbXV0YXRpb24udHlwZT09XCJjaGlsZExpc3RcIiApIHtcblx0XHRcdGlmKCBtdXRhdGlvbi5hZGRlZE5vZGVzICkge1xuXHRcdFx0XHRtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goIG5vZGUgPT4ge1xuXHRcdFx0XHRcdG5vdGlmeSggbm9kZSwgdHJ1ZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmKCBtdXRhdGlvbi5yZW1vdmVkTm9kZXMgKSB7XG5cdFx0XHRcdG11dGF0aW9uLnJlbW92ZWROb2Rlcy5mb3JFYWNoKCBub2RlID0+IHtcblx0XHRcdFx0XHRub3RpZnkoIG5vZGUsIGZhbHNlICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuXG5cbi8qKlxuICogXG4gKi9cblxubGV0IHNpemVPYnNlcnZlcjogUmVzaXplT2JzZXJ2ZXIgPSBudWxsO1xuXG5mdW5jdGlvbiBvYnNlcnZlU2l6ZShlbnRyaWVzOiBSZXNpemVPYnNlcnZlckVudHJ5W10pIHtcblx0ZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuXHRcdGxldCBkb20gPSBlbnRyeS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0aWYgKGRvbS5vZmZzZXRQYXJlbnQgIT09IG51bGwpIHtcblx0XHRcdGRvbS5kaXNwYXRjaEV2ZW50KCBuZXcgRXZlbnQoJ3Jlc2l6ZWQnKSApO1xuXHRcdH1cblx0fSk7XG59XG5cbi8qKlxuICogXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQoZXY6IEV2ZW50KSB7XG5cblx0bGV0IHRhcmdldCA9IGV2LnRhcmdldCBhcyBOb2RlLFxuXHRcdG5vdXAgPSAodW5idWJibGVFdmVudHMgYXMgYW55KVtldi50eXBlXSA9PT0gMjtcblxuXHR3aGlsZSAodGFyZ2V0KSB7XG5cdFx0Y29uc3Qgc3RvcmUgPSBldmVudF9oYW5kbGVycy5nZXQoIHRhcmdldCApO1xuXHRcdGlmICggc3RvcmUgKSB7XG5cdFx0XHRjb25zdCBjYWxsYmFjayA9IHN0b3JlW2V2LnR5cGVdO1xuXHRcdFx0aWYoIGNhbGxiYWNrICkge1xuXHRcdFx0XHRpZiggQXJyYXkuaXNBcnJheShjYWxsYmFjaykgKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2suc29tZSggYyA9PiBjKCBldiApICk7XG5cdFx0XHRcdH1cdFxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjYWxsYmFjayggZXYgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChldi5zdG9wUHJvcGFnYXRpb24gfHwgZXYuZGVmYXVsdFByZXZlbnRlZCB8fCBub3VwKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcblxuXHRcdC8vIG5vIG5lZWQgdG8gZ28gYWJvdmVcblx0XHRpZiAodGFyZ2V0ID09IGRvY3VtZW50KSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkRXZlbnQoIG5vZGU6IE5vZGUsIG5hbWU6IHN0cmluZywgaGFuZGxlcjogRE9NRXZlbnRIYW5kbGVyLCBwcmVwZW5kID0gZmFsc2UgKSB7XG5cblx0aWYoIG5hbWU9PVwicmVtb3ZlZFwiIHx8IG5hbWU9PVwiY3JlYXRlZFwiICkge1xuXHRcdGlmKCAhbXV0T2JzZXJ2ZXIgKSB7XG5cdFx0XHRtdXRPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCBvYnNlcnZlTXV0YXRpb24gKVxuXHRcdFx0bXV0T2JzZXJ2ZXIub2JzZXJ2ZSggZG9jdW1lbnQuYm9keSwge2NoaWxkTGlzdDogdHJ1ZSxzdWJ0cmVlOiB0cnVlfSApO1xuXHRcdH1cblx0fVxuXHRlbHNlIGlmKCBuYW1lPT1cInJlc2l6ZWRcIiApIHtcblx0XHRpZiAoIXNpemVPYnNlcnZlcikge1xuXHRcdFx0c2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKCBvYnNlcnZlU2l6ZSApO1xuXHRcdH1cblx0XHRcblx0XHRzaXplT2JzZXJ2ZXIub2JzZXJ2ZSggbm9kZSBhcyBFbGVtZW50ICk7XG5cdH1cblxuXG5cdGxldCBzdG9yZSA9IGV2ZW50X2hhbmRsZXJzLmdldCggbm9kZSApO1xuXHRpZiggIXN0b3JlICkge1xuXHRcdHN0b3JlID0ge31cblx0XHRldmVudF9oYW5kbGVycy5zZXQoIG5vZGUsIHN0b3JlICk7XG5cdH1cblxuXHRpZiggIXN0b3JlW25hbWVdICkge1xuXHRcdHN0b3JlW25hbWVdID0gaGFuZGxlcjtcblx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoIG5hbWUsIGRpc3BhdGNoRXZlbnQgKTtcblx0fVxuXHRlbHNlIHtcblx0XHRjb25zdCBlbnRyeSA9IHN0b3JlW25hbWVdO1xuXHRcdGlmKCBBcnJheS5pc0FycmF5KGVudHJ5KSApIHtcblx0XHRcdGVudHJ5LnB1c2goIGhhbmRsZXIgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRzdG9yZVtuYW1lXSA9IFtlbnRyeSxoYW5kbGVyXTtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIEdsb2JhbERPTUV2ZW50cyB7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIHVzZXIgYWJvcnRzIHRoZSBkb3dubG9hZC5cblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cblx0ICovXG5cblx0YWJvcnQ/OiAoZXY6IFVJRXZlbnQpID0+IGFueTtcblx0YW5pbWF0aW9uY2FuY2VsPzogKGV2OiBBbmltYXRpb25FdmVudCkgPT4gYW55O1xuXHRhbmltYXRpb25lbmQ/OiAoZXY6IEFuaW1hdGlvbkV2ZW50KSA9PiBhbnk7XG5cdGFuaW1hdGlvbml0ZXJhdGlvbj86IChldjogQW5pbWF0aW9uRXZlbnQpID0+IGFueTtcblx0YW5pbWF0aW9uc3RhcnQ/OiAoZXY6IEFuaW1hdGlvbkV2ZW50KSA9PiBhbnk7XG5cdGF1eGNsaWNrPzogKGV2OiBNb3VzZUV2ZW50KSA9PiBhbnk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIG9iamVjdCBsb3NlcyB0aGUgaW5wdXQgZm9jdXMuXG5cdCAqIEBwYXJhbSBldiBUaGUgZm9jdXMgZXZlbnQuXG5cdCAqL1xuXHRibHVyPzogKGV2OiBGb2N1c0V2ZW50KSA9PiBhbnk7XG5cdGNhbmNlbD86IChldjogRXZlbnQpID0+IGFueTtcblxuXHQvKipcblx0ICogT2NjdXJzIHdoZW4gcGxheWJhY2sgaXMgcG9zc2libGUsIGJ1dCB3b3VsZCByZXF1aXJlIGZ1cnRoZXIgYnVmZmVyaW5nLlxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxuXHQgKi9cblx0Y2FucGxheT86IChldjogRXZlbnQpID0+IGFueTtcblx0Y2FucGxheXRocm91Z2g/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBjb250ZW50cyBvZiB0aGUgb2JqZWN0IG9yIHNlbGVjdGlvbiBoYXZlIGNoYW5nZWQuXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHRjaGFuZ2U/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgbGVmdCBtb3VzZSBidXR0b24gb24gdGhlIG9iamVjdFxuXHQgKiBAcGFyYW0gZXYgVGhlIG1vdXNlIGV2ZW50LlxuXHQgKi9cblx0Y2xpY2s/OiAoZXY6IE1vdXNlRXZlbnQpID0+IGFueTtcblx0Y2xvc2U/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgcmlnaHQgbW91c2UgYnV0dG9uIGluIHRoZSBjbGllbnQgYXJlYSwgb3BlbmluZyB0aGUgY29udGV4dCBtZW51LlxuXHQgKiBAcGFyYW0gZXYgVGhlIG1vdXNlIGV2ZW50LlxuXHQgKi9cblx0Y29udGV4dG1lbnU/OiAoZXY6IE1vdXNlRXZlbnQpID0+IGFueTtcblx0Y3VlY2hhbmdlPzogKGV2OiBFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgdXNlciBkb3VibGUtY2xpY2tzIHRoZSBvYmplY3QuXG5cdCAqIEBwYXJhbSBldiBUaGUgbW91c2UgZXZlbnQuXG5cdCAqL1xuXHRkYmxjbGljaz86IChldjogTW91c2VFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogRmlyZXMgb24gdGhlIHNvdXJjZSBvYmplY3QgY29udGludW91c2x5IGR1cmluZyBhIGRyYWcgb3BlcmF0aW9uLlxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxuXHQgKi9cblx0ZHJhZz86IChldjogRHJhZ0V2ZW50KSA9PiBhbnk7XG5cdC8qKlxuXHQgKiBGaXJlcyBvbiB0aGUgc291cmNlIG9iamVjdCB3aGVuIHRoZSB1c2VyIHJlbGVhc2VzIHRoZSBtb3VzZSBhdCB0aGUgY2xvc2Ugb2YgYSBkcmFnIG9wZXJhdGlvbi5cblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cblx0ICovXG5cdGRyYWdlbmQ/OiAoZXY6IERyYWdFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogRmlyZXMgb24gdGhlIHRhcmdldCBlbGVtZW50IHdoZW4gdGhlIHVzZXIgZHJhZ3MgdGhlIG9iamVjdCB0byBhIHZhbGlkIGRyb3AgdGFyZ2V0LlxuXHQgKiBAcGFyYW0gZXYgVGhlIGRyYWcgZXZlbnQuXG5cdCAqL1xuXHRkcmFnZW50ZXI/OiAoZXY6IERyYWdFdmVudCkgPT4gYW55O1xuXHRkcmFnZXhpdD86IChldjogRXZlbnQpID0+IGFueTtcblx0LyoqXG5cdCAqIEZpcmVzIG9uIHRoZSB0YXJnZXQgb2JqZWN0IHdoZW4gdGhlIHVzZXIgbW92ZXMgdGhlIG1vdXNlIG91dCBvZiBhIHZhbGlkIGRyb3AgdGFyZ2V0IGR1cmluZyBhIGRyYWcgb3BlcmF0aW9uLlxuXHQgKiBAcGFyYW0gZXYgVGhlIGRyYWcgZXZlbnQuXG5cdCAqL1xuXHRkcmFnbGVhdmU/OiAoZXY6IERyYWdFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogRmlyZXMgb24gdGhlIHRhcmdldCBlbGVtZW50IGNvbnRpbnVvdXNseSB3aGlsZSB0aGUgdXNlciBkcmFncyB0aGUgb2JqZWN0IG92ZXIgYSB2YWxpZCBkcm9wIHRhcmdldC5cblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cblx0ICovXG5cdGRyYWdvdmVyPzogKGV2OiBEcmFnRXZlbnQpID0+IGFueTtcblx0LyoqXG5cdCAqIEZpcmVzIG9uIHRoZSBzb3VyY2Ugb2JqZWN0IHdoZW4gdGhlIHVzZXIgc3RhcnRzIHRvIGRyYWcgYSB0ZXh0IHNlbGVjdGlvbiBvciBzZWxlY3RlZCBvYmplY3QuXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHRkcmFnc3RhcnQ/OiAoZXY6IERyYWdFdmVudCkgPT4gYW55O1xuXHRkcm9wPzogKGV2OiBEcmFnRXZlbnQpID0+IGFueTtcblx0LyoqXG5cdCAqIE9jY3VycyB3aGVuIHRoZSBkdXJhdGlvbiBhdHRyaWJ1dGUgaXMgdXBkYXRlZC5cblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cblx0ICovXG5cdGR1cmF0aW9uY2hhbmdlPzogKGV2OiBFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogT2NjdXJzIHdoZW4gdGhlIG1lZGlhIGVsZW1lbnQgaXMgcmVzZXQgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHRlbXB0aWVkPzogKGV2OiBFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogT2NjdXJzIHdoZW4gdGhlIGVuZCBvZiBwbGF5YmFjayBpcyByZWFjaGVkLlxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50XG5cdCAqL1xuXHRlbmRlZD86IChldjogRXZlbnQpID0+IGFueTtcblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gYW4gZXJyb3Igb2NjdXJzIGR1cmluZyBvYmplY3QgbG9hZGluZy5cblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cblx0ICovXG5cdGVycm9yPzogT25FcnJvckV2ZW50SGFuZGxlcjtcblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIG9iamVjdCByZWNlaXZlcyBmb2N1cy5cblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cblx0ICovXG5cdGZvY3VzaW4/OiAoZXY6IEZvY3VzRXZlbnQpID0+IGFueTtcblx0Zm9jdXNvdXQ/OiAoZXY6IEZvY3VzRXZlbnQpID0+IGFueTtcblx0Zm9jdXM/OiAoZXY6IEZvY3VzRXZlbnQpID0+IGFueTtcblx0Z290cG9pbnRlcmNhcHR1cmU/OiAoZXY6IFBvaW50ZXJFdmVudCkgPT4gYW55O1xuXHRpbnB1dD86IChldjogRXZlbnQpID0+IGFueTtcblx0aW52YWxpZD86IChldjogRXZlbnQpID0+IGFueTtcblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIHVzZXIgcHJlc3NlcyBhIGtleS5cblx0ICogQHBhcmFtIGV2IFRoZSBrZXlib2FyZCBldmVudFxuXHQgKi9cblx0a2V5ZG93bj86IChldjogS2V5Ym9hcmRFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgdXNlciBwcmVzc2VzIGFuIGFscGhhbnVtZXJpYyBrZXkuXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHRrZXlwcmVzcz86IChldjogS2V5Ym9hcmRFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgdXNlciByZWxlYXNlcyBhIGtleS5cblx0ICogQHBhcmFtIGV2IFRoZSBrZXlib2FyZCBldmVudFxuXHQgKi9cblx0a2V5dXA/OiAoZXY6IEtleWJvYXJkRXZlbnQpID0+IGFueTtcblx0LyoqXG5cdCAqIEZpcmVzIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBicm93c2VyIGxvYWRzIHRoZSBvYmplY3QuXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHRsb2FkPzogKGV2OiBFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogT2NjdXJzIHdoZW4gbWVkaWEgZGF0YSBpcyBsb2FkZWQgYXQgdGhlIGN1cnJlbnQgcGxheWJhY2sgcG9zaXRpb24uXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHRsb2FkZWRkYXRhPzogKGV2OiBFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogT2NjdXJzIHdoZW4gdGhlIGR1cmF0aW9uIGFuZCBkaW1lbnNpb25zIG9mIHRoZSBtZWRpYSBoYXZlIGJlZW4gZGV0ZXJtaW5lZC5cblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cblx0ICovXG5cdGxvYWRlZG1ldGFkYXRhPzogKGV2OiBFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogT2NjdXJzIHdoZW4gSW50ZXJuZXQgRXhwbG9yZXIgYmVnaW5zIGxvb2tpbmcgZm9yIG1lZGlhIGRhdGEuXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHRsb2Fkc3RhcnQ/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XG5cdGxvc3Rwb2ludGVyY2FwdHVyZT86IChldjogUG9pbnRlckV2ZW50KSA9PiBhbnk7XG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgb2JqZWN0IHdpdGggZWl0aGVyIG1vdXNlIGJ1dHRvbi5cblx0ICogQHBhcmFtIGV2IFRoZSBtb3VzZSBldmVudC5cblx0ICovXG5cdG1vdXNlZG93bj86IChldjogTW91c2VFdmVudCkgPT4gYW55O1xuXHRtb3VzZWVudGVyPzogKGV2OiBNb3VzZUV2ZW50KSA9PiBhbnk7XG5cdG1vdXNlbGVhdmU/OiAoZXY6IE1vdXNlRXZlbnQpID0+IGFueTtcblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIHVzZXIgbW92ZXMgdGhlIG1vdXNlIG92ZXIgdGhlIG9iamVjdC5cblx0ICogQHBhcmFtIGV2IFRoZSBtb3VzZSBldmVudC5cblx0ICovXG5cdG1vdXNlbW92ZT86IChldjogTW91c2VFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgdXNlciBtb3ZlcyB0aGUgbW91c2UgcG9pbnRlciBvdXRzaWRlIHRoZSBib3VuZGFyaWVzIG9mIHRoZSBvYmplY3QuXG5cdCAqIEBwYXJhbSBldiBUaGUgbW91c2UgZXZlbnQuXG5cdCAqL1xuXHRtb3VzZW91dD86IChldjogTW91c2VFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgdXNlciBtb3ZlcyB0aGUgbW91c2UgcG9pbnRlciBpbnRvIHRoZSBvYmplY3QuXG5cdCAqIEBwYXJhbSBldiBUaGUgbW91c2UgZXZlbnQuXG5cdCAqL1xuXHRtb3VzZW92ZXI/OiAoZXY6IE1vdXNlRXZlbnQpID0+IGFueTtcblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIHVzZXIgcmVsZWFzZXMgYSBtb3VzZSBidXR0b24gd2hpbGUgdGhlIG1vdXNlIGlzIG92ZXIgdGhlIG9iamVjdC5cblx0ICogQHBhcmFtIGV2IFRoZSBtb3VzZSBldmVudC5cblx0ICovXG5cdG1vdXNldXA/OiAoZXY6IE1vdXNlRXZlbnQpID0+IGFueTtcblx0LyoqXG5cdCAqIE9jY3VycyB3aGVuIHBsYXliYWNrIGlzIHBhdXNlZC5cblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cblx0ICovXG5cdHBhdXNlPzogKGV2OiBFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogT2NjdXJzIHdoZW4gdGhlIHBsYXkgbWV0aG9kIGlzIHJlcXVlc3RlZC5cblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cblx0ICovXG5cdHBsYXk/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XG5cdC8qKlxuXHQgKiBPY2N1cnMgd2hlbiB0aGUgYXVkaW8gb3IgdmlkZW8gaGFzIHN0YXJ0ZWQgcGxheWluZy5cblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cblx0ICovXG5cdHBsYXlpbmc/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XG5cdHBvaW50ZXJjYW5jZWw/OiAoZXY6IFBvaW50ZXJFdmVudCkgPT4gYW55O1xuXHRwb2ludGVyZG93bj86IChldjogUG9pbnRlckV2ZW50KSA9PiBhbnk7XG5cdHBvaW50ZXJlbnRlcj86IChldjogUG9pbnRlckV2ZW50KSA9PiBhbnk7XG5cdHBvaW50ZXJsZWF2ZT86IChldjogUG9pbnRlckV2ZW50KSA9PiBhbnk7XG5cdHBvaW50ZXJtb3ZlPzogKGV2OiBQb2ludGVyRXZlbnQpID0+IGFueTtcblx0cG9pbnRlcm91dD86IChldjogUG9pbnRlckV2ZW50KSA9PiBhbnk7XG5cdHBvaW50ZXJvdmVyPzogKGV2OiBQb2ludGVyRXZlbnQpID0+IGFueTtcblx0cG9pbnRlcnVwPzogKGV2OiBQb2ludGVyRXZlbnQpID0+IGFueTtcblx0LyoqXG5cdCAqIE9jY3VycyB0byBpbmRpY2F0ZSBwcm9ncmVzcyB3aGlsZSBkb3dubG9hZGluZyBtZWRpYSBkYXRhLlxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxuXHQgKi9cblx0cHJvZ3Jlc3M/OiAoZXY6IFByb2dyZXNzRXZlbnQpID0+IGFueTtcblx0LyoqXG5cdCAqIE9jY3VycyB3aGVuIHRoZSBwbGF5YmFjayByYXRlIGlzIGluY3JlYXNlZCBvciBkZWNyZWFzZWQuXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHRyYXRlY2hhbmdlPzogKGV2OiBFdmVudCkgPT4gYW55O1xuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgdXNlciByZXNldHMgYSBmb3JtLlxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxuXHQgKi9cblx0cmVzZXQ/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XG5cdC8vcmVzaXplPzogKGV2OiBVSUV2ZW50KSA9PiBhbnk7XHRyZW1vdmUgdG8gYXZvaWQgZXJyb3JzIHdpdGggc2l6ZWNoYW5nZSBldmVudFxuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSB1c2VyIHJlcG9zaXRpb25zIHRoZSBzY3JvbGwgYm94IGluIHRoZSBzY3JvbGwgYmFyIG9uIHRoZSBvYmplY3QuXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHRzY3JvbGw/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XG5cdHNlY3VyaXR5cG9saWN5dmlvbGF0aW9uPzogKGV2OiBTZWN1cml0eVBvbGljeVZpb2xhdGlvbkV2ZW50KSA9PiBhbnk7XG5cdC8qKlxuXHQgKiBPY2N1cnMgd2hlbiB0aGUgc2VlayBvcGVyYXRpb24gZW5kcy5cblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cblx0ICovXG5cdHNlZWtlZD86IChldjogRXZlbnQpID0+IGFueTtcblx0LyoqXG5cdCAqIE9jY3VycyB3aGVuIHRoZSBjdXJyZW50IHBsYXliYWNrIHBvc2l0aW9uIGlzIG1vdmVkLlxuXHQgKiBAcGFyYW0gZXYgVGhlIGV2ZW50LlxuXHQgKi9cblx0c2Vla2luZz86IChldjogRXZlbnQpID0+IGFueTtcblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGNoYW5nZXMuXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHRzZWxlY3Q/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XG5cdHNlbGVjdGlvbmNoYW5nZT86IChldjogRXZlbnQpID0+IGFueTtcblx0c2VsZWN0c3RhcnQ/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XG5cdC8qKlxuXHQgKiBPY2N1cnMgd2hlbiB0aGUgZG93bmxvYWQgaGFzIHN0b3BwZWQuXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHRzdGFsbGVkPzogKGV2OiBFdmVudCkgPT4gYW55O1xuXHRzdWJtaXQ/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XG5cblx0LyoqXG5cdCAqIE9jY3VycyBpZiB0aGUgbG9hZCBvcGVyYXRpb24gaGFzIGJlZW4gaW50ZW50aW9uYWxseSBoYWx0ZWQuXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHRzdXNwZW5kPzogKGV2OiBFdmVudCkgPT4gYW55O1xuXG5cdC8qKlxuXHQgKiBPY2N1cnMgdG8gaW5kaWNhdGUgdGhlIGN1cnJlbnQgcGxheWJhY2sgcG9zaXRpb24uXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHR0aW1ldXBkYXRlPzogKGV2OiBFdmVudCkgPT4gYW55O1xuXHR0b2dnbGU/OiAoZXY6IEV2ZW50KSA9PiBhbnk7XG5cdHRvdWNoY2FuY2VsPzogKGV2OiBUb3VjaEV2ZW50KSA9PiBhbnk7XG5cdHRvdWNoZW5kPzogKGV2OiBUb3VjaEV2ZW50KSA9PiBhbnk7XG5cdHRvdWNobW92ZT86IChldjogVG91Y2hFdmVudCkgPT4gYW55O1xuXHR0b3VjaHN0YXJ0PzogKGV2OiBUb3VjaEV2ZW50KSA9PiBhbnk7XG5cdHRyYW5zaXRpb25jYW5jZWw/OiAoZXY6IFRyYW5zaXRpb25FdmVudCkgPT4gYW55O1xuXHR0cmFuc2l0aW9uZW5kPzogKGV2OiBUcmFuc2l0aW9uRXZlbnQpID0+IGFueTtcblx0dHJhbnNpdGlvbnJ1bj86IChldjogVHJhbnNpdGlvbkV2ZW50KSA9PiBhbnk7XG5cdHRyYW5zaXRpb25zdGFydD86IChldjogVHJhbnNpdGlvbkV2ZW50KSA9PiBhbnk7XG5cblx0LyoqXG5cdCAqIE9jY3VycyB3aGVuIHRoZSB2b2x1bWUgaXMgY2hhbmdlZCwgb3IgcGxheWJhY2sgaXMgbXV0ZWQgb3IgdW5tdXRlZC5cblx0ICogQHBhcmFtIGV2IFRoZSBldmVudC5cblx0ICovXG5cdHZvbHVtZWNoYW5nZT86IChldjogRXZlbnQpID0+IGFueTtcblxuXHQvKipcblx0ICogT2NjdXJzIHdoZW4gcGxheWJhY2sgc3RvcHMgYmVjYXVzZSB0aGUgbmV4dCBmcmFtZSBvZiBhIHZpZGVvIHJlc291cmNlIGlzIG5vdCBhdmFpbGFibGUuXG5cdCAqIEBwYXJhbSBldiBUaGUgZXZlbnQuXG5cdCAqL1xuXHR3YWl0aW5nPzogKGV2OiBFdmVudCkgPT4gYW55O1xuXHR3aGVlbD86IChldjogV2hlZWxFdmVudCkgPT4gYW55O1xuXG5cdC8qKlxuXHQgKiBjdXN0b20geDQgZXZlbnRzXG5cdCAqL1xuXG5cdHJlc2l6ZWQ/OiAoZXY6IEV2ZW50KSA9PiB2b2lkO1x0XHRcdC8vIG9jY3VycyB3aGVuIHNpemUgY2hhbmdlZFxuXHRjcmVhdGVkPzogKCBldjogRXZlbnQgKSA9PiB2b2lkO1x0XHQvLyBvY2N1cnMgd2hlbiBpbnNlcnRlZCBpbiB0aGUgZG9tXG5cdHJlbW92ZWQ/OiAoIGV2OiBFdmVudCApID0+IHZvaWQ7XHRcdC8vIG9jY3VycyB3aGVuIHJlbW92ZWQgZnJvbSBkb21cbn1cblxuXG5cblxuXG5cblxuXG5cbiIsICIvKiogXG4gKiAgX19fICBfX18gX19cbiAqICBcXCAgXFwvICAvICAvIF9cbiAqICAgXFwgICAgLyAgL198IHxfXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxuICogIC9fXy9cXF9fXFwgICB8X3xcbiAqIFxuICogQGZpbGUgY29tcG9uZW50LnRzXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcbiAqIFxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiovXG5cbmltcG9ydCB7IGlzQXJyYXksIFVuc2FmZUh0bWwsIGlzTnVtYmVyLCBSZWN0LCBDb25zdHJ1Y3RvciB9IGZyb20gJy4vY29yZV90b29scyc7XG5pbXBvcnQgeyBDb3JlRWxlbWVudCB9IGZyb20gJy4vY29yZV9lbGVtZW50JztcbmltcG9ydCB7IGFyaWFWYWx1ZXMsIHVuaXRsZXNzIH0gZnJvbSAnLi9jb3JlX3N0eWxlcyc7XG5pbXBvcnQgeyBDb3JlRXZlbnQsIEV2ZW50TWFwIH0gZnJvbSAnLi9jb3JlX2V2ZW50cyc7XG5pbXBvcnQgeyBhZGRFdmVudCwgRE9NRXZlbnRIYW5kbGVyLCBHbG9iYWxET01FdmVudHMgfSBmcm9tICcuL2NvcmVfZG9tJztcblxuaW50ZXJmYWNlIFJlZlR5cGU8VCBleHRlbmRzIENvbXBvbmVudD4ge1xuXHRkb206IFQ7XG59XG5cbnR5cGUgQ29tcG9uZW50QXR0cmlidXRlcyA9IFJlY29yZDxzdHJpbmcsc3RyaW5nfG51bWJlcnxib29sZWFuPjtcblxuY29uc3QgRlJBR01FTlQgPSBTeW1ib2woIFwiZnJhZ21lbnRcIiApO1xuY29uc3QgQ09NUE9ORU5UID0gU3ltYm9sKCBcImNvbXBvbmVudFwiICk7XG5cbmNvbnN0IFJFX05VTUJFUiA9IC9eLT9cXGQrKFxcLlxcZCopPyQvO1xuXG4vKipcbiAqIFxuICovXG5cbmZ1bmN0aW9uIGdlbkNsYXNzTmFtZXMoIHg6IGFueSApIHtcblx0XG5cdGxldCBjbGFzc2VzID0gW107XG5cdGxldCBzZWxmID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHgpO1xuXG5cdHdoaWxlIChzZWxmICYmIHNlbGYuY29uc3RydWN0b3IgIT09IENvbXBvbmVudCApIHtcblx0XHRsZXQgY2xzbmFtZTpzdHJpbmcgPSBzZWxmLmNvbnN0cnVjdG9yLm5hbWU7XG5cdFx0Y2xhc3Nlcy5wdXNoKCAneDQnK2Nsc25hbWUudG9Mb3dlckNhc2UoKSApO1xuXHRcdHNlbGYgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc2VsZik7XG5cdH1cblxuXHRyZXR1cm4gY2xhc3Nlcztcbn1cblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgdHlwZSBDb21wb25lbnRDb250ZW50ID0gQ29tcG9uZW50IHwgc3RyaW5nIHwgVW5zYWZlSHRtbCB8IG51bWJlciB8IGJvb2xlYW4gfCBDb21wb25lbnRbXTtcblxubGV0IGdlbl9pZCA9IDEwMDA7XG5cbmV4cG9ydCBjb25zdCBtYWtlVW5pcXVlQ29tcG9uZW50SWQgPSAoICkgPT4ge1xuXHRyZXR1cm4gYHg0LSR7Z2VuX2lkKyt9YDtcbn1cblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudFByb3BzIHtcblx0dGFnPzogc3RyaW5nO1xuXHRucz86IHN0cmluZztcblxuXHRzdHlsZT86IFBhcnRpYWw8Q1NTU3R5bGVEZWNsYXJhdGlvbj47XG5cdGF0dHJzPzogUmVjb3JkPHN0cmluZyxzdHJpbmd8bnVtYmVyfGJvb2xlYW4+O1xuXHRjb250ZW50PzogQ29tcG9uZW50Q29udGVudDtcblx0ZG9tX2V2ZW50cz86IEdsb2JhbERPTUV2ZW50cztcblx0Y2xzPzogc3RyaW5nO1xuXHRpZD86IHN0cmluZztcblx0cmVmPzogUmVmVHlwZTxhbnk+O1xuXG5cdC8vIHNob3J0Y3V0c1xuXHR3aWR0aD86IHN0cmluZyB8IG51bWJlcjtcblx0aGVpZ2h0Pzogc3RyaW5nIHwgbnVtYmVyO1xuXHRkaXNhYmxlZD86IHRydWUsXG5cdGhpZGRlbj86IHRydWUsXG5cblx0dG9vbHRpcD86IHN0cmluZztcblxuICAgIC8vIHdyYXBwZXJcblx0ZXhpc3RpbmdET00/OiBIVE1MRWxlbWVudDtcblxuXHQvLyAgaW5kZXggc2lnbmF0dXJlIFxuXHQvL1x0dG8gYXZvaWQgZXJyb3JzOiBUeXBlICdYJyBoYXMgbm8gcHJvcGVydGllcyBpbiBjb21tb24gd2l0aCB0eXBlICdZJyBcblx0Ly9cdGJlY2F1c2UgYWxsIG1lbWViZXJzIGhlcmUgYXJlIG9wdGlvbmFsLlxuXHQvL1x0dGhpcyBhbGxvdyBUUyB0byByZWNvbmduaXplIGRlcml2ZWQgcHJvcHMgYXMgQ29tcG9uZW50UHJvcHNcblx0Ly9ba2V5OiBzdHJpbmddOiBhbnk7IFxufTtcblxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50RXZlbnQgZXh0ZW5kcyBDb3JlRXZlbnQge1xufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50RXZlbnRzIGV4dGVuZHMgRXZlbnRNYXAge1xufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnQ8UCBleHRlbmRzIENvbXBvbmVudFByb3BzID0gQ29tcG9uZW50UHJvcHMsIEUgZXh0ZW5kcyBDb21wb25lbnRFdmVudHMgPSBDb21wb25lbnRFdmVudHM+IFxuXHRcdGV4dGVuZHMgQ29yZUVsZW1lbnQ8RT4ge1xuXG5cdHJlYWRvbmx5IGRvbTogRWxlbWVudDtcblx0cmVhZG9ubHkgcHJvcHM6IFA7XG5cdHByaXZhdGUgc3RvcmU6IE1hcDxzdHJpbmd8U3ltYm9sLGFueT47XG5cblx0Y29uc3RydWN0b3IoIHByb3BzOiBQICkge1xuXHRcdHN1cGVyKCApO1xuXG5cdFx0dGhpcy5wcm9wcyA9IHByb3BzO1x0Ly8gY29weSA/XG5cblx0XHRpZiggcHJvcHMuZXhpc3RpbmdET00gKSB7XG5cdFx0XHR0aGlzLmRvbSA9IHByb3BzLmV4aXN0aW5nRE9NO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmKCBwcm9wcy5ucyApIHtcblx0XHRcdFx0dGhpcy5kb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoIHByb3BzLm5zLCBwcm9wcy50YWcgPz8gXCJkaXZcIiApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRoaXMuZG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggcHJvcHMudGFnID8/IFwiZGl2XCIgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHByb3BzLmF0dHJzKSB7XG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlcyggcHJvcHMuYXR0cnMgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoIHByb3BzLmNscyApIHtcblx0XHRcdFx0dGhpcy5hZGRDbGFzcyggcHJvcHMuY2xzICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCBwcm9wcy5oaWRkZW4gKSB7XG5cdFx0XHRcdHRoaXMuc2hvdyggZmFsc2UgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoIHByb3BzLmlkIT09dW5kZWZpbmVkICkge1xuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJpZFwiLCBwcm9wcy5pZCApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBzbWFsbCBzaG9ydGN1dFxuXHRcdFx0aWYoIHByb3BzLndpZHRoIT09dW5kZWZpbmVkICkge1xuXHRcdFx0XHR0aGlzLnNldFN0eWxlVmFsdWUoIFwid2lkdGhcIiwgcHJvcHMud2lkdGggKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoIHByb3BzLmhlaWdodCE9PXVuZGVmaW5lZCApIHtcblx0XHRcdFx0dGhpcy5zZXRTdHlsZVZhbHVlKCBcImhlaWdodFwiLCBwcm9wcy5oZWlnaHQgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoIHByb3BzLnRvb2x0aXAgKSB7XG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcInRvb2x0aXBcIiwgcHJvcHMudG9vbHRpcCApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiggcHJvcHMuc3R5bGUgKSB7XG5cdFx0XHRcdHRoaXMuc2V0U3R5bGUoIHByb3BzLnN0eWxlICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCBwcm9wcy5jb250ZW50ICkge1xuXHRcdFx0XHR0aGlzLnNldENvbnRlbnQoIHByb3BzLmNvbnRlbnQgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoIHByb3BzLmRvbV9ldmVudHMgKSB7XG5cdFx0XHRcdHRoaXMuc2V0RE9NRXZlbnRzKCBwcm9wcy5kb21fZXZlbnRzICk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNsYXNzZXMgPSBnZW5DbGFzc05hbWVzKCB0aGlzICk7XG5cdFx0XHR0aGlzLmRvbS5jbGFzc0xpc3QuYWRkKCAuLi5jbGFzc2VzICk7XG5cblx0XHRcdC8vIG5lZWQgdG8gaGF2ZSBjaGlsZHJlbiBmb3IgbmV4dCBzdGF0ZW1lbnRzXG5cdFx0XHQvLyBhbmQgY2hpbGRyZW4gd2F5IGJlIGNyZWF0ZWQgaW4gY2FsbGVyXG5cdFx0XHRpZiggcHJvcHMuZGlzYWJsZWQgKSB7XG5cdFx0XHRcdHRoaXMuYWRkRE9NRXZlbnQoIFwiY3JlYXRlZFwiLCAoICkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuZW5hYmxlKCBmYWxzZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0KHRoaXMuZG9tIGFzIGFueSlbQ09NUE9ORU5UXSA9IHRoaXM7XG5cdH1cblxuXG5cdC8vIDo6IENMQVNTRVMgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdGhhc0NsYXNzKCBjbHM6IHN0cmluZyApIHtcblx0XHRyZXR1cm4gdGhpcy5kb20uY2xhc3NMaXN0LmNvbnRhaW5zKCBjbHMgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0YWRkQ2xhc3MoIGNsczogc3RyaW5nICkge1xuXHRcdGlmKCAhY2xzICkgcmV0dXJuO1xuXHRcdFxuXHRcdGlmKCBjbHMuaW5kZXhPZignICcpPj0wICkge1xuXHRcdFx0Y29uc3QgY2NzID0gY2xzLnNwbGl0KCBcIiBcIiApO1xuXHRcdFx0dGhpcy5kb20uY2xhc3NMaXN0LmFkZCguLi5jY3MpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuZG9tLmNsYXNzTGlzdC5hZGQoY2xzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdHJlbW92ZUNsYXNzKCBjbHM6IHN0cmluZyApIHtcblx0XHRpZiggIWNscyApIHJldHVybjtcblx0XHRcblx0XHRpZiggY2xzLmluZGV4T2YoJyAnKT49MCApIHtcblx0XHRcdGNvbnN0IGNjcyA9IGNscy5zcGxpdCggXCIgXCIgKTtcblx0XHRcdHRoaXMuZG9tLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2NzKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLmRvbS5jbGFzc0xpc3QucmVtb3ZlKGNscyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHR0b2dnbGVDbGFzcyggY2xzOiBzdHJpbmcgKSB7XG5cdFx0aWYoICFjbHMgKSByZXR1cm47XG5cdFx0XG5cdFx0Y29uc3QgdG9nZ2xlID0gKCB4OiBzdHJpbmcgKSA9PiB7XG5cdFx0XHR0aGlzLmRvbS5jbGFzc0xpc3QudG9nZ2xlKHgpO1xuXHRcdH1cblxuXHRcdGlmKCBjbHMuaW5kZXhPZignICcpPj0wICkge1xuXHRcdFx0Y29uc3QgY2NzID0gY2xzLnNwbGl0KCBcIiBcIiApO1xuXHRcdFx0Y2NzLmZvckVhY2goIHRvZ2dsZSApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRvZ2dsZSggY2xzICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRzZXRDbGFzcyggY2xzOiBzdHJpbmcsIHNldDogYm9vbGVhbiA9IHRydWUgKSB7XG5cdFx0aWYoIHNldCApIHRoaXMuYWRkQ2xhc3MoY2xzKTtcblx0XHRlbHNlIHRoaXMucmVtb3ZlQ2xhc3MoIGNscyApO1xuXHR9XG5cblx0Ly8gOjogQVRUUklCVVRFUyA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxuXG5cdC8qKlxuXHQgKiBhdHRyaWJ1dGVzXG5cdCAqL1xuXG5cdHNldEF0dHJpYnV0ZXMoIGF0dHJzOiBDb21wb25lbnRBdHRyaWJ1dGVzICkge1xuXHRcdFxuXHRcdGZvciggY29uc3QgbmFtZSBpbiBhdHRycyApIHtcblx0XHRcdGNvbnN0IHZhbHVlID0gYXR0cnNbbmFtZV07XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggbmFtZSwgdmFsdWUgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXHRcblx0c2V0QXR0cmlidXRlKCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuICkge1xuXHRcdGlmKCB2YWx1ZT09PW51bGwgfHwgdmFsdWU9PT11bmRlZmluZWQgKSB7XG5cdFx0XHR0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoIG5hbWUgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLmRvbS5zZXRBdHRyaWJ1dGUoIG5hbWUsIFwiXCIrdmFsdWUgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdGdldEF0dHJpYnV0ZSggbmFtZTogc3RyaW5nICk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuZG9tLmdldEF0dHJpYnV0ZSggbmFtZSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRnZXREYXRhKCBuYW1lOiBzdHJpbmcgKSA6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCBcImRhdGEtXCIrbmFtZSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRzZXREYXRhKCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgKSB7XG5cdFx0cmV0dXJuIHRoaXMuc2V0QXR0cmlidXRlKCBcImRhdGEtXCIrbmFtZSwgdmFsdWUgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBpZGVtIGFzIHNldERhdGEgYnV0IG9ub3Qgb24gZG9tLCB5b3UgY2FuIHN0b3JlIGFueXRoaW5nIFxuXHQgKi9cblxuXHRzZXRJbnRlcm5hbERhdGEoIG5hbWU6IHN0cmluZ3xTeW1ib2wsIHZhbHVlOiBhbnkgKTogdGhpcyB7XG5cdFx0aWYoICF0aGlzLnN0b3JlICkge1xuXHRcdFx0dGhpcy5zdG9yZSA9IG5ldyBNYXAoICk7XG5cdFx0fVxuXG5cdFx0dGhpcy5zdG9yZS5zZXQoIG5hbWUsIHZhbHVlICk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRnZXRJbnRlcm5hbERhdGEoIG5hbWU6IHN0cmluZ3xTeW1ib2wgKTogYW55IHtcblx0XHRyZXR1cm4gdGhpcy5zdG9yZT8uZ2V0KG5hbWUpO1xuXHR9XG5cblx0XG5cdC8vIDo6IERPTSBFVkVOVFMgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdGFkZERPTUV2ZW50PEsgZXh0ZW5kcyBrZXlvZiBHbG9iYWxET01FdmVudHM+KCBuYW1lOiBLLCBsaXN0ZW5lcjogR2xvYmFsRE9NRXZlbnRzW0tdLCBwcmVwZW5kID0gZmFsc2UgKSB7XG5cdFx0YWRkRXZlbnQoIHRoaXMuZG9tLCBuYW1lLCBsaXN0ZW5lciBhcyBET01FdmVudEhhbmRsZXIsIHByZXBlbmQgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0c2V0RE9NRXZlbnRzKCBldmVudHM6IEdsb2JhbERPTUV2ZW50cyApIHtcblx0XHRmb3IoIGNvbnN0IG5hbWUgaW4gZXZlbnRzICkge1xuXHRcdFx0dGhpcy5hZGRET01FdmVudCggbmFtZSBhcyBhbnksIChldmVudHMgYXMgYW55KVtuYW1lXSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIDo6IEhJTEVWRUwgRVZFTlRTIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XG5cblx0LyoqXG5cdCAqIHRvb2wgdG8gbW92ZSBuYW1lZCBldmVudHMgdG8gaW50ZXJuYWwgZXZlbnQgbWFwXG5cdCAqIEBpbnRlcm5hbFxuXHQgKi9cblx0XG5cdHByb3RlY3RlZCBtYXBQcm9wRXZlbnRzPE4gZXh0ZW5kcyBrZXlvZiBFPihwcm9wczogUCwgLi4uZWxlbWVudHM6IE5bXSApIHtcblx0XHRjb25zdCBwID0gcHJvcHMgYXMgYW55O1xuXHRcdGVsZW1lbnRzLmZvckVhY2goIG4gPT4ge1xuXHRcdFx0aWYgKHAuaGFzT3duUHJvcGVydHkobikgKSB7XG5cdFx0XHRcdHRoaXMub24oIG4sIHBbbl0gKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8vIDo6IENPTlRFTlQgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcblxuXHQvKipcblx0ICogcmVtb3ZlIGFsbCBjb250ZW50IGZyb20gY29tcG9uZW50XG5cdCAqL1xuXG5cdGNsZWFyQ29udGVudCggKSB7XG5cdFx0Y29uc3QgZCA9IHRoaXMuZG9tO1xuXHRcdHdoaWxlKCBkLmZpcnN0Q2hpbGQgKSB7XG5cdFx0XHRkLnJlbW92ZUNoaWxkKCBkLmZpcnN0Q2hpbGQgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogY2hhbmdlIHRoZSB3aG9sZSBjb250ZW50IG9mIHRoZSBjb21wb25lbnRcblx0ICogY2xlYXIgdGhlIGNvbnRlbnQgYmVmb3JlXG5cdCAqIEBwYXJhbSBjb250ZW50IG5ldyBjb250ZW50XG5cdCAqL1xuXG5cdHNldENvbnRlbnQoIGNvbnRlbnQ6IENvbXBvbmVudENvbnRlbnQgKSB7XG5cdFx0dGhpcy5jbGVhckNvbnRlbnQoICk7XG5cdFx0dGhpcy5hcHBlbmRDb250ZW50KCBjb250ZW50ICk7XG5cdH1cblxuXHQvKipcblx0ICogY2YuIGFwcGVuZENvbnRlbnRcblx0ICogQHBhcmFtIGNvbnRlbnQgY29udGVudCB0byBhcHBlbmRcblx0ICovXG5cblx0YXBwZW5kQ29udGVudCggY29udGVudDogQ29tcG9uZW50Q29udGVudCApIHtcblx0XHRjb25zdCBzZXQgPSAoIGQ6IGFueSwgYzogQ29tcG9uZW50IHwgc3RyaW5nIHwgVW5zYWZlSHRtbCB8IG51bWJlciB8IGJvb2xlYW4gKSA9PiB7XG5cdFxuXHRcdFx0aWYgKGMgaW5zdGFuY2VvZiBDb21wb25lbnQgKSB7XG5cdFx0XHRcdGQuYXBwZW5kQ2hpbGQoIGMuZG9tICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCBjIGluc3RhbmNlb2YgVW5zYWZlSHRtbCkge1xuXHRcdFx0XHRkLmluc2VydEFkamFjZW50SFRNTCggJ2JlZm9yZWVuZCcgLCBjLnRvU3RyaW5nKCkgKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBjID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBjID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdGNvbnN0IHRub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYy50b1N0cmluZygpKTtcblx0XHRcdFx0ZC5hcHBlbmRDaGlsZCggdG5vZGUgKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoIGMgKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihcIlVua25vd24gdHlwZSB0byBhcHBlbmQ6IFwiLCBjKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiggIWlzQXJyYXkoY29udGVudCkgKSB7XG5cdFx0XHRzZXQoIHRoaXMuZG9tLCBjb250ZW50ICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYoIGNvbnRlbnQubGVuZ3RoPD04ICkge1xuXHRcdFx0Zm9yKCBjb25zdCBjIG9mIGNvbnRlbnQgKSB7XG5cdFx0XHRcdHNldCggdGhpcy5kb20sIGMgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoICk7XG5cdFx0XHRmb3IgKGNvbnN0IGNoaWxkIG9mIGNvbnRlbnQgKSB7XG5cdFx0XHRcdHNldCggZnJhZ21lbnQsIGNoaWxkICk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZG9tLmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xuXHRcdH1cblx0fVx0XHRcblxuXHQvKipcblx0ICogY2YuIGFwcGVuZENvbnRlbnRcblx0ICogQHBhcmFtIGNvbnRlbnQgY29udGVudCB0byBhcHBlbmRcblx0ICovXG5cblx0cHJlcGVuZENvbnRlbnQoIGNvbnRlbnQ6IENvbXBvbmVudENvbnRlbnQgKSB7XG5cdFx0Y29uc3QgZCA9IHRoaXMuZG9tO1xuXG5cdFx0Y29uc3Qgc2V0ID0gKCBjOiBDb21wb25lbnQgfCBzdHJpbmcgfCBVbnNhZmVIdG1sIHwgbnVtYmVyIHwgYm9vbGVhbiApID0+IHtcblx0XHRcdGlmIChjIGluc3RhbmNlb2YgQ29tcG9uZW50ICkge1xuXHRcdFx0XHRkLmluc2VydEJlZm9yZSggZC5maXJzdENoaWxkLCBjLmRvbSApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggYyBpbnN0YW5jZW9mIFVuc2FmZUh0bWwpIHtcblx0XHRcdFx0ZC5pbnNlcnRBZGphY2VudEhUTUwoICdiZWZvcmViZWdpbicsIGMudG9TdHJpbmcoKSApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIGMgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGMgPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0Y29uc3QgdG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjLnRvU3RyaW5nKCkpO1xuXHRcdFx0XHRkLmluc2VydEJlZm9yZSggZC5maXJzdENoaWxkLCB0bm9kZSApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihcIlVua25vd24gdHlwZSB0byBhcHBlbmQ6IFwiLCBjKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiggIWlzQXJyYXkoY29udGVudCkgKSB7XG5cdFx0XHRzZXQoIGNvbnRlbnQgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoICk7XG5cdFx0XHRmb3IgKGNvbnN0IGNoaWxkIG9mIGNvbnRlbnQgKSB7XG5cdFx0XHRcdHNldCggY2hpbGQgKTtcblx0XHRcdH1cblxuXHRcdFx0ZC5pbnNlcnRCZWZvcmUoIGQuZmlyc3RDaGlsZCwgZnJhZ21lbnQgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogcmVtb3ZlIGEgc2luZ2xlIGNoaWxkXG5cdCAqIEBzZWUgY2xlYXJDb250ZW50XG5cdCAqL1xuXG5cdHJlbW92ZUNoaWxkKCBjaGlsZDogQ29tcG9uZW50ICkge1xuXHRcdHRoaXMuZG9tLnJlbW92ZUNoaWxkKCBjaGlsZC5kb20gKTtcblx0fVxuXG5cdFxuXHQvKipcblx0ICogcXVlcnkgYWxsIGVsZW1lbnRzIGJ5IHNlbGVjdG9yXG5cdCAqL1xuXG5cdHF1ZXJ5QWxsKCBzZWxlY3Rvcjogc3RyaW5nICk6IENvbXBvbmVudFtdIHtcblx0XHRjb25zdCBhbGwgPSB0aGlzLmRvbS5xdWVyeVNlbGVjdG9yQWxsKCBzZWxlY3RvciApO1xuXHRcdGNvbnN0IHJjID0gbmV3IEFycmF5KCBhbGwubGVuZ3RoICk7XG5cdFx0YWxsLmZvckVhY2goICh4LGkpID0+IHJjW2ldPWNvbXBvbmVudEZyb21ET00oeCkgKTtcblx0XHRyZXR1cm4gcmM7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXHRcblx0cXVlcnk8VCBleHRlbmRzIENvbXBvbmVudCA9IENvbXBvbmVudD4oIHNlbGVjdG9yOiBzdHJpbmcgKTogVCB7XG5cdFx0Y29uc3QgciA9IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3IoIHNlbGVjdG9yICk7XG5cdFx0cmV0dXJuIGNvbXBvbmVudEZyb21ET008VD4ocik7XG5cdH1cblxuXHQvLyA6OiBTVFlMRVMgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcblxuXHRcblx0LyoqXG5cdCAqIFxuXHQgKi9cblx0XG5cdHNldEFyaWEoIG5hbWU6IGtleW9mIGFyaWFWYWx1ZXMsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuICk6IHRoaXMge1xuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCBuYW1lLCB2YWx1ZSApO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdHNldFN0eWxlKCBzdHlsZTogUGFydGlhbDxDU1NTdHlsZURlY2xhcmF0aW9uPiApOiB0aGlzIHtcblx0XHRjb25zdCBfc3R5bGUgPSAodGhpcy5kb20gYXMgSFRNTEVsZW1lbnQpLnN0eWxlO1xuXG5cdFx0Zm9yKCBjb25zdCBuYW1lIGluIHN0eWxlICkge1xuXHRcdFx0XG5cdFx0XHRsZXQgdmFsdWUgPSBzdHlsZVtuYW1lXTtcblx0XHRcdGlmKCAhdW5pdGxlc3NbbmFtZV0gJiYgKGlzTnVtYmVyKHZhbHVlKSB8fCBSRV9OVU1CRVIudGVzdCh2YWx1ZSkpICkge1xuXHRcdFx0XHR2YWx1ZSArPSBcInB4XCI7XG5cdFx0XHR9XG5cblx0XHRcdF9zdHlsZVtuYW1lXSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRzZXRTdHlsZVZhbHVlPEsgZXh0ZW5kcyBrZXlvZiBDU1NTdHlsZURlY2xhcmF0aW9uPiggbmFtZTogSywgdmFsdWU6IENTU1N0eWxlRGVjbGFyYXRpb25bS10gfCBudW1iZXIgKTogdGhpcyB7XG5cdFx0XG5cdFx0Y29uc3QgX3N0eWxlID0gKHRoaXMuZG9tIGFzIEhUTUxFbGVtZW50KS5zdHlsZTtcblxuXHRcdGlmKCBpc051bWJlcih2YWx1ZSkgKSB7XG5cdFx0XHRsZXQgdiA9IHZhbHVlK1wiXCI7XG5cdFx0XHRpZiggIXVuaXRsZXNzW25hbWUgYXMgc3RyaW5nXSApIHtcblx0XHRcdFx0diArPSBcInB4XCI7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdChfc3R5bGUgYXMgYW55KVtuYW1lXSA9IHY7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0X3N0eWxlW25hbWVdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqIEBwYXJhbSBuYW1lIFxuXHQgKiBAcmV0dXJucyBcblx0ICovXG5cblx0Z2V0U3R5bGVWYWx1ZTxLIGV4dGVuZHMga2V5b2YgQ1NTU3R5bGVEZWNsYXJhdGlvbj4oIG5hbWU6IEsgKSB7XG5cdFx0Y29uc3QgX3N0eWxlID0gKHRoaXMuZG9tIGFzIEhUTUxFbGVtZW50KS5zdHlsZTtcblx0XHRyZXR1cm4gX3N0eWxlW25hbWVdO1xuXHR9XG5cblx0c2V0V2lkdGgoIHc6IG51bWJlciB8IHN0cmluZyApIHtcblx0XHR0aGlzLnNldFN0eWxlVmFsdWUoIFwid2lkdGhcIiwgaXNOdW1iZXIodykgPyB3K1wicHhcIiA6IHcgKTtcblx0fVxuXG5cdHNldEhlaWdodCggaDogbnVtYmVyIHwgc3RyaW5nICkge1xuXHRcdHRoaXMuc2V0U3R5bGVWYWx1ZSggXCJoZWlnaHRcIiwgaXNOdW1iZXIoaCkgPyBoK1wicHhcIiA6IGggKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0c2V0U3R5bGVWYXJpYWJsZSggbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nICkge1xuXHRcdCh0aGlzLmRvbSBhcyBIVE1MRWxlbWVudCkuc3R5bGUuc2V0UHJvcGVydHkoIG5hbWUsIHZhbHVlICk7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdGdldFN0eWxlVmFyaWFibGUoIG5hbWU6IHN0cmluZyApIHtcblx0XHRjb25zdCBzdHlsZSA9IHRoaXMuZ2V0Q29tcHV0ZWRTdHlsZSggKTtcblx0XHRyZXR1cm4gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSggbmFtZSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKiBAcmV0dXJucyBcblx0ICovXG5cblx0Z2V0Q29tcHV0ZWRTdHlsZSggKSB7XG5cdFx0cmV0dXJuIGdldENvbXB1dGVkU3R5bGUoIHRoaXMuZG9tICk7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdHNldENhcHR1cmUoIHBvaW50ZXJJZDogbnVtYmVyICkge1xuXHRcdHRoaXMuZG9tLnNldFBvaW50ZXJDYXB0dXJlKCBwb2ludGVySWQgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0cmVsZWFzZUNhcHR1cmUoIHBvaW50ZXJJZDogbnVtYmVyICkge1xuXHRcdHRoaXMuZG9tLnJlbGVhc2VQb2ludGVyQ2FwdHVyZSggcG9pbnRlcklkICk7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdGdldEJvdW5kaW5nUmVjdCggKTogUmVjdCB7XG5cdFx0Y29uc3QgcmMgPSB0aGlzLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoICk7XG5cdFx0cmV0dXJuIG5ldyBSZWN0KCByYy54LCByYy55LCByYy53aWR0aCwgcmMuaGVpZ2h0ICk7XG5cdH1cblxuXHQvLyA6OiBNSVNDIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRmb2N1cyggKSB7XG5cdFx0KHRoaXMuZG9tIGFzIEhUTUxFbGVtZW50KS5mb2N1cyggKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0c2Nyb2xsSW50b1ZpZXcoYXJnPzogYm9vbGVhbiB8IFNjcm9sbEludG9WaWV3T3B0aW9ucykge1xuXHRcdHRoaXMuZG9tLnNjcm9sbEludG9WaWV3KGFyZyk7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdGlzVmlzaWJsZSggKSB7XG5cdFx0cmV0dXJuICh0aGlzLmRvbSBhcyBIVE1MRWxlbWVudCkub2Zmc2V0UGFyZW50ICE9PSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRzaG93KCB2aXMgPSB0cnVlICkge1xuXHRcdHRoaXMuc2V0Q2xhc3MoICd4NGhpZGRlbicsICF2aXMgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0aGlkZSggKSB7XG5cdFx0dGhpcy5zaG93KCBmYWxzZSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIGVuYWJsZSBvciBkaXNhYmxlIGEgY29tcG9uZW50IChhbGwgc3ViIEhUTUxFbGVtZW50IHdpbGwgYmUgYWxzbyBkaXNhYmxlZClcblx0ICovXG5cblx0ZW5hYmxlKCBlbmEgPSB0cnVlICkge1xuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcImRpc2FibGVkXCIsICFlbmEgKTtcblxuXHRcdC8vIHByb3BhZ2F0ZSBkaWFibGUgc3RhdGUgdG8gYWxsIGlucHV0IGNoaWxkcmVuXG5cdFx0Y29uc3Qgbm9kZXMgPSB0aGlzLmVudW1DaGlsZE5vZGVzKCB0cnVlICk7XG5cdFx0bm9kZXMuZm9yRWFjaCggeCA9PiB7XG5cdFx0XHRpZiggeCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgKSB7XG5cdFx0XHRcdHguZGlzYWJsZWQgPSAhZW5hO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRkaXNhYmxlKCApIHtcblx0XHR0aGlzLmVuYWJsZSggZmFsc2UgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBjaGVjayBpZiBlbGVtZW50IGlzIG1hcmtlZCBkaXNhYmxlZFxuXHQgKi9cblxuXHRpc0Rpc2FibGVkKCApIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdG5leHRFbGVtZW50PFQgZXh0ZW5kcyBDb21wb25lbnQgPSBDb21wb25lbnQ+KCApOiBUIHtcblx0XHRjb25zdCBueHQgPSB0aGlzLmRvbS5uZXh0RWxlbWVudFNpYmxpbmc7XG5cdFx0cmV0dXJuIGNvbXBvbmVudEZyb21ET008VD4oIG54dCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKiBAcmV0dXJucyBcblx0ICovXG5cblx0cHJldkVsZW1lbnQ8VCBleHRlbmRzIENvbXBvbmVudCA9IENvbXBvbmVudD4oICk6IFQge1xuXHRcdGNvbnN0IG54dCA9IHRoaXMuZG9tLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cdFx0cmV0dXJuIGNvbXBvbmVudEZyb21ET008VD4oIG54dCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIHNlYXJjaCBmb3IgcGFyZW50IHRoYXQgbWF0Y2ggdGhlIGdpdmVuIGNvbnRydWN0b3IgXG5cdCAqL1xuXG5cdHBhcmVudEVsZW1lbnQ8VCBleHRlbmRzIENvbXBvbmVudD4oIGNscz86IENvbnN0cnVjdG9yPFQ+ICk6IFQge1xuXHRcdGxldCBwID0gdGhpcy5kb207XG5cblx0XHR3aGlsZSggcC5wYXJlbnRFbGVtZW50ICkge1xuXHRcdFx0Y29uc3QgY3AgPSBjb21wb25lbnRGcm9tRE9NKCBwLnBhcmVudEVsZW1lbnQgKTtcblx0XHRcdGlmKCAhY2xzICkge1xuXHRcdFx0XHRyZXR1cm4gY3AgYXMgVDtcblx0XHRcdH1cblxuXHRcdFx0aWYoIGNwICYmIGNwIGluc3RhbmNlb2YgY2xzICkge1xuXHRcdFx0XHRyZXR1cm4gY3A7XG5cdFx0XHR9XG5cblx0XHRcdHAgPSBwLnBhcmVudEVsZW1lbnQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqIEByZXR1cm5zIFxuXHQgKi9cblxuXHRmaXJzdENoaWxkPFQgZXh0ZW5kcyBDb21wb25lbnQgPSBDb21wb25lbnQ+KCApIDogVCB7XG5cdFx0Y29uc3Qgbnh0ID0gdGhpcy5kb20uZmlyc3RFbGVtZW50Q2hpbGQ7XG5cdFx0cmV0dXJuIGNvbXBvbmVudEZyb21ET008VD4oIG54dCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKiBAcmV0dXJucyBcblx0ICovXG5cblx0bGFzdENoaWxkPFQgZXh0ZW5kcyBDb21wb25lbnQgPSBDb21wb25lbnQ+KCApIDogVCB7XG5cdFx0Y29uc3Qgbnh0ID0gdGhpcy5kb20ubGFzdEVsZW1lbnRDaGlsZDtcblx0XHRyZXR1cm4gY29tcG9uZW50RnJvbURPTSggbnh0ICk7XG5cdH1cblxuXHQvKipcblx0ICogcmVudm9pZSBsYSBsaXN0ZSBkZXMgQ29tcG9zYW50cyBlbmZhbnRzXG5cdCAqL1xuXG5cdGVudW1DaGlsZENvbXBvbmVudHMoIHJlY3Vyc2l2ZTogYm9vbGVhbiApIHtcblxuXHRcdGxldCBjaGlsZHJlbjogQ29tcG9uZW50W10gPSBbXTtcblx0XHRcblx0XHRjb25zdCBub2RlcyA9IHRoaXMuZW51bUNoaWxkTm9kZXMoIHJlY3Vyc2l2ZSApO1xuXHRcdG5vZGVzLmZvckVhY2goICggYzogTm9kZSApID0+IHtcblx0XHRcdGNvbnN0IGNjID0gY29tcG9uZW50RnJvbURPTSggYyBhcyBIVE1MRWxlbWVudCApO1xuXHRcdFx0aWYoIGNjICkge1xuXHRcdFx0XHRjaGlsZHJlbi5wdXNoKGNjKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRyZXR1cm4gY2hpbGRyZW47XG5cdH1cblxuXHQvKipcblx0ICogcmV0dXJuIGNoaWxkcmVuIGxpc3Qgb2Ygbm9kZSAobm90IGFsbCBzaG91bGQgYmUgY29tcG9uZW50cylcblx0ICovXG5cblx0ZW51bUNoaWxkTm9kZXMoIHJlY3Vyc2l2ZTogYm9vbGVhbiApIHtcblx0XHRsZXQgY2hpbGRyZW46IE5vZGVbXSA9IEFycmF5LmZyb20oIHJlY3Vyc2l2ZSA/IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3JBbGwoICcqJyApIDogdGhpcy5kb20uY2hpbGRyZW4gKTtcblx0XHRyZXR1cm4gY2hpbGRyZW47XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdGFuaW1hdGUoIGtleWZyYW1lczogS2V5ZnJhbWVbXSwgZHVyYXRpb246IG51bWJlciApIHtcblx0XHR0aGlzLmRvbS5hbmltYXRlKGtleWZyYW1lcyxkdXJhdGlvbik7XG5cdH1cblxuXG5cdC8vIDo6IFRTWC9SRUFDVCA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxuXG5cdC8qKlxuXHQgKiBjYWxsZWQgYnkgdGhlIGNvbXBpbGVyIHdoZW4gYSBqc3ggZWxlbWVudCBpcyBzZWVuXG5cdCAqL1xuXG5cdHN0YXRpYyBjcmVhdGVFbGVtZW50KCBjbHNPclRhZzogc3RyaW5nIHwgQ29tcG9uZW50Q29uc3RydWN0b3IgfCBTeW1ib2wgfCBGdW5jdGlvbiwgYXR0cnM6IGFueSwgLi4uY2hpbGRyZW46IENvbXBvbmVudFtdICk6IENvbXBvbmVudCB8IENvbXBvbmVudFtdIHtcblxuXHRcdGxldCBjb21wOiBDb21wb25lbnQ7XG5cblx0XHQvLyBmcmFnbWVudFxuXHRcdGlmKCBjbHNPclRhZz09dGhpcy5jcmVhdGVGcmFnbWVudCB8fCBjbHNPclRhZz09PUZSQUdNRU5UICkge1xuXHRcdFx0cmV0dXJuIGNoaWxkcmVuO1xuXHRcdH1cblxuXHRcdC8vIGNsYXNzIGNvbnN0cnVjdG9yLCB5ZXMgOiBkaXJ0eVxuXHRcdGlmKCBjbHNPclRhZyBpbnN0YW5jZW9mIEZ1bmN0aW9uICkge1xuXHRcdFx0YXR0cnMgPSBhdHRycyA/PyB7fTtcblx0XHRcdGlmKCAhYXR0cnMuY2hpbGRyZW4gJiYgY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoICkge1xuXHRcdFx0XHRhdHRycy5jb250ZW50ID0gY2hpbGRyZW47XG5cdFx0XHR9XG5cblx0XHRcdGNvbXAgPSBuZXcgKGNsc09yVGFnIGFzIGFueSkoIGF0dHJzID8/IHt9ICk7XG5cdFx0fVxuXHRcdC8vIGJhc2ljIHRhZ1xuXHRcdGVsc2Uge1xuXHRcdFx0Y29tcCA9IG5ldyBDb21wb25lbnQoIHtcblx0XHRcdFx0dGFnOiBjbHNPclRhZyxcblx0XHRcdFx0Y29udGVudDogY2hpbGRyZW4sXG5cdFx0XHRcdC4uLmF0dHJzLFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYoIGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCApIHtcblx0XHRcdC8vY29tcC5zZXRDb250ZW50KCBjaGlsZHJlbiApO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb21wO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRzdGF0aWMgY3JlYXRlRnJhZ21lbnQoICk6IENvbXBvbmVudFtdIHtcblx0XHRyZXR1cm4gdGhpcy5jcmVhdGVFbGVtZW50KCBGUkFHTUVOVCwgbnVsbCApIGFzIENvbXBvbmVudFtdO1xuXHR9XG5cblx0Ly8gOjogU1BFQ0lBTFMgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdHF1ZXJ5SW50ZXJmYWNlPFQ+KCBuYW1lOiBzdHJpbmcgKTogVCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn0gIFxuXG5cbi8qKlxuICogXG4gKi9cblxudHlwZSBDb21wb25lbnRDb25zdHJ1Y3RvciA9IHtcblx0bmV3KC4uLnBhcmFtczogYW55W10pOiBDb21wb25lbnQ7XG59O1xuXG4vKipcbiAqIGdldCBhIGNvbXBvbmVudCBlbGVtZW50IGZyb20gaXQncyBET00gY291bnRlcnBhcnRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcG9uZW50RnJvbURPTTxUIGV4dGVuZHMgQ29tcG9uZW50ID0gQ29tcG9uZW50Piggbm9kZTogRWxlbWVudCApIHtcblx0cmV0dXJuIG5vZGUgPyAobm9kZSBhcyBhbnkpW0NPTVBPTkVOVF0gYXMgVCA6IG51bGw7XG59XG5cbi8qKlxuICogY3JlYXRlIGEgY29tcG9uZW50IGZyb20gYW4gZXhpc3RpbmcgRE9NXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBET00oIGVsOiBIVE1MRWxlbWVudCApOiBDb21wb25lbnQge1xuXHRjb25zdCBjb20gPSBjb21wb25lbnRGcm9tRE9NKGVsKTtcblx0aWYoIGNvbSApIHtcblx0XHRyZXR1cm4gY29tO1xuXHR9XG5cblx0cmV0dXJuIG5ldyBDb21wb25lbnQoIHsgZXhpc3RpbmdET006IGVsIH0gKTtcbn1cblxuXG4vLyA6OiBTcGVjaWFsIGNvbXBvbmVudHMgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcblxuLy8ganVzdCBhIGZsZXhpYmxlIGVsZW1lbnQgdGhhdCBwdXNoIG90aGVyXG5leHBvcnQgY2xhc3MgRmxleCBleHRlbmRzIENvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKCApIHtcblx0XHRzdXBlcih7fSlcblx0fVxufVxuXG5cbi8vIDo6IEhJR0ggTEVWRUwgQkFTSUMgRVZFTlRTIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XG5cblxuXG4vKipcbiAqIENsaWNrIEV2ZW50XG4gKiBjbGljayBldmVudCBkbyBub3QgaGF2ZSBhbnkgYWRkaXRpb25hbCBwYXJhbWV0ZXJzXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBFdkNsaWNrIGV4dGVuZHMgQ29tcG9uZW50RXZlbnQge1xufVxuXG4vKipcbiAqIENoYW5nZSBFdmVudFxuICogdmFsdWUgaXMgdGhlIHRoZSBlbGVtZW50IHZhbHVlXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBFdkNoYW5nZSBleHRlbmRzIENvbXBvbmVudEV2ZW50IHtcblx0cmVhZG9ubHkgdmFsdWU6IGFueTtcbn1cblxuLyoqXG4gKiBTZWxlY3Rpb24gRXZlbnRcbiAqIHZhbHVlIGlzIHRoZSBuZXcgc2VsZWN0aW9uIG9yIG51bGxcbiAqL1xuXG5pbnRlcmZhY2UgSVNlbGVjdGlvbiB7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZTZWxlY3Rpb25DaGFuZ2UgZXh0ZW5kcyBDb21wb25lbnRFdmVudCB7XG5cdHJlYWRvbmx5IHNlbGVjdGlvbjogSVNlbGVjdGlvbjtcbn1cblxuXG4vKipcbiAqIENvbnRleHRNZW51IEV2ZW50XG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBFdkNvbnRleHRNZW51IGV4dGVuZHMgQ29tcG9uZW50RXZlbnQge1xuXHR1aWV2ZW50OiBVSUV2ZW50O1x0Ly8gVUkgZXZlbnQgdGhhdCBmaXJlIHRoaXMgZXZlbnRcbn1cblxuLyoqXG4gKiBTaW1wbGUgbWVzc2FnZVxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZNZXNzYWdlIGV4dGVuZHMgQ29tcG9uZW50RXZlbnQge1xuXHRyZWFkb25seSBtc2c6IHN0cmluZztcblx0cmVhZG9ubHkgcGFyYW1zPzogYW55O1xufVxuXG4vKipcbiAqIERyYWcvRHJvcCBldmVudFxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZEcmFnIGV4dGVuZHMgQ29tcG9uZW50RXZlbnQge1xuXHRlbGVtZW50OiB1bmtub3duO1xuXHRkYXRhOiBhbnk7XG59XG5cbi8qKlxuICogRXJyb3JzXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBFdkVycm9yIGV4dGVuZHMgQ29tcG9uZW50RXZlbnQge1xuXHRjb2RlOiBudW1iZXI7XG5cdG1lc3NhZ2U6IHN0cmluZztcbn1cblxuLyoqXG4gKiBEYmxDbGljayBFdmVudFxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZEYmxDbGljayBleHRlbmRzIENvbXBvbmVudEV2ZW50IHtcbn1cblxuIiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSBjb3JlX2NvbG9ycy50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBjbGFtcCwgaXNTdHJpbmcgfSBmcm9tICcuL2NvcmVfdG9vbHMnO1xuXG5cbmZ1bmN0aW9uIGh4KCB2OiBudW1iZXIgKSB7XG5cdGNvbnN0IGhleCA9IHYudG9TdHJpbmcoIDE2ICk7XG5cdHJldHVybiBoZXgucGFkU3RhcnQoIDIsICcwJyApO1xufVxuXG5mdW5jdGlvbiByb3VuZCggdjogbnVtYmVyICkge1xuXHRyZXR1cm4gTWF0aC5yb3VuZCh2KTtcbn1cblxuXG5leHBvcnQgaW50ZXJmYWNlIFJnYiB7XG5cdHJlZDogbnVtYmVyO1xuXHRncmVlbjogbnVtYmVyO1xuXHRibHVlOiBudW1iZXI7XG5cdGFscGhhOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSHN2IHtcblx0aHVlOiBudW1iZXI7XG5cdHNhdHVyYXRpb246IG51bWJlcjtcblx0dmFsdWU6IG51bWJlcjtcblx0YWxwaGE6IG51bWJlcjtcbn1cblxuXG5leHBvcnQgY2xhc3MgQ29sb3Ige1xuXG5cdHByaXZhdGUgcmdiOiBbcmVkOm51bWJlcixncmVlbjpudW1iZXIsYmx1ZTpudW1iZXIsYWxwaGE6bnVtYmVyXSA9IFswLDAsMCwxXTtcblx0cHJpdmF0ZSBpbnZhbGlkID0gZmFsc2U7XG5cblx0Y29uc3RydWN0b3IoIHZhbHVlOiBzdHJpbmcgKTtcblx0Y29uc3RydWN0b3IoIHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE/OiBudW1iZXIgKTtcblx0Y29uc3RydWN0b3IoIC4uLmFyZ3M6IGFueVtdICkge1xuXHRcdGlmKCBpc1N0cmluZyhhcmdzWzBdICkgKSB7XG5cdFx0XHR0aGlzLnNldFZhbHVlKCAgYXJnc1swXSApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuc2V0UmdiKCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIGFjY2VwdHM6XG5cdCAqIFx0I2FhYVxuXHQgKiAgI2FiYWJhYlxuXHQgKiAgI2FiYWJhYjU1XG5cdCAqICByZ2IoYSxiLGMpXG5cdCAqICByZ2JhKGEsYixjLGQpXG5cdCAqICB2YXIoIC0tY29sb3ItNSApXG5cdCAqL1xuXHRcblx0c2V0VmFsdWUoIHZhbHVlOiBzdHJpbmcgKTogdGhpcyB7XG5cblx0XHR0aGlzLmludmFsaWQgPSBmYWxzZTtcblxuXHRcdGlmKCB2YWx1ZS5sZW5ndGg9PTQgJiYgLyNbMC05YS1mQS1GXXszfS8udGVzdCh2YWx1ZSkgKSB7XG5cdFx0XHRjb25zdCByMSA9IHBhcnNlSW50KCB2YWx1ZVsxXSwgMTYgKTtcblx0XHRcdGNvbnN0IGcxID0gcGFyc2VJbnQoIHZhbHVlWzJdLCAxNiApO1xuXHRcdFx0Y29uc3QgYjEgPSBwYXJzZUludCggdmFsdWVbM10sIDE2ICk7XG5cdFx0XHRyZXR1cm4gdGhpcy5zZXRSZ2IoIHIxPDw0fHIxLCBnMTw8NHxnMSwgYjE8PDR8YjEsIDEuMCApO1xuXHRcdH1cblxuXHRcdGlmKCB2YWx1ZS5sZW5ndGg9PTcgJiYgLyNbMC05YS1mQS1GXXs2fS8udGVzdCh2YWx1ZSkgKSB7XG5cdFx0XHRjb25zdCByMSA9IHBhcnNlSW50KCB2YWx1ZVsxXSwgMTYgKTtcblx0XHRcdGNvbnN0IHIyID0gcGFyc2VJbnQoIHZhbHVlWzJdLCAxNiApO1xuXHRcdFx0Y29uc3QgZzEgPSBwYXJzZUludCggdmFsdWVbM10sIDE2ICk7XG5cdFx0XHRjb25zdCBnMiA9IHBhcnNlSW50KCB2YWx1ZVs0XSwgMTYgKTtcblx0XHRcdGNvbnN0IGIxID0gcGFyc2VJbnQoIHZhbHVlWzVdLCAxNiApO1xuXHRcdFx0Y29uc3QgYjIgPSBwYXJzZUludCggdmFsdWVbNl0sIDE2ICk7XG5cdFx0XHRyZXR1cm4gdGhpcy5zZXRSZ2IoIHIxPDw0fHIyLCBnMTw8NHxnMiwgYjE8PDR8YjIsIDEuMCApO1xuXHRcdH1cblxuXHRcdGlmKCB2YWx1ZS5sZW5ndGg9PTkgJiYgLyNbMC05YS1mQS1GXXs4fS8udGVzdCh2YWx1ZSkgKSB7XG5cdFx0XHRjb25zdCByMSA9IHBhcnNlSW50KCB2YWx1ZVsxXSwgMTYgKTtcblx0XHRcdGNvbnN0IHIyID0gcGFyc2VJbnQoIHZhbHVlWzJdLCAxNiApO1xuXHRcdFx0Y29uc3QgZzEgPSBwYXJzZUludCggdmFsdWVbM10sIDE2ICk7XG5cdFx0XHRjb25zdCBnMiA9IHBhcnNlSW50KCB2YWx1ZVs0XSwgMTYgKTtcblx0XHRcdGNvbnN0IGIxID0gcGFyc2VJbnQoIHZhbHVlWzVdLCAxNiApO1xuXHRcdFx0Y29uc3QgYjIgPSBwYXJzZUludCggdmFsdWVbNl0sIDE2ICk7XG5cdFx0XHRjb25zdCBhMSA9IHBhcnNlSW50KCB2YWx1ZVs3XSwgMTYgKTtcblx0XHRcdGNvbnN0IGEyID0gcGFyc2VJbnQoIHZhbHVlWzhdLCAxNiApO1xuXHRcdFx0cmV0dXJuIHRoaXMuc2V0UmdiKCByMTw8NHxyMiwgZzE8PDR8ZzIsIGIxPDw0fGIyLCAoYTE8PDR8YTIpIC8gMjU1LjAgKTtcblx0XHR9XG5cblx0XHRpZiggdmFsdWUuc3RhcnRzV2l0aCgncmdiYScpICkge1xuXHRcdFx0Y29uc3QgcmUgPSAvcmdiYVxccypcXChcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKixcXHMqKChcXGQrKXwoXFxkKlxcLlxcZCspfChcXC5cXGQrKSlcXHMqXFwpLztcblx0XHRcdGNvbnN0IG0gPSByZS5leGVjKCB2YWx1ZSApO1xuXHRcdFx0aWYoIG0gKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnNldFJnYiggcGFyc2VJbnQobVsxXSksIHBhcnNlSW50KG1bMl0pLCBwYXJzZUludChtWzNdKSwgcGFyc2VGbG9hdChtWzRdKSApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmKCB2YWx1ZS5zdGFydHNXaXRoKCdyZ2InKSApIHtcblx0XHRcdGNvbnN0IHJlID0gL3JnYlxccypcXChcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKlxcKS87XG5cdFx0XHRjb25zdCBtID0gcmUuZXhlYyggdmFsdWUgKTtcblx0XHRcdGlmKCBtICkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRSZ2IoIHBhcnNlSW50KG1bMV0pLCBwYXJzZUludChtWzJdKSwgcGFyc2VJbnQobVszXSksIDEuMCApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmKCB2YWx1ZS5zdGFydHNXaXRoKFwidmFyXCIpICkge1xuXHRcdFx0Y29uc3QgcmUgPSAvdmFyXFxzKlxcKChbXildKilcXCkvO1xuXHRcdFx0Y29uc3QgbSA9IHJlLmV4ZWMoIHZhbHVlICk7XG5cdFx0XHRpZiggbSApIHtcblx0XHRcdFx0Y29uc3QgZXhwciA9IG1bMV0udHJpbSggKTtcblx0XHRcdFx0Y29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgKTtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCBleHByICk7XG5cdFx0XHRcdHJldHVybiB0aGlzLnNldFZhbHVlKCB2YWx1ZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuaW52YWxpZCA9IHRydWU7XG5cdFx0cmV0dXJuIHRoaXMuc2V0UmdiKDI1NSwwLDAsMSk7XG5cdH1cblxuXHRzZXRIc3YoIGg6IG51bWJlciwgczogbnVtYmVyLCB2OiBudW1iZXIsIGEgPSAxLjAgKTogdGhpcyB7XG5cdFx0XG5cdFx0bGV0IGkgPSBNYXRoLm1pbig1LCBNYXRoLmZsb29yKGggKiA2KSksXG5cdFx0XHRmID0gaCAqIDYgLSBpLFxuXHRcdFx0cCA9IHYgKiAoMSAtIHMpLFxuXHRcdFx0cSA9IHYgKiAoMSAtIGYgKiBzKSxcblx0XHRcdHQgPSB2ICogKDEgLSAoMSAtIGYpICogcyk7XG5cblx0XHRsZXQgUiwgRywgQjtcblxuXHRcdHN3aXRjaCAoaSkge1xuXHRcdGNhc2UgMDpcblx0XHRcdFIgPSB2O1xuXHRcdFx0RyA9IHQ7XG5cdFx0XHRCID0gcDtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgMTpcblx0XHRcdFIgPSBxO1xuXHRcdFx0RyA9IHY7XG5cdFx0XHRCID0gcDtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgMjpcblx0XHRcdFIgPSBwO1xuXHRcdFx0RyA9IHY7XG5cdFx0XHRCID0gdDtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgMzpcblx0XHRcdFIgPSBwO1xuXHRcdFx0RyA9IHE7XG5cdFx0XHRCID0gdjtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgNDpcblx0XHRcdFIgPSB0O1xuXHRcdFx0RyA9IHA7XG5cdFx0XHRCID0gdjtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgNTpcblx0XHRcdFIgPSB2O1xuXHRcdFx0RyA9IHA7XG5cdFx0XHRCID0gcTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLnNldFJnYiggUioyNTUsIEcqMjU1LCBCKjI1NSwgYSApO1xuXHR9XG5cblxuXHRzZXRSZ2IoIHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlciApOiB0aGlzIHtcblx0XHR0aGlzLnJnYiA9IFtjbGFtcChyLDAsMjU1KSxjbGFtcChnLDAsMjU1KSxjbGFtcChiLDAsMjU1KSxjbGFtcChhLDAsMSldO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0dG9SZ2JTdHJpbmcoIHdpdGhBbHBoYT86IGJvb2xlYW4gKTogc3RyaW5nIHtcblx0XHRjb25zdCBfID0gdGhpcy5yZ2I7XG5cdFx0cmV0dXJuIHdpdGhBbHBoYT09PWZhbHNlIHx8IF9bM109PTEgPyBgcmdiKCR7cm91bmQoX1swXSl9LCR7cm91bmQoX1sxXSl9LCR7cm91bmQoX1syXSl9KWAgOiBgcmdiYSgke3JvdW5kKF9bMF0pfSwke3JvdW5kKF9bMV0pfSwke3JvdW5kKF9bMl0pfSwke19bM10udG9GaXhlZCgzKX0pYFxuXHR9XG5cblx0dG9IZXhTdHJpbmcoICk6IHN0cmluZyB7XG5cdFx0Y29uc3QgXyA9IHRoaXMucmdiO1xuXHRcdHJldHVybiBfWzNdPT0xID8gYCMoJHtoeChfWzBdKX0sJHtoeChfWzFdKX0sJHtoeChfWzJdKX0pYCA6IGByZ2JhKCR7aHgoX1swXSl9LCR7aHgoX1sxXSl9LCR7aHgoX1syXSl9LCR7aHgoX1szXSoyNTUpfSlgXG5cdH1cblxuXHR0b1JnYiggKTogUmdiIHtcblx0XHRjb25zdCBfID0gdGhpcy5yZ2I7XG5cdFx0cmV0dXJuIHsgcmVkOiBfWzBdLCBncmVlbjogX1sxXSwgYmx1ZTogX1syXSwgYWxwaGE6IF9bM10gfTtcblx0fVxuXG5cdHRvSHN2KCApOiBIc3Yge1xuXHRcdFxuXHRcdGxldCBlbCA9IHRoaXMudG9SZ2IoICk7XG5cblx0XHRlbC5yZWQgLz0gMjU1LjA7XG5cdFx0ZWwuZ3JlZW4gLz0gMjU1LjA7XG5cdFx0ZWwuYmx1ZSAvPSAyNTUuMDtcblx0XHRcblx0XHRjb25zdCBtYXggPSBNYXRoLm1heChlbC5yZWQsIGVsLmdyZWVuLCBlbC5ibHVlKTtcblx0XHRjb25zdCBtaW4gPSBNYXRoLm1pbihlbC5yZWQsIGVsLmdyZWVuLCBlbC5ibHVlKTtcblx0XHRjb25zdCBkZWx0YSA9IG1heCAtIG1pbjtcblx0XHRjb25zdCBzYXR1cmF0aW9uID0gKG1heCA9PT0gMCkgPyAwIDogKGRlbHRhIC8gbWF4KTtcblx0XHRjb25zdCB2YWx1ZSA9IG1heDtcblxuXHRcdGxldCBodWU7XG5cblx0XHRpZiAoZGVsdGEgPT09IDApIHtcblx0XHRcdGh1ZSA9IDA7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0c3dpdGNoIChtYXgpIHtcblx0XHRcdGNhc2UgZWwucmVkOlxuXHRcdFx0XHRodWUgPSAoZWwuZ3JlZW4gLSBlbC5ibHVlKSAvIGRlbHRhIC8gNiArIChlbC5ncmVlbiA8IGVsLmJsdWUgPyAxIDogMCk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIGVsLmdyZWVuOlxuXHRcdFx0XHRodWUgPSAoZWwuYmx1ZSAtIGVsLnJlZCkgLyBkZWx0YSAvIDYgKyAxIC8gMztcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgZWwuYmx1ZTpcblx0XHRcdFx0aHVlID0gKGVsLnJlZCAtIGVsLmdyZWVuKSAvIGRlbHRhIC8gNiArIDIgLyAzO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4geyBodWUsIHNhdHVyYXRpb24sIHZhbHVlLCBhbHBoYTogZWwuYWxwaGEgfTtcblx0fVxuXG5cdGdldEFscGhhKCApIHtcblx0XHRyZXR1cm4gdGhpcy5yZ2JbM107XG5cdH1cblxuXHRzZXRBbHBoYSggYTogbnVtYmVyICk6IHRoaXMge1xuXHRcdHRoaXMucmdiWzNdID0gY2xhbXAoIGEsIDAsIDEgKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdGlzSW52YWxpZCggKSB7XG5cdFx0cmV0dXJuIHRoaXMuaW52YWxpZDtcblx0fVxufSIsICIvKiogXG4gKiAgX19fICBfX18gX19cbiAqICBcXCAgXFwvICAvICAvIF9cbiAqICAgXFwgICAgLyAgL198IHxfXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxuICogIC9fXy9cXF9fXFwgICB8X3xcbiAqIFxuICogQGZpbGUgY29yZV9kcmFnZHJvcC50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vY29yZV90b29scyc7XG5cbmNvbnN0IHhfZHJhZ19jYiA9IFN5bWJvbCggJ3gtZHJhZy1jYicgKTtcblxuaW50ZXJmYWNlIERyb3BJbmZvIHtcblx0cHQ6IFBvaW50O1xuXHRkYXRhOiBEYXRhVHJhbnNmZXI7XG59XG5cbnR5cGUgRHJvcENhbGxiYWNrID0gKCBjb21tYW5kOiAnZW50ZXInIHwgJ2xlYXZlJyB8ICdkcmFnJyB8ICdkcm9wJywgZWw6IENvbXBvbmVudCwgaW5mb3M6IERyb3BJbmZvICkgPT4gdm9pZDtcbnR5cGUgRmlsdGVyQ2FsbGJhY2sgPSAoIGVsOiBDb21wb25lbnQgKSA9PiBib29sZWFuO1xuXG4vKipcbiAqIFxuICovXG5cblxuY2xhc3MgRHJhZ01hbmFnZXIge1xuXG5cdGRyYWdTb3VyY2U6IENvbXBvbmVudDtcblx0ZHJhZ0dob3N0OiBIVE1MRWxlbWVudDtcblx0ZHJvcFRhcmdldDogQ29tcG9uZW50O1xuXHRcblx0bm90aWZpZWQ6IENvbXBvbmVudDtcblx0XG5cdHRpbWVyOiBhbnk7IC8vIHBiIHdpdGggbmFtZSBvZiBzZXR0aW1lb3V0IHJldHVyblxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0cmVnaXN0ZXJEcmFnZ2FibGVFbGVtZW50KGVsOiBDb21wb25lbnQpIHtcblxuXHRcdGVsLmFkZERPTUV2ZW50KCdkcmFnc3RhcnQnLCAoZXY6IERyYWdFdmVudCkgPT4ge1xuXG5cdFx0XHR0aGlzLmRyYWdTb3VyY2UgPSBlbDtcblx0XHRcdHRoaXMuZHJhZ0dob3N0ID0gZWwuZG9tLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcblx0XHRcdFxuXHRcdFx0dGhpcy5kcmFnR2hvc3QuY2xhc3NMaXN0LmFkZCgnZHJhZ2dlZCcpO1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRyYWdHaG9zdCk7XG5cblx0XHRcdGVsLmFkZENsYXNzKCAnZHJhZ2dpbmcnICk7XG5cblx0XHRcdGV2LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd0ZXh0L3N0cmluZycsICcxJyk7XG5cdFx0XHRldi5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKG5ldyBJbWFnZSgpLCAwLCAwKTtcblxuXHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCApO1xuXHRcdH0pO1xuXG5cdFx0ZWwuYWRkRE9NRXZlbnQoJ2RyYWcnLCAoZXY6IERyYWdFdmVudCkgPT4ge1xuXHRcdFx0dGhpcy5kcmFnR2hvc3Quc3R5bGUubGVmdCA9IGV2LnBhZ2VYICsgXCJweFwiO1xuXHRcdFx0dGhpcy5kcmFnR2hvc3Quc3R5bGUudG9wID0gZXYucGFnZVkgKyBcInB4XCI7XG5cdFx0fSk7XG5cblx0XHRlbC5hZGRET01FdmVudCgnZHJhZ2VuZCcsIChldjogRHJhZ0V2ZW50KSA9PiB7XG5cdFx0XHRlbC5yZW1vdmVDbGFzcyggJ2RyYWdnaW5nJyApO1xuXHRcdFx0dGhpcy5kcmFnR2hvc3QucmVtb3ZlKCk7XG5cdFx0fSk7XG5cblx0XHRlbC5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsIFwidHJ1ZVwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0cmVnaXN0ZXJEcm9wVGFyZ2V0KGVsOiBDb21wb25lbnQsIGNiOiBEcm9wQ2FsbGJhY2ssIGZpbHRlckNCPzogRmlsdGVyQ2FsbGJhY2sgKSB7XG5cblx0XHRjb25zdCBkcmFnRW50ZXIgPSAoZXY6IERyYWdFdmVudCkgPT4ge1xuXHRcdFx0aWYoIGZpbHRlckNCICYmICFmaWx0ZXJDQih0aGlzLmRyYWdTb3VyY2UpICkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyggJ3JlamVjdCAnLCBlbCApO1xuXHRcdFx0XHRldi5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdub25lJztcdFxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnNvbGUubG9nKCAnYWNjZXB0ZWQgJywgZWwgKTtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRldi5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdjb3B5Jztcblx0XHR9O1xuXG5cdFx0Y29uc3QgZHJhZ092ZXIgPSAoZXY6IERyYWdFdmVudCkgPT4ge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyggXCJkcmFnb3ZlclwiLCBldi50YXJnZXQgKTtcblx0XHRcdFxuXHRcdFx0aWYoIGZpbHRlckNCICYmICFmaWx0ZXJDQih0aGlzLmRyYWdTb3VyY2UpICkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyggJ3JlamVjdCAnLCBlbCApO1xuXHRcdFx0XHRldi5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdub25lJztcdFxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdGlmICh0aGlzLmRyb3BUYXJnZXQgIT0gZWwpIHtcblx0XHRcdFx0dGhpcy5kcm9wVGFyZ2V0ID0gZWw7XG5cdFx0XHRcdHRoaXMuX3N0YXJ0Q2hlY2soKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoIHRoaXMuZHJvcFRhcmdldCApIHtcblx0XHRcdFx0Y29uc3QgaW5mb3MgPSB7XG5cdFx0XHRcdFx0cHQ6IHsgeDogZXYucGFnZVgsIHk6IGV2LnBhZ2VZIH0sXG5cdFx0XHRcdFx0ZGF0YTogZXYuZGF0YVRyYW5zZmVyLFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y2IoICdkcmFnJywgdGhpcy5kcmFnU291cmNlLCBpbmZvcyApO1xuXHRcdFx0fVxuXG5cdFx0XHRldi5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdjb3B5Jztcblx0XHR9O1xuXG5cdFx0Y29uc3QgZHJhZ0xlYXZlID0gKGV2OiBEcmFnRXZlbnQpID0+IHtcblx0XHRcdC8vY29uc29sZS5sb2coIFwiZHJhZ2xlYXZlXCIsIGV2LnRhcmdldCApO1xuXHRcdFx0dGhpcy5kcm9wVGFyZ2V0ID0gbnVsbDtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fTtcblxuXHRcdGNvbnN0IGRyb3AgPSAoZXY6IERyYWdFdmVudCkgPT4ge1xuXHRcdFx0Y29uc3QgaW5mb3MgPSB7XG5cdFx0XHRcdHB0OiB7IHg6IGV2LnBhZ2VYLCB5OiBldi5wYWdlWSB9LFxuXHRcdFx0XHRkYXRhOiBldi5kYXRhVHJhbnNmZXIsXG5cdFx0XHR9XG5cblx0XHRcdGNiKCdkcm9wJywgdGhpcy5kcmFnU291cmNlLCBpbmZvcyApO1xuXHRcdFx0XG5cdFx0XHR0aGlzLmRyb3BUYXJnZXQgPSBudWxsO1xuXHRcdFx0ZWwucmVtb3ZlQ2xhc3MoJ2Ryb3Atb3ZlcicpO1xuXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblxuXHRcdGVsLmFkZERPTUV2ZW50KCdkcmFnZW50ZXInLCBkcmFnRW50ZXIpO1xuXHRcdGVsLmFkZERPTUV2ZW50KCdkcmFnb3ZlcicsIGRyYWdPdmVyKTtcblx0XHRlbC5hZGRET01FdmVudCgnZHJhZ2xlYXZlJywgZHJhZ0xlYXZlKTtcblx0XHRlbC5hZGRET01FdmVudCgnZHJvcCcsIGRyb3ApO1xuXG5cdFx0ZWwuc2V0SW50ZXJuYWxEYXRhKCB4X2RyYWdfY2IsIGNiICk7XG5cdH1cblxuXHRfc3RhcnRDaGVjaygpIHtcblxuXHRcdGlmICh0aGlzLnRpbWVyKSB7XG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuXHRcdFx0dGhpcy5fY2hlY2soICk7XG5cdFx0fVxuXG5cdFx0dGhpcy50aW1lciA9IHNldEludGVydmFsKCAoKSA9PiB0aGlzLl9jaGVjaygpLCAzMDAgKTtcblx0fVxuXG5cdF9jaGVjayggKSB7XG5cblx0XHRjb25zdCBsZWF2aW5nID0gKCB4OiBDb21wb25lbnQgKSA9PiB7XG5cdFx0XHR4LnJlbW92ZUNsYXNzKCdkcm9wLW92ZXInKTtcblxuXHRcdFx0Y29uc3QgY2IgPSB4LmdldEludGVybmFsRGF0YSggeF9kcmFnX2NiICk7XG5cdFx0XHRjYiggJ2xlYXZlJywgdGhpcy5kcmFnU291cmNlICk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZW50ZXJpbmcgPSAoIHg6IENvbXBvbmVudCApID0+IHtcblx0XHRcdHguYWRkQ2xhc3MoJ2Ryb3Atb3ZlcicpO1xuXHRcdFx0Y29uc3QgY2IgPSB4LmdldEludGVybmFsRGF0YSggeF9kcmFnX2NiICk7XG5cdFx0XHRjYiggJ2VudGVyJywgdGhpcy5kcmFnU291cmNlICk7XG5cdFx0fVxuXHRcblx0XHRpZiAodGhpcy5kcm9wVGFyZ2V0KSB7XG5cdFx0XHRpZiAoIXRoaXMubm90aWZpZWQgfHwgdGhpcy5ub3RpZmllZCAhPSB0aGlzLmRyb3BUYXJnZXQpIHtcblxuXHRcdFx0XHRpZiggdGhpcy5ub3RpZmllZCApIHtcblx0XHRcdFx0XHRsZWF2aW5nKCB0aGlzLm5vdGlmaWVkICk7XG5cdFx0XHRcdH1cblx0XHRcblx0XHRcdFx0dGhpcy5ub3RpZmllZCA9IHRoaXMuZHJvcFRhcmdldDtcblx0XHRcdFx0ZW50ZXJpbmcoIHRoaXMubm90aWZpZWQgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAodGhpcy5ub3RpZmllZCkge1xuXHRcdFx0XHRsZWF2aW5nKCB0aGlzLm5vdGlmaWVkICk7XG5cdFx0XHRcdHRoaXMubm90aWZpZWQgPSBudWxsO1xuXG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBkcmFnTWFuYWdlciA9IG5ldyBEcmFnTWFuYWdlcigpOyIsICIvKiogXG4gKiAgX19fICBfX18gX19cbiAqICBcXCAgXFwvICAvICAvIF9cbiAqICAgXFwgICAgLyAgL198IHxfXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxuICogIC9fXy9cXF9fXFwgICB8X3xcbiAqIFxuICogQGZpbGUgY29yZV9yb3V0ZXIudHNcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxuICogXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqKi9cblxuaW1wb3J0IHsgRXZFcnJvciB9IGZyb20gJy4vY29tcG9uZW50LmpzJztcbmltcG9ydCB7IEV2ZW50TWFwLCBFdmVudFNvdXJjZSB9IGZyb20gJy4vY29yZV9ldmVudHMuanMnO1xuXG50eXBlIFJvdXRlSGFuZGxlciA9ICggcGFyYW1zOiBhbnksIHBhdGg6IHN0cmluZyApID0+IHZvaWQ7XG5cbmludGVyZmFjZSBTZWdtZW50IHtcblx0a2V5czogc3RyaW5nW10sXG5cdHBhdHRlcm46IFJlZ0V4cDtcbn1cblxuaW50ZXJmYWNlIFJvdXRlIHtcblx0a2V5czogc3RyaW5nW10sXG5cdHBhdHRlcm46IFJlZ0V4cDtcblx0aGFuZGxlcjogUm91dGVIYW5kbGVyO1xufVxuXG5mdW5jdGlvbiBwYXJzZVJvdXRlKHN0cjogc3RyaW5nIHwgUmVnRXhwLCBsb29zZSA9IGZhbHNlKTogU2VnbWVudCB7XG5cblx0aWYgKHN0ciBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRrZXlzOiBudWxsLFxuXHRcdFx0cGF0dGVybjogc3RyXG5cdFx0fTtcblx0fVxuXG5cdGNvbnN0IGFyciA9IHN0ci5zcGxpdCgnLycpO1xuXG5cdGxldCBrZXlzID0gW107XG5cdGxldCBwYXR0ZXJuID0gJyc7XG5cblx0aWYoIGFyclswXT09JycgKSB7XG5cdFx0YXJyLnNoaWZ0KCk7XG5cdH1cblxuXHRmb3IgKGNvbnN0IHRtcCBvZiBhcnIpIHtcblx0XHRjb25zdCBjID0gdG1wWzBdO1xuXG5cdFx0aWYgKGMgPT09ICcqJykge1xuXHRcdFx0a2V5cy5wdXNoKCd3aWxkJyk7XG5cdFx0XHRwYXR0ZXJuICs9ICcvKC4qKSc7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGMgPT09ICc6Jykge1xuXHRcdFx0Y29uc3QgbyA9IHRtcC5pbmRleE9mKCc/JywgMSk7XG5cdFx0XHRjb25zdCBleHQgPSB0bXAuaW5kZXhPZignLicsIDEpO1xuXG5cdFx0XHRrZXlzLnB1c2godG1wLnN1YnN0cmluZygxLCBvID49IDAgPyBvIDogZXh0ID49IDAgPyBleHQgOiB0bXAubGVuZ3RoKSk7XG5cdFx0XHRwYXR0ZXJuICs9IG8gPj0gMCAmJiBleHQgPCAwID8gJyg/Oi8oW15cXC9dKz8pKT8nIDogJy8oW15cXC9dKz8pJztcblx0XHRcdGlmIChleHQgPj0gMCkge1xuXHRcdFx0XHRwYXR0ZXJuICs9IChvID49IDAgPyAnPycgOiAnJykgKyAnXFxcXCcgKyB0bXAuc3Vic3RyaW5nKGV4dCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cGF0dGVybiArPSAnLycgKyB0bXA7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRrZXlzLFxuXHRcdHBhdHRlcm46IG5ldyBSZWdFeHAoIGBeJHtwYXR0ZXJufSR7bG9vc2UgPyAnKD89JHxcXC8pJyA6ICdcXC8/JCd9YCwgJ2knIClcblx0fTtcbn1cblxuaW50ZXJmYWNlIFJvdXRlckV2ZW50cyBleHRlbmRzIEV2ZW50TWFwIHtcblx0ZXJyb3I6IEV2RXJyb3I7XG59XG5cblxuLyoqXG4gKiBtaWNybyByb3V0ZXJcbiAqIFxuICogYGBgXG4gKiBjb25zdCByb3V0ZXIgPSBuZXcgUm91dGVyKCApO1xuICogXG4gKiByb3V0ZXIuZ2V0KCBcIi9kZXRhaWwvOmlkXCIsICggcGFyYW1zOiBhbnkgKSA9PiB7XG4gKiBcdHRoaXMuX3Nob3dEZXRhaWwoIGRldGFpbCApO1xuICogfSApO1xuICogXG4gKiByb3V0ZXIuZ2V0KCBcIi86aWRcIiwgKCBwYXJhbXM6IGFueSApID0+IHtcbiAqICAgaWYoIHBhcmFtcy5pZD09MCApXG4gKiBcdFx0cm91dGVyLm5hdmlnYXRlKCAnL2hvbWUnICk7XG4gKlx0IH1cbiAqIH0pO1xuICogXG4gKiByb3V0ZXIub24oIFwiZXJyb3JcIiwgKCApID0+IHtcbiAqIFx0cm91dGVyLm5hdmlnYXRlKCAnL2hvbWUnICk7XG4gKiB9KVxuICogXG4gKiByb3V0ZXIuaW5pdCggKTtcbiAqIGBgYFxuICovXG5cblxuZXhwb3J0IGNsYXNzIFJvdXRlciBleHRlbmRzIEV2ZW50U291cmNlPCBSb3V0ZXJFdmVudHMgPiB7XG5cblx0cHJpdmF0ZSBtX3JvdXRlczogUm91dGVbXTtcblx0cHJpdmF0ZSBtX3VzZUhhc2g6IGJvb2xlYW47XG5cblx0Y29uc3RydWN0b3IoIHVzZUhhc2ggPSB0cnVlICkge1xuXHRcdHN1cGVyKCApO1xuXG5cdFx0dGhpcy5tX3JvdXRlcyA9IFtdO1xuXHRcdHRoaXMubV91c2VIYXNoID0gdXNlSGFzaDtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIChldmVudCkgPT4ge1xuXHRcdFx0Y29uc3QgdXJsID0gdGhpcy5fZ2V0TG9jYXRpb24oICk7XG5cdFx0XHRjb25zdCBmb3VuZCA9IHRoaXMuX2ZpbmQodXJsKTtcblx0XHRcblx0XHRcdGZvdW5kLmhhbmRsZXJzLmZvckVhY2goaCA9PiB7XG5cdFx0XHRcdGgoZm91bmQucGFyYW1zLHVybCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdGdldCh1cmk6IHN0cmluZyB8IFJlZ0V4cCwgaGFuZGxlcjogUm91dGVIYW5kbGVyICkge1xuXHRcdGxldCB7IGtleXMsIHBhdHRlcm4gfSA9IHBhcnNlUm91dGUodXJpKTtcblx0XHR0aGlzLm1fcm91dGVzLnB1c2goeyBrZXlzLCBwYXR0ZXJuLCBoYW5kbGVyIH0pO1xuXHR9XG5cblx0aW5pdCgpIHtcblx0XHR0aGlzLm5hdmlnYXRlKCB0aGlzLl9nZXRMb2NhdGlvbigpICk7XG5cdH1cblxuXHRwcml2YXRlIF9nZXRMb2NhdGlvbiggKSB7XG5cdFx0cmV0dXJuIHRoaXMubV91c2VIYXNoID8gJy8nK2RvY3VtZW50LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpIDogZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWU7XG5cdH1cblxuXHRuYXZpZ2F0ZSggdXJpOiBzdHJpbmcsIG5vdGlmeSA9IHRydWUsIHJlcGxhY2UgPSBmYWxzZSApIHtcblxuXHRcdGlmKCAhdXJpLnN0YXJ0c1dpdGgoJy8nKSApIHtcblx0XHRcdHVyaSA9ICcvJyt1cmk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZm91bmQgPSB0aGlzLl9maW5kKCB1cmkgKTtcblxuXHRcdGlmKCAhZm91bmQgfHwgZm91bmQuaGFuZGxlcnMubGVuZ3RoPT0wICkge1xuXHRcdFx0Ly93aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe30sICcnLCAnZXJyb3InKVxuXHRcdFx0Y29uc29sZS5sb2coICdyb3V0ZSBub3QgZm91bmQ6ICcrdXJpICk7XG5cdFx0XHR0aGlzLmZpcmUoIFwiZXJyb3JcIiwge2NvZGU6IDQwNCwgbWVzc2FnZTogXCJyb3V0ZSBub3QgZm91bmRcIiB9ICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYoIHRoaXMubV91c2VIYXNoICkge1xuXHRcdFx0d2hpbGUoIHVyaS5hdCgwKT09Jy8nICkge1xuXHRcdFx0XHR1cmkgPSB1cmkuc3Vic3RyaW5nKCAxICk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHVyaSA9ICcjJyt1cmk7XG5cdFx0fVxuXHRcdFxuXHRcdGlmKCByZXBsYWNlICkge1xuXHRcdFx0d2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCAnJywgdXJpICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0d2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCAnJywgdXJpICk7XG5cdFx0fVxuXG5cdFx0aWYoIG5vdGlmeSApIHtcblx0XHRcdGZvdW5kLmhhbmRsZXJzLmZvckVhY2goIGggPT4ge1xuXHRcdFx0XHRoKCBmb3VuZC5wYXJhbXMsIHVyaSApO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX2ZpbmQoIHVybDogc3RyaW5nICk6IHsgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLGFueT4sIGhhbmRsZXJzOiBSb3V0ZUhhbmRsZXJbXSB9IHtcblx0XHRcblx0XHRsZXQgbWF0Y2hlcyA9IFtdO1xuXHRcdGxldCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsYW55PiA9IHt9O1xuXHRcdGxldCBoYW5kbGVyczogUm91dGVIYW5kbGVyW10gPSBbXTtcblxuXHRcdGZvciAoY29uc3QgdG1wIG9mIHRoaXMubV9yb3V0ZXMgKSB7XG5cdFx0XHRpZiAoIXRtcC5rZXlzICkge1xuXHRcdFx0XHRtYXRjaGVzID0gdG1wLnBhdHRlcm4uZXhlYyh1cmwpO1xuXHRcdFx0XHRpZiAoIW1hdGNoZXMpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChtYXRjaGVzWydncm91cHMnXSkge1xuXHRcdFx0XHRcdGZvciAoY29uc3QgayBpbiBtYXRjaGVzWydncm91cHMnXSkge1xuXHRcdFx0XHRcdFx0cGFyYW1zW2tdID0gbWF0Y2hlc1snZ3JvdXBzJ11ba107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aGFuZGxlcnMgPSBbLi4uaGFuZGxlcnMsIHRtcC5oYW5kbGVyXTtcblx0XHRcdH0gXG5cdFx0XHRlbHNlIGlmICh0bXAua2V5cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdG1hdGNoZXMgPSB0bXAucGF0dGVybi5leGVjKHVybCk7XG5cdFx0XHRcdGlmIChtYXRjaGVzID09PSBudWxsKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmb3IgKCBsZXQgaiA9IDA7IGogPCB0bXAua2V5cy5sZW5ndGg7KSB7XG5cdFx0XHRcdFx0cGFyYW1zW3RtcC5rZXlzW2pdXSA9IG1hdGNoZXNbKytqXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGhhbmRsZXJzID0gWy4uLmhhbmRsZXJzLCB0bXAuaGFuZGxlcl07XG5cdFx0XHR9IFxuXHRcdFx0ZWxzZSBpZiAodG1wLnBhdHRlcm4udGVzdCh1cmwpKSB7XG5cdFx0XHRcdGhhbmRsZXJzID0gWy4uLmhhbmRsZXJzLCB0bXAuaGFuZGxlcl07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHsgcGFyYW1zLCBoYW5kbGVycyB9O1xuXHR9XG59XG5cbiIsICIvKiogXG4gKiAgX19fICBfX18gX19cbiAqICBcXCAgXFwvICAvICAvIF9cbiAqICAgXFwgICAgLyAgL198IHxfXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxuICogIC9fXy9cXF9fXFwgICB8X3xcbiAqIFxuICogQGZpbGUgY29yZV9zdmcudHNcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxuICogXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRQcm9wcyB9IGZyb20gJ0Bjb3JlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBpc1VuaXRMZXNzIH0gZnJvbSBcIkBjb3JlL2NvcmVfc3R5bGVzXCI7XG5pbXBvcnQgeyBET01FdmVudEhhbmRsZXIsIEdsb2JhbERPTUV2ZW50cywgYWRkRXZlbnQgfSBmcm9tICdAY29yZS9jb3JlX2RvbSc7XG5pbXBvcnQgeyBpc051bWJlciwgaXNTdHJpbmcgfSBmcm9tICdAY29yZS9jb3JlX3Rvb2xzLmpzJztcblxuY29uc3QgU1ZHX05TID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiOyBcblxuLy8gZGVncmVlcyB0byByYWRpYW5cbmZ1bmN0aW9uIGQyciggZDogbnVtYmVyICk6IG51bWJlciB7XG5cdHJldHVybiBkICogTWF0aC5QSSAvIDE4MC4wO1xufVxuXG4vLyBwb2xhciB0byBjYXJ0ZXNpYW5cbmZ1bmN0aW9uIHAyYyggeDogbnVtYmVyLCB5OiBudW1iZXIsIHI6IG51bWJlciwgZGVnOiBudW1iZXIgKToge3g6IG51bWJlcix5OiBudW1iZXJ9IHtcblx0Y29uc3QgcmFkID0gZDJyKCBkZWcgKTtcblx0cmV0dXJuIHtcblx0XHR4OiB4ICsgciAqIE1hdGguY29zKCByYWQgKSxcblx0XHR5OiB5ICsgciAqIE1hdGguc2luKCByYWQgKVxuXHR9O1xufVxuXG4vLyBmaXggcHJlYyBmb3IgbnVtYmVyc1xuZnVuY3Rpb24gbnVtKCB4OiBudW1iZXIgKTogbnVtYmVyIHtcblx0cmV0dXJuIE1hdGgucm91bmQoIHggKiAxMDAwICkgLyAxMDAwO1xufVxuXG4vLyBjbGVhbiB2YWx1ZXNcbmZ1bmN0aW9uIGNsZWFuKCBhOiBhbnksIC4uLmI6IGFueSApIHtcblx0Ly8ganVzdCByb3VuZCBudW1iZXIgdmFsdWVzIHRvIDMgZGlnaXRzXG5cdGIgPSBiLm1hcCggKCB2OiBhbnkgKSA9PiB7XG5cdFx0aWYoIHR5cGVvZiB2ID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2KSApIHtcblx0XHRcdHJldHVybiBudW0odik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHY7XG5cdH0pO1xuXG5cdHJldHVybiBTdHJpbmcucmF3KCBhLCAuLi5iICk7XG59XG5cblxuXG5cblxuXG5cblxuXG5jbGFzcyBTdmdJdGVtIHtcblx0cHJvdGVjdGVkIF9kb20gOiBTVkdFbGVtZW50O1xuXG5cdGNvbnN0cnVjdG9yKCB0YWc6IHN0cmluZyApIHtcblx0XHR0aGlzLl9kb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCB0YWcgKTsgXG5cdH1cblxuXHRnZXREb20oICkge1xuXHRcdHJldHVybiB0aGlzLl9kb207XG5cdH1cblxuXHQvKipcblx0ICogY2hhbmdlIHRoZSBzdHJva2UgY29sb3Jcblx0ICogQHBhcmFtIGNvbG9yIFxuXHQgKi9cblxuXHRzdHJva2UoIGNvbG9yOiBzdHJpbmcsIHdpZHRoPzogbnVtYmVyICk6IHRoaXMge1xuXHRcdHRoaXMuc2V0QXR0ciggJ3N0cm9rZScsIGNvbG9yICk7XG5cdFx0aWYoIHdpZHRoIT09dW5kZWZpbmVkICkge1xuXHRcdFx0dGhpcy5zZXRBdHRyKCAnc3Ryb2tlLXdpZHRoJywgd2lkdGgrJ3B4JyApO1x0XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIGNoYW5nZSB0aGUgc3Ryb2tlIHdpZHRoXG5cdCAqIEBwYXJhbSB3aWR0aCBcblx0ICovXG5cdHN0cm9rZVdpZHRoKCB3aWR0aDogbnVtYmVyICk6IHRoaXMge1xuXHRcdHRoaXMuc2V0QXR0ciggJ3N0cm9rZS13aWR0aCcsIHdpZHRoKydweCcgKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHN0cm9rZUNhcCggY2FwOiBcImJ1dHRcIiB8IFwicm91bmRcIiB8IFwic3FhdXJlXCIgKSB7XG5cdFx0cmV0dXJuIHRoaXMuc2V0QXR0ciggXCJzdHJva2UtbGluZWNhcFwiLCBjYXAgKTtcblx0fVxuXG5cdHN0cm9rZU9wYWNpdHkoIG9wYWNpdHk6IG51bWJlciApIHtcblx0XHRyZXR1cm4gdGhpcy5zZXRBdHRyKCBcInN0cm9rZS1vcGFjaXR5XCIsIG9wYWNpdHkrXCJcIiApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRhbnRpQWxpYXMoIHNldDogYm9vbGVhbiApIHtcblx0XHRyZXR1cm4gdGhpcy5zZXRBdHRyKCBcInNoYXBlLXJlbmRlcmluZ1wiLCBzZXQgPyBcImF1dG9cIiA6IFwiY3Jpc3BFZGdlc1wiICk7XG5cdH1cblxuXHQvKipcblx0ICogY2hhbmdlIHRoZSBmaWxsIGNvbG9yXG5cdCAqIEBwYXJhbSBjb2xvciBcblx0ICovXG5cblx0ZmlsbCggY29sb3I6IHN0cmluZyApOiB0aGlzIHtcblx0XHR0aGlzLnNldEF0dHIoICdmaWxsJywgY29sb3IgKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdG5vX2ZpbGwoICk6IHRoaXMge1xuXHRcdHRoaXMuc2V0QXR0ciggJ2ZpbGwnLCBcInRyYW5zcGFyZW50XCIgKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBkZWZpbmUgYSBuZXcgYXR0cmlidXRlXG5cdCAqIEBwYXJhbSBuYW1lIGF0dGlidXRlIG5hbWVcblx0ICogQHBhcmFtIHZhbHVlIGF0dHJpYnV0ZSB2YWx1ZVxuXHQgKiBAcmV0dXJucyB0aGlzXG5cdCAqL1xuXG5cdHNldEF0dHIoIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyApIDogdGhpcyB7XG5cdFx0dGhpcy5fZG9tLnNldEF0dHJpYnV0ZSggbmFtZSwgdmFsdWUgKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0c2V0U3R5bGU8SyBleHRlbmRzIGtleW9mIENTU1N0eWxlRGVjbGFyYXRpb24+KCBuYW1lOiBLLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyICkgOiB0aGlzIHtcblx0XHRjb25zdCBfc3R5bGUgPSB0aGlzLl9kb20uc3R5bGU7XG5cblx0XHRpZiggaXNOdW1iZXIodmFsdWUpICkge1xuXHRcdFx0bGV0IHYgPSB2YWx1ZStcIlwiO1xuXHRcdFx0aWYoICFpc1VuaXRMZXNzKG5hbWUgYXMgc3RyaW5nKSApIHtcblx0XHRcdFx0diArPSBcInB4XCI7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdChfc3R5bGUgYXMgYW55KVtuYW1lXSA9IHY7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0KF9zdHlsZSBhcyBhbnkpW25hbWVdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogYWRkIGEgY2xhc3Ncblx0ICogQHBhcmFtIG5hbWUgY2xhc3MgbmFtZSB0byBhZGQgXG5cdCAqL1xuXHRcblx0YWRkQ2xhc3MoIGNsczogc3RyaW5nICkge1xuXHRcdGlmKCAhY2xzICkgcmV0dXJuO1xuXHRcdFxuXHRcdGlmKCBjbHMuaW5kZXhPZignICcpPj0wICkge1xuXHRcdFx0Y29uc3QgY2NzID0gY2xzLnNwbGl0KCBcIiBcIiApO1xuXHRcdFx0dGhpcy5fZG9tLmNsYXNzTGlzdC5hZGQoLi4uY2NzKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLl9kb20uY2xhc3NMaXN0LmFkZChjbHMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0Y2xpcCggaWQ6IHN0cmluZyApOiB0aGlzIHtcblx0XHR0aGlzLnNldEF0dHIoIFwiY2xpcC1wYXRoXCIsIGB1cmwoIyR7aWR9KWAgKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0dHJhbnNmb3JtKCB0cjogc3RyaW5nICk6IHRoaXMge1xuXHRcdHRoaXMuc2V0QXR0ciggXCJ0cmFuc2Zvcm1cIiwgdHIgKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0cm90YXRlKCBkZWc6IG51bWJlciwgY3g6IG51bWJlciwgY3k6IG51bWJlciApOiB0aGlzIHtcblx0XHR0aGlzLnRyYW5zZm9ybSggYHJvdGF0ZSggJHtkZWd9ICR7Y3h9ICR7Y3l9IClgICk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHR0cmFuc2xhdGUoIGR4OiBudW1iZXIsIGR5OiBudW1iZXIgKTogdGhpcyB7XG5cdFx0dGhpcy50cmFuc2Zvcm0oIGB0cmFuc2xhdGUoICR7ZHh9ICR7ZHl9IClgICk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRzY2FsZSggeDogbnVtYmVyICk6IHRoaXMge1xuXHRcdHRoaXMudHJhbnNmb3JtKCBgc2NhbGUoICR7eH0gKWAgKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0YWRkRE9NRXZlbnQ8SyBleHRlbmRzIGtleW9mIEdsb2JhbERPTUV2ZW50cz4oIG5hbWU6IEssIGxpc3RlbmVyOiBHbG9iYWxET01FdmVudHNbS10sIHByZXBlbmQgPSBmYWxzZSApIHtcblx0XHRhZGRFdmVudCggdGhpcy5fZG9tLCBuYW1lLCBsaXN0ZW5lciBhcyBET01FdmVudEhhbmRsZXIsIHByZXBlbmQgKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG5cblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgY2xhc3MgU3ZnUGF0aCBleHRlbmRzIFN2Z0l0ZW0ge1xuXHRwcml2YXRlIF9wYXRoOiBzdHJpbmc7XG5cblx0Y29uc3RydWN0b3IoICkge1xuXHRcdHN1cGVyKCAncGF0aCcgKTtcblx0XHR0aGlzLl9wYXRoID0gJyc7XG5cdH1cblxuXHRwcml2YXRlIF91cGRhdGUoICk6IHRoaXMge1xuXHRcdHRoaXMuc2V0QXR0ciggJ2QnLCB0aGlzLl9wYXRoICk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogbW92ZSB0aGUgY3VycmVudCBwb3Ncblx0ICogQHBhcmFtIHggbmV3IHBvcyB4XG5cdCAqIEBwYXJhbSB5IG5ldyBwb3MgeVxuXHQgKiBAcmV0dXJucyB0aGlzXG5cdCAqL1xuXG5cdG1vdmVUbyggeDogbnVtYmVyLCB5OiBudW1iZXIgKSA6IHRoaXMge1xuXHRcdHRoaXMuX3BhdGggKz0gY2xlYW5gTSR7eH0sJHt5fWA7XG5cdFx0cmV0dXJuIHRoaXMuX3VwZGF0ZSggKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBkcmF3IGFsaW5lIHRvIHRoZSBnaXZlbiBwb2ludFxuXHQgKiBAcGFyYW0geCBlbmQgeFxuXHQgKiBAcGFyYW0geSBlbmQgeVxuXHQgKiBAcmV0dXJucyB0aGlzXG5cdCAqL1xuXG5cdGxpbmVUbyggeDogbnVtYmVyLCB5OiBudW1iZXIgKTogdGhpcyB7XG5cdFx0dGhpcy5fcGF0aCArPSBjbGVhbmBMJHt4fSwke3l9YDtcblx0XHRyZXR1cm4gdGhpcy5fdXBkYXRlKCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIGNsb3NlIHRoZSBjdXJyZW50UGF0aFxuXHQgKi9cblxuXHRjbG9zZVBhdGgoICk6IHRoaXMge1xuXHRcdHRoaXMuX3BhdGggKz0gJ1onO1xuXHRcdHJldHVybiB0aGlzLl91cGRhdGUoICk7XG5cdH1cblxuXHQvKipcblx0ICogZHJhdyBhbiBhcmNcblx0ICogQHBhcmFtIHggY2VudGVyIHhcblx0ICogQHBhcmFtIHkgY2VudGVyIHlcblx0ICogQHBhcmFtIHIgcmFkaXVzXG5cdCAqIEBwYXJhbSBzdGFydCBhbmdsZSBzdGFydCBpbiBkZWdyZWVzXG5cdCAqIEBwYXJhbSBlbmQgYW5nbGUgZW5kIGluIGRlZ3JlZXNcblx0ICogQHJldHVybnMgdGhpc1xuXHQgKi9cblxuXHRhcmMoIHg6IG51bWJlciwgeTogbnVtYmVyLCByOiBudW1iZXIsIHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyICk6IHRoaXMge1xuXG5cdFx0Y29uc3Qgc3QgPSBwMmMoIHgsIHksIHIsIHN0YXJ0LTkwICk7XG5cdFx0Y29uc3QgZW4gPSBwMmMoIHgsIHksIHIsIGVuZC05MCApO1xuXG5cdFx0Y29uc3QgZmxhZyA9IGVuZCAtIHN0YXJ0IDw9IDE4MCA/IFwiMFwiIDogXCIxXCI7XG5cdFx0dGhpcy5fcGF0aCArPSBjbGVhbmBNJHtzdC54fSwke3N0Lnl9QSR7cn0sJHtyfSAwICR7ZmxhZ30gMSAke2VuLnh9LCR7ZW4ueX1gO1xuXHRcdFxuXHRcdHJldHVybiB0aGlzLl91cGRhdGUoICk7XG5cdH1cbn1cblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgY2xhc3MgU3ZnVGV4dCBleHRlbmRzIFN2Z0l0ZW0ge1xuXG5cdGNvbnN0cnVjdG9yKCB4OiBudW1iZXIsIHk6IG51bWJlciwgdHh0OiBzdHJpbmcgKSB7XG5cdFx0c3VwZXIoICd0ZXh0JyApO1xuXHRcdFxuXHRcdHRoaXMuc2V0QXR0ciggJ3gnLCBudW0oeCkrJycgKTtcblx0XHR0aGlzLnNldEF0dHIoICd5JywgbnVtKHkpKycnICk7XG5cblx0XHR0aGlzLl9kb20uaW5uZXJIVE1MID0gdHh0O1xuXHR9XG5cblx0Zm9udCggZm9udDogc3RyaW5nICk6IHRoaXMge1xuXHRcdHJldHVybiB0aGlzLnNldEF0dHIoICdmb250LWZhbWlseScsIGZvbnQgKTtcblx0fVxuXG5cdGZvbnRTaXplKCBzaXplOiBudW1iZXIgfCBzdHJpbmcgKTogdGhpcyB7XG5cdFx0cmV0dXJuIHRoaXMuc2V0QXR0ciggJ2ZvbnQtc2l6ZScsIHNpemUrJycgKTtcblx0fVxuXG5cdGZvbnRXZWlnaHQoIHdlaWdodDogJ2xpZ2h0JyB8ICdub3JtYWwnIHwgJ2JvbGQnICk6IHRoaXMge1xuXHRcdHJldHVybiB0aGlzLnNldEF0dHIoICdmb250LXdlaWdodCcsIHdlaWdodCApO1xuXHR9XG5cblx0dGV4dEFsaWduKCBhbGlnbjogJ2xlZnQnIHwgJ2NlbnRlcicgfCAncmlnaHQnICk6IHRoaXMge1xuXG5cdFx0bGV0IGFsO1xuXHRcdHN3aXRjaCggYWxpZ24gKSB7XG5cdFx0XHRjYXNlICdsZWZ0JzogYWwgPSAnc3RhcnQnOyBicmVhaztcblx0XHRcdGNhc2UgJ2NlbnRlcic6IGFsID0gJ21pZGRsZSc7IGJyZWFrO1xuXHRcdFx0Y2FzZSAncmlnaHQnOiBhbCA9ICdlbmQnOyBicmVhaztcblx0XHRcdGRlZmF1bHQ6IHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLnNldEF0dHIoICd0ZXh0LWFuY2hvcicsIGFsICk7XG5cdH1cblxuXHR2ZXJ0aWNhbEFsaWduKCBhbGlnbjogJ3RvcCcgfCAnY2VudGVyJyB8ICdib3R0b20nIHwgJ2Jhc2VsaW5lJyApOiB0aGlzIHtcblxuXHRcdGxldCBhbDtcblx0XHRzd2l0Y2goIGFsaWduICkge1xuXHRcdFx0Y2FzZSAndG9wJzogYWwgPSAnaGFuZ2luZyc7IGJyZWFrO1xuXHRcdFx0Y2FzZSAnY2VudGVyJzogYWwgPSAnbWlkZGxlJzsgYnJlYWs7XG5cdFx0XHRjYXNlICdib3R0b20nOiBhbCA9ICdiYXNlbGluZSc7IGJyZWFrO1xuXHRcdFx0Y2FzZSAnYmFzZWxpbmUnOiBhbCA9ICdtYXRoZW1hdGljYWwnOyBicmVhaztcblx0XHRcdGRlZmF1bHQ6IHJldHVybjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5zZXRBdHRyKCAnYWxpZ25tZW50LWJhc2VsaW5lJywgYWwgKTtcblx0fVxufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBjbGFzcyBTdmdTaGFwZSBleHRlbmRzIFN2Z0l0ZW0ge1xuXHRjb25zdHJ1Y3RvciggdGFnOiBzdHJpbmcgKSB7XG5cdFx0c3VwZXIoIHRhZyApO1xuXHR9XG59XG5cbi8qKlxuICogXG4gKi9cblxudHlwZSBudW1iZXJfb3JfcGVyYyA9IG51bWJlciB8IGAke3N0cmluZ30lYFxuXG5leHBvcnQgY2xhc3MgU3ZnR3JhZGllbnQgZXh0ZW5kcyBTdmdJdGVtIHtcblxuXHRwcml2YXRlIHN0YXRpYyBnX2lkID0gMTtcblxuXHRwcml2YXRlIF9pZDogc3RyaW5nO1xuXHRwcml2YXRlIF9zdG9wczogeyBvZmZzZXQ6IG51bWJlcl9vcl9wZXJjLCBjb2xvcjogc3RyaW5nIH0gW107XG5cblx0Y29uc3RydWN0b3IoIHgxOiBudW1iZXJfb3JfcGVyYywgeTE6IG51bWJlcl9vcl9wZXJjLCB4MjogbnVtYmVyX29yX3BlcmMsIHkyOiBudW1iZXJfb3JfcGVyYyApIHtcblx0XHRzdXBlciggJ2xpbmVhckdyYWRpZW50Jylcblx0XHRcblx0XHR0aGlzLl9pZCA9ICdneC0nK1N2Z0dyYWRpZW50LmdfaWQ7XG5cdFx0U3ZnR3JhZGllbnQuZ19pZCsrO1xuXG5cdFx0dGhpcy5zZXRBdHRyKCAnaWQnLCB0aGlzLl9pZCApO1xuXHRcdHRoaXMuc2V0QXR0ciggJ3gxJywgaXNTdHJpbmcoeDEpID8geDEgOiBudW0oeDEpKycnICk7XG5cdFx0dGhpcy5zZXRBdHRyKCAneDInLCBpc1N0cmluZyh4MikgPyB4MiA6IG51bSh4MikrJycgKTtcblx0XHR0aGlzLnNldEF0dHIoICd5MScsIGlzU3RyaW5nKHkxKSA/IHkxIDogbnVtKHkxKSsnJyApO1xuXHRcdHRoaXMuc2V0QXR0ciggJ3kyJywgaXNTdHJpbmcoeTIpID8geTIgOiBudW0oeTIpKycnICk7XG5cblx0XHR0aGlzLl9zdG9wcyA9IFtdO1xuXHR9XG5cblx0Z2V0IGlkKCApIHtcblx0XHRyZXR1cm4gJ3VybCgjJyt0aGlzLl9pZCsnKSc7XG5cdH1cblxuXHRhZGRTdG9wKCBvZmZzZXQ6IG51bWJlcl9vcl9wZXJjLCBjb2xvcjogc3RyaW5nICk6IHRoaXMge1xuXHRcdHRoaXMuX2RvbS5pbnNlcnRBZGphY2VudEhUTUwoIFwiYmVmb3JlZW5kXCIsIGA8c3RvcCBvZmZzZXQ9XCIke29mZnNldH0lXCIgc3RvcC1jb2xvcj1cIiR7Y29sb3J9XCI+PC9zdG9wPmApO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59XG5cbi8qKlxuICogXG4gKi9cblxuZXhwb3J0IGNsYXNzIFN2Z0dyb3VwIGV4dGVuZHMgU3ZnSXRlbSB7XG5cdFxuXHRjb25zdHJ1Y3RvciggdGFnID0gXCJnXCIgKSB7XG5cdFx0c3VwZXIoIHRhZyApXG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdGFwcGVuZDxLIGV4dGVuZHMgU3ZnSXRlbT4oIGl0ZW06IEsgKTogSyAge1xuXHRcdHRoaXMuX2RvbS5hcHBlbmRDaGlsZCggaXRlbS5nZXREb20oKSApO1xuXHRcdHJldHVybiBpdGVtO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRwYXRoKCApOiBTdmdQYXRoIHtcblx0XHRjb25zdCBwYXRoID0gbmV3IFN2Z1BhdGgoICk7XG5cdFx0cmV0dXJuIHRoaXMuYXBwZW5kKCBwYXRoICk7XG5cdH1cblxuXHR0ZXh0KCB4OiBudW1iZXIsIHk6IG51bWJlciwgdHh0OiBzdHJpbmcgKSB7XG5cdFx0Y29uc3QgdGV4dCA9IG5ldyBTdmdUZXh0KCB4LCB5LCB0eHQgKTtcblx0XHRyZXR1cm4gdGhpcy5hcHBlbmQoIHRleHQgKTtcblx0fVxuXG5cdGVsbGlwc2UoIHg6IG51bWJlciwgeTogbnVtYmVyLCByMTogbnVtYmVyLCByMiA9IHIxICk6IFN2Z1NoYXBlIHtcblx0XHRjb25zdCBzaGFwZSA9IG5ldyBTdmdTaGFwZSggJ2VsbGlwc2UnICk7XG5cdFx0c2hhcGUuc2V0QXR0ciggJ2N4JywgbnVtKHgpKycnICk7XG5cdFx0c2hhcGUuc2V0QXR0ciggJ2N5JywgbnVtKHkpKycnICk7XG5cdFx0c2hhcGUuc2V0QXR0ciggJ3J4JywgbnVtKHIxKSsnJyApO1xuXHRcdHNoYXBlLnNldEF0dHIoICdyeScsIG51bShyMikrJycgKTtcblx0XHRyZXR1cm4gdGhpcy5hcHBlbmQoIHNoYXBlICk7XG5cdH1cblxuXHRyZWN0KCB4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIgKTogU3ZnU2hhcGUge1xuXG5cdFx0aWYoIGg8MCApIHtcblx0XHRcdHkgPSB5K2g7XG5cdFx0XHRoID0gLWg7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc2hhcGUgPSBuZXcgU3ZnU2hhcGUoICdyZWN0JyApO1xuXHRcdHNoYXBlLnNldEF0dHIoICd4JywgbnVtKHgpKycnICk7XG5cdFx0c2hhcGUuc2V0QXR0ciggJ3knLCBudW0oeSkrJycgKTtcblx0XHRzaGFwZS5zZXRBdHRyKCAnd2lkdGgnLCBudW0odykrJycgKTtcblx0XHRzaGFwZS5zZXRBdHRyKCAnaGVpZ2h0JywgbnVtKGgpKycnICk7XG5cdFx0cmV0dXJuIHRoaXMuYXBwZW5kKCBzaGFwZSApO1xuXHR9XG5cblx0Z3JvdXAoICkge1xuXHRcdGNvbnN0IGdyb3VwID0gbmV3IFN2Z0dyb3VwKCApO1xuXHRcdHJldHVybiB0aGlzLmFwcGVuZCggZ3JvdXAgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICogZXhhbXBsZVxuXHQgKiBgYGB0c1xuXHQgKiBjb25zdCBnID0gYy5saW5lYXJfZ3JhZGllbnQoICcwJScsICcwJScsICcwJScsICcxMDAlJyApXG5cdCAqIFx0XHRcdFx0LmFkZFN0b3AoIDAsICdyZWQnIClcblx0ICogXHRcdFx0XHQuYWRkU3RvcCggMTAwLCAnZ3JlZW4nICk7XG5cdCAqIFxuXHQgKiBwLnJlY3QoIDAsIDAsIDEwMCwgMTAwIClcblx0ICogXHRcdC5zdHJva2UoIGcuaWQgKTtcblx0ICogXG5cdCAqIGBgYFxuXHQgKi9cblxuXHRsaW5lYXJfZ3JhZGllbnQoIHgxOiBudW1iZXJfb3JfcGVyYywgeTE6IG51bWJlcl9vcl9wZXJjLCB4MjogbnVtYmVyX29yX3BlcmMsIHkyOiBudW1iZXJfb3JfcGVyYyApIHtcblx0XHRjb25zdCBncmFkID0gbmV3IFN2Z0dyYWRpZW50KCB4MSwgeTEsIHgyLCB5MiApO1xuXHRcdHJldHVybiB0aGlzLmFwcGVuZCggZ3JhZCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIGNsZWFyIFxuXHQgKi9cblxuXHRjbGVhciggKSB7XG5cdFx0Y29uc3QgZG9tID0gdGhpcy5fZG9tO1xuXHRcdHdoaWxlKCBkb20uZmlyc3RDaGlsZCApIHtcblx0XHRcdGRvbS5yZW1vdmVDaGlsZCggZG9tLmZpcnN0Q2hpbGQgKTtcblx0XHR9XG5cdH1cbn1cblxuXG5cblxuXG5leHBvcnQgY2xhc3MgU3ZnQnVpbGRlciBleHRlbmRzIFN2Z0dyb3VwIHtcblx0cHJpdmF0ZSBzdGF0aWMgZ19jbGlwX2lkID0gMTtcblx0XG5cdGNvbnN0cnVjdG9yKCApIHtcblx0XHRzdXBlciggICk7XG5cdH1cblxuXHRhZGRDbGlwKCB4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIgKSB7XG4gICAgICAgIFxuXHRcdGNvbnN0IGlkID0gJ2MtJytTdmdCdWlsZGVyLmdfY2xpcF9pZCsrO1xuXHRcdGNvbnN0IGNsaXAgPSBuZXcgU3ZnR3JvdXAoICdjbGlwUGF0aCcgKTtcblx0XHRjbGlwLnNldEF0dHIoJ2lkJywgaWQgKTtcblx0XHRjbGlwLnJlY3QoIHgsIHksIHcsIGggKTtcblxuXHRcdHRoaXMuYXBwZW5kKGNsaXApO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfVxufVxuXG5cblxuLyoqXG4gKiBcbiAqL1xuXG5pbnRlcmZhY2UgU3ZnUHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XG5cdHZpZXdib3g/OiBzdHJpbmc7XG5cdHN2Zz86IFN2Z0J1aWxkZXI7XG59XG5cbi8qKlxuICogXG4gKi9cblxuZXhwb3J0IGNsYXNzIFN2Z0NvbXBvbmVudDxQIGV4dGVuZHMgU3ZnUHJvcHMgPSBTdmdQcm9wcz4gZXh0ZW5kcyBDb21wb25lbnQ8UD4ge1xuXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogUCApIHtcblx0XHRzdXBlciggeyAuLi5wcm9wcywgdGFnOiBcInN2Z1wiLCBuczogU1ZHX05TIH0gKTtcblxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCAneG1sbnMnLCBTVkdfTlMgKTtcblxuXHRcdGlmKCBwcm9wcy52aWV3Ym94ICkge1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwidmlld2JveFwiLCBwcm9wcy52aWV3Ym94ICk7XG5cdFx0fVxuXG5cdFx0aWYoIHByb3BzLnN2ZyApIHtcblx0XHRcdHRoaXMuZG9tLmFwcGVuZENoaWxkKCBwcm9wcy5zdmcuZ2V0RG9tKCkgKTtcblx0XHR9XG5cdH1cbn1cbiIsICIvKiogXG4gKiAgX19fICBfX18gX19cbiAqICBcXCAgXFwvICAvICAvIF9cbiAqICAgXFwgICAgLyAgL198IHxfXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxuICogIC9fXy9cXF9fXFwgICB8X3xcbiAqIFxuICogQGZpbGUgYm94ZXMudHNcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxuICogXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRFdmVudHMsIENvbXBvbmVudFByb3BzIH0gZnJvbSBcIi4uLy4uL2NvcmUvY29tcG9uZW50XCJcblxuaW1wb3J0IFwiLi9ib3hlcy5tb2R1bGUuc2Nzc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJveFByb3BzIGV4dGVuZHMgQ29tcG9uZW50UHJvcHMge1xufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBjbGFzcyBCb3g8UCBleHRlbmRzIEJveFByb3BzPUJveFByb3BzLEUgZXh0ZW5kcyBDb21wb25lbnRFdmVudHM9Q29tcG9uZW50RXZlbnRzPiBleHRlbmRzIENvbXBvbmVudDxQLEU+IHtcbn1cblxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBjbGFzcyBIQm94PFAgZXh0ZW5kcyBCb3hQcm9wcz1Cb3hQcm9wcyxFIGV4dGVuZHMgQ29tcG9uZW50RXZlbnRzPUNvbXBvbmVudEV2ZW50cz4gZXh0ZW5kcyBCb3g8UCxFPiB7XG59XG5cbi8qKlxuICogXG4gKi9cblxuZXhwb3J0IGNsYXNzIFZCb3g8UCBleHRlbmRzIEJveFByb3BzPUJveFByb3BzLEUgZXh0ZW5kcyBDb21wb25lbnRFdmVudHM9Q29tcG9uZW50RXZlbnRzPiBleHRlbmRzIEJveDxQLEU+IHtcblx0Y29uc3RydWN0b3IoIHA6IFAgKSB7XG5cdFx0c3VwZXIoIHAgKTtcblx0fVxufVxuXG5cbi8qKlxuICogc3RhY2sgb2Ygd2lkZ2V0cyB3aGVyZSBvbmx5IG9uZSB3aWRnZXQgaXMgdmlzaWJsZSBhdCBhIHRpbWVcbiAqL1xuXG5pbnRlcmZhY2UgU3RhY2tJdGVtIHtcblx0bmFtZTogc3RyaW5nO1xuXHRjb250ZW50OiBDb21wb25lbnQ7XG59XG5cbmludGVyZmFjZSBTdGFja2VkTGF5b3V0UHJvcHMgZXh0ZW5kcyBPbWl0PENvbXBvbmVudFByb3BzLFwiY29udGVudFwiPiB7XG5cdGRlZmF1bHQ6IHN0cmluZztcblx0aXRlbXM6IFN0YWNrSXRlbVtdO1xufVxuXG5pbnRlcmZhY2UgX1N0YWNrSXRlbSBleHRlbmRzIFN0YWNrSXRlbSB7XG5cdHBhZ2U6IENvbXBvbmVudDtcbn1cblxuZXhwb3J0IGNsYXNzIFN0YWNrQm94IGV4dGVuZHMgQm94PFN0YWNrZWRMYXlvdXRQcm9wcz4ge1xuXG5cdHByaXZhdGUgX2l0ZW1zOiBfU3RhY2tJdGVtW107XG5cblx0Y29uc3RydWN0b3IoIHByb3BzOiBTdGFja2VkTGF5b3V0UHJvcHMgKSB7XG5cdFx0c3VwZXIoIHByb3BzICk7XG5cblx0XHR0aGlzLl9pdGVtcyA9IHByb3BzLml0ZW1zPy5tYXAoIGl0bSA9PiB7XG5cdFx0XHRyZXR1cm4geyAuLi5pdG0sIHBhZ2U6IG51bGwgfTtcblx0XHR9KTtcblxuXHRcdGlmKCBwcm9wcy5kZWZhdWx0ICkge1xuXHRcdFx0dGhpcy5zZWxlY3QoIHByb3BzLmRlZmF1bHQgKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiggdGhpcy5faXRlbXMubGVuZ3RoICkge1xuXHRcdFx0dGhpcy5zZWxlY3QoIHRoaXMuX2l0ZW1zWzBdLm5hbWUgKTtcblx0XHR9XG5cdH1cblxuXHRzZWxlY3QoIG5hbWU6IHN0cmluZyApIHtcblx0XHRsZXQgc2VsID0gdGhpcy5xdWVyeSggYC5zZWxlY3RlZGAgKTtcblx0XHRpZiggc2VsICkge1xuXHRcdFx0c2VsLnNldENsYXNzKCBcInNlbGVjdGVkXCIsIGZhbHNlICk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcGcgPSB0aGlzLl9pdGVtcy5maW5kKCB4ID0+IHgubmFtZT09bmFtZSApO1xuXHRcdGlmKCBwZyApIHtcblx0XHRcdGlmKCAhcGcucGFnZSApIHtcblx0XHRcdFx0cGcucGFnZSA9IHRoaXMuX2NyZWF0ZVBhZ2UoIHBnICk7XG5cdFx0XHRcdHRoaXMuYXBwZW5kQ29udGVudCggcGcucGFnZSApO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWwgPSBwZy5wYWdlO1xuXHRcdFx0aWYoIHNlbCApIHtcblx0XHRcdFx0c2VsLnNldENsYXNzKCBcInNlbGVjdGVkXCIsIHRydWUgKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdHByaXZhdGUgX2NyZWF0ZVBhZ2UoIHBhZ2U6IF9TdGFja0l0ZW0gKSB7XG5cdFx0XG5cdFx0bGV0IGNvbnRlbnQ6IENvbXBvbmVudDtcblx0XHQvL2lmKCBwYWdlLmNvbnRlbnQgaW5zdGFuY2VvZiBDb21wb25lbnRCdWlsZGVyICkge1xuXHRcdC8vXHRjb250ZW50ID0gcGFnZS5jb250ZW50LmNyZWF0ZSggKTtcblx0XHQvL31cblx0XHQvL2Vsc2Uge1xuXHRcdFx0Y29udGVudCA9IHBhZ2UuY29udGVudDtcblx0XHQvL31cblx0XHRcblx0XHRjb250ZW50Py5zZXREYXRhKCBcInN0YWNrbmFtZVwiLCBwYWdlLm5hbWUgKTtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxufVxuXG4iLCAiLyoqIFxuICogIF9fXyAgX19fIF9fXG4gKiAgXFwgIFxcLyAgLyAgLyBfXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xuICogICAvICAgIFxcX19fXyAgIF98ICBcbiAqICAvX18vXFxfX1xcICAgfF98XG4gKiBcbiAqIEBmaWxlIGljb24udHNcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxuICogXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRQcm9wcyB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50JztcblxuaW1wb3J0IFwiLi9pY29uLm1vZHVsZS5zY3NzXCJcblxudHlwZSBzb2x2ZUNhbGxiYWNrID0gKGRhdGE6c3RyaW5nKT0+dm9pZDtcblxuLyoqXG4gKiBcbiAqL1xuXG5jbGFzcyBTdmdMb2FkZXIge1xuXHRwcml2YXRlIGNhY2hlOiBNYXA8c3RyaW5nLHN0cmluZz47XG5cdHByaXZhdGUgd2FpdGVyczogTWFwPHN0cmluZyxzb2x2ZUNhbGxiYWNrW10+O1xuXG5cdGNvbnN0cnVjdG9yKCApIHtcblx0XHR0aGlzLmNhY2hlID0gbmV3IE1hcCggKTtcblx0XHR0aGlzLndhaXRlcnMgPSBuZXcgTWFwKCApO1xuXHR9XG5cblx0YXN5bmMgbG9hZCggZmlsZTogc3RyaW5nICk6IFByb21pc2U8c3RyaW5nPiB7XG5cblx0XHRpZiggdGhpcy5jYWNoZS5oYXMoZmlsZSkgKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCB0aGlzLmNhY2hlLmdldChmaWxlKSApO1xuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUscmVqZWN0KSA9PiB7XG5cdFx0XHRpZiggdGhpcy53YWl0ZXJzLmhhcyhmaWxlKSApIHtcblx0XHRcdFx0dGhpcy53YWl0ZXJzLmdldChmaWxlKS5wdXNoKCByZXNvbHZlICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dGhpcy53YWl0ZXJzLnNldCggZmlsZSwgW3Jlc29sdmVdICk7XG5cdFx0XHRcdHRoaXMuX2xvYWQoIGZpbGUgKVxuXHRcdFx0XHRcdC50aGVuKCAoIGRhdGE6IHN0cmluZyApID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUudGltZUVuZCggZmlsZSApO1xuXHRcdFx0XHRcdFx0dGhpcy5jYWNoZS5zZXQoIGZpbGUsIGRhdGEgKTtcblx0XHRcdFx0XHRcdGNvbnN0IHd3ID0gdGhpcy53YWl0ZXJzLmdldCggZmlsZSApO1xuXHRcdFx0XHRcdFx0d3cuZm9yRWFjaCggY2IgPT4gY2IoZGF0YSApICk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgX2xvYWQoIGZpbGU6IHN0cmluZyApOiBQcm9taXNlPHN0cmluZz4ge1xuXHRcdGNvbnNvbGUudGltZSggZmlsZSApO1xuXHRcdGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCBmaWxlICk7XG5cdFx0aWYoIHJlcy5vayApIHtcblx0XHRcdHJldHVybiByZXMudGV4dCggKTtcblx0XHR9XG5cdH1cblxufVxuXG5leHBvcnQgY29uc3Qgc3ZnTG9hZGVyID0gbmV3IFN2Z0xvYWRlciggKTtcblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIEljb25Qcm9wcyBleHRlbmRzIENvbXBvbmVudFByb3BzIHtcblx0aWNvbklkPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBjbGFzcyBJY29uIGV4dGVuZHMgQ29tcG9uZW50PEljb25Qcm9wcz4ge1xuXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogSWNvblByb3BzICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0dGhpcy5zZXRJY29uKCBwcm9wcy5pY29uSWQgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBjaGFuZ2UgdGhlIGljb24gY29udGVudFxuXHQgKiBAcGFyYW0gaWNvbklkIGlmIG5hbWUgaXMgc3RhcnRpbmcgd2l0aCB2YXI6IHRoZW4gd2UgdXNlIGNzcyB2YXJpYWJsZSBuYW1lIGEgcGF0aFxuXHQgKiBAZXhhbXBsZVxuXHQgKiBcblx0ICogc2V0SWNvbiggXCJ2YXI6aG9tZVwiIClcblx0ICogXG5cdCAqIGltcG9ydCBteWljb24gZnJvbSBcIi4vbXlpY29uLnN2Z1wiXG5cdCAqIHNldEljb24oIG15aWNvbiApO1xuXHQgKiBcblx0ICovXG5cblx0c2V0SWNvbiggaWNvbklkOiBzdHJpbmcgKSB7XG5cdFx0aWYoIGljb25JZCApIHtcblx0XHRcdGlmKCBpY29uSWQuc3RhcnRzV2l0aCgndmFyOicpICkge1xuXHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0Y29uc3QgcGF0aCA9IGljb25JZC5zdWJzdHJpbmcoIDQgKTtcblx0XHRcdFx0XHRpY29uSWQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSggcGF0aCApO1xuXHRcdFx0XHR9IHdoaWxlKCBpY29uSWQuc3RhcnRzV2l0aCgndmFyOicpICk7XG5cdFx0XHR9IFxuXG5cdFx0XHRpZiggaWNvbklkLnN0YXJ0c1dpdGgoXCJkYXRhOmltYWdlL3N2Zyt4bWwsPHN2Z1wiKSApIHtcblx0XHRcdFx0dGhpcy5kb20uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBpY29uSWQuc3Vic3RyaW5nKDE5KSApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggaWNvbklkLmVuZHNXaXRoKFwiLnN2Z1wiKSApIHtcblx0XHRcdFx0c3ZnTG9hZGVyLmxvYWQoIGljb25JZCApLnRoZW4oIHN2ZyA9PiB7XG5cdFx0XHRcdFx0dGhpcy5jbGVhckNvbnRlbnQoICk7XG5cdFx0XHRcdFx0dGhpcy5kb20uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBzdmcgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dGhpcy5zZXRDb250ZW50KCBuZXcgQ29tcG9uZW50KCB7IHRhZzogXCJpbWdcIiwgYXR0cnM6IHsgc3JjOiBpY29uSWQgfSB9ICkgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLmNsZWFyQ29udGVudCggKTtcblx0XHRcdHRoaXMuYWRkQ2xhc3MoIFwiZW1wdHlcIiApO1xuXHRcdH1cblx0fVxufVxuXG5cblxuXG4iLCAiLyoqIFxuICogIF9fXyAgX19fIF9fXG4gKiAgXFwgIFxcLyAgLyAgLyBfXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xuICogICAvICAgIFxcX19fXyAgIF98ICBcbiAqICAvX18vXFxfX1xcICAgfF98XG4gKiBcbiAqIEBmaWxlIGJ1dHRvbi50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudEV2ZW50cywgQ29tcG9uZW50UHJvcHMsIEV2Q2xpY2sgfSBmcm9tIFwiLi4vLi4vY29yZS9jb21wb25lbnRcIlxuaW1wb3J0IHsgRXZlbnRDYWxsYmFjayB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV9ldmVudHMuanMnO1xuaW1wb3J0IHsgVW5zYWZlSHRtbCB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV90b29scy5qcyc7XG5cbmltcG9ydCB7IEljb24gfSBmcm9tIFwiLi4vaWNvbi9pY29uXCJcblxuaW1wb3J0IFwiLi9idXR0b24ubW9kdWxlLnNjc3NcIjtcblxuXG4vKipcbiAqIEJ1dHRvbiBldmVudHNcbiAqL1xuXG5pbnRlcmZhY2UgQnV0dG9uRXZlbnRzIGV4dGVuZHMgQ29tcG9uZW50RXZlbnRzIHtcblx0Y2xpY2s6IEV2Q2xpY2s7XG59XG5cbi8qKlxuICogQnV0dG9uIHByb3BlcnRpZXMuXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBCdXR0b25Qcm9wcyBleHRlbmRzIENvbXBvbmVudFByb3BzIHtcblx0bGFiZWw/OiBzdHJpbmc7XG5cdGljb24/OiBzdHJpbmc7XG5cdGNsaWNrPzogRXZlbnRDYWxsYmFjazxFdkNsaWNrPjtcbn1cblxuLyoqXG4gKiBCdXR0b24gY29tcG9uZW50LlxuICovXG5cbmV4cG9ydCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBDb21wb25lbnQ8QnV0dG9uUHJvcHMsQnV0dG9uRXZlbnRzPiB7XG5cblx0LyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBCdXR0b24uXG4gICAgICogXG4gICAgICogQHBhcmFtIHByb3BzIC0gVGhlIHByb3BlcnRpZXMgZm9yIHRoZSBidXR0b24gY29tcG9uZW50LCBpbmNsdWRpbmcgbGFiZWwgYW5kIGljb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCBidXR0b24gPSBuZXcgQnV0dG9uKHsgbGFiZWw6ICdTdWJtaXQnLCBpY29uOiAnY2hlY2staWNvbicgfSk7XG4gICAgICovXG5cblx0Y29uc3RydWN0b3IoIHByb3BzOiBCdXR0b25Qcm9wcyApIHtcblx0XHRzdXBlciggeyAuLi5wcm9wcywgdGFnOiAnYnV0dG9uJywgY29udGVudDogbnVsbCB9ICk7XG5cblx0XHR0aGlzLm1hcFByb3BFdmVudHMoIHByb3BzLCAnY2xpY2snICk7XG5cdFx0dGhpcy5hZGRET01FdmVudCgnY2xpY2snLCAoZSkgPT4gdGhpcy5fb25fY2xpY2soZSkpO1xuXG5cdFx0dGhpcy5zZXRDb250ZW50KCBbXG5cdFx0XHRuZXcgSWNvbiggeyBpZDogXCJpY29uXCIsIGljb25JZDogdGhpcy5wcm9wcy5pY29uIH0gKSxcblx0XHRcdG5ldyBDb21wb25lbnQoIHsgaWQ6IFwibGFiZWxcIiwgY29udGVudDogdGhpcy5wcm9wcy5sYWJlbCB9ICksXG5cdFx0XSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIGNhbGxlZCBieSB0aGUgc3lzdGVtIG9uIGNsaWNrIGV2ZW50XG5cdCAqL1xuXG5cdHByb3RlY3RlZCBfb25fY2xpY2soIGV2OiBNb3VzZUV2ZW50ICkge1xuXG5cdFx0Ly9pZiAodGhpcy5tX3Byb3BzLm1lbnUpIHtcblx0XHQvL1x0bGV0IG1lbnUgPSBuZXcgTWVudSh7XG5cdFx0Ly9cdFx0aXRlbXM6IGlzRnVuY3Rpb24odGhpcy5tX3Byb3BzLm1lbnUpID8gdGhpcy5tX3Byb3BzLm1lbnUoKSA6IHRoaXMubV9wcm9wcy5tZW51XG5cdFx0Ly9cdH0pO1xuXHRcdC8vXG5cdFx0Ly9cdGxldCByYyA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KCk7XG5cdFx0Ly9cdG1lbnUuZGlzcGxheUF0KHJjLmxlZnQsIHJjLmJvdHRvbSwgJ3RsJyk7XG5cdFx0Ly99XG5cdFx0Ly9lbHNlIHtcblx0XHRcdHRoaXMuZmlyZSgnY2xpY2snLCB7fSApO1xuXHRcdC8vfVxuXG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRldi5zdG9wUHJvcGFnYXRpb24oKTtcblx0fVxuXG5cdC8qKlxuICAgICAqIFNldHMgdGhlIHRleHQgY29udGVudCBvZiB0aGUgYnV0dG9uJ3MgbGFiZWwuXG4gICAgICogXG4gICAgICogQHBhcmFtIHRleHQgLSBUaGUgbmV3IHRleHQgb3IgSFRNTCBjb250ZW50IGZvciB0aGUgbGFiZWwuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBidXR0b24uc2V0VGV4dCgnQ2xpY2sgTWUnKTtcbiAgICAgKiBidXR0b24uc2V0VGV4dChuZXcgVW5zYWZlSHRtbCgnPGI+Qm9sZCBUZXh0PC9iPicpKTtcbiAgICAgKi9cblxuXHRwdWJsaWMgc2V0VGV4dCggdGV4dDogc3RyaW5nIHwgVW5zYWZlSHRtbCApIHtcblx0XHR0aGlzLnF1ZXJ5KCBcIiNsYWJlbFwiICkuc2V0Q29udGVudCggdGV4dCApO1xuXHR9XG5cblx0LyoqXG4gICAgICogU2V0cyB0aGUgaWNvbiBvZiB0aGUgYnV0dG9uLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBpY29uIC0gVGhlIG5ldyBpY29uIElEIHRvIHNldCBvbiB0aGUgYnV0dG9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYnV0dG9uLnNldEljb24oJ25ldy1pY29uLWlkJyk7XG4gICAgICovXG5cblx0cHVibGljIHNldEljb24oIGljb246IHN0cmluZyApIHtcblx0XHR0aGlzLnF1ZXJ5PEljb24+KCBcIiNpY29uXCIgKS5zZXRJY29uKCBpY29uICk7XG5cdH1cbn1cblxuIiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSBidG5ncm91cC50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudEV2ZW50LCBDb21wb25lbnRFdmVudHMsIENvbXBvbmVudFByb3BzLCBGbGV4IH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgRXZlbnRDYWxsYmFjayB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV9ldmVudHMnO1xuaW1wb3J0IHsgaXNTdHJpbmcgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfdG9vbHMnO1xuaW1wb3J0IHsgX3RyIH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX2kxOG4nXG5cbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL2J1dHRvbi9idXR0b24nO1xuaW1wb3J0IHsgQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMuanMnO1xuaW1wb3J0IHsgTGFiZWwgfSBmcm9tICcuLi9sYWJlbC9sYWJlbC5qcyc7XG5pbXBvcnQgeyBFdkJ0bkNsaWNrIH0gZnJvbSAnLi4vZGlhbG9nL2RpYWxvZy5qcyc7XG5cbmltcG9ydCBcIi4vYnRuZ3JvdXAubW9kdWxlLnNjc3NcIlxuXG5cbnR5cGUgcHJlZGVmaW5lZCA9IFwib2tcIiB8IFwiY2FuY2VsXCIgfCBcInllc1wiIHwgXCJub1wiIHwgXCJyZXRyeVwiIHwgXCJhYm9ydFwiIHwgXCItXCI7XHQvLyAtID0gZmxleFxuZXhwb3J0IHR5cGUgQnRuR3JvdXBJdGVtID0gcHJlZGVmaW5lZCB8IEJ1dHRvbiB8IExhYmVsO1xuXG5pbnRlcmZhY2UgQnRuQ2xpY2tFdmVudCBleHRlbmRzIENvbXBvbmVudEV2ZW50IHtcblx0ZW1pdHRlcjogcHJlZGVmaW5lZDtcbn1cblxuaW50ZXJmYWNlIEJ0bkdyb3VwRXZlbnRzIGV4dGVuZHMgQ29tcG9uZW50RXZlbnRzIHtcblx0YnRuY2xpY2s6IEJ0bkNsaWNrRXZlbnQ7XG59XG5cbmludGVyZmFjZSBCdG5Hcm91cFByb3BzIGV4dGVuZHMgT21pdDxDb21wb25lbnRQcm9wcyxcImNvbnRlbnRcIj4ge1xuXHRhbGlnbj86IFwibGVmdFwiIHwgXCJjZW50ZXJcIiB8IFwicmlnaHRcIjtcdC8vIGxlZnQgZGVmYXVsdFxuXHR2ZXJ0aWNhbD86IGJvb2xlYW47XHRcdFx0XHRcdFxuXHRpdGVtczogQnRuR3JvdXBJdGVtW107XG5cdHJldmVyc2U/OiBib29sZWFuLFxuXHRidG5jbGljaz86IEV2ZW50Q2FsbGJhY2s8RXZCdG5DbGljaz47XG59XG5cbmV4cG9ydCBjbGFzcyBCdG5Hcm91cCBleHRlbmRzIEJveDxCdG5Hcm91cFByb3BzLEJ0bkdyb3VwRXZlbnRzPiB7XG5cblx0Y29uc3RydWN0b3IoIHByb3BzOiBCdG5Hcm91cFByb3BzICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0aWYoIHByb3BzLmFsaWduICkge1xuXHRcdFx0dGhpcy5hZGRDbGFzcyggXCJhbGlnbi1cIitwcm9wcy5hbGlnbiApO1xuXHRcdH1cblxuXHRcdHRoaXMuYWRkQ2xhc3MoIHByb3BzLnZlcnRpY2FsID8gXCJ4NHZib3hcIiA6IFwieDRoYm94XCIgKTtcblxuXHRcdGlmKCBwcm9wcy5pdGVtcyApIHtcblx0XHRcdHRoaXMuc2V0QnV0dG9ucyggcHJvcHMuaXRlbXMgKTtcblx0XHR9XG5cblx0XHR0aGlzLm1hcFByb3BFdmVudHMoIHByb3BzLCBcImJ0bmNsaWNrXCIgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICogQHBhcmFtIGJ0bnMgXG5cdCAqL1xuXG5cdHNldEJ1dHRvbnMoIGJ0bnM6IEJ0bkdyb3VwSXRlbVtdICkge1xuXG5cdFx0dGhpcy5jbGVhckNvbnRlbnQoICk7XG5cblx0XHRjb25zdCBjaGlsZHM6IENvbXBvbmVudFtdID0gW107XG5cblx0XHRidG5zPy5mb3JFYWNoKCAoYjogc3RyaW5nIHwgQ29tcG9uZW50KSA9PiB7XG5cblx0XHRcdGlmKCBiPT09XCItXCIgKSB7XG5cdFx0XHRcdGIgPSBuZXcgRmxleCggKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoIGlzU3RyaW5nKGIpICkge1xuXHRcdFx0XHRsZXQgdGl0bGU6IHN0cmluZztcblx0XHRcdFx0Y29uc3Qgbm0gPSBiIGFzIHByZWRlZmluZWQ7XG5cblx0XHRcdFx0c3dpdGNoKCBiIGFzIHByZWRlZmluZWQgKSB7XG5cdFx0XHRcdFx0Y2FzZSBcIm9rXCI6IFx0XHR0aXRsZSA9IF90ci5nbG9iYWwub2s7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJjYW5jZWxcIjogXHR0aXRsZSA9IF90ci5nbG9iYWwuY2FuY2VsOyBicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiYWJvcnRcIjpcdHRpdGxlID0gX3RyLmdsb2JhbC5hYm9ydDsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIm5vXCI6XHRcdHRpdGxlID0gX3RyLmdsb2JhbC5ubzsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcInllc1wiOlx0XHR0aXRsZSA9IF90ci5nbG9iYWwueWVzOyBicmVhaztcblx0XHRcdFx0XHRjYXNlIFwicmV0cnlcIjpcdHRpdGxlID0gX3RyLmdsb2JhbC5yZXRyeTsgYnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRiID0gbmV3IEJ1dHRvbiggeyBsYWJlbDogdGl0bGUsIGNsaWNrOiAoICkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuZmlyZSggXCJidG5jbGlja1wiLCB7ZW1pdHRlcjpubX0gKVxuXHRcdFx0XHR9IH0gKTtcblx0XHRcdH1cblxuXHRcdFx0Y2hpbGRzLnB1c2goIGIgKTtcblx0XHR9KTtcblxuXHRcdHN1cGVyLnNldENvbnRlbnQoIGNoaWxkcyApO1xuXHR9XG59IiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSBsYWJlbC50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudFByb3BzIH0gZnJvbSBcIi4uLy4uL2NvcmUvY29tcG9uZW50XCJcbmltcG9ydCB7IEljb24gfSBmcm9tIFwiLi4vaWNvbi9pY29uXCJcblxuaW1wb3J0IFwiLi9sYWJlbC5tb2R1bGUuc2Nzc1wiO1xuaW1wb3J0IHsgVW5zYWZlSHRtbCB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV90b29scy5qcyc7XG5cbmludGVyZmFjZSBMYWJlbFByb3BzIGV4dGVuZHMgQ29tcG9uZW50UHJvcHMge1xuXHR0ZXh0Pzogc3RyaW5nIHwgVW5zYWZlSHRtbDtcblx0aWNvbj86IHN0cmluZztcblx0bGFiZWxGb3I/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBMYWJlbCBleHRlbmRzIENvbXBvbmVudDxMYWJlbFByb3BzPiB7XG5cblx0Y29uc3RydWN0b3IoIHA6IExhYmVsUHJvcHMgKSB7XG5cdFx0c3VwZXIoIHsgLi4ucCwgY29udGVudDogbnVsbCB9ICk7XG5cblx0XHQvLyBzbWFsbCBoYWNrIGZvciByZWFjdDpcblx0XHQvL1x0cC5jb250ZW50IG1heSBiZSB0aGUgdGV4dFxuXHRcdFxuXHRcdHRoaXMuc2V0Q29udGVudCggW1xuXHRcdFx0bmV3IEljb24oIHsgaWQ6XCJpY29uXCIsIGljb25JZDogdGhpcy5wcm9wcy5pY29uIH0gKSxcblx0XHRcdG5ldyBDb21wb25lbnQoIHsgdGFnOiAnc3BhbicsIGlkOiAndGV4dCcsIGNvbnRlbnQ6IHRoaXMucHJvcHMudGV4dCA/PyBwLmNvbnRlbnQgfSApXG5cdFx0XSApO1xuXG5cdFx0aWYoIHAubGFiZWxGb3IgKSB7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJmb3JcIiwgcC5sYWJlbEZvciApO1xuXHRcdH1cblx0fVxuXG5cdHNldFRleHQoIHRleHQ6IHN0cmluZyB8IFVuc2FmZUh0bWwgKSB7XG5cdFx0dGhpcy5xdWVyeSggXCIjdGV4dFwiICkuc2V0Q29udGVudCggdGV4dCApO1xuXHR9XG5cblx0c2V0SWNvbiggaWNvbjogc3RyaW5nICkge1xuXHRcdHRoaXMucXVlcnk8SWNvbj4oIFwiI2ljb25cIiApLnNldEljb24oIGljb24gKTtcblx0fVxufVxuXG4iLCAiLyoqIFxuICogIF9fXyAgX19fIF9fXG4gKiAgXFwgIFxcLyAgLyAgLyBfXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xuICogICAvICAgIFxcX19fXyAgIF98ICBcbiAqICAvX18vXFxfX1xcICAgfF98XG4gKiBcbiAqIEBmaWxlIHNpemVyLnRzXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcbiAqIFxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50RXZlbnQsIENvbXBvbmVudEV2ZW50cywgQ29tcG9uZW50UHJvcHMsIGNvbXBvbmVudEZyb21ET00gfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV90b29scy5qcyc7XG5cbmltcG9ydCBcIi4vc2l6ZXIubW9kdWxlLnNjc3NcIlxuXG4vKipcbiAqIFxuICovXG5cbmludGVyZmFjZSBFdlNpemVDaGFuZ2UgZXh0ZW5kcyBDb21wb25lbnRFdmVudCB7XG5cdHNpemU6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIENTaXplckV2ZW50IGV4dGVuZHMgQ29tcG9uZW50RXZlbnRzIHtcblx0cmVzaXplOiBFdlNpemVDaGFuZ2U7XG59XG5cblxuZXhwb3J0IGNsYXNzIENTaXplciBleHRlbmRzIENvbXBvbmVudDxDb21wb25lbnRQcm9wcyxDU2l6ZXJFdmVudD4ge1xuXG5cdHByaXZhdGUgX3R5cGU6IHN0cmluZztcblx0cHJpdmF0ZSBfcmVmOiBDb21wb25lbnQ7XG5cdHByaXZhdGUgX2RlbHRhOiBQb2ludDtcblxuXHRjb25zdHJ1Y3RvciggdHlwZTogc3RyaW5nLCB0YXJnZXQ/OiBDb21wb25lbnQgKSB7XG5cdFx0c3VwZXIoIHt9ICk7XG5cblx0XHR0aGlzLl90eXBlID0gdHlwZTtcblx0XHR0aGlzLmFkZENsYXNzKCB0eXBlICk7XG5cblx0XHR0aGlzLmFkZERPTUV2ZW50KCBcInBvaW50ZXJkb3duXCIsICggZTogUG9pbnRlckV2ZW50ICkgPT4ge1xuXHRcdFx0dGhpcy5zZXRDYXB0dXJlKCBlLnBvaW50ZXJJZCApO1xuXHRcdFx0dGhpcy5fcmVmID0gdGFyZ2V0ID8/IGNvbXBvbmVudEZyb21ET00oIHRoaXMuZG9tLnBhcmVudEVsZW1lbnQgKTtcblxuXHRcdFx0dGhpcy5fZGVsdGEgPSB7eDowLHk6MH07XG5cdFx0XHRjb25zdCByYyA9IHRoaXMuX3JlZi5nZXRCb3VuZGluZ1JlY3QoKTtcblxuXHRcdFx0aWYoIHRoaXMuX3R5cGUuaW5jbHVkZXMoXCJsZWZ0XCIpICkge1xuXHRcdFx0XHR0aGlzLl9kZWx0YS54ID0gZS5wYWdlWC1yYy5sZWZ0O1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRoaXMuX2RlbHRhLnggPSBlLnBhZ2VYLShyYy5sZWZ0K3JjLndpZHRoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoIHRoaXMuX3R5cGUuaW5jbHVkZXMoXCJ0b3BcIikgKSB7XG5cdFx0XHRcdHRoaXMuX2RlbHRhLnkgPSBlLnBhZ2VZLXJjLnRvcDtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9kZWx0YS55ID0gZS5wYWdlWS0ocmMudG9wK3JjLmhlaWdodCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLmFkZERPTUV2ZW50KCBcInBvaW50ZXJ1cFwiLCAoIGU6IFBvaW50ZXJFdmVudCApID0+IHtcblx0XHRcdHRoaXMucmVsZWFzZUNhcHR1cmUoIGUucG9pbnRlcklkICk7XG5cdFx0XHR0aGlzLl9yZWYgPSBudWxsO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5hZGRET01FdmVudCggXCJwb2ludGVybW92ZVwiLCAoIGU6IFBvaW50ZXJFdmVudCApID0+IHtcblx0XHRcdHRoaXMuX29uTW91c2VNb3ZlKCBlICk7XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIF9vbk1vdXNlTW92ZSggZTogUG9pbnRlckV2ZW50ICkge1xuXHRcdGlmKCAhdGhpcy5fcmVmICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHB0ID0geyB4OiBlLnBhZ2VYLXRoaXMuX2RlbHRhLngsIHk6IGUucGFnZVktdGhpcy5fZGVsdGEueSB9O1xuXHRcdGNvbnN0IHJjID0gdGhpcy5fcmVmLmdldEJvdW5kaW5nUmVjdCggKTtcblxuXHRcdGxldCBucjogYW55ID0ge307XG5cdFx0bGV0IGhvcnogPSB0cnVlO1xuXG5cdFx0aWYoIHRoaXMuX3R5cGUuaW5jbHVkZXMoXCJ0b3BcIikgKSB7XG5cdFx0XHRuci50b3AgPSBwdC55LFxuXHRcdFx0bnIuaGVpZ2h0ID0gKHJjLnRvcCtyYy5oZWlnaHQpLXB0Lnk7XG5cdFx0XHRob3J6ID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYoIHRoaXMuX3R5cGUuaW5jbHVkZXMoXCJib3R0b21cIikgKSB7XG5cdFx0XHQvL25yLnRvcCA9IHJjLnRvcDtcblx0XHRcdG5yLmhlaWdodCA9IChwdC55LXJjLnRvcCk7XG5cdFx0XHRob3J6ID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYoIHRoaXMuX3R5cGUuaW5jbHVkZXMoXCJsZWZ0XCIpICkge1xuXHRcdFx0bnIubGVmdCA9IHB0Lng7XG5cdFx0XHRuci53aWR0aCA9ICgocmMubGVmdCtyYy53aWR0aCktcHQueCk7XG5cdFx0fVxuXG5cdFx0aWYoIHRoaXMuX3R5cGUuaW5jbHVkZXMoXCJyaWdodFwiKSApIHtcblx0XHRcdC8vbnIubGVmdCA9IHJjLmxlZnQ7XG5cdFx0XHRuci53aWR0aCA9IChwdC54LXJjLmxlZnQpO1xuXHRcdH1cblxuXHRcdHRoaXMuX3JlZi5zZXRTdHlsZSggbnIgKTtcblxuXHRcdGNvbnN0IG5yYyA9IHRoaXMuX3JlZi5nZXRCb3VuZGluZ1JlY3QoICk7XG5cdFx0dGhpcy5maXJlKCBcInJlc2l6ZVwiLCB7IHNpemU6IGhvcnogPyBucmMud2lkdGggOiBucmMuaGVpZ2h0IH0pXG5cblx0XHRlLnByZXZlbnREZWZhdWx0KCApO1xuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCApO1xuXHR9XG59IiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSBwb3B1cC50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudEV2ZW50LCBDb21wb25lbnRFdmVudHMsIENvbXBvbmVudFByb3BzLCBjb21wb25lbnRGcm9tRE9NLCBtYWtlVW5pcXVlQ29tcG9uZW50SWQgfSBmcm9tIFwiLi4vLi4vY29yZS9jb21wb25lbnRcIlxuaW1wb3J0IHsgQ1NpemVyIH0gZnJvbSAnLi4vc2l6ZXJzL3NpemVyJztcbmltcG9ydCB7IFJlY3QsIFBvaW50IH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX3Rvb2xzLmpzJztcblxuaW1wb3J0IFwiLi9wb3B1cC5tb2R1bGUuc2Nzc1wiXG5cblxuZXhwb3J0IGludGVyZmFjZSBQb3B1cEV2ZW50cyBleHRlbmRzIENvbXBvbmVudEV2ZW50cyB7XG5cdGNsb3NlZDogQ29tcG9uZW50RXZlbnQ7XG5cdG9wZW5lZDogQ29tcG9uZW50RXZlbnQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUG9wdXBQcm9wcyBleHRlbmRzIENvbXBvbmVudFByb3BzIHtcblx0bW9kYWw/OiBib29sZWFuO1xuXHRhdXRvQ2xvc2U/OiBib29sZWFuIHwgc3RyaW5nO1xuXHRzaXphYmxlPzogYm9vbGVhbjtcblx0bW92YWJsZT86IGJvb2xlYW47XG59XG5cblxubGV0IG1vZGFsX21hc2s6IENvbXBvbmVudDtcbmxldCBtb2RhbF9jb3VudCA9IDA7XG5cbmxldCBtb2RhbF9zdGFjazogUG9wdXBbXSA9IFtdO1xubGV0IGF1dG9jbG9zZV9saXN0OiBQb3B1cFtdID0gW107XG5sZXQgcG9wdXBfbGlzdDogIFBvcHVwW10gPSBbXTtcblxuXG5cbi8qKlxuICogXG4gKi9cblxuZXhwb3J0IGNsYXNzIFBvcHVwPFAgZXh0ZW5kcyBQb3B1cFByb3BzID0gUG9wdXBQcm9wcywgRSBleHRlbmRzIFBvcHVwRXZlbnRzID0gUG9wdXBFdmVudHM+IGV4dGVuZHMgQ29tcG9uZW50PFAsRT4ge1xuXG5cdHByaXZhdGUgX2lzb3BlbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9pc3Nob3duID0gZmFsc2U7XG5cblx0Y29uc3RydWN0b3IoIHByb3BzOiBQICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0aWYoIHRoaXMucHJvcHMuc2l6YWJsZSApIHtcblx0XHRcdHRoaXMuX2NyZWF0ZVNpemVycyggKTtcblx0XHR9XG5cdH1cblxuXHRkaXNwbGF5TmVhciggcmM6IFJlY3QsIGRzdCA9IFwidG9wIGxlZnRcIiwgc3JjID0gXCJ0b3AgbGVmdFwiLCBvZmZzZXQgPSB7eDowLHk6MH0gKSB7XG5cblx0XHR0aGlzLnNldFN0eWxlKCB7IGxlZnQ6IFwiMHB4XCIsIHRvcDogXCIwcHhcIiB9ICk7XHQvLyBhdm9pZCBzY3JvbGxiYXJcblx0XHR0aGlzLl9zaG93KCApO1x0XHRcdFx0XHRcdFx0XHRcdC8vIHRvIGNvbXB1dGUgc2l6ZVxuXHRcdFxuXHRcdGxldCBybSA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KCk7XG5cblx0XHRsZXQgeHJlZiA9IHJjLmxlZnQ7XG5cdFx0bGV0IHlyZWYgPSByYy50b3A7XG5cblx0XHRpZiggc3JjLmluZGV4T2YoJ3JpZ2h0Jyk+PTAgKSB7XG5cdFx0XHR4cmVmID0gKHJjLmxlZnQrcmMud2lkdGgpO1xuXHRcdH1cblx0XHRlbHNlIGlmKCBzcmMuaW5kZXhPZignY2VudGVyJyk+PTAgKSB7XG5cdFx0XHR4cmVmID0gcmMubGVmdCArIHJjLndpZHRoLzI7XG5cdFx0fVxuXG5cdFx0aWYoIHNyYy5pbmRleE9mKCdib3R0b20nKT49MCApIHtcblx0XHRcdHlyZWYgPSByYy5ib3R0b207XG5cdFx0fVxuXHRcdGVsc2UgaWYoIHNyYy5pbmRleE9mKCdtaWRkbGUnKT49MCApIHtcblx0XHRcdHlyZWYgPSByYy50b3AgKyByYy5oZWlnaHQvMjtcblx0XHR9XG5cblx0XHRsZXQgaGFsaWduID0gJ2wnO1xuXHRcdGlmIChkc3QuaW5kZXhPZigncmlnaHQnKSA+PSAwKSB7XG5cdFx0XHR4cmVmIC09IHJtLndpZHRoO1xuXHRcdH1cblx0XHRlbHNlIGlmKCBkc3QuaW5kZXhPZignY2VudGVyJyk+PTAgKSB7XG5cdFx0XHR4cmVmIC09IHJtLndpZHRoLzI7XG5cdFx0fVxuXG5cdFx0bGV0IHZhbGlnbiA9ICd0Jztcblx0XHRpZiAoZHN0LmluZGV4T2YoJ2JvdHRvbScpID49IDApIHtcblx0XHRcdHlyZWYgLT0gcm0uaGVpZ2h0O1xuXHRcdH1cblx0XHRlbHNlIGlmKCBkc3QuaW5kZXhPZignbWlkZGxlJyk+PTAgKSB7XG5cdFx0XHR5cmVmIC09IHJtLmhlaWdodC8yO1xuXHRcdH1cblx0XHRcblx0XHRpZiAob2Zmc2V0KSB7XG5cdFx0XHR4cmVmICs9IG9mZnNldC54O1xuXHRcdFx0eXJlZiArPSBvZmZzZXQueTtcblx0XHR9XG5cblx0XHQvLyBvdXIgcGFyZW50IGlzIGJvZHksIHNvIHRha2UgY2FyZSBvZiB0aGUgc2Nyb2xsIHBvc2l0aW9uXG5cdFx0eHJlZiArPSBkb2N1bWVudC5zY3JvbGxpbmdFbGVtZW50LnNjcm9sbExlZnQ7XG5cdFx0eXJlZiArPSBkb2N1bWVudC5zY3JvbGxpbmdFbGVtZW50LnNjcm9sbFRvcDtcblxuXHRcdHRoaXMuZGlzcGxheUF0KCB4cmVmLCB5cmVmICk7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdGRpc3BsYXlDZW50ZXIoICkge1xuXHRcdHRoaXMuZGlzcGxheU5lYXIoIG5ldyBSZWN0KCB3aW5kb3cuaW5uZXJXaWR0aC8yLCB3aW5kb3cuaW5uZXJIZWlnaHQvMiwgMCwgMCApLCBcImNlbnRlciBtaWRkbGVcIiApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRkaXNwbGF5QXQoIHg6IG51bWJlciwgeTogbnVtYmVyICkge1xuXHRcdC8vVE9ETzogY2hlY2sgaXMgYWxyZWFkeSB2aXNpYmxlXG5cdFx0dGhpcy5zZXRTdHlsZSgge1xuXHRcdFx0bGVmdDogeCtcInB4XCIsXG5cdFx0XHR0b3A6IHkrXCJweFwiLFxuXHRcdH0pXG5cblx0XHR0aGlzLl9zaG93KCApO1xuXG5cdFx0Y29uc3QgcmMgPSB0aGlzLmdldEJvdW5kaW5nUmVjdCggKTtcblx0XHRjb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gMTY7XG5cdFx0Y29uc3QgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IC0gMTY7XG5cdFx0XG5cdFx0aWYoIHJjLnJpZ2h0PndpZHRoICkge1xuXHRcdFx0dGhpcy5zZXRTdHlsZVZhbHVlKCBcImxlZnRcIiwgd2lkdGgtcmMud2lkdGggKTtcblx0XHR9XG5cblx0XHRpZiggcmMuYm90dG9tPmhlaWdodCApIHtcblx0XHRcdHRoaXMuc2V0U3R5bGVWYWx1ZSggXCJ0b3BcIiwgaGVpZ2h0LXJjLmhlaWdodCApO1xuXHRcdH1cblxuXHRcdGlmKCB0aGlzLnByb3BzLm1vdmFibGUgKSB7XG5cdFx0XHRjb25zdCBtb3ZlcnMgPSB0aGlzLnF1ZXJ5QWxsKCBcIi5jYXB0aW9uLWVsZW1lbnRcIiApO1xuXHRcdFx0bW92ZXJzLmZvckVhY2goIG0gPT4gbmV3IENNb3ZlcihtLHRoaXMpICk7XG5cblx0XHRcdGlmKCB0aGlzLmhhc0NsYXNzKFwicG9wdXAtY2FwdGlvblwiKSApIHtcblx0XHRcdFx0bmV3IENNb3Zlcih0aGlzLHRoaXMpO1xuXHRcdFx0fVx0XHRcblx0XHR9XG5cblx0XHR0aGlzLmZpcmUoIFwib3BlbmVkXCIsIHt9ICk7XG5cdH1cblxuXHRwcml2YXRlIF9zaG93KCApIHtcblx0XHRcblx0XHRpZiggdGhpcy5wcm9wcy5tb2RhbCAmJiAhdGhpcy5faXNzaG93biApIHtcblx0XHRcdHRoaXMuX3Nob3dNb2RhbE1hc2soICk7XG5cdFx0XHRtb2RhbF9zdGFjay5wdXNoKCB0aGlzICk7XG5cdFx0XHRtb2RhbF9jb3VudCsrO1xuXHRcdH1cblxuXHRcdHRoaXMuX2lzc2hvd24gPSB0cnVlO1xuXHRcdFxuXHRcdGlmKCB0aGlzLnByb3BzLmF1dG9DbG9zZSApIHtcblx0XHRcdGlmKCBhdXRvY2xvc2VfbGlzdC5sZW5ndGg9PTAgKSB7XG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwicG9pbnRlcmRvd25cIiwgdGhpcy5fZGlzbWlzcyApO1xuXHRcdFx0fVxuXG5cdFx0XHRhdXRvY2xvc2VfbGlzdC5wdXNoKCB0aGlzICk7XG5cdFx0XHR0aGlzLnNldERhdGEoIFwiY2xvc2VcIiwgdGhpcy5wcm9wcy5hdXRvQ2xvc2U9PT10cnVlID8gbWFrZVVuaXF1ZUNvbXBvbmVudElkKCkgOiB0aGlzLnByb3BzLmF1dG9DbG9zZSApO1xuXHRcdH1cblxuXHRcdHBvcHVwX2xpc3QucHVzaCggdGhpcyApO1xuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHRoaXMuZG9tICk7XG5cblx0XHR0aGlzLnNob3coICk7XG5cdH1cblxuXHRvdmVycmlkZSBzaG93KCBzaG93ID0gdHJ1ZSApIHtcblx0XHR0aGlzLl9pc29wZW4gPSBzaG93O1xuXHRcdHN1cGVyLnNob3coIHNob3cgKTtcblx0fVxuXG5cdGlzT3BlbiggKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2lzb3Blbjtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0Y2xvc2UoICkge1xuXHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoIHRoaXMuZG9tICk7XG5cblx0XHQvLyByZW1vdmUgZnJvbSBwb3B1cCBsaXN0XG5cdFx0Y29uc3QgaWR4ID0gcG9wdXBfbGlzdC5pbmRleE9mKCB0aGlzICk7XG5cdFx0Y29uc29sZS5hc3NlcnQoIGlkeD49MCApO1xuXHRcdHBvcHVwX2xpc3Quc3BsaWNlKCBpZHgsIDEgKTtcblxuXHRcdC8vIHJlbW92ZSBmcm9tIGF1dG8gY2xvc2UgbGlzdFxuXHRcdGlmKCB0aGlzLnByb3BzLmF1dG9DbG9zZSApIHtcblx0XHRcdGNvbnN0IGlkeCA9IGF1dG9jbG9zZV9saXN0LmluZGV4T2YoIHRoaXMgKTtcblx0XHRcdGlmKCBpZHg+PTAgKSB7XG5cdFx0XHRcdGF1dG9jbG9zZV9saXN0LnNwbGljZSggaWR4LCAxICk7XG5cdFx0XHRcdGlmKCBhdXRvY2xvc2VfbGlzdC5sZW5ndGg9PTAgKSB7XG5cdFx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggXCJwb2ludGVyZG93blwiLCB0aGlzLl9kaXNtaXNzICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgbWFza1xuXHRcdGlmKCB0aGlzLnByb3BzLm1vZGFsICkge1xuXHRcdFx0Y29uc3QgdG9wID0gbW9kYWxfc3RhY2sucG9wKCApO1xuXHRcdFx0Y29uc29sZS5hc3NlcnQoIHRvcD09dGhpcyApO1xuXHRcdFx0dGhpcy5fdXBkYXRlTW9kYWxNYXNrKCApO1xuXHRcdH1cblxuXHRcdHRoaXMuX2lzc2hvd24gPSBmYWxzZTtcblx0XHR0aGlzLmZpcmUoIFwiY2xvc2VkXCIsIHt9ICk7XG5cdH1cblxuXHQvKipcblx0ICogYmluZGVkXG5cdCAqL1xuXG5cdHByaXZhdGUgX2Rpc21pc3MgPSAoIGU6IFVJRXZlbnQgKSA9PiB7XG5cdFx0Y29uc3Qgb25hYyA9IGF1dG9jbG9zZV9saXN0LnNvbWUoIHg9PiB4LmRvbS5jb250YWlucyhlLnRhcmdldCBhcyBOb2RlKSApXG5cdFx0aWYoIG9uYWMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCggKTtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbiggKTtcblxuXHRcdHRoaXMuZGlzbWlzcyggKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIGRpc21pc3MgYWxsIHBvcHVwIGJlbG9uZ2luZyB0byB0aGUgc2FtZSBncm91cCBhcyAndGhpcydcblx0ICovXG5cblx0ZGlzbWlzcyggYWZ0ZXIgPSBmYWxzZSApIHtcblxuXHRcdGlmKCBhdXRvY2xvc2VfbGlzdC5sZW5ndGg9PTAgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2dyb3VwID0gdGhpcy5nZXREYXRhKCBcImNsb3NlXCIgKTtcblx0XHRjb25zdCBpbmNfZ3JvdXA6IFBvcHVwW10gPSBbXTtcblx0XHRjb25zdCBleGNsX2dyb3VwOiBQb3B1cFtdID0gW107XG5cdFx0XG5cdFx0bGV0IGFpZHggPSAtMTtcblx0XHRpZiggYWZ0ZXIgKSB7XG5cdFx0XHRhaWR4ID0gYXV0b2Nsb3NlX2xpc3QuaW5kZXhPZiggdGhpcyApO1xuXHRcdH1cblxuXHRcdGF1dG9jbG9zZV9saXN0LmZvckVhY2goICh4LGlkeCkgPT4ge1xuXHRcdFx0Y29uc3QgZ3JvdXAgPSB4LmdldERhdGEoIFwiY2xvc2VcIiApO1xuXHRcdFx0aWYoIGdyb3VwPT1jZ3JvdXAgJiYgaWR4PmFpZHgpIHtcblx0XHRcdFx0aW5jX2dyb3VwLnB1c2goIHggKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRleGNsX2dyb3VwLnB1c2goIHggKTtcblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0Y29uc3QgbGlzdCA9IGluY19ncm91cC5yZXZlcnNlKCApO1xuXHRcdGF1dG9jbG9zZV9saXN0ID0gZXhjbF9ncm91cDtcblx0XHRpZiggYXV0b2Nsb3NlX2xpc3QubGVuZ3RoPT0wICkge1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggXCJwb2ludGVyZG93blwiLCB0aGlzLl9kaXNtaXNzICk7XG5cdFx0fVxuXHRcdFxuXHRcdGxpc3QuZm9yRWFjaCggeCA9PiB4LmNsb3NlKCkgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0cHJpdmF0ZSBfc2hvd01vZGFsTWFzayggKSB7XG5cdFx0XG5cdFx0aWYoICFtb2RhbF9tYXNrICkge1xuXHRcdFx0bW9kYWxfbWFzayA9IG5ldyBDb21wb25lbnQoIHtcblx0XHRcdFx0Y2xzOiBcIng0bW9kYWwtbWFza1wiLFxuXHRcdFx0XHRkb21FdmVudHM6IHtcblx0XHRcdFx0XHRjbGljazogdGhpcy5fZGlzbWlzc1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRtb2RhbF9tYXNrLnNob3coIHRydWUgKTtcblx0XHRkb2N1bWVudC5ib2R5Lmluc2VydEFkamFjZW50RWxlbWVudCggXCJiZWZvcmVlbmRcIiwgbW9kYWxfbWFzay5kb20gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0cHJpdmF0ZSBfdXBkYXRlTW9kYWxNYXNrKCApIHtcblx0XHRpZiggLS1tb2RhbF9jb3VudCA9PSAwICkge1xuXHRcdFx0bW9kYWxfbWFzay5zaG93KCBmYWxzZSApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuZG9tLmluc2VydEFkamFjZW50RWxlbWVudCggXCJiZWZvcmViZWdpblwiLCBtb2RhbF9tYXNrLmRvbSApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0cHJpdmF0ZSBfY3JlYXRlU2l6ZXJzKCApIHtcblx0XHR0aGlzLmFwcGVuZENvbnRlbnQoIFtcblx0XHRcdG5ldyBDU2l6ZXIoIFwidG9wXCIgKSxcblx0XHRcdG5ldyBDU2l6ZXIoIFwiYm90dG9tXCIgKSxcblx0XHRcdG5ldyBDU2l6ZXIoIFwibGVmdFwiICksXG5cdFx0XHRuZXcgQ1NpemVyKCBcInJpZ2h0XCIgKSxcblx0XHRcdG5ldyBDU2l6ZXIoIFwidG9wLWxlZnRcIiApLFxuXHRcdFx0bmV3IENTaXplciggXCJib3R0b20tbGVmdFwiICksXG5cdFx0XHRuZXcgQ1NpemVyKCBcInRvcC1yaWdodFwiICksXG5cdFx0XHRuZXcgQ1NpemVyKCBcImJvdHRvbS1yaWdodFwiICksXG5cdFx0XSlcblx0fVxufVxuXG5cbi8qKlxuICogXG4gKi9cblxuY2xhc3MgQ01vdmVyIHtcblx0cHJpdmF0ZSByZWY6IENvbXBvbmVudDtcblx0cHJpdmF0ZSBkZWx0YTogUG9pbnQ7XG5cdHByaXZhdGUgc2VsZjogYm9vbGVhbjtcblxuXHRjb25zdHJ1Y3RvciggeDogQ29tcG9uZW50LCByZWY/OiBDb21wb25lbnQgKSB7XG5cblx0XHR0aGlzLnNlbGYgPSByZWYgPyB0cnVlIDogZmFsc2U7XG5cblx0XHR4LmFkZERPTUV2ZW50KCBcInBvaW50ZXJkb3duXCIsICggZTogUG9pbnRlckV2ZW50ICkgPT4ge1xuXHRcdFx0aWYoIHRoaXMuc2VsZiAmJiBlLnRhcmdldCE9eC5kb20gKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0eC5zZXRDYXB0dXJlKCBlLnBvaW50ZXJJZCApO1xuXG5cdFx0XHR0aGlzLnJlZiA9IHJlZiA/PyBjb21wb25lbnRGcm9tRE9NKCB4LmRvbS5wYXJlbnRFbGVtZW50ICk7XG5cblx0XHRcdHRoaXMuZGVsdGEgPSB7eDowLHk6MH07XG5cdFx0XHRjb25zdCByYyA9IHRoaXMucmVmLmdldEJvdW5kaW5nUmVjdCgpO1xuXG5cdFx0XHR0aGlzLmRlbHRhLnggPSBlLnBhZ2VYLXJjLmxlZnQ7XG5cdFx0XHR0aGlzLmRlbHRhLnkgPSBlLnBhZ2VZLXJjLnRvcDtcblx0XHR9KTtcblxuXHRcdHguYWRkRE9NRXZlbnQoIFwicG9pbnRlcnVwXCIsICggZTogUG9pbnRlckV2ZW50ICkgPT4ge1xuXHRcdFx0eC5yZWxlYXNlQ2FwdHVyZSggZS5wb2ludGVySWQgKTtcblx0XHRcdHRoaXMucmVmID0gbnVsbDtcblx0XHR9KTtcblxuXHRcdHguYWRkRE9NRXZlbnQoIFwicG9pbnRlcm1vdmVcIiwgKCBlOiBQb2ludGVyRXZlbnQgKSA9PiB7XG5cdFx0XHR0aGlzLl9vbk1vdXNlTW92ZSggZSApO1xuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBfb25Nb3VzZU1vdmUoIGU6IFBvaW50ZXJFdmVudCApIHtcblx0XHRpZiggIXRoaXMucmVmICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHB0ID0geyB4OiBlLnBhZ2VYLXRoaXMuZGVsdGEueCwgeTogZS5wYWdlWS10aGlzLmRlbHRhLnkgfTtcblx0XHRjb25zdCByYyA9IHRoaXMucmVmLmdldEJvdW5kaW5nUmVjdCggKTtcblxuXHRcdGxldCBucjogYW55ID0ge1xuXHRcdH07XG5cblx0XHR0aGlzLnJlZi5zZXRTdHlsZSgge1xuXHRcdFx0dG9wOiBwdC55K1wiXCIsXG5cdFx0XHRsZWZ0OiBwdC54K1wiXCIsXG5cdFx0fSApO1xuXHRcdFxuXHRcdGUucHJldmVudERlZmF1bHQoICk7XG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oICk7XG5cdH1cbn1cblxuXG5cblxuIiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSBtZW51LnRzXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcbiAqIFxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiovXG5cbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi8uLi9jb3JlL2NvbXBvbmVudFwiXG5pbXBvcnQgeyBET01FdmVudEhhbmRsZXIgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfZG9tJztcbmltcG9ydCB7IFRpbWVyLCBVbnNhZmVIdG1sLCBpc1N0cmluZyB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV90b29scyc7XG5cbmltcG9ydCB7IFBvcHVwLCBQb3B1cFByb3BzIH0gZnJvbSAnLi4vcG9wdXAvcG9wdXAnO1xuaW1wb3J0IHsgSWNvbiB9IGZyb20gJy4uL2ljb24vaWNvbic7XG5cbmltcG9ydCBcIi4vbWVudS5tb2R1bGUuc2Nzc1wiXG5cbmNvbnN0IE9QRU5fREVMQVkgPSA0MDA7XG5cbi8qKlxuICogXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBNZW51SXRlbSB7XG5cdGNscz86IHN0cmluZztcblx0aWNvbj86IHN0cmluZztcblx0dGV4dDogc3RyaW5nIHwgVW5zYWZlSHRtbDtcblx0bWVudT86IE1lbnU7XG5cdGRpc2FibGVkPzogdHJ1ZTtcblx0Y2xpY2s/OiBET01FdmVudEhhbmRsZXI7XG59XG5cbnR5cGUgTWVudUVsZW1lbnQgPSBNZW51SXRlbSB8IENvbXBvbmVudCB8IHN0cmluZztcblxuZXhwb3J0IGludGVyZmFjZSBNZW51UHJvcHMgZXh0ZW5kcyBPbWl0PFBvcHVwUHJvcHMsXCJjb250ZW50XCI+IHtcblx0aXRlbXM6IE1lbnVFbGVtZW50W107XG59XG5cbi8qKlxuICogXG4gKi9cblxuY2xhc3MgQ01lbnVTZXAgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvciggKSB7XG5cdFx0c3VwZXIoIHsgfSApO1xuXHR9XG59XG5cblxuY29uc3Qgb3BlblRpbWVyID0gbmV3IFRpbWVyKCApO1xuXG4vKipcbiAqIFxuICovXG5cbmNsYXNzIENNZW51SXRlbSBleHRlbmRzIENvbXBvbmVudCB7XG5cblx0cHJpdmF0ZSBtZW51OiBNZW51O1xuXHRcblx0Y29uc3RydWN0b3IoIGl0bTogTWVudUl0ZW0gKSB7XG5cdFx0c3VwZXIoIHsgZGlzYWJsZWQ6IGl0bS5kaXNhYmxlZCwgY2xzOiBpdG0uY2xzIH0gKTtcblxuXHRcdGlmKCBpdG0ubWVudSApIHtcblx0XHRcdHRoaXMuYWRkQ2xhc3MoIFwicG9wdXBcIiApO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0Q29udGVudCggW1xuXHRcdFx0bmV3IEljb24oeyBpZDpcImljb25cIixpY29uSWQ6aXRtLmljb259KSwgXG5cdFx0XHRuZXcgQ29tcG9uZW50KCB7IGlkOiBcInRleHRcIiwgY29udGVudDogaXRtLnRleHQgfSApXG5cdFx0XSk7XG5cblx0XHRpZiggaXRtLm1lbnUgKSB7XG5cdFx0XHR0aGlzLm1lbnUgPSBpdG0ubWVudTtcblx0XHRcdFxuXHRcdFx0dGhpcy5hZGRET01FdmVudCggXCJtb3VzZWVudGVyXCIsICggKSA9PiB0aGlzLm9wZW5TdWIoIHRydWUgKSApO1xuXHRcdFx0dGhpcy5hZGRET01FdmVudCggXCJjbGlja1wiLCAoICkgPT4gdGhpcy5vcGVuU3ViKCBmYWxzZSApICk7XG5cdFx0XHR0aGlzLmFkZERPTUV2ZW50KCBcIm1vdXNlbGVhdmVcIiwgKCApID0+IHRoaXMuY2xvc2VTdWIoKSApO1xuXHRcdFx0XG5cdFx0XHR0aGlzLm1lbnUub24oIFwib3BlbmVkXCIsICggKSA9PiB0aGlzLmFkZENsYXNzKCBcIm9wZW5lZFwiICkgKTtcblx0XHRcdHRoaXMubWVudS5vbiggXCJjbG9zZWRcIiwgKCApID0+IHRoaXMucmVtb3ZlQ2xhc3MoIFwib3BlbmVkXCIgKSApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuYWRkRE9NRXZlbnQoIFwibW91c2VlbnRlclwiLCAoICkgPT4geyBvcGVuVGltZXIuc2V0VGltZW91dCggXCJvcGVuXCIsIE9QRU5fREVMQVksICggKSA9PiB7dGhpcy5kaXNtaXNzKHRydWUpfSk7IH0gKTtcblx0XHRcdHRoaXMuYWRkRE9NRXZlbnQoIFwiY2xpY2tcIiwgKCApID0+IHtcblx0XHRcdFx0dGhpcy5kaXNtaXNzKCBmYWxzZSApO1xuXHRcdFx0XHRpZiggaXRtLmNsaWNrICkge1xuXHRcdFx0XHRcdGl0bS5jbGljayggbmV3IEV2ZW50KFwiY2xpY2tcIikgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0ZGlzbWlzcyggYWZ0ZXI6IGJvb2xlYW4gKSB7XG5cdFx0Y29uc3QgbWVudSA9IHRoaXMucGFyZW50RWxlbWVudCggTWVudSApO1xuXHRcdGlmKCBtZW51ICkge1xuXHRcdFx0bWVudS5kaXNtaXNzKCBhZnRlciApO1xuXHRcdH1cblx0fVxuXG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRvcGVuU3ViKCBkZWxheWVkOiBib29sZWFuICkge1xuXHRcdGNvbnN0IG9wZW4gPSAoICkgPT4ge1xuXHRcdFx0dGhpcy5kaXNtaXNzKCB0cnVlICk7XG5cdFx0XG5cdFx0XHRjb25zdCByYyA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KCApO1xuXHRcdFx0dGhpcy5tZW51LmRpc3BsYXlBdCggcmMucmlnaHQtNCwgcmMudG9wICk7XG5cdFx0fVxuXG5cdFx0aWYoIGRlbGF5ZWQgKSB7XG5cdFx0XHRvcGVuVGltZXIuc2V0VGltZW91dCggXCJvcGVuXCIsIE9QRU5fREVMQVksIG9wZW4gKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRvcGVuVGltZXIuY2xlYXJUaW1lb3V0KCBcIm9wZW5cIiApO1xuXHRcdFx0b3BlbiggKTtcblx0XHR9XG5cdH1cblxuXHRjbG9zZVN1YiggKSB7XG5cdFx0b3BlblRpbWVyLmNsZWFyVGltZW91dCggXCJvcGVuXCIgKTtcblx0fVxufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBjbGFzcyBNZW51IGV4dGVuZHMgUG9wdXAge1xuXHRcblx0Y29uc3RydWN0b3IoIHByb3BzOiBNZW51UHJvcHMgKSB7XG5cdFx0c3VwZXIoIHsgLi4ucHJvcHMsIGF1dG9DbG9zZTogXCJtZW51XCIsIG1vZGFsOiBmYWxzZSB9ICk7XG5cblx0XHR0aGlzLmFkZENsYXNzKCBcIng0dmJveFwiICk7XG5cblx0XHRjb25zdCBjaGlsZHJlbiA9IHByb3BzLml0ZW1zPy5tYXAoIGl0bSA9PiB7XG5cdFx0XHRpZiggaXRtPT09XCItXCIgKSB7XG5cdFx0XHRcdHJldHVybiBuZXcgQ01lbnVTZXAoICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCBpc1N0cmluZyhpdG0pICkge1xuXHRcdFx0XHRyZXR1cm4gbmV3IENNZW51SXRlbSggeyB0ZXh0OiBpdG0sIGNsaWNrOiBudWxsLCBjbHM6ICd0aXRsZScgfSApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggaXRtIGluc3RhbmNlb2YgQ29tcG9uZW50ICkge1xuXHRcdFx0XHRyZXR1cm4gaXRtO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldHVybiBuZXcgQ01lbnVJdGVtKCBpdG0gKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuc2V0Q29udGVudCggY2hpbGRyZW4gKTtcblx0fVxufVxuXG4iLCAiLyoqIFxuICogIF9fXyAgX19fIF9fXG4gKiAgXFwgIFxcLyAgLyAgLyBfXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xuICogICAvICAgIFxcX19fXyAgIF98ICBcbiAqICAvX18vXFxfX1xcICAgfF98XG4gKiBcbiAqIEBmaWxlIGNhbGVuZGFyLnRzXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcbiAqIFxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50RXZlbnRzLCBDb21wb25lbnRQcm9wcywgRXZDaGFuZ2UsIEZsZXggfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudCdcbmltcG9ydCB7IGRhdGVfY2xvbmUsIGRhdGVfaGFzaCwgZm9ybWF0SW50bERhdGUsIFBvaW50LCB1bnNhZmVIdG1sIH0gZnJvbSBcIi4uLy4uL2NvcmUvY29yZV90b29sc1wiXG5pbXBvcnQgeyBfdHIgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfaTE4bic7XG5pbXBvcnQgeyBFdmVudENhbGxiYWNrIH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX2V2ZW50cy5qcyc7XG5cbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL2J1dHRvbi9idXR0b24nO1xuaW1wb3J0IHsgTGFiZWwgfSBmcm9tICcuLi9sYWJlbC9sYWJlbCc7XG5pbXBvcnQgeyBIQm94LCBWQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMnXG5pbXBvcnQgeyBNZW51LCBNZW51SXRlbSB9IGZyb20gJy4uL21lbnUvbWVudSc7XG5cbmltcG9ydCBcIi4vY2FsZW5kYXIubW9kdWxlLnNjc3NcIlxuXG5pbXBvcnQgaWNvbl9wcmV2IGZyb20gXCIuL2NoZXZyb24tbGVmdC1zaGFycC1saWdodC5zdmdcIjtcbmltcG9ydCBpY29uX3RvZGF5IGZyb20gXCIuL2NhbGVuZGFyLWNoZWNrLXNoYXJwLWxpZ2h0LnN2Z1wiO1xuaW1wb3J0IGljb25fbmV4dCBmcm9tIFwiLi9jaGV2cm9uLXJpZ2h0LXNoYXJwLWxpZ2h0LnN2Z1wiO1xuXG5pbnRlcmZhY2UgQ2FsZW5kYXJFdmVudE1hcCBleHRlbmRzIENvbXBvbmVudEV2ZW50cyB7XG5cdGNoYW5nZT86IEV2Q2hhbmdlO1xufVxuXG5cbmludGVyZmFjZSBDYWxlbmRhclByb3BzIGV4dGVuZHMgQ29tcG9uZW50UHJvcHMge1xuXHRkYXRlPzogRGF0ZTtcdC8vIGluaXRpYWwgZGF0ZSB0byBkaXNwbGF5XG5cdG1pbkRhdGU/OiBEYXRlO1x0Ly8gbWluaW1hbCBkYXRlIGJlZm9yZSB0aGUgdXNlciBjYW5ub3QgZ29cblx0bWF4RGF0ZT86IERhdGU7XHQvLyBtYXhpbWFsIGRhdGUgYWZ0ZXIgdGhlIHVzZXIgY2Fubm90IGdvXG5cblx0Y2hhbmdlPzogRXZlbnRDYWxsYmFjazxFdkNoYW5nZT47IC8vIHNob3J0Y3V0IHRvIGV2ZW50czogeyBjaGFuZ2U6IC4uLiB9XG59XG5cblxuLyoqXG4gKiBkZWZhdWx0IGNhbGVuZGFyIGNvbnRyb2xcbiAqIFxuICogZmlyZXM6XG4gKiBcdEV2ZW50Q2hhbmdlICggdmFsdWUgPSBEYXRlIClcbiAqL1xuXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXIgZXh0ZW5kcyBWQm94PENhbGVuZGFyUHJvcHMsIENhbGVuZGFyRXZlbnRNYXA+XG57XG5cdHByaXZhdGUgbV9kYXRlOiBEYXRlO1xuXG5cdGNvbnN0cnVjdG9yKHByb3BzOiBDYWxlbmRhclByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5tYXBQcm9wRXZlbnRzKCBwcm9wcywgJ2NoYW5nZScgKTtcblx0XHR0aGlzLm1fZGF0ZSA9IHByb3BzLmRhdGUgPyBkYXRlX2Nsb25lKCBwcm9wcy5kYXRlICkgOiBuZXcgRGF0ZSgpO1xuXG5cdFx0dGhpcy5fdXBkYXRlKCApO1xuXHR9XG5cblx0LyoqIEBpZ25vcmUgKi9cblxuXHRwcml2YXRlIF91cGRhdGUoICkge1xuXG5cdFx0bGV0IG1vbnRoX3N0YXJ0ID0gZGF0ZV9jbG9uZSh0aGlzLm1fZGF0ZSk7XG5cdFx0bW9udGhfc3RhcnQuc2V0RGF0ZSgxKTtcblxuXHRcdGxldCBkYXkgPSBtb250aF9zdGFydC5nZXREYXkoKTtcblx0XHRpZiAoZGF5ID09IDApIHtcblx0XHRcdGRheSA9IDc7XG5cdFx0fVxuXG5cdFx0bW9udGhfc3RhcnQuc2V0RGF0ZSgtZGF5ICsgMSArIDEpO1xuXHRcdGxldCBkdGUgPSBkYXRlX2Nsb25lKG1vbnRoX3N0YXJ0KTtcblxuXHRcdGxldCBzZWxlY3Rpb24gPSBkYXRlX2hhc2goIHRoaXMubV9kYXRlICk7XG5cdFx0bGV0IHRvZGF5ID0gZGF0ZV9oYXNoKCBuZXcgRGF0ZSgpICk7XG5cblx0XHRsZXQgbW9udGhfZW5kID0gZGF0ZV9jbG9uZSh0aGlzLm1fZGF0ZSk7XG5cdFx0bW9udGhfZW5kLnNldERhdGUoMSk7XG5cdFx0bW9udGhfZW5kLnNldE1vbnRoKG1vbnRoX2VuZC5nZXRNb250aCgpICsgMSk7XG5cdFx0bW9udGhfZW5kLnNldERhdGUoMCk7XG5cblx0XHRsZXQgZW5kX29mX21vbnRoID0gZGF0ZV9oYXNoKG1vbnRoX2VuZCk7XG5cblx0XHRsZXQgcm93czogSEJveFtdID0gW107XG5cblx0XHQvLyBtb250aCBzZWxlY3RvclxuXHRcdGxldCBoZWFkZXIgPSBuZXcgSEJveCh7XG5cdFx0XHRjbHM6ICdtb250aC1zZWwnLFxuXHRcdFx0Y29udGVudDogW1xuXHRcdFx0XHRuZXcgTGFiZWwoe1xuXHRcdFx0XHRcdGNsczogJ21vbnRoJyxcblx0XHRcdFx0XHR0ZXh0OiBmb3JtYXRJbnRsRGF0ZSh0aGlzLm1fZGF0ZSwgJ08nKSxcblx0XHRcdFx0XHRkb21fZXZlbnRzOiB7XG5cdFx0XHRcdFx0XHRjbGljazogKCkgPT4gdGhpcy5fY2hvb3NlKCdtb250aCcpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KSxcblx0XHRcdFx0bmV3IExhYmVsKHtcblx0XHRcdFx0XHRjbHM6ICd5ZWFyJyxcblx0XHRcdFx0XHR0ZXh0OiBmb3JtYXRJbnRsRGF0ZSh0aGlzLm1fZGF0ZSwgJ1knKSxcblx0XHRcdFx0XHRkb21fZXZlbnRzOiB7XG5cdFx0XHRcdFx0XHRjbGljazogKCkgPT4gdGhpcy5fY2hvb3NlKCd5ZWFyJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRuZXcgRmxleCggKSxcblx0XHRcdFx0bmV3IEJ1dHRvbih7IGljb246IGljb25fcHJldiwgY2xpY2s6ICgpID0+IHRoaXMuX25leHQoZmFsc2UpIH0gKSxcblx0XHRcdFx0bmV3IEJ1dHRvbih7IGljb246IGljb25fdG9kYXksIGNsaWNrOiAoKSA9PiB0aGlzLnNldERhdGUobmV3IERhdGUoKSksIHRvb2x0aXA6IF90ci5nbG9iYWwudG9kYXkgfSApLFxuXHRcdFx0XHRuZXcgQnV0dG9uKHsgaWNvbjogaWNvbl9uZXh0LCBjbGljazogKCkgPT4gdGhpcy5fbmV4dCh0cnVlKSB9IClcblx0XHRcdF1cblx0XHR9KTtcblxuXHRcdHJvd3MucHVzaChoZWFkZXIpO1xuXG5cdFx0Ly8gY2FsZW5kYXIgcGFydFxuXHRcdGxldCBkYXlfbmFtZXMgPSBbXTtcblxuXHRcdC8vIGRheSBuYW1lc1xuXHRcdC8vIGVtcHR5IHdlZWsgbnVtXG5cdFx0ZGF5X25hbWVzLnB1c2gobmV3IEhCb3goe1xuXHRcdFx0Y2xzOiAnd2Vla251bSBjZWxsJyxcblx0XHR9KSk7XG5cblx0XHRmb3IgKGxldCBkID0gMDsgZCA8IDc7IGQrKykge1xuXHRcdFx0ZGF5X25hbWVzLnB1c2gobmV3IExhYmVsKHtcblx0XHRcdFx0Y2xzOiAnY2VsbCcsXG5cdFx0XHRcdHRleHQ6IF90ci5nbG9iYWwuZGF5X3Nob3J0WyhkICsgMSkgJSA3XVxuXHRcdFx0fSkpO1xuXHRcdH1cblxuXHRcdHJvd3MucHVzaChuZXcgSEJveCh7XG5cdFx0XHRjbHM6ICd3ZWVrIGhlYWRlcicsXG5cdFx0XHRjb250ZW50OiBkYXlfbmFtZXNcblx0XHR9KSk7XG5cblx0XHRsZXQgY21vbnRoID0gdGhpcy5tX2RhdGUuZ2V0TW9udGgoKTtcblxuXHRcdC8vIHdlZWtzXG5cdFx0bGV0IGZpcnN0ID0gdHJ1ZTtcblx0XHR3aGlsZSAoZGF0ZV9oYXNoKGR0ZSkgPD0gZW5kX29mX21vbnRoKSB7XG5cblx0XHRcdGxldCBkYXlzOiBDb21wb25lbnRbXSA9IFtcblx0XHRcdFx0bmV3IEhCb3goeyBjbHM6ICd3ZWVrbnVtIGNlbGwnLCBjb250ZW50OiBuZXcgQ29tcG9uZW50KHsgdGFnOiAnc3BhbicsIGNvbnRlbnQ6IGZvcm1hdEludGxEYXRlKGR0ZSwgJ3cnKSB9KSB9KVxuXHRcdFx0XTtcblxuXHRcdFx0Ly8gZGF5c1xuXHRcdFx0Zm9yIChsZXQgZCA9IDA7IGQgPCA3OyBkKyspIHtcblxuXHRcdFx0XHRsZXQgY2xzID0gJ2NlbGwgZGF5Jztcblx0XHRcdFx0aWYgKGRhdGVfaGFzaChkdGUpID09IHNlbGVjdGlvbikge1xuXHRcdFx0XHRcdGNscyArPSAnIHNlbGVjdGlvbic7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoZGF0ZV9oYXNoKGR0ZSkgPT0gdG9kYXkpIHtcblx0XHRcdFx0XHRjbHMgKz0gJyB0b2RheSc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoZHRlLmdldE1vbnRoKCkgIT0gY21vbnRoKSB7XG5cdFx0XHRcdFx0Y2xzICs9ICcgb3V0Jztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG1rSXRlbSA9ICggZHRlOiBEYXRlICkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBuZXcgSEJveCh7XG5cdFx0XHRcdFx0XHRjbHMsXG5cdFx0XHRcdFx0XHRmbGV4OiAxLFxuXHRcdFx0XHRcdFx0Y29udGVudDogbmV3IENvbXBvbmVudCh7XG5cdFx0XHRcdFx0XHRcdGNsczogXCJ0ZXh0XCIsXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQ6IHVuc2FmZUh0bWwoIGA8c3Bhbj4ke2Zvcm1hdEludGxEYXRlKGR0ZSwgJ2QnKX08L3NwYW4+YCApLFxuXHRcdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0XHRkb21fZXZlbnRzOiB7XG5cdFx0XHRcdFx0XHRcdGNsaWNrOiAoKSA9PiB0aGlzLnNlbGVjdChkdGUpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRheXMucHVzaCggbWtJdGVtKCBkYXRlX2Nsb25lKCBkdGUgKSApICk7XG5cblx0XHRcdFx0ZHRlLnNldERhdGUoZHRlLmdldERhdGUoKSArIDEpO1xuXHRcdFx0XHRmaXJzdCA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRyb3dzLnB1c2gobmV3IEhCb3goe1xuXHRcdFx0XHRjbHM6ICd3ZWVrJyxcblx0XHRcdFx0ZmxleDogMSxcblx0XHRcdFx0Y29udGVudDogZGF5c1xuXHRcdFx0fSkpO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0Q29udGVudChyb3dzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBzZWxlY3QgdGhlIGdpdmVuIGRhdGVcblx0ICogQHBhcmFtIGRhdGUgXG5cdCAqL1xuXG5cdHByaXZhdGUgc2VsZWN0KGRhdGU6IERhdGUpIHtcblx0XHR0aGlzLm1fZGF0ZSA9IGRhdGU7XG5cdFx0dGhpcy5maXJlKCdjaGFuZ2UnLCB7dmFsdWU6ZGF0ZX0gKTtcblx0XHR0aGlzLl91cGRhdGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0cHJpdmF0ZSBfbmV4dChuOiBib29sZWFuKSB7XG5cdFx0dGhpcy5tX2RhdGUuc2V0TW9udGgodGhpcy5tX2RhdGUuZ2V0TW9udGgoKSArIChuID8gMSA6IC0xKSk7XG5cdFx0dGhpcy5fdXBkYXRlKCk7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdHByaXZhdGUgX2Nob29zZSh0eXBlOiAnbW9udGgnIHwgJ3llYXInKSB7XG5cblx0XHRsZXQgaXRlbXM6IE1lbnVJdGVtW10gPSBbXTtcblxuXHRcdGlmICh0eXBlID09ICdtb250aCcpIHtcblx0XHRcdGZvciAobGV0IG0gPSAwOyBtIDwgMTI7IG0rKykge1xuXHRcdFx0XHRpdGVtcy5wdXNoKCh7XG5cdFx0XHRcdFx0dGV4dDogX3RyLmdsb2JhbC5tb250aF9sb25nW21dLFxuXHRcdFx0XHRcdGNsaWNrOiAoKSA9PiB7IHRoaXMubV9kYXRlLnNldE1vbnRoKG0pOyB0aGlzLl91cGRhdGUoKTsgfVxuXHRcdFx0XHR9KSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHR5cGUgPT0gJ3llYXInKSB7XG5cblx0XHRcdGxldCBtaW4gPSB0aGlzLnByb3BzLm1pbkRhdGU/LmdldEZ1bGxZZWFyKCkgPz8gMTkwMDtcblx0XHRcdGxldCBtYXggPSB0aGlzLnByb3BzLm1heERhdGU/LmdldEZ1bGxZZWFyKCkgPz8gMjAzNztcblxuXHRcdFx0Zm9yIChsZXQgbSA9IG1heDsgbSA+PSBtaW47IG0tLSkge1xuXHRcdFx0XHRpdGVtcy5wdXNoKHtcblx0XHRcdFx0XHR0ZXh0OiAnJyArIG0sXG5cdFx0XHRcdFx0Y2xpY2s6ICgpID0+IHsgdGhpcy5tX2RhdGUuc2V0RnVsbFllYXIobSk7IHRoaXMuX3VwZGF0ZSgpOyB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBtZW51ID0gbmV3IE1lbnUoe1xuXHRcdFx0aXRlbXNcblx0XHR9KTtcblxuXHRcdGxldCByYyA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KCk7XG5cdFx0bWVudS5kaXNwbGF5QXQocmMubGVmdCwgcmMudG9wKTtcblx0fVxuXG5cdGdldERhdGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMubV9kYXRlO1xuXHR9XG5cblx0c2V0RGF0ZShkYXRlOiBEYXRlKSB7XG5cdFx0dGhpcy5tX2RhdGUgPSBkYXRlO1xuXHRcdHRoaXMuX3VwZGF0ZSgpO1xuXHR9XG59XG5cblxuXG5cbi8qKlxuICogZGVmYXVsdCBwb3B1cCBjYWxlbmRhclxuICogL1xuXG5leHBvcnQgY2xhc3MgUG9wdXBDYWxlbmRhciBleHRlbmRzIFBvcHVwIHtcblxuXHRtX2NhbDogQ2FsZW5kYXI7XG5cblx0Y29uc3RydWN0b3IocHJvcHM6IENhbGVuZGFyUHJvcHMpIHtcblx0XHRzdXBlcih7IHRhYkluZGV4OiAxIH0pO1xuXG5cdFx0dGhpcy5lbmFibGVNYXNrKGZhbHNlKTtcblxuXHRcdHRoaXMubV9jYWwgPSBuZXcgQ2FsZW5kYXIocHJvcHMpO1xuXHRcdHRoaXMubV9jYWwuYWRkQ2xhc3MoJ0BmaXQnKTtcblxuXHRcdHRoaXMuc2V0Q29udGVudCh0aGlzLm1fY2FsKTtcblx0fVxuXG5cdC8vIGJpbmRlZFxuXHRwcml2YXRlIF9oYW5kbGVDbGljayA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0aWYgKCF0aGlzLmRvbSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBuZXdmb2N1cyA9IDxIVE1MRWxlbWVudD5lLnRhcmdldDtcblxuXHRcdC8vIGNoaWxkIG9mIHRoaXM6IG9rXG5cdFx0aWYgKHRoaXMuZG9tLmNvbnRhaW5zKG5ld2ZvY3VzKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIG1lbnU6IG9rXG5cdFx0bGV0IGRlc3QgPSBDb21wb25lbnQuZ2V0RWxlbWVudChuZXdmb2N1cywgTWVudUl0ZW0pO1xuXHRcdGlmIChkZXN0KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5jbG9zZSgpO1xuXHR9XG5cblx0LyAqKiBAaWdub3JlICogL1xuXHRzaG93KG1vZGFsPzogYm9vbGVhbiwgYXQ/OiBQb2ludCApIHtcblx0XHR4NGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX2hhbmRsZUNsaWNrKTtcblx0XHRpZiggYXQgKSB7XG5cdFx0XHRzdXBlci5kaXNwbGF5QXQoIGF0LngsIGF0LnksICd0b3AgbGVmdCcsIHVuZGVmaW5lZCwgbW9kYWwgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRzdXBlci5zaG93KG1vZGFsKTtcblx0XHR9XG5cdH1cblxuXHQvICoqIEBpZ25vcmUgKiAvXG5cdGNsb3NlKCkge1xuXHRcdHg0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5faGFuZGxlQ2xpY2spO1xuXHRcdHN1cGVyLmNsb3NlKCk7XG5cdH1cbn1cbiovIiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSBpbnB1dC50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudFByb3BzIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgSUNvbXBvbmVudEludGVyZmFjZSwgSUZvcm1FbGVtZW50IH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX3Rvb2xzLmpzJztcblxuaW1wb3J0IFwiLi9pbnB1dC5tb2R1bGUuc2Nzc1wiXG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFzZVByb3BzIGV4dGVuZHMgQ29tcG9uZW50UHJvcHMge1xuXHRuYW1lPzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQ2hlY2tib3hQcm9wcyBleHRlbmRzIEJhc2VQcm9wcyB7XG5cdHR5cGU6IFwiY2hlY2tib3hcIjtcblx0dmFsdWU/OiBib29sZWFuIHwgbnVtYmVyIHwgc3RyaW5nO1xuXHRjaGVja2VkPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFJhZGlvUHJvcHMgZXh0ZW5kcyBCYXNlUHJvcHMge1xuXHR0eXBlOiBcInJhZGlvXCI7XG5cdHZhbHVlOiBib29sZWFuIHwgbnVtYmVyIHwgc3RyaW5nO1xuXHRjaGVja2VkPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSYW5nZVByb3BzIGV4dGVuZHMgQmFzZVByb3BzIHtcblx0dHlwZTogXCJyYW5nZVwiO1xuXHR2YWx1ZTogbnVtYmVyO1xuXHRtaW46IG51bWJlcjtcblx0bWF4OiBudW1iZXI7XG5cdHN0ZXA/OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBEYXRlUHJvcHMgZXh0ZW5kcyBCYXNlUHJvcHMge1xuXHR0eXBlOiBcImRhdGVcIjtcblx0cmVhZG9ubHk/OiBib29sZWFuO1xuXHRyZXF1aXJlZD86IGJvb2xlYW47XG5cdHZhbHVlOiBEYXRlIHwgc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgTnVtYmVyUHJvcHMgZXh0ZW5kcyBCYXNlUHJvcHMge1xuXHR0eXBlOiBcIm51bWJlclwiO1xuXHRyZWFkb25seT86IGJvb2xlYW47XG5cdHJlcXVpcmVkPzogYm9vbGVhbjtcblx0dmFsdWU6IG51bWJlciB8IHN0cmluZztcblx0bWluPzogbnVtYmVyO1xuXHRtYXg/OiBudW1iZXI7XG5cdHN0ZXA/OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBGaWxlUHJvcHMgZXh0ZW5kcyBCYXNlUHJvcHMge1xuXHR0eXBlOiBcImZpbGVcIjtcblx0YWNjZXB0OiBzdHJpbmcgfCBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUZXh0SW5wdXRQcm9wcyBleHRlbmRzIEJhc2VQcm9wcyB7XG5cdHR5cGU6IFwidGV4dFwiIHwgXCJlbWFpbFwiIHwgXCJwYXNzd29yZFwiO1xuXHRyZWFkb25seT86IGJvb2xlYW47XG5cdHJlcXVpcmVkPzogYm9vbGVhbjtcblx0cGF0dGVybj86IHN0cmluZztcblx0dmFsdWU6IHN0cmluZyB8IG51bWJlcjtcblx0cGxhY2Vob2xkZXI/OiBzdHJpbmc7XG5cdHNwZWxsY2hlY2s/OiBib29sZWFuO1xufVxuXG5cbmV4cG9ydCB0eXBlIElucHV0UHJvcHMgPSBDaGVja2JveFByb3BzIHwgUmFkaW9Qcm9wcyB8IFRleHRJbnB1dFByb3BzIHwgUmFuZ2VQcm9wcyB8IERhdGVQcm9wcyB8IE51bWJlclByb3BzIHwgRmlsZVByb3BzO1xuXG5cblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBDb21wb25lbnQ8SW5wdXRQcm9wcz4ge1xuXHRjb25zdHJ1Y3RvciggcHJvcHM6IElucHV0UHJvcHMgKSB7XG5cdFx0c3VwZXIoIHsgdGFnOiBcImlucHV0XCIsIC4uLnByb3BzIH0gKTtcblxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcInR5cGVcIiwgcHJvcHMudHlwZSA/PyBcInRleHRcIiApO1xuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcIm5hbWVcIiwgcHJvcHMubmFtZSApO1xuXHRcdFx0XHRcdFxuXHRcdHN3aXRjaCggcHJvcHMudHlwZSApIHtcblx0XHRcdGNhc2UgXCJjaGVja2JveFwiOlxuXHRcdFx0Y2FzZSBcInJhZGlvXCI6IHtcblx0XHRcdFx0Y29uc3QgY2sgPSB0aGlzLmRvbSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdFx0XHRjay5jaGVja2VkID0gcHJvcHMuY2hlY2tlZDtcblx0XHRcdFx0Y2sudmFsdWUgPSBwcm9wcy52YWx1ZStcIlwiO1xuXHRcdFx0XHQvL3RoaXMuc2V0QXR0cmlidXRlKCBcImNoZWNrZWRcIiwgcHJvcHMuY2hlY2tlZCApO1xuXHRcdFx0XHQvL3RoaXMuc2V0QXR0cmlidXRlKCBcInZhbHVlXCIsIHByb3BzLnZhbHVlICk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIFwicmFuZ2VcIjoge1xuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJtaW5cIiwgcHJvcHMubWluICk7XG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcIm1heFwiLCBwcm9wcy5tYXggKTtcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwic3RlcFwiLCBwcm9wcy5zdGVwICk7XG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcInZhbHVlXCIsIHByb3BzLnZhbHVlICk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIFwibnVtYmVyXCI6IHtcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwicmVxdWlyZWRcIiwgcHJvcHMucmVxdWlyZWQgKTtcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwicmVhZG9ubHlcIiwgcHJvcHMucmVhZG9ubHkgKTtcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwibWluXCIsIHByb3BzLm1pbiApO1xuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJtYXhcIiwgcHJvcHMubWF4ICk7XG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcInN0ZXBcIiwgcHJvcHMuc3RlcCApO1xuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiLCBwcm9wcy52YWx1ZSsnJyApO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSBcImRhdGVcIjoge1xuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJyZXF1aXJlZFwiLCBwcm9wcy5yZXF1aXJlZCApO1xuXG5cdFx0XHRcdGxldCB2ID0gcHJvcHMudmFsdWU7XG5cdFx0XHRcdGlmKCB2IGluc3RhbmNlb2YgRGF0ZSApIHtcblx0XHRcdFx0XHQvL3RoaXMuc2V0QXR0cmlidXRlKCBcInZhbHVlXCIsIGZvcm1hdERhdGUoIHYsIFwiWS1NLURcIiApICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwidmFsdWVcIiwgdiApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgXCJmaWxlXCI6IHtcblx0XHRcdFx0bGV0IHY6IHN0cmluZztcblx0XHRcdFx0aWYoIEFycmF5LmlzQXJyYXkocHJvcHMuYWNjZXB0KSApIHtcblx0XHRcdFx0XHR2ID0gcHJvcHMuYWNjZXB0LmpvaW4oXCIsXCIgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR2ID0gcHJvcHMuYWNjZXB0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwiYWNjZXB0XCIsIHYgKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGRlZmF1bHQ6IHtcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwicmVxdWlyZWRcIiwgcHJvcHMucmVxdWlyZWQgKTtcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwicmVhZG9ubHlcIiwgcHJvcHMucmVhZG9ubHkgKTtcblxuXHRcdFx0XHRpZiggcHJvcHMudmFsdWUhPT1udWxsICYmIHByb3BzLnZhbHVlIT09dW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcInZhbHVlXCIsIHByb3BzLnZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiggcHJvcHMucGF0dGVybiE9PW51bGwgJiYgcHJvcHMucGF0dGVybiE9PXVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJwYXR0ZXJuXCIsIHByb3BzLnBhdHRlcm4gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCBwcm9wcy5wbGFjZWhvbGRlciE9PW51bGwgJiYgcHJvcHMucGxhY2Vob2xkZXIhPT11bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwicGxhY2Vob2xkZXJcIiwgcHJvcHMucGxhY2Vob2xkZXIgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCBwcm9wcy5zcGVsbGNoZWNrPT09ZmFsc2UgKSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwic3BlbGxjaGVja1wiLCBmYWxzZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm5zIFxuXHQgKi9cblxuXHRwdWJsaWMgZ2V0VmFsdWUoICkge1xuXHRcdHJldHVybiAodGhpcy5kb20gYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBcblx0ICogQHBhcmFtIHZhbHVlIFxuXHQgKi9cblx0XG5cdHB1YmxpYyBzZXRWYWx1ZSggdmFsdWU6IHN0cmluZyApIHtcblx0XHQodGhpcy5kb20gYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSB2YWx1ZStcIlwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKiBAcmV0dXJucyBcblx0ICovXG5cdFxuXHRwdWJsaWMgZ2V0TnVtVmFsdWUoICkge1xuXHRcdHJldHVybiBwYXJzZUZsb2F0KCB0aGlzLmdldFZhbHVlKCkgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICogQHBhcmFtIHZhbHVlIFxuXHQgKi9cblxuXHRwdWJsaWMgc2V0TnVtVmFsdWUoIHZhbHVlOiBudW1iZXIgKSB7XG5cdFx0dGhpcy5zZXRWYWx1ZSggdmFsdWUrXCJcIiApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRwdWJsaWMgc2V0UmVhZE9ubHkoIHJvOiBib29sZWFuICkge1xuXHRcdGNvbnN0IGQgPSB0aGlzLmRvbSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdGQucmVhZE9ubHkgPSBybztcblx0fVxuXG5cdC8qKlxuXHQgKiBzZWxlY3QgYWxsIHRoZSB0ZXh0XG5cdCAqL1xuXG5cdHB1YmxpYyBzZWxlY3RBbGwoICkge1xuXHRcdGNvbnN0IGQgPSB0aGlzLmRvbSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBkLnNlbGVjdCgpOyBcblx0fVxuXG5cdC8qKlxuXHQgKiBzZWxlY3QgYSBwYXJ0IG9mIHRoZSB0ZXh0XG5cdCAqIEBwYXJhbSBzdGFydCBcblx0ICogQHBhcmFtIGxlbmd0aCBcblx0ICovXG5cblx0cHVibGljIHNlbGVjdCggc3RhcnQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIgPSA5OTk5ICkgOiB2b2lkIHtcblx0XHRjb25zdCBkID0gdGhpcy5kb20gYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRkLnNldFNlbGVjdGlvblJhbmdlKCBzdGFydCwgc3RhcnQrbGVuZ3RoICk7XG5cdH1cblxuXHQvKipcblx0ICogZ2V0IHRoZSBzZWxlY3Rpb24gYXMgeyBzdGFydCwgbGVuZ3RoIH1cblx0ICovXG5cblx0cHVibGljIGdldFNlbGVjdGlvbiggKSB7XG5cdFx0Y29uc3QgZCA9IHRoaXMuZG9tIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c3RhcnQ6IGQuc2VsZWN0aW9uU3RhcnQsXG5cdFx0XHRsZW5ndGg6IGQuc2VsZWN0aW9uRW5kIC0gZC5zZWxlY3Rpb25TdGFydCxcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRvdmVycmlkZSBxdWVyeUludGVyZmFjZTxUIGV4dGVuZHMgSUNvbXBvbmVudEludGVyZmFjZT4oIG5hbWU6IHN0cmluZyApOiBUIHtcblx0XHRpZiggbmFtZT09XCJmb3JtLWVsZW1lbnRcIiApIHtcblx0XHRcdGNvbnN0IGk6IElGb3JtRWxlbWVudCA9IHtcblx0XHRcdFx0Z2V0UmF3VmFsdWU6ICggKTogYW55ID0+IHsgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoKTsgfSxcblx0XHRcdFx0c2V0UmF3VmFsdWU6ICggdjogYW55ICkgPT4geyB0aGlzLnNldFZhbHVlKHYpOyB9XG5cdFx0XHR9O1xuXG5cdFx0XHQvL0B0cy1pZ25vcmVcblx0XHRcdHJldHVybiBpIGFzIFQ7XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBzdXBlci5xdWVyeUludGVyZmFjZSggbmFtZSApO1xuXHR9XG59XG5cblxuXG5cblxuIiwgImltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50RXZlbnRzLCBDb21wb25lbnRQcm9wcywgRXZDaGFuZ2UsIG1ha2VVbmlxdWVDb21wb25lbnRJZCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50LmpzJztcbmltcG9ydCB7IEV2ZW50Q2FsbGJhY2sgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfZXZlbnRzLmpzJztcblxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tICcuLi9pbnB1dC9pbnB1dCc7XG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gJy4uL2xhYmVsL2xhYmVsJztcblxuaW1wb3J0IHsgc3ZnTG9hZGVyIH0gZnJvbSAnLi4vaWNvbi9pY29uLmpzJztcblxuaW1wb3J0IFwiLi9jaGVja2JveC5tb2R1bGUuc2Nzc1wiXG5pbXBvcnQgaWNvbiBmcm9tIFwiLi9jaGVjay5zdmdcIjtcblxuLyoqXG4gKiBDaGVja2JveCBldmVudHNcbiAqL1xuXG5pbnRlcmZhY2UgQ2hlY2tCb3hFdmVudHMgZXh0ZW5kcyBDb21wb25lbnRFdmVudHMge1xuXHRjaGFuZ2U/OiBFdkNoYW5nZTtcbn1cblxuLyoqXG4gKiBDaGVja2JveCBwcm9wZXJ0aWVzLlxuICovXG5cbmludGVyZmFjZSBDaGVja2JveFByb3BzIGV4dGVuZHMgQ29tcG9uZW50UHJvcHMge1xuXHRsYWJlbDogc3RyaW5nOyBcdFx0XHQvLyBUaGUgdGV4dCBsYWJlbCBmb3IgdGhlIGNoZWNrYm94LlxuXHRjaGVja2VkPzogYm9vbGVhbjtcdFx0Ly8gT3B0aW9uYWwgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZSBjaGVja2JveCBpcyBjaGVja2VkIGJ5IGRlZmF1bHQuXG5cdHZhbHVlPzogc3RyaW5nO1x0XHRcdC8vIE9wdGlvbmFsIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2hlY2tib3guXG5cdGNoYW5nZT86IEV2ZW50Q2FsbGJhY2s8RXZDaGFuZ2U+O1xufVxuXG4vKipcbiAqIENoZWNrYm94IGNvbXBvbmVudCB0aGF0IGNhbiBiZSBjaGVja2VkIG9yIHVuY2hlY2tlZC5cbiAqL1xuXG5leHBvcnQgY2xhc3MgQ2hlY2tib3ggZXh0ZW5kcyBDb21wb25lbnQ8Q2hlY2tib3hQcm9wcyxDaGVja0JveEV2ZW50cz4ge1xuXG5cdHJlYWRvbmx5IF9pbnB1dDogSW5wdXQ7XG5cblx0LyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgQ2hlY2tib3ggY29tcG9uZW50LlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7Q2hlY2tib3hQcm9wc30gcHJvcHMgLSBUaGUgcHJvcGVydGllcyBmb3IgdGhlIGNoZWNrYm94IGNvbXBvbmVudCwgaW5jbHVkaW5nIGxhYmVsLCBjaGVja2VkIHN0YXRlLCBhbmQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCBjaGVja2JveCA9IG5ldyBDaGVja2JveCh7IGxhYmVsOiAnQWNjZXB0IFRlcm1zJywgY2hlY2tlZDogdHJ1ZSB9KTtcbiAgICAgKi9cblxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IENoZWNrYm94UHJvcHMgKSB7XG5cdFx0c3VwZXIoIHByb3BzICk7XG5cblx0XHRjb25zdCBpbnB1dElkID0gbWFrZVVuaXF1ZUNvbXBvbmVudElkKCApO1xuXG5cdFx0dGhpcy5tYXBQcm9wRXZlbnRzKCBwcm9wcywgJ2NoYW5nZScgKTtcblxuXHRcdHRoaXMuc2V0Q29udGVudCggW1xuXHRcdFx0bmV3IENvbXBvbmVudCgge1xuXHRcdFx0XHRjbHM6ICdpbm5lcicsXG5cdFx0XHRcdGNvbnRlbnQ6IFtcblx0XHRcdFx0XHR0aGlzLl9pbnB1dCA9IG5ldyBJbnB1dCggeyBcblx0XHRcdFx0XHRcdHR5cGU6XCJjaGVja2JveFwiLCBcblx0XHRcdFx0XHRcdGlkOiBpbnB1dElkLCBcblx0XHRcdFx0XHRcdGNoZWNrZWQ6IHByb3BzLmNoZWNrZWQsXG5cdFx0XHRcdFx0XHRkb21fZXZlbnRzOiB7XG5cdFx0XHRcdFx0XHRcdGNoYW5nZTogKCApID0+IHRoaXMuX29uX2NoYW5nZSggKSxcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRdIFxuXHRcdFx0fSksXG5cdFx0XHRuZXcgTGFiZWwoIHsgXG5cdFx0XHRcdHRhZzogJ2xhYmVsJyxcblx0XHRcdFx0dGV4dDogcHJvcHMubGFiZWwsIFxuXHRcdFx0XHRsYWJlbEZvcjogaW5wdXRJZCwgXG5cdFx0XHRcdGlkOiB1bmRlZmluZWQgXG5cdFx0XHR9ICksXG5cdFx0XSlcblxuXHRcdHN2Z0xvYWRlci5sb2FkKCBpY29uICkudGhlbiggc3ZnID0+IHtcblx0XHRcdHRoaXMucXVlcnk8TGFiZWw+KCAnLmlubmVyJyApLmRvbS5pbnNlcnRBZGphY2VudEhUTUwoIFwiYmVmb3JlZW5kXCIsIHN2ZyApO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIGNoZWNrIHN0YXRlIGNoYW5nZWRcblx0ICovXG5cblx0cHJpdmF0ZSBfb25fY2hhbmdlKCkge1xuXHRcdHRoaXMuZmlyZSgnY2hhbmdlJywgeyB2YWx1ZTp0aGlzLmdldENoZWNrKCkgfSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm4gdGhlIGNoZWNrZWQgdmFsdWVcblx0ICovXG5cblx0cHVibGljIGdldENoZWNrKCkge1xuXHRcdGNvbnN0IGQgPSB0aGlzLl9pbnB1dC5kb20gYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRyZXR1cm4gZC5jaGVja2VkO1xuXHR9XG5cblx0LyoqXG5cdCAqIGNoYW5nZSB0aGUgY2hlY2tlZCB2YWx1ZVxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IGNrIG5ldyBjaGVja2VkIHZhbHVlXHRcblx0ICovXG5cblx0cHVibGljIHNldENoZWNrKGNrOiBib29sZWFuKSB7XG5cdFx0Y29uc3QgZCA9IHRoaXMuX2lucHV0LmRvbSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdGQuY2hlY2tlZCA9IGNrO1xuXHR9XG5cblx0LyoqXG5cdCAqIGNoYW5nZSB0aGUgY2hlY2tib3ggbGFiZWxcblx0ICogQHBhcmFtIHRleHQgXG5cdCAqL1xuXG5cdHB1YmxpYyBzZXRMYWJlbCh0ZXh0OiBzdHJpbmcpIHtcblx0XHR0aGlzLnF1ZXJ5PExhYmVsPignbGFiZWwnKS5zZXRUZXh0KCB0ZXh0ICk7XG5cdH1cblxuXHQvKipcblx0ICogdG9nZ2xlIHRoZSBjaGVja2JveFxuXHQgKi9cblxuXHRwdWJsaWMgdG9nZ2xlKCkge1xuXHRcdHRoaXMuc2V0Q2hlY2soICF0aGlzLmdldENoZWNrKCkgKTtcblx0fVxuXG59IiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSBjb2xvcmlucHV0LnRzXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcbiAqIFxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiovXG5cbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50JztcbmltcG9ydCB7IGlzRmVhdHVyZUF2YWlsYWJsZSB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV90b29scy5qcyc7XG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV9jb2xvcnMnO1xuXG5pbXBvcnQgeyBCb3hQcm9wcywgSEJveCB9IGZyb20gJy4uL2JveGVzL2JveGVzJztcbmltcG9ydCB7IElucHV0IH0gZnJvbSAnLi4vaW5wdXQvaW5wdXQuanMnO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vYnV0dG9uL2J1dHRvbi5qcyc7XG5cblxuaW1wb3J0IFwiLi9jb2xvcmlucHV0Lm1vZHVsZS5zY3NzXCJcbmltcG9ydCBpY29uIGZyb20gXCIuL2Nyb3NzaGFpcnMtc2ltcGxlLXNoYXJwLWxpZ2h0LnN2Z1wiXG5cbi8vVE9ETzogYWRkIHN3YXRjaGVzXG4vL1RPRE86IGJldHRlciBrZXlib2FyZCBoYW5kbGluZyAoc2VsZWN0aW9uIGFmdGVyIGN1cnNvcilcblxuLyoqXG4gKiBcbiAqL1xuXG5pbnRlcmZhY2UgQ29sb3JJbnB1dFByb3BzIGV4dGVuZHMgQm94UHJvcHMge1xuXHRjb2xvcjogQ29sb3IgfCBzdHJpbmc7XG59XG5cbi8qKlxuICogXG4gKi9cblxuZXhwb3J0IGNsYXNzIENvbG9ySW5wdXQgZXh0ZW5kcyBIQm94PENvbG9ySW5wdXRQcm9wcz4ge1xuXHRjb25zdHJ1Y3RvciggcHJvcHM6IENvbG9ySW5wdXRQcm9wcyApIHtcblx0XHRzdXBlciggcHJvcHMgKTtcblxuXHRcdGxldCBzd2F0Y2g6IENvbXBvbmVudDtcblx0XHRsZXQgZWRpdDogSW5wdXQ7XG5cblx0XHR0aGlzLnNldENvbnRlbnQoIFtcblx0XHRcdHN3YXRjaCA9IG5ldyBDb21wb25lbnQoIHsgY2xzOiBcInN3YXRjaFwiIH0gKSxcblx0XHRcdGVkaXQgPSBuZXcgSW5wdXQoIHsgdHlwZTogXCJ0ZXh0XCIsIHZhbHVlOiBcIlwiLCBzcGVsbGNoZWNrOiBmYWxzZSB9ICksXG5cblx0XHRcdGlzRmVhdHVyZUF2YWlsYWJsZShcImV5ZWRyb3BwZXJcIikgPyBuZXcgQnV0dG9uKCB7IGljb246IGljb24sIGNsaWNrOiAoICkgPT4ge1xuXHRcdFx0XHRjb25zdCBleWVEcm9wcGVyID0gbmV3ICh3aW5kb3cgYXMgYW55KS5FeWVEcm9wcGVyKCk7XG5cdFx0XHRcdGV5ZURyb3BwZXIub3BlbiggKS50aGVuKCAoIHJlc3VsdDogYW55ICkgPT4ge1xuXHRcdFx0XHRcdGNvbG9yID0gbmV3IENvbG9yKCByZXN1bHQuc1JHQkhleCApO1xuXHRcdFx0XHRcdHVwZGF0ZUNvbG9yKCBjb2xvciApO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gfSApIDogbnVsbFxuXHRcdF0pXG5cblx0XHRlZGl0LmFkZERPTUV2ZW50KCBcImlucHV0XCIsICggKSA9PiB7XG5cdFx0XHRjb25zdCB0eHQgPSBlZGl0LmdldFZhbHVlKCApO1xuXHRcdFx0Y29uc3QgY2xyID0gbmV3IENvbG9yKCB0eHQgKTtcblx0XHRcdGlmKCAhY2xyLmlzSW52YWxpZCgpICkge1xuXHRcdFx0XHRjb2xvciA9IGNscjtcblx0XHRcdFx0dXBkYXRlQ29sb3IoIGNvbG9yICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRjb25zdCB1cGRhdGVDb2xvciA9ICggY2xyOiBDb2xvciApID0+IHtcblx0XHRcdHN3YXRjaC5zZXRTdHlsZVZhbHVlKCBcImJhY2tncm91bmRDb2xvclwiLCBjbHIudG9SZ2JTdHJpbmcoZmFsc2UpICk7XG5cdFx0XHRlZGl0LnNldFZhbHVlKCBjbHIudG9SZ2JTdHJpbmcoZmFsc2UpICk7XG5cdFx0fVxuXG5cdFx0bGV0IGNvbG9yOiBDb2xvcjtcblx0XHRpZiggcHJvcHMuY29sb3IgaW5zdGFuY2VvZiBDb2xvciApIHtcblx0XHRcdGNvbG9yID0gcHJvcHMuY29sb3I7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Y29sb3IgPSBuZXcgQ29sb3IoIHByb3BzLmNvbG9yICk7XG5cdFx0fVxuXG5cdFx0dXBkYXRlQ29sb3IoIGNvbG9yICk7XG5cdH1cbn0iLCAiLyoqIFxuICogIF9fXyAgX19fIF9fXG4gKiAgXFwgIFxcLyAgLyAgLyBfXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xuICogICAvICAgIFxcX19fXyAgIF98ICBcbiAqICAvX18vXFxfX1xcICAgfF98XG4gKiBcbiAqIEBmaWxlIGNvbG9ycGlja2VyLnRzXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcbiAqIFxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiovXG5cbmltcG9ydCB7IENvbG9yLCBIc3YgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfY29sb3JzJztcbmltcG9ydCB7IFJlY3QsIGNsYW1wLCBpc0ZlYXR1cmVBdmFpbGFibGUgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfdG9vbHMnO1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudEV2ZW50LCBDb21wb25lbnRFdmVudHMsIENvbXBvbmVudFByb3BzIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgQm94LCBCb3hQcm9wcywgSEJveCwgVkJveCB9IGZyb20gJy4uL2JveGVzL2JveGVzJztcblxuaW1wb3J0IFwiLi9jb2xvcnBpY2tlci5tb2R1bGUuc2Nzc1wiXG5cbmludGVyZmFjZSBDb2xvclBpY2tlclByb3BzIGV4dGVuZHMgQ29tcG9uZW50UHJvcHMge1xuXHRjb2xvcjogc3RyaW5nIHwgQ29sb3I7XG59XG5cbmludGVyZmFjZSBIdWVDaGFuZ2VFdmVudCBleHRlbmRzIENvbXBvbmVudEV2ZW50IHtcblx0aHVlOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBBbHBoYUNoYW5nZUV2ZW50IGV4dGVuZHMgQ29tcG9uZW50RXZlbnQge1xuXHRhbHBoYTogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgU2F0Q2hhbmdlRXZlbnQgZXh0ZW5kcyBDb21wb25lbnRFdmVudCB7XG5cdHNhdHVyYXRpb246IG51bWJlcjtcblx0dmFsdWU6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIENvbW1vbkV2ZW50cyBleHRlbmRzIENvbXBvbmVudEV2ZW50cyB7XG5cdGh1ZV9jaGFuZ2U6IEh1ZUNoYW5nZUV2ZW50O1x0XG5cdGFscGhhX2NoYW5nZTogQWxwaGFDaGFuZ2VFdmVudDtcblx0c2F0X2NoYW5nZTogU2F0Q2hhbmdlRXZlbnQ7XHRcbn1cblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgY2xhc3MgU2F0dXJhdGlvbiBleHRlbmRzIEJveDxCb3hQcm9wcyxDb21tb25FdmVudHM+IHtcblxuXHRwcml2YXRlIG1kb3duID0gZmFsc2U7XG5cdHByaXZhdGUgaXJlY3Q6IFJlY3Q7XG5cdFxuXHRwcml2YXRlIGhzdjogSHN2ID0geyBodWU6IDEsIHNhdHVyYXRpb246IDEsIHZhbHVlOiAxLCBhbHBoYTogMSB9O1xuXG5cdHByaXZhdGUgY29sb3I6IENvbXBvbmVudDtcblx0cHJpdmF0ZSB0aHVtYjogQ29tcG9uZW50O1xuXHRcdFxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IEJveFByb3BzLCBpbml0OiBIc3YgKSB7XG5cdFx0c3VwZXIoIHByb3BzICk7XG5cblx0XHR0aGlzLnNldENvbnRlbnQoIFtcblx0XHRcdHRoaXMuY29sb3IgPSBuZXcgQ29tcG9uZW50KCB7IGNsczogXCJvdmVybGF5XCIgfSApLFxuXHRcdFx0bmV3IENvbXBvbmVudCggeyBjbHM6IFwib3ZlcmxheVwiLCBzdHlsZTogeyBiYWNrZ3JvdW5kSW1hZ2U6IFwibGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2IoMjU1LCAyNTUsIDI1NSksIHRyYW5zcGFyZW50KVwiIH0gfSApLFxuXHRcdFx0bmV3IENvbXBvbmVudCggeyBjbHM6IFwib3ZlcmxheVwiLCBzdHlsZTogeyBiYWNrZ3JvdW5kSW1hZ2U6IFwibGluZWFyLWdyYWRpZW50KDBkZWcsIHJnYigwLCAwLCAwKSwgdHJhbnNwYXJlbnQpXCIgfSB9ICksXG5cdFx0XHR0aGlzLnRodW1iID0gbmV3IENvbXBvbmVudCggeyBjbHM6IFwidGh1bWJcIiB9ICksXG5cdFx0XSk7XG5cblx0XHR0aGlzLnNldERPTUV2ZW50cygge1xuXHRcdFx0cG9pbnRlcmRvd246ICggZSApID0+IHRoaXMubW91c2Vkb3duKCBlICksXG5cdFx0XHRwb2ludGVybW92ZTogKCBlICkgPT4gdGhpcy5tb3VzZW1vdmUoIGUgKSxcblx0XHRcdHBvaW50ZXJ1cDogKCBlICkgPT4gdGhpcy5tb3VzZXVwKCBlICksXG5cdFx0XHRjcmVhdGVkOiAoKSA9PiB0aGlzLnVwZGF0ZVRodW1iTWFya2VyKCApLFxuXHRcdH0gKTtcblxuXHRcdHRoaXMudXBkYXRlQmFzZUNvbG9yKCBpbml0ICk7XG5cdH1cblxuXHRtb3VzZWRvd24oIGV2OiBQb2ludGVyRXZlbnQgKSB7XG5cdFx0dGhpcy5tZG93biA9IHRydWU7XG5cdFx0dGhpcy5pcmVjdCA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KCApO1xuXHRcdHRoaXMuc2V0Q2FwdHVyZSggZXYucG9pbnRlcklkICk7XG5cdH1cblxuXHRtb3VzZW1vdmUoIGV2OiBQb2ludGVyRXZlbnQgKSB7XG5cblx0XHRpZiggdGhpcy5tZG93biApIHtcblx0XHRcdGNvbnN0IGlyID0gdGhpcy5pcmVjdDtcblxuXHRcdFx0bGV0IGhwb3MgPSBjbGFtcChldi5jbGllbnRYIC0gaXIubGVmdCwgMCwgaXIud2lkdGggKTtcblx0XHRcdGxldCBocGVyYyA9IGhwb3MgLyBpci53aWR0aDtcblxuXHRcdFx0bGV0IHZwb3MgPSBjbGFtcChldi5jbGllbnRZIC0gaXIudG9wLCAwLCBpci5oZWlnaHQgKTtcblx0XHRcdGxldCB2cGVyYyA9IHZwb3MgLyBpci5oZWlnaHQ7XG5cblx0XHRcdHRoaXMuaHN2LnNhdHVyYXRpb24gPSBocGVyYztcblx0XHRcdHRoaXMuaHN2LnZhbHVlID0gMS12cGVyYztcblx0XHRcdFxuXHRcdFx0dGhpcy51cGRhdGVUaHVtYk1hcmtlciggKTtcblx0XHRcdHRoaXMuZmlyZSggXCJzYXRfY2hhbmdlXCIsIHsgc2F0dXJhdGlvbjogdGhpcy5oc3Yuc2F0dXJhdGlvbiwgdmFsdWU6IHRoaXMuaHN2LnZhbHVlIH0gKTtcblx0XHR9XG5cdH1cblxuXHRtb3VzZXVwKCBldjogUG9pbnRlckV2ZW50ICkge1xuXHRcdGlmKCB0aGlzLm1kb3duICkge1xuXHRcdFx0dGhpcy5yZWxlYXNlQ2FwdHVyZSggZXYucG9pbnRlcklkICk7XG5cdFx0XHR0aGlzLm1kb3duID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0dXBkYXRlVGh1bWJNYXJrZXIoICkge1xuXHRcdGNvbnN0IHJjID0gdGhpcy5jb2xvci5nZXRCb3VuZGluZ1JlY3QoICk7XG5cdFx0XG5cdFx0dGhpcy50aHVtYi5zZXRTdHlsZSggeyBcblx0XHRcdGxlZnQ6ICh0aGlzLmhzdi5zYXR1cmF0aW9uICogcmMud2lkdGggKSArICdweCcsXG5cdFx0XHRib3R0b206ICggdGhpcy5oc3YudmFsdWUgKiByYy5oZWlnaHQgKSArICdweCdcblx0XHR9ICk7XG5cdH1cblxuXHR1cGRhdGVCYXNlQ29sb3IoIGhzdjogSHN2ICkge1xuXHRcdGNvbnN0IGJhc2UgPSBuZXcgQ29sb3IoMCwwLDApXG5cdFx0YmFzZS5zZXRIc3YoIGhzdi5odWUsIDEsIDEsIDEgKTtcblx0XHR0aGlzLmNvbG9yLnNldFN0eWxlVmFsdWUoIFwiYmFja2dyb3VuZENvbG9yXCIsIGJhc2UudG9SZ2JTdHJpbmcoZmFsc2UpICk7XG5cdH1cblxuXHRtb3ZlKCBzZW5zOiBzdHJpbmcsIGRlbHRhOiBudW1iZXIgKSB7XG5cdFx0c3dpdGNoKCBzZW5zICkge1xuXHRcdFx0Y2FzZSAnc2F0dXJhdGlvbic6IHtcblx0XHRcdFx0dGhpcy5oc3Yuc2F0dXJhdGlvbiArPSBkZWx0YTtcblx0XHRcdFx0aWYoIHRoaXMuaHN2LnNhdHVyYXRpb248MCApIHtcblx0XHRcdFx0XHR0aGlzLmhzdi5zYXR1cmF0aW9uID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCB0aGlzLmhzdi5zYXR1cmF0aW9uPjEgKSB7XG5cdFx0XHRcdFx0dGhpcy5oc3Yuc2F0dXJhdGlvbiA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMuZmlyZSggXCJzYXRfY2hhbmdlXCIsIHsgc2F0dXJhdGlvbjogdGhpcy5oc3Yuc2F0dXJhdGlvbiwgdmFsdWU6IHRoaXMuaHN2LnZhbHVlIH0gKTtcblx0XHRcdFx0dGhpcy51cGRhdGVUaHVtYk1hcmtlciggKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgJ3ZhbHVlJzoge1xuXHRcdFx0XHR0aGlzLmhzdi52YWx1ZSArPSBkZWx0YTtcblx0XHRcdFx0aWYoIHRoaXMuaHN2LnZhbHVlPDAgKSB7XG5cdFx0XHRcdFx0dGhpcy5oc3YudmFsdWUgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoIHRoaXMuaHN2LnZhbHVlPjEgKSB7XG5cdFx0XHRcdFx0dGhpcy5oc3YudmFsdWUgPSAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5maXJlKCBcInNhdF9jaGFuZ2VcIiwgeyBzYXR1cmF0aW9uOiB0aGlzLmhzdi5zYXR1cmF0aW9uLCB2YWx1ZTogdGhpcy5oc3YudmFsdWUgfSApO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZVRodW1iTWFya2VyKCApO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuXG5cbi8qKlxuICogXG4gKi9cblxuY2xhc3MgSHVlU2xpZGVyIGV4dGVuZHMgQm94PEJveFByb3BzLENvbW1vbkV2ZW50cz4ge1xuXG5cdHByaXZhdGUgdGh1bWI6IENvbXBvbmVudDtcblx0cHJpdmF0ZSBoc3Y6IEhzdiA9IHsgaHVlOiAxLCBzYXR1cmF0aW9uOiAxLCB2YWx1ZTogMSwgYWxwaGE6IDEgfTtcblxuXHRwcml2YXRlIG1kb3duID0gZmFsc2U7XG5cdHByaXZhdGUgaXJlY3Q6IFJlY3Q7XG5cblx0Y29uc3RydWN0b3IoIHByb3BzOiBCb3hQcm9wcywgaW5pdDogSHN2ICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0dGhpcy5zZXRDb250ZW50KCBbXG5cdFx0XHR0aGlzLnRodW1iID0gbmV3IENvbXBvbmVudCggeyBjbHM6IFwidGh1bWJcIiwgbGVmdDogXCI1MCVcIiB9ICksXG5cdFx0XSk7XG5cblx0XHR0aGlzLnNldERPTUV2ZW50cygge1xuXHRcdFx0cG9pbnRlcmRvd246ICggZSApID0+IHRoaXMubW91c2Vkb3duKCBlICksXG5cdFx0XHRwb2ludGVybW92ZTogKCBlICkgPT4gdGhpcy5tb3VzZW1vdmUoIGUgKSxcblx0XHRcdHBvaW50ZXJ1cDogKCBlICkgPT4gdGhpcy5tb3VzZXVwKCBlICksXG5cdFx0fSApO1xuXG5cdFx0dGhpcy51cGRhdGVIdWUoIGluaXQgKTtcblx0fVxuXG5cdG1vdXNlZG93biggZXY6IFBvaW50ZXJFdmVudCApIHtcblx0XHR0aGlzLm1kb3duID0gdHJ1ZTtcblx0XHR0aGlzLmlyZWN0ID0gdGhpcy5nZXRCb3VuZGluZ1JlY3QoICk7XG5cdFx0dGhpcy5zZXRDYXB0dXJlKCBldi5wb2ludGVySWQgKTtcblx0fVxuXG5cdG1vdXNlbW92ZSggZXY6IFBvaW50ZXJFdmVudCApIHtcblxuXHRcdGlmKCB0aGlzLm1kb3duICkge1xuXHRcdFx0Y29uc3QgaXIgPSB0aGlzLmlyZWN0O1xuXG5cdFx0XHRsZXQgaHBvcyA9IGNsYW1wKGV2LmNsaWVudFggLSBpci5sZWZ0LCAwLCBpci53aWR0aCApO1xuXHRcdFx0bGV0IGhwZXJjID0gaHBvcyAvIGlyLndpZHRoO1xuXG5cdFx0XHR0aGlzLmhzdi5odWUgPSBocGVyYztcblxuXHRcdFx0dGhpcy51cGRhdGVIdWUoIHRoaXMuaHN2ICk7XG5cdFx0XHR0aGlzLmZpcmUoIFwiaHVlX2NoYW5nZVwiLCB7IGh1ZTogdGhpcy5oc3YuaHVlIH0gKTtcblx0XHR9XG5cdH1cblxuXHRtb3VzZXVwKCBldjogUG9pbnRlckV2ZW50ICkge1xuXHRcdGlmKCB0aGlzLm1kb3duICkge1xuXHRcdFx0dGhpcy5yZWxlYXNlQ2FwdHVyZSggZXYucG9pbnRlcklkICk7XG5cdFx0XHR0aGlzLm1kb3duID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0dXBkYXRlSHVlKCBoc3Y6IEhzdiApIHtcblx0XHR0aGlzLmhzdi5odWUgPSBoc3YuaHVlO1xuXHRcdHRoaXMudGh1bWIuc2V0U3R5bGVWYWx1ZSggXCJsZWZ0XCIsIChoc3YuaHVlKjEwMCkrJyUnICk7XG5cdH1cblxuXHRtb3ZlKCBkZWx0YTogbnVtYmVyICkge1xuXHRcdHRoaXMuaHN2Lmh1ZSArPSBkZWx0YTtcblx0XHRpZiggdGhpcy5oc3YuaHVlPDAgKSB7XG5cdFx0XHR0aGlzLmhzdi5odWUgPSAwO1xuXHRcdH1cblx0XHRlbHNlIGlmKCB0aGlzLmhzdi5odWU+MSApIHtcblx0XHRcdHRoaXMuaHN2Lmh1ZSA9IDE7XG5cdFx0fVxuXG5cdFx0dGhpcy5maXJlKCBcImh1ZV9jaGFuZ2VcIiwgeyBodWU6IHRoaXMuaHN2Lmh1ZSB9ICk7XG5cdFx0dGhpcy51cGRhdGVIdWUoIHRoaXMuaHN2ICk7XG5cdH1cbn1cblxuXG4vKipcbiAqIFxuICovXG5cbmNsYXNzIEFscGhhU2xpZGVyIGV4dGVuZHMgQm94PEJveFByb3BzLENvbW1vbkV2ZW50cz4ge1xuXHRcblx0cHJpdmF0ZSB0aHVtYjogQ29tcG9uZW50O1xuXHRwcml2YXRlIGNvbG9yOiBDb21wb25lbnQ7XG5cdHByaXZhdGUgaHN2OiBIc3YgPSB7IGh1ZTogMSwgc2F0dXJhdGlvbjogMSwgdmFsdWU6IDEsIGFscGhhOiAxIH07XG5cblx0cHJpdmF0ZSBtZG93biA9IGZhbHNlO1xuXHRwcml2YXRlIGlyZWN0OiBSZWN0O1xuXHRcblx0Y29uc3RydWN0b3IoIHByb3BzOiBCb3hQcm9wcywgaW5pdDogSHN2ICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0dGhpcy5zZXRDb250ZW50KCBbXG5cdFx0XHRuZXcgQ29tcG9uZW50KCB7IGNsczogXCJvdmVybGF5IGNoZWNrZXJzXCJ9ICksXG5cdFx0XHR0aGlzLmNvbG9yID0gbmV3IENvbXBvbmVudCggeyBjbHM6IFwib3ZlcmxheSBjb2xvclwifSApLFxuXHRcdFx0dGhpcy50aHVtYiA9IG5ldyBDb21wb25lbnQoIHsgY2xzOiBcInRodW1iXCIsIGxlZnQ6IFwiNTAlXCIgfSApLFxuXHRcdF0pO1xuXG5cdFx0dGhpcy5zZXRET01FdmVudHMoIHtcblx0XHRcdHBvaW50ZXJkb3duOiAoIGUgKSA9PiB0aGlzLl9vbl9tb3VzZWRvd24oIGUgKSxcblx0XHRcdHBvaW50ZXJtb3ZlOiAoIGUgKSA9PiB0aGlzLl9vbl9tb3VzZW1vdmUoIGUgKSxcblx0XHRcdHBvaW50ZXJ1cDogKCBlICkgPT4gdGhpcy5fb25fbW91c2V1cCggZSApLFxuXHRcdH0gKTtcblxuXHRcdHRoaXMudXBkYXRlQWxwaGEoICk7XG5cdFx0dGhpcy51cGRhdGVCYXNlQ29sb3IoIGluaXQgKTtcblx0fVxuXG5cdF9vbl9tb3VzZWRvd24oIGV2OiBQb2ludGVyRXZlbnQgKSB7XG5cdFx0dGhpcy5tZG93biA9IHRydWU7XG5cdFx0dGhpcy5pcmVjdCA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KCApO1xuXHRcdHRoaXMuc2V0Q2FwdHVyZSggZXYucG9pbnRlcklkICk7XG5cdH1cblxuXHRfb25fbW91c2Vtb3ZlKCBldjogUG9pbnRlckV2ZW50ICkge1xuXG5cdFx0aWYoIHRoaXMubWRvd24gKSB7XG5cdFx0XHRjb25zdCBpciA9IHRoaXMuaXJlY3Q7XG5cblx0XHRcdGxldCBocG9zID0gY2xhbXAoZXYuY2xpZW50WCAtIGlyLmxlZnQsIDAsIGlyLndpZHRoICk7XG5cdFx0XHRsZXQgaHBlcmMgPSBocG9zIC8gaXIud2lkdGg7XG5cblx0XHRcdHRoaXMuaHN2LmFscGhhID0gaHBlcmM7XG5cblx0XHRcdHRoaXMudXBkYXRlQWxwaGEoICk7XG5cdFx0XHR0aGlzLmZpcmUoIFwiYWxwaGFfY2hhbmdlXCIsIHsgYWxwaGE6IHRoaXMuaHN2LmFscGhhIH0gKTtcblx0XHR9XG5cdH1cblxuXHRfb25fbW91c2V1cCggZXY6IFBvaW50ZXJFdmVudCApIHtcblx0XHRpZiggdGhpcy5tZG93biApIHtcblx0XHRcdHRoaXMucmVsZWFzZUNhcHR1cmUoIGV2LnBvaW50ZXJJZCApO1xuXHRcdFx0dGhpcy5tZG93biA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHVwZGF0ZUFscGhhKCApIHtcblx0XHR0aGlzLnRodW1iLnNldFN0eWxlVmFsdWUoIFwibGVmdFwiLCAodGhpcy5oc3YuYWxwaGEqMTAwKSsnJScgKTtcblx0fVxuXG5cdHVwZGF0ZUJhc2VDb2xvciggaHN2OiBIc3YgKSB7XG5cdFx0Y29uc3QgYmFzZSA9IG5ldyBDb2xvcigwLDAsMClcblx0XHRiYXNlLnNldEhzdiggaHN2Lmh1ZSwgaHN2LnNhdHVyYXRpb24sIGhzdi52YWx1ZSwgMSApO1xuXHRcdHRoaXMuY29sb3Iuc2V0U3R5bGVWYWx1ZSggXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgYGxpbmVhci1ncmFkaWVudCg5MGRlZywgdHJhbnNwYXJlbnQsICR7YmFzZS50b1JnYlN0cmluZyhmYWxzZSl9KWAgKTtcdFx0XG5cdH1cblxuXHRzZXRDb2xvciggaHN2OiBIc3YgKSB7XG5cdFx0dGhpcy5oc3YgPSBoc3Y7XG5cdFx0dGhpcy51cGRhdGVCYXNlQ29sb3IoIGhzdiApO1xuXHRcdHRoaXMudXBkYXRlQWxwaGEoICk7XG5cdH1cblxuXHRtb3ZlKCBkZWx0YTogbnVtYmVyICkge1xuXHRcdHRoaXMuaHN2LmFscGhhICs9IGRlbHRhO1xuXHRcdGlmKCB0aGlzLmhzdi5hbHBoYTwwICkge1xuXHRcdFx0dGhpcy5oc3YuYWxwaGEgPSAwO1xuXHRcdH1cblx0XHRlbHNlIGlmKCB0aGlzLmhzdi5hbHBoYT4xICkge1xuXHRcdFx0dGhpcy5oc3YuYWxwaGEgPSAxO1xuXHRcdH1cblxuXHRcdHRoaXMuZmlyZSggXCJhbHBoYV9jaGFuZ2VcIiwgeyBhbHBoYTogdGhpcy5oc3YuYWxwaGEgfSApO1xuXHRcdHRoaXMudXBkYXRlQWxwaGEoICk7XG5cdH1cbn1cblxuXG4vKipcbiAqIFxuICovXG5cbmludGVyZmFjZSBDaGFuZ2VFdmVudCBleHRlbmRzIENvbXBvbmVudEV2ZW50IHtcblx0Y29sb3I6IENvbG9yO1xufVxuXG5pbnRlcmZhY2UgQ29sb3JQaWNrZXJDaGFuZ2VFdmVudHMgZXh0ZW5kcyBDb21wb25lbnRFdmVudHMge1xuXHRjaGFuZ2U6IENoYW5nZUV2ZW50XG59XG5cbi8qKlxuICogXG4gKi9cbmV4cG9ydCBjbGFzcyBDb2xvclBpY2tlciBleHRlbmRzIFZCb3g8Q29sb3JQaWNrZXJQcm9wcyxDb2xvclBpY2tlckNoYW5nZUV2ZW50cz4ge1xuXG5cdHByaXZhdGUgX2Jhc2U6IENvbG9yO1xuXHRwcml2YXRlIF9zYXQ6IFNhdHVyYXRpb247XG5cdHByaXZhdGUgX3N3YXRjaDogQ29tcG9uZW50O1xuXHRwcml2YXRlIF9odWU6IEh1ZVNsaWRlcjtcblx0cHJpdmF0ZSBfYWxwaGE6IEFscGhhU2xpZGVyO1xuXG5cblx0Y29uc3RydWN0b3IoIHByb3BzOiBDb2xvclBpY2tlclByb3BzICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXHRcblx0XHRpZiggcHJvcHMuY29sb3IgaW5zdGFuY2VvZiBDb2xvciApIHtcblx0XHRcdHRoaXMuX2Jhc2UgPSBwcm9wcy5jb2xvcjtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLl9iYXNlID0gbmV3IENvbG9yKCBwcm9wcy5jb2xvciApO1xuXHRcdH1cblxuXHRcdGxldCBoc3YgPSB0aGlzLl9iYXNlLnRvSHN2KCApO1xuXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwidGFiaW5kZXhcIiwgMCApO1xuXG5cdFx0dGhpcy5zZXRDb250ZW50KCBbXG5cdFx0XHR0aGlzLl9zYXQgPSBuZXcgU2F0dXJhdGlvbiggeyB9LCBoc3YgKSxcblx0XHRcdG5ldyBIQm94KCB7XG5cdFx0XHRcdGNsczogXCJib2R5XCIsXG5cdFx0XHRcdGNvbnRlbnQ6IFtcblx0XHRcdFx0XHRuZXcgVkJveCgge2NsczogXCJ4NGZsZXhcIiwgY29udGVudDogW1xuXHRcdFx0XHRcdFx0dGhpcy5faHVlID0gbmV3IEh1ZVNsaWRlciggeyB9LCBoc3YgKSxcblx0XHRcdFx0XHRcdHRoaXMuX2FscGhhID0gbmV3IEFscGhhU2xpZGVyKCB7IH0sIGhzdiApLFxuXHRcdFx0XHRcdF0gfSApLFxuXHRcdFx0XHRcdG5ldyBCb3goIHsgY2xzOiBcInN3YXRjaFwiLCBjb250ZW50OiBbXG5cdFx0XHRcdFx0XHRuZXcgQ29tcG9uZW50KCB7IGNsczogXCJvdmVybGF5IGNoZWNrZXJzXCIgfSApLFxuXHRcdFx0XHRcdFx0dGhpcy5fc3dhdGNoID0gbmV3IENvbXBvbmVudCggeyBjbHM6IFwib3ZlcmxheVwiIH0gKSxcblx0XHRcdFx0XHRdIH0gKVxuXHRcdFx0XHRdXG5cdFx0XHR9KVxuXHRcdF0pO1xuXG5cdFx0dGhpcy5fc2F0Lm9uKCBcInNhdF9jaGFuZ2VcIiwgKCBldiApID0+IHtcblx0XHRcdGhzdi5zYXR1cmF0aW9uID0gZXYuc2F0dXJhdGlvbjtcblx0XHRcdGhzdi52YWx1ZSA9IGV2LnZhbHVlO1xuXHRcdFx0dXBkYXRlQ29sb3IoICk7XG5cdFx0XHR0aGlzLl9hbHBoYS51cGRhdGVCYXNlQ29sb3IoIGhzdiApO1xuXHRcdH0gKTtcblxuXHRcdHRoaXMuX2h1ZS5vbiggJ2h1ZV9jaGFuZ2UnLCAoIGV2ICkgPT4ge1xuXHRcdFx0aHN2Lmh1ZSA9IGV2Lmh1ZTtcblx0XHRcdHRoaXMuX3NhdC51cGRhdGVCYXNlQ29sb3IoIGhzdiApO1xuXHRcdFx0dGhpcy5fYWxwaGEudXBkYXRlQmFzZUNvbG9yKCBoc3YgKTtcblx0XHRcdHVwZGF0ZUNvbG9yKCApO1xuXHRcdH0gKTtcblxuXHRcdHRoaXMuX2FscGhhLm9uKCAnYWxwaGFfY2hhbmdlJywgKCBldiApID0+IHtcblx0XHRcdGhzdi5hbHBoYSA9IGV2LmFscGhhO1xuXHRcdFx0dXBkYXRlQ29sb3IoICk7XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgdXBkYXRlQ29sb3IgPSAoICkgPT4ge1xuXHRcdFx0dGhpcy5fYmFzZS5zZXRIc3YoIGhzdi5odWUsIGhzdi5zYXR1cmF0aW9uLCBoc3YudmFsdWUsIGhzdi5hbHBoYSApO1xuXHRcdFx0dGhpcy5fc3dhdGNoLnNldFN0eWxlVmFsdWUoIFwiYmFja2dyb3VuZENvbG9yXCIsIHRoaXMuX2Jhc2UudG9SZ2JTdHJpbmcoKSApO1xuXHRcdFx0dGhpcy5fc3dhdGNoLnNldEF0dHJpYnV0ZSggXCJ0b29sdGlwXCIsIHRoaXMuX2Jhc2UudG9SZ2JTdHJpbmcoKSApO1xuXG5cdFx0XHR0aGlzLmZpcmUoIFwiY2hhbmdlXCIsIHsgY29sb3I6IHRoaXMuX2Jhc2UgfSApO1xuXHRcdH1cblxuXHRcdGlmKCBpc0ZlYXR1cmVBdmFpbGFibGUoXCJleWVkcm9wcGVyXCIpICkge1xuXHRcdFx0dGhpcy5fc3dhdGNoLmFkZERPTUV2ZW50KCBcImNsaWNrXCIsICggZSApID0+IHtcblx0XHRcdFx0Y29uc3QgZXllRHJvcHBlciA9IG5ldyAod2luZG93IGFzIGFueSkuRXllRHJvcHBlcigpO1xuXHRcdFx0XHRleWVEcm9wcGVyLm9wZW4oICkudGhlbiggKCByZXN1bHQ6IGFueSApID0+IHtcblx0XHRcdFx0XHRjb25zdCBjb2xvciA9IG5ldyBDb2xvciggcmVzdWx0LnNSR0JIZXggKTtcblx0XHRcdFx0XHRoc3YgPSBjb2xvci50b0hzdiggKTtcblxuXHRcdFx0XHRcdHRoaXMuX2FscGhhLnNldENvbG9yKCBoc3YgKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR0aGlzLl9zYXQudXBkYXRlQmFzZUNvbG9yKCBoc3YgKTtcblx0XHRcdFx0XHR0aGlzLl9odWUudXBkYXRlSHVlKCBoc3YgKTtcblx0XHRcdFx0XHR1cGRhdGVDb2xvciggKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KVxuXHRcdH1cblxuXHRcdHRoaXMuYWRkRE9NRXZlbnQoIFwia2V5ZG93blwiLCAoIGV2ICkgPT4gdGhpcy5fb25rZXkoIGV2ICkgKTtcblxuXHRcdHVwZGF0ZUNvbG9yKCApO1xuXHR9XG5cblx0cHJpdmF0ZSBfb25rZXkoIGV2OiBLZXlib2FyZEV2ZW50ICkge1xuXHRcdHN3aXRjaCggZXYua2V5ICkge1xuXHRcdFx0Y2FzZSBcIkFycm93TGVmdFwiOiB7XG5cdFx0XHRcdGlmKCBldi5jdHJsS2V5ICkge1xuXHRcdFx0XHRcdHRoaXMuX2h1ZS5tb3ZlKCAtMC4wMSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX3NhdC5tb3ZlKCBcInNhdHVyYXRpb25cIiwgLTAuMDEgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSBcIkFycm93UmlnaHRcIjoge1xuXHRcdFx0XHRpZiggZXYuY3RybEtleSApIHtcblx0XHRcdFx0XHR0aGlzLl9odWUubW92ZSggMC4wMSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX3NhdC5tb3ZlKCBcInNhdHVyYXRpb25cIiwgMC4wMSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIFwiQXJyb3dVcFwiOiB7XG5cdFx0XHRcdGlmKCBldi5jdHJsS2V5ICkge1xuXHRcdFx0XHRcdHRoaXMuX2FscGhhLm1vdmUoIDAuMDEgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9zYXQubW92ZSggXCJ2YWx1ZVwiLCAwLjAxICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgXCJBcnJvd0Rvd25cIjoge1xuXHRcdFx0XHRpZiggZXYuY3RybEtleSApIHtcblx0XHRcdFx0XHR0aGlzLl9hbHBoYS5tb3ZlKCAtMC4wMSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX3NhdC5tb3ZlKCBcInZhbHVlXCIsIC0wLjAxICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59IiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSB2aWV3cG9ydC50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudFByb3BzIH0gZnJvbSBcIi4uLy4uL2NvcmUvY29tcG9uZW50XCJcblxuaW1wb3J0IFwiLi92aWV3cG9ydC5tb2R1bGUuc2Nzc1wiXG5cbmV4cG9ydCBjbGFzcyBWaWV3cG9ydCBleHRlbmRzIENvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKCBwcm9wczogQ29tcG9uZW50UHJvcHMgKSB7XG5cdFx0c3VwZXIoIHByb3BzICk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFNjcm9sbFZpZXcgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvciggcHJvcHM6IENvbXBvbmVudFByb3BzICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXHRcdHRoaXMuc2V0Q29udGVudCggbmV3IFZpZXdwb3J0KCB7fSApICk7XG5cdH1cblxuXHRnZXRWaWV3cG9ydCggKSB7XG5cdFx0cmV0dXJuIHRoaXMuZmlyc3RDaGlsZDxWaWV3cG9ydD4oICk7XG5cdH1cbn1cblxuXG4iLCAiLyoqIFxuICogIF9fXyAgX19fIF9fXG4gKiAgXFwgIFxcLyAgLyAgLyBfXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xuICogICAvICAgIFxcX19fXyAgIF98ICBcbiAqICAvX18vXFxfX1xcICAgfF98XG4gKiBcbiAqIEBmaWxlIGxpc3Rib3gudHNcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxuICogXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRFdmVudCwgQ29tcG9uZW50RXZlbnRzLCBjb21wb25lbnRGcm9tRE9NLCBDb21wb25lbnRQcm9wcywgRXZDaGFuZ2UsIEV2Q2xpY2ssIEV2Q29udGV4dE1lbnUsIEV2RGJsQ2xpY2ssIEV2U2VsZWN0aW9uQ2hhbmdlIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQnO1xuXG5pbXBvcnQgeyBTY3JvbGxWaWV3LCBWaWV3cG9ydCB9IGZyb20gJy4uL3ZpZXdwb3J0L3ZpZXdwb3J0JztcbmltcG9ydCB7IEhCb3ggfSBmcm9tICcuLi9ib3hlcy9ib3hlcy5qcyc7XG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gJy4uL2xhYmVsL2xhYmVsLmpzJztcblxuaW1wb3J0IFwiLi9saXN0Ym94Lm1vZHVsZS5zY3NzXCJcblxuZXhwb3J0IGVudW0ga2JOYXYge1xuXHRmaXJzdCxcblx0cHJldixcblx0bmV4dCxcblx0bGFzdCxcbn1cblxuZXhwb3J0IHR5cGUgTGlzdGJveElEID0gbnVtYmVyIHwgc3RyaW5nO1xuXG5leHBvcnQgaW50ZXJmYWNlIExpc3RJdGVtIHtcblx0aWQ6IExpc3Rib3hJRDtcblx0dGV4dDogc3RyaW5nO1xuXG5cdGljb25JZD86IHN0cmluZztcblx0ZGF0YT86IGFueTtcblx0Y2xzPzogc3RyaW5nO1xuXHRjaGVja2VkPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBcbiAqL1xuXG5cbmludGVyZmFjZSBMaXN0Ym94RXZlbnRzIGV4dGVuZHMgQ29tcG9uZW50RXZlbnRzIHtcblx0Ly9jaGFuZ2U6IEV2Q2hhbmdlO1xuXHRjbGljaz86IEV2Q2xpY2s7XG5cdGRibENsaWNrPzogRXZEYmxDbGljaztcblx0Y29udGV4dE1lbnU/OiBFdkNvbnRleHRNZW51O1xuXHRzZWxlY3Rpb25DaGFuZ2U/OiBFdlNlbGVjdGlvbkNoYW5nZTtcbn1cblxuLyoqXG4gKiBcbiAqL1xuXG5pbnRlcmZhY2UgTGlzdGJveFByb3BzIGV4dGVuZHMgT21pdDxDb21wb25lbnRQcm9wcywnY29udGVudCc+IHtcblx0aXRlbXM/OiBMaXN0SXRlbVtdO1xuXHRyZW5kZXJlcj86ICggaXRlbTogTGlzdEl0ZW0gKSA9PiBDb21wb25lbnQ7XG5cdC8vaGVhZGVyPzogSGVhZGVyO1xuXHRjaGVja2FibGU/OiB0cnVlLFxufVxuXG5cblxuZXhwb3J0IGNsYXNzIExpc3Rib3ggZXh0ZW5kcyBDb21wb25lbnQ8TGlzdGJveFByb3BzLExpc3Rib3hFdmVudHM+IHtcblxuXHRwcml2YXRlIF92aWV3OiBWaWV3cG9ydDtcblx0cHJpdmF0ZSBfc2VsZWN0aW9uOiBMaXN0Ym94SUQ7XG5cdHByaXZhdGUgX3NlbGl0ZW06IENvbXBvbmVudDtcblx0cHJpdmF0ZSBfaXRlbXM6IExpc3RJdGVtW107XG5cblx0cHJldmVudEZvY3VzID0gZmFsc2U7XG5cblx0Y29uc3RydWN0b3IoIHByb3BzOiBMaXN0Ym94UHJvcHMgKSB7XG5cdFx0c3VwZXIoIHsgLi4ucHJvcHMgfSApO1xuXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoIFwidGFiaW5kZXhcIiwgMCApO1xuXHRcdFxuXHRcdGNvbnN0IHNjcm9sbGVyID0gbmV3IFNjcm9sbFZpZXcoIHsgY2xzOiBcImJvZHlcIiB9ICk7XG5cdFx0dGhpcy5fdmlldyA9IHNjcm9sbGVyLmdldFZpZXdwb3J0KCApO1xuXG5cdFx0dGhpcy5zZXRDb250ZW50KCBbXG5cdFx0XHQvL3Byb3BzLmhlYWRlciA/IHByb3BzLmhlYWRlciA6IG51bGwsXG5cdFx0XHRzY3JvbGxlcixcblx0XHRdICk7XG5cdFx0XG5cdFx0dGhpcy5zZXRET01FdmVudHMoIHtcblx0XHRcdGNsaWNrOiBcdCAoZXYpID0+IHRoaXMuX29uX2NsaWNrKCBldiApLFxuXHRcdFx0a2V5ZG93bjogKCBldiApID0+IHRoaXMuX29uX2tleSggZXYgKSxcblx0XHRcdGRibGNsaWNrOiAoZSkgPT4gdGhpcy5fb25fY2xpY2soZSksXG5cdFx0XHRjb250ZXh0bWVudTogKGUpID0+IHRoaXMuX29uX2N0eF9tZW51KGUpLFxuXHRcdH0gKTtcblxuXHRcdGlmKCBwcm9wcy5pdGVtcyApIHtcblx0XHRcdHRoaXMuc2V0SXRlbXMoIHByb3BzLml0ZW1zICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRwcml2YXRlIF9vbl9rZXkoIGV2OiBLZXlib2FyZEV2ZW50ICkge1xuXHRcdGlmKCB0aGlzLmlzRGlzYWJsZWQoKSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRzd2l0Y2goIGV2LmtleSApIHtcblx0XHRcdGNhc2UgXCJBcnJvd0Rvd25cIjoge1xuXHRcdFx0XHR0aGlzLm5hdmlnYXRlKCBrYk5hdi5uZXh0ICk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIFwiQXJyb3dVcFwiOiB7XG5cdFx0XHRcdHRoaXMubmF2aWdhdGUoIGtiTmF2LnByZXYgKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgXCJIb21lXCI6IHtcblx0XHRcdFx0dGhpcy5uYXZpZ2F0ZSgga2JOYXYuZmlyc3QgKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgXCJFbmRcIjoge1xuXHRcdFx0XHR0aGlzLm5hdmlnYXRlKCBrYk5hdi5sYXN0ICk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZXYucHJldmVudERlZmF1bHQoICk7XG5cdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRuYXZpZ2F0ZSggc2Vuczoga2JOYXYgKSB7XG5cdFx0XG5cdFx0aWYoICF0aGlzLl9zZWxpdGVtICkge1xuXHRcdFx0aWYoIHNlbnM9PWtiTmF2Lm5leHQgKSAgc2VucyA9IGtiTmF2LmZpcnN0O1xuXHRcdFx0ZWxzZSBzZW5zID0ga2JOYXYubGFzdDtcblx0XHR9XG5cblx0XHRjb25zdCBuZXh0X3Zpc2libGUgPSAoIGVsOiBDb21wb25lbnQsIGRvd246IGJvb2xlYW4gKSA9PiB7XG5cdFx0XHRcblx0XHRcdHdoaWxlKCBlbCAmJiAhZWwuaXNWaXNpYmxlKCkgKSB7XG5cdFx0XHRcdGVsID0gZG93biA/IGVsLm5leHRFbGVtZW50KCkgOiBlbC5wcmV2RWxlbWVudCgpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWw7XG5cdFx0fVxuXG5cdFx0aWYoIHNlbnM9PWtiTmF2LmZpcnN0IHx8IHNlbnM9PWtiTmF2Lmxhc3QgKSB7XG5cdFx0XHRsZXQgZmVsID0gc2Vucz09a2JOYXYuZmlyc3QgPyB0aGlzLl92aWV3LmZpcnN0Q2hpbGQoKSA6IHRoaXMuX3ZpZXcubGFzdENoaWxkKCApO1xuXHRcdFx0ZmVsID0gbmV4dF92aXNpYmxlKCBmZWwsIHNlbnM9PWtiTmF2LmZpcnN0ICk7XG5cblx0XHRcdGlmKCBmZWwgKSB7XG5cdFx0XHRcdGNvbnN0IGlkID0gZmVsLmdldERhdGEoIFwiaWRcIiApO1xuXHRcdFx0XHR0aGlzLl9zZWxlY3RJdGVtKCBpZCwgZmVsICk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGxldCBuZWwgPSBzZW5zPT1rYk5hdi5uZXh0ID8gdGhpcy5fc2VsaXRlbS5uZXh0RWxlbWVudCgpIDogdGhpcy5fc2VsaXRlbS5wcmV2RWxlbWVudCgpO1xuXHRcdFx0bmVsID0gbmV4dF92aXNpYmxlKCBuZWwsIHNlbnM9PWtiTmF2Lm5leHQgKTtcblxuXHRcdFx0aWYoIG5lbCApIHtcblx0XHRcdFx0Y29uc3QgaWQgPSBuZWwuZ2V0RGF0YSggXCJpZFwiICk7XG5cdFx0XHRcdHRoaXMuX3NlbGVjdEl0ZW0oIGlkLCBuZWwgKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblx0XG5cdHByaXZhdGUgX29uX2NsaWNrKCBldjogVUlFdmVudCApIHtcblx0XHRldi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCggKTtcblxuXHRcdGxldCB0YXJnZXQgPSBldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0d2hpbGUoIHRhcmdldCAmJiB0YXJnZXQhPXRoaXMuZG9tICkge1xuXHRcdFx0Y29uc3QgYyA9IGNvbXBvbmVudEZyb21ET00oIHRhcmdldCApO1xuXHRcdFx0aWYoIGMgJiYgYy5oYXNDbGFzcyhcIng0aXRlbVwiKSApIHtcblx0XHRcdFx0Y29uc3QgaWQgPSBjLmdldERhdGEoIFwiaWRcIiApO1xuXHRcdFx0XHRjb25zdCBmZXY6IENvbXBvbmVudEV2ZW50ID0geyBjb250ZXh0OmlkIH07XG5cblx0XHRcdFx0aWYgKGV2LnR5cGUgPT0gJ2NsaWNrJykge1xuXHRcdFx0XHRcdHRoaXMuZmlyZSgnY2xpY2snLCBmZXYgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0aGlzLmZpcmUoJ2RibENsaWNrJywgZmV2ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIWZldi5kZWZhdWx0UHJldmVudGVkKSB7XG5cdFx0XHRcdFx0dGhpcy5fc2VsZWN0SXRlbSggaWQsIGMgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcblx0XHR9XG5cblx0XHR0aGlzLmNsZWFyU2VsZWN0aW9uKCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRwcml2YXRlIF9vbl9jdHhfbWVudShldjogTW91c2VFdmVudCkge1xuXG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcdFx0XG5cblx0XHRsZXQgdGFyZ2V0ID0gZXYudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXHRcdHdoaWxlKCB0YXJnZXQgJiYgdGFyZ2V0IT10aGlzLmRvbSApIHtcblx0XHRcdGNvbnN0IGMgPSBjb21wb25lbnRGcm9tRE9NKCB0YXJnZXQgKTtcblx0XHRcdGlmKCBjICYmIGMuaGFzQ2xhc3MoXCJ4NGl0ZW1cIikgKSB7XG5cdFx0XHRcdGNvbnN0IGlkID0gYy5nZXREYXRhKCBcImlkXCIgKTtcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMuX3NlbGVjdEl0ZW0oaWQsIGMpO1xuXHRcdFx0XHR0aGlzLmZpcmUoJ2NvbnRleHRNZW51Jywge3VpZXZlbnQ6IGV2LCBjb250ZXh0OiBpZCB9ICk7XG5cdFx0XHRcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcblx0XHR9XG5cblx0XHR0aGlzLmZpcmUoJ2NvbnRleHRNZW51JywgeyB1aWV2ZW50OmV2LCBjb250ZXh0OiBudWxsIH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0cHJpdmF0ZSBfc2VsZWN0SXRlbSggaWQ6IExpc3Rib3hJRCwgaXRlbTogQ29tcG9uZW50ICkge1xuXHRcdGlmKCB0aGlzLl9zZWxpdGVtICkge1xuXHRcdFx0dGhpcy5fc2VsaXRlbS5yZW1vdmVDbGFzcyggXCJzZWxlY3RlZFwiICk7XG5cdFx0XHR0aGlzLl9zZWxpdGVtID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHRoaXMuX3NlbGl0ZW0gPSBpdGVtO1xuXHRcdHRoaXMuX3NlbGVjdGlvbiA9IGlkO1xuXG5cdFx0aWYoIGl0ZW0gKSB7XG5cdFx0XHRpdGVtLmFkZENsYXNzKCBcInNlbGVjdGVkXCIgKTtcblx0XHRcdGl0ZW0uc2Nyb2xsSW50b1ZpZXcoIHtcblx0XHRcdFx0YmVoYXZpb3I6IFwic21vb3RoXCIsXG5cdFx0XHRcdGJsb2NrOiBcIm5lYXJlc3RcIlxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGNvbnN0IGl0bSA9IHRoaXMuX2ZpbmRJdGVtKCBpZCApO1xuXHRcdHRoaXMuZmlyZSggXCJzZWxlY3Rpb25DaGFuZ2VcIiwgeyBzZWxlY3Rpb246IGl0bSB9ICk7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdHByaXZhdGUgX2ZpbmRJdGVtKCBpZDogTGlzdGJveElEICkge1xuXHRcdHJldHVybiB0aGlzLl9pdGVtcy5maW5kKCB4ID0+IHguaWQ9PWlkICk7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXHRcblx0cHJpdmF0ZSBfZmluZEl0ZW1JbmRleCggaWQ6IExpc3Rib3hJRCApIHtcblx0XHRyZXR1cm4gdGhpcy5faXRlbXMuZmluZEluZGV4KCB4ID0+IHguaWQ9PWlkICk7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdGNsZWFyU2VsZWN0aW9uKCApIHtcblx0XHRpZiggdGhpcy5fc2VsaXRlbSApIHtcblx0XHRcdHRoaXMuX3NlbGl0ZW0ucmVtb3ZlQ2xhc3MoIFwic2VsZWN0ZWRcIiApO1xuXHRcdFx0dGhpcy5fc2VsaXRlbSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHR0aGlzLl9zZWxlY3Rpb24gPSB1bmRlZmluZWQ7XG5cdFx0dGhpcy5maXJlKCBcInNlbGVjdGlvbkNoYW5nZVwiLCB7IHNlbGVjdGlvbjogdW5kZWZpbmVkIH0gKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRzZXRJdGVtcyggaXRlbXM6IExpc3RJdGVtW10gKSB7XG5cdFx0dGhpcy5jbGVhclNlbGVjdGlvbiggKTtcblx0XHRcblx0XHR0aGlzLl92aWV3LmNsZWFyQ29udGVudCggKTtcblx0XHR0aGlzLl9pdGVtcyA9IGl0ZW1zO1xuXG5cdFx0aWYoIGl0ZW1zICkge1xuXHRcdFx0Y29uc3QgY29udGVudCA9IGl0ZW1zLm1hcCggeCA9PiB0aGlzLnJlbmRlckl0ZW0oeCkgKTtcblx0XHRcdHRoaXMuX3ZpZXcuc2V0Q29udGVudCggY29udGVudCApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0cmVuZGVySXRlbSggaXRlbTogTGlzdEl0ZW0gKSB7XG5cdFx0Y29uc3QgcmVuZGVyZXIgPSB0aGlzLnByb3BzLnJlbmRlcmVyID8/IHRoaXMuZGVmYXVsdFJlbmRlcmVyO1xuXHRcdGNvbnN0IGxpbmUgPSByZW5kZXJlciggaXRlbSApO1xuXHRcblx0XHRsaW5lLmFkZENsYXNzKCBcIng0aXRlbVwiICk7XG5cdFx0bGluZS5zZXREYXRhKCBcImlkXCIsIGl0ZW0uaWQrXCJcIiApO1xuXHRcdFxuXHRcdHJldHVybiBsaW5lO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblxuXHRkZWZhdWx0UmVuZGVyZXIoIGl0ZW06IExpc3RJdGVtICk6IENvbXBvbmVudCB7XG5cdFx0cmV0dXJuIG5ldyBIQm94KCB7XG5cdFx0XHRjbHM6IGl0ZW0uY2xzLFxuXHRcdFx0Y29udGVudDogbmV3IExhYmVsKCB7IGljb246IGl0ZW0uaWNvbklkLCB0ZXh0OiBpdGVtLnRleHQgfSkgXG5cdFx0fSApXG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdGZpbHRlciggZmlsdGVyOiBzdHJpbmcgKSB7XG5cdFx0Y29uc3QgY2hpbGRzID0gdGhpcy5fdmlldy5lbnVtQ2hpbGRDb21wb25lbnRzKCBmYWxzZSApO1xuXHRcdFxuXHRcdGlmKCAhZmlsdGVyICkge1xuXHRcdFx0Y2hpbGRzLmZvckVhY2goIHggPT4geC5zaG93KCB0cnVlICkgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQvLyBnZXQgbGlzdCBvZiB2aXNpYmxlIGl0ZW1zXG5cdFx0XHRjb25zdCBmaWx0cmVkID0gdGhpcy5faXRlbXNcblx0XHRcdFx0XHQuZmlsdGVyKCB4ID0+IHgudGV4dC5pbmNsdWRlcyhmaWx0ZXIpIClcblx0XHRcdFx0XHQubWFwKCB4ID0+IHguaWQrJycgKTtcblxuXHRcdFx0Ly8gbm93IGhpZGUgYWxsIGVsZW1lbnRzIG5vdCBpbiBsaXN0XG5cdFx0XHRjaGlsZHMuZm9yRWFjaCggeCA9PiB7XG5cdFx0XHRcdHguc2hvdyggZmlsdHJlZC5pbmNsdWRlcyggeC5nZXREYXRhKCBcImlkXCIgKSApICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogYXBwZW5kIG9yIHByZXBlbmQgYSBuZXcgaXRlbVxuXHQgKiBAcGFyYW0gaXRlbSBcblx0ICogQHBhcmFtIHByZXBlbmQgXG5cdCAqIEBwYXJhbSBzZWxlY3QgXG5cdCAqL1xuXG5cdGFwcGVuZEl0ZW0oIGl0ZW06IExpc3RJdGVtLCBwcmVwZW5kID0gZmFsc2UsIHNlbGVjdCA9IHRydWUgKSB7XG5cdFx0XG5cdFx0aWYoIHNlbGVjdCApIHtcblx0XHRcdHRoaXMuY2xlYXJTZWxlY3Rpb24oICk7XG5cdFx0fVxuXG5cdFx0bGV0IGVsID0gdGhpcy5yZW5kZXJJdGVtKCBpdGVtICk7XG5cblx0XHRpZiggcHJlcGVuZCApIHtcblx0XHRcdHRoaXMuX2l0ZW1zLnVuc2hpZnQoIGl0ZW0gKTtcblx0XHRcdHRoaXMuX3ZpZXcucHJlcGVuZENvbnRlbnQoIGVsICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5faXRlbXMucHVzaCggaXRlbSApO1xuXHRcdFx0dGhpcy5fdmlldy5hcHBlbmRDb250ZW50KCBlbCApO1xuXHRcdH1cblxuXHRcdGlmKCBzZWxlY3QgKSB7XG5cdFx0XHR0aGlzLl9zZWxlY3RJdGVtKCBpdGVtLmlkLCBlbCApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiB1cGRhdGUgYW4gaXRlbVxuXHQgKi9cblxuXHQgdXBkYXRlSXRlbSggaWQ6IGFueSwgaXRlbTogTGlzdEl0ZW0gKSB7XG5cblx0XHQvLyBmaW5kIGl0ZW1cblx0XHRjb25zdCBpZHggPSB0aGlzLl9maW5kSXRlbUluZGV4KCBpZCApO1xuXHRcdGlmKCBpZHg8MCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gdGFrZSBjYXJlIG9mIHNlbGVjdGlvblxuXHRcdGxldCB3YXNfc2VsID0gZmFsc2U7XG5cdFx0aWYoIHRoaXMuX3NlbGVjdGlvbiAmJiB0aGlzLl9zZWxlY3Rpb249PT1pZCApIHtcblx0XHRcdHdhc19zZWwgPSB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIHJlcGxhY2UgaXQgaW4gdGhlIGxpc3Rcblx0XHR0aGlzLl9pdGVtc1tpZHhdID0gaXRlbTtcblxuXHRcdC8vIHJlYnVpbGQgJiByZXBsYWNlIGl0J3MgbGluZVxuXHRcdGNvbnN0IG9sZERPTSA9IHRoaXMucXVlcnkoIGBbZGF0YS1pZD1cIiR7aXRlbS5pZH1cIl1gICk/LmRvbTtcblx0XHRpZiggb2xkRE9NICkge1xuXHRcdFx0Y29uc3QgX25ldyA9IHRoaXMucmVuZGVySXRlbSggaXRlbSApO1xuXHRcdFx0dGhpcy5fdmlldy5kb20ucmVwbGFjZUNoaWxkKCBfbmV3LmRvbSwgb2xkRE9NICk7XG5cblx0XHRcdGlmKCB3YXNfc2VsICkge1xuXHRcdFx0XHR0aGlzLl9zZWxlY3RJdGVtKCBpdGVtLmlkLCBfbmV3ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG4iLCAiLyoqIFxuICogIF9fXyAgX19fIF9fXG4gKiAgXFwgIFxcLyAgLyAgLyBfXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xuICogICAvICAgIFxcX19fXyAgIF98ICBcbiAqICAvX18vXFxfX1xcICAgfF98XG4gKiBcbiAqIEBmaWxlIGNvbWJvYm94LnRzXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcbiAqIFxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50RXZlbnQsIENvbXBvbmVudFByb3BzLCBFdkNoYW5nZSwgRXZTZWxlY3Rpb25DaGFuZ2UsIG1ha2VVbmlxdWVDb21wb25lbnRJZCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50JztcbmltcG9ydCB7IExpc3Rib3gsIExpc3Rib3hJRCwgTGlzdEl0ZW0sIGtiTmF2IH0gZnJvbSAnLi4vbGlzdGJveC9saXN0Ym94JztcbmltcG9ydCB7IFBvcHVwLCBQb3B1cEV2ZW50cywgUG9wdXBQcm9wcyB9IGZyb20gJy4uL3BvcHVwL3BvcHVwLmpzJztcbmltcG9ydCB7IExhYmVsIH0gZnJvbSAnLi4vbGFiZWwvbGFiZWwnO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tICcuLi9pbnB1dC9pbnB1dCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi9idXR0b24vYnV0dG9uJztcbmltcG9ydCB7IEhCb3ggfSBmcm9tICcuLi9ib3hlcy9ib3hlcyc7XG5cbmltcG9ydCBcIi4vY29tYm9ib3gubW9kdWxlLnNjc3NcIjtcbmltcG9ydCBpY29uIGZyb20gXCIuL3VwZG93bi5zdmdcIjtcblxuXG5cbmludGVyZmFjZSBEcm9wZG93bkV2ZW50cyBleHRlbmRzIFBvcHVwRXZlbnRzIHtcblx0c2VsZWN0aW9uQ2hhbmdlOiBFdlNlbGVjdGlvbkNoYW5nZTtcbn1cblxuXG5pbnRlcmZhY2UgRHJvcGRvd25Qcm9wcyBleHRlbmRzIE9taXQ8UG9wdXBQcm9wcyxcImNvbnRlbnRcIj4ge1xuXHRpdGVtczogTGlzdEl0ZW1bXTtcbn1cblxuY2xhc3MgRHJvcGRvd24gZXh0ZW5kcyBQb3B1cDxEcm9wZG93blByb3BzLERyb3Bkb3duRXZlbnRzPiB7XG5cblx0cHJpdmF0ZSBfbGlzdDogTGlzdGJveDtcblxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IERyb3Bkb3duUHJvcHMsIGNvbnRlbnQ/OiBMaXN0SXRlbVtdICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0dGhpcy5fbGlzdCA9IG5ldyBMaXN0Ym94KCB7IGl0ZW1zOiBwcm9wcy5pdGVtcyB9ICk7XG5cdFx0dGhpcy5zZXRDb250ZW50KCB0aGlzLl9saXN0ICk7XG5cblx0XHR0aGlzLmFkZERPTUV2ZW50KCBcIm1vdXNlZG93blwiLCAoIGV2OiBFdmVudCApID0+IHsgXG5cdFx0XHRjb25zb2xlLmxvZyggXCJ0cmFwXCIgKTtcblx0XHRcdGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiggKTtcblx0XHRcdGV2LnN0b3BQcm9wYWdhdGlvbiggKTtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCApO1xuXHRcdH0sIHRydWUgKTtcblxuXHRcdHRoaXMuX2xpc3Qub24oIFwic2VsZWN0aW9uQ2hhbmdlXCIsICggZXYgKSA9PiB7XG5cdFx0XHR0aGlzLmZpcmUoIFwic2VsZWN0aW9uQ2hhbmdlXCIsIGV2ICk7XG5cdFx0fSlcblx0fVxuXG5cdGdldExpc3QoICkge1xuXHRcdHJldHVybiB0aGlzLl9saXN0O1xuXHR9XG59XG5cblxuLyoqXG4gKiBcbiAqL1xuXG5pbnRlcmZhY2UgQ29tYm9ib3hQcm9wcyBleHRlbmRzIE9taXQ8Q29tcG9uZW50UHJvcHMsXCJjb250ZW50XCI+IHtcblx0bGFiZWw/OiBzdHJpbmc7XG5cdGxhYmVsV2lkdGg/OiBudW1iZXIgfCBzdHJpbmc7XG5cdHJlYWRvbmx5PzogYm9vbGVhbjtcblx0aXRlbXM6IExpc3RJdGVtW107XG59XG5cblxuZXhwb3J0IGNsYXNzIENvbWJvYm94IGV4dGVuZHMgQ29tcG9uZW50PENvbWJvYm94UHJvcHM+IHtcblxuXHRwcml2YXRlIF9kcm9wZG93bjogRHJvcGRvd247XG5cdHByaXZhdGUgX2xhYmVsOiBMYWJlbDtcblx0cHJpdmF0ZSBfaW5wdXQ6IElucHV0O1xuXHRwcml2YXRlIF9idXR0b246IEJ1dHRvbjtcblx0cHJpdmF0ZSBfcHJldmVudF9jbG9zZSA9IGZhbHNlO1xuXHRwcml2YXRlIF9lZGl0OiBIQm94O1xuXHRcdFx0XHRcblx0Y29uc3RydWN0b3IoIHByb3BzOiBDb21ib2JveFByb3BzICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0Y29uc3QgaWQgPSBtYWtlVW5pcXVlQ29tcG9uZW50SWQoICk7XG5cblx0XHR0aGlzLnNldENvbnRlbnQoIFtcblx0XHRcdG5ldyBIQm94KCB7IGlkOiBcImxhYmVsXCIsIGNvbnRlbnQ6IG5ldyBMYWJlbCggeyB0YWc6IFwibGFiZWxcIiwgdGV4dDogcHJvcHMubGFiZWwsIGxhYmVsRm9yOiBpZCwgd2lkdGg6IHByb3BzLmxhYmVsV2lkdGggfSApIH0gKSxcblx0XHRcdHRoaXMuX2VkaXQgID0gbmV3IEhCb3goIHsgaWQ6IFwiZWRpdFwiLCBjb250ZW50OiBbXG5cdFx0XHRcdHRoaXMuX2lucHV0ICA9IG5ldyBJbnB1dCggeyB0eXBlOiBcInRleHRcIiwgdmFsdWU6IFwiXCIsIHJlYWRvbmx5OiBwcm9wcy5yZWFkb25seSB9KSxcblx0XHRcdFx0dGhpcy5fYnV0dG9uID0gbmV3IEJ1dHRvbiggeyBpY29uOiBpY29uIH0gKVxuXHRcdFx0XX0gKSxcblx0XHRdKVxuXG5cdFx0dGhpcy5fZHJvcGRvd24gPSBuZXcgRHJvcGRvd24oIHsgaXRlbXM6IHByb3BzLml0ZW1zIH0gKTtcblxuXHRcdHRoaXMuX2Ryb3Bkb3duLm9uKCBcInNlbGVjdGlvbkNoYW5nZVwiLCAoIGV2ICkgPT4ge1xuXHRcdFx0Y29uc3Qgc2VsID0gZXYuc2VsZWN0aW9uIGFzIExpc3RJdGVtO1xuXHRcdFx0dGhpcy5faW5wdXQuc2V0VmFsdWUoIHNlbCA/IHNlbC50ZXh0IDogXCJcIiApO1xuXHRcdFx0XG5cdFx0XHRpZiggIXRoaXMuX3ByZXZlbnRfY2xvc2UgKSB7XG5cdFx0XHRcdHRoaXMuX2Ryb3Bkb3duLnNob3coIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9idXR0b24uYWRkRE9NRXZlbnQoIFwiY2xpY2tcIiwgKCApID0+IHRoaXMuX29uX2NsaWNrKCApICk7XG5cdFx0dGhpcy5faW5wdXQuYWRkRE9NRXZlbnQoIFwiaW5wdXRcIiwgKCApID0+IHRoaXMuX29uX2lucHV0KCApICk7XG5cdFx0dGhpcy5faW5wdXQuYWRkRE9NRXZlbnQoIFwia2V5ZG93blwiLCAoIGV2ICkgPT4gdGhpcy5fb25fa2V5KCBldiApICk7XG5cblx0XHR0aGlzLnNldERPTUV2ZW50cygge1xuXHRcdFx0Zm9jdXNvdXQ6ICggKSA9PiB0aGlzLl9vbl9mb2N1c291dCggKSxcblx0XHRcdGNsaWNrOiAoICkgPT4gdGhpcy5fb25fY2xpY2soICksXG5cdFx0fSlcblx0fVxuXG5cdHByaXZhdGUgX29uX2tleSggZXY6IEtleWJvYXJkRXZlbnQgKSB7XG5cdFx0c3dpdGNoKCBldi5rZXkgKSB7XG5cdFx0XHRjYXNlIFwiRW50ZXJcIjpcblx0XHRcdGNhc2UgXCJFc2NhcGVcIjoge1xuXHRcdFx0XHR0aGlzLl9kcm9wZG93bi5zaG93KCBmYWxzZSApO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSBcIkFycm93VXBcIjpcblx0XHRcdFx0dGhpcy5fcHJldmVudF9jbG9zZSA9IHRydWU7XG5cdFx0XHRcdGlmKCAhdGhpcy5fZHJvcGRvd24uaXNPcGVuKCApICkge1xuXHRcdFx0XHRcdHRoaXMuc2hvd0Ryb3BEb3duKCApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX2Ryb3Bkb3duLmdldExpc3QoKS5uYXZpZ2F0ZSgga2JOYXYucHJldiApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5fcHJldmVudF9jbG9zZSA9IGZhbHNlO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcIkFycm93RG93blwiOlxuXHRcdFx0XHR0aGlzLl9wcmV2ZW50X2Nsb3NlID0gdHJ1ZTtcblx0XHRcdFx0aWYoICF0aGlzLl9kcm9wZG93bi5pc09wZW4oICkgKSB7XG5cdFx0XHRcdFx0dGhpcy5zaG93RHJvcERvd24oICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fZHJvcGRvd24uZ2V0TGlzdCgpLm5hdmlnYXRlKCBrYk5hdi5uZXh0ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLl9wcmV2ZW50X2Nsb3NlID0gZmFsc2U7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRkZWZhdWx0OiB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRldi5wcmV2ZW50RGVmYXVsdCggKTtcblx0XHRldi5zdG9wUHJvcGFnYXRpb24oICk7XG5cdH1cblxuXHRwcml2YXRlIF9vbl9pbnB1dCggKSB7XG5cdFx0aWYoICF0aGlzLl9kcm9wZG93bi5pc09wZW4oICkgKSB7XG5cdFx0XHR0aGlzLnNob3dEcm9wRG93biggKTtcblx0XHR9XG5cblx0XHR0aGlzLl9kcm9wZG93bi5nZXRMaXN0KCkuZmlsdGVyKCB0aGlzLl9pbnB1dC5nZXRWYWx1ZSggKSApO1xuXHR9XG5cblx0cHJpdmF0ZSBfb25fZm9jdXNvdXQoICkge1xuXHRcdHRoaXMuX2Ryb3Bkb3duLnNob3coIGZhbHNlICk7XG5cdH1cblx0XG5cdHByaXZhdGUgX29uX2NsaWNrKCApIHtcblx0XHR0aGlzLnNob3dEcm9wRG93biggKTtcblx0fVxuXG5cdHNob3dEcm9wRG93biggKSB7XG5cdFx0aWYoIHRoaXMuaXNEaXNhYmxlZCgpICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHRjb25zdCByYyA9IHRoaXMuX2VkaXQuZ2V0Qm91bmRpbmdSZWN0KCApO1xuXHRcdHRoaXMuX2Ryb3Bkb3duLnNldFN0eWxlVmFsdWUoIFwid2lkdGhcIiwgcmMud2lkdGgrXCJweFwiICk7XG5cdFx0dGhpcy5fZHJvcGRvd24uZGlzcGxheU5lYXIoIHJjLCBcInRvcCBsZWZ0XCIsIFwiYm90dG9tIGxlZnRcIiwge3g6MCx5OjZ9ICk7XG5cdH1cbn1cblxuXG4iLCAiLyoqIFxuICogIF9fXyAgX19fIF9fXG4gKiAgXFwgIFxcLyAgLyAgLyBfXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xuICogICAvICAgIFxcX19fXyAgIF98ICBcbiAqICAvX18vXFxfX1xcICAgfF98XG4gKiBcbiAqIEBmaWxlIGRpYWxvZy50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBGb3JtIH0gZnJvbSBcIi4uL2Zvcm0vZm9ybS5qc1wiXG5pbXBvcnQgeyBQb3B1cEV2ZW50cywgUG9wdXBQcm9wcywgUG9wdXAgfSBmcm9tICcuLi9wb3B1cC9wb3B1cC5qcyc7XG5pbXBvcnQgeyBCdG5Hcm91cCwgQnRuR3JvdXBJdGVtIH0gZnJvbSBcIi4uL2J0bmdyb3VwL2J0bmdyb3VwXCJcbmltcG9ydCB7IEhCb3ggfSBmcm9tICcuLi9ib3hlcy9ib3hlcy5qcyc7XG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gJy4uL2xhYmVsL2xhYmVsLmpzJztcbmltcG9ydCB7IENvbXBvbmVudENvbnRlbnQsIENvbXBvbmVudEV2ZW50IH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQuanMnO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vYnV0dG9uL2J1dHRvbi5qcyc7XG5cbmltcG9ydCBcIi4vZGlhbG9nLm1vZHVsZS5zY3NzXCJcbmltcG9ydCBjbG9zZV9pY29uIGZyb20gXCIuL3htYXJrLXNoYXJwLWxpZ2h0LnN2Z1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIERpYWxvZ1Byb3BzIGV4dGVuZHMgUG9wdXBQcm9wcyB7XG5cdGljb24/OiBzdHJpbmc7XG5cdHRpdGxlOiBzdHJpbmc7XG5cdGZvcm06IEZvcm07XG5cdGJ1dHRvbnM6IEJ0bkdyb3VwSXRlbVtdO1xuXHRjbG9zYWJsZT86IGJvb2xlYW47XG59XG5cblxuZXhwb3J0IGludGVyZmFjZSBFdkJ0bkNsaWNrIGV4dGVuZHMgRXZlbnQge1xuXHRidXR0b246IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIERpYWxvZ0V2ZW50cyBleHRlbmRzIFBvcHVwRXZlbnRzIHtcblx0YnRuY2xpY2s6IEV2QnRuQ2xpY2s7XG5cdGNsb3NlOiBDb21wb25lbnRFdmVudDtcbn1cblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgY2xhc3MgRGlhbG9nPFAgZXh0ZW5kcyBEaWFsb2dQcm9wcyA9IERpYWxvZ1Byb3BzLCBFIGV4dGVuZHMgRGlhbG9nRXZlbnRzID0gRGlhbG9nRXZlbnRzPiAgZXh0ZW5kcyBQb3B1cDxQLEU+IHtcblxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IFAgKSB7XG5cdFx0c3VwZXIoIHByb3BzICk7XG5cblx0XHR0aGlzLmFwcGVuZENvbnRlbnQoIFtcblx0XHRcdG5ldyBIQm94KCB7XG5cdFx0XHRcdGNsczogXCJjYXB0aW9uXCIsXG5cdFx0XHRcdGNvbnRlbnQ6IFtcblx0XHRcdFx0XHRuZXcgTGFiZWwoIHsgXG5cdFx0XHRcdFx0XHRpZDogXCJ0aXRsZVwiLCBcblx0XHRcdFx0XHRcdGNsczogXCJjYXB0aW9uLWVsZW1lbnRcIixcblx0XHRcdFx0XHRcdGljb246IHByb3BzLmljb24sIFxuXHRcdFx0XHRcdFx0dGV4dDogcHJvcHMudGl0bGUgXG5cdFx0XHRcdFx0fSApLFxuXHRcdFx0XHRcdHByb3BzLmNsb3NhYmxlID8gbmV3IEJ1dHRvbiggeyBcblx0XHRcdFx0XHRcdGlkOiBcImNsb3NlYm94XCIsIFxuXHRcdFx0XHRcdFx0aWNvbjogY2xvc2VfaWNvbiwgXG5cdFx0XHRcdFx0XHRjbGljazogICggKSA9PiB7IHRoaXMuY2xvc2UoKSB9XG5cdFx0XHRcdFx0fSApIDogbnVsbCxcblx0XHRcdFx0XVxuXHRcdFx0fSksXG5cdFx0XHRwcm9wcy5mb3JtLFxuXHRcdFx0bmV3IEJ0bkdyb3VwKCB7XG5cdFx0XHRcdGlkOiBcImJ0bmJhclwiLFxuXHRcdFx0XHRyZXZlcnNlOiB0cnVlLFxuXHRcdFx0XHRpdGVtczogcHJvcHMuYnV0dG9ucyxcblx0XHRcdFx0YnRuY2xpY2s6ICggZXYgKSA9PiB7IHRoaXMuZmlyZSggXCJidG5jbGlja1wiLCBldiApIH1cblx0XHRcdH0pIFxuXHRcdF0pXG5cdH1cblxuXHRkaXNwbGF5KCAgKSB7XG5cdFx0c3VwZXIuZGlzcGxheUNlbnRlciggICk7XG5cdH1cblxuXHRvdmVycmlkZSBjbG9zZSggKSB7XG5cdFx0dGhpcy5maXJlKCBcImNsb3NlXCIsIHt9ICk7XG5cdFx0c3VwZXIuY2xvc2UoICk7XG5cdH1cbn1cblxuIiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSBmb3JtLnRzXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcbiAqIFxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiovXG5cbmltcG9ydCB7IEJveCB9IGZyb20gJy4uL2JveGVzL2JveGVzLmpzJztcblxuaW1wb3J0IFwiLi9mb3JtLm1vZHVsZS5zY3NzXCJcblxudHlwZSBGb3JtVmFsdWUgPSBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuO1xudHlwZSBGb3JtVmFsdWVzID0gUmVjb3JkPHN0cmluZyxGb3JtVmFsdWU+O1xuXG5leHBvcnQgY2xhc3MgRm9ybSBleHRlbmRzIEJveCB7XG5cblx0c2V0VmFsdWVzKCB2YWx1ZXM6IEZvcm1WYWx1ZXMgKSB7XG5cdFx0Y29uc3QgaXRlbXMgPSB0aGlzLnF1ZXJ5QWxsKCBcImlucHV0W25hbWVdXCIgKTtcblx0XHRjb25zb2xlLmxvZyggaXRlbXMgKTtcblx0fVxuXG5cdGdldFZhbHVlcyggKTogRm9ybVZhbHVlcyB7XG5cdFx0Y29uc3QgcmVzdWx0OiBGb3JtVmFsdWVzID0ge307XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxufVxuXG4iLCAiaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRQcm9wcyB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50LmpzJztcbmltcG9ydCB7IEhCb3ggfSBmcm9tICcuLi9ib3hlcy9ib3hlcy5qcyc7XG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gJy4uL2xhYmVsL2xhYmVsLmpzJztcbmltcG9ydCB7IENTaXplciB9IGZyb20gJy4uL3NpemVycy9zaXplci5qcyc7XG5cbmltcG9ydCBcIi4vaGVhZGVyLm1vZHVsZS5zY3NzXCJcblxuaW50ZXJmYWNlIEhlYWRlckl0ZW0ge1xuXHRuYW1lOiBzdHJpbmc7XG5cdHRpdGxlOiBzdHJpbmc7XG5cdGljb25JZD86IHN0cmluZztcblx0d2lkdGg/OiBudW1iZXI7XHQvLyA8MCBmb3IgZmxleFxufVxuXG5pbnRlcmZhY2UgSGVhZGVyUHJvcHMgZXh0ZW5kcyBPbWl0PENvbXBvbmVudFByb3BzLFwiY29udGVudFwiPiB7XG5cdGl0ZW1zOiBIZWFkZXJJdGVtW11cbn1cblxuZXhwb3J0IGNsYXNzIEhlYWRlciBleHRlbmRzIEhCb3g8SGVhZGVyUHJvcHM+IHtcblxuXHRwcml2YXRlIF9lbHM6IENvbXBvbmVudFtdO1xuXHRwcml2YXRlIF92d3A6IENvbXBvbmVudDtcblxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IEhlYWRlclByb3BzICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0dGhpcy5fZWxzID0gcHJvcHMuaXRlbXM/Lm1hcCggeCA9PiB7XG5cdFx0XHRjb25zdCBjZWxsID0gbmV3IExhYmVsKCB7IGNsczogXCJjZWxsXCIsIHRleHQ6IHgudGl0bGUsIGljb246IHguaWNvbklkIH0gKTtcblx0XHRcdGNvbnN0IHNpemVyID0gbmV3IENTaXplciggXCJyaWdodFwiICk7XG5cdFx0XHRcblx0XHRcdGlmKCB4LndpZHRoPjAgKSB7XG5cdFx0XHRcdGNlbGwuc2V0U3R5bGVWYWx1ZSggXCJ3aWR0aFwiLCB4LndpZHRoKydweCcgKTtcblx0XHRcdFx0Y2VsbC5zZXRJbnRlcm5hbERhdGEoIFwid2lkdGhcIiwgeC53aWR0aCApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggeC53aWR0aDwwICkge1xuXHRcdFx0XHRjZWxsLnNldEludGVybmFsRGF0YSggXCJmbGV4XCIsIC14LndpZHRoICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y2VsbC5zZXRJbnRlcm5hbERhdGEoIFwid2lkdGhcIiwgMCApO1xuXHRcdFx0fVxuXG5cdFx0XHRzaXplci5hZGRET01FdmVudCggXCJkYmxjbGlja1wiLCAoIGU6IE1vdXNlRXZlbnQgKSA9PiB7XG5cdFx0XHRcdGNlbGwuc2V0SW50ZXJuYWxEYXRhKCBcImZsZXhcIiwgMSApO1xuXHRcdFx0XHR0aGlzLl9jYWxjX3NpemVzKCApO1xuXHRcdFx0fSlcblxuXHRcdFx0c2l6ZXIub24oIFwicmVzaXplXCIsICggZXYgKSA9PiB7XG5cdFx0XHRcdC8vY2VsbC5zZXRTdHlsZVZhbHVlKCBcImZsZXhHcm93XCIsIFwiMFwiICk7XG5cdFx0XHRcdGNlbGwuc2V0SW50ZXJuYWxEYXRhKFwiZmxleFwiLDApO1xuXHRcdFx0XHRjZWxsLnNldEludGVybmFsRGF0YShcIndpZHRoXCIsZXYuc2l6ZSk7XG5cdFx0XHRcdHRoaXMuX2NhbGNfc2l6ZXMoICk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Y2VsbC5hcHBlbmRDb250ZW50KCBzaXplciApO1xuXHRcdFx0Y2VsbC5zZXRJbnRlcm5hbERhdGEoIFwiZGF0YVwiLCB4ICk7XG5cblx0XHRcdHJldHVybiBjZWxsO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5hZGRET01FdmVudCggXCJyZXNpemVkXCIsICggKSA9PiB0aGlzLl9vbl9yZXNpemUoKSApO1xuXHRcdHRoaXMuYWRkRE9NRXZlbnQoIFwiY3JlYXRlZFwiLCAoICkgPT4gdGhpcy5fY2FsY19zaXplcyggKSApO1xuXG5cdFx0dGhpcy5fdndwID0gbmV3IEhCb3goIHsgY29udGVudDogdGhpcy5fZWxzIH0gKTtcblx0XHR0aGlzLnNldENvbnRlbnQoICB0aGlzLl92d3AgKTtcblx0fVxuXG5cdHByaXZhdGUgX2NhbGNfc2l6ZXMoICkge1xuXG5cdFx0bGV0IGNvdW50ID0gMDtcblx0XHRsZXQgZmlsbGVkID0gMDtcblxuXHRcdHRoaXMuX2Vscy5mb3JFYWNoKCBjID0+IHtcblx0XHRcdGNvbnN0IGZsZXggPSBjLmdldEludGVybmFsRGF0YSggXCJmbGV4XCIgKTtcblx0XHRcdGlmKCBmbGV4ICkge1xuXHRcdFx0XHRjb3VudCArPSBmbGV4O1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxldCB3aWR0aCA9IGMuZ2V0SW50ZXJuYWxEYXRhKCBcIndpZHRoXCIgKTtcblx0XHRcdFx0aWYoIHdpZHRoPT0wICkge1xuXHRcdFx0XHRcdGNvbnN0IHJjID0gYy5nZXRCb3VuZGluZ1JlY3QoICk7XG5cdFx0XHRcdFx0d2lkdGggPSBNYXRoLmNlaWwoIHJjLndpZHRoICkrMjtcblx0XHRcdFx0XHRjLnNldEludGVybmFsRGF0YSggXCJ3aWR0aFwiLCB3aWR0aCApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdGZpbGxlZCArPSB3aWR0aDtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRjb25zdCByYyA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KCApO1xuXHRcdFxuXHRcdGxldCByZXN0ID0gKHJjLndpZHRoLWZpbGxlZCk7XG5cdFx0Y29uc3QgdW5pdCA9IE1hdGguY2VpbCggcmVzdC9jb3VudCApO1xuXG5cdFx0Y29uc29sZS5sb2coIFwiZmlsbGVkXCIsIGZpbGxlZCApO1xuXHRcdGNvbnNvbGUubG9nKCBcImNvdW50XCIsIGNvdW50ICk7XG5cdFx0Y29uc29sZS5sb2coIFwicmVzdFwiLCByZXN0ICk7XG5cdFx0Y29uc29sZS5sb2coIFwidW5pdFwiLCB1bml0ICk7XG5cdFx0XG5cdFx0bGV0IGZ1bGx3ID0gMDtcblx0XHR0aGlzLl9lbHMuZm9yRWFjaCggYyA9PiB7XG5cdFx0XHRsZXQgd2lkdGggPSAwO1xuXG5cdFx0XHRjb25zdCBmbGV4ID0gYy5nZXRJbnRlcm5hbERhdGEoIFwiZmxleFwiICk7XG5cdFx0XHRpZiggZmxleCApIHtcblx0XHRcdFx0d2lkdGggPSBNYXRoLm1pbiggdW5pdCpmbGV4LCByZXN0ICk7XG5cdFx0XHRcdHJlc3QgLT0gd2lkdGg7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0d2lkdGggPSBjLmdldEludGVybmFsRGF0YSggXCJ3aWR0aFwiICk7XG5cdFx0XHR9XG5cblx0XHRcdGMuc2V0V2lkdGgoIHdpZHRoICk7XG5cdFx0XHRmdWxsdyArPSB3aWR0aDtcblx0XHR9ICk7XG5cblx0XHR0aGlzLl92d3Auc2V0V2lkdGgoIGZ1bGx3ICk7XG5cdH1cblxuXHRwcml2YXRlIF9vbl9yZXNpemUoICkge1xuXHRcdHRoaXMuX2NhbGNfc2l6ZXMoICk7XG5cdH1cblxuXG59IiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSBpbWFnZS50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudFByb3BzIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQuanMnO1xuXG5pbXBvcnQgXCIuL2ltYWdlLm1vZHVsZS5zY3NzXCJcblxuZXhwb3J0IGludGVyZmFjZSBJbWFnZVByb3BzIGV4dGVuZHMgQ29tcG9uZW50UHJvcHMge1xuXHRzcmM6IHN0cmluZztcblx0Zml0PzogXCJjb250YWluXCIgfCBcImNvdmVyXCIgfCBcImZpbGxcIiB8IFwic2NhbGUtZG93blwiO1xuXHRwb3NpdGlvbj86IHN0cmluZztcblx0bGF6eT86IGJvb2xlYW47XG5cdGFsdD86IHN0cmluZztcblx0ZHJhZ2dhYmxlPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBcbiAqL1xuXG5leHBvcnQgY2xhc3MgSW1hZ2UgZXh0ZW5kcyBDb21wb25lbnQ8SW1hZ2VQcm9wcz4ge1xuXG5cdHByaXZhdGUgX2ltZzogQ29tcG9uZW50O1xuXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogSW1hZ2VQcm9wcyApIHtcblx0XHRzdXBlciggcHJvcHMgKTtcblxuXHRcdHRoaXMuX2ltZyA9IG5ldyBDb21wb25lbnQoIHtcblx0XHRcdHRhZzogXCJpbWdcIixcblx0XHRcdGF0dHJzOiB7XG5cdFx0XHRcdGxvYWRpbmc6IHByb3BzLmxhenksXG5cdFx0XHRcdGFsdDogcHJvcHMuYWx0LFxuXHRcdFx0XHRkcmFnZ2FibGU6IHByb3BzLmRyYWdnYWJsZSA/PyBmYWxzZSxcblx0XHRcdH0sXG5cdFx0XHRzdHlsZToge1xuXHRcdFx0XHR3aWR0aDogXCIxMDAlXCIsXG5cdFx0XHRcdGhlaWdodDogXCIxMDAlXCIsXG5cdFx0XHRcdG9iamVjdEZpdDogcHJvcHMuZml0LFxuXHRcdFx0XHRvYmplY3RQb3NpdGlvbjogcHJvcHMucG9zaXRpb24sXG5cdFx0XHR9XG5cdFx0fSlcblx0XHRcblx0XHR0aGlzLnNldENvbnRlbnQoIHRoaXMuX2ltZyApO1xuXHRcdHRoaXMuc2V0SW1hZ2UoIHByb3BzLnNyYyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFxuXHQgKi9cblx0XG5cdHNldEltYWdlKCBzcmM6IHN0cmluZyApIHtcblx0XHR0aGlzLl9pbWcuc2V0QXR0cmlidXRlKCBcInNyY1wiLCBzcmMgKTtcblx0fVxufSIsICJcbi8vIDo6IE1FU1NBR0VCT1ggOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcblxuaW1wb3J0IHsgX3RyIH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX2kxOG4nO1xuXG5pbXBvcnQgeyBIQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMnO1xuaW1wb3J0IHsgSWNvbiB9IGZyb20gJy4uL2ljb24vaWNvbic7XG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gJy4uL2xhYmVsL2xhYmVsJztcbmltcG9ydCB7IERpYWxvZywgRGlhbG9nUHJvcHMgfSBmcm9tIFwiLi4vZGlhbG9nL2RpYWxvZ1wiXG5cbmltcG9ydCBcIi4vbWVzc2FnZXMubW9kdWxlLnNjc3NcIjtcblxuaW1wb3J0IGVycm9yX2ljb24gZnJvbSBcIi4vY2lyY2xlLWV4Y2xhbWF0aW9uLnN2Z1wiO1xuaW1wb3J0IHsgYXNhcCwgVW5zYWZlSHRtbCB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV90b29scy5qcyc7XG5pbXBvcnQgeyBGb3JtIH0gZnJvbSAnLi4vZm9ybS9mb3JtLmpzJztcblxuZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlQm94UHJvcHMgZXh0ZW5kcyBEaWFsb2dQcm9wcyB7XG5cdG1lc3NhZ2U6IHN0cmluZztcblx0Y2xpY2s6IChidXR0b246IHN0cmluZykgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VCb3ggZXh0ZW5kcyBEaWFsb2c8RGlhbG9nUHJvcHM+XG57XG5cdG1fbGFiZWw6IExhYmVsO1xuXG5cdGNvbnN0cnVjdG9yKHByb3BzOiBEaWFsb2dQcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblx0fVxuXG5cdHNldFRleHQodHh0OiBzdHJpbmcgfCBVbnNhZmVIdG1sICkge1xuXHRcdHRoaXMubV9sYWJlbC5zZXRUZXh0KCB0eHQgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBkaXNwbGF5IGEgbWVzc2FnZWJveFxuXHQgKi9cblxuXHRzdGF0aWMgc2hvdyggbXNnOiBzdHJpbmcgfCBVbnNhZmVIdG1sICk6IE1lc3NhZ2VCb3gge1xuXG5cdFx0Y29uc3QgYm94ID0gbmV3IE1lc3NhZ2VCb3goeyBcblx0XHRcdG1vZGFsOiB0cnVlLFxuXHRcdFx0dGl0bGU6IF90ci5nbG9iYWwuZXJyb3IsXG5cdFx0XHRtb3ZhYmxlOiB0cnVlLFxuXHRcdFx0Zm9ybTogbmV3IEZvcm0oIHtcblx0XHRcdFx0Y29udGVudDogW1xuXHRcdFx0XHRcdG5ldyBIQm94KCB7XG5cdFx0XHRcdFx0XHRjb250ZW50OiBbXG5cdFx0XHRcdFx0XHRcdG5ldyBJY29uKCB7IGljb25JZDogZXJyb3JfaWNvbiB9KSxcblx0XHRcdFx0XHRcdFx0bmV3IExhYmVsKCB7IHRleHQ6IG1zZyB9ICksXG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdF1cblx0XHRcdH0pLFxuXHRcdFx0YnV0dG9uczogW1wib2tcIixcImNhbmNlbFwiXVxuXHRcdH0pO1xuXHRcblx0XHRib3gub24oIFwiYnRuY2xpY2tcIiwgKCBldiApID0+IHtcblx0XHRcdGFzYXAoICggKSA9PiBib3guY2xvc2UoKSApO1xuXHRcdH0pO1xuXG5cdFx0Ym94LmRpc3BsYXkoKTtcblx0XHRyZXR1cm4gYm94O1xuXHR9XG59IiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSBub3RpZmljYXRpb24udHNcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxuICogXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50UHJvcHMgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgeyBSZWN0LCBVbnNhZmVIdG1sIH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX3Rvb2xzLmpzJztcblxuaW1wb3J0IHsgUG9wdXAgfSBmcm9tICcuLi9wb3B1cC9wb3B1cC5qcyc7XG5pbXBvcnQgeyBIQm94LCBWQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMuanMnO1xuaW1wb3J0IHsgSWNvbiB9IGZyb20gJy4uL2ljb24vaWNvbi5qcyc7XG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gJy4uL2xhYmVsL2xhYmVsLmpzJztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4uL2J1dHRvbi9idXR0b24uanMnO1xuXG5pbXBvcnQgXCIuL25vdGlmaWNhdGlvbi5tb2R1bGUuc2Nzc1wiO1xuXG5pbXBvcnQgZGVmX2ljb24gZnJvbSBcIi4vY2lyY2xlLWNoZWNrLXNvbGlkLnN2Z1wiO1xuaW1wb3J0IGRhbmdlcl9pY29uIGZyb20gXCIuL2NpcmNsZS1leGNsYW1hdGlvbi1zb2xpZC5zdmdcIlxuaW1wb3J0IHNwaW5faWNvbiBmcm9tIFwiLi9jaXJjbGUtbm90Y2gtbGlnaHQuc3ZnXCI7XG5pbXBvcnQgY2xvc2VfaWNvbiBmcm9tIFwiLi94bWFyay1zaGFycC1saWdodC5zdmdcIjtcblxuLyoqXG4gKiBcbiAqL1xuXG5pbnRlcmZhY2UgTm90aWZpY2F0aW9uUHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XG5cdGxvYWRpbmc/OiBib29sZWFuO1xuXHRpY29uSWQ/OiBzdHJpbmc7XG5cdGNsb3NhYmxlPzogYm9vbGVhbjtcblx0bW9kZT86IFwic3VjY2Vzc1wiIHwgXCJkYW5nZXJcIjtcblxuXHR0aXRsZTogc3RyaW5nO1xuXHR0ZXh0OiBzdHJpbmcgfCBVbnNhZmVIdG1sO1xufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBjbGFzcyBOb3RpZmljYXRpb24gZXh0ZW5kcyBQb3B1cCB7XG5cdGNvbnN0cnVjdG9yKCBwcm9wczogTm90aWZpY2F0aW9uUHJvcHMgKSB7XG5cdFx0c3VwZXIoIHsgfSApO1xuXG5cdFx0bGV0IGljb24gPSBwcm9wcy5pY29uSWQ7XG5cdFx0aWYoICFpY29uICkge1xuXHRcdFx0aWYoIHByb3BzLmxvYWRpbmcgKSB7XG5cdFx0XHRcdGljb24gPSBzcGluX2ljb247XG5cdFx0XHRcdHRoaXMuYWRkQ2xhc3MoIFwiXCIpXG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCBwcm9wcy5tb2RlPT1cImRhbmdlclwiICkge1xuXHRcdFx0XHRpY29uID0gZGFuZ2VyX2ljb247XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWNvbiA9IGRlZl9pY29uO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuYWRkQ2xhc3MoIHByb3BzLm1vZGUgKTtcblxuXHRcdGNvbnN0IF9pY29uID0gbmV3IEljb24oIHsgaWNvbklkOiBpY29uIH0gKTtcblx0XHRpZiggcHJvcHMubG9hZGluZyApIHtcblx0XHRcdF9pY29uLmFkZENsYXNzKCBcInJvdGF0ZVwiICk7XG5cdFx0XHR0aGlzLnByb3BzLm1vZGFsID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR0aGlzLnNldENvbnRlbnQoIG5ldyBIQm94KCB7IFxuXHRcdFx0Y29udGVudDogW1xuXHRcdFx0XHRfaWNvbixcblx0XHRcdFx0bmV3IFZCb3goIHsgY2xzOiBcImJvZHlcIiwgY29udGVudDogWyBcblx0XHRcdFx0XHRuZXcgTGFiZWwoIHsgY2xzOiBcInRpdGxlXCIsIHRleHQ6IHByb3BzLnRpdGxlIH0gKSxcblx0XHRcdFx0XHRuZXcgTGFiZWwoIHsgY2xzOiBcInRleHRcIiwgdGV4dDogcHJvcHMudGV4dCB9ICksXG5cdFx0XHRcdF0gfSksXG5cdFx0XHRcdG5ldyBCdXR0b24oIHsgY2xzOiBcIm91dGxpbmVcIiwgaWNvbjogY2xvc2VfaWNvbiwgY2xpY2s6ICggKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5jbG9zZSggKTtcblx0XHRcdFx0fSB9IClcblx0XHRcdF1cblx0XHR9KSApO1xuXHR9XG5cblx0Y2xvc2UoICkge1xuXHRcdHRoaXMuY2xlYXJUaW1lb3V0KCBcImNsb3NlXCIgKTtcblx0XHRzdXBlci5jbG9zZSggKTtcblx0fVxuXG5cdGRpc3BsYXkoIHRpbWVfaW5fcyA9IDAgKSB7XG5cdFx0Y29uc3QgciA9IG5ldyBSZWN0KCAwLCAwLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XG5cdFx0dGhpcy5kaXNwbGF5TmVhciggciwgXCJib3R0b20gcmlnaHRcIiwgXCJib3R0b20gcmlnaHRcIiwgeyB4OiAtMjAsIHk6IC0xMCB9ICk7XG5cblx0XHRpZiggdGltZV9pbl9zICkge1xuXHRcdFx0dGhpcy5zZXRUaW1lb3V0KCBcImNsb3NlXCIsIHRpbWVfaW5fcyoxMDAwLCAoICkgPT4geyBcblx0XHRcdFx0dGhpcy5jbG9zZSgpIFxuXHRcdFx0fSApO1xuXHRcdH1cblx0fVxufVxuXG5cbiIsICIvKiogXG4gKiAgX19fICBfX18gX19cbiAqICBcXCAgXFwvICAvICAvIF9cbiAqICAgXFwgICAgLyAgL198IHxfXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxuICogIC9fXy9cXF9fXFwgICB8X3xcbiAqIFxuICogQGZpbGUgcGFuZWwudHNcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxuICogXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRDb250ZW50LCBDb21wb25lbnRQcm9wcyB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50JztcbmltcG9ydCB7IFVuc2FmZUh0bWwsIENvbnN0cnVjdG9yIH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX3Rvb2xzJztcblxuaW1wb3J0IHsgVkJveCB9IGZyb20gJy4uL2JveGVzL2JveGVzJztcbmltcG9ydCB7IExhYmVsIH0gZnJvbSAnLi4vbGFiZWwvbGFiZWwnO1xuXG5pbXBvcnQgXCIuL3BhbmVsLm1vZHVsZS5zY3NzXCI7XG5cbmludGVyZmFjZSBQYW5lbFByb3BzIGV4dGVuZHMgQ29tcG9uZW50UHJvcHMge1xuXHR0aXRsZTogc3RyaW5nO1xuXHRpY29uPzogc3RyaW5nO1xuXHRib2R5TW9kZWw/OiBDb25zdHJ1Y3RvcjxDb21wb25lbnQ+O1xufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBjbGFzcyBQYW5lbCBleHRlbmRzIFZCb3g8UGFuZWxQcm9wcz4ge1xuXG5cdHByaXZhdGUgX3RpdGxlOiBDb21wb25lbnQ7XG5cdHByaXZhdGUgX2JvZHk6IENvbXBvbmVudDtcblxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IFBhbmVsUHJvcHMgKSB7XG5cdFx0c3VwZXIoIHsgLi4ucHJvcHMsIGNvbnRlbnQ6IHVuZGVmaW5lZCB9ICk7XG5cblx0XHRjb25zdCBtb2RlbCA9IHByb3BzLmJvZHlNb2RlbCA/PyBWQm94O1xuXHRcdHN1cGVyLnNldENvbnRlbnQoIFtcblx0XHRcdHRoaXMuX3RpdGxlID0gbmV3IExhYmVsKCB7IHRhZzogXCJsZWdlbmRcIiwgdGV4dDogcHJvcHMudGl0bGUsIGljb246IHByb3BzLmljb24gfSApLFxuXHRcdFx0dGhpcy5fYm9keSAgPSBuZXcgbW9kZWwoIHsgY2xzOiBcImJvZHlcIiwgY29udGVudDogcHJvcHMuY29udGVudCB9IClcblx0XHRdICk7XG5cdH1cblxuXHRzZXRDb250ZW50KCBjb250ZW50OiBDb21wb25lbnRDb250ZW50ICkge1xuXHRcdHRoaXMuX2JvZHkuc2V0Q29udGVudCggY29udGVudCApO1xuXHR9XG5cblx0c2V0VGl0bGUoIHRpdGxlOiBzdHJpbmcgfCBVbnNhZmVIdG1sICkge1xuXHRcdHRoaXMuX3RpdGxlLnNldENvbnRlbnQoIHRpdGxlIClcblx0fVxufSIsICIvKiogXG4gKiAgX19fICBfX18gX19cbiAqICBcXCAgXFwvICAvICAvIF9cbiAqICAgXFwgICAgLyAgL198IHxfXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxuICogIC9fXy9cXF9fXFwgICB8X3xcbiAqIFxuICogQGZpbGUgcHJvZ3Jlc3MudHNcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxuICogXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRQcm9wcyB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50JztcblxuaW1wb3J0IFwiLi9wcm9ncmVzcy5tb2R1bGUuc2Nzc1wiO1xuXG5pbnRlcmZhY2UgUHJvZ3Jlc3NQcm9wcyBleHRlbmRzIENvbXBvbmVudFByb3BzIHtcblx0dmFsdWU6IG51bWJlcjtcblx0bWluOiBudW1iZXI7XG5cdG1heDogbnVtYmVyO1xufVxuXG5cbmV4cG9ydCBjbGFzcyBQcm9ncmVzcyBleHRlbmRzIENvbXBvbmVudDxQcm9ncmVzc1Byb3BzPiB7XG5cblx0cHJpdmF0ZSBfYmFyOiBDb21wb25lbnQ7XG5cblx0Y29uc3RydWN0b3IoIHByb3BzOiBQcm9ncmVzc1Byb3BzICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0dGhpcy5zZXRDb250ZW50KCB0aGlzLl9iYXI9bmV3IENvbXBvbmVudCggeyBjbHM6IFwiYmFyXCIgfSApICk7XG5cdFx0dGhpcy5zZXRWYWx1ZSggcHJvcHMudmFsdWUgKTtcblx0fVxuXG5cdHNldFZhbHVlKCB2YWx1ZTogbnVtYmVyICkge1xuXHRcdGNvbnN0IHBlcmMgPSB2YWx1ZSAvICh0aGlzLnByb3BzLm1heC10aGlzLnByb3BzLm1pbikgKiAxMDA7XG5cdFx0dGhpcy5fYmFyLnNldFN0eWxlVmFsdWUoIFwid2lkdGhcIiwgcGVyYytcIiVcIiApO1xuXHR9XG59IiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSByYXRpbmcudHNcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxuICogXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRFdmVudHMsIGNvbXBvbmVudEZyb21ET00sIENvbXBvbmVudFByb3BzLCBFdkNoYW5nZSB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50LmpzJztcbmltcG9ydCB7IEV2ZW50Q2FsbGJhY2sgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfZXZlbnRzLmpzJztcbmltcG9ydCB7IEhCb3ggfSBmcm9tICcuLi9ib3hlcy9ib3hlcy5qcyc7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gJy4uL2lucHV0L2lucHV0LmpzJztcbmltcG9ydCB7IEljb24gfSBmcm9tICcuLi9pY29uL2ljb24uanMnO1xuXG5pbXBvcnQgXCIuL3JhdGluZy5tb2R1bGUuc2Nzc1wiXG5pbXBvcnQgc3Rhcl9pY29uIGZyb20gXCIuL3N0YXItc2hhcnAtc29saWQuc3ZnXCJcblxuaW50ZXJmYWNlIFJhdGluZ0V2ZW50TWFwIGV4dGVuZHMgQ29tcG9uZW50RXZlbnRzIHtcblx0Y2hhbmdlOiBFdkNoYW5nZTtcbn1cblxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgUmF0aW5nUHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XG5cdHN0ZXBzPzogbnVtYmVyO1xuXHR2YWx1ZT86IG51bWJlcjtcblx0aWNvbj86IHN0cmluZztcblx0bmFtZT86IHN0cmluZzsgXG5cblx0Y2hhbmdlPzogRXZlbnRDYWxsYmFjazxFdkNoYW5nZT47XG59XG5cbmV4cG9ydCBjbGFzcyBSYXRpbmcgZXh0ZW5kcyBIQm94PFJhdGluZ1Byb3BzLFJhdGluZ0V2ZW50TWFwPiB7XG5cblx0cHJpdmF0ZSBtX2VsczogQ29tcG9uZW50W107XG5cdHByaXZhdGUgbV9pbnB1dDogSW5wdXQ7XG5cdFxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IFJhdGluZ1Byb3BzICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0cHJvcHMuc3RlcHMgPSBwcm9wcy5zdGVwcyA/PyA1O1xuXHRcdHRoaXMuX3VwZGF0ZSggKTtcblx0fVxuXG5cdHByaXZhdGUgX3VwZGF0ZSggKSB7XG5cdFx0XG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xuXG5cdFx0bGV0IHNoYXBlID0gcHJvcHMuaWNvbiA/PyBzdGFyX2ljb247XG5cdFx0bGV0IHZhbHVlID0gcHJvcHMudmFsdWUgPz8gMDtcblxuXHRcdHRoaXMubV9pbnB1dCA9IG5ldyBJbnB1dCgge1xuXHRcdFx0dHlwZTogXCJ0ZXh0XCIsXG5cdFx0XHRoaWRkZW46IHRydWUsXG5cdFx0XHRuYW1lOiBwcm9wcy5uYW1lLFxuXHRcdFx0dmFsdWU6ICcnK3ZhbHVlXG5cdFx0fSApO1xuXG5cdFx0dGhpcy5hZGRET01FdmVudCggJ2NsaWNrJywgKGUpID0+IHRoaXMuX29uX2NsaWNrKGUpICk7XG5cblx0XHR0aGlzLm1fZWxzID0gW107XG5cdFx0Zm9yKCBsZXQgaT0wOyBpPHByb3BzLnN0ZXBzOyBpKysgKSB7XG5cdFx0XHRcblx0XHRcdGxldCBjbHMgPSAnaXRlbSc7XG5cdFx0XHRpZiggaSsxIDw9IHZhbHVlICkge1xuXHRcdFx0XHRjbHMgKz0gJyBjaGVja2VkJztcblx0XHRcdH1cblxuXHRcdFx0bGV0IGMgPSBuZXcgSWNvbiggeyBcblx0XHRcdFx0Y2xzLFxuXHRcdFx0XHRpY29uSWQ6IHNoYXBlLFxuXHRcdFx0fSApO1xuXG5cdFx0XHRjLnNldEludGVybmFsRGF0YSggXCJ2YWx1ZVwiLCBpICk7XG5cblx0XHRcdHRoaXMubV9lbHMucHVzaCggYyApO1xuXHRcdH1cblxuXHRcdHRoaXMubV9lbHMucHVzaCggdGhpcy5tX2lucHV0ICk7XG5cdFx0dGhpcy5zZXRDb250ZW50KCB0aGlzLm1fZWxzICk7XG5cdH1cblxuXHRnZXRWYWx1ZSggKSB7XG5cdFx0cmV0dXJuIHRoaXMucHJvcHMudmFsdWUgPz8gMDtcblx0fVxuXG5cdHNldFZhbHVlKCB2OiBudW1iZXIgKSB7XG5cdFx0dGhpcy5wcm9wcy52YWx1ZSA9IHY7XG5cblx0XHRmb3IoIGxldCBjPTA7IGM8dGhpcy5wcm9wcy5zdGVwczsgYysrICkge1xuXHRcdFx0dGhpcy5tX2Vsc1tjXS5zZXRDbGFzcyggJ2NoZWNrZWQnLCB0aGlzLm1fZWxzW2NdLmdldEludGVybmFsRGF0YSgndmFsdWUnKTw9diApO1xuXHRcdH1cblxuXHRcdHRoaXMubV9pbnB1dC5zZXRWYWx1ZSggJycrdGhpcy5wcm9wcy52YWx1ZSApO1xuXHR9XG5cblx0c2V0U3RlcHMoIG46IG51bWJlciApIHtcblx0XHR0aGlzLnByb3BzLnN0ZXBzID0gbjtcblx0XHR0aGlzLl91cGRhdGUoICk7XG5cdH1cblxuXHRzZXRTaGFwZSggaWNvbjogc3RyaW5nICkge1xuXHRcdHRoaXMucmVtb3ZlQ2xhc3MoIHRoaXMucHJvcHMuaWNvbiApO1xuXHRcdHRoaXMucHJvcHMuaWNvbiA9IGljb247XG5cdH1cblxuXHRwcml2YXRlIF9vbl9jbGljayggZXY6IE1vdXNlRXZlbnQgKSB7XG5cdFx0bGV0IGl0ZW0gPSBjb21wb25lbnRGcm9tRE9NKCBldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQgKTtcblx0XHRpdGVtID0gaXRlbS5wYXJlbnRFbGVtZW50KCBJY29uICk7XG5cdFx0XG5cdFx0aWYoIGl0ZW0gKSB7XG5cdFx0XHR0aGlzLnNldFZhbHVlKCBpdGVtLmdldEludGVybmFsRGF0YShcInZhbHVlXCIpICk7XG5cdFx0fVxuXG5cdFx0dGhpcy5maXJlKCAnY2hhbmdlJywge3ZhbHVlOnRoaXMucHJvcHMudmFsdWV9ICk7XG5cdH0gXG59XG4iLCAiLyoqIFxuICogIF9fXyAgX19fIF9fXG4gKiAgXFwgIFxcLyAgLyAgLyBfXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xuICogICAvICAgIFxcX19fXyAgIF98ICBcbiAqICAvX18vXFxfX1xcICAgfF98XG4gKiBcbiAqIEBmaWxlIHNsaWRlci50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudEV2ZW50cywgQ29tcG9uZW50UHJvcHMsIENvbXBvbmVudEV2ZW50IH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgUmVjdCB9IGZyb20gJy4uLy4uL2NvcmUvY29yZV90b29scy5qcyc7XG5cbmltcG9ydCB7IEhCb3ggfSBmcm9tICcuLi9ib3hlcy9ib3hlcyc7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gJy4uL2lucHV0L2lucHV0LmpzJztcblxuaW1wb3J0ICcuL3NsaWRlci5tb2R1bGUuc2Nzcyc7XG5cbmludGVyZmFjZSBDaGFuZ2VFdmVudCBleHRlbmRzIENvbXBvbmVudEV2ZW50IHtcblx0dmFsdWU6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIFNsaWRlckV2ZW50cyBleHRlbmRzIENvbXBvbmVudEV2ZW50cyB7XG5cdGNoYW5nZTogQ2hhbmdlRXZlbnQ7XG59XG5cbmludGVyZmFjZSBTbGlkZXJQcm9wcyBleHRlbmRzIENvbXBvbmVudFByb3BzIHtcblx0dmFsdWU6IG51bWJlcjtcblx0bWluOiBudW1iZXI7XG5cdG1heDogbnVtYmVyO1xuXHRzdGVwPzogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgU2xpZGVyIGV4dGVuZHMgQ29tcG9uZW50PFNsaWRlclByb3BzLFNsaWRlckV2ZW50cz4ge1xuXG5cdHByaXZhdGUgX21kb3duID0gZmFsc2U7XG5cdHByaXZhdGUgX2lyZWN0OiBSZWN0ID0gbnVsbDtcblx0cHJpdmF0ZSBfdGh1bWI6IENvbXBvbmVudCA9IG51bGw7XG5cdHByaXZhdGUgX2JhcjogQ29tcG9uZW50ID0gbnVsbDtcblx0cHJpdmF0ZSBfcmFuZ2U6IElucHV0ID0gbnVsbDtcblxuXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogU2xpZGVyUHJvcHMgKSB7XG5cdFx0c3VwZXIoIHByb3BzICk7XG5cblx0XHR0aGlzLnNldENvbnRlbnQoIFtcblx0XHRcdG5ldyBIQm94KCB7IGNsczogXCJ0cmFja1wiLCBjb250ZW50OiBbXG5cdFx0XHRcdHRoaXMuX2JhciA9IG5ldyBDb21wb25lbnQoIHsgY2xzOiBcImJhclwiIH0gKSxcblx0XHRcdFx0dGhpcy5fdGh1bWIgPSBuZXcgQ29tcG9uZW50KCB7IGNsczogXCJ0aHVtYlwiIH0gKSxcblx0XHRcdF0gfSksXG5cdFx0XHR0aGlzLl9yYW5nZSA9IG5ldyBJbnB1dCggeyB0eXBlOiBcInJhbmdlXCIsIGhpZGRlbjogdHJ1ZSwgdmFsdWU6IHByb3BzLnZhbHVlLCBtaW46IHByb3BzLm1pbiwgbWF4OiBwcm9wcy5tYXgsIHN0ZXA6IHByb3BzLnN0ZXAgfSApXG5cdFx0XSk7XG5cblx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJ0YWJpbmRleFwiLCAwICk7XG5cblx0XHR0aGlzLnNldERPTUV2ZW50cygge1xuXHRcdFx0cG9pbnRlcmRvd246ICggZXYgKSA9PiB0aGlzLl9vbl9tb3VzZWRvd24oIGV2ICksXG5cdFx0XHRwb2ludGVybW92ZTogKCBldiApID0+IHRoaXMuX29uX21vdXNlbW92ZSggZXYgKSxcblx0XHRcdHBvaW50ZXJ1cDogKCBldiApID0+IHRoaXMuX29uX21vdXNldXAoIGV2ICksXG5cdFx0XHRrZXlkb3duOiAoIGV2ICkgPT4gdGhpcy5fb25fa2V5KCBldiApLFxuXHRcdH0gKTtcblxuXHRcdHRoaXMuX3JhbmdlLmFkZERPTUV2ZW50KCBcImNoYW5nZVwiLCAoIGV2OiBFdmVudCkgPT4ge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyggZXYgKTtcblx0XHR9KVxuXHR9XG5cblx0cHJpdmF0ZSBfb25fbW91c2Vkb3duKCBldjogUG9pbnRlckV2ZW50ICkge1xuXHRcdGV2LnN0b3BQcm9wYWdhdGlvbiggKTtcblx0XHRldi5wcmV2ZW50RGVmYXVsdCggKTtcblxuXHRcdHRoaXMuZm9jdXMoICk7XG5cblx0XHR0aGlzLl9tZG93biA9IHRydWU7XG5cdFx0dGhpcy5faXJlY3QgPSB0aGlzLmdldEJvdW5kaW5nUmVjdCggKTtcblxuXHRcdHRoaXMuc2V0Q2FwdHVyZSggZXYucG9pbnRlcklkICk7XG5cdH1cblxuXHRwcml2YXRlIF9vbl9tb3VzZW1vdmUoIGV2OiBQb2ludGVyRXZlbnQgKSB7XG5cdFx0aWYoIHRoaXMuX21kb3duICkge1xuXHRcdFx0bGV0IHBvcyA9IGV2LnBhZ2VYIC0gdGhpcy5faXJlY3QubGVmdDtcblx0XHRcdGlmKCBwb3M8MCApIHtcblx0XHRcdFx0cG9zID0gMDtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoIHBvcz50aGlzLl9pcmVjdC53aWR0aCApIHtcblx0XHRcdFx0cG9zID0gdGhpcy5faXJlY3Qud2lkdGg7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBwZXJjID0gcG9zIC8gdGhpcy5faXJlY3Qud2lkdGggKiAxMDA7XG5cdFx0XHR0aGlzLl9yYW5nZS5zZXROdW1WYWx1ZSggcGVyYyApO1xuXHRcdFx0XG5cdFx0XHR0aGlzLl91cGRhdGUoICk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfdXBkYXRlKCApIHtcblx0XHRjb25zdCB2YWx1ZSA9IHRoaXMuX3JhbmdlLmdldE51bVZhbHVlKCApO1xuXG5cdFx0Y29uc3QgcGVyYyA9IHZhbHVlIC8gKHRoaXMucHJvcHMubWF4LXRoaXMucHJvcHMubWluKSAqIDEwMDtcblx0XHR0aGlzLl90aHVtYi5zZXRTdHlsZVZhbHVlKCBcImxlZnRcIiwgcGVyYytcIiVcIiApO1xuXHRcdHRoaXMuX2Jhci5zZXRTdHlsZVZhbHVlKCBcIndpZHRoXCIsIHBlcmMrXCIlXCIgKTtcblx0XHQvL3RodW1iLnNldEF0dHJpYnV0ZSggXCJ0b29sdGlwXCIsIHZhbHVlICk7XG5cblx0XHR0aGlzLmZpcmUoIFwiY2hhbmdlXCIsIHsgdmFsdWUgfSApO1xuXHR9XG5cblx0cHJpdmF0ZSBfb25fbW91c2V1cCggZXY6IFBvaW50ZXJFdmVudCApIHtcblx0XHRpZiggdGhpcy5fbWRvd24gKSB7XG5cdFx0XHR0aGlzLnJlbGVhc2VDYXB0dXJlKCBldi5wb2ludGVySWQgKTtcblx0XHRcdHRoaXMuX21kb3duID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfb25fa2V5KCBldjogS2V5Ym9hcmRFdmVudCApIHtcblx0XHRjb25zb2xlLmxvZyggZXYua2V5ICk7XG5cblx0XHRsZXQgc3RwID0gdGhpcy5wcm9wcy5zdGVwID8/IDE7XG5cdFx0bGV0IGluYyA9IDA7XG5cdFx0c3dpdGNoKCBldi5rZXkgKSB7XG5cdFx0XHRjYXNlIFwiQXJyb3dSaWdodFwiOlxuXHRcdFx0Y2FzZSBcIkFycm93VXBcIjogaW5jID0gc3RwOyBicmVhaztcblxuXHRcdFx0Y2FzZSBcIkFycm93TGVmdFwiOlxuXHRcdFx0Y2FzZSBcIkFycm93RG93blwiOiBpbmMgPSAtc3RwOyBicmVhaztcblx0XHR9XG5cblx0XHRpZiggaW5jICkge1xuXHRcdFx0aWYoIGV2LmN0cmxLZXkgKSB7XG5cdFx0XHRcdGluYyAqPSAxMDtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fcmFuZ2Uuc2V0TnVtVmFsdWUoIHRoaXMuX3JhbmdlLmdldE51bVZhbHVlKCkraW5jICk7XG5cdFx0XHR0aGlzLl91cGRhdGUoICk7XG5cdFx0fVxuXHR9XG59IiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSBzd2l0Y2gudHNcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxuICogXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRQcm9wcywgbWFrZVVuaXF1ZUNvbXBvbmVudElkIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQnO1xuXG4vL2ltcG9ydCB7IENoZWNrYm94IH0gZnJvbSAnQGNvbnRyb2xzL2NvbnRyb2xzLmpzJztcbmltcG9ydCB7IElucHV0IH0gZnJvbSAnLi4vaW5wdXQvaW5wdXQnO1xuaW1wb3J0IHsgTGFiZWwgfSBmcm9tICcuLi9sYWJlbC9sYWJlbCc7XG5pbXBvcnQgeyBIQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMuanMnO1xuXG5pbXBvcnQgXCIuL3N3aXRjaC5tb2R1bGUuc2Nzc1wiO1xuXG5pbnRlcmZhY2UgU3dpdGNoUHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XG5cdGxhYmVsOiBzdHJpbmc7XG5cdGNoZWNrZWQ/OiBib29sZWFuO1xuXHR2YWx1ZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFN3aXRjaCBleHRlbmRzIEhCb3g8U3dpdGNoUHJvcHM+IHtcblx0Y29uc3RydWN0b3IocHJvcHM6IFN3aXRjaFByb3BzICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0Y29uc3QgaW5wdXRJZCA9IG1ha2VVbmlxdWVDb21wb25lbnRJZCggKTtcblxuXHRcdHRoaXMuc2V0Q29udGVudCggW1xuXHRcdFx0bmV3IENvbXBvbmVudCgge1xuXHRcdFx0XHRjbHM6IFwic3dpdGNoXCIsXG5cdFx0XHRcdGNvbnRlbnQ6IFtcblx0XHRcdFx0XHRuZXcgSW5wdXQoIHsgdHlwZTogXCJjaGVja2JveFwiLCBpZDogaW5wdXRJZCwgY2hlY2tlZDogcHJvcHMuY2hlY2tlZCB9ICksXG5cdFx0XHRcdFx0bmV3IENvbXBvbmVudCggeyBjbHM6IFwidHJhY2tcIiB9ICksXG5cdFx0XHRcdFx0bmV3IENvbXBvbmVudCggeyBjbHM6IFwidGh1bWJcIiB9ICksXG5cdFx0XHRcdF1cblx0IFx0XHR9ICksXG5cdFx0XHRuZXcgTGFiZWwoIHtcblx0XHRcdFx0dGFnOiBcImxhYmVsXCIsXG5cdFx0XHRcdHRleHQ6IHByb3BzLmxhYmVsLFxuXHRcdFx0XHRsYWJlbEZvcjogaW5wdXRJZCxcblx0XHRcdH0pLFxuXHRcdF0pXG5cblx0XHRcblx0fVxufSIsICIvKiogXG4gKiAgX19fICBfX18gX19cbiAqICBcXCAgXFwvICAvICAvIF9cbiAqICAgXFwgICAgLyAgL198IHxfXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxuICogIC9fXy9cXF9fXFwgICB8X3xcbiAqIFxuICogQGZpbGUgdGFicy50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRFdmVudHMsIENvbXBvbmVudFByb3BzLCBFdkNsaWNrIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29yZUV2ZW50IH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX2V2ZW50cyc7XG5cbmltcG9ydCB7IEJ1dHRvbiwgQnV0dG9uUHJvcHMgfSBmcm9tICcuLi9idXR0b24vYnV0dG9uJztcbmltcG9ydCB7IEhCb3gsIFZCb3gsIFN0YWNrQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMnO1xuXG5pbXBvcnQgXCIuL3RhYnMubW9kdWxlLnNjc3NcIlxuXG4vKipcbiAqIFxuICovXG5cblxuZXhwb3J0IGludGVyZmFjZSBUYWJJdGVtIHtcblx0bmFtZTogc3RyaW5nO1xuXHR0aXRsZTogc3RyaW5nO1xuXHRpY29uPzogc3RyaW5nO1xuXHR0YWI6IENvbXBvbmVudDtcbn1cblxuXG5jbGFzcyBDVGFiIGV4dGVuZHMgQnV0dG9uIHtcblx0Y29uc3RydWN0b3IoIHByb3BzOiBCdXR0b25Qcm9wcywgaXRlbTogVGFiSXRlbSApIHtcblx0XHRzdXBlciggcHJvcHMgKTtcblxuXHRcdHRoaXMuYWRkQ2xhc3MoIFwib3V0bGluZVwiICk7XG5cdFx0dGhpcy5zZXRJY29uKCBpdGVtLmljb24gKTtcblx0XHR0aGlzLnNldFRleHQoIGl0ZW0udGl0bGUgKTtcblx0XHR0aGlzLnNldERhdGEoIFwidGFibmFtZVwiLCBpdGVtLm5hbWUgKTtcblx0fVxufVxuXG4vKipcbiAqIFxuICovXG5cbmludGVyZmFjZSBUYWJsaXN0Q2xpY2tFdmVudCBleHRlbmRzIENvcmVFdmVudCB7XG5cdG5hbWU6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFRhYmxpc3RQcm9wcyBleHRlbmRzIENvbXBvbmVudFByb3BzIHtcblx0Y2xpY2s6ICggZXY6IFRhYmxpc3RDbGlja0V2ZW50ICkgPT4gdm9pZDtcbn1cblxuaW50ZXJmYWNlIFRhYmxpc3RFdmVudHMgZXh0ZW5kcyBDb21wb25lbnRFdmVudHMge1xuXHRjbGljazogVGFibGlzdENsaWNrRXZlbnQ7XG59XG5cbi8qKlxuICogYmFyIGNvbnRhaW5pbmcgYnV0dG9uc1xuICovXG5jbGFzcyBDVGFiTGlzdCBleHRlbmRzIEhCb3g8VGFibGlzdFByb3BzLFRhYmxpc3RFdmVudHM+IHtcblxuXHRwcml2YXRlIF9zZWxpdGVtOiBCdXR0b247XG5cdHByaXZhdGUgX3NlbGVjdGlvbjogc3RyaW5nO1xuXHRcblx0Y29uc3RydWN0b3IoIHByb3BzOiBUYWJsaXN0UHJvcHMsIGNvbnRlbnQ6IFRhYkl0ZW1bXSApIHtcblx0XHRzdXBlciggcHJvcHMgKTtcblxuXHRcdGNvbnN0IHRhYnMgPSBjb250ZW50Lm1hcCggdGFiID0+IHtcblx0XHRcdHJldHVybiBuZXcgQ1RhYigge1xuXHRcdFx0XHRjbGljazogKCBldiApID0+IHRoaXMuX29uX2NsaWNrKCBldiApLFxuXHRcdFx0fSwgdGFiICk7XG5cdFx0fSlcblxuXHRcdHRoaXMubWFwUHJvcEV2ZW50cyggcHJvcHMsIFwiY2xpY2tcIiApO1xuXHRcdHRoaXMuc2V0Q29udGVudCggdGFicyApO1xuXHR9XG5cblx0cHJpdmF0ZSBfb25fY2xpY2soIGV2OiBFdkNsaWNrICkge1xuXHRcdGNvbnN0IG5hbWUgPSAoZXYuc291cmNlIGFzIENvbXBvbmVudCkuZ2V0RGF0YSggXCJ0YWJuYW1lXCIgKTtcblx0XHR0aGlzLmZpcmUoIFwiY2xpY2tcIiwge25hbWV9ICk7XG5cdH1cblxuXHRzZWxlY3QoIG5hbWU6IHN0cmluZyApIHtcblx0XHRjb25zdCB0YWIgPSB0aGlzLnF1ZXJ5PEJ1dHRvbj4oIGBbZGF0YS10YWJuYW1lPVwiJHtuYW1lfVwiXWAgKTtcblx0XHRpZiggdGhpcy5fc2VsaXRlbSApIHtcblx0XHRcdHRoaXMuX3NlbGl0ZW0uc2V0Q2xhc3MoIFwic2VsZWN0ZWRcIiwgZmFsc2UgKTtcblx0XHR9XG5cblx0XHR0aGlzLl9zZWxpdGVtID0gdGFiO1xuXHRcdHRoaXMuX3NlbGVjdGlvbiA9IG5hbWU7XG5cdFx0XG5cdFx0aWYoIHRoaXMuX3NlbGl0ZW0gKSB7XG5cdFx0XHR0aGlzLl9zZWxpdGVtLnNldENsYXNzKCBcInNlbGVjdGVkXCIsIHRydWUgKTtcblx0XHR9XG5cdH1cbn1cblxuXG4vKipcbiAqIFxuICovXG5cbmludGVyZmFjZSBUYWJzUHJvcHMgZXh0ZW5kcyBPbWl0PENvbXBvbmVudFByb3BzLFwiY29udGVudFwiPiB7XG5cdGRlZmF1bHQ6IHN0cmluZztcblx0aXRlbXM6IFRhYkl0ZW1bXVxufVxuXG5cbmV4cG9ydCBjbGFzcyBUYWJzIGV4dGVuZHMgVkJveDxUYWJzUHJvcHM+IHtcblxuXHRwcml2YXRlIF9saXN0OiBDVGFiTGlzdDtcblx0cHJpdmF0ZSBfc3RhY2s6IFN0YWNrQm94O1xuXG5cdGNvbnN0cnVjdG9yKCBwcm9wczogVGFic1Byb3BzICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0Y29uc3QgcGFnZXMgPSBwcm9wcy5pdGVtcz8ubWFwKCB4ID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG5hbWU6IHgubmFtZSxcblx0XHRcdFx0Y29udGVudDogeC50YWIgLFxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdFxuXHRcdHRoaXMuc2V0Q29udGVudCggW1xuXHRcdFx0dGhpcy5fbGlzdCA9IG5ldyBDVGFiTGlzdCggeyBcblx0XHRcdFx0Y2xpY2s6ICggZXYgKSA9PiB0aGlzLl9vbmNsaWNrKCBldiApIH0sIFxuXHRcdFx0XHRwcm9wcy5pdGVtcyBcblx0XHRcdCksXG5cdFx0XHR0aGlzLl9zdGFjayA9IG5ldyBTdGFja0JveCggeyBcblx0XHRcdFx0Y2xzOiBcImJvZHkgeDRmbGV4XCIsIFxuXHRcdFx0XHRkZWZhdWx0OiBwcm9wcy5kZWZhdWx0LFxuXHRcdFx0XHRpdGVtczogcGFnZXMsICBcblx0XHRcdH0gKSxcblx0XHRdKTtcblxuXHRcdGlmKCBwcm9wcy5kZWZhdWx0ICkge1xuXHRcdFx0dGhpcy5zZWxlY3RUYWIoIHByb3BzLmRlZmF1bHQgKTtcblx0XHR9XG5cdH1cblxuXHRzZWxlY3RUYWIoIG5hbWU6IHN0cmluZyApIHtcblx0XHR0aGlzLl9saXN0LnNlbGVjdCggbmFtZSApO1xuXHRcdHRoaXMuX3N0YWNrLnNlbGVjdCggbmFtZSApO1xuXHR9XG5cblx0cHJpdmF0ZSBfb25jbGljayggZXY6IFRhYmxpc3RDbGlja0V2ZW50ICkge1xuXHRcdHRoaXMuc2VsZWN0VGFiKCBldi5uYW1lICk7XG5cdH1cbn1cblxuIiwgIi8qKiBcbiAqICBfX18gIF9fXyBfX1xuICogIFxcICBcXC8gIC8gIC8gX1xuICogICBcXCAgICAvICAvX3wgfF9cbiAqICAgLyAgICBcXF9fX18gICBffCAgXG4gKiAgL19fL1xcX19cXCAgIHxffFxuICogXG4gKiBAZmlsZSB0ZXh0YXJlYS50c1xuICogQGF1dGhvciBFdGllbm5lIENvY2hhcmQgXG4gKiBcbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgUi1saWJyZSBpbmdlbmllcmllXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0IGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICoqL1xuXG5pbXBvcnQgeyBCYXNlUHJvcHMgfSBmcm9tICcuLi9pbnB1dC9pbnB1dCc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudCc7XG5cbmltcG9ydCB7IExhYmVsIH0gZnJvbSAnLi4vbGFiZWwvbGFiZWwnO1xuaW1wb3J0IHsgVkJveCB9IGZyb20gJy4uL2JveGVzL2JveGVzJztcblxuaW1wb3J0IFwiLi90ZXh0YXJlYS5tb2R1bGUuc2Nzc1wiO1xuXG4vKipcbiAqIFxuICovXG5cbmludGVyZmFjZSBUZXh0QXJlYVByb3BzIGV4dGVuZHMgQmFzZVByb3BzIHtcblx0bGFiZWw/OiBzdHJpbmc7XG5cdHZhbHVlPzogc3RyaW5nO1xuXHRyZXNpemU/OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgVGV4dEFyZWEgZXh0ZW5kcyBWQm94IHtcblx0XG5cdHByaXZhdGUgX2lucHV0OiBDb21wb25lbnQ7XG5cblx0Y29uc3RydWN0b3IoIHByb3BzOiBUZXh0QXJlYVByb3BzICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0dGhpcy5zZXRDb250ZW50KCBbXG5cdFx0XHRuZXcgTGFiZWwoIHsgdGV4dDogcHJvcHMubGFiZWwgfSksXG5cdFx0XHR0aGlzLl9pbnB1dCA9IG5ldyBDb21wb25lbnQoIHsgdGFnOiBcInRleHRhcmVhXCIgfSlcblx0XHRdKVxuXG5cdFx0dGhpcy5faW5wdXQuc2V0QXR0cmlidXRlKCBcIm5hbWVcIiwgcHJvcHMubmFtZSApO1xuXHRcdHRoaXMuX2lucHV0LnNldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiLCBwcm9wcy52YWx1ZSsnJyApO1xuXG5cdFx0aWYoICFwcm9wcy5yZXNpemUgKSB7XG5cdFx0XHR0aGlzLl9pbnB1dC5zZXRBdHRyaWJ1dGUoIFwicmVzaXplXCIsIGZhbHNlICk7XG5cdFx0fVxuXHR9XG59XG4iLCAiLyoqIFxuICogIF9fXyAgX19fIF9fXG4gKiAgXFwgIFxcLyAgLyAgLyBfXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xuICogICAvICAgIFxcX19fXyAgIF98ICBcbiAqICAvX18vXFxfX1xcICAgfF98XG4gKiBcbiAqIEBmaWxlIHRleHRlZGl0LnRzXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcbiAqIFxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50UHJvcHMsIG1ha2VVbmlxdWVDb21wb25lbnRJZCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50JztcbmltcG9ydCB7IFVuc2FmZUh0bWwgfSBmcm9tICcuLi8uLi9jb3JlL2NvcmVfdG9vbHMnO1xuXG5pbXBvcnQgeyBIQm94IH0gZnJvbSAnLi4vYm94ZXMvYm94ZXMnO1xuaW1wb3J0IHsgSW5wdXQsIFRleHRJbnB1dFByb3BzIH0gZnJvbSBcIi4uL2lucHV0L2lucHV0XCJcbmltcG9ydCB7IExhYmVsIH0gZnJvbSAnLi4vbGFiZWwvbGFiZWwnO1xuXG5pbXBvcnQgXCIuL3RleHRlZGl0Lm1vZHVsZS5zY3NzXCI7XG5cbi8vQHRvZG86IGRpc2FibGVkXG5cbi8qKlxuICogXG4gKi9cblxuaW50ZXJmYWNlIFRleHRFZGl0UHJvcHMgZXh0ZW5kcyBDb21wb25lbnRQcm9wcyB7XG5cdGxhYmVsOiBzdHJpbmcgfCBVbnNhZmVIdG1sO1xuXHRsYWJlbFdpZHRoPzogbnVtYmVyO1xuXHRpbnB1dElkPzogc3RyaW5nO1xuXG5cdHR5cGU/OiBcInRleHRcIiB8IFwiZW1haWxcIiB8IFwicGFzc3dvcmRcIjtcblx0cmVhZG9ubHk/OiBib29sZWFuO1xuXHRyZXF1aXJlZD86IGJvb2xlYW47XG5cdHZhbHVlOiBzdHJpbmcgfCBudW1iZXI7XG5cdHBsYWNlaG9sZGVyPzogc3RyaW5nO1xuXG5cdGlucHV0R2FkZ2V0cz86IENvbXBvbmVudFtdO1xufVxuXG4vKipcbiAqIFxuICovXG5cbmV4cG9ydCBjbGFzcyBUZXh0RWRpdCBleHRlbmRzIEhCb3gge1xuXHRjb25zdHJ1Y3RvciggcHJvcHM6IFRleHRFZGl0UHJvcHMgKSB7XG5cdFx0c3VwZXIoIHByb3BzICk7XG5cblx0XHRpZiggIXByb3BzLmlucHV0SWQgKSB7XG5cdFx0XHRwcm9wcy5pbnB1dElkID0gbWFrZVVuaXF1ZUNvbXBvbmVudElkKClcblx0XHR9XG5cblx0XHRpZiggcHJvcHMucmVxdWlyZWQgKSB7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJyZXF1aXJlZFwiLCB0cnVlICk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ2FkZ2V0cyA9IHByb3BzLmlucHV0R2FkZ2V0cyA/PyBbXTtcblxuXHRcdHRoaXMuc2V0Q29udGVudCggW1xuXHRcdFx0bmV3IEhCb3goIHsgaWQ6IFwibGFiZWxcIiwgd2lkdGg6IHByb3BzLmxhYmVsV2lkdGgsIGNvbnRlbnQ6IFtcblx0XHRcdFx0bmV3IExhYmVsKCB7IHRhZzogXCJsYWJlbFwiLCB0ZXh0OiBwcm9wcy5sYWJlbCwgbGFiZWxGb3I6IHByb3BzLmlucHV0SWQgfSApLFxuXHRcdFx0XX0pLFxuXHRcdFx0bmV3IEhCb3goIHsgaWQ6IFwiZWRpdFwiLCBjb250ZW50OiBbXG5cdFx0XHRcdG5ldyBJbnB1dCggeyBcblx0XHRcdFx0XHR0eXBlOiBwcm9wcy50eXBlID8/IFwidGV4dFwiLCBcblx0XHRcdFx0XHRyZWFkb25seTogcHJvcHMucmVhZG9ubHksIFxuXHRcdFx0XHRcdHZhbHVlOiBwcm9wcy52YWx1ZSwgXG5cdFx0XHRcdFx0aWQ6IHByb3BzLmlucHV0SWQsIFxuXHRcdFx0XHRcdHJlcXVpcmVkOiBwcm9wcy5yZXF1aXJlZCwgXG5cdFx0XHRcdFx0ZGlzYWJsZWQ6IHByb3BzLmRpc2FibGVkLCBcblx0XHRcdFx0XHRwbGFjZWhvbGRlcjogcHJvcHMucGxhY2Vob2xkZXIgXG5cdFx0XHRcdH0gKSxcblx0XHRcdFx0Li4uZ2FkZ2V0cyxcblx0XHRcdF19KVxuXHRcdF0pXG5cdH1cbn1cbiIsICIvKiogXG4gKiAgX19fICBfX18gX19cbiAqICBcXCAgXFwvICAvICAvIF9cbiAqICAgXFwgICAgLyAgL198IHxfXG4gKiAgIC8gICAgXFxfX19fICAgX3wgIFxuICogIC9fXy9cXF9fXFwgICB8X3xcbiAqIFxuICogQGZpbGUgdG9vbHRpcHMudHNcbiAqIEBhdXRob3IgRXRpZW5uZSBDb2NoYXJkIFxuICogXG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IFItbGlicmUgaW5nZW5pZXJpZVxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIFxuICogdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdCBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCB3cmFwRE9NIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgUG9pbnQsIFJlY3QsIFRpbWVyLCBVbnNhZmVIdG1sLCB1bnNhZmVIdG1sIH0gZnJvbSAnLi4vLi4vY29yZS9jb3JlX3Rvb2xzJztcblxuaW1wb3J0IHsgSEJveCB9IGZyb20gJy4uL2JveGVzL2JveGVzJztcbmltcG9ydCB7IFBvcHVwLCBQb3B1cFByb3BzIH0gZnJvbSAnLi4vcG9wdXAvcG9wdXAuanMnO1xuaW1wb3J0IHsgSWNvbiB9IGZyb20gJy4uL2ljb24vaWNvbi5qcyc7XG5cbmltcG9ydCBcIi4vdG9vbHRpcHMuc2Nzc1wiXG5cbmltcG9ydCBpY29uIGZyb20gXCIuL2NpcmNsZS1pbmZvLXNoYXJwLWxpZ2h0LnN2Z1wiXG5cblxubGV0IGxhc3RfaGl0OiBIVE1MRWxlbWVudCA9IG51bGw7XG5sZXQgdG9vbHRpcDogVG9vbHRpcCA9IG51bGw7XG5cbmNvbnN0IHRpbWVyID0gbmV3IFRpbWVyKCApO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFRvb2x0aXBzKCApIHtcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCBcIm1vdXNlZW50ZXJcIiwgKCBldjogTW91c2VFdmVudCApID0+IHtcblx0XHRpZiggZXYudGFyZ2V0PT09ZG9jdW1lbnQgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFxuXHRcdGNvbnN0IGMgPSB3cmFwRE9NKCBldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQgKTtcblx0XHRjb25zdCB0dCA9IGMuZ2V0QXR0cmlidXRlKCBcInRvb2x0aXBcIiApO1xuXHRcdGlmKCB0dCApIHtcblx0XHRcdGxhc3RfaGl0ID0gZXYudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXHRcdFx0Y29uc3QgcmMgPSBjLmdldEJvdW5kaW5nUmVjdCggKTtcblx0XHRcdHNob3dUVCggdHQsIHJjLCB7IHg6ZXYucGFnZVgseTpldi5wYWdlWSB9ICk7XG5cdFx0fVxuXG5cdH0sIHRydWUgKTtcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCBcIm1vdXNlbGVhdmVcIiwgKCBldjogRXZlbnQgKSA9PiB7XG5cdFx0Ly9jb25zb2xlLmxvZyggXCJsZWF2ZVwiLCBldi50YXJnZXQgKTtcblxuXHRcdGlmKCBsYXN0X2hpdCAmJiBldi50YXJnZXQ9PWxhc3RfaGl0ICkge1xuXHRcdFx0bGFzdF9oaXQgPSBudWxsO1xuXHRcdFx0Y2xvc2VUVCggKTtcblx0XHR9XG5cblx0fSwgdHJ1ZSApO1xufVxuXG5mdW5jdGlvbiBzaG93VFQoIHRleHQ6IHN0cmluZywgcmM6IFJlY3QsIHB0OiBQb2ludCApIHtcblx0aWYoICF0b29sdGlwICkge1xuXHRcdHRvb2x0aXAgPSBuZXcgVG9vbHRpcCggeyB9ICk7XG5cdH1cblxuXHR0aW1lci5zZXRUaW1lb3V0KCBudWxsLCAzMDAsICggKSA9PiB7XG5cdFx0dG9vbHRpcC5zZXRUZXh0KCB1bnNhZmVIdG1sKHRleHQpICk7XG5cdFx0Ly90b29sdGlwLmRpc3BsYXlOZWFyKCByYywgXCJ0b3AgbGVmdFwiLCBcImJvdHRvbSBsZWZ0XCIsIHt4OjAseTo0fSApO1xuXHRcdHRvb2x0aXAuZGlzcGxheUF0KCBwdC54LCBwdC55ICk7XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gY2xvc2VUVCggKSB7XG5cdHRvb2x0aXAuc2hvdyggZmFsc2UgKTtcblx0dGltZXIuY2xlYXJUaW1lb3V0KCBudWxsICk7XG59XG5cbi8qKlxuICogXG4gKi9cblxuY2xhc3MgVG9vbHRpcCBleHRlbmRzIFBvcHVwIHtcblxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IFBvcHVwUHJvcHMgKSB7XG5cdFx0c3VwZXIoIHByb3BzICk7XG5cblx0XHR0aGlzLnNldENvbnRlbnQoIFxuXHRcdFx0bmV3IEhCb3goIHtjb250ZW50OiBbXG5cdFx0XHRcdG5ldyBJY29uKCB7IGljb25JZDogaWNvbiB9ICksXG5cdFx0XHRcdG5ldyBDb21wb25lbnQoIHsgaWQ6IFwidGV4dFwiIH0gKVxuXHRcdFx0XX0gKVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXG5cdHNldFRleHQoIHRleHQ6IHN0cmluZ3xVbnNhZmVIdG1sIClcdHtcblx0XHR0aGlzLnF1ZXJ5KCBcIiN0ZXh0XCIgKS5zZXRDb250ZW50KCB0ZXh0ICk7XG5cdH1cbn0iLCAiLyoqIFxuICogIF9fXyAgX19fIF9fXG4gKiAgXFwgIFxcLyAgLyAgLyBfXG4gKiAgIFxcICAgIC8gIC9ffCB8X1xuICogICAvICAgIFxcX19fXyAgIF98ICBcbiAqICAvX18vXFxfX1xcICAgfF98XG4gKiBcbiAqIEBmaWxlIHRyZWV2aWV3LnRzXG4gKiBAYXV0aG9yIEV0aWVubmUgQ29jaGFyZCBcbiAqIFxuICogQGNvcHlyaWdodCAoYykgMjAyNCBSLWxpYnJlIGluZ2VuaWVyaWVcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSBcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXQgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50RXZlbnQsIENvbXBvbmVudEV2ZW50cywgQ29tcG9uZW50UHJvcHMsIGNvbXBvbmVudEZyb21ET00gfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudCc7XG5cbmltcG9ydCB7IExhYmVsIH0gZnJvbSAnLi4vbGFiZWwvbGFiZWwnO1xuaW1wb3J0IHsgTGlzdGJveElELCBMaXN0SXRlbSwga2JOYXYgfSBmcm9tICcuLi9saXN0Ym94L2xpc3Rib3gnO1xuaW1wb3J0IHsgQm94LCBCb3hQcm9wcywgSEJveCwgVkJveCB9IGZyb20gJy4uL2JveGVzL2JveGVzJztcbmltcG9ydCB7IEljb24gfSBmcm9tICcuLi9pY29uL2ljb24uanMnO1xuXG5pbXBvcnQgXCIuL3RyZWV2aWV3Lm1vZHVsZS5zY3NzXCI7XG5pbXBvcnQgZm9sZGVyX2ljb24gZnJvbSBcIi4vY2hldnJvbi1kb3duLWxpZ2h0LnN2Z1wiXG5cbi8vaW1wb3J0IGZvbGRlcl9jbG9zZWQgZnJvbSBcIi4vZm9sZGVyLW1pbnVzLWxpZ2h0LnN2Z1wiXG5cbmV4cG9ydCBlbnVtIGtiVHJlZU5hdiB7XG5cdGZpcnN0LFxuXHRwcmV2LFxuXHRuZXh0LFxuXHRsYXN0LFxuXHRcblx0cGFyZW50LFxuXHRjaGlsZCxcblxuXHRleHBhbmQsXG5cdGNvbGxhcHNlLFxuXHR0b2dnbGUsXG59XG5cblxuZXhwb3J0IGludGVyZmFjZSBUcmVlSXRlbSBleHRlbmRzIExpc3RJdGVtIHtcblx0Y2hpbGRyZW4/OiBUcmVlSXRlbVtdO1xuXHRvcGVuPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFRyZWV2aWV3UHJvcHMgZXh0ZW5kcyBPbWl0PENvbXBvbmVudFByb3BzLFwiY29udGVudFwiPiB7XG5cdGl0ZW1zOiBUcmVlSXRlbVtdO1xufVxuXG5pbnRlcmZhY2UgQ2hhbmdlRXZlbnQgZXh0ZW5kcyBDb21wb25lbnRFdmVudCB7XG5cdHNlbGVjdGlvbjogVHJlZUl0ZW07XG59XG5cbmludGVyZmFjZSBUcmVldmlld0V2ZW50cyBleHRlbmRzIENvbXBvbmVudEV2ZW50cyB7XG5cdGNoYW5nZTogQ2hhbmdlRXZlbnQ7XG59XG5cbmNsYXNzIENUcmVlVmlld0l0ZW0gZXh0ZW5kcyBCb3gge1xuXG5cdHByaXZhdGUgX2l0ZW06IFRyZWVJdGVtO1xuXHRwcml2YXRlIF9sYWJlbDogQ29tcG9uZW50O1xuXHRwcml2YXRlIF9pY29uOiBJY29uO1xuXHRwcml2YXRlIF9jaGlsZHM6IENvbXBvbmVudDtcblxuXHRjb25zdHJ1Y3RvciggcHJvcHM6IEJveFByb3BzLCBpdGVtOiBUcmVlSXRlbSApIHtcblx0XHRzdXBlciggeyAuLi5wcm9wcyB9ICk7XG5cblx0XHR0aGlzLl9pdGVtID0gaXRlbTtcblxuXHRcdGlmKCBpdGVtICkge1xuXHRcdFx0dGhpcy5fbGFiZWwgPSBuZXcgSEJveCgge2NsczpcImxhYmVsIGl0ZW1cIiwgY29udGVudDogW1xuXHRcdFx0XHR0aGlzLl9pY29uID0gbmV3IEljb24oIHsgaWNvbklkOiBpdGVtLmNoaWxkcmVuPyBmb2xkZXJfaWNvbiA6IGl0ZW0uaWNvbklkIH0gKSxcblx0XHRcdFx0bmV3IExhYmVsKCB7IHRhZzogXCJzcGFuXCIsIGNsczogXCJcIiwgdGV4dDogaXRlbS50ZXh0IH0gKSxcblx0XHRcdF19KTtcblxuXHRcdFx0dGhpcy5fbGFiZWwuc2V0RGF0YSggXCJpZFwiLCBpdGVtLmlkK1wiXCIgKTtcblx0XHRcdFx0XG5cdFx0XHRpZiggaXRlbS5jaGlsZHJlbiApIHtcblx0XHRcdFx0dGhpcy4gX2NoaWxkcyA9IG5ldyBWQm94KCB7IGNsczogXCJib2R5XCIgfSApO1xuXG5cdFx0XHRcdGlmKCBpdGVtLm9wZW49PT11bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0aXRlbS5vcGVuID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLmFkZENsYXNzKCBcImZvbGRlclwiIClcblx0XHRcdFx0dGhpcy5zZXRDbGFzcyggXCJvcGVuXCIsIGl0ZW0ub3BlbiApO1xuXHRcdFx0XHR0aGlzLnNldEl0ZW1zKCBpdGVtLmNoaWxkcmVuICk7XG5cblx0XHRcdFx0dGhpcy5faWNvbi5hZGRET01FdmVudCggXCJjbGlja1wiLCAoIGV2ICk9PnRoaXMudG9nZ2xlKGV2KSApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuIF9jaGlsZHMgPSBuZXcgVkJveCggeyBjbHM6IFwiYm9keVwiIH0gKTtcblx0XHR9XG5cdFx0XG5cdFx0dGhpcy5zZXRDb250ZW50KCBbXG5cdFx0XHR0aGlzLl9sYWJlbCxcblx0XHRcdHRoaXMuX2NoaWxkcyxcblx0XHRdICk7XG5cdH1cblxuXHR0b2dnbGUoIGV2PzogVUlFdmVudCApIHtcblx0XHRcblx0XHRjb25zdCBpc09wZW4gPSB0aGlzLmhhc0NsYXNzKFwib3BlblwiKTtcblx0XHR0aGlzLm9wZW4oICFpc09wZW4gKTtcblxuXHRcdGlmKCBldiApIHtcblx0XHRcdGV2LnN0b3BQcm9wYWdhdGlvbiggKTtcblx0XHR9XG5cdH1cblxuXHRvcGVuKCBvcGVuID0gdHJ1ZSApIHtcblx0XHR0aGlzLnNldENsYXNzKCBcIm9wZW5cIiwgb3BlbiApO1xuXHRcdHRoaXMuX2l0ZW0ub3BlbiA9IG9wZW47XG5cdH1cblxuXHRzZXRJdGVtcyggaXRlbXM6IFRyZWVJdGVtWyBdICkge1xuXHRcdGlmKCBpdGVtcyApIHtcblx0XHRcdGNvbnN0IGNoaWxkcyA9IGl0ZW1zLm1hcCggaXRtID0+IHtcblx0XHRcdFx0cmV0dXJuIG5ldyBDVHJlZVZpZXdJdGVtKCB7fSwgaXRtICk7XG5cdFx0XHR9KVxuXHRcdFx0dGhpcy5fY2hpbGRzLnNldENvbnRlbnQoIGNoaWxkcyApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuX2NoaWxkcy5jbGVhckNvbnRlbnQoICk7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogXG4gKi9cblxuZXhwb3J0IGNsYXNzIFRyZWV2aWV3IGV4dGVuZHMgQ29tcG9uZW50PFRyZWV2aWV3UHJvcHMsVHJlZXZpZXdFdmVudHM+IHtcblx0cHJpdmF0ZSBfc2VsZWN0aW9uOiBMaXN0Ym94SUQ7XG5cdHByaXZhdGUgX3NlbGl0ZW06IENvbXBvbmVudDtcblx0cHJpdmF0ZSBfaXRlbXM6IFRyZWVJdGVtW107XG5cblx0Y29uc3RydWN0b3IoIHByb3BzOiBUcmVldmlld1Byb3BzICkge1xuXHRcdHN1cGVyKCBwcm9wcyApO1xuXG5cdFx0aWYoIHByb3BzLml0ZW1zICkge1xuXHRcdFx0dGhpcy5zZXRJdGVtcyggcHJvcHMuaXRlbXMgKTtcblx0XHR9XG5cblx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJ0YWJpbmRleFwiLCAwICk7XG5cdFx0dGhpcy5zZXRET01FdmVudHMoIHtcblx0XHRcdGNsaWNrOiAoIGV2ICkgPT4gdGhpcy5fb25jbGljayggZXYgKSxcblx0XHRcdGtleWRvd246ICggZXYgKSA9PiB0aGlzLl9vbmtleSggZXYgKSxcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0c2V0SXRlbXMoIGl0ZW1zOiBUcmVlSXRlbVsgXSApIHtcblx0XHR0aGlzLl9pdGVtcyA9IGl0ZW1zO1xuXG5cdFx0Y29uc3Qgcm9vdCA9IG5ldyBDVHJlZVZpZXdJdGVtKCB7IGNsczogXCJyb290XCJ9LCBudWxsICk7XG5cdFx0cm9vdC5zZXRJdGVtcyggaXRlbXMgKTtcblx0XHR0aGlzLnNldENvbnRlbnQoIHJvb3QgKTtcblx0fVxuXG5cdHByaXZhdGUgX29uY2xpY2soIGV2OiBVSUV2ZW50ICkge1xuXHRcdGxldCB0YXJnZXQgPSBldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0d2hpbGUoIHRhcmdldCAmJiB0YXJnZXQhPXRoaXMuZG9tICkge1xuXHRcdFx0Y29uc3QgYyA9IGNvbXBvbmVudEZyb21ET00oIHRhcmdldCApO1xuXHRcdFx0XG5cdFx0XHRpZiggYyAmJiBjLmhhc0NsYXNzKFwiaXRlbVwiKSApIHtcblx0XHRcdFx0Y29uc3QgaWQgPSBjLmdldERhdGEoIFwiaWRcIiApO1xuXHRcdFx0XHR0aGlzLl9zZWxlY3RJdGVtKCBpZCwgYyApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRhcmdldCA9IHRhcmdldC5wYXJlbnRFbGVtZW50O1xuXHRcdH1cblxuXHRcdHRoaXMuY2xlYXJTZWxlY3Rpb24oICk7XG5cdH1cblxuXHRwcml2YXRlIF9vbmtleSggZXY6IEtleWJvYXJkRXZlbnQgKSB7XG5cdFx0c3dpdGNoKCBldi5rZXkgKSB7XG5cdFx0XHRjYXNlIFwiQXJyb3dEb3duXCI6IHtcblx0XHRcdFx0dGhpcy5uYXZpZ2F0ZSgga2JUcmVlTmF2Lm5leHQgKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgXCJBcnJvd1VwXCI6IHtcblx0XHRcdFx0dGhpcy5uYXZpZ2F0ZSgga2JUcmVlTmF2LnByZXYgKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgXCJIb21lXCI6IHtcblx0XHRcdFx0dGhpcy5uYXZpZ2F0ZSgga2JUcmVlTmF2LmZpcnN0ICk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIFwiRW5kXCI6IHtcblx0XHRcdFx0dGhpcy5uYXZpZ2F0ZSgga2JUcmVlTmF2Lmxhc3QgKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgXCJBcnJvd1JpZ2h0XCI6e1xuXHRcdFx0XHR0aGlzLm5hdmlnYXRlKCBrYlRyZWVOYXYuY2hpbGQgKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgXCIrXCI6IHtcblx0XHRcdFx0dGhpcy5uYXZpZ2F0ZSgga2JUcmVlTmF2LmV4cGFuZCApO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSBcIkFycm93TGVmdFwiOiB7XG5cdFx0XHRcdHRoaXMubmF2aWdhdGUoIGtiVHJlZU5hdi5wYXJlbnQgKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGNhc2UgXCItXCI6IHtcblx0XHRcdFx0dGhpcy5uYXZpZ2F0ZSgga2JUcmVlTmF2LmNvbGxhcHNlICk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRcblx0XHRcdGNhc2UgJyAnOiB7XG5cdFx0XHRcdHRoaXMubmF2aWdhdGUoIGtiVHJlZU5hdi50b2dnbGUgKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnNvbGUubG9nKCBldi5rZXkgKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGV2LnByZXZlbnREZWZhdWx0KCApO1xuXHRcdGV2LnN0b3BQcm9wYWdhdGlvbiggKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBcblx0ICovXG5cblx0bmF2aWdhdGUoIHNlbnM6IGtiVHJlZU5hdiApIHtcblxuXHRcdGlmKCAhdGhpcy5faXRlbXMgfHwgdGhpcy5faXRlbXMubGVuZ3RoPT0wICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHRpZiggIXRoaXMuX3NlbGl0ZW0gKSB7XG5cdFx0XHRpZiggc2Vucz09a2JUcmVlTmF2Lm5leHQgfHwgc2Vucz09a2JUcmVlTmF2LnBhcmVudCApIHNlbnMgPSBrYlRyZWVOYXYuZmlyc3Q7XG5cdFx0XHRlbHNlIGlmKCBzZW5zPT1rYlRyZWVOYXYucHJldiApIHNlbnMgPSBrYlRyZWVOYXYubGFzdDtcblx0XHRcdGVsc2UgcmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHAgPSB0aGlzLl9zZWxpdGVtPy5wYXJlbnRFbGVtZW50PENUcmVlVmlld0l0ZW0+KCApO1xuXHRcdGNvbnN0IGlzRm9sZGVyID0gcD8uaGFzQ2xhc3MoXCJmb2xkZXJcIik7XG5cblx0XHRpZiggcCAmJiBzZW5zPT1rYlRyZWVOYXYucGFyZW50ICYmIGlzRm9sZGVyICYmIHAuaGFzQ2xhc3MoXCJvcGVuXCIpICkge1xuXHRcdFx0c2VucyA9IGtiVHJlZU5hdi5jb2xsYXBzZTtcblx0XHR9XG5cdFx0ZWxzZSBpZiggc2Vucz09a2JUcmVlTmF2LmNoaWxkICkge1xuXHRcdFx0aWYoIGlzRm9sZGVyKSB7XG5cdFx0XHRcdGlmKCAhcC5oYXNDbGFzcyhcIm9wZW5cIikgKSB7XG5cdFx0XHRcdFx0c2VucyA9IGtiVHJlZU5hdi5leHBhbmQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0c2VucyA9IGtiVHJlZU5hdi5uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2VucyA9IGtiVHJlZU5hdi5uZXh0O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKCBzZW5zPT1rYlRyZWVOYXYuZXhwYW5kIHx8IHNlbnM9PWtiVHJlZU5hdi5jb2xsYXBzZSB8fCBzZW5zPT1rYlRyZWVOYXYudG9nZ2xlICkge1xuXHRcdFx0aWYoIGlzRm9sZGVyICkge1xuXHRcdFx0XHRpZiggc2Vucz09a2JUcmVlTmF2LnRvZ2dsZSApIHtcblx0XHRcdFx0XHRwLnRvZ2dsZSggKTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRwLm9wZW4oIHNlbnM9PWtiVHJlZU5hdi5leHBhbmQgKTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGNvbnN0IGFsbCA9IHRoaXMuX2ZsYXR0ZW5PcGVuSXRlbXMoICk7XG5cdFx0XHRsZXQgY3VyID0gYWxsLmZpbmRJbmRleCggeCA9PiB0aGlzLl9zZWxlY3Rpb249PXguaWQgKTtcblxuXHRcdFx0bGV0IG5ld1NlbDogTGlzdGJveElEO1xuXHRcdFx0XG5cdFx0XHRpZiggc2Vucz09a2JUcmVlTmF2LmZpcnN0ICkge1xuXHRcdFx0XHRuZXdTZWwgPSBhbGxbMF0uaWQ7XG5cdFx0XHR9IFxuXHRcdFx0ZWxzZSBpZiggc2Vucz09a2JUcmVlTmF2Lmxhc3QgKSB7XG5cdFx0XHRcdG5ld1NlbCA9IGFsbFthbGwubGVuZ3RoLTFdLmlkO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggY3VyPj0wICkge1xuXHRcdFx0XHRpZiggc2Vucz09a2JUcmVlTmF2LnByZXYgKSB7XG5cdFx0XHRcdFx0aWYoIGN1cj4wICkge1xuXHRcdFx0XHRcdFx0bmV3U2VsID0gYWxsW2N1ci0xXS5pZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiggc2Vucz09a2JUcmVlTmF2Lm5leHQgKSB7XG5cdFx0XHRcdFx0aWYoIGN1cjxhbGwubGVuZ3RoLTEgKSB7XG5cdFx0XHRcdFx0XHRuZXdTZWwgPSBhbGxbY3VyKzFdLmlkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCBzZW5zPT1rYlRyZWVOYXYucGFyZW50ICkge1xuXG5cdFx0XHRcdFx0Y29uc3QgY2xldmVsID0gYWxsW2N1cl0ubGV2ZWw7XG5cdFx0XHRcdFx0d2hpbGUoIGN1cj4wICkge1xuXHRcdFx0XHRcdFx0Y3VyLS07XG5cdFx0XHRcdFx0XHRpZiggYWxsW2N1cl0ubGV2ZWw8Y2xldmVsICkge1xuXHRcdFx0XHRcdFx0XHRuZXdTZWwgPSBhbGxbY3VyXS5pZDtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmKCBuZXdTZWwgKSB7XG5cdFx0XHRcdGNvbnN0IG5zZWwgPSB0aGlzLnF1ZXJ5KCBgW2RhdGEtaWQ9XCIke25ld1NlbH1cIl1gKVxuXHRcdFx0XHR0aGlzLl9zZWxlY3RJdGVtKCBuZXdTZWwsIG5zZWwgKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHByaXZhdGUgX2ZsYXR0ZW5PcGVuSXRlbXMoICkge1xuXHRcdGxldCBhbGw6IHsgaWQ6IExpc3Rib3hJRCwgbGV2ZWw6IG51bWJlciB9W10gPSBbXTtcblx0XHRcblx0XHRjb25zdCBidWlsZCA9ICggeDogVHJlZUl0ZW0sIGxldmVsOiBudW1iZXIgKSA9PiB7XG5cdFx0XHRhbGwucHVzaCgge2lkOiB4LmlkK1wiXCIsIGxldmVsIH0gKTtcblx0XHRcdGlmKCB4LmNoaWxkcmVuICYmIHgub3BlbiApIHtcblx0XHRcdFx0eC5jaGlsZHJlbi5mb3JFYWNoKCB5ID0+IGJ1aWxkKCB5LCBsZXZlbCsxICkgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9pdGVtcy5mb3JFYWNoKCB5ID0+IGJ1aWxkKCB5LCAwICkgKTtcblx0XHRyZXR1cm4gYWxsO1xuXHR9XG5cblx0cHJpdmF0ZSBfZmxhdHRlbkl0ZW1zKCApIHtcblx0XHRsZXQgYWxsOiBUcmVlSXRlbVtdID0gW107XG5cdFx0XG5cdFx0Y29uc3QgYnVpbGQgPSAoIHg6IFRyZWVJdGVtICkgPT4ge1xuXHRcdFx0YWxsLnB1c2goIHggKTtcblx0XHRcdGlmKCB4LmNoaWxkcmVuICkge1xuXHRcdFx0XHR4LmNoaWxkcmVuLmZvckVhY2goIHkgPT4gYnVpbGQoeSkgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9pdGVtcy5mb3JFYWNoKCB5ID0+IGJ1aWxkKCB5ICkgKTtcblx0XHRyZXR1cm4gYWxsO1xuXHR9XG5cblx0cHJpdmF0ZSBfc2VsZWN0SXRlbSggaWQ6IExpc3Rib3hJRCwgaXRlbTogQ29tcG9uZW50ICkge1xuXHRcdGlmKCB0aGlzLl9zZWxpdGVtICkge1xuXHRcdFx0dGhpcy5fc2VsaXRlbS5yZW1vdmVDbGFzcyggXCJzZWxlY3RlZFwiICk7XG5cdFx0XHR0aGlzLl9zZWxpdGVtID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHRoaXMuX3NlbGl0ZW0gPSBpdGVtO1xuXHRcdHRoaXMuX3NlbGVjdGlvbiA9IGlkO1xuXG5cdFx0aWYoIGl0ZW0gKSB7XG5cdFx0XHRpdGVtLmFkZENsYXNzKCBcInNlbGVjdGVkXCIgKTtcblx0XHRcdGl0ZW0uc2Nyb2xsSW50b1ZpZXcoIHtcblx0XHRcdFx0YmVoYXZpb3I6IFwic21vb3RoXCIsXG5cdFx0XHRcdGJsb2NrOiBcIm5lYXJlc3RcIlxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGNvbnN0IGl0bSA9IHRoaXMuX2ZpbmRJdGVtKCBpZCApO1xuXHRcdHRoaXMuZmlyZSggXCJjaGFuZ2VcIiwgeyBzZWxlY3Rpb246IGl0bSB9ICk7XG5cdH1cblxuXHRwcml2YXRlIF9maW5kSXRlbSggaWQ6IExpc3Rib3hJRCApIHtcblx0XHRjb25zdCBhbGwgPSB0aGlzLl9mbGF0dGVuSXRlbXMoICk7XG5cdFx0cmV0dXJuIGFsbC5maW5kKCB4ID0+IHguaWQ9PWlkICk7XG5cdH1cblxuXHQvKipcblx0ICogXG5cdCAqL1xuXHRcblx0Y2xlYXJTZWxlY3Rpb24oICkge1xuXHRcdGlmKCB0aGlzLl9zZWxpdGVtICkge1xuXHRcdFx0dGhpcy5fc2VsaXRlbS5yZW1vdmVDbGFzcyggXCJzZWxlY3RlZFwiICk7XG5cdFx0XHR0aGlzLl9zZWxpdGVtID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHRoaXMuX3NlbGVjdGlvbiA9IHVuZGVmaW5lZDtcblx0XHR0aGlzLmZpcmUoIFwiY2hhbmdlXCIsIHsgc2VsZWN0aW9uOiB1bmRlZmluZWQgfSApO1xuXHR9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7OztBQTRCQSxJQUFNLFdBQVcsT0FBUSxNQUFPO0FBRWhDLElBQUksWUFBcUMsQ0FDekM7QUFZTyxTQUFTLGVBQWdCLE1BQWMsTUFBZTtBQUN6RCxZQUFVLElBQUksSUFBSTtBQUFBLElBQ2Q7QUFBQSxJ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QUFNLEtBQUssVUFBVyxFQUFHO0FBQy9CLFNBQUssS0FBTSxVQUFVLEVBQUUsV0FBVyxJQUFJLENBQUU7QUFBQSxFQUN6QztBQUFBLEVBRVEsVUFBVyxJQUFnQjtBQUNsQyxVQUFNLE1BQU0sS0FBSyxjQUFlO0FBQ2hDLFdBQU8sSUFBSSxLQUFNLE9BQUssRUFBRSxNQUFJLEVBQUc7QUFBQSxFQUNoQztBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTUEsaUJBQWtCO0FBQ2pCLFFBQUksS0FBSyxVQUFXO0FBQ25CLFdBQUssU0FBUyxZQUFhLFVBQVc7QUFDdEMsV0FBSyxXQUFXO0FBQUEsSUFDakI7QUFFQSxTQUFLLGFBQWE7QUFDbEIsU0FBSyxLQUFNLFVBQVUsRUFBRSxXQUFXLE9BQVUsQ0FBRTtBQUFBLEVBQy9DO0FBQ0Q7QUExUXNFO0FBQS9ELElBQU0sV0FBTjsiLAogICJuYW1lcyI6IFsidmFsdWUiLCAiZW4iLCAiaWR4IiwgImR0ZSIsICJrYk5hdiIsICJyYyIsICJJbWFnZSIsICJ4bWFya19zaGFycF9saWdodF9kZWZhdWx0IiwgImtiVHJlZU5hdiJdCn0K
